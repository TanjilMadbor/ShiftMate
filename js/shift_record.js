import { db } from "./firebase-config.js";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { requireLogin, renderUserStatus, hideRegistrationTabIfLoggedIn } from "./auth.js";

const PAGE_SIZE = 5;

const user = requireLogin();
let lastVisible = null;

if (user) {
  renderUserStatus("user_status");
  hideRegistrationTabIfLoggedIn();
  document.getElementById("load_more_btn").addEventListener("click", loadMoreShifts);
  loadMoreShifts();
}

async function loadMoreShifts() {
  const tbody = document.getElementById("shift_table_body");
  const messageEl = document.getElementById("message");
  const loadMoreBtn = document.getElementById("load_more_btn");
  const isFirstPage = lastVisible === null;

  loadMoreBtn.disabled = true;

  const constraints = [orderBy("createdAt", "desc"), limit(PAGE_SIZE)];
  if (lastVisible) {
    constraints.push(startAfter(lastVisible));
  }

  try {
    const shiftsQuery = query(collection(db, "users", user.employeeId, "shifts"), ...constraints);
    const snapshot = await getDocs(shiftsQuery);

    if (snapshot.empty) {
      loadMoreBtn.hidden = true;
      messageEl.textContent = isFirstPage ? "No shift records found." : "No more shift records.";
      return;
    }

    messageEl.textContent = "";
    lastVisible = snapshot.docs[snapshot.docs.length - 1];

    snapshot.forEach((docSnap) => {
      const shift = docSnap.data();
      const row = document.createElement("tr");

      [shift.date, shift.startTime, shift.endTime, shift.weekType].forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });

      tbody.appendChild(row);
    });

    loadMoreBtn.hidden = snapshot.size < PAGE_SIZE;

  } catch (err) {
    messageEl.textContent = err.message;
  } finally {
    loadMoreBtn.disabled = false;
  }
}
