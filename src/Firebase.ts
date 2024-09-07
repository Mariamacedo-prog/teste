import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage';

//// TESTE
const info ={
  apiKey: "AIzaSyASZtusB2gmvpd_ApTIuSxVUbjCr02Fwns",
  authDomain: "reurb2-6dd5d.firebaseapp.com",
  projectId: "reurb2-6dd5d",
  storageBucket: "reurb2-6dd5d.appspot.com",
  messagingSenderId: "792752854006",
  appId: "1:792752854006:web:de6ef7cff9aa60ef606dd7"
}

//// ANTIGO PROD

// const info ={
//   apiKey: "AIzaSyDOxLrl76jmttfD0pZSwG84lkIlfXp0L-E",
//   authDomain: "reurb-6fc7d.firebaseapp.com",
//   projectId: "reurb-6fc7d",
//   storageBucket: "reurb-6fc7d.appspot.com",
//   messagingSenderId: "60391473788",
//   appId: "1:60391473788:web:2ac1e1871aeef6ab1abff9",
// }


//// NOVO PROD
// const info ={
//   apiKey: "AIzaSyCxwt2qyH3QAQDheJZYmM9YcW8kqzxcgdA",
//   authDomain: "reubr2.firebaseapp.com",
//   projectId: "reubr2",
//   storageBucket: "reubr2.appspot.com",
//   messagingSenderId: "566149139965",
//   appId: "1:566149139965:web:895fb37e063e6ee5a19d94"
// }




export const firebaseapp = info;


export const firebase = initializeApp(firebaseapp);

export const firestore = getFirestore(firebase);
