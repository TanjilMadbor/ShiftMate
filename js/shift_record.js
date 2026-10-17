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

// pageCursors[i] is the last doc before page i (null for the first page)
const pageCursors = [null];
let currentPage = 0;

if (user) {
  renderUserStatus("user_status");
  hideRegistrationTabIfLoggedIn();
  document.getElementById("next_btn").addEventListener("click", () => loadPage(currentPage + 1));
  document.getElementById("prev_btn").addEventListener("click", () => loadPage(currentPage - 1));
  loadPage(0);
}

async function loadPage(pageIndex) {
  const tbody = document.getElementById("shift_table_body");
  const messageEl = document.getElementById("message");
  const prevBtn = document.getElementById("prev_btn");
  const nextBtn = document.getElementById("next_btn");
  const pageLabel = document.getElementById("page_label");

  prevBtn.disabled = true;
  nextBtn.disabled = true;

  // Fetch one extra doc to know whether an older page exists
  const constraints = [orderBy("createdAt", "desc"), limit(PAGE_SIZE + 1)];
  const cursor = pageCursors[pageIndex];
  if (cursor) {
    constraints.push(startAfter(cursor));
  }

  try {
    const shiftsQuery = query(collection(db, "users", user.employeeId, "shifts"), ...constraints);
    const snapshot = await getDocs(shiftsQuery);

    if (snapshot.empty) {
      tbody.replaceChildren();
      prevBtn.hidden = true;
      nextBtn.hidden = true;
      pageLabel.textContent = "";
      messageEl.textContent = "No shift records found.";
      return;
    }

    const docs = snapshot.docs.slice(0, PAGE_SIZE);
    const hasNext = snapshot.size > PAGE_SIZE;

    messageEl.textContent = "";
    tbody.replaceChildren();

    docs.forEach((docSnap) => {
      const shift = docSnap.data();
      const row = document.createElement("tr");

      [shift.date, shift.startTime, shift.endTime, shift.weekType].forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });

      tbody.appendChild(row);
    });

    if (hasNext) {
      pageCursors[pageIndex + 1] = docs[docs.length - 1];
    }
    currentPage = pageIndex;

    prevBtn.hidden = pageIndex === 0;
    nextBtn.hidden = !hasNext;
    pageLabel.textContent = pageIndex === 0 && !hasNext ? "" : `Page ${pageIndex + 1}`;

  } catch (err) {
    messageEl.textContent = err.message;
  } finally {
    prevBtn.disabled = false;
    nextBtn.disabled = false;
  }
}
