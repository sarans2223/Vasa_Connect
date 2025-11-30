
'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { initializeFirebase } from './index'; 
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

// 1. Define the shape of our context
interface FirebaseContextValue {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

// 2. Create the context with an 'undefined' default value
const FirebaseContext = createContext<FirebaseContextValue | undefined>(undefined);

// 3. Define the props for our provider component
interface FirebaseProviderProps {
  children: ReactNode;
}

/**
 * The core Firebase provider. It initializes Firebase services via `initializeFirebase`
 * and makes them available to all descendant components. This component ensures that
 * the initialization happens only once.
 */
export function FirebaseProvider({ children }: FirebaseProviderProps) {
  // useMemo ensures that Firebase is initialized only once per client session.
  const firebaseContextValue = useMemo(() => {
    // The initializeFirebase function will only run in the browser
    // because this entire component is a descendant of a 'use client' component.
    return initializeFirebase();
  }, []);

  return (
    <FirebaseContext.Provider value={firebaseContextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
}

// 4. Create the custom hooks to access the context values

/**
 * Custom hook to access the entire Firebase context.
 * Throws an error if used outside of a FirebaseProvider.
 */
export function useFirebase(): FirebaseContextValue {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  return context;
}

/**
 * Custom hook to access the Firebase Auth instance.
 */
export function useAuth(): Auth {
  const { auth } = useFirebase();
  return auth;
}

/**
 * Custom hook to access the Firestore instance.
 */
export function useFirestore(): Firestore {
  const { firestore } = useFirebase();
  return firestore;
}

/**
 * Custom hook to access the Firebase App instance.
 */
export function useFirebaseApp(): FirebaseApp {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
}
