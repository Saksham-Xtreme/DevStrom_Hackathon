const statusLabels = {
  taken: 'Taken',
  upcoming: 'Upcoming',
  missed: 'Missed',
  skipped: 'Skipped',
};

function MedicineRow({ medicine, onTakeDose, onSkipDose }) {
  const displayName = medicine.strength
    ? `${medicine.name} ${medicine.strength}`
    : medicine.name;

  return (
    <article
      className={`medicine-row${medicine.status === 'taken' ? ' medicine-row--taken' : ''}`}
    >
      <div className="medicine-row__icon" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M10.5 20.5 3.5 13.5a5.66 5.66 0 0 1 8-8l7 7a5.66 5.66 0 0 1-8 8Z"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path d="m8.5 8.5 7 7" stroke="currentColor" strokeWidth="1.75" />
        </svg>
      </div>

      <div>
        <p className="medicine-row__time">{medicine.time}</p>
        <h3 className="medicine-row__name">{displayName}</h3>
        <p className="medicine-row__meta">{medicine.instructions}</p>
      </div>

      <div className="medicine-row__actions">
        <span
          className={`status-badge status-badge--${medicine.status}`}
          aria-label={`Status: ${statusLabels[medicine.status]}`}
        >
          {statusLabels[medicine.status]}
        </span>

        {medicine.status === 'upcoming' && (
          <>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => onSkipDose(medicine.id)}>
              Skip
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => onTakeDose(medicine.id)}>
              Take Dose
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export default MedicineRow;
