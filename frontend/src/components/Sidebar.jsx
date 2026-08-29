import { useNavigate } from 'react-router-dom';
import { navItems, user } from '../data/mockData';
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
  const { logout } = useAuth();
  const initials = user.name
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
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar__profile" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button type="button" className="sidebar__profile-btn" aria-label="View profile">
          <div className="sidebar__avatar" aria-hidden="true">
            {initials}
          </div>
          <div>
            <div className="sidebar__profile-name">{user.name}</div>
            <div className="sidebar__profile-action">View Profile</div>
          </div>
        </button>
        <button 
          type="button" 
          className="btn btn-ghost btn-sm" 
          style={{ width: '100%', justifyContent: 'center' }} 
          onClick={logout}
        >
          Log Out
        </button>
        <button
          type="button"
          className="sidebar__demo-reset"
          onClick={() => {
            resetDemoData();
            navigate('/dashboard');
            window.location.reload();
          }}
        >
          Reset Demo Data
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
