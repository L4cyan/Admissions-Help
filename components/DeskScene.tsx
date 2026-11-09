export function DeskScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 440"
      className={className}
      aria-hidden
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <linearGradient id="scene-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6ead4" />
          <stop offset="100%" stopColor="#e9d8ba" />
        </linearGradient>
        <linearGradient id="scene-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dcecf5" />
          <stop offset="100%" stopColor="#f6e8cc" />
        </linearGradient>
        <linearGradient id="scene-desk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b98756" />
          <stop offset="100%" stopColor="#8f6038" />
        </linearGradient>
        <linearGradient id="scene-light" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff7e6" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#fff7e6" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="scene-glow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff2cf" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fff2cf" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="360" height="440" fill="url(#scene-wall)" />
      <rect width="360" height="440" fill="url(#scene-glow)" />

      {/* window */}
      <rect x="26" y="36" width="138" height="170" rx="7" fill="#e6d3b2" />
      <rect x="33" y="43" width="124" height="150" rx="4" fill="#0b1f4a" />
      <rect x="40" y="50" width="110" height="136" rx="2" fill="url(#scene-sky)" />
      <path
        d="M40 154c22-14 40-12 58 0 18 12 34 14 52 2v30H40Z"
        fill="#cfe0d0"
        opacity="0.9"
      />
      <path
        d="M40 172c26-12 42-8 60 2 16 9 32 8 50-2v14H40Z"
        fill="#a9c2ae"
        opacity="0.8"
      />
      <path d="M95 50v136M40 118h110" stroke="#f3e7d2" strokeWidth="6" />
      <path d="M95 50v136M40 118h110" stroke="#2b4874" strokeWidth="1.5" />
      <rect x="22" y="204" width="146" height="9" rx="3" fill="#d3b98e" />
      <rect x="26" y="206" width="138" height="5" rx="2" fill="#f7edda" />

      {/* light */}
      <path d="M40 206L18 440h154L150 206Z" fill="url(#scene-light)" opacity="0.5" />

      {/* shelf */}
      <rect x="198" y="78" width="136" height="8" rx="2" fill="#c39a68" />
      <rect x="200" y="80" width="132" height="3" fill="#e6cda7" />
      <rect x="210" y="50" width="13" height="28" rx="2" fill="#9d5a4a" />
      <rect x="226" y="44" width="10" height="34" rx="2" fill="#2b5c9c" />
      <rect x="240" y="54" width="15" height="24" rx="2" fill="#d7a62d" />
      <rect x="259" y="47" width="9" height="31" rx="2" fill="#4f6f5a" />
      <path d="M276 60c9-8 20-4 18 6-1 7-8 11-14 12" fill="none" stroke="#7a6a4f" strokeWidth="3" strokeLinecap="round" />

      {/* framed seal */}
      <rect x="220" y="112" width="86" height="86" rx="4" fill="#fbf3e2" stroke="#c99a2e" strokeWidth="3" />
      <rect x="228" y="120" width="70" height="70" rx="2" fill="none" stroke="#dcc79b" strokeWidth="1" />
      <circle cx="263" cy="155" r="27" fill="#0b1f4a" />
      <circle cx="263" cy="155" r="21" fill="none" stroke="#d7a62d" strokeWidth="1.6" />
      <path
        d="M263 138l4.6 11.4 12.2 1.1-9.2 8.1 2.7 12-10.3-6.3-10.3 6.3 2.7-12-9.2-8.1 12.2-1.1Z"
        fill="#d7a62d"
      />
      <path d="M252 184h22" stroke="#d7a62d" strokeWidth="2" strokeLinecap="round" />

      {/* plant */}
      <g className="scene-plant">
        <path d="M76 300c-16-10-24-28-18-44 12 6 20 18 22 32" fill="#587a5c" />
        <path d="M78 300c2-18 12-34 28-40 2 16-8 30-22 38" fill="#6f8f6c" />
        <path d="M74 302c-2-20-12-36-28-42-2 18 8 34 22 42" fill="#4f6f56" />
        <path d="M76 300c-6-26 2-48 18-60 8 18 0 44-12 58" fill="#7aa074" opacity="0.9" />
        <path d="M58 296h40l-5 34H63Z" fill="#b9715a" />
        <rect x="54" y="292" width="48" height="9" rx="3" fill="#cf8b70" />
      </g>

      {/* desk */}
      <rect x="0" y="326" width="360" height="114" fill="url(#scene-desk)" />
      <rect x="0" y="326" width="360" height="7" fill="#d2a371" opacity="0.7" />
      <path d="M0 348h360M0 394h360" stroke="#7d522f" strokeWidth="1" opacity="0.35" />

      {/* papers */}
      <g transform="rotate(-6 102 344)">
        <rect x="70" y="334" width="70" height="42" rx="2" fill="#fbf5e7" stroke="#d9c8a8" strokeWidth="1" />
        <path d="M80 344h48M80 350h44M80 356h50M80 362h30" stroke="#c9b898" strokeWidth="1.4" strokeLinecap="round" />
      </g>
      <g transform="rotate(5 150 342)">
        <rect x="120" y="332" width="62" height="38" rx="2" fill="#fff9ec" stroke="#d9c8a8" strokeWidth="1" />
        <path d="M129 342h42M129 348h38M129 354h44" stroke="#c9b898" strokeWidth="1.4" strokeLinecap="round" />
      </g>

      {/* pencil cup */}
      <g>
        <rect x="268" y="332" width="28" height="36" rx="4" fill="#36527f" />
        <rect x="268" y="332" width="28" height="7" rx="3" fill="#5b7ba8" />
        <path d="M274 332v-18M280 332v-22M286 332v-16" stroke="#d7a62d" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* foreground lip */}
      <rect x="0" y="360" width="360" height="80" fill="#a27043" />
      <rect x="0" y="360" width="360" height="8" fill="#c6935f" />
      <path d="M0 382h360" stroke="#85572f" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}
