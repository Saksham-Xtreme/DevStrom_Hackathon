import { useState, useEffect, useRef } from 'react';
import { medicineApi } from '../api/client';
import { useToast } from './ToastContext';

const emptyMedicine = {
  name: '',
  genericName: '',
  brandName: '',
  manufacturer: '',
  strength: '',
  category: 'General',
  frequency: 'Once daily',
  dosage: '',
  form: 'tablet',
  dose: '1 Tablet',
  times: '08:00 AM',
  instructions: 'After meal with water',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: '',
  expiryDate: '',
  drugSctId: '',
  genericSctId: '',
};

function toFormData(medicine) {
  if (!medicine) return { ...emptyMedicine };

  return {
    ...emptyMedicine,
    ...medicine,
    times: Array.isArray(medicine.times) ? medicine.times.join(', ') : medicine.times || '',
  };
}

const REQUIRED_FIELDS = ['name', 'strength', 'dose', 'times', 'startDate', 'expiryDate'];

function validate(formData) {
  const errors = {};
  REQUIRED_FIELDS.forEach((field) => {
    if (!String(formData[field] || '').trim()) {
      errors[field] = 'This field is required.';
    }
  });

  if (formData.endDate && formData.startDate && formData.endDate < formData.startDate) {
    errors.endDate = 'End date cannot be before the start date.';
  }

  const times = formData.times
    .split(',')
    .map((time) => time.trim())
    .filter(Boolean);
  if (times.length === 0) {
    errors.times = 'At least one scheduled time is required.';
  }

  return errors;
}

function AddMedicineModal({ isOpen, onClose, onSave, initialData = null }) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState(() => toFormData(initialData));
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // DrugDB autocomplete
  const [query, setQuery] = useState(formData.name || '');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      setActiveIndex(-1);
      return;
    }

    setSearching(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await medicineApi.search(query.trim(), 10);
        const results = response.data?.results || response.results || [];
        console.log('[MEDICINE SEARCH]', { query: query.trim(), count: results.length });
        setResults(results);
        setShowDropdown(true);
        setActiveIndex(-1);
      } catch (error) {
        console.error('Medicine search failed:', error);
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, isOpen]);

  if (!isOpen) return null;

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    if (field === 'name') setQuery(value);
    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  };

  const applyDrugSuggestion = (item) => {
    const brand = item.brand || {};
    const generic = item.generic || {};
    const manufacturer = item.manufacturer || {};

    const name = item.medicineName || brand.brandName || formData.name;

    const strengthMatch = (item.medicineName || '').match(/(\d+\s?(mg|ml|mcg|g|iu))/i);
    const strength = strengthMatch ? strengthMatch[0] : formData.strength;

    updateField('name', name);
    updateField('genericName', generic.genericName || formData.genericName);
    updateField('brandName', brand.brandName || formData.brandName);
    updateField('manufacturer', manufacturer.manufacturerName || formData.manufacturer);
    if (strength) updateField('strength', strength);
    if (item.medicineSctid) updateField('drugSctId', item.medicineSctid);
    if (generic.sctid) updateField('genericSctId', generic.sctid);

    setShowDropdown(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event) => {
    if (!showDropdown || results.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((idx) => (idx + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((idx) => (idx <= 0 ? results.length - 1 : idx - 1));
    } else if (event.key === 'Enter') {
      if (activeIndex >= 0 && results[activeIndex]) {
        event.preventDefault();
        applyDrugSuggestion(results[activeIndex]);
      }
    } else if (event.key === 'Escape') {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast('Please fix the highlighted fields.', 'error');
      return;
    }

    const payload = {
      ...formData,
      times: formData.times
        .split(',')
        .map((time) => time.trim())
        .filter(Boolean),
    };

    console.log('[MEDICINE CREATE] payload', payload);

    setSaving(true);
    try {
      const created = await onSave(payload);
      console.log('[MEDICINE CREATE] response', created);
      onClose();
    } catch (error) {
      console.error('[MEDICINE CREATE ERROR]', error);
      showToast('Unable to save the medicine. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const renderField = (field, label, node, full = false) => (
    <div className={`field-group ${full ? 'form-full-width' : ''}`}>
      <label className="field-label" htmlFor={`med-${field}`}>
        {label}
      </label>
      {node}
      {errors[field] && <span className="field-error">{errors[field]}</span>}
    </div>
  );

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

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-form-grid">
            <div className="field-group form-full-width" style={{ position: 'relative' }}>
              <label className="field-label" htmlFor="med-name">
                Medicine Name *
              </label>
              <input
                id="med-name"
                className={`field-input ${errors.name ? 'has-error' : ''}`}
                type="text"
                placeholder="Type to search DrugDB (e.g. paracetamol)"
                value={formData.name}
                onChange={(event) => updateField('name', event.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                aria-expanded={showDropdown}
                role="combobox"
                aria-controls="drugdb-listbox"
              />

              {showDropdown && (
                <div className="drugdb-dropdown" id="drugdb-listbox" role="listbox">
                  {searching && <div className="drugdb-dropdown__hint">Searching…</div>}
                  {!searching && results.length === 0 && (
                    <div className="drugdb-dropdown__hint">
                      No matches. You can still type a custom name.
                    </div>
                  )}
                  {!searching &&
                    results.map((item, idx) => {
                      const brand = item.brand || {};
                      const manufacturer = item.manufacturer || {};
                      const label = item.medicineName || brand.brandName || 'Medicine';
                      const sub = [brand.brandName, manufacturer.manufacturerName]
                        .filter(Boolean)
                        .join(' — ');
                      return (
                        <button
                          type="button"
                          key={item.medicineSctid || idx}
                          role="option"
                          aria-selected={activeIndex === idx}
                          className={`drugdb-dropdown__item ${
                            activeIndex === idx ? 'is-active' : ''
                          }`}
                          onMouseDown={(event) => {
                            event.preventDefault();
                            applyDrugSuggestion(item);
                          }}
                        >
                          <span className="drugdb-dropdown__name">{label}</span>
                          {sub && <span className="drugdb-dropdown__sub">{sub}</span>}
                        </button>
                      );
                    })}
                </div>
              )}
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            {renderField(
              'genericName',
              'Generic Name',
              <input
                id="med-generic"
                className="field-input"
                type="text"
                placeholder="e.g. Metformin HCl"
                value={formData.genericName}
                onChange={(event) => updateField('genericName', event.target.value)}
              />
            )}

            {renderField(
              'strength',
              'Strength *',
              <input
                id="med-strength"
                className={`field-input ${errors.strength ? 'has-error' : ''}`}
                type="text"
                placeholder="e.g. 500 mg, 10 ml"
                value={formData.strength}
                onChange={(event) => updateField('strength', event.target.value)}
              />
            )}

            {renderField(
              'dose',
              'Dose *',
              <input
                id="med-dose"
                className={`field-input ${errors.dose ? 'has-error' : ''}`}
                type="text"
                placeholder="e.g. 1 Tablet, 5 ml"
                value={formData.dose}
                onChange={(event) => updateField('dose', event.target.value)}
              />
            )}

            {renderField(
              'form',
              'Dosage Form',
              <select
                id="med-form"
                className="field-input"
                value={formData.form}
                onChange={(event) => updateField('form', event.target.value)}
              >
                <option value="tablet">Tablet</option>
                <option value="capsule">Capsule</option>
                <option value="syrup">Syrup</option>
                <option value="injection">Injection</option>
                <option value="cream">Cream</option>
                <option value="drops">Drops</option>
                <option value="other">Other</option>
              </select>
            )}

            {renderField(
              'frequency',
              'Frequency',
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
            )}

            {renderField(
              'times',
              'Scheduled Time(s) *',
              <input
                id="med-times"
                className={`field-input ${errors.times ? 'has-error' : ''}`}
                type="text"
                placeholder="e.g. 08:00 AM, 08:00 PM"
                value={formData.times}
                onChange={(event) => updateField('times', event.target.value)}
              />,
              true
            )}

            {renderField(
              'instructions',
              'Instructions',
              <input
                id="med-instructions"
                className="field-input"
                type="text"
                placeholder="e.g. After lunch, on empty stomach"
                value={formData.instructions}
                onChange={(event) => updateField('instructions', event.target.value)}
              />,
              true
            )}

            {renderField(
              'startDate',
              'Start Date *',
              <input
                id="med-start"
                className={`field-input ${errors.startDate ? 'has-error' : ''}`}
                type="date"
                value={formData.startDate}
                onChange={(event) => updateField('startDate', event.target.value)}
              />
            )}

            {renderField(
              'endDate',
              'End Date',
              <input
                id="med-end"
                className={`field-input ${errors.endDate ? 'has-error' : ''}`}
                type="date"
                value={formData.endDate}
                min={formData.startDate}
                onChange={(event) => updateField('endDate', event.target.value)}
              />
            )}

            {renderField(
              'expiryDate',
              'Expiry Date *',
              <input
                id="med-expiry"
                className={`field-input ${errors.expiryDate ? 'has-error' : ''}`}
                type="date"
                value={formData.expiryDate}
                onChange={(event) => updateField('expiryDate', event.target.value)}
              />
            )}

            {renderField(
              'stock',
              'Stock',
              <input
                id="med-stock"
                className="field-input"
                type="number"
                min="0"
                placeholder="0"
                value={formData.stock ?? ''}
                onChange={(event) => updateField('stock', event.target.value)}
              />
            )}

            {renderField(
              'category',
              'Category',
              <input
                id="med-category"
                className="field-input"
                type="text"
                placeholder="e.g. Antibiotic, Supplement"
                value={formData.category}
                onChange={(event) => updateField('category', event.target.value)}
              />
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : initialData ? 'Save Changes' : 'Add Medication'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMedicineModal;
