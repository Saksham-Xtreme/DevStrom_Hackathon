import { medicineApi } from '../api/client';

// NOTE: The OCR backend endpoint is not part of this refactor.
// We no longer return hardcoded/seeded medicines. When a real OCR
// service is connected, replace the body of analyzePrescription with a
// backend call. Saving always goes to MongoDB via the medicine API.
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
    medicines: [],
    source: 'none',
    warning:
      'OCR prescription parsing is not available in this environment. Add medicines manually from the Medicines page.',
  };
}

export async function saveConfirmedMedicines(medicines) {
  if (!Array.isArray(medicines) || medicines.length === 0) {
    return false;
  }

  await Promise.all(
    medicines.map((medicine) =>
      medicineApi.create({
        name: medicine.name,
        genericName: medicine.genericName,
        strength: medicine.strength,
        category: medicine.category || 'Prescription',
        frequency: medicine.frequency,
        dosage: medicine.strength,
        form: medicine.form || 'tablet',
        instructions: medicine.instructions,
        startDate: medicine.startDate,
        endDate: medicine.endDate || '',
        expiryDate: medicine.expiryDate || '',
        times: medicine.times || ['08:00 AM'],
        dose: medicine.dose || '1 Tablet',
        stock: medicine.stock ?? 0,
      })
    )
  );

  return true;
}
