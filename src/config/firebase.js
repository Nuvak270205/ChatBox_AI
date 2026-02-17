// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEqOizYQrkPywNw4FgUGR1OQ0sAmhLHR0",
  authDomain: "chatboxai-f8325.firebaseapp.com",
  projectId: "chatboxai-f8325",
  storageBucket: "chatboxai-f8325.firebasestorage.app",
  messagingSenderId: "294135223840",
  appId: "1:294135223840:web:bd691cf3567298d51c4e45",
  measurementId: "G-N78LM12V7P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getAnalytics(app);
export default db;
