# MediTrack

MediTrack is a medication management and adherence app designed for patients and caregivers. It helps users track medicines, reminders, adherence, caregiver alerts, and prescription uploads in a simple React-based dashboard experience.

## Project Overview

The project is split into two main parts:

- Frontend: React + Vite app for the user interface
- Backend: Node.js + Express app for API routes, Google OAuth, and future patient data services

The frontend currently uses a demo/local-storage-based state model, while the backend contains the API layer and OAuth entry points defined in the project API guide.

---

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- CSS modules/custom CSS files
- LocalStorage for demo persistence

### Backend
- Node.js
- Express
- Passport.js
- MongoDB + Mongoose
- Google OAuth 2.0
- CORS + Helmet

---

## Repository Structure

```text
DevStrom_Hackathon/
├── access.md
├── planning.md
├── README.md
├── Backend/
│   ├── app.js
│   ├── package.json
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── passport.js
│   │   ├── middleware/
│   │   │   └── passport.middleware.js
│   │   ├── models/
│   │   │   └── User.js
│   │   └── modules/
│   │       └── auth/
│   │           └── auth.routes.js
│   └── server.js
├── frontend/
│   ├── .env
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── MediTrack_Readme/
│       ├── architecture.md
│       ├── design.md
│       ├── memory.md
│       ├── phases.md
│       ├── planning.md
│       └── rules.md
└── ...
```

---

## Frontend Architecture

### Entry and Routing
The app starts from the entry file and then renders the router in [frontend/src/App.jsx](frontend/src/App.jsx).

The main routes are:

- /login
- /signup
- /onboarding
- /dashboard
- /medicines
- /reminders
- /adherence
- /caregivers
- /upload-prescription

There are protected and public route guards based on authentication state stored in the AuthContext.

### Authentication Flow
The Auth state is managed in [frontend/src/context/AuthContext.jsx](frontend/src/context/AuthContext.jsx).

It stores:
- login status
- onboarding completion
- user session state in localStorage

The Google login action is triggered from the pages and redirected to the backend OAuth route through [frontend/src/services/googleAuthService.js](frontend/src/services/googleAuthService.js).

### Main Pages

- Login page: user login screen, includes Google login button
- Signup page: account creation flow with multi-step signup
- Onboarding flow: first-run onboarding
- Dashboard: medication overview and schedule summary
- Medicines: medicine list, add/edit/delete actions
- Reminders: dose handling and status updates
- Adherence: adherence reporting and dose history
- Caregivers: caregiver dashboard and alerts
- UploadPrescription: prescription upload and demo extraction workflow

### Frontend State Model
The frontend currently relies on:
- localStorage for auth/session persistence
- mock/demo data for medication and adherence tracking
- service files for app logic

This is a good MVP structure and is designed to evolve toward real backend data integration.

---

## Backend Architecture

### Server Setup
The Express app is initialized in [Backend/app.js](Backend/app.js) and started in [Backend/src/server.js](Backend/src/server.js).

Key middleware:
- CORS
- Helmet
- Passport initialization
- JSON body parsing

### Authentication Layer
The backend supports Google OAuth via Passport.

Configuration is in:
- [Backend/src/config/passport.js](Backend/src/config/passport.js)
- [Backend/src/middleware/passport.middleware.js](Backend/src/middleware/passport.middleware.js)
- [Backend/src/modules/auth/auth.routes.js](Backend/src/modules/auth/auth.routes.js)

Routes include:
- GET /api/auth/google
- GET /api/auth/google/callback
- GET /api/auth/login-failed

### User Model
The user schema is defined in [Backend/src/models/User.js](Backend/src/models/User.js).

It stores:
- email
- name
- profile image
- authProvider
- googleId
- emailVerified
- passwordHash
- role
- lastLoginAt

---

## Important API Contract

The API behavior is documented in [access.md](access.md).

### Base URL
- Local frontend: http://localhost:5173
- Local backend: http://localhost:8080

### Google Auth flow
1. Frontend redirects to http://localhost:8080/api/auth/google
2. Google login is handled by backend Passport strategy
3. Callback returns auth result and user data to the browser

This is the core integration point between the frontend and backend.

---

## Data and Service Layer

The frontend currently includes service files such as:
- [frontend/src/services/googleAuthService.js](frontend/src/services/googleAuthService.js)
- [frontend/src/services/medicineService.js](frontend/src/services/medicineService.js)
- [frontend/src/services/prescriptionService.js](frontend/src/services/prescriptionService.js)

These are responsible for:
- Google auth redirect logic
- local medicine schedule storage
- demo adherence calculations
- prescription scanning simulation

This keeps UI pages lean and separates domain logic from visual components.

---

## How the App Works

### User Experience Flow
1. User lands on login/signup
2. Auth state is checked in the context
3. Protected routes redirect unauthenticated users to login
4. After login/signup, the user goes to onboarding or dashboard
5. Medicines and reminders are managed through dashboard pages
6. A prescription upload page simulates extraction and schedule review
7. Adherence and caregiver pages summarize status with demo data

---

## Setup Instructions

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:
```text
http://localhost:5173
```

### Backend
```bash
cd Backend
npm install
npm run dev
```

Backend will run on:
```text
http://localhost:8080
```

---

## Environment Variables

### Frontend
Configuration is in [frontend/.env](frontend/.env) and [frontend/.env.example](frontend/.env.example).

Example values:
```env
BACKEND_URL=http://localhost:8080
VITE_GOOGLE_AUTH_URL=http://localhost:8080
VITE_USE_BACKEND_API=true
```

### Backend
The backend uses variables like:
- PORT
- CLIENT_URL
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_CALLBACK_URL
- MONGODB_URI

Important: Google OAuth credentials must be configured before real login works.

---

## Current Status

This project is in a functional MVP stage:

- Frontend UI and routing are implemented
- Backend OAuth route structure exists
- Local demo data is active for UI workflows
- Real Google OAuth credentials and DB connection are still required for production-ready runtime behavior

---

## Recommended Next Steps

1. Add real Google OAuth credentials in the backend environment file
2. Connect MongoDB for persistent users and app data
3. Replace demo medicine services with real backend API integrations
4. Add JWT-based auth for email/OTP login
5. Implement actual prescription OCR backend processing
6. Add real APIs for medicines, reminders, caregivers, and adherence tracking

---

## Summary

MediTrack is a patient care dashboard with medication tracking and caregiver support features. The frontend is built using React and Vite, while the backend exposes the authentication and API surfaces needed to support a real healthcare product.

The codebase is already organized for expansion, and the next step is integrating the real backend services and credentials behind the existing frontend interfaces.
