import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCTv65_TnqWq_qs3BtAU9wh4Vee5f3AwL8",
  authDomain: "splitcircle-3a84a.firebaseapp.com",
  projectId: "splitcircle-3a84a",
  storageBucket: "splitcircle-3a84a.firebasestorage.app",
  messagingSenderId: "810546057582",
  appId: "1:810546057582:web:e81e7ad875a6dc3ba7b17f",
  measurementId: "G-FWVT93R8KN"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
