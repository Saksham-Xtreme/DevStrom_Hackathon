import Icon from './Icon';
import { getExpiryCategory } from '../services/medicineService';

function MedicineCard({ medicine, onEdit, onDelete }) {
  const expiry = getExpiryCategory(medicine.expiryDate);

  return (
    <div className="med-card">
      <div>
        <div className="med-card-top">
          <div className="med-card-icon">
            <Icon name="pill" />
          </div>
          <div style={{ flex: 1 }}>
            <h3 className="med-card-name">{medicine.name}</h3>
            {medicine.genericName && (
              <p className="med-card-generic">{medicine.genericName}</p>
            )}
          </div>
        </div>

        <div className="med-card-badge-row">
          <span className="med-strength-tag">{medicine.strength}</span>
          <span className="med-strength-tag">{medicine.category}</span>
          <span className={`expiry-tag expiry-tag--${expiry.type}`}>
            {expiry.label}
          </span>
        </div>

        <div className="med-card-info-list">
          <div>
            <strong>Frequency:</strong> {medicine.frequency}
          </div>
          <div>
            <strong>Dose:</strong> {medicine.dose}
          </div>
          <div>
            <strong>Dates:</strong> {medicine.startDate} to {medicine.endDate || 'ongoing'}
          </div>
          <div>
            <strong>Instructions:</strong> {medicine.instructions}
          </div>
          <div>
            <strong>Scheduled Times:</strong>
            <div className="med-card-timing-pills" style={{ marginTop: '4px' }}>
              {(medicine.times || []).map((time, idx) => (
                <span key={idx} className="timing-pill">
                  {time}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="med-card-actions">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => onEdit(medicine)}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          style={{ color: 'var(--status-missed)' }}
          onClick={() => onDelete(medicine.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default MedicineCard;
