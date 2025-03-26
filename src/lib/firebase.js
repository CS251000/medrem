// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMMea72w-8Kkzdqz1hLGrDvNM6YdvqmnA",
  authDomain: "medicare-41af1.firebaseapp.com",
  projectId: "medicare-41af1",
  storageBucket: "medicare-41af1.firebasestorage.app",
  messagingSenderId: "383297468290",
  appId: "1:383297468290:web:c4b8a0bec80b86ddec019b",
  measurementId: "G-5M70YNSK3N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
