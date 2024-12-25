import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage"; // Add this import
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA0TER1C_AuZM2Jy0n9Aj-e-bUKiYpcyM0",
  authDomain: "leena-7fa00.firebaseapp.com",
  projectId: "leena-7fa00",
  storageBucket: "leena-7fa00.firebasestorage.app",
  messagingSenderId: "637788799557",
  appId: "1:637788799557:web:3c657155d8cb11c2e2d92c",
  measurementId: "G-9SGEYXQJDM",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage(app);

export const userRef = collection(db, "users");
export const quizRef = collection(db, "quizzes");
export const storageUserRef = ref(storage, "users");
export { auth, db, storage };
