import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB37dveOt3hM1nNlY-f9ciyaXrBUVQknp0",
  authDomain: "fit-circle-fea9d.firebaseapp.com",
  databaseURL: "https://fit-circle-fea9d-default-rtdb.firebaseio.com",
  projectId: "fit-circle-fea9d",
  storageBucket: "fit-circle-fea9d.firebasestorage.app",
  messagingSenderId: "456743174659",
  appId: "1:456743174659:web:b81c8f36e5c9dca2acc436",
  measurementId: "G-DY14C5QQ15",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
