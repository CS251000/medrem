// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQV5dab2vwU1rdlxsfaSMTDtfgP0kOP2Q",
  authDomain: "medrem-fbcb0.firebaseapp.com",
  projectId: "medrem-fbcb0",
  storageBucket: "medrem-fbcb0.firebasestorage.app",
  messagingSenderId: "954226199500",
  appId: "1:954226199500:web:6c134554da50db66dd6b69",
  measurementId: "G-XW9DFRX8H7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
