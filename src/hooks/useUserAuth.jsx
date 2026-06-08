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

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch user profile from Firestore
        const profile = await fetchOrCreateProfile(firebaseUser);
        setUserProfile(profile);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const fetchOrCreateProfile = async (firebaseUser) => {
    const ref = doc(db, 'users', firebaseUser.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { uid: firebaseUser.uid, ...snap.data() };
    }
    // New user — create a pending profile
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
