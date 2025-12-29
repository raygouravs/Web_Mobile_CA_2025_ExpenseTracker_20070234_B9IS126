import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzkQwHKJk-V4Pm4JH0c_JCMtv8O0hazaU",
  authDomain: "expensetrackerionicandroid.firebaseapp.com",
  projectId: "expensetrackerionicandroid",
  storageBucket: "expensetrackerionicandroid.firebasestorage.app",
  messagingSenderId: "333543614598",
  appId: "1:333543614598:web:bb655a491d37f4b7718907"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);