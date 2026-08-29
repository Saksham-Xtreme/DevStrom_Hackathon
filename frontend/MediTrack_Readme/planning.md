# MediTrack — Planning

## 1. Project Overview

MediTrack is a medication reminder and dosage tracking web application designed to help patients organize medicines, follow daily schedules, monitor adherence, track medicine expiry, and optionally share adherence information with a caregiver.

The product should prioritize simplicity, trust, accessibility, and safe handling of medication information.

## 2. Core User Journey

### New User

Login / Signup
      ↓
Upload Prescription
      ↓
Prescription Analysis
      ↓
Review & Edit Medicines
      ↓
Confirm Medicines
      ↓
Confirm Medication Schedule
      ↓
Interactive Walkthrough
      ↓
Dashboard

### Returning User

Login
  ↓
Dashboard

A returning user must not be forced to upload a prescription again.

## 3. MVP Goals

The first working product should demonstrate:

- Patient dashboard
- Medicine schedule
- Daily reminder UI
- Taken / missed dose tracking
- Medicine expiry tracking
- Expiring-soon alerts
- Adherence calculation
- Prescription upload flow
- AI-assisted prescription extraction
- Medicine review and confirmation
- Caregiver adherence view

## 4. Hackathon Strategy

Build incrementally. Each phase must leave the application runnable.

Priority order:

1. Dashboard and design system
2. Authentication and onboarding
3. Prescription upload and analysis
4. Medication management, reminders, and expiry
5. Adherence and caregiver features
6. Integration, responsive polish, testing, and demo

## 5. Current Development Focus

The immediate implementation target is Dashboard only.

The dashboard should establish:

- Sidebar
- Header
- Statistics
- Today's Schedule
- Adherence Overview
- Caregiver card
- Medicine Expiry alert
- Health Tip
- Quick Actions
- Responsive mobile layout

Use mock data until backend services are ready.

## 6. Future Integrations

The frontend should be structured so the following can be connected later:

- Authentication backend
- Gemini API for prescription/image analysis
- Drug/medicine database
- Database for medicines and dose history
- Notification/push service
- Caregiver communication