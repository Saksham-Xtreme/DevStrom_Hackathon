Yes. We should treat **Resend** and **Google Cloud Document AI** as two completely different services in the same application:

* **Resend → authentication/notifications**
* **Google Document AI → prescription OCR/document processing**

They are not alternatives to each other.

# 1. Final technology architecture

For our project, I recommend:

```text
                     ┌─────────────────────┐
                     │      React          │
                     │      Frontend       │
                     └──────────┬──────────┘
                                │
                           HTTP / JSON
                                │
                                ▼
                     ┌─────────────────────┐
                     │ Node.js + Express   │
                     │     Backend         │
                     └──────────┬──────────┘
                                │
        ┌───────────────────────┼────────────────────────┐
        │                       │                        │
        ▼                       ▼                        ▼
   PostgreSQL                Resend              Google Document AI
        │                       │                        │
        │                       │                        │
   App data                 Email OTP                Prescription
                             Alerts                     OCR
        │
        ▼
 Redis + BullMQ
        │
        ├── Medication reminders
        ├── Background jobs
        ├── Refill checks
        └── Notifications
```

Later:

```text
                       Node.js Backend
                              │
            ┌─────────────────┼────────────────┐
            ▼                 ▼                ▼
        Pharmacy          Maps/Location       SOS
        Network              API             Service
```

---

# 2. What Resend does

Resend is our **email delivery service**.

For example:

```text
User
 │
 │ enters email
 ▼
React
 │
 ▼
Node.js
 │
 ├── generate OTP
 ├── save hashed OTP
 └── call Resend
          │
          ▼
       Email
          │
          ▼
        User
```

Resend provides an official Node.js SDK, and its documentation specifically supports Express/Node.js applications. ([Resend][1])

We can use it for:

```text
✓ Signup OTP
✓ Forgot-password OTP
✓ Password reset
✓ Medication reminder emails, if needed
✓ Refill notifications
✓ Caregiver alerts
✓ Order notifications
```

For push reminders, we'd eventually use a push-notification system rather than relying entirely on email.

---

# 3. What Google Document AI does

Google Document AI handles the **prescription image**.

Example:

```text
User uploads:

prescription.jpg
       ↓
Node.js
       ↓
Google Document AI
       ↓
OCR
       ↓
Detected text + document information
```

Google currently lists the **Enterprise Document OCR Processor** at **$0 for 0–1,000 pages/month**, then $1.50 per 1,000 pages in the next pricing tier. ([Google Cloud][2])

There is an important caveat: other Document AI processors such as Form Parser, Custom Extractor, and Layout Parser have separate pricing. ([Google Cloud][2])

So for our initial implementation, we should start with **Enterprise Document OCR**, rather than assuming every Document AI feature is free.

---

# 4. How Google Document AI is connected

First we create a Google Cloud project.

Google's current setup requires us to:

```text
Google Cloud Project
        ↓
Enable Document AI API
        ↓
Configure billing
        ↓
Create processor
        ↓
Get processor ID
        ↓
Configure authentication
        ↓
Node.js uses Google Cloud client library
```

Google's setup documentation explicitly requires a Google Cloud project, the Document AI API enabled, billing configured, and appropriate authentication/IAM. ([Google Cloud Documentation][3])

The Node.js client is officially supported:

```bash
npm install @google-cloud/documentai
```

Google provides a Node.js sample for processing a document using a Document AI processor. ([Google Cloud Documentation][4])

---

# 5. Actual prescription workflow

This is the most important part of the project.

### Step 1 — Upload

Frontend:

```text
┌─────────────────────────┐
│ Upload Prescription     │
│                         │
│       [ Upload ]        │
└─────────────────────────┘
```

React sends:

```text
POST /api/prescriptions/upload
```

to Node.js.

---

### Step 2 — Node.js receives the image

Backend does:

```text
Receive image
   ↓
Validate file type
   ↓
Validate file size
   ↓
Store image
   ↓
Send image to Document AI
```

We should not send arbitrary files straight into the AI service without validation.

---

### Step 3 — Document AI processes it

```text
Prescription image
        ↓
Google Document AI
        ↓
OCR result
```

The API can return document text and structural information.

Google's API supports synchronous processing and also batch processing for larger documents; synchronous processing has page limits, so our typical one-page prescription is well within the intended use case. ([Google Cloud][2])

---

# 6. OCR is NOT the final answer

This is critical.

Suppose Document AI returns:

```text
Dr. Sharma

Tab. ABC 500
1-0-1
5 days

Cap. XYZ
0-1-0
7 days
```

OCR has done its job.

But we still need to convert this into:

```json
{
  "medicines": [
    {
      "name": "ABC",
      "strength": "500 mg",
      "dosage": "1 tablet",
      "frequency": "twice daily",
      "timing": ["morning", "night"],
      "duration": "5 days"
    },
    {
      "name": "XYZ",
      "dosage": "1 capsule",
      "frequency": "once daily",
      "timing": ["afternoon"],
      "duration": "7 days"
    }
  ]
}
```

So:

**OCR ≠ prescription understanding.**

---

# 7. Our AI pipeline

I would make the prescription system:

```text
                 Prescription Image
                        │
                        ▼
                Image Validation
                        │
                        ▼
               Google Document AI
                        │
                        ▼
                OCR / Document Text
                        │
                        ▼
              Prescription Parser
                        │
                        ▼
             Structured JSON
                        │
                        ▼
             Validation / Rules
                        │
                        ▼
                User Confirmation
                        │
                        ▼
                   PostgreSQL
```

The **Prescription Parser** can initially be a separate AI/LLM step or carefully designed parsing logic depending on the OCR output.

---

# 8. User confirmation

This is mandatory in our design.

The AI might produce:

```text
Detected prescription

Medicine:
ABC 500 mg

Dosage:
1 tablet

Frequency:
2 times/day

Duration:
5 days
```

Frontend displays:

```text
┌────────────────────────────────┐
│ ABC 500 mg                     │
│                                │
│ Dosage:     1 tablet           │
│ Frequency:  2 times/day        │
│ Timing:     Morning + Night    │
│ Duration:   5 days             │
│                                │
│ [ Edit ]        [ Confirm ]    │
└────────────────────────────────┘
```

The user can correct the extraction.

Only:

```text
CONFIRM
```

creates the actual medication schedule.

---

# 9. Why this is important

We're dealing with medication information.

Suppose OCR reads:

```text
500 mg
```

as:

```text
50 mg
```

If we automatically create the schedule, that is a serious design flaw.

Instead:

```text
AI/OCR
   ↓
Candidate information
   ↓
Validation
   ↓
USER CONFIRMATION
   ↓
Final prescription data
```

The AI is an **assistant**, not the final authority.

---

# 10. Database after confirmation

Suppose the prescription contains:

```text
Medicine A
1 tablet
2/day
5 days
```

We store:

```text
users
  │
  └── prescriptions
          │
          └── prescription_medicines
                    │
                    ├── dosage
                    ├── frequency
                    ├── timing
                    └── duration
```

Then the backend generates:

```text
dose_events
```

For example:

```text
Day 1  08:00  PENDING
Day 1  20:00  PENDING

Day 2  08:00  PENDING
Day 2  20:00  PENDING

...
```

---

# 11. Reminder system

Now Redis + BullMQ becomes useful.

```text
PostgreSQL
    │
    ▼
Dose events
    │
    ▼
BullMQ / Redis
    │
    ▼
Background Worker
    │
    ▼
Reminder
```

For example:

```text
08:00
 ↓
Take Medicine A
 ↓
User presses TAKEN
 ↓
Backend updates dose event
```

If they don't respond:

```text
PENDING
   ↓
Grace period
   ↓
Still no confirmation
   ↓
MISSED
   ↓
Optional caregiver alert
```

---

# 12. Where Resend enters again

Suppose the user has missed an important scheduled dose and your product configuration says the caregiver should be informed.

Then:

```text
Dose Service
      ↓
Caregiver notification event
      ↓
Notification Service
      ↓
Resend
      ↓
Caregiver email
```

So Resend isn't involved in OCR at all.

It's simply:

```text
                 RESEND
                    │
            ┌───────┴────────┐
            ▼                ▼
       Authentication     Notifications
```

---

# 13. Where Google Cloud enters

Google Cloud is primarily:

```text
             GOOGLE DOCUMENT AI
                      │
                      ▼
             Prescription OCR
                      │
                      ▼
              Text extraction
```

Later we may add other Google services, but **don't add them just because they exist**.

---

# 14. Complete Phase 1

At the end of Phase 1:

```text
                         USER
                           │
                           ▼
                    React Frontend
                           │
                           ▼
                   Node.js Backend
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
       PostgreSQL       Resend         Document AI
          │                │                │
          │                │                ▼
          │                │             OCR
          │                │                │
          │                │                ▼
          │                │          Prescription
          │                │             Parser
          │                │                │
          │                │                ▼
          │                │        User Confirmation
          │                │                │
          └────────────────┴────────────────┘
                           │
                           ▼
                    Medicine Schedule
                           │
                           ▼
                    Redis + BullMQ
                           │
                           ▼
                       Reminder
                           │
                           ▼
                  Taken / Missed
                           │
                           ▼
                      Adherence
                           │
                           ▼
                      Inventory
                           │
                           ▼
                    Caregiver View
```

---

# 15. Then Phase 2 — Delivery

Once the above is stable:

```text
Inventory
    ↓
Medicine running low
    ↓
Refill notification
    ↓
Nearby medical stores
    ↓
Check availability
    ↓
Order
    ↓
Pharmacy confirms
    ↓
Delivery
```

Architecture adds:

```text
Node.js
   │
   ├── Pharmacy Service
   ├── Location Service
   ├── Order Service
   └── Delivery Service
```

---

# 16. Phase 3 — SOS

Then:

```text
                  SOS BUTTON
                      │
                      ▼
                 Node.js API
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       Location    Caregiver   Emergency
                    Alert       Service
```

This should be implemented separately from medication reminders.

---

# 17. The stack I would lock in

### Frontend

```text
React
Vite
React Router
Axios
Tailwind CSS
```

### Backend

```text
Node.js
Express.js
Prisma
PostgreSQL
JWT
Zod
```

### AI / OCR

```text
Google Cloud Document AI
+
Prescription extraction/normalization layer
```

### Background processing

```text
Redis
BullMQ
```

### Email

```text
Resend
```

### Storage

```text
S3-compatible object storage
```

### Later

```text
Maps API
Pharmacy integration
Payment
Push notifications
SOS / emergency integration
```

---

# 18. One thing I would change from our earlier plan

I would **not build a separate Python AI backend right now**.

Keep the core system:

```text
React
  ↓
Node.js
  ↓
Google Document AI
  ↓
PostgreSQL
```

Google already provides a Node.js client for Document AI, so our Node.js backend can communicate with it directly. ([Google Cloud Documentation][4])

That means our initial project has a clean architecture:

**JavaScript everywhere except the managed AI/document-processing service.**

---

# 19. Development order

This is the order I recommend we actually follow:

```text
1. Create GitHub repository
         ↓
2. Create React frontend
         ↓
3. Create Node.js/Express backend
         ↓
4. Connect PostgreSQL + Prisma
         ↓
5. Build Email OTP + Resend
         ↓
6. JWT/session handling
         ↓
7. User dashboard
         ↓
8. Prescription upload
         ↓
9. Google Cloud Document AI
         ↓
10. OCR result processing
         ↓
11. Prescription → structured medicines
         ↓
12. Confirmation UI
         ↓
13. Store prescription + medicines
         ↓
14. Dosage/schedule engine
         ↓
15. Redis + BullMQ
         ↓
16. Reminders
         ↓
17. Taken/Missed tracking
         ↓
18. Inventory + expiry
         ↓
19. Caregiver dashboard
         ↓
20. Refill system
         ↓
21. Local pharmacy delivery
         ↓
22. SOS
```

### The key architectural idea

The **prescription is the starting point**, not the medicine reminder.

```text
          PRESCRIPTION
               ↓
        AI/OCR EXTRACTION
               ↓
       USER CONFIRMATION
               ↓
       MEDICINE INFORMATION
               ↓
        DOSAGE / SCHEDULE
               ↓
          REMINDERS
               ↓
          ADHERENCE
               ↓
          INVENTORY
               ↓
         REFILL / DELIVERY
               ↓
          CAREGIVER
               ↓
             SOS
```

And **Resend sits beside this pipeline**, providing authentication and notification delivery, while **Google Document AI sits at the prescription-ingestion stage**. That separation keeps the architecture understandable and lets us replace either service later without rewriting the whole application. ([Google Cloud][2])

[1]: https://resend.com/docs/send-with-nodejs?utm_source=chatgpt.com "Send emails with Node.js - Resend"
[2]: https://cloud.google.com/products/document-ai/pricing?utm_source=chatgpt.com "Document AI pricing | Google Cloud"
[3]: https://docs.cloud.google.com/document-ai/docs/setup?utm_source=chatgpt.com "Quickstart: Set up the Document AI API  |  Google Cloud Documentation"
[4]: https://docs.cloud.google.com/document-ai/docs/samples/documentai-process-document?utm_source=chatgpt.com "Send an online processing request  |  Document AI  |  Google Cloud Documentation"
