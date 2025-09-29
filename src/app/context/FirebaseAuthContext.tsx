'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set persistence to local so user stays signed in
setPersistence(auth, browserLocalPersistence);

const FirebaseAuthContext = createContext(null);

export function useFirebaseAuth() {
  return useContext(FirebaseAuthContext);
}

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Firebase auth context initializing...');
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Firebase auth state changed:', { firebaseUser: !!firebaseUser, email: firebaseUser?.email });
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
  const signup = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);
  const loginWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());

  return (
    <FirebaseAuthContext.Provider value={{ user, loading, login, signup, logout, loginWithGoogle }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
} 