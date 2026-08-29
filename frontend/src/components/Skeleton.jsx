import '../styles/skeleton.css';

export function Skeleton({ width = '100%', height = '16px', radius = '8px', className = '' }) {
  return (
    <span
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ lines = 4, className = '' }) {
  return (
    <div className={`skeleton-card card ${className}`} aria-hidden="true">
      <div className="skeleton-card__head">
        <Skeleton width="40px" height="40px" radius="12px" />
        <div className="skeleton-card__titles">
          <Skeleton width="55%" height="14px" />
          <Skeleton width="35%" height="12px" />
        </div>
      </div>
      <div className="skeleton-card__lines">
        {Array.from({ length: lines }).map((_, idx) => (
          <Skeleton key={idx} width={`${70 + ((idx * 13) % 30)}%`} height="12px" />
        ))}
      </div>
    </div>
  );
}

export default Skeleton;
