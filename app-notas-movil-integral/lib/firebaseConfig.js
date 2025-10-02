// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_kvBUSYaypnUCAx6YqZLaR8-HPsam1zc",
  authDomain: "ejemplofirebase-36d92.firebaseapp.com",
  databaseURL: "https://ejemplofirebase-36d92-default-rtdb.firebaseio.com",
  projectId: "ejemplofirebase-36d92",
  storageBucket: "ejemplofirebase-36d92.firebasestorage.app",
  messagingSenderId: "553465124394",
  appId: "1:553465124394:web:25dbb08a8b538c0c2d9553",
  measurementId: "G-4KVV7939XW"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar Firestore
export const db = getFirestore(app);
