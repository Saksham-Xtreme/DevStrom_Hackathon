import { useCallback, useRef, useState } from 'react';
import Icon from './Icon';
import { ToastContext } from './ToastContext';
import '../styles/toast.css';

const TOAST_ICONS = {
  success: 'check',
  error: 'alert',
  info: 'bell',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'info', duration = 3500) => {
      idRef.current += 1;
      const id = idRef.current;
      setToasts((current) => [...current, { id, message, type }]);
      if (duration) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast, dismiss }}>
      {children}
      <div className="toast-stack" aria-live="polite" role="status">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }) {
  return (
    <div className={`toast toast--${toast.type}`} role="alert">
      <Icon name={TOAST_ICONS[toast.type] || 'bell'} className="toast__icon" />
      <span className="toast__message">{toast.message}</span>
      <button
        type="button"
        className="toast__close"
        aria-label="Dismiss notification"
        onClick={onDismiss}
      >
        <Icon name="x" />
      </button>
    </div>
  );
}

export default ToastProvider;
