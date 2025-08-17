import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getDatabase } from "firebase/database"
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyA51IayFmGlSy4MmuXN6kgS1ckqIrMuQ78",
  authDomain: "oasis-fee29.firebaseapp.com",
  databaseURL: "https://oasis-fee29-default-rtdb.firebaseio.com/",
  projectId: "oasis-fee29",
  storageBucket: "oasis-fee29.firebasestorage.app",
  messagingSenderId: "1049025006173",
  appId: "1:1049025006173:web:bfbc66f3ca0d0820aadbb4",
  measurementId: "G-XDLJGV39LD",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const database = getDatabase(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider()
googleProvider.addScope("email")
googleProvider.addScope("profile")
