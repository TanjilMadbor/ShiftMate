const EMPLOYEE_ID_KEY = "shiftmate_employee_id";
const EMPLOYEE_NAME_KEY = "shiftmate_employee_name";

export function getCurrentUser() {
  const employeeId = localStorage.getItem(EMPLOYEE_ID_KEY);
  const name = localStorage.getItem(EMPLOYEE_NAME_KEY);
  return employeeId ? { employeeId, name } : null;
}

export function setCurrentUser(employeeId, name) {
  localStorage.setItem(EMPLOYEE_ID_KEY, employeeId);
  localStorage.setItem(EMPLOYEE_NAME_KEY, name);
}

export function logout() {
  localStorage.removeItem(EMPLOYEE_ID_KEY);
  localStorage.removeItem(EMPLOYEE_NAME_KEY);
  window.location.href = "login.html";
}

// Redirects to the login page when no one is signed in. Returns the current
// user (or null after triggering the redirect) so callers can bail out.
export function requireLogin() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return null;
  }
  return user;
}

export function hideRegistrationTabIfLoggedIn() {
  const registrationTab = document.getElementById("nav_registration");
  if (registrationTab && getCurrentUser()) {
    registrationTab.style.display = "none";
  }
}

export function renderUserStatus(elementId) {
  const el = document.getElementById(elementId);
  const user = getCurrentUser();
  if (!el || !user) return;

  el.textContent = "";

  const label = document.createElement("span");
  label.textContent = `Logged in as ${user.name} (${user.employeeId}) — `;

  const logoutLink = document.createElement("a");
  logoutLink.href = "#";
  logoutLink.id = "logout_link";
  logoutLink.textContent = "Logout";
  logoutLink.addEventListener("click", (event) => {
    event.preventDefault();
    logout();
  });

  el.appendChild(label);
  el.appendChild(logoutLink);
}
