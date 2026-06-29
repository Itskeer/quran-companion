export default function GeometricPattern({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}>
      <svg
        className="w-full h-full opacity-[0.03] dark:opacity-[0.05]"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="islamic-grid" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <path d="M100 0L200 100L100 200L0 100Z" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M100 50L150 100L100 150L50 100Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.3" />
            <line x1="30" y1="100" x2="170" y2="100" stroke="currentColor" strokeWidth="0.3" />
            <line x1="100" y1="30" x2="100" y2="170" stroke="currentColor" strokeWidth="0.3" />
            <line x1="50" y1="50" x2="150" y2="150" stroke="currentColor" strokeWidth="0.2" />
            <line x1="150" y1="50" x2="50" y2="150" stroke="currentColor" strokeWidth="0.2" />
            <path d="M100 10L190 100L100 190L10 100Z" fill="none" stroke="currentColor" strokeWidth="0.3" />
          </pattern>
          <pattern id="islamic-stars" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
            <polygon points="150,20 165,70 215,70 175,105 190,155 150,125 110,155 125,105 85,70 135,70" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <polygon points="150,130 157,155 180,155 162,170 168,195 150,180 132,195 138,170 120,155 143,155" fill="none" stroke="currentColor" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="1000" height="1000" fill="url(#islamic-grid)" />
        <rect width="1000" height="1000" fill="url(#islamic-stars)" />
      </svg>
    </div>
  );
}
