# MediTrack — Project Memory

## Purpose

This document stores important project decisions so future development sessions remain consistent.

## Product

Name: MediTrack

Type: Medication reminder, dosage tracking, medicine expiry, prescription analysis, and caregiver monitoring web application.

## Current Scope

The current immediate task is Dashboard only.

Do not implement additional application areas until the dashboard is approved and stable.

## Approved User Flow

### New User

Login / Signup
 ↓
Upload Prescription
 ↓
AI Analysis
 ↓
Review & Edit
 ↓
Confirm Medicines
 ↓
Confirm Schedule
 ↓
Walkthrough
 ↓
Dashboard

### Returning User

Login
 ↓
Dashboard

## Approved Dashboard Direction

Use the bottom-right green design from the supplied reference image as the primary visual direction.

The dashboard should include:

- Sidebar
- Dashboard header
- Search
- Notifications
- Add Medicine
- Today's Medicines
- Taken count
- Missed count
- Adherence
- Today's Schedule
- Adherence Overview
- Caregiver card
- Medicine Expiry alert
- Health Tip
- Upload Prescription CTA
- Add Medicine CTA

## Approved Color Palette

Primary Green:   #2F8F70
Dark Green:      #176B55
Light Green:     #E8F5EF
Background:      #F7FAF8
Surface:         #FFFFFF
Primary Text:    #172B24
Secondary Text:  #65756E

Taken:           #2F8F70
Upcoming:        #3B82A0
Expiring:        #D99A3D
Missed:          #D95C5C

## Technology

Current frontend:

- React
- Vite
- JavaScript

The project uses an AI coding workflow in VS Code.

## AI

Gemini is planned for prescription/image analysis.

Important principle:

AI extraction
    ↓
User review
    ↓
User confirmation
    ↓
Medication schedule

AI must not silently become a prescribing or clinical decision system.

## Medicine Data

Expected medicine information includes:

- Name
- Generic name
- Strength
- Dose
- Frequency
- Time
- Instructions
- Start date
- End date
- Expiry date

## Expiry

The UI uses:

>30 days      Valid
8–30 days     Expiry Approaching
0–7 days      Expiring Soon
Past date     Expired

Expiry information should always be reviewable when obtained through OCR/AI.

## Reminder Concept

A medicine schedule creates expected daily doses.

Dose lifecycle:

Pending → Taken
Pending → Missed
Pending → Skipped

The frontend should eventually support daily reminders and alerts.

## Caregiver

Caregiver functionality should eventually show:

- Adherence
- Missed doses
- Recent medication activity
- Expiry alerts
- Relevant notifications

## Development Principle

Build in six phases:

1. Dashboard & Design System
2. Authentication & Onboarding
3. Prescription Upload & AI Analysis
4. Medication Management, Reminders & Expiry
5. Adherence & Caregiver
6. Integration, Testing & Demo

## Current Priority

Do not move beyond Dashboard until the Dashboard is visually approved.

Future sessions should read this file before making major UI or architecture changes.
