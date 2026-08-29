function StatCard({ label, value, subtitle, tone = 'primary' }) {
  return (
    <article className="card stat-card">
      <p className="stat-card__label">{label}</p>
      <p className={`stat-card__value stat-card__value--${tone}`}>{value}</p>
      <p className="stat-card__subtitle">{subtitle}</p>
    </article>
  );
}

export default StatCard;
