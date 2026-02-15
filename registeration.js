import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCwvOjWA-CivNe0hz1KSQ-QRW3eb2HQJRk",
  authDomain: "shiftmate-a01cb.firebaseapp.com",
  projectId: "shiftmate-a01cb",
  storageBucket: "shiftmate-a01cb.firebasestorage.app",
  messagingSenderId: "814946501150",
  appId: "1:814946501150:web:964b414e1a721642a9640f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("register_button").addEventListener("click", async (event) => {

  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const employeeId = document.getElementById("employee_id").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm_password").value;

  if (!name || !employeeId || !password || !confirmPassword) {
    document.getElementById("message").innerText = "Please fill in all fields";
    return;
  }

  if (password !== confirmPassword) {
    document.getElementById("message").innerText = "Passwords do not match";
    return;
  }

  try {
    const userRef = doc(db, "users", employeeId);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      document.getElementById("message").innerText = "Employee ID already exists";
      return;
    }

    await setDoc(userRef, {
      name,
      employeeId,
      password, // ⚠️ hash later
      createdAt: new Date()
    });

    document.getElementById("message").innerText = "Registration successful";
    document.getElementById("form").reset();

  } catch (err) {
    document.getElementById("message").innerText = err.message;
  }
});
