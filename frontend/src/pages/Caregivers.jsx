import { useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import { caregiver, user } from '../data/mockData';
import {
  getCaregiverAlerts,
  getDoseActivity,
  getExpiryAlerts,
  getWeeklyAdherenceSummary,
} from '../services/medicineService';
import '../styles/adherence.css';

function Caregivers() {
  const weekly = useMemo(() => getWeeklyAdherenceSummary(), []);
  const alerts = useMemo(() => getCaregiverAlerts(), []);
  const activity = useMemo(() => getDoseActivity(8), []);
  const expiryAlerts = useMemo(() => getExpiryAlerts(3), []);

  return (
    <>
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
              <div className="caregiver-profile-avatar" aria-hidden="true">
                {caregiver.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div>
                <span className="caregiver-kicker">Connected Caregiver</span>
                <h2>{caregiver.name}</h2>
                <p>{caregiver.relation} - {caregiver.status}</p>
              </div>
              <div className="caregiver-patient-chip">
                Patient: {user.name}
              </div>
            </section>

            <section className="insight-stat-grid" aria-label="Caregiver summary">
              <div className="insight-stat-card">
                <span>Weekly Adherence</span>
                <strong>{weekly.adherence}%</strong>
                <p>{weekly.taken}/{weekly.total} doses taken</p>
              </div>
              <div className="insight-stat-card">
                <span>Missed or Skipped</span>
                <strong>{weekly.missed + weekly.skipped}</strong>
                <p>Last 7 days</p>
              </div>
              <div className="insight-stat-card">
                <span>Expiry Alerts</span>
                <strong>{expiryAlerts.length}</strong>
                <p>Medicines requiring review</p>
              </div>
            </section>

            <div className="caregiver-dashboard-grid">
              <section className="card caregiver-alert-card" aria-labelledby="caregiver-alerts-title">
                <div className="history-header">
                  <h2 id="caregiver-alerts-title">Caregiver Alerts</h2>
                  <span>{alerts.length} active</span>
                </div>

                <div className="alert-list">
                  {alerts.map((alert) => (
                    <article key={alert.id} className={`care-alert care-alert--${alert.tone}`}>
                      <h3>{alert.title}</h3>
                      <p>{alert.message}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="card dose-history-card" aria-labelledby="patient-activity-title">
                <div className="history-header">
                  <h2 id="patient-activity-title">Patient Activity</h2>
                  <span>Recent</span>
                </div>

                <div className="history-list">
                  {activity.length === 0 ? (
                    <p className="empty-copy">No dose activity has been recorded yet.</p>
                  ) : (
                    activity.map((item) => (
                      <article key={item.id} className="history-row">
                        <div>
                          <span className="history-time">
                            {item.updatedAt
                              ? new Date(item.updatedAt).toLocaleString([], {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })
                              : 'Not recorded'}
                          </span>
                          <h3>{item.name || 'Dose update'}</h3>
                          <p>{item.time || 'Scheduled dose'} - {item.instructions || 'No notes'}</p>
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
    </>
  );
}

export default Caregivers;
