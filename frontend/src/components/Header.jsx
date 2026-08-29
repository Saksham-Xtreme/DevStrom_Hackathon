import { useEffect, useId, useRef } from 'react';
import { user } from '../data/mockData';
import Icon from './Icon';
import '../styles/header.css';

function Header({
  searchQuery,
  onSearchChange,
  notificationsOpen,
  onToggleNotifications,
  notifications,
  onAddMedicine,
}) {
  const panelId = useId();
  const notifyRef = useRef(null);
  const unreadCount = notifications.filter((item) => item.unread).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifyRef.current && !notifyRef.current.contains(event.target)) {
        if (notificationsOpen) {
          onToggleNotifications(false);
        }
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape' && notificationsOpen) {
        onToggleNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [notificationsOpen, onToggleNotifications]);

  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__mobile-brand">
          <div className="header__mobile-logo">
            <Icon name="logo" />
          </div>
          <span className="header__mobile-title">MediTrack</span>
        </div>

        <div className="header__title-group">
          <h1 className="header__title">Dashboard</h1>
        </div>

        <div className="header__actions">
          <div className="header__search-wrap">
            <Icon name="search" className="header__search-icon" />
            <label htmlFor="medicine-search" className="sr-only">
              Search medicines
            </label>
            <input
              id="medicine-search"
              type="search"
              className="header__search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>

          <div className="header__notify-wrap" ref={notifyRef}>
            <button
              type="button"
              className="icon-btn header__bell-btn"
              aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
              aria-expanded={notificationsOpen}
              aria-controls={panelId}
              onClick={() => onToggleNotifications(!notificationsOpen)}
            >
              <Icon name="bell" />
              {unreadCount > 0 && <span className="header__notify-badge" aria-hidden="true" />}
            </button>

            <div
              id={panelId}
              className={`notification-panel${notificationsOpen ? ' notification-panel--open' : ''}`}
              role="region"
              aria-label="Notifications"
            >
              <div className="notification-panel__header">
                <h2 className="notification-panel__title">Notifications</h2>
              </div>
              <ul className="notification-panel__list">
                {notifications.map((item) => (
                  <li
                    key={item.id}
                    className={`notification-panel__item${item.unread ? ' notification-panel__item--unread' : ''}`}
                  >
                    <p className="notification-panel__item-title">{item.title}</p>
                    <p className="notification-panel__item-message">{item.message}</p>
                    <span className="notification-panel__item-time">{item.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button type="button" className="btn btn-primary header__add-btn" onClick={onAddMedicine}>
            <Icon name="plus" />
            <span className="header__add-label">Add Medicine</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;

