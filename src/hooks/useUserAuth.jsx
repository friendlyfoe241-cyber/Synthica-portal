import { useState, useEffect, createContext, useContext } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, FIREBASE_CONFIGURED } from '../lib/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    if (!FIREBASE_CONFIGURED) {
      setLoading(false);
      return;
    }

    // Safety net: if Firebase hasn't responded in 8s, unblock the UI
    const timeout = setTimeout(() => {
      console.warn('Firebase auth timed out — unblocking UI');
      setLoading(false);
    }, 8000);

    let unsubscribe;
    try {
      unsubscribe = onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          clearTimeout(timeout);
          if (firebaseUser?.uid) {
            setUser(firebaseUser);
            try {
              const profile = await fetchOrCreateProfile(firebaseUser);
              setUserProfile(profile);
            } catch (err) {
              console.error('Firestore profile error:', err.code, err.message);
              setProfileError(err.code || err.message);
              // Still set a minimal in-memory profile so the dashboard can render
              setUserProfile({
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName,
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL,
                role: 'pending',
              });
            }
          } else {
            setUser(null);
            setUserProfile(null);
            setProfileError(null);
          }
          setLoading(false);
        },
        (err) => {
          console.error('Firebase Auth error:', err.code, err.message);
          clearTimeout(timeout);
          setLoading(false);
        }
      );
    } catch (err) {
      console.error('Firebase init error:', err);
      clearTimeout(timeout);
      setLoading(false);
    }

    return () => {
      clearTimeout(timeout);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const fetchOrCreateProfile = async (firebaseUser) => {
    if (!firebaseUser) {
      throw new Error('No firebase user');
    }

    if (!firebaseUser.uid) {
      throw new Error('Missing user uid');
    }

    if (!auth.currentUser) {
      throw new Error('Auth not ready');
    }

    const ref = doc(db, 'users', firebaseUser.uid);

    const snap = await getDoc(ref);

    if (snap.exists()) {
      return {
        uid: firebaseUser.uid,
        ...snap.data()
      };
    }

    const newProfile = {
      displayName:
        firebaseUser.displayName || 'Unnamed',

      email:
        firebaseUser.email || '',

      photoURL:
        firebaseUser.photoURL || '',

      role: 'pending',

      createdAt:
        serverTimestamp(),
    };

    await setDoc(ref, newProfile);

    return {
      uid: firebaseUser.uid,
      ...newProfile,
    };
  };

  const signInWithGoogle = async () => {
    if (!FIREBASE_CONFIGURED) throw new Error('Firebase not configured');
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  };

  const logout = async () => {
    if (!FIREBASE_CONFIGURED) return;
    await signOut(auth);
  };

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) setUserProfile({ uid: user.uid, ...snap.data() });
    } catch (err) {
      console.error('refreshProfile error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user, userProfile, loading, profileError,
      signInWithGoogle, logout, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useUserAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useUserAuth must be used within AuthProvider');
  return ctx;
}
