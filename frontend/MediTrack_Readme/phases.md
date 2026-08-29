# MediTrack — Development Phases

## Phase 1 — Dashboard & Design System

### Goal

Create the polished patient dashboard and establish the visual language.

### Build

- Sidebar
- Header
- Search
- Notifications UI
- Add Medicine CTA
- Statistics cards
- Today's Schedule
- Adherence Overview
- Caregiver card
- Medicine Expiry alert
- Health Tip
- Responsive mobile navigation

### Data

Use mock medicines and adherence data.

### Deliverable

A polished dashboard that runs independently with:

npm run dev

---

## Phase 2 — Authentication & Onboarding

### Goal

Create the first-time user flow.

### Build

- Login
- Signup
- Demo authentication state
- Prescription onboarding entry
- Skip-for-now behavior
- Interactive walkthrough

### Flow

Signup
 ↓
Upload Prescription
 ↓
Review
 ↓
Schedule
 ↓
Walkthrough
 ↓
Dashboard

Returning users:

Login → Dashboard

---

## Phase 3 — Prescription Upload & AI Analysis

### Goal

Implement the main AI-assisted workflow.

### Build

- Drag-and-drop upload
- JPG/PNG/PDF support
- Preview
- Processing state
- Extracted medicine results
- Edit controls
- Confirmation

### Integration boundary

UploadPrescription
       ↓
prescriptionService
       ↓
Gemini API

The first implementation may use mock analysis before the real API is connected.

---

## Phase 4 — Medication Management, Reminders & Expiry

### Goal

Make medicine scheduling and tracking functional.

### Build

- Add Medicine
- Edit Medicine
- Medicine list
- Frequency
- Times
- Start/end dates
- Expiry date
- Daily dose generation
- Taken/missed/skipped state
- Reminder UI
- Expiry status and alerts

### Deliverable

Medicine
 ↓
Schedule
 ↓
Daily Dose
 ↓
Taken / Missed
 ↓
History

---

## Phase 5 — Adherence & Caregiver

### Goal

Turn dose activity into useful adherence insights.

### Build

- History
- Daily/weekly adherence
- Charts
- Missed-dose summaries
- Caregiver dashboard
- Patient activity
- Caregiver alerts
- Expiry alerts

### Adherence

Conceptually:

Adherence =
Taken scheduled doses / Total scheduled doses × 100

The exact product definition should remain consistent throughout the application.

---

## Phase 6 — Integration, Testing & Demo

### Goal

Prepare the complete application for presentation.

### Build/polish

- Connect backend APIs
- Connect Gemini
- Connect medicine database
- Connect persistence
- Notification integration
- Error handling
- Loading states
- Empty states
- Responsive polish
- Accessibility
- Form validation
- Navigation testing
- Demo data

### Final demo flow

Signup
 ↓
Upload prescription
 ↓
AI extraction
 ↓
Review medicines
 ↓
Confirm schedule
 ↓
Walkthrough
 ↓
Dashboard
 ↓
Reminder
 ↓
Take dose
 ↓
Adherence update
 ↓
Expiry alert
 ↓
Caregiver view

### Completion rule

Every phase must leave the project runnable and demonstrable.