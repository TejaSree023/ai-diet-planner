const HeightWeightBodyCard = ({ height, weight }) => {
  return (
    <section className="card hover-card relative h-full overflow-hidden">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#D8E9D6] opacity-70 blur-xl" />
      <h3 className="text-xl font-semibold text-[#5E4436]">Body Overview</h3>
      <p className="text-sm text-[#8B6A54]">Height and weight indicators</p>

      <div className="relative mx-auto mt-4 h-[330px] max-w-[280px]">
        <svg viewBox="0 0 220 330" className="h-full w-full" aria-label="Body silhouette with height and weight labels">
          <defs>
            <linearGradient id="bodyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#AEC8AA" />
              <stop offset="100%" stopColor="#7E9D7B" />
            </linearGradient>
          </defs>

          <g opacity="0.85">
            <circle cx="110" cy="40" r="24" fill="url(#bodyGradient)" />
            <rect x="80" y="68" width="60" height="120" rx="28" fill="url(#bodyGradient)" />
            <rect x="52" y="84" width="22" height="98" rx="12" fill="url(#bodyGradient)" />
            <rect x="146" y="84" width="22" height="98" rx="12" fill="url(#bodyGradient)" />
            <rect x="84" y="182" width="22" height="122" rx="12" fill="url(#bodyGradient)" />
            <rect x="114" y="182" width="22" height="122" rx="12" fill="url(#bodyGradient)" />
          </g>

          <line x1="110" y1="12" x2="110" y2="2" stroke="#7B5A44" strokeWidth="1.5" />
          <line x1="40" y1="28" x2="84" y2="38" stroke="#7B5A44" strokeWidth="1.5" />
          <rect x="8" y="8" width="96" height="30" rx="15" fill="#FFF6EB" stroke="#E3D0B8" />
          <text x="14" y="27" fill="#6A4D3B" fontSize="11" fontWeight="600">
            Height: {height || "--"} cm
          </text>

          <line x1="110" y1="306" x2="110" y2="320" stroke="#7B5A44" strokeWidth="1.5" />
          <line x1="138" y1="296" x2="184" y2="282" stroke="#7B5A44" strokeWidth="1.5" />
          <rect x="118" y="260" width="98" height="30" rx="15" fill="#FFF6EB" stroke="#E3D0B8" />
          <text x="138" y="279" fill="#6A4D3B" fontSize="11" fontWeight="600">
            Weight: {weight || "--"} kg
          </text>
        </svg>
      </div>
    </section>
  );
};

export default HeightWeightBodyCard;
