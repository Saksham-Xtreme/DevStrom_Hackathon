# DevStrom API Reference Guide

Welcome to the DevStrom API documentation! This guide is designed for the frontend developer to easily reference active backend APIs, understand planned endpoints, and align state structures with backend models.

---

## 1. System Configuration & Conventions

### Base URL
- **Local Development**: `http://localhost:8080`
- **Headers**:
  - `Content-Type: application/json`
  - `Accept: application/json`

### Authentication Scheme
The backend supports two authentication mechanisms:
1. **Google OAuth 2.0 (Active)**: Initiated via redirection, results in user session data returned to the callback.
2. **JSON Web Tokens (JWT) / OTP (Planned)**: For password/OTP based authentication. When implemented, subsequent requests must include a Bearer token:
   ```http
   Authorization: Bearer <your_jwt_token>
   ```

---

## 2. Currently Implemented Endpoints

These endpoints are fully functional and can be called directly by the frontend.

### 2.1. Health Check
* **Endpoint**: `GET /`
* **Auth Required**: No
* **Description**: Verifies that the Express API backend is running and connected.
* **Response (200 OK)**:
  ```json
  {
    "message": "Backend is working!"
  }
  ```

---

### 2.2. Start Google OAuth Flow
* **Endpoint**: `GET /api/auth/google`
* **Auth Required**: No
* **Description**: Initiates the Google OAuth 2.0 login. Redirects the client's browser to the Google Sign-in screen.
* **Requested Scopes**: `profile`, `email`
* **Action**: Anchor tag link or `window.location.href` to start:
  ```html
  <a href="http://localhost:8080/api/auth/google">Login with Google</a>
  ```

---

### 2.3. Google OAuth Callback
* **Endpoint**: `GET /api/auth/google/callback`
* **Auth Required**: No
* **Description**: Redirect target for Google OAuth. Once authenticated, returns success status and user details.
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Google authentication successful",
    "user": {
      "_id": "67f1858a7ab29cd3ef4001a1",
      "email": "devstrom.user@example.com",
      "name": "Saksham Tripathi",
      "profileImage": "https://lh3.googleusercontent.com/a/ALm5wu0...",
      "authProvider": "google",
      "googleId": "10839209849204820",
      "emailVerified": true,
      "isActive": true,
      "role": "patient",
      "lastLoginAt": "2026-08-29T05:33:00.000Z",
      "createdAt": "2026-08-29T05:33:00.000Z",
      "updatedAt": "2026-08-29T05:33:00.000Z"
    }
  }
  ```
* **Failure Redirection**: In case of failure, automatically redirects the client browser to `/api/auth/login-failed`.

---

### 2.4. OAuth Login Failure
* **Endpoint**: `GET /api/auth/login-failed`
* **Auth Required**: No
* **Description**: Redirection endpoint hit in case Google OAuth authentication fails.
* **Response (401 Unauthorized)**:
  ```json
  {
    "success": false,
    "message": "Google authentication failed"
  }
  ```

---

## 3. Planned/Upcoming Endpoints (Phase 1 & 2)

The following endpoints are drafted as part of the architecture blueprint. The frontend developer can use these JSON mocks to design components, handle states, and set up services.

### 3.1. Extended Authentication / OTP (Planned)

#### Send OTP
* **Endpoint**: `POST /api/auth/send-otp`
* **Auth Required**: No
* **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "OTP sent successfully to email"
  }
  ```

#### Verify OTP
* **Endpoint**: `POST /api/auth/verify-otp`
* **Auth Required**: No
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "otp": "123456"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "OTP verified successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### Set Password (First-time user or Reset)
* **Endpoint**: `POST /api/auth/set-password`
* **Auth Required**: Yes (Bearer Token)
* **Request Body**:
  ```json
  {
    "password": "SecurePassword123"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Password updated successfully"
  }
  ```

---

### 3.2. Prescription Upload & AI Parsing (Planned)

> [!NOTE]
> For better scaling and handling API response delays, the prescription OCR process runs asynchronously.
> 1. Upload prescription (`POST /api/prescriptions/upload`) -> Returns `202 Accepted` with a Job ID.
> 2. Poll for status (`GET /api/prescriptions/:id/status`) -> Wait for state to change to `READY`.
> 3. Confirm the parsed items (`POST /api/prescriptions/:id/confirm`).

#### Upload Prescription Image
* **Endpoint**: `POST /api/prescriptions/upload`
* **Auth Required**: Yes (Bearer Token)
* **Request Format**: `multipart/form-data`
* **Body Parameters**:
  - `prescription`: File (Image/PDF, max 10MB)
* **Response (202 Accepted)**:
  ```json
  {
    "success": true,
    "prescriptionId": "pres_92738491823",
    "status": "PROCESSING",
    "message": "Prescription uploaded successfully. AI parsing in progress."
  }
  ```

#### Get Prescription Details & Parser Status
* **Endpoint**: `GET /api/prescriptions/:id/status`
* **Auth Required**: Yes (Bearer Token)
* **Path Parameters**:
  - `id`: The prescription ID (e.g., `pres_92738491823`)
* **Response (200 OK - Processing)**:
  ```json
  {
    "prescriptionId": "pres_92738491823",
    "status": "PROCESSING"
  }
  ```
* **Response (200 OK - Ready)**:
  ```json
  {
    "prescriptionId": "pres_92738491823",
    "status": "READY",
    "imageUrl": "https://cloudinary.com/prescriptions/pres_92738491823.jpg",
    "extractedData": {
      "medicines": [
        {
          "name": "Dolo 650",
          "strength": "650mg",
          "dosage": "1 tablet",
          "frequency": "2 times a day",
          "timing": ["morning", "night"],
          "duration": "5 days",
          "instructions": "After meals"
        },
        {
          "name": "Amoxicillin",
          "strength": "500mg",
          "dosage": "1 capsule",
          "frequency": "3 times a day",
          "timing": ["morning", "afternoon", "night"],
          "duration": "7 days",
          "instructions": "Before meals"
        }
      ]
    }
  }
  ```

#### Confirm Parsed Data
* **Endpoint**: `POST /api/prescriptions/:id/confirm`
* **Auth Required**: Yes (Bearer Token)
* **Description**: Submits the final edited/confirmed medicines from the frontend. This saves the schedule and starts generating dose events.
* **Request Body**:
  ```json
  {
    "medicines": [
      {
        "name": "Dolo 650",
        "strength": "650mg",
        "dosage": "1 tablet",
        "frequency": "twice daily",
        "timing": ["08:00", "20:00"],
        "duration": "5 days",
        "instructions": "After meals",
        "initialStock": 30
      }
    ]
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Prescription details confirmed and dosage schedule generated.",
    "schedulesCreated": 1
  }
  ```

---

### 3.3. Dose Management & Adherence Tracker (Planned)

#### Get Today's Doses
* **Endpoint**: `GET /api/doses/today`
* **Auth Required**: Yes (Bearer Token)
* **Description**: Returns all pending, taken, or missed dose events for the current day.
* **Response (200 OK)**:
  ```json
  {
    "date": "2026-08-29",
    "doses": [
      {
        "id": "dose_111",
        "medicineName": "Dolo 650",
        "strength": "650mg",
        "scheduledTime": "2026-08-29T08:00:00.000Z",
        "status": "TAKEN",
        "takenAt": "2026-08-29T08:05:22.000Z"
      },
      {
        "id": "dose_222",
        "medicineName": "Amoxicillin",
        "strength": "500mg",
        "scheduledTime": "2026-08-29T14:00:00.000Z",
        "status": "PENDING",
        "takenAt": null
      },
      {
        "id": "dose_333",
        "medicineName": "Dolo 650",
        "strength": "650mg",
        "scheduledTime": "2026-08-29T20:00:00.000Z",
        "status": "PENDING",
        "takenAt": null
      }
    ]
  }
  ```

#### Mark Dose as Taken
* **Endpoint**: `POST /api/doses/:id/taken`
* **Auth Required**: Yes (Bearer Token)
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "doseId": "dose_222",
    "status": "TAKEN",
    "takenAt": "2026-08-29T14:02:11.000Z"
  }
  ```

#### Mark Dose as Missed / Skipped
* **Endpoint**: `POST /api/doses/:id/missed`
* **Auth Required**: Yes (Bearer Token)
* **Request Body** (optional):
  ```json
  {
    "reason": "Felt better"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "doseId": "dose_222",
    "status": "MISSED",
    "reason": "Felt better"
  }
  ```

---

### 3.4. Adherence Reports & Summary (Planned)

#### Adherence Summary
* **Endpoint**: `GET /api/adherence/summary`
* **Auth Required**: Yes (Bearer Token)
* **Description**: Returns adherence metrics (percentage of taken vs missed) over recent periods.
* **Response (200 OK)**:
  ```json
  {
    "overallRate": 85.7,
    "takenCount": 18,
    "missedCount": 3,
    "pendingCount": 1,
    "consecutiveDays": 12
  }
  ```

---

### 3.5. Medicine Stock & Inventory (Planned)

#### Get Current Inventory
* **Endpoint**: `GET /api/inventory`
* **Auth Required**: Yes (Bearer Token)
* **Description**: Lists user's current medicine stocks, calculated depletion dates, and warnings.
* **Response (200 OK)**:
  ```json
  {
    "inventory": [
      {
        "medicineName": "Dolo 650",
        "currentStock": 10,
        "dailyDose": 2,
        "daysRemaining": 5,
        "status": "LOW_STOCK",
        "expiryDate": "2028-11-30T00:00:00.000Z"
      }
    ]
  }
  ```

#### Update Stock Manually
* **Endpoint**: `POST /api/inventory`
* **Auth Required**: Yes (Bearer Token)
* **Request Body**:
  ```json
  {
    "medicineName": "Dolo 650",
    "quantityToAdd": 30
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "medicineName": "Dolo 650",
    "newStock": 40,
    "daysRemaining": 20
  }
  ```

---

### 3.6. Caregiver Relationships (Planned)

#### Invite Caregiver
* **Endpoint**: `POST /api/caregivers/invite`
* **Auth Required**: Yes (Bearer Token)
* **Request Body**:
  ```json
  {
    "caregiverEmail": "caregiver@example.com",
    "relationshipType": "family"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Invitation sent to caregiver email",
    "invitationId": "invite_584920"
  }
  ```

#### Get Caregivers / Patients List
* **Endpoint**: `GET /api/caregivers`
* **Auth Required**: Yes (Bearer Token)
* **Description**: Returns all established links. If logged in as patient, returns their caregivers. If logged in as caregiver, returns their patients.
* **Response (200 OK)**:
  ```json
  {
    "role": "patient",
    "caregivers": [
      {
        "id": "user_care_1",
        "name": "Jane Doe",
        "email": "caregiver@example.com",
        "status": "ACTIVE"
      }
    ]
  }
  ```

---

### 3.7. Alerts & Emergency SOS System (Planned)

#### Get Current Alerts
* **Endpoint**: `GET /api/alerts`
* **Auth Required**: Yes (Bearer Token)
* **Response (200 OK)**:
  ```json
  {
    "alerts": [
      {
        "id": "alert_991",
        "type": "MISSED_DOSES",
        "message": "Patient missed 2 consecutive doses of Amoxicillin",
        "severity": "HIGH",
        "createdAt": "2026-08-29T05:00:00.000Z",
        "acknowledged": false
      }
    ]
  }
  ```

#### Acknowledge Alert
* **Endpoint**: `POST /api/alerts/:id/acknowledge`
* **Auth Required**: Yes (Bearer Token)
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "alertId": "alert_991",
    "acknowledged": true
  }
  ```

#### Trigger Emergency SOS
* **Endpoint**: `POST /api/sos`
* **Auth Required**: Yes (Bearer Token)
* **Description**: Broadcasts emergency alert to connected caregivers and local services with patient location.
* **Request Body**:
  ```json
  {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "note": "Chest pain, breathing difficulties"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "SOS emergency alert broadcasted successfully",
    "alertId": "sos_739281",
    "notifiedCaregiversCount": 2
  }
  ```

---

## 4. Current Database Schemas (User Model)

For reference when typing properties or formatting models, here is the active Mongoose model structure for the User collection:

### `User` Entity Schema
| Field | Type | Required | Options / Enums / Default | Description |
|---|---|---|---|---|
| `email` | `String` | Yes | Unique, lowercase, trimmed | User's identity and communication address. |
| `name` | `String` | Yes | Trimmed | User's full display name. |
| `profileImage` | `String` | No | Default: `null` | URL path to their profile photo. |
| `authProvider` | `String` | Yes | `["google", "email"]` | Identity provider type. |
| `googleId` | `String` | No | Unique, sparse, Default: `null` | Google-specific account id. |
| `emailVerified` | `Boolean` | No | Default: `false` | True if verified via OAuth or OTP. |
| `passwordHash` | `String` | No | Default: `null` | Hashed password (empty for pure Google OAuth users). |
| `isActive` | `Boolean` | No | Default: `true` | Status toggle for user account activity. |
| `role` | `String` | No | `["patient", "caregiver"]`, Default: `"patient"` | App role representing user type. |
| `lastLoginAt` | `Date` | No | Default: `null` | Datetime timestamp of the last login session. |
| `createdAt` | `Date` | No | Automatically set (timestamps) | Creation timestamp. |
| `updatedAt` | `Date` | No | Automatically set (timestamps) | Last modification timestamp. |

---

## 5. Development Integration Tips

1. **Handling Cookies/Headers in Axios**:
   Ensure `withCredentials` is configured appropriately when making CORS requests to the local Express backend, or attach the auth headers inside your network interceptor:
   ```javascript
   import axios from 'axios';

   const api = axios.create({
     baseURL: 'http://localhost:8080',
     headers: {
       'Content-Type': 'application/json'
     }
   });

   // Attach token automatically if saved in localStorage
   api.interceptors.request.use((config) => {
     const token = localStorage.getItem('authToken');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });

   export default api;
   ```

2. **CORS Configuration**:
   The backend allows requests originating from `process.env.CLIENT_URL` (usually your frontend dev server, e.g. `http://localhost:5173`). Make sure this is set in the backend `.env` configuration.
