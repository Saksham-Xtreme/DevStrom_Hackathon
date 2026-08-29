Prescription / Medicine Photo
             ↓
            OCR
             ↓
       "Medicine Name"
             ↓
       ┌───────────────┐
       │    DrugDB     │  ← Search Indian brands/composition
       └───────┬───────┘
               ↓
        Medicine found?
          /          \
        YES           NO
         ↓             ↓
     Use data       CDSCO check
                       ↓
                 Recent approval?
                       ↓
                  Add/flag data



Final Architecture

                         USER
                          │
              ┌───────────┴───────────┐
              │                       │
        Add Medicine             Upload Prescription
              │                       │
              │                       ▼
              │                 OCR / Gemini
              │                       │
              │                       ▼
              │              Extract prescription data
              │                       │
              └───────────────┬───────┘
                              ▼
                    Medicine Normalization
                              │
                              ▼
                    Medicine Information DB
                              │
               ┌──────────────┼──────────────┐
               ▼              ▼              ▼
            CDSCO          Composition     Interactions
          Verification      / Strength       Check
               │              │              │
               └──────────────┼──────────────┘
                              ▼
                     Dosage Scheduler
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
                Reminders          Dose Tracking
                    │                   │
                    └─────────┬─────────┘
                              ▼
                         Dashboard


# Core MVP features

Your MVP should have:

User registration/login
Add medicine manually
Upload prescription
OCR prescription
Extract medicine details
Verify medicine
Create dosage schedule
Medication reminders
Mark dose as:
Taken
Skipped
Missed
Medication history
Dashboard
Prescription history