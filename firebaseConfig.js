// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7mzEJv0xmMTXE6h4jDYMiI9TZlEmFHeg",
  authDomain: "seebu-64422.firebaseapp.com",
  projectId: "seebu-64422",
  storageBucket: "seebu-64422.firebasestorage.app",
  messagingSenderId: "626683870239",
  appId: "1:626683870239:web:6eeac3c77241664886292a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)