import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAaTrM1QPPEBxnT4RSRwK6tAT2B7thWKUc",
    authDomain: "fir-course-8dada.firebaseapp.com",
    databaseURL: "https://fir-course-8dada-default-rtdb.firebaseio.com",
    projectId: "fir-course-8dada",
    storageBucket: "fir-course-8dada.appspot.com",
    messagingSenderId: "523283104184",
    appId: "1:523283104184:web:1374d2f6a57f05992e0f4d",
    measurementId: "G-BMFNWSQY9P"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);