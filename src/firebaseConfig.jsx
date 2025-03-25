// // src/firebaseConfig.js
// import { initializeApp, getApps } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";   // Import Firebase Auth

// const firebaseConfig = {
//     apiKey: "AIzaSyB8c1oPpnnSeugwcIClvUfWuC6zbbDY2zg",
//     authDomain: "eventease-1f428.firebaseapp.com", 
//     projectId: "eventease-1f428", 
//     storageBucket: "eventease-1f428.firebasestorage.app", 
//     messagingSenderId: "548194648613", 
//     appId: "1:548194648613:web:6c7d0e5fd91d9b7de935cc", 
//     measurementId: "G-SCL346REZ5"   
// };

// //prevent duplicate initialization
// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// const db = getFirestore(app);
// const auth = getAuth(app);   // Use the same instance for authentication

// export { db, auth };