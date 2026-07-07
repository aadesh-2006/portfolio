import React from 'react';

export const ProgramEnergyDiagram: React.FC = () => {
  return (
    <div className="w-full border border-border-grid rounded-[4px] bg-canvas-bg/30 p-6 flex flex-col items-center select-none font-mono">
      <div className="text-[10px] text-text-muted uppercase tracking-wider mb-4 border-b border-border-grid pb-2 w-full text-center">
        [ SYSTEM SCHEMATIC // MICROGRID_DATA_FLOW ]
      </div>
      <svg
        viewBox="0 0 600 240"
        className="w-full max-w-lg text-text-main"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <defs>
          <pattern id="diagram-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" className="stroke-border-grid/10" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagram-grid)" className="opacity-50" />

        {/* Input box */}
        <g transform="translate(10, 80)">
          <rect width="100" height="60" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="50" y="28" textAnchor="middle" className="fill-text-main text-[10px] font-bold font-mono">MICROGRID</text>
          <text x="50" y="42" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">HARDWARE VOLTAGE</text>
        </g>

        {/* Arrow 1 */}
        <path d="M 110 110 L 150 110" className="stroke-border-grid" />
        <polygon points="150,110 144,107 144,113" className="fill-border-grid stroke-none" />

        {/* Collector Box */}
        <g transform="translate(150, 80)">
          <rect width="120" height="60" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="60" y="22" textAnchor="middle" className="fill-text-main text-[10px] font-bold font-mono">SPRING BOOT</text>
          <text x="60" y="36" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">1000ms POLL LOOP</text>
          <text x="60" y="48" textAnchor="middle" className="fill-accent-purple text-[8px] font-bold font-mono">BATCH BUFFER</text>
        </g>

        {/* Arrow 2 */}
        <path d="M 270 110 L 310 110" className="stroke-border-grid" />
        <polygon points="310,110 304,107 304,113" className="fill-border-grid stroke-none" />

        {/* Database Box */}
        <g transform="translate(310, 80)">
          <rect width="130" height="60" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="65" y="22" textAnchor="middle" className="fill-text-main text-[10px] font-bold font-mono">MONGODB</text>
          <text x="65" y="36" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">TIMESERIES STORE</text>
          <text x="65" y="48" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">COMPOUND INDEXES</text>
        </g>

        {/* Arrow 3 */}
        <path d="M 440 110 L 480 110" className="stroke-border-grid" />
        <polygon points="480,110 474,107 474,113" className="fill-border-grid stroke-none" />

        {/* Dashboard Box */}
        <g transform="translate(480, 80)">
          <rect width="110" height="60" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="55" y="28" textAnchor="middle" className="fill-text-main text-[10px] font-bold font-mono">REACT CONSOLE</text>
          <text x="55" y="42" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">UI TELEMETRY CHART</text>
        </g>
      </svg>
    </div>
  );
};
