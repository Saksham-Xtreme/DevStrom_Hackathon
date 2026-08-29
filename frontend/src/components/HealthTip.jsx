function HealthTip({ tip }) {
  return (
    <section className="card health-tip" aria-labelledby="health-tip-title">
      <p id="health-tip-title" className="health-tip__label">
        🌿 {tip.title}
      </p>
      <blockquote className="health-tip__message">&ldquo;{tip.message}&rdquo;</blockquote>
    </section>
  );
}

export default HealthTip;
