import { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import MedicineCard from '../components/MedicineCard';
import AddMedicineModal from '../components/AddMedicineModal';
import { SkeletonCard } from '../components/Skeleton';
import { useToast } from '../components/ToastContext';
import Icon from '../components/Icon';
import {
  fetchMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getExpiryCategory,
} from '../services/medicineService';
import '../styles/medicines.css';

function Medicines() {
  const { showToast } = useToast();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const loadMedicines = async () => {
    try {
      const data = await fetchMedicines();
      setMedicines(data);
    } catch (err) {
      console.error('Failed to load medicines:', err);
      setError('Unable to load your medicines.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((med) => {
      const matchSearch =
        med.name.toLowerCase().includes(search.toLowerCase()) ||
        (med.genericName &&
          med.genericName.toLowerCase().includes(search.toLowerCase()));

      if (!matchSearch) return false;

      const expiry = getExpiryCategory(med.expiryDate);
      if (filter === 'expiring') {
        return expiry.type === 'expiring_soon' || expiry.type === 'approaching';
      }
      if (filter === 'expired') {
        return expiry.type === 'expired';
      }
      return true;
    });
  }, [medicines, search, filter]);

  const handleSaveMed = async (data) => {
    setSaving(true);
    try {
      if (data.id) {
        await updateMedicine(data.id, data);
        showToast('Medication updated successfully.', 'success');
      } else {
        await createMedicine(data);
        showToast('Medication added successfully.', 'success');
      }
      await loadMedicines();
      setEditingMed(null);
    } catch (err) {
      console.error('Save medicine failed:', err);
      showToast('Unable to save the medicine. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteMedicine(pendingDelete.id);
      await loadMedicines();
      showToast('Medication removed.', 'success');
    } catch (err) {
      console.error('Delete medicine failed:', err);
      showToast('Unable to delete the medicine.', 'error');
    } finally {
      setPendingDelete(null);
    }
  };

  const handleOpenEdit = (med) => {
    setEditingMed(med);
    setIsModalOpen(true);
  };

  return (
    <div className="app-shell">
      <Sidebar activeNav="medicines" />

      <div className="main-area">
        <main className="content-scroll">
          <div className="meds-page-container">
            <div className="meds-header-row">
              <div>
                <h1 className="meds-page-title">Medication Management</h1>
                <p className="meds-page-subtitle">
                  Manage your prescription schedules, dosages, and expiry alerts
                </p>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setEditingMed(null);
                  setIsModalOpen(true);
                }}
                disabled={saving}
              >
                <Icon name="plus" /> Add Medication
              </button>
            </div>

            <div className="meds-controls-row">
              <div className="meds-search-input-wrap">
                <Icon name="search" className="meds-search-icon" />
                <input
                  type="text"
                  className="meds-search-input"
                  placeholder="Search your medicines..."
                  aria-label="Search your medicines"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="meds-filter-tabs">
                <button
                  type="button"
                  className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All ({medicines.length})
                </button>
                <button
                  type="button"
                  className={`filter-tab ${filter === 'expiring' ? 'active' : ''}`}
                  onClick={() => setFilter('expiring')}
                >
                  Expiring Soon
                </button>
                <button
                  type="button"
                  className={`filter-tab ${filter === 'expired' ? 'active' : ''}`}
                  onClick={() => setFilter('expired')}
                >
                  Expired
                </button>
              </div>
            </div>

            {loading && (
              <div className="meds-grid">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <SkeletonCard key={idx} lines={5} />
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="meds-empty-state card">
                <Icon name="alert" style={{ fontSize: '32px', color: 'var(--status-missed-text)' }} />
                <h3 style={{ margin: '12px 0 6px' }}>{error}</h3>
                <button type="button" className="btn btn-ghost btn-sm" onClick={loadMedicines}>
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && filteredMedicines.length === 0 && (
              <div className="meds-empty-state card">
                <Icon
                  name="pill"
                  style={{ fontSize: '32px', color: 'var(--text-secondary)' }}
                />
                <h3 style={{ margin: '12px 0 6px' }}>No medications found</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                  {medicines.length === 0
                    ? 'You have not added any medicines yet. Click "Add Medication" to get started.'
                    : 'Try adjusting your search or filters.'}
                </p>
              </div>
            )}

            {!loading && !error && filteredMedicines.length > 0 && (
              <div className="meds-grid">
                {filteredMedicines.map((med) => (
                  <MedicineCard
                    key={med.id}
                    medicine={med}
                    onEdit={handleOpenEdit}
                    onDelete={(id) =>
                      setPendingDelete({
                        id,
                        name: med.name,
                      })
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileNav activeNav="medicines" />

      <AddMedicineModal
        key={editingMed?.id || 'new-medicine'}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMed(null);
        }}
        onSave={handleSaveMed}
        initialData={editingMed}
      />

      {pendingDelete && (
        <div className="modal-backdrop" onClick={() => setPendingDelete(null)}>
          <div
            className="modal-box"
            style={{ maxWidth: '420px' }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">Delete {pendingDelete.name}?</h2>
              <button
                type="button"
                className="icon-btn btn-sm"
                onClick={() => setPendingDelete(null)}
                aria-label="Close"
              >
                X
              </button>
            </div>
            <p style={{ color: 'var(--text-secondary)', margin: '4px 0 20px' }}>
              This will remove the medication and its associated schedules.
            </p>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setPendingDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ background: 'var(--status-missed-text)' }}
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Medicines;
