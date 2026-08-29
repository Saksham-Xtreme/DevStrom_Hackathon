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
    <>
      <Sidebar activeNav="medicines" />

      <div className="main-area">
        <main className="content-scroll">
          <div className="meds-page-container">
            <div className="meds-header-row">
              <div>
                <h1 className="meds-page-title">Medication Management</h1>
                <p className="meds-page-subtitle">
                  View, track, and manage all your active and upcoming prescriptions.
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
                <Icon name="plus" />
                Add Medicine
              </button>
            </div>

            <div className="meds-controls-bar">
              <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
                <Icon
                  name="search"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-secondary)',
                  }}
                />
                <input
                  type="search"
                  className="meds-search-input"
                  placeholder="Search by name or generic..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="meds-filter-pills">
                <button
                  type="button"
                  className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All ({medicines.length})
                </button>
                <button
                  type="button"
                  className={`filter-pill ${
                    filter === 'expiring' ? 'active' : ''
                  }`}
                  onClick={() => setFilter('expiring')}
                >
                  Expiring Soon
                </button>
                <button
                  type="button"
                  className={`filter-pill ${
                    filter === 'expired' ? 'active' : ''
                  }`}
                  onClick={() => setFilter('expired')}
                >
                  Expired
                </button>
              </div>
            </div>

            {filteredMedicines.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  background: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                }}
              >
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
    </>
  );
}

export default Medicines;
