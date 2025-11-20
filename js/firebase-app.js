// firebase-app.js - Para usar con módulos ES6 (opcional)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCgsBVl7mEzcPjiTCsGcOyxs_PljYI1lqA",
    authDomain: "web1-2c593.firebaseapp.com",
    projectId: "web1-2c593",
    storageBucket: "web1-2c593.firebasestorage.app",
    messagingSenderId: "829936667234",
    appId: "1:829936667234:web:e83c0a0a67f110b24bdf3b",
    measurementId: "G-FDH3EXEJZ0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };