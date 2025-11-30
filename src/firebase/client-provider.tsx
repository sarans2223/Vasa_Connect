
'use client';

import React from 'react';
import { FirebaseProvider } from './provider';

/**
 * This is a client-only component that acts as the entry point for the Firebase context.
 * It renders the core FirebaseProvider, which in turn handles the initialization.
 * By using this as the root client provider, we ensure that all Firebase-related
 * hooks and components will only run in the browser.
 */
export default function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseProvider>
      {children}
    </FirebaseProvider>
  );
}
