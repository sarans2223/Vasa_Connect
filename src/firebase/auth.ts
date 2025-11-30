
'use client';

import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';

const provider = new GoogleAuthProvider();

export function signInWithGoogle(auth: Auth) {
  return signInWithPopup(auth, provider);
}

export function signOut(auth: Auth) {
  return firebaseSignOut(auth);
}
