import { useState, useEffect, useRef } from 'react';
import { medicineApi } from '../api/client';

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

function AddMedicineModal({ isOpen, onClose, onSave, initialData = null }) {
  const [formData, setFormData] = useState(() => toFormData(initialData));
  const [saving, setSaving] = useState(false);

  // DrugDB autocomplete
  const [query, setQuery] = useState(formData.name || '');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setSearching(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await medicineApi.search(query.trim(), 10);
        setResults(response.data?.results || response.results || []);
        setShowDropdown(true);
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
  };

  const applyDrugSuggestion = (item) => {
    const brand = item.brand || {};
    const generic = item.generic || {};
    const manufacturer = item.manufacturer || {};

    const name =
      item.medicineName ||
      brand.brandName ||
      formData.name;

    // Try to pull a strength like "500 mg" out of the medicine name.
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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...formData,
      times: formData.times
        .split(',')
        .map((time) => time.trim())
        .filter(Boolean),
    };

    setSaving(true);
    try {
      await onSave(payload);
      onClose();
    } catch (error) {
      console.error('Save medicine failed:', error);
      alert('Unable to save the medicine. Please try again.');
    } finally {
      setSaving(false);
    }
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
            <div className="field-group form-full-width" style={{ position: 'relative' }}>
              <label className="field-label" htmlFor="med-name">
                Medicine Name *
              </label>
              <input
                id="med-name"
                className="field-input"
                type="text"
                placeholder="Type to search DrugDB (e.g. paracetamol)"
                value={formData.name}
                onChange={(event) => updateField('name', event.target.value)}
                required
                autoComplete="off"
              />

              {showDropdown && (
                <div className="drugdb-dropdown">
                  {searching && <div className="drugdb-dropdown__hint">Searching…</div>}
                  {!searching && results.length === 0 && (
                    <div className="drugdb-dropdown__hint">No matches. You can still type a custom name.</div>
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
                          className="drugdb-dropdown__item"
                          onClick={() => applyDrugSuggestion(item)}
                        >
                          <span className="drugdb-dropdown__name">{label}</span>
                          {sub && <span className="drugdb-dropdown__sub">{sub}</span>}
                        </button>
                      );
                    })}
                </div>
              )}
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
              <label className="field-label" htmlFor="med-form">
                Dosage Form
              </label>
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
                onChange={(event) => updateField('endDate', event.target.value)}
                min={formData.startDate}
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
              <label className="field-label" htmlFor="med-stock">
                Stock
              </label>
              <input
                id="med-stock"
                className="field-input"
                type="number"
                min="0"
                placeholder="0"
                value={formData.stock ?? ''}
                onChange={(event) => updateField('stock', event.target.value)}
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
