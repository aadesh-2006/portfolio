import React from 'react';

export const CodeSpeedDiagram: React.FC = () => {
  return (
    <div className="w-full border border-border-grid rounded-[4px] bg-canvas-bg/30 p-6 flex flex-col items-center select-none font-mono">
      <div className="text-[10px] text-text-muted uppercase tracking-wider mb-4 border-b border-border-grid pb-2 w-full text-center">
        [ SYSTEM SCHEMATIC // DEVELOPER_TYPING_ENGINE_&_PERFORMANCE_ANALYTICS ]
      </div>
      <svg
        viewBox="0 0 740 260"
        className="w-full max-w-2xl text-text-main"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <defs>
          <pattern id="diagram-grid-cs" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" className="stroke-border-grid/10" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagram-grid-cs)" className="opacity-50" />

        {/* 1. React 19 Client */}
        <g transform="translate(10, 85)">
          <rect width="125" height="75" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="62" y="20" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">CLIENT LAYER</text>
          <text x="62" y="35" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">REACT 19 + VITE</text>
          <text x="62" y="48" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">JWT LOCALSTORAGE</text>
          <text x="62" y="61" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">MODERN CSS SYSTEM</text>
        </g>

        {/* Arrow 1 */}
        <path d="M 135 122 L 165 122" className="stroke-border-grid" />
        <polygon points="165,122 159,119 159,125" className="fill-border-grid stroke-none" />

        {/* 2. Interactive Typing Engine */}
        <g transform="translate(165, 85)">
          <rect width="135" height="75" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="67" y="20" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">TYPING ENGINE</text>
          <text x="67" y="35" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">72 CODE SNIPPETS</text>
          <text x="67" y="48" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">CHAR-LEVEL ACCURACY</text>
          <text x="67" y="61" textAnchor="middle" className="fill-accent-purple text-[8px] font-bold font-mono">TAB INDENTATION</text>
        </g>

        {/* Arrow 2 */}
        <path d="M 300 122 L 330 122" className="stroke-border-grid" />
        <polygon points="330,122 324,119 324,125" className="fill-border-grid stroke-none" />

        {/* 3. API & Auth Controller */}
        <g transform="translate(330, 85)">
          <rect width="130" height="75" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="65" y="20" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">EXPRESS API</text>
          <text x="65" y="35" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">JWT AUTH MIDDLEWARE</text>
          <text x="65" y="48" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">BCRYPTJS HASHING</text>
          <text x="65" y="61" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">PRIVACY TOGGLES</text>
        </g>

        {/* Arrow 3 */}
        <path d="M 460 122 L 490 122" className="stroke-border-grid" />
        <polygon points="490,122 484,119 484,125" className="fill-border-grid stroke-none" />

        {/* 4. Analytics & Anti-Tamper */}
        <g transform="translate(490, 85)">
          <rect width="125" height="75" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="62" y="20" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">ANALYTICS ENGINE</text>
          <text x="62" y="35" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">ANTI-TAMPER CHECK</text>
          <text x="62" y="48" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">WPM PROGRESS GRAPH</text>
          <text x="62" y="61" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">MILESTONE BADGES</text>
        </g>

        {/* Arrow 4 */}
        <path d="M 615 122 L 645 122" className="stroke-border-grid" />
        <polygon points="645,122 639,119 639,125" className="fill-border-grid stroke-none" />

        {/* 5. MongoDB & Mongoose */}
        <g transform="translate(645, 85)">
          <rect width="85" height="75" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="42" y="20" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">DATABASE</text>
          <text x="42" y="35" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">MONGODB</text>
          <text x="42" y="48" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">MONGOOSE</text>
          <text x="42" y="61" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">USER / STATS</text>
        </g>
      </svg>
    </div>
  );
};
