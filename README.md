## Problem Statement

People who take medicines regularly often face problems with **remembering doses, following the prescribed dosage schedule, monitoring medicine stock, and keeping track of missed doses**.

This becomes more difficult when a person has:

* Multiple medicines at different times of the day
* Long-term prescriptions
* Different dosage instructions
* Medicines that expire or run out at different times
* A caregiver who needs to know whether medicines were taken

Existing reminder applications generally focus on **alarms and notifications**, but they do not necessarily connect the complete process of:

**Prescription → Medicine schedule → Dose adherence → Stock tracking → Refill → Caregiver monitoring → Emergency assistance**

There is therefore a need for a system that can manage the user's medication journey from the prescription itself and provide appropriate reminders, tracking, refill assistance, and eventually emergency support.

---

# Proposed Solution

We propose an **AI-assisted Medicine Reminder & Dosage Tracker** that starts with the user's prescription.

### 1. Prescription Upload

The user uploads a **photo/image of their prescription**.

The AI/OCR system extracts information such as:

* Medicine name
* Strength
* Dosage
* Frequency
* Timing
* Duration
* Instructions

The extracted information is displayed to the user for **confirmation and correction** before it is stored.

```text
Prescription Image
        ↓
     AI / OCR
        ↓
Medicine + Dosage + Timing
        ↓
   User Confirmation
        ↓
     Stored in App
```

---

### 2. Medicine Management

Once the prescription is confirmed, the medicines are stored **under that prescription**.

For each medicine, the system maintains its:

* Dosage
* Frequency
* Timing
* Duration
* Quantity
* Expiry information
* Manufacturer/company information

The user can also scan the medicine packaging to help identify these details, with the user confirming the extracted information.

---

### 3. Medicine Reminders

The system creates a schedule from the prescription.

For example:

> **Medicine A — 1 tablet — 8:00 AM**

At 8:00 AM:

**Reminder → User takes medicine → Marks "Taken"**

If the user doesn't confirm the dose within the configured period, the system can send another reminder and, where enabled, alert the caregiver.

---

### 4. Dosage & Adherence Tracking

Every scheduled dose is recorded as:

* **Taken**
* **Missed**
* **Pending**

This creates an adherence history.

The caregiver can therefore see something like:

```text
Today's Medication

Medicine A    ✅ Taken
Medicine B    ❌ Missed
Medicine C    ⏳ Pending
```

This is more useful than simply setting alarms because the application maintains a **history of medication adherence**.

---

### 5. Medicine Stock & Expiry Tracking

The user enters the quantity they currently have.

The system combines:

**Prescription dosage + quantity + doses taken**

to estimate remaining medicine.

For example:

> 30 tablets purchased
> 2 tablets/day
> ≈ 15 days of supply

When the medicine is approaching depletion:

> **"Medicine A may run out in 3 days."**

The system can also warn the user about medicines approaching their expiry date.

---

# Phase 2 — Medicine Delivery

After the core medication tracker is working, we add a **local medicine delivery system**.

When medicine is about to run out:

```text
Medicine running low
        ↓
     Refill Alert
        ↓
Find nearby medical stores
        ↓
Check availability
        ↓
Place refill request/order
        ↓
Medical store confirms
        ↓
       Delivery
```

The key idea is that delivery comes from **nearby medical stores/pharmacies**, rather than building another dark-store inventory network.

---

# Phase 3 — SOS / Emergency Assistance

The final layer is an **SOS system**.

The user can trigger an emergency request from the application.

```text
             SOS
              ↓
      Emergency Request
              ↓
    Location + User Details
              ↓
       ┌──────┴──────┐
       ↓             ↓
   Caregiver      Ambulance/
     Alert        Emergency Help
```

With appropriate consent, relevant medication information can also be made available to the caregiver/emergency workflow.

---

# Complete Concept

The complete system can therefore be summarized as:

```text
             PRESCRIPTION
                  ↓
             AI / OCR
                  ↓
          USER CONFIRMATION
                  ↓
          MEDICINE DATABASE
                  ↓
       ┌──────────┼──────────┐
       ↓          ↓          ↓
   REMINDERS   ADHERENCE   INVENTORY
       │          │          │
       │          │          ↓
       │          │      RUNNING LOW
       │          │          ↓
       │          │       REFILL
       │          │          ↓
       │          │     LOCAL PHARMACY
       │          │          ↓
       │          │       DELIVERY
       │          │
       └──────────┴──────┐
                         ↓
                  CAREGIVER VIEW
                         │
                         ↓
                       SOS
```

### In one sentence

**We are building an AI-assisted medication management platform that converts prescriptions into personalized medicine schedules, tracks dosage adherence and medicine inventory, helps users refill medicines through nearby medical stores, allows caregivers to monitor adherence, and eventually provides an SOS/emergency assistance layer.**

The important distinction is that **the reminder tracker is the core product; delivery and SOS are extensions built on top of the medication data and user workflow.**