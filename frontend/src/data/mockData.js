export const user = {
  name: 'Hem Ranjan',
  greeting: 'Hem',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
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
    icon: 'calendar',
  },
  {
    id: 'taken',
    label: 'Taken',
    value: 3,
    subtitle: 'Doses completed',
    tone: 'taken',
    icon: 'check',
  },
  {
    id: 'missed',
    label: 'Missed',
    value: 0,
    subtitle: 'Doses missed',
    tone: 'missed',
    icon: 'cross',
  },
  {
    id: 'adherence',
    label: 'Adherence',
    value: '95%',
    subtitle: 'This week',
    tone: 'adherence',
    icon: 'link',
    hasSparkline: true,
  },
];

export const initialSchedule = [
  {
    id: 1,
    time: '8:00 AM',
    name: 'Multivitamin',
    strength: '',
    instructions: 'After Breakfast',
    status: 'taken',
  },
  {
    id: 2,
    time: '1:30 PM',
    name: 'Calcium 500mg',
    strength: '',
    instructions: 'After Lunch',
    status: 'taken',
  },
  {
    id: 3,
    time: '8:30 PM',
    name: 'Magnesium 250mg',
    strength: '',
    instructions: 'After Dinner',
    status: 'taken',
  },
];

export const adherenceData = [
  { day: 'Mon', value: 80 },
  { day: 'Tue', value: 90 },
  { day: 'Wed', value: 85 },
  { day: 'Thu', value: 95 },
  { day: 'Fri', value: 90 },
  { day: 'Sat', value: 95 },
  { day: 'Sun', value: 95 },
];

export const caregiver = {
  name: 'Ravi Kumar',
  relation: 'Son',
  status: 'Connected',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
};

export const nextRefill = {
  name: 'Magnesium 250mg',
  daysLeft: '7 days left',
};

export const expiryAlert = {
  name: 'Magnesium 250mg',
  strength: '',
  daysLeft: 7,
};

export const healthTip = {
  title: 'Health Tip',
  message: 'Stay consistent with your medication routine.',
};

export const notifications = [
  {
    id: 1,
    title: 'Upcoming dose',
    message: 'Magnesium 250mg is scheduled for 8:30 PM.',
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
    message: 'Magnesium 250mg refilling in 7 days.',
    time: '2d ago',
    unread: false,
  },
];

