import Icon from './Icon';

function StatCard({ label, value, subtitle, tone = 'primary', icon, hasSparkline }) {
  return (
    <article className={`card stat-card stat-card--${tone}`}>
      <div className="stat-card__top">
        {icon && (
          <div className={`stat-card__icon-wrap stat-card__icon-wrap--${tone}`}>
            <Icon name={icon} />
          </div>
        )}
        <div className="stat-card__labels">
          <p className="stat-card__label">{label}</p>
          <p className={`stat-card__value stat-card__value--${tone}`}>{value}</p>
        </div>
      </div>
      <div className="stat-card__bottom">
        <p className="stat-card__subtitle">{subtitle}</p>
        {hasSparkline && (
          <div className="stat-card__sparkline">
            <svg viewBox="0 0 60 24" width="54" height="22" fill="none" stroke="#107c56" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 2 18 Q 15 12, 28 15 T 56 4" />
            </svg>
          </div>
        )}
      </div>
    </article>
  );
}

export default StatCard;

