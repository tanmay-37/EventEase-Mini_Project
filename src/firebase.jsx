// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaShCD5ztywDaChVL_0Mk_qIyY_yExPt0",
  authDomain: "eventease-auth.firebaseapp.com",
  projectId: "eventease-auth",
  storageBucket: "eventease-auth.firebasestorage.app",
  messagingSenderId: "920430522537",
  appId: "1:920430522537:web:a1ccded332fae062d7b9b8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;