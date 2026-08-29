import MedicineRow from './MedicineRow';

function MedicineSchedule({ medicines, onTakeDose, onSkipDose }) {
  return (
    <section className="card schedule-card" aria-labelledby="schedule-title">
      <div className="schedule-card__header">
        <h2 id="schedule-title" className="schedule-card__title">
          Today&apos;s Schedule
        </h2>
        <span className="schedule-card__count">{medicines.length} doses</span>
      </div>

      {medicines.length === 0 ? (
        <p className="schedule-card__empty">No medicines match your search.</p>
      ) : (
        <div className="schedule-card__list" role="list">
          {medicines.map((medicine) => (
            <MedicineRow
              key={medicine.id}
              medicine={medicine}
              onTakeDose={onTakeDose}
              onSkipDose={onSkipDose}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default MedicineSchedule;
