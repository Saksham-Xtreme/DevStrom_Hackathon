import { useNavigate } from 'react-router-dom';
import { mobileNavItems } from '../config/navItems';
import Icon from './Icon';
import '../styles/mobile-nav.css';

const routeByNavId = {
  dashboard: '/dashboard',
  medicines: '/medicines',
  reminders: '/reminders',
  adherence: '/adherence',
  settings: '/settings',
};

function MobileNav({ activeNav, onNavChange }) {
  const navigate = useNavigate();

  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {mobileNavItems.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`mobile-nav__item${activeNav === item.id ? ' mobile-nav__item--active' : ''}`}
          aria-current={activeNav === item.id ? 'page' : undefined}
          onClick={() => {
            if (routeByNavId[item.id]) {
              navigate(routeByNavId[item.id]);
              return;
            }
            onNavChange?.(item.id);
          }}
        >
          <Icon name={item.icon} className="mobile-nav__icon" />
          <span className="mobile-nav__label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default MobileNav;
