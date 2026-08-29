import { useState } from 'react';

const emptyMedicine = {
  name: '',
  genericName: '',
  strength: '',
  dose: '1 Tablet',
  frequency: 'Once daily',
  times: '08:00 AM',
  instructions: 'After meal with water',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: '',
  expiryDate: '',
  category: 'General',
};

function toFormData(medicine) {
  if (!medicine) return emptyMedicine;

  return {
    ...emptyMedicine,
    ...medicine,
    times: Array.isArray(medicine.times) ? medicine.times.join(', ') : medicine.times || '',
  };
}

function AddMedicineModal({ isOpen, onClose, onSave, initialData = null }) {
  const [formData, setFormData] = useState(() => toFormData(initialData));

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      ...formData,
      times: formData.times.split(',').map((time) => time.trim()).filter(Boolean),
    });
    onClose();
  };

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {initialData ? 'Edit Medication' : 'Add New Medication'}
          </h2>
          <button type="button" className="icon-btn btn-sm" onClick={onClose} aria-label="Close">
            X
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-form-grid">
            <div className="field-group form-full-width">
              <label className="field-label" htmlFor="med-name">
                Medicine Name *
              </label>
              <input
                id="med-name"
                className="field-input"
                type="text"
                placeholder="e.g. Metformin, Amoxicillin"
                value={formData.name}
                onChange={(event) => updateField('name', event.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="med-generic">
                Generic Name
              </label>
              <input
                id="med-generic"
                className="field-input"
                type="text"
                placeholder="e.g. Metformin HCl"
                value={formData.genericName}
                onChange={(event) => updateField('genericName', event.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="med-strength">
                Strength *
              </label>
              <input
                id="med-strength"
                className="field-input"
                type="text"
                placeholder="e.g. 500 mg, 10 ml"
                value={formData.strength}
                onChange={(event) => updateField('strength', event.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="med-dose">
                Dose *
              </label>
              <input
                id="med-dose"
                className="field-input"
                type="text"
                placeholder="e.g. 1 Tablet, 5 ml"
                value={formData.dose}
                onChange={(event) => updateField('dose', event.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="med-frequency">
                Frequency
              </label>
              <select
                id="med-frequency"
                className="field-input"
                value={formData.frequency}
                onChange={(event) => updateField('frequency', event.target.value)}
              >
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="As needed">As needed (SOS)</option>
              </select>
            </div>

            <div className="field-group form-full-width">
              <label className="field-label" htmlFor="med-times">
                Scheduled Time(s) *
              </label>
              <input
                id="med-times"
                className="field-input"
                type="text"
                placeholder="e.g. 08:00 AM, 08:00 PM"
                value={formData.times}
                onChange={(event) => updateField('times', event.target.value)}
                required
              />
            </div>

            <div className="field-group form-full-width">
              <label className="field-label" htmlFor="med-instructions">
                Instructions
              </label>
              <input
                id="med-instructions"
                className="field-input"
                type="text"
                placeholder="e.g. After lunch, on empty stomach"
                value={formData.instructions}
                onChange={(event) => updateField('instructions', event.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="med-start">
                Start Date *
              </label>
              <input
                id="med-start"
                className="field-input"
                type="date"
                value={formData.startDate}
                onChange={(event) => updateField('startDate', event.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="med-end">
                End Date
              </label>
              <input
                id="med-end"
                className="field-input"
                type="date"
                value={formData.endDate}
                min={formData.startDate}
                onChange={(event) => updateField('endDate', event.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="med-expiry">
                Expiry Date *
              </label>
              <input
                id="med-expiry"
                className="field-input"
                type="date"
                value={formData.expiryDate}
                onChange={(event) => updateField('expiryDate', event.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="med-category">
                Category
              </label>
              <input
                id="med-category"
                className="field-input"
                type="text"
                placeholder="e.g. Antibiotic, Supplement"
                value={formData.category}
                onChange={(event) => updateField('category', event.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? 'Save Changes' : 'Add Medication'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMedicineModal;
