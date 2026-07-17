import { db } from "./firebase-config.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { generateSalt, hashPassword } from "./password.js";
import { hideRegistrationTabIfLoggedIn } from "./auth.js";

hideRegistrationTabIfLoggedIn();

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

    const passwordSalt = generateSalt();
    const passwordHash = await hashPassword(password, passwordSalt);

    await setDoc(userRef, {
      name,
      employeeId,
      passwordSalt,
      passwordHash,
      createdAt: new Date()
    });

    document.getElementById("message").innerText = "Registration successful";
    document.getElementById("form").reset();

  } catch (err) {
    document.getElementById("message").innerText = err.message;
  }
});
