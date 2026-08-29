import { initialSchedule } from '../data/mockData';

const MEDICINE_STORAGE_KEY = 'meditrack_medicines';
const DOSE_STORAGE_KEY = 'meditrack_doses';

const seededMedicines = [
  {
    id: 1,
    name: 'Multivitamin',
    genericName: 'Vitamin Complex',
    strength: '1 tablet',
    dose: '1 Tablet',
    frequency: 'Once daily',
    times: ['08:00 AM'],
    instructions: 'After breakfast',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    category: 'Supplement',
  },
  {
    id: 2,
    name: 'Calcium',
    genericName: 'Calcium Carbonate',
    strength: '500 mg',
    dose: '1 Tablet',
    frequency: 'Twice daily',
    times: ['01:30 PM', '08:30 PM'],
    instructions: 'After meal',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    expiryDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    category: 'Supplement',
  },
  {
    id: 3,
    name: 'Magnesium',
    genericName: 'Magnesium Glycinate',
    strength: '250 mg',
    dose: '1 Capsule',
    frequency: 'Once daily',
    times: ['08:30 PM'],
    instructions: 'After dinner',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    category: 'Supplement',
  },
];

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getDefaultMedicines = () => seededMedicines;

const readMedicines = () => {
  const saved = localStorage.getItem(MEDICINE_STORAGE_KEY);
  if (saved) {
    const parsed = safeParse(saved, null);
    if (Array.isArray(parsed) && parsed.length) {
      return parsed;
    }
  }

  localStorage.setItem(MEDICINE_STORAGE_KEY, JSON.stringify(getDefaultMedicines()));
  return getDefaultMedicines();
};

const writeMedicines = (medicines) => {
  localStorage.setItem(MEDICINE_STORAGE_KEY, JSON.stringify(medicines));
  return medicines;
};

const readDoseStatuses = () => safeParse(localStorage.getItem(DOSE_STORAGE_KEY), {});

const writeDoseStatuses = (map) => {
  localStorage.setItem(DOSE_STORAGE_KEY, JSON.stringify(map));
};

const buildDoseEntries = (medicines) => {
  const statuses = readDoseStatuses();

  const entries = [];
  medicines.forEach((medicine) => {
    const times = Array.isArray(medicine.times) ? medicine.times : [medicine.times];
    times.forEach((time, index) => {
      const doseId = `${medicine.id}-${index}`;
      const date = new Date();
      const [hourString, minuteStringPart] = time.toString().match(/\d+/g) || ['8', '0'];
      const isPM = /PM/i.test(time);
      let hour = Number(hourString);
      if (isPM && hour < 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;
      const minute = Number((minuteStringPart || '0'));
      date.setHours(hour, minute, 0, 0);

      entries.push({
        id: doseId,
        medicineId: medicine.id,
        name: medicine.name,
        strength: medicine.strength,
        instructions: medicine.instructions,
        dose: medicine.dose,
        time: time,
        status: statuses[doseId] || 'upcoming',
        scheduledAt: date.toISOString(),
      });
    });
  });

  return entries.sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
};

export function getAllMedicines() {
  return readMedicines();
}

export function saveMedicine(medicine) {
  const medicines = readMedicines();
  const normalized = {
    ...medicine,
    id: medicine.id ?? Date.now(),
    times: Array.isArray(medicine.times) ? medicine.times : String(medicine.times || '').split(',').map((t) => t.trim()).filter(Boolean),
  };

  const existingIndex = medicines.findIndex((item) => item.id === normalized.id);
  const updated = [...medicines];

  if (existingIndex >= 0) {
    updated[existingIndex] = normalized;
  } else {
    updated.push(normalized);
  }

  return writeMedicines(updated);
}

export function deleteMedicine(id) {
  const medicines = readMedicines().filter((item) => item.id !== Number(id));
  return writeMedicines(medicines);
}

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

export function getDailyDoses() {
  return buildDoseEntries(readMedicines());
}

export function updateDoseStatus(id, status) {
  const statuses = readDoseStatuses();
  statuses[id] = status;
  writeDoseStatuses(statuses);
  return getDailyDoses();
}

export function getWeeklyAdherence() {
  const doses = getDailyDoses();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const result = days.map((day, index) => {
    const relevant = doses.filter((dose) => {
      const dayIndex = new Date(dose.scheduledAt).getDay();
      return dayIndex === ((index + 1) % 7) || dayIndex === ((index + 1) % 7);
    });

    const taken = relevant.filter((dose) => dose.status === 'taken').length;
    const adherence = relevant.length ? Math.round((taken / relevant.length) * 100) : 100;

    return { day, adherence };
  });

  return result;
}

export function getWeeklyAdherenceSummary() {
  const doses = getDailyDoses();
  const total = doses.length || 1;
  const taken = doses.filter((dose) => dose.status === 'taken').length;
  const missed = doses.filter((dose) => dose.status === 'missed').length;
  const skipped = doses.filter((dose) => dose.status === 'skipped').length;

  return {
    total,
    taken,
    missed,
    skipped,
    adherence: Math.round((taken / total) * 100),
  };
}

export function getAdherenceForDate(date = new Date()) {
  const doses = getDailyDoses();
  const total = doses.length;
  const taken = doses.filter((dose) => dose.status === 'taken').length;

  return {
    total,
    taken,
    missed: doses.filter((dose) => dose.status === 'missed').length,
    skipped: doses.filter((dose) => dose.status === 'skipped').length,
    adherence: total ? Math.round((taken / total) * 100) : 0,
    doses,
  };
}

export function getMissedDoseSummary() {
  return getDailyDoses().filter((dose) => ['missed', 'skipped'].includes(dose.status));
}

export function getExpiryAlerts(limit = 3) {
  return readMedicines()
    .map((medicine) => {
      const expiry = getExpiryCategory(medicine.expiryDate);
      return {
        id: medicine.id,
        name: medicine.name,
        strength: medicine.strength,
        daysLeft: expiry.label,
        expiry,
      };
    })
    .slice(0, limit);
}

export function getCaregiverAlerts() {
  const summary = getWeeklyAdherenceSummary();
  return [
    {
      id: 1,
      tone: 'warning',
      title: 'Adherence check',
      message: `Current adherence is ${summary.adherence}% for the week.`,
    },
    {
      id: 2,
      tone: 'info',
      title: 'Refill review',
      message: 'Review refill timing for ongoing therapies.',
    },
  ];
}

export function getDoseActivity(limit = 8) {
  return getDailyDoses()
    .filter((dose) => ['taken', 'skipped', 'missed'].includes(dose.status))
    .slice(0, limit);
}

export function resetDemoData() {
  localStorage.removeItem(MEDICINE_STORAGE_KEY);
  localStorage.removeItem(DOSE_STORAGE_KEY);
  localStorage.setItem(MEDICINE_STORAGE_KEY, JSON.stringify(getDefaultMedicines()));
  return getAllMedicines();
}

export function getDefaultSchedule() {
  return initialSchedule;
}
