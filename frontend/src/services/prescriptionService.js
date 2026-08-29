const DEMO_PRESCRIPTION_MEDICINES = [
  {
    id: 'demo-1',
    name: 'Dolo 650',
    genericName: 'Paracetamol',
    strength: '650 mg',
    dose: '1 Tablet',
    frequency: 'Twice daily',
    times: ['08:00 AM', '08:00 PM'],
    instructions: 'After meals',
    durationDays: 5,
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    confidence: 97,
    needsVerification: false,
  },
  {
    id: 'demo-2',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    strength: '500 mg',
    dose: '1 Capsule',
    frequency: 'Three times daily',
    times: ['08:00 AM', '02:00 PM', '08:00 PM'],
    instructions: 'Before meals',
    durationDays: 7,
    expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    confidence: 94,
    needsVerification: false,
  },
];

export async function analyzePrescription(file, onProgress) {
  const steps = [
    { message: 'Uploading prescription image…', progress: 20 },
    { message: 'Scanning for medicines and dosage instructions…', progress: 55 },
    { message: 'Extracting schedule and expiries…', progress: 85 },
    { message: 'Reviewing parsed entries…', progress: 100 },
  ];

  for (const step of steps) {
    onProgress?.(step);
    await new Promise((resolve) => setTimeout(resolve, 180));
  }

  return {
    medicines: DEMO_PRESCRIPTION_MEDICINES,
    source: 'demo-sample',
    warning: 'This is a local demo parse. Connect the backend OCR service for real prescription processing.',
  };
}

export function saveConfirmedMedicines(medicines) {
  const storageKey = 'meditrack_confirmed_medicines';
  localStorage.setItem(storageKey, JSON.stringify(medicines));
  return true;
}
