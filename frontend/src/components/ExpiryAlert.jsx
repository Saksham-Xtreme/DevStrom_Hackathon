import Icon from './Icon';

function ExpiryAlert({ alert, onViewMedicine }) {
  if (!alert) {
    return (
      <section className="card expiry-alert" aria-labelledby="expiry-title">
        <div className="expiry-alert__header">
          <Icon name="alert" />
          <span id="expiry-title">Expiry Status</span>
        </div>
        <h3 className="expiry-alert__name">All medicines valid</h3>
        <p className="expiry-alert__meta">No expiry alerts need attention.</p>
      </section>
    );
  }

  const displayName = `${alert.name} ${alert.strength}`;

  return (
    <section className="card expiry-alert" aria-labelledby="expiry-title">
      <div className="expiry-alert__header">
        <Icon name="alert" />
        <span id="expiry-title">Medicine Expiring Soon</span>
      </div>
      <h3 className="expiry-alert__name">{displayName}</h3>
      <p className="expiry-alert__meta">{alert.expiry?.label || alert.daysLeft || 'Unknown'}</p>
      <button type="button" className="btn btn-ghost btn-sm" onClick={onViewMedicine}>
        View Medicine
      </button>
    </section>
  );
}

export default ExpiryAlert;
