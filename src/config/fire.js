import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDL4aia__UqcKkx6SEFCEM933b58zMDKu0',
  authDomain: 'mind-game-rlg.firebaseapp.com',
  projectId: 'mind-game-rlg',
  storageBucket: 'mind-game-rlg.appspot.com',
  messagingSenderId: '995166769317',
  appId: '1:995166769317:web:2b32b81421eb7ed7b5fd4c',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage();

/*// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDL4aia__UqcKkx6SEFCEM933b58zMDKu0",
  authDomain: "mind-game-rlg.firebaseapp.com",
  projectId: "mind-game-rlg",
  storageBucket: "mind-game-rlg.appspot.com",
  messagingSenderId: "995166769317",
  appId: "1:995166769317:web:2b32b81421eb7ed7b5fd4c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);*/
