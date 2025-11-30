// src/firebase/config.ts
import type { FirebaseOptions } from "firebase/app";

export const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyClKKrYHgGnW2ltvrXPd5mTrwVVrcEdvkE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "studio-9096752878-3dca9.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "studio-9096752878-3dca9",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "studio-9096752878-3dca9.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "780954864730",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:780954864730:web:5cb3158728b8bdc63",
};

// export both named + default to avoid "not exported" mismatches
export default firebaseConfig;

