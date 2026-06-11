
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setUserProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Profile load error:', error);
        setProfileError(error.message);
      }
      
      // If profile doesn't exist, create one with auth metadata
      if (!data && !error) {
        const session = await supabase.auth.getSession();
        const metadata = session?.data?.session?.user?.user_metadata;
        
        const newProfile = {
          id: userId,
          email: session?.data?.session?.user?.email,
          full_name: metadata?.full_name || metadata?.name || null,
          avatar_url: metadata?.avatar_url || metadata?.picture || null,
          role: null,
          roles: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        const { data: createdData, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();
        
        if (createError) {
          console.error('Profile create error:', createError);
        }
        
        setUserProfile(createdData || newProfile);
      } else {
        // If profile exists but full_name is empty, update it from auth metadata
        if (data && !data.full_name) {
          const session = await supabase.auth.getSession();
          const metadata = session?.data?.session?.user?.user_metadata;
          
          if (metadata?.full_name || metadata?.name) {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ 
                full_name: metadata.full_name || metadata.name,
                avatar_url: metadata.avatar_url || metadata.picture || data.avatar_url,
                updated_at: new Date().toISOString()
              })
              .eq('id', userId);
            
            if (!updateError) {
              setUserProfile({ ...data, full_name: metadata.full_name || metadata.name });
            } else {
              setUserProfile(data);
            }
          } else {
            setUserProfile(data);
          }
        } else {
          setUserProfile(data);
        }
      }
    } catch (e) {
      console.error('Profile load exception:', e);
      setProfileError(e.message);
    }
    setLoading(false);
  };

  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setUserProfile(null);
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await loadUserProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, profileError, signIn, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useUserAuth = () => useContext(AuthContext);
