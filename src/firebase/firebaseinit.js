// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCd5EyTgkec88hr27q2hNcorcKswnxoYRM",
  authDomain: "redditvscc.firebaseapp.com",
  projectId: "redditvscc",
  storageBucket: "redditvscc.appspot.com",
  messagingSenderId: "1070351067009",
  appId: "1:1070351067009:web:f8676e9e168433a06faa80",
  measurementId: "G-HL60JXY5M5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const analytics = getAnalytics(app);

export { app, db }