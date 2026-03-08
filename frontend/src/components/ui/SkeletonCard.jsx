const SkeletonCard = ({ lines = 3, className = "" }) => (
  <div className={`card skeleton-card ${className}`.trim()} aria-hidden="true">
    <div className="skeleton-line w-2/5" />
    <div className="mt-3 space-y-2">
      {Array.from({ length: lines }).map((_, idx) => (
        <div key={idx} className={`skeleton-line ${idx === lines - 1 ? "w-3/5" : "w-full"}`} />
      ))}
    </div>
  </div>
);

export default SkeletonCard;