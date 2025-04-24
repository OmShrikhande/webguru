// lib/firebase.ts
import { initializeApp } from "firebase/app"; // Initialize Firebase App
import { getAuth } from "firebase/auth";     // Firebase Auth for authentication
import { getFirestore } from "firebase/firestore"; // Firebase Firestore for database

const firebaseConfig = {
    apiKey: "AIzaSyBXaOS6p-j5x4FXHaHHgZ3DdsdDr_87bdI",
    authDomain: "userguru-46628.firebaseapp.com",
    projectId: "userguru-46628",
    storageBucket: "userguru-46628.firebasestorage.app",
    messagingSenderId: "14861879382",
    appId: "1:14861879382:web:b576623dc293dbe3d513f7",
    measurementId: "G-ZLGJJ24QZW"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the Firebase Auth and Firestore services
export const auth = getAuth(app);
export const db = getFirestore(app);

