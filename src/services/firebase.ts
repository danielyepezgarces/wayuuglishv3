import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

const firebaseConfig = {
  projectId: 'wayuuglish',
  appId: '1:901693276913:web:f746629a3ba0a3d3915f50',
  storageBucket: 'wayuuglish.firebasestorage.app',
  apiKey: 'AIzaSyDfp-Xrm7Gje6qSM2sEDKgL40kZBgLNch8',
  authDomain: 'wayuuglish.firebaseapp.com',
  messagingSenderId: '901693276913',
  measurementId: 'G-3LTEF1R9D7',
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
};
