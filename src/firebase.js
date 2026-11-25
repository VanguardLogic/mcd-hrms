import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBZoTQRxz5M1KoIEd9wpMbKy7hf6x7KZyg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mcd-hrms.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mcd-hrms",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mcd-hrms.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "453491779262",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:453491779262:web:8c0e7d7780fccf01c920ef",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// !!! CRITICAL: Export auth and db as named exports !!!
export { auth, db };
export default app;