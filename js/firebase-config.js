import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCwvOjWA-CivNe0hz1KSQ-QRW3eb2HQJRk",
  authDomain: "shiftmate-a01cb.firebaseapp.com",
  projectId: "shiftmate-a01cb",
  storageBucket: "shiftmate-a01cb.firebasestorage.app",
  messagingSenderId: "814946501150",
  appId: "1:814946501150:web:964b414e1a721642a9640f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
