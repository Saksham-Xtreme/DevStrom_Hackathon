import { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import {
  getDailyDoses,
  getWeeklyAdherenceSummary,
  getAllMedicines,
} from '../services/medicineService';
import '../styles/adherence.css';

function Reports() {
  const { user } = useAuth();
  const [range, setRange] = useState('7'); // 7, 30, 90 days
  const [search, setSearch] = useState('');
  const [exporting, setExporting] = useState(false);

  const medicines = useMemo(() => getAllMedicines(), []);
  const doses = useMemo(() => getDailyDoses(), []);
  const weekly = useMemo(() => getWeeklyAdherenceSummary(), []);

  // Compute stats per medicine
  const medicineCompliance = useMemo(() => {
    return medicines.map((med) => {
      // Mock some compliance stats based on real data
      let rate = 100;
      if (med.name === 'Calcium') rate = 90;
      if (med.name === 'Magnesium') rate = 85;
      return {
        ...med,
        complianceRate: rate,
      };
    });
  }, [medicines]);

  // Filter history logs
  const filteredLogs = useMemo(() => {
    const query = search.toLowerCase().trim();
    const allLogs = doses.map((dose, idx) => ({
      id: dose.id || idx,
      date: new Date(dose.scheduledAt).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
      }),
      time: dose.time,
      name: dose.name,
      dose: dose.dose,
      status: dose.status,
    }));

    if (!query) return allLogs;

    return allLogs.filter(
      (log) =>
        log.name.toLowerCase().includes(query) ||
        log.status.toLowerCase().includes(query)
    );
  }, [doses, search]);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      // Simulate file download
      alert('Report exported successfully! CSV file downloaded.');
    }, 1200);
  };

  return (
    <div className="app-shell">
      <Sidebar activeNav="reports" />

      <div className="main-area">
        <main className="content-scroll">
          <div className="insights-page">
            {/* Header */}
            <header className="insights-header">
              <div>
                <h1 className="insights-title">Adherence Reports</h1>
                <p className="insights-subtitle">
                  Generate, review, and export medication compliance summaries for your doctors.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <select
                  className="meds-search-input"
                  style={{ width: 'auto', padding: '8px 16px', borderRadius: '12px' }}
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                >
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                </select>

                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                  onClick={handleExport}
                  disabled={exporting}
                >
                  <Icon name="link" style={{ transform: 'rotate(45deg)' }} />
                  {exporting ? 'Exporting...' : 'Export CSV'}
                </button>
              </div>
            </header>

            {/* Quick Metrics */}
            <section className="insight-stat-grid" aria-label="Reports summary">
              <div className="insight-stat-card">
                <span>Avg Adherence</span>
                <strong>{weekly.adherence}%</strong>
                <p>Across all active schedules</p>
              </div>
              <div className="insight-stat-card">
                <span>Streak</span>
                <strong>12 Days</strong>
                <p>Consecutive compliant days</p>
              </div>
              <div className="insight-stat-card">
                <span>Total Tracked Doses</span>
                <strong>{doses.length}</strong>
                <p>Dose events monitored</p>
              </div>
            </section>

            <div className="insight-main-grid">
              {/* Compliance by Medication */}
              <section className="card dose-history-card" aria-labelledby="med-compliance-title">
                <div className="history-header">
                  <h2 id="med-compliance-title">Performance by Medication</h2>
                </div>

                <div className="history-list" style={{ gap: '16px', marginTop: '12px' }}>
                  {medicineCompliance.map((med) => (
                    <div key={med.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                          {med.name} <span style={{ fontWeight: '400', color: 'var(--text-secondary)' }}>({med.strength})</span>
                        </span>
                        <span style={{ fontWeight: '700', color: 'var(--green-primary)' }}>
                          {med.complianceRate}%
                        </span>
                      </div>
                      <div style={{ height: '8px', background: 'var(--green-light)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            background: 'var(--green-primary)',
                            width: `${med.complianceRate}%`,
                            borderRadius: '4px',
                            transition: 'width 0.6s ease'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Report Insights */}
              <section className="card dose-history-card" aria-labelledby="insights-summary-title">
                <div className="history-header">
                  <h2 id="insights-summary-title">Report Highlights</h2>
                </div>

                <div className="history-list" style={{ marginTop: '8px' }}>
                  <div style={{ padding: '12px', background: '#f8faf9', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <h3 style={{ margin: '0 0 4px', fontSize: '14px', color: 'var(--text-primary)' }}>
                      Highest Compliance
                    </h3>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <strong>Multivitamin</strong> (100% adherence rate this period)
                    </p>
                  </div>

                  <div style={{ padding: '12px', background: '#f8faf9', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <h3 style={{ margin: '0 0 4px', fontSize: '14px', color: 'var(--text-primary)' }}>
                      Refill Status
                    </h3>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                      1 prescription needs a refill check within the next week.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Detailed Activity Logs */}
            <section className="card missed-summary-card" aria-labelledby="logs-title">
              <div className="history-header">
                <div>
                  <h2 id="logs-title" style={{ margin: 0 }}>Detailed Dose History Logs</h2>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    A detailed list of all tracked dose statuses.
                  </p>
                </div>

                <div className="meds-search-input-wrap" style={{ maxWidth: '240px' }}>
                  <Icon name="search" className="meds-search-icon" />
                  <input
                    type="text"
                    className="meds-search-input"
                    placeholder="Search logs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ overflowX: 'auto', marginTop: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '12px 8px', fontWeight: '600' }}>Date</th>
                      <th style={{ padding: '12px 8px', fontWeight: '600' }}>Time</th>
                      <th style={{ padding: '12px 8px', fontWeight: '600' }}>Medication</th>
                      <th style={{ padding: '12px 8px', fontWeight: '600' }}>Dose</th>
                      <th style={{ padding: '12px 8px', fontWeight: '600' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ padding: '24px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                          No matching logs found.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '12px 8px', fontWeight: '500', color: 'var(--text-primary)' }}>{log.date}</td>
                          <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>{log.time}</td>
                          <td style={{ padding: '12px 8px', fontWeight: '600', color: 'var(--text-primary)' }}>{log.name}</td>
                          <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>{log.dose}</td>
                          <td style={{ padding: '12px 8px' }}>
                            <span className={`status-badge status-badge--${log.status}`}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>

      <MobileNav activeNav="reports" />
    </div>
  );
}

export default Reports;
