import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { setCurrentUser, hideRegistrationTabIfLoggedIn } from "./auth.js";
import { hashPassword } from "./password.js";

hideRegistrationTabIfLoggedIn();

document.getElementById("login_btn").addEventListener("click", async (event) => {
  event.preventDefault();

  const employeeId = document.getElementById("employee_id").value.trim();
  const password = document.getElementById("password").value;
  const messageEl = document.getElementById("message");

  if (!employeeId || !password) {
    messageEl.textContent = "Please fill in all fields";
    return;
  }

  try {
    const userRef = doc(db, "users", employeeId);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      messageEl.textContent = "Employee ID not found";
      return;
    }

    const userData = snapshot.data();
    const enteredHash = await hashPassword(password, userData.passwordSalt);
    if (enteredHash !== userData.passwordHash) {
      messageEl.textContent = "Incorrect password";
      return;
    }

    setCurrentUser(employeeId, userData.name);
    messageEl.textContent = "Login successful";
    window.location.href = "index.html";

  } catch (err) {
    messageEl.textContent = err.message;
  }
});
