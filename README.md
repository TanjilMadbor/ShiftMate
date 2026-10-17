# ShiftMate

**A lightweight web app for logging work shifts and keeping track of your timesheets.**

🔗 **Live app:** https://tanjilmadbor.github.io/ShiftMate/

ShiftMate is for casual and part-time workers who need a simple place to record when they worked. You register with your employee ID, log each shift (date, start time, end time and which week of the pay cycle it belongs to), and look back through your past shifts whenever you need to check a payslip or fill in a timesheet.

It's built with plain HTML, CSS and JavaScript, uses Firebase Firestore as its database, and is hosted on GitHub Pages. There's no framework and no build step.

---

## Features

- **Registration:** create an account with your name, employee ID and password. Duplicate employee IDs and names (case-insensitive) are rejected.
- **Login and logout:** sign in with your employee ID and password. The page shows who's logged in, and the Registration tab is hidden once you're signed in.
- **Password hashing:** passwords are never stored in plain text. Each one is salted with a random 16-byte value and hashed with SHA-256 using the browser's Web Crypto API.
- **Shift entry:** log a shift's date, start time, end time and week type (Week 01 / Week 02). The app checks that every field is filled in and that the end time is after the start time.
- **Shift history:** see your past shifts, newest first, 5 per page, with **Next** and **Previous** buttons. Pages are loaded with Firestore cursor-based queries, so only the shifts on the current page are fetched.
- **Protected pages:** the shift entry and shift record pages send you to the login page if you aren't signed in.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | HTML5, CSS3, JavaScript (ES modules) |
| Database | Firebase Cloud Firestore (Firebase JS SDK v12, loaded from CDN) |
| Security | Web Crypto API (SHA-256 + per-user salt) |
| Hosting | GitHub Pages |

## How it works

```
Browser ──► HTML page ──► page script (js/*.js)
                               │
                               ├─► auth.js         session in localStorage, route guards, logout
                               ├─► password.js     salt generation + SHA-256 hashing
                               └─► firebase-config.js ──► Cloud Firestore
```

### Data model

```
users/{employeeId}
  ├─ name            "Jane Smith"
  ├─ nameLower       "jane smith"     // used for case-insensitive duplicate checks
  ├─ employeeId      "E1234"
  ├─ passwordSalt    "<32 hex chars>"
  ├─ passwordHash    "<64 hex chars>"
  ├─ createdAt       timestamp
  │
  └─ shifts/{autoId}
       ├─ date       "2026-10-16"
       ├─ startTime  "09:00"
       ├─ endTime    "17:00"
       ├─ weekType   "Week 01"
       └─ createdAt  timestamp
```

Each user's shifts are stored in a subcollection under their own user document, so loading a user's history only reads that user's shifts.

## Project structure

```
ShiftMate/
├── index.html            # Shift entry portal (home page)
├── registeration.html    # Account registration
├── login.html            # Login
├── shift_record.html     # Past shift records with pagination
├── styles.css            # Shared styles
├── images/
│   └── image.png         # Background image
└── js/
    ├── firebase-config.js  # Firebase initialisation
    ├── auth.js             # Session helpers, route guard, logout
    ├── password.js         # Salt + SHA-256 hashing
    ├── registeration.js    # Registration logic and duplicate checks
    ├── login.js            # Login and password verification
    ├── shift_entry.js      # Shift form validation and saving
    └── shift_record.js     # Paginated shift history
```

## Running locally

ES modules don't load from `file://` URLs, so the site has to be served over HTTP.

1. Clone the repository:
   ```bash
   git clone https://github.com/TanjilMadbor/ShiftMate.git
   cd ShiftMate
   ```
2. Start a local server, using any one of these:
   - **VS Code:** install the *Live Server* extension, then right-click `index.html` and choose **Open with Live Server**.
   - **Node:** `npx serve .`
   - **Python:** `python -m http.server 8000`
3. Open the URL it prints (for example `http://localhost:8000`) and register an account.

### Using your own Firebase project

The repo connects to the ShiftMate Firebase project out of the box. To use your own:

1. Create a project in the [Firebase console](https://console.firebase.google.com/) and enable **Cloud Firestore**.
2. Add a web app to the project and copy its config object.
3. Replace the values in [`js/firebase-config.js`](js/firebase-config.js).

> A Firebase web config isn't a secret. Every browser that loads the app downloads it. Your data is protected by **Firestore security rules**, so set those up before sharing your deployment.

## Deployment

The site is deployed with **GitHub Pages** from the `main` branch (root folder). Every push to `main` updates the live app within a minute or two.

Because the site is served from a sub-path (`/ShiftMate/`), every asset path in the HTML and CSS is relative (`images/image.png`, not `/images/image.png`).

## Known limitations

This is a learning project, and these are the main trade-offs in its current design:

- **Authentication is handled in the browser.** Password checks and the login session (stored in `localStorage`) run on the client, and Firestore can't tell which user is making a request. That means database access can't be restricted per user.
- **Duplicate checks only run in the browser**, so they can be bypassed by writing to Firestore directly, and two people registering at the same moment could both get through.
- **Overnight shifts aren't supported.** A shift has to end on the same day it starts.

## Roadmap

- [ ] Move login to **Firebase Authentication** and lock down Firestore rules so each user can only read and write their own data
- [ ] Edit and delete shifts
- [ ] Total hours per shift, per week and per pay cycle
- [ ] Support overnight shifts
- [ ] Export timesheets to CSV or PDF
- [ ] Mobile-first layout improvements

## Author

**Tanjil Madbor**
GitHub: [@TanjilMadbor](https://github.com/TanjilMadbor)
