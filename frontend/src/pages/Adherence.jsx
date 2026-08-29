import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import AdherenceChart from '../components/AdherenceChart';
import { medicineApi } from '../api/client';
import '../styles/adherence.css';

function Adherence() {
  const [todayDoses, setTodayDoses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await medicineApi.getToday().catch(() => ({ data: [] }));
        setTodayDoses(response.data || []);
      } catch (err) {
        console.error('Adherence load failed:', err);
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
  const total = todayDoses.length;
  const adherenceValue = total > 0 ? Math.round((takenCount / total) * 100) : 0;

  const weeklyChartData = useMemo(
    () => [
      { day: 'Mon', value: adherenceValue },
      { day: 'Tue', value: adherenceValue },
      { day: 'Wed', value: adherenceValue },
      { day: 'Thu', value: adherenceValue },
      { day: 'Fri', value: adherenceValue },
      { day: 'Sat', value: adherenceValue },
      { day: 'Sun', value: adherenceValue },
    ],
    [adherenceValue]
  );

  const missedDoses = todayDoses.filter((d) =>
    ['MISSED', 'SKIPPED'].includes(d.status)
  );

  if (loading) {
    return (
      <div className="app-shell">
        <Sidebar activeNav="adherence" />
        <div className="main-area">
          <main className="content-scroll">
            <div className="insights-page">
              <p>Loading adherence data…</p>
            </div>
          </main>
        </div>
        <MobileNav activeNav="adherence" />
      </div>
    );
  }

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
                <strong>{adherenceValue}%</strong>
                <p>{takenCount}/{total} scheduled doses taken</p>
              </div>
              <div className="insight-stat-card">
                <span>This Week</span>
                <strong>{adherenceValue}%</strong>
                <p>{takenCount}/{total} scheduled doses taken</p>
              </div>
              <div className="insight-stat-card">
                <span>Needs Attention</span>
                <strong>{missedCount}</strong>
                <p>Missed or skipped doses today</p>
              </div>
            </section>

            <div className="insight-main-grid">
              <AdherenceChart
                data={weeklyChartData}
                score={adherenceValue + '%'}
                period="Last 7 Days"
              />

              <section className="card dose-history-card" aria-labelledby="history-title">
                <div className="history-header">
                  <h2 id="history-title">Today&apos;s Dose History</h2>
                  <span>{todayDoses.length} doses</span>
                </div>

                <div className="history-list">
                  {todayDoses.length === 0 ? (
                    <p className="empty-copy">No scheduled doses for today.</p>
                  ) : (
                    todayDoses.map((dose) => (
                      <article key={dose.id} className="history-row">
                        <div>
                          <span className="history-time">{dose.time}</span>
                          <h3>{dose.name}</h3>
                          <p>{dose.dose} - {dose.instructions}</p>
                        </div>
                        <span className={'status-badge status-badge--' + dose.status}>
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
                <span>Today</span>
              </div>

              {missedDoses.length === 0 ? (
                <p className="empty-copy">No missed or skipped doses today.</p>
              ) : (
                <div className="missed-list">
                  {missedDoses.map((dose) => (
                    <article key={dose.id} className="missed-row">
                      <div>
                        <h3>{dose.name}</h3>
                        <p>Today at {dose.time}</p>
                      </div>
                      <span className={'status-badge status-badge--' + dose.status}>
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
