// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth,GoogleAuthProvider} from 'firebase/auth';

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDjPhOQjEQcrkSnb3dOOTawiG5p9uVxu-E",
  authDomain: "busybuy-4b604.firebaseapp.com",
  projectId: "busybuy-4b604",
  storageBucket: "busybuy-4b604.appspot.com",
  messagingSenderId: "541835224381",
  appId: "1:541835224381:web:e7ec15f99814cb034bd154"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//firebase instance
const firebaseAuth=getAuth(app);

//initialize firestore db and get a reference to that service
const db = getFirestore(app);

//instance of google auth provider
const googleProvider=new GoogleAuthProvider();

export {db,firebaseAuth,googleProvider};
