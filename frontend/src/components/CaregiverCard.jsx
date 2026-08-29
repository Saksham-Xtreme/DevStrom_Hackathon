import Icon from './Icon';

function CaregiverCard({ caregiver, onMessage }) {
  const initials = caregiver.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

  return (
    <section className="card caregiver-card" aria-labelledby="caregiver-title">
      <p id="caregiver-title" className="caregiver-card__label">
        Caregiver
      </p>

      <div className="caregiver-card__body">
        <div className="caregiver-card__avatar" aria-hidden="true">
          {initials}
        </div>
        <div>
          <h3 className="caregiver-card__name">{caregiver.name}</h3>
          <p className="caregiver-card__relation">{caregiver.relation}</p>
        </div>
      </div>

      <div className="caregiver-card__footer">
        <span className="caregiver-card__status">
          <span className="caregiver-card__status-dot" aria-hidden="true" />
          {caregiver.status}
        </span>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onMessage}>
          <Icon name="message" />
          Message
        </button>
      </div>
    </section>
  );
}

export default CaregiverCard;
