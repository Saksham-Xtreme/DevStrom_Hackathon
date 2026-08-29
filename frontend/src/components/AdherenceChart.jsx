function AdherenceChart({ data, score, period = 'This Week' }) {
  return (
    <section className="card adherence-card" aria-labelledby="adherence-title">
      <h2 id="adherence-title" className="adherence-card__title">
        Adherence Overview
      </h2>
      <div className="adherence-card__header">
        <div>
          <p className="adherence-card__score" aria-label={`Adherence score ${score}`}>
            {score}
          </p>
          <p id="adherence-period" className="adherence-card__period">
            {period}
          </p>
        </div>
      </div>

      <div
        className="adherence-chart"
        role="img"
        aria-label={`Weekly adherence chart showing ${data.map((item) => `${item.day} ${item.value}%`).join(', ')}`}
      >
        {data.map((item) => (
          <div key={item.day} className="adherence-chart__bar-wrap">
            <div className="adherence-chart__bar-track">
              <div
                className="adherence-chart__bar"
                style={{ height: `${item.value}%` }}
                title={`${item.day}: ${item.value}%`}
              />
            </div>
            <span className="adherence-chart__label">{item.day}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdherenceChart;
