# MediTrack — Rules

## 1. General Development Rules

1. Inspect the existing project before changing files.
2. Do not delete working code without a reason.
3. Keep components small and reusable.
4. Avoid one giant React component.
5. Keep API logic outside UI components.
6. Use mock data when the required backend is not ready.
7. Keep the application runnable with npm run dev.
8. Avoid unnecessary dependencies.
9. Follow the existing project configuration unless a change is required.
10. Complete and verify one phase before starting the next.

## 2. Design Rules

- Use the approved green MediTrack theme.
- Maintain consistent spacing, typography, borders, and shadows.
- Do not introduce random colors.
- Do not overuse gradients.
- Do not overuse rounded cards.
- Avoid clutter.
- Prioritize information hierarchy.
- Design mobile layouts intentionally rather than simply shrinking desktop layouts.

## 3. Healthcare Safety Rules

MediTrack is a medication management tool, not a diagnostic or prescribing system.

The UI must not:

- Diagnose a patient.
- Prescribe medication.
- Recommend changing a prescribed dose.
- Tell a patient to stop medication.
- Treat AI extraction as authoritative medical instruction.

AI-extracted information must be reviewable and editable.

For prescription extraction, clearly communicate that the user should verify the extracted medicine, dosage, timing, and other important information.

Expiry dates extracted from images must also be reviewable and editable.

## 4. Reminder Rules

A medicine schedule should generate expected doses according to its configured frequency and times.

Dose states should be explicit:

pending → taken
pending → missed
pending → skipped

A reminder is a notification mechanism, not a medical decision engine.

## 5. Expiry Rules

Use these UI categories:

>30 days      Valid
8–30 days     Expiry Approaching
0–7 days      Expiring Soon
Past date     Expired

These labels are for organizing user-provided medicine information. The application must not make a clinical decision solely from an OCR/AI-read expiry date.

## 6. Accessibility Rules

- Use semantic HTML.
- Provide keyboard focus states.
- Use accessible labels.
- Maintain readable contrast.
- Do not communicate important information using color alone.
- Make touch targets usable on mobile.
- Respect reduced-motion preferences where practical.

## 7. AI Rules

When Gemini is integrated:

1. Send only the information required for the analysis.
2. Validate structured output.
3. Never silently create medication instructions from uncertain extraction.
4. Show extracted values to the user.
5. Allow editing before confirmation.
6. Handle malformed or uncertain responses gracefully.

## 8. Code Quality

Prefer:

Reusable component
      ↓
Clear props
      ↓
Simple state
      ↓
Service boundary

Avoid:

- duplicated markup
- hardcoded repeated values
- deeply nested conditional JSX
- unused dependencies
- console errors
- inaccessible buttons