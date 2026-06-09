
import { useState,useEffect,createContext,useContext } from 'react';
import { supabase } from '../lib/supabaseClient';
const AuthContext=createContext(null);
export function AuthProvider({children}){
 const [user,setUser]=useState(null); const [userProfile,setUserProfile]=useState(null); const [loading,setLoading]=useState(true);
 useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser(); setUser(user); setUserProfile(user); setLoading(false);})();
 const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>{setUser(s?.user??null);setUserProfile(s?.user??null);setLoading(false);});
 return ()=>subscription.unsubscribe();},[]);
 const signIn=()=>supabase.auth.signInWithOAuth({provider:'google'});
 const logout=()=>supabase.auth.signOut();
 return <AuthContext.Provider value={{user,userProfile,loading,signIn,logout}}>{children}</AuthContext.Provider>;
}
export const useUserAuth=()=>useContext(AuthContext);
