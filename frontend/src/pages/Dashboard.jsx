import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { medicineApi } from '../api/client';
import {
  fetchMedicines,
  getExpiryCategory,
} from '../services/medicineService';
import Header from '../components/Header';
import Icon from '../components/Icon';
import MobileNav from '../components/MobileNav';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import '../styles/dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [todayDoses, setTodayDoses] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('This Week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has('oauth_success')) {
      url.searchParams.delete('oauth_success');
      window.history.replaceState({}, document.title, url.pathname);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [todayRes, meds] = await Promise.all([
          medicineApi.getToday().catch(() => ({ data: [] })),
          fetchMedicines().catch(() => []),
        ]);
        setTodayDoses(todayRes.data || []);
        setMedicines(meds);
      } catch (err) {
        console.error('Dashboard load failed:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'User';

  const takenCount = todayDoses.filter((d) => d.status === 'TAKEN').length;
  const handledCount = todayDoses.filter((d) =>
    ['TAKEN', 'MISSED', 'SKIPPED'].includes(d.status)
  ).length;
  const missedCount = todayDoses.filter((d) =>
    ['MISSED', 'SKIPPED'].includes(d.status)
  ).length;
  const adherenceValue =
    todayDoses.length > 0
      ? `${Math.round((takenCount / todayDoses.length) * 100)}%`
      : '—';

  const liveStats = [
    {
      id: 'today',
      label: "Today's Medicines",
      value: todayDoses.length,
      subtitle: 'Scheduled doses',
      tone: 'primary',
      icon: 'calendar',
    },
    {
      id: 'taken',
      label: 'Taken',
      value: takenCount,
      subtitle: 'Doses completed',
      tone: 'taken',
      icon: 'check',
    },
    {
      id: 'missed',
      label: 'Missed',
      value: missedCount,
      subtitle: 'Doses missed',
      tone: 'missed',
      icon: 'cross',
    },
    {
      id: 'adherence',
      label: 'Adherence',
      value: adherenceValue,
      subtitle: 'Today',
      tone: 'adherence',
      icon: 'link',
      hasSparkline: true,
    },
  ];

  const filteredSchedule = todayDoses.filter((medicine) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    const haystack = `${medicine.name} ${medicine.strength || ''} ${medicine.instructions || ''} ${medicine.time}`.toLowerCase();
    return haystack.includes(query);
  });

  // Real next-refill: medicine with the soonest expiry among active medicines.
  const refillCandidate = medicines
    .map((m) => ({ medicine: m, expiry: getExpiryCategory(m.expiryDate) }))
    .filter((x) => x.expiry.type !== 'unknown')
    .sort((a, b) => {
      const da = parseInt(a.expiry.label) || 9999;
      const db = parseInt(b.expiry.label) || 9999;
      return da - db;
    })[0];

  function handleAddMedicine() {
    navigate('/medicines');
  }

  return (
    <div className="app-shell">
      <Sidebar activeNav="dashboard" />

      <div className="main-area">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          notificationsOpen={notificationsOpen}
          onToggleNotifications={setNotificationsOpen}
          notifications={[]}
          onAddMedicine={handleAddMedicine}
        />

        <main className="content-scroll">
          <div className="dashboard-shell">
            <section className="dashboard-welcome">
              <h2>Welcome back, {firstName}! 👋</h2>
              <p>Your health, our priority.</p>
            </section>

            <section className="stats-row" aria-label="Medication statistics">
              {liveStats.map((stat) => (
                <StatCard
                  key={stat.id}
                  label={stat.label}
                  value={stat.value}
                  subtitle={stat.subtitle}
                  tone={stat.tone}
                  icon={stat.icon}
                  hasSparkline={stat.hasSparkline}
                />
              ))}
            </section>

            <div className="dashboard-panel-grid">
              <section className="card schedule-panel" aria-labelledby="schedule-title">
                <div className="panel-header">
                  <h2 id="schedule-title">Today's Schedule</h2>
                  <button type="button" className="panel-link" onClick={() => navigate('/medicines')}>
                    View all
                  </button>
                </div>

                <div className="schedule-list">
                  {loading ? (
                    <div className="schedule-empty">Loading your schedule…</div>
                  ) : filteredSchedule.length === 0 ? (
                    <div className="schedule-empty">
                      {todayDoses.length === 0
                        ? 'No doses scheduled for today. Add a medicine to get started.'
                        : 'No medicines match your search.'}
                    </div>
                  ) : (
                    filteredSchedule.map((medicine) => (
                      <div key={medicine.id} className="schedule-item">
                        <div className="schedule-item__left">
                          <span className="schedule-item__time">{medicine.time}</span>
                          <div className="schedule-item__info">
                            <h3>{medicine.name} {medicine.strength || ''}</h3>
                            <p>{medicine.instructions || 'Daily dose'}</p>
                          </div>
                        </div>

                        <div className="schedule-item__right">
                          <span className={`status-badge status-badge--${medicine.status || 'upcoming'}`}>
                            {medicine.status ? medicine.status.charAt(0).toUpperCase() + medicine.status.slice(1) : 'Upcoming'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="card adherence-panel" aria-labelledby="adherence-title">
                <div className="panel-header">
                  <h2 id="adherence-title">Adherence Overview</h2>
                  <select
                    className="panel-select"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    aria-label="Adherence timeframe"
                  >
                    <option value="This Week">This Week</option>
                    <option value="This Month">This Month</option>
                  </select>
                </div>

                <div className="wave-chart-container" aria-label="Weekly adherence wave chart">
                  <div className="wave-chart-yaxis">
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                    <span>0%</span>
                  </div>

                  <div className="wave-chart-body">
                    <svg viewBox="0 0 400 130" preserveAspectRatio="none" className="wave-chart-svg">
                      <defs>
                        <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#107c56" stopOpacity="0.22" />
                          <stop offset="100%" stopColor="#107c56" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      <line x1="0" y1="10" x2="400" y2="10" stroke="#ebf2ee" strokeDasharray="3 3" />
                      <line x1="0" y1="40" x2="400" y2="40" stroke="#ebf2ee" strokeDasharray="3 3" />
                      <line x1="0" y1="70" x2="400" y2="70" stroke="#ebf2ee" strokeDasharray="3 3" />
                      <line x1="0" y1="100" x2="400" y2="100" stroke="#ebf2ee" strokeDasharray="3 3" />

                      <path
                        d="M 10,50 C 40,25 70,25 105,50 C 140,75 165,20 200,20 C 235,20 265,65 295,55 C 325,45 355,20 390,20 L 390,120 L 10,120 Z"
                        fill="url(#waveGradient)"
                      />

                      <path
                        d="M 10,50 C 40,25 70,25 105,50 C 140,75 165,20 200,20 C 235,20 265,65 295,55 C 325,45 355,20 390,20"
                        fill="none"
                        stroke="#107c56"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      <circle cx="10" cy="50" r="3.5" fill="#107c56" />
                      <circle cx="105" cy="50" r="3.5" fill="#107c56" />
                      <circle cx="200" cy="20" r="3.5" fill="#107c56" />
                      <circle cx="295" cy="55" r="3.5" fill="#107c56" />
                      <circle cx="390" cy="20" r="3.5" fill="#107c56" />
                    </svg>

                    <div className="wave-chart-xaxis">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>
              </section>

              <div className="dashboard-side-stack">
                <section className="card caregiver-panel" aria-labelledby="caregiver-title">
                  <p className="caregiver-panel__label">Caregiver</p>
                  <div className="caregiver-panel__body">
                    <div className="caregiver-panel__avatar-fallback">—</div>
                    <div>
                      <p className="caregiver-panel__sub">Not connected</p>
                      <h3 id="caregiver-title" className="caregiver-panel__name">
                        No caregiver yet
                      </h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn caregiver-panel__btn"
                    onClick={() => navigate('/caregivers')}
                  >
                    Connect
                  </button>
                </section>

                <section className="card refill-panel" aria-labelledby="refill-title">
                  <div className="refill-panel__info">
                    <h3 id="refill-title">Next Refill</h3>
                    {refillCandidate ? (
                      <>
                        <h4>{refillCandidate.medicine.name}</h4>
                        <p>{refillCandidate.expiry.label}</p>
                      </>
                    ) : (
                      <>
                        <h4>No medicine</h4>
                        <p>Add medicines to track refills</p>
                      </>
                    )}
                  </div>
                  <div className="refill-panel__icon">
                    <Icon name="calendar" />
                  </div>
                </section>
              </div>
            </div>

            <div className="bottom-panel-grid">
              <section className="card summary-panel" aria-labelledby="summary-title">
                <div className="panel-header">
                  <h2 id="summary-title">Weekly Summary</h2>
                  <span className="date-pill">This week</span>
                </div>

                <div className="summary-metrics">
                  <div className="summary-metric">
                    <span className="summary-metric__val">{takenCount}</span>
                    <span className="summary-metric__lbl">Doses Taken</span>
                  </div>
                  <div className="summary-metric">
                    <span className="summary-metric__val">{missedCount}</span>
                    <span className="summary-metric__lbl">Doses Missed</span>
                  </div>
                  <div className="summary-metric">
                    <span className="summary-metric__val">{adherenceValue}</span>
                    <span className="summary-metric__lbl">Adherence</span>
                  </div>
                </div>
              </section>

              <section className="card reminder-panel" aria-labelledby="reminder-title">
                <div className="reminder-panel__bell">
                  <Icon name="bellRinging" />
                </div>

                <div className="reminder-panel__content">
                  <div className="panel-header" style={{ marginBottom: '8px' }}>
                    <h2 id="reminder-title">Reminder</h2>
                  </div>
                  <p className="reminder-panel__text">
                    {todayDoses.length === 0
                      ? 'No doses scheduled for today.'
                      : `${todayDoses.length - handledCount} dose(s) still need attention today.`}
                  </p>
                </div>

                <svg
                  viewBox="0 0 160 160"
                  className="reminder-botanical-art"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M 120 160 C 100 110, 60 90, 20 140 C 40 90, 100 70, 140 160 Z" fill="#107c56" opacity="0.22" />
                  <path d="M 140 160 C 120 80, 70 40, 30 110 C 70 60, 120 40, 155 160 Z" fill="#107c56" opacity="0.3" />
                  <path d="M 160 160 C 130 60, 90 10, 60 80 C 100 30, 145 10, 160 160 Z" fill="#289b72" opacity="0.25" />
                </svg>
              </section>
            </div>
          </div>
        </main>
      </div>

      <MobileNav activeNav="dashboard" />
    </div>
  );
}

export default Dashboard;
