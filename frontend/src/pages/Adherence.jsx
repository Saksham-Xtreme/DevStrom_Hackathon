import { useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import AdherenceChart from '../components/AdherenceChart';
import {
  getAdherenceForDate,
  getMissedDoseSummary,
  getWeeklyAdherence,
  getWeeklyAdherenceSummary,
} from '../services/medicineService';
import '../styles/adherence.css';

function Adherence() {
  const today = useMemo(() => getAdherenceForDate(), []);
  const weekly = useMemo(() => getWeeklyAdherenceSummary(), []);
  const weeklyChartData = useMemo(
    () => getWeeklyAdherence().map((day) => ({ day: day.day, value: day.adherence })),
    [],
  );
  const missedDoses = useMemo(() => getMissedDoseSummary(), []);

  return (
    <div className="app-shell">
      <Sidebar activeNav="adherence" />

      <div className="main-area">
        <main className="content-scroll">
          <div className="insights-page">
            <header className="insights-header">
              <div>
                <h1 className="insights-title">Adherence Insights</h1>
                <p className="insights-subtitle">
                  Review daily progress, weekly consistency, and doses that need attention.
                </p>
              </div>
            </header>

            <section className="insight-stat-grid" aria-label="Adherence summary">
              <div className="insight-stat-card">
                <span>Today</span>
                <strong>{today.adherence}%</strong>
                <p>{today.taken}/{today.total} scheduled doses taken</p>
              </div>
              <div className="insight-stat-card">
                <span>This Week</span>
                <strong>{weekly.adherence}%</strong>
                <p>{weekly.taken}/{weekly.total} scheduled doses taken</p>
              </div>
              <div className="insight-stat-card">
                <span>Needs Attention</span>
                <strong>{weekly.missed + weekly.skipped}</strong>
                <p>Missed or skipped doses this week</p>
              </div>
            </section>

            <div className="insight-main-grid">
              <AdherenceChart
                data={weeklyChartData}
                score={`${weekly.adherence}%`}
                period="Last 7 Days"
              />

              <section className="card dose-history-card" aria-labelledby="history-title">
                <div className="history-header">
                  <h2 id="history-title">Today&apos;s Dose History</h2>
                  <span>{today.doses.length} doses</span>
                </div>

                <div className="history-list">
                  {today.doses.length === 0 ? (
                    <p className="empty-copy">No scheduled doses for today.</p>
                  ) : (
                    today.doses.map((dose) => (
                      <article key={dose.id} className="history-row">
                        <div>
                          <span className="history-time">{dose.time}</span>
                          <h3>{dose.name}</h3>
                          <p>{dose.dose} - {dose.instructions}</p>
                        </div>
                        <span className={`status-badge status-badge--${dose.status}`}>
                          {dose.status}
                        </span>
                      </article>
                    ))
                  )}
                </div>
              </section>
            </div>

            <section className="card missed-summary-card" aria-labelledby="missed-title">
              <div className="history-header">
                <h2 id="missed-title">Missed-Dose Summary</h2>
                <span>Last 7 days</span>
              </div>

              {missedDoses.length === 0 ? (
                <p className="empty-copy">No missed or skipped doses in the selected period.</p>
              ) : (
                <div className="missed-list">
                  {missedDoses.map((dose) => (
                    <article key={dose.id} className="missed-row">
                      <div>
                        <h3>{dose.name}</h3>
                        <p>{dose.day}, {dose.date} at {dose.time}</p>
                      </div>
                      <span className={`status-badge status-badge--${dose.status}`}>
                        {dose.status}
                      </span>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      <MobileNav activeNav="adherence" />
    </div>
  );
}

export default Adherence;
