import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyAqBCaRrQiw1gFyWtZQyeMCBpue9jKgug4",
  authDomain: "flowbroad.firebaseapp.com",
  projectId: "flowbroad",
  storageBucket: "flowbroad.firebasestorage.app",
  messagingSenderId: "830956851257",
  appId: "1:830956851257:web:08d2522134f98516edfde8"
};


export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const fbFunctions = getFunctions(app);



if (process.env.NODE_ENV === "development") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8081);
  connectFunctionsEmulator(fbFunctions, "localhost", 5001);
}