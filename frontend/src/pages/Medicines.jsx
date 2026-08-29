import { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import MedicineCard from '../components/MedicineCard';
import AddMedicineModal from '../components/AddMedicineModal';
import Icon from '../components/Icon';
import {
  getAllMedicines,
  saveMedicine,
  deleteMedicine,
  getExpiryCategory,
} from '../services/medicineService';
import '../styles/medicines.css';

function Medicines() {
  const [medicines, setMedicines] = useState(getAllMedicines);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);

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

  const handleSaveMed = (data) => {
    const updated = saveMedicine(data);
    setMedicines(updated);
    setEditingMed(null);
  };

  const handleDeleteMed = (id) => {
    if (window.confirm('Are you sure you want to remove this medication?')) {
      const updated = deleteMedicine(id);
      setMedicines(updated);
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
                  placeholder="Search medications..."
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
                  className={`filter-tab ${
                    filter === 'expiring' ? 'active' : ''
                  }`}
                  onClick={() => setFilter('expiring')}
                >
                  Expiring Soon
                </button>
                <button
                  type="button"
                  className={`filter-tab ${
                    filter === 'expired' ? 'active' : ''
                  }`}
                  onClick={() => setFilter('expired')}
                >
                  Expired
                </button>
              </div>
            </div>

            {filteredMedicines.length === 0 ? (
              <div className="meds-empty-state card">
                <Icon
                  name="pill"
                  style={{ fontSize: '32px', color: 'var(--text-secondary)' }}
                />
                <h3 style={{ margin: '12px 0 6px' }}>No medications found</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                  Try adjusting your search or add a new medicine.
                </p>
              </div>
            ) : (
              <div className="meds-grid">
                {filteredMedicines.map((med) => (
                  <MedicineCard
                    key={med.id}
                    medicine={med}
                    onEdit={handleOpenEdit}
                    onDelete={handleDeleteMed}
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
    </div>
  );
}

export default Medicines;
