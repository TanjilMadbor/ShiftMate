import { db } from "./firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { requireLogin, renderUserStatus, hideRegistrationTabIfLoggedIn } from "./auth.js";

const user = requireLogin();

if (user) {
  renderUserStatus("user_status");
  hideRegistrationTabIfLoggedIn();

  document.getElementById("btn").addEventListener("click", async () => {
    const messageEl = document.getElementById("message");
    const date = document.getElementById("date").value;
    const startTime = document.getElementById("start_time").value;
    const endTime = document.getElementById("end_time").value;
    const weekTypeSelect = document.getElementById("week_type");
    const weekType = weekTypeSelect.value;

    if (!date || !startTime || !endTime || !weekType) {
      messageEl.textContent = "Please fill in all fields";
      return;
    }

    if (endTime <= startTime) {
      messageEl.textContent = "End time must be after start time";
      return;
    }

    try {
      await addDoc(collection(db, "users", user.employeeId, "shifts"), {
        date,
        startTime,
        endTime,
        weekType: weekTypeSelect.selectedOptions[0].text,
        createdAt: new Date()
      });

      messageEl.textContent = "Shift submitted successfully";
      document.getElementById("form").reset();

    } catch (err) {
      messageEl.textContent = err.message;
    }
  });
}
