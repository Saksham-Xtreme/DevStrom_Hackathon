import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import Icon from '../components/Icon';
import { getDailyDoses, updateDoseStatus } from '../services/medicineService';
import '../styles/medicines.css';

const statusLabels = {
  taken: 'Taken',
  skipped: 'Skipped',
  missed: 'Missed',
};

function Reminders() {
  const [reminders, setReminders] = useState(() => getDailyDoses());

  const completedCount = reminders.filter((reminder) =>
    ['taken', 'skipped', 'missed'].includes(reminder.status),
  ).length;

  const handleUpdateStatus = (id, newStatus) => {
    updateDoseStatus(id, newStatus);
    setReminders(getDailyDoses());
  };

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
                  Track today&apos;s generated doses from your saved medicine schedule.
                </p>
              </div>
              <span className="reminder-summary-pill">
                {completedCount}/{reminders.length} handled
              </span>
            </div>

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
                        >
                          Taken
                        </button>
                        <button
                          type="button"
                          className={reminder.status === 'skipped' ? 'btn btn-secondary btn-sm' : 'btn btn-ghost btn-sm'}
                          onClick={() => handleUpdateStatus(reminder.id, 'skipped')}
                        >
                          Skipped
                        </button>
                        <button
                          type="button"
                          className={reminder.status === 'missed' ? 'btn btn-ghost btn-sm is-missed' : 'btn btn-ghost btn-sm'}
                          onClick={() => handleUpdateStatus(reminder.id, 'missed')}
                        >
                          Missed
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      <MobileNav activeNav="reminders" />
    </div>
  );
}

export default Reminders;
