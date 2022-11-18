import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfBa8rWLeCWjICY3bsJjW-Nk7U7tDtp5M",
  authDomain: "tododatabase-acb1e.firebaseapp.com",
  projectId: "tododatabase-acb1e",
  storageBucket: "tododatabase-acb1e.appspot.com",
  messagingSenderId: "980011734471",
  appId: "1:980011734471:web:bf12057b9904de20e535e2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
