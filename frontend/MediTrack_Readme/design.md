# MediTrack — Design System

## 1. Visual Direction

Use the green / soft teal healthcare dashboard as the primary reference.

The desired feeling is:

- Calm
- Trustworthy
- Professional
- Healthcare-focused
- Friendly
- Modern
- Premium
- Clean

Do not copy the reference pixel-for-pixel. Use it as visual direction.

## 2. Color Palette

### Core

| Token | Hex | Usage |
|---|---|---|
| Primary Green | #2F8F70 | Main actions, active states |
| Dark Green | #176B55 | Strong accents, dark UI areas |
| Light Green | #E8F5EF | Soft backgrounds, selected states |
| Background | #F7FAF8 | Application background |
| Surface | #FFFFFF | Cards and panels |
| Primary Text | #172B24 | Main text |
| Secondary Text | #65756E | Supporting text |

### Status

| Status | Color | Usage |
|---|---|---|
| Taken | #2F8F70 | Completed dose |
| Upcoming | #3B82A0 | Scheduled dose |
| Expiring Soon | #D99A3D | 0–7 days |
| Missed | #D95C5C | Missed dose |

Use status colors consistently and never rely on color alone.

## 3. Layout

### Desktop

┌──────────────┬───────────────────────────────┐
│              │ Header                        │
│   Sidebar    ├───────────────────────────────┤
│              │ Dashboard content             │
│              │                               │
│              │ Cards / Schedule / Charts     │
└──────────────┴───────────────────────────────┘

### Mobile

Use:

- Compact header
- Stacked content
- Touch-friendly buttons
- Bottom navigation or compact navigation
- Cards that remain readable without horizontal scrolling

## 4. Dashboard Hierarchy

Recommended order:

1. Greeting/header
2. Statistics
3. Important alerts
4. Today's Schedule
5. Adherence Overview
6. Caregiver
7. Expiry information
8. Health Tip / secondary actions

Important medication information should remain above decorative content.

## 5. Cards

Cards should:

- Have clear titles
- Use moderate corner radius
- Have subtle borders/shadows
- Maintain consistent internal spacing
- Avoid excessive decoration

## 6. Typography

Use a modern, highly readable sans-serif typeface.

Hierarchy:

Page title
   ↓
Section title
   ↓
Card title
   ↓
Body text
   ↓
Metadata

Avoid oversized headings that consume useful dashboard space.

## 7. Icons

Prefer a consistent icon family such as Lucide React.

Icons should support meaning rather than replace labels.

## 8. Buttons

Primary action:

- Green
- High contrast
- Clear label

Secondary action:

- Neutral or light-green treatment
- Less visual weight

Destructive actions should use the semantic danger color only when appropriate.

## 9. Motion

Use subtle transitions for:

- Hover
- Focus
- Status changes
- Notification panels
- Walkthrough transitions
- Upload processing

Avoid unnecessary animations.

## 10. Design Reference

The selected visual direction is the bottom-right green MediSync-style dashboard from the team's reference image.

Brand it as:

MediTrack

Do not retain the reference brand name.