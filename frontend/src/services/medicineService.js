import { medicineApi } from '../api/client';

export async function fetchMedicines() {
    const response = await medicineApi.list();
    return response.data || [];
}

export async function fetchMedicine(id) {
    const response = await medicineApi.getOne(id);
    return response.data;
}

export async function createMedicine(medicine) {
    const response = await medicineApi.create(medicine);
    return response.data;
}

export async function updateMedicine(id, medicine) {
    const response = await medicineApi.update(id, medicine);
    return response.data;
}

export async function deleteMedicine(id) {
    const response = await medicineApi.remove(id);
    return response.data;
}

// Pure helper — used by UI to render expiry badges from a real expiryDate.
export function getExpiryCategory(expiryDate) {
    if (!expiryDate) {
        return { type: 'unknown', label: 'No expiry' };
    }

    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { type: 'expired', label: 'Expired' };
    if (diffDays <= 14) return { type: 'expiring_soon', label: `${diffDays} days left` };
    if (diffDays <= 30) return { type: 'approaching', label: `${diffDays} days left` };
    return { type: 'healthy', label: `${diffDays} days left` };
}

export function buildDoseEntries(medicines) {
    const entries = [];

    medicines.forEach((medicine) => {
        const times = Array.isArray(medicine.times) ? medicine.times : [];
        times.forEach((time) => {
            entries.push({
                id: medicine.id,
                scheduleId: medicine.id,
                medicineId: medicine.id,
                name: medicine.name,
                strength: medicine.strength,
                instructions: medicine.instructions,
                dose: medicine.dose,
                time,
                status: 'upcoming',
            });
        });
    });

    return entries;
}
