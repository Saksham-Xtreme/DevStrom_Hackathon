export const user = {
  name: 'Ansh Kumar',
  greeting: 'Ansh',
};

export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'medicines', label: 'Medicines', icon: 'pill' },
  { id: 'reminders', label: 'Reminders', icon: 'bell' },
  { id: 'adherence', label: 'Adherence', icon: 'chart' },
  { id: 'caregivers', label: 'Caregivers', icon: 'users' },
  { id: 'reports', label: 'Reports', icon: 'file' },
  { id: 'prescriptions', label: 'Prescriptions', icon: 'upload' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

export const mobileNavItems = [
  { id: 'dashboard', label: 'Home', icon: 'grid' },
  { id: 'medicines', label: 'Meds', icon: 'pill' },
  { id: 'reminders', label: 'Alerts', icon: 'bell' },
  { id: 'adherence', label: 'Stats', icon: 'chart' },
  { id: 'settings', label: 'More', icon: 'settings' },
];

export const stats = [
  {
    id: 'today',
    label: "Today's Medicines",
    value: 3,
    subtitle: 'Upcoming doses',
    tone: 'primary',
  },
  {
    id: 'taken',
    label: 'Taken',
    value: 2,
    subtitle: 'Doses completed',
    tone: 'taken',
  },
  {
    id: 'missed',
    label: 'Missed',
    value: 0,
    subtitle: 'Doses missed',
    tone: 'missed',
  },
  {
    id: 'adherence',
    label: 'Adherence',
    value: '95%',
    subtitle: 'This week',
    tone: 'adherence',
  },
];

export const initialSchedule = [
  {
    id: 1,
    time: '8:00 AM',
    name: 'Multivitamin',
    strength: '',
    instructions: 'After breakfast',
    status: 'taken',
  },
  {
    id: 2,
    time: '1:30 PM',
    name: 'Calcium',
    strength: '500 mg',
    instructions: 'After lunch',
    status: 'taken',
  },
  {
    id: 3,
    time: '8:30 PM',
    name: 'Magnesium',
    strength: '250 mg',
    instructions: 'After dinner',
    status: 'upcoming',
  },
];

export const adherenceData = [
  { day: 'Mon', value: 100 },
  { day: 'Tue', value: 100 },
  { day: 'Wed', value: 80 },
  { day: 'Thu', value: 100 },
  { day: 'Fri', value: 100 },
  { day: 'Sat', value: 90 },
  { day: 'Sun', value: 95 },
];

export const caregiver = {
  name: 'Ravi Kumar',
  relation: 'Son',
  status: 'Connected',
};

export const expiryAlert = {
  name: 'Atorvastatin',
  strength: '10 mg',
  daysLeft: 5,
};

export const healthTip = {
  title: 'Health Tip',
  message: 'Stay consistent with your medication routine.',
};

export const notifications = [
  {
    id: 1,
    title: 'Upcoming dose',
    message: 'Magnesium 250 mg is scheduled for 8:30 PM.',
    time: '2h ago',
    unread: true,
  },
  {
    id: 2,
    title: 'Weekly summary',
    message: 'Your adherence this week is 95%. Great work.',
    time: '1d ago',
    unread: true,
  },
  {
    id: 3,
    title: 'Refill reminder',
    message: 'Atorvastatin expires in 5 days.',
    time: '2d ago',
    unread: false,
  },
];
