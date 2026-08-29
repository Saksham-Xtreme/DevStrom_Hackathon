import { useEffect, useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import { useAuth } from '../context/AuthContext';
import { medicineApi } from '../api/client';
import '../styles/adherence.css';

function Caregivers() {
  const { user } = useAuth();
  const [todayDoses, setTodayDoses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await medicineApi.getToday().catch(() => ({ data: [] }));
        setTodayDoses(response.data || []);
      } catch (err) {
        console.error('Caregiver load failed:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const takenCount = todayDoses.filter((d) => d.status === 'TAKEN').length;
  const missedCount = todayDoses.filter((d) =>
    ['MISSED', 'SKIPPED'].includes(d.status)
  ).length;
  const adherenceValue =
    todayDoses.length > 0
      ? Math.round((takenCount / todayDoses.length) * 100)
      : 0;

  const patientName = user?.name || 'MediTrack User';

  const activity = useMemo(
    () =>
      todayDoses
        .filter((d) => ['TAKEN', 'MISSED', 'SKIPPED'].includes(d.status))
        .slice(0, 8),
    [todayDoses]
  );

  return (
    <div className="app-shell">
      <Sidebar activeNav="caregivers" />

      <div className="main-area">
        <main className="content-scroll">
          <div className="insights-page">
            <header className="insights-header">
              <div>
                <h1 className="insights-title">Caregiver Dashboard</h1>
                <p className="insights-subtitle">
                  Share adherence progress, patient activity, and alerts with a trusted caregiver.
                </p>
              </div>
            </header>

            <section className="caregiver-profile-band">
              <div className="caregiver-profile-avatar" aria-hidden="true">—</div>
              <div>
                <span className="caregiver-kicker">No caregiver connected</span>
                <h2>Connect a caregiver</h2>
                <p>Link a family member or helper to share this patient’s progress.</p>
              </div>
              <div className="caregiver-patient-chip">
                Patient: {patientName}
              </div>
            </section>

            <section className="insight-stat-grid" aria-label="Caregiver summary">
              <div className="insight-stat-card">
                <span>Weekly Adherence</span>
                <strong>{adherenceValue}%</strong>
                <p>{takenCount}/{todayDoses.length || 0} doses taken</p>
              </div>
              <div className="insight-stat-card">
                <span>Missed or Skipped</span>
                <strong>{missedCount}</strong>
                <p>Last 7 days</p>
              </div>
              <div className="insight-stat-card">
                <span>Expiry Alerts</span>
                <strong>—</strong>
                <p>Not available yet</p>
              </div>
            </section>

            <div className="caregiver-dashboard-grid">
              <section className="card caregiver-alert-card" aria-labelledby="caregiver-alerts-title">
                <div className="history-header">
                  <h2 id="caregiver-alerts-title">Caregiver Alerts</h2>
                  <span>0 active</span>
                </div>
                <div className="alert-list">
                  <p className="empty-copy">No caregiver alerts yet.</p>
                </div>
              </section>

              <section className="card dose-history-card" aria-labelledby="patient-activity-title">
                <div className="history-header">
                  <h2 id="patient-activity-title">Patient Activity</h2>
                  <span>Recent</span>
                </div>

                <div className="history-list">
                  {!loading && activity.length === 0 ? (
                    <p className="empty-copy">No dose activity has been recorded yet.</p>
                  ) : (
                    activity.map((item) => (
                      <article key={item.id} className="history-row">
                        <div>
                          <span className="history-time">{item.time}</span>
                          <h3>{item.name || 'Dose update'}</h3>
                          <p>{item.instructions || 'No notes'}</p>
                        </div>
                        <span className={`status-badge status-badge--${item.status}`}>
                          {item.status}
                        </span>
                      </article>
                    ))
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      <MobileNav activeNav="caregivers" />
    </div>
  );
}

export default Caregivers;
