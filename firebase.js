// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyA5UYmco4Ev141P5UkAFMk_VOAIBQlk4WE",
  authDomain: "mobile-app-baed7.firebaseapp.com",
  projectId: "mobile-app-baed7",
  storageBucket: "mobile-app-baed7.firebasestorage.app",
  messagingSenderId: "92017096973",
  appId: "1:92017096973:web:0382a2286497cfa13a9844",
  measurementId: "G-RX2KM70QLX"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
