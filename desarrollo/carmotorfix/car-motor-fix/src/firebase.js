import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoWu44KG0KFIHM3Q76bEDu5MmNjpUgazU",
  authDomain: "carmotorfix-131fc.firebaseapp.com",
  projectId: "carmotorfix-131fc",
  storageBucket: "carmotorfix-131fc.appspot.com",
  messagingSenderId: "1028446127672",
  appId: "1:1028446127672:web:b0d6159feaaa4b12ce08cd",
  measurementId: "G-WY7XPZ2EHZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };