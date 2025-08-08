import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

if (!process.env.FIREBASE_API_KEY) {
    throw new Error("FIREBASE_API_KEY environment variable is not set");
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "lumenai-5c4e7.firebaseapp.com",
  projectId: "lumenai-5c4e7",
  storageBucket: "lumenai-5c4e7.firebaseapp.com",
  messagingSenderId: "228704882294",
  appId: "1:228704882294:web:7878c0048e1a272f0e5957",
  measurementId: "G-KCB7BEF33E"
};

// Initialize Firebase for SSR and to avoid re-initialization on hot reloads
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);


export { app, db, auth, analytics };
