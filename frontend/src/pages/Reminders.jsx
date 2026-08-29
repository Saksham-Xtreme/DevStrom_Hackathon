import { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import Icon from '../components/Icon';
import { SkeletonCard } from '../components/Skeleton';
import { useToast } from '../components/ToastContext';
import { medicineApi } from '../api/client';
import '../styles/medicines.css';

const statusLabels = {
  taken: 'Taken',
  skipped: 'Skipped',
  missed: 'Missed',
  upcoming: 'Upcoming',
};

function Reminders() {
  const { showToast } = useToast();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadToday = async () => {
    try {
      const response = await medicineApi.getToday();
      setReminders(response.data || []);
    } catch (err) {
      console.error('Failed to load reminders:', err);
      setError('Unable to load today’s reminders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadToday();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await medicineApi.logDose(id, newStatus);
      await loadToday();
      showToast(`Dose marked ${newStatus.toLowerCase()}.`, 'success');
    } catch (err) {
      console.error('Failed to update dose:', err);
      showToast('Unable to update the dose. Please try again.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const completedCount = useMemo(
    () =>
      reminders.filter((reminder) =>
        ['taken', 'skipped', 'missed'].includes(reminder.status)
      ).length,
    [reminders]
  );

  return (
    <div className="app-shell">
      <Sidebar activeNav="reminders" />

      <div className="main-area">
        <main className="content-scroll">
          <div className="reminders-container">
            <div className="meds-header-row">
              <div>
                <h1 className="meds-page-title">Daily Medication Reminders</h1>
                <p className="meds-page-subtitle">
                  Track today&apos;s scheduled doses from your saved medicine routines.
                </p>
              </div>
              <span className="reminder-summary-pill">
                {completedCount}/{reminders.length} handled
              </span>
            </div>

            {loading && (
              <div className="reminders-timeline-list">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <SkeletonCard key={idx} lines={3} />
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="reminders-empty-state">
                <Icon name="alert" />
                <h3>{error}</h3>
                <button type="button" className="btn btn-ghost btn-sm" onClick={loadToday}>
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && (
              <div className="reminders-timeline-list">
                {reminders.length === 0 ? (
                  <div className="reminders-empty-state">
                    <Icon name="bell" />
                    <h3>No reminders for today</h3>
                    <p>Add a medicine with active start/end dates to generate today&apos;s doses.</p>
                  </div>
                ) : (
                  reminders.map((reminder) => (
                    <div key={reminder.id} className="reminder-timeline-card">
                      <div className="reminder-main">
                        <div className="reminder-time-badge">{reminder.time}</div>

                        <div>
                          <h3 className={reminder.status === 'taken' ? 'reminder-title is-complete' : 'reminder-title'}>
                            {reminder.name}{' '}
                            {reminder.strength ? <span className="reminder-strength">({reminder.strength})</span> : null}
                          </h3>

                          <p className="reminder-instructions">{reminder.instructions || 'Daily dose'}</p>
                        </div>
                      </div>

                      <div className="reminder-actions-row">
                        <span className={`status-badge status-badge--${reminder.status || 'upcoming'}`}>
                          {statusLabels[reminder.status] || 'Upcoming'}
                        </span>

                        <div className="reminder-btn-group">
                          <button
                            type="button"
                            className={reminder.status === 'taken' ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
                            onClick={() => handleUpdateStatus(reminder.id, 'taken')}
                            disabled={updatingId === reminder.id}
                          >
                            Taken
                          </button>
                          <button
                            type="button"
                            className={reminder.status === 'skipped' ? 'btn btn-secondary btn-sm' : 'btn btn-ghost btn-sm'}
                            onClick={() => handleUpdateStatus(reminder.id, 'skipped')}
                            disabled={updatingId === reminder.id}
                          >
                            Skipped
                          </button>
                          <button
                            type="button"
                            className={reminder.status === 'missed' ? 'btn btn-ghost btn-sm is-missed' : 'btn btn-ghost btn-sm'}
                            onClick={() => handleUpdateStatus(reminder.id, 'missed')}
                            disabled={updatingId === reminder.id}
                          >
                            Missed
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileNav activeNav="reminders" />
    </div>
  );
}

export default Reminders;
