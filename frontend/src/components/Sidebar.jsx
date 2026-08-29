import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { navItems } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { resetDemoData } from '../services/medicineService';
import Icon from './Icon';
import '../styles/sidebar.css';

const routeByNavId = {
  dashboard: '/dashboard',
  medicines: '/medicines',
  reminders: '/reminders',
  adherence: '/adherence',
  caregivers: '/caregivers',
  reports: '/adherence',
  prescriptions: '/upload-prescription',
  settings: '/caregivers',
};

function Sidebar({ activeNav, onNavChange }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const initials = (user?.name || 'Hem Ranjan')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);


  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <Icon name="logo" />
        </div>
        <span className="sidebar__title">MediTrack</span>
      </div>

      <nav className="sidebar__nav" aria-label="Dashboard sections">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sidebar__link${activeNav === item.id ? ' sidebar__link--active' : ''}`}
            aria-current={activeNav === item.id ? 'page' : undefined}
            onClick={() => {
              if (routeByNavId[item.id]) {
                navigate(routeByNavId[item.id]);
                return;
              }
              onNavChange?.(item.id);
            }}
          >
            <Icon name={item.icon} className="sidebar__link-icon" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar__profile-area">
        <div className="sidebar__profile-card">
          <button
            type="button"
            className="sidebar__profile-btn"
            aria-label="User menu"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="sidebar__avatar-img" />
            ) : (
              <div className="sidebar__avatar" aria-hidden="true">
                {initials}
              </div>
            )}
            <div className="sidebar__profile-info">
              <div className="sidebar__profile-name">{user.name}</div>
              <div className="sidebar__profile-action">View Profile</div>
            </div>
            <Icon name="chevronDown" className={`sidebar__profile-arrow ${profileOpen ? 'is-open' : ''}`} />
          </button>

          {profileOpen && (
            <div className="sidebar__profile-dropdown">
              <button
                type="button"
                className="sidebar__dropdown-item"
                onClick={logout}
              >
                Log Out
              </button>
              <button
                type="button"
                className="sidebar__dropdown-item sidebar__dropdown-item--danger"
                onClick={() => {
                  resetDemoData();
                  navigate('/dashboard');
                  window.location.reload();
                }}
              >
                Reset Demo Data
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

