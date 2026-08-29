import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adherenceData,
  caregiver,
  healthTip,
  notifications as initialNotifications,
  stats as initialStats,
} from '../data/mockData';
import {
  getDailyDoses,
  getExpiryAlerts,
  getWeeklyAdherence,
  getWeeklyAdherenceSummary,
  updateDoseStatus,
} from '../services/medicineService';
import AdherenceChart from '../components/AdherenceChart';
import CaregiverCard from '../components/CaregiverCard';
import ExpiryAlert from '../components/ExpiryAlert';
import Header from '../components/Header';
import HealthTip from '../components/HealthTip';
import Icon from '../components/Icon';
import MedicineSchedule from '../components/MedicineSchedule';
import MobileNav from '../components/MobileNav';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import '../styles/dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(() => getDailyDoses());
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications] = useState(initialNotifications);

  const filteredSchedule = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return schedule;

    return schedule.filter((medicine) => {
      const haystack = `${medicine.name} ${medicine.strength} ${medicine.instructions} ${medicine.time}`.toLowerCase();
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
    const adherence =
      doseStats.total > 0 ? Math.round((doseStats.taken / doseStats.total) * 100) : 0;

    return initialStats.map((stat) => {
      if (stat.id === 'today') {
        return { ...stat, value: doseStats.upcoming, subtitle: 'Upcoming doses' };
      }
      if (stat.id === 'taken') {
        return { ...stat, value: doseStats.taken };
      }
      if (stat.id === 'missed') {
        return { ...stat, value: doseStats.missed + doseStats.skipped };
      }
      if (stat.id === 'adherence') {
        return { ...stat, value: `${adherence}%`, subtitle: 'Today' };
      }
      return stat;
    });
  }, [schedule]);

  const primaryExpiryAlert = getExpiryAlerts(1)[0];
  const weeklyAdherence = getWeeklyAdherenceSummary();
  const weeklyChartData = getWeeklyAdherence().map((day) => ({
    day: day.day,
    value: day.adherence,
  }));

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

  function handleUploadPrescription() {
    navigate('/upload-prescription');
  }

  function handleCaregiverMessage() {
    navigate('/caregivers');
  }

  function handleViewMedicine() {
    navigate('/medicines');
  }

  return (
    <>
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
          <div className="dashboard-grid">
            <section className="stats-row" aria-label="Medication statistics">
              {liveStats.map((stat) => (
                <StatCard
                  key={stat.id}
                  label={stat.label}
                  value={stat.value}
                  subtitle={stat.subtitle}
                  tone={stat.tone}
                />
              ))}
            </section>

            <div className="dashboard-main">
              <MedicineSchedule
                medicines={filteredSchedule}
                onTakeDose={handleTakeDose}
                onSkipDose={handleSkipDose}
              />

              <div className="dashboard-side">
                <AdherenceChart
                  data={weeklyChartData.length ? weeklyChartData : adherenceData}
                  score={`${weeklyAdherence.adherence}%`}
                  period="Last 7 Days"
                />
                <CaregiverCard caregiver={caregiver} onMessage={handleCaregiverMessage} />
                <ExpiryAlert alert={primaryExpiryAlert} onViewMedicine={handleViewMedicine} />
              </div>
            </div>

            <div className="dashboard-bottom">
              <HealthTip tip={healthTip} />

              <section className="card quick-actions" aria-labelledby="quick-actions-title">
                <h2 id="quick-actions-title" className="quick-actions__title">
                  Quick Actions
                </h2>
                <p className="quick-actions__subtitle">Common tasks at a glance</p>
                <button type="button" className="btn btn-primary quick-actions__btn" onClick={handleAddMedicine}>
                  <Icon name="plus" />
                  Add Medicine
                </button>
                <button
                  type="button"
                  className="btn btn-secondary quick-actions__btn"
                  onClick={handleUploadPrescription}
                >
                  <Icon name="upload" />
                  Upload Prescription
                </button>
              </section>
            </div>
          </div>
        </main>
      </div>

      <MobileNav activeNav="dashboard" />

    </>
  );
}

export default Dashboard;