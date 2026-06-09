import { useState, useEffect, createContext, useContext } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider, FIREBASE_CONFIGURED } from '../lib/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!FIREBASE_CONFIGURED) {
      setLoading(false);
      return;
    }

    // Safety timeout — if Firebase hasn't responded in 6s, unblock the UI.
    // This happens when the domain isn't in Firebase's Authorized Domains list.
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 6000);

    let unsubscribe;
    try {
      unsubscribe = onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          clearTimeout(timeout);
          try {
            if (firebaseUser) {
              setUser(firebaseUser);
              const profile = await fetchOrCreateProfile(firebaseUser);
              setUserProfile(profile);
            } else {
              setUser(null);
              setUserProfile(null);
            }
          } catch (e) {
            console.error('Profile fetch error:', e);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          // Auth error (e.g. domain not authorized)
          console.error('Firebase Auth error:', error);
          clearTimeout(timeout);
          setLoading(false);
        }
      );
    } catch (e) {
      console.error('Firebase init error:', e);
      clearTimeout(timeout);
      setLoading(false);
    }

    return () => {
      clearTimeout(timeout);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const fetchOrCreateProfile = async (firebaseUser) => {
    const ref = doc(db, 'users', firebaseUser.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { uid: firebaseUser.uid, ...snap.data() };
    }
    const newProfile = {
      displayName: firebaseUser.displayName || 'Unnamed',
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL || '',
      role: 'pending',
      createdAt: serverTimestamp(),
    };
    await setDoc(ref, newProfile);
    return { uid: firebaseUser.uid, ...newProfile };
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
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setUserProfile({ uid: user.uid, ...snap.data() });
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signInWithGoogle, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useUserAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useUserAuth must be used within AuthProvider');
  return ctx;
}
