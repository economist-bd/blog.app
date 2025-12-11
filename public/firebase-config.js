// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDWk-dK56ZDmIre3ny8v0n7109AiqfjWW0",
    authDomain: "poetic-visions-4ac1d.firebaseapp.com",
    databaseURL: "https://poetic-visions-4ac1d-default-rtdb.firebaseio.com",
    projectId: "poetic-visions-4ac1d",
    storageBucket: "poetic-visions-4ac1d.firebasestorage.app",
    messagingSenderId: "970780215745",
    appId: "1:970780215745:web:ff8067c048cbdec320c740",
    measurementId: "G-YT92YRRYMR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth };