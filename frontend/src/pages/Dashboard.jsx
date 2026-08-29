import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  caregiver,
  nextRefill,
  notifications as initialNotifications,
  stats as initialStats,
} from '../data/mockData';
import {
  getDailyDoses,
  getWeeklyAdherenceSummary,
  updateDoseStatus,
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
  const [schedule, setSchedule] = useState(() => getDailyDoses());
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications] = useState(initialNotifications);
  const [timeRange, setTimeRange] = useState('This Week');

  const filteredSchedule = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return schedule;

    return schedule.filter((medicine) => {
      const haystack = `${medicine.name} ${medicine.strength || ''} ${medicine.instructions || ''} ${medicine.time}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [schedule, searchQuery]);

  const liveStats = useMemo(() => {
    const doseStats = {
      total: schedule.length,
      taken: schedule.filter((dose) => dose.status === 'taken').length,
      missed: schedule.filter((dose) => dose.status === 'missed').length,
      skipped: schedule.filter((dose) => dose.status === 'skipped').length,
      upcoming: schedule.filter((dose) => dose.status === 'upcoming').length,
    };

    return initialStats.map((stat) => {
      if (stat.id === 'today') {
        return { ...stat, value: doseStats.total || 3 };
      }
      if (stat.id === 'taken') {
        return { ...stat, value: doseStats.taken || 3 };
      }
      if (stat.id === 'missed') {
        return { ...stat, value: doseStats.missed + doseStats.skipped };
      }
      if (stat.id === 'adherence') {
        return { ...stat, value: '95%' };
      }
      return stat;
    });
  }, [schedule]);

  const weeklySummary = getWeeklyAdherenceSummary();

  function handleTakeDose(id) {
    updateDoseStatus(id, 'taken');
    setSchedule(getDailyDoses());
  }

  function handleSkipDose(id) {
    updateDoseStatus(id, 'skipped');
    setSchedule(getDailyDoses());
  }

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
          notifications={notifications}
          onAddMedicine={handleAddMedicine}
        />

        <main className="content-scroll">
          <div className="dashboard-shell">
            {/* Greeting Banner */}
            <section className="dashboard-welcome">
              <h2>Welcome back, {user?.greeting || user?.name?.split(' ')[0] || 'User'}! 👋</h2>
              <p>Your health, our priority.</p>
            </section>

            {/* Top 4 Stat Cards */}
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

            {/* Middle Section: Today's Schedule + Adherence Overview + Caregiver / Refill */}
            <div className="dashboard-panel-grid">
              {/* Today's Schedule Panel */}
              <section className="card schedule-panel" aria-labelledby="schedule-title">
                <div className="panel-header">
                  <h2 id="schedule-title">Today's Schedule</h2>
                  <button type="button" className="panel-link" onClick={() => navigate('/medicines')}>
                    View all
                  </button>
                </div>

                <div className="schedule-list">
                  {filteredSchedule.length === 0 ? (
                    <div className="schedule-empty">No medicines match your search.</div>
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
                          <span className={`status-badge status-badge--${medicine.status || 'taken'}`}>
                            {medicine.status ? medicine.status.charAt(0).toUpperCase() + medicine.status.slice(1) : 'Taken'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Adherence Overview Wave Chart Panel */}
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

                      {/* Subtle horizontal grid lines */}
                      <line x1="0" y1="10" x2="400" y2="10" stroke="#ebf2ee" strokeDasharray="3 3" />
                      <line x1="0" y1="40" x2="400" y2="40" stroke="#ebf2ee" strokeDasharray="3 3" />
                      <line x1="0" y1="70" x2="400" y2="70" stroke="#ebf2ee" strokeDasharray="3 3" />
                      <line x1="0" y1="100" x2="400" y2="100" stroke="#ebf2ee" strokeDasharray="3 3" />

                      {/* Wave Fill Area */}
                      <path
                        d="M 10,50 C 40,25 70,25 105,50 C 140,75 165,20 200,20 C 235,20 265,65 295,55 C 325,45 355,20 390,20 L 390,120 L 10,120 Z"
                        fill="url(#waveGradient)"
                      />

                      {/* Wave Line */}
                      <path
                        d="M 10,50 C 40,25 70,25 105,50 C 140,75 165,20 200,20 C 235,20 265,65 295,55 C 325,45 355,20 390,20"
                        fill="none"
                        stroke="#107c56"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      {/* Wave Nodes */}
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

              {/* Right Side Stack: Caregiver & Next Refill */}
              <div className="dashboard-side-stack">
                <section className="card caregiver-panel" aria-labelledby="caregiver-title">
                  <p className="caregiver-panel__label">Caregiver</p>
                  <div className="caregiver-panel__body">
                    {caregiver.avatar ? (
                      <img src={caregiver.avatar} alt={caregiver.name} className="caregiver-panel__avatar" />
                    ) : (
                      <div className="caregiver-panel__avatar-fallback">RK</div>
                    )}
                    <div>
                      <p className="caregiver-panel__sub">Connected to</p>
                      <h3 id="caregiver-title" className="caregiver-panel__name">
                        {caregiver.name} ({caregiver.relation})
                      </h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn caregiver-panel__btn"
                    onClick={() => navigate('/caregivers')}
                  >
                    Message
                  </button>
                </section>

                <section className="card refill-panel" aria-labelledby="refill-title">
                  <div className="refill-panel__info">
                    <h3 id="refill-title">Next Refill</h3>
                    <h4>{nextRefill.name}</h4>
                    <p>{nextRefill.daysLeft}</p>
                  </div>
                  <div className="refill-panel__icon">
                    <Icon name="calendar" />
                  </div>
                </section>
              </div>
            </div>

            {/* Bottom Row: Weekly Summary + Reminder */}
            <div className="bottom-panel-grid">
              <section className="card summary-panel" aria-labelledby="summary-title">
                <div className="panel-header">
                  <h2 id="summary-title">Weekly Summary</h2>
                  <span className="date-pill">Apr 20 - Apr 26</span>
                </div>

                <div className="summary-metrics">
                  <div className="summary-metric">
                    <span className="summary-metric__val">21</span>
                    <span className="summary-metric__lbl">Doses Taken</span>
                  </div>
                  <div className="summary-metric">
                    <span className="summary-metric__val">0</span>
                    <span className="summary-metric__lbl">Doses Missed</span>
                  </div>
                  <div className="summary-metric">
                    <span className="summary-metric__val">95%</span>
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
                    You have 1 medicine due in next 30 mins.
                  </p>
                </div>

                {/* Botanical Plant Art */}
                <svg
                  viewBox="0 0 160 160"
                  className="reminder-botanical-art"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M 120 160 C 100 110, 60 90, 20 140 C 40 90, 100 70, 140 160 Z"
                    fill="#107c56"
                    opacity="0.22"
                  />
                  <path
                    d="M 140 160 C 120 80, 70 40, 30 110 C 70 60, 120 40, 155 160 Z"
                    fill="#107c56"
                    opacity="0.3"
                  />
                  <path
                    d="M 160 160 C 130 60, 90 10, 60 80 C 100 30, 145 10, 160 160 Z"
                    fill="#289b72"
                    opacity="0.25"
                  />
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

