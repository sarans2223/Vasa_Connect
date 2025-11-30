
'use client';

import {
  Auth,
  signOut as firebaseSignOut,
} from 'firebase/auth';

export function signOut(auth: Auth) {
  return firebaseSignOut(auth);
}
