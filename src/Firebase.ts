import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage';

export const firebaseapp = {
  apiKey: "AIzaSyASZtusB2gmvpd_ApTIuSxVUbjCr02Fwns",
  authDomain: "reurb2-6dd5d.firebaseapp.com",
  projectId: "reurb2-6dd5d",
  storageBucket: "reurb2-6dd5d.appspot.com",
  messagingSenderId: "792752854006",
  appId: "1:792752854006:web:de6ef7cff9aa60ef606dd7"
};

export const firebase = initializeApp(firebaseapp);

export const firestore = getFirestore(firebase);
