# MediTrack — Architecture

## 1. Architecture Goal

Keep the frontend modular, testable, and easy to extend. Avoid putting the entire application into App.jsx.

## 2. Frontend Stack

- React
- Vite
- JavaScript
- React Router
- CSS or the project's existing styling system
- Recharts for adherence visualizations when useful
- Lucide React for icons when available

## 3. Suggested Structure

src/
├── components/
│   ├── Sidebar.jsx
│   ├── MobileNav.jsx
│   ├── Header.jsx
│   ├── StatCard.jsx
│   ├── MedicineCard.jsx
│   ├── MedicineSchedule.jsx
│   ├── ReminderCard.jsx
│   ├── ExpiryAlert.jsx
│   ├── AdherenceChart.jsx
│   ├── CaregiverCard.jsx
│   ├── HealthTip.jsx
│   ├── NotificationPanel.jsx
│   ├── UploadDropzone.jsx
│   └── Walkthrough.jsx
│
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── UploadPrescription.jsx
│   ├── ReviewPrescription.jsx
│   ├── ConfirmSchedule.jsx
│   ├── Dashboard.jsx
│   ├── Medicines.jsx
│   ├── AddMedicine.jsx
│   ├── Reminders.jsx
│   ├── History.jsx
│   ├── Adherence.jsx
│   ├── Caregiver.jsx
│   ├── Reports.jsx
│   ├── Prescriptions.jsx
│   ├── Profile.jsx
│   └── Settings.jsx
│
├── services/
│   ├── prescriptionService.js
│   ├── medicineService.js
│   └── reminderService.js
│
├── data/
│   └── mockData.js
│
├── utils/
│   ├── expiry.js
│   └── adherence.js
│
├── App.jsx
├── App.css
└── main.jsx

## 4. Data Model

A medicine should eventually contain fields similar to:

{
  id: 1,
  name: "Metformin",
  genericName: "Metformin",
  strength: "500 mg",
  dose: "1 tablet",
  frequency: "twice_daily",
  times: ["09:00", "21:00"],
  instructions: "After meals",
  startDate: "2026-08-29",
  endDate: "2026-09-29",
  expiryDate: "2027-05-31"
}

A scheduled dose should be tracked separately:

{
  id: 101,
  medicineId: 1,
  scheduledAt: "2026-08-29T09:00:00",
  status: "pending"
}

Possible dose statuses:

- pending
- taken
- missed
- skipped

## 5. Service Boundary

UI components should not contain API-specific logic.

Use service modules:

Component
   ↓
Service
   ↓
API / Database

For example:

UploadPrescription.jsx
        ↓
prescriptionService.js
        ↓
Gemini / Backend

This makes it possible to replace mock data with real APIs later.

## 6. Routing

Recommended routes:

/login
/signup
/onboarding/upload-prescription
/onboarding/review
/onboarding/schedule
/dashboard
/medicines
/add-medicine
/reminders
/history
/adherence
/caregiver
/reports
/prescriptions
/profile
/settings

## 7. State

Use React state/context for the MVP.

Persist only appropriate onboarding/session flags in localStorage, such as:

- authentication demo state
- onboarding completion
- walkthrough completion

Do not introduce Redux unless the application actually requires it.