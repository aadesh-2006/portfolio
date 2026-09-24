import React from 'react';

export const GitPulseDiagram: React.FC = () => {
  return (
    <div className="w-full border border-border-grid rounded-[4px] bg-canvas-bg/30 p-6 flex flex-col items-center select-none font-mono">
      <div className="text-[10px] text-text-muted uppercase tracking-wider mb-4 border-b border-border-grid pb-2 w-full text-center">
        [ SYSTEM SCHEMATIC // ASYNCHRONOUS_GIT_INTELLIGENCE_&_ANALYTICS_PIPELINE ]
      </div>
      <svg
        viewBox="0 0 760 300"
        className="w-full max-w-2xl text-text-main"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <defs>
          <pattern id="diagram-grid-gitpulse" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" className="stroke-border-grid/10" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagram-grid-gitpulse)" className="opacity-50" />

        {/* 1. GitHub API & Ingestion */}
        <g transform="translate(10, 95)">
          <rect width="125" height="95" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="62" y="18" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">INGESTION</text>
          <text x="62" y="34" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">GITHUB REST API</text>
          <text x="62" y="48" textAnchor="middle" className="fill-text-muted text-[7.5px] font-mono">LINK PAGINATION</text>
          <text x="62" y="62" textAnchor="middle" className="fill-text-muted text-[7.5px] font-mono">RATE-LIMIT BACKOFF</text>
          <text x="62" y="76" textAnchor="middle" className="fill-accent-purple text-[7.5px] font-bold font-mono">JOB API</text>
        </g>

        {/* Arrow 1 */}
        <path d="M 135 142 L 165 142" className="stroke-border-grid" />
        <polygon points="165,142 159,139 159,145" className="fill-border-grid stroke-none" />

        {/* 2. Kafka Queue */}
        <g transform="translate(165, 95)">
          <rect width="120" height="95" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="60" y="18" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">EVENT BROKER</text>
          <text x="60" y="34" textAnchor="middle" className="fill-amber-400 text-[8px] font-mono">APACHE KAFKA 3.8</text>
          <text x="60" y="48" textAnchor="middle" className="fill-text-muted text-[7.5px] font-mono">KRAFT MODE</text>
          <text x="60" y="62" textAnchor="middle" className="fill-text-muted text-[7.5px] font-mono">analysis-jobs</text>
          <text x="60" y="76" textAnchor="middle" className="fill-emerald-400 text-[7.5px] font-bold font-mono">ASYNC CONSUMER</text>
        </g>

        {/* Arrow 2 */}
        <path d="M 285 142 L 315 142" className="stroke-border-grid" />
        <polygon points="315,142 309,139 309,145" className="fill-border-grid stroke-none" />

        {/* 3. Analysis Processor Core */}
        <g transform="translate(315, 65)">
          <rect width="165" height="155" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="82" y="18" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">ANALYSIS PROCESSOR</text>
          <text x="82" y="34" textAnchor="middle" className="fill-accent-cyan text-[7.5px] font-mono">1. COMMIT INGESTION</text>
          <text x="82" y="48" textAnchor="middle" className="fill-purple-400 text-[7.5px] font-mono">2. COMMIT CLASSIFICATION</text>
          <text x="82" y="62" textAnchor="middle" className="fill-accent-cyan text-[7.5px] font-mono">3. FILE CHANGES</text>
          <text x="82" y="76" textAnchor="middle" className="fill-text-muted text-[7.5px] font-mono">4. CONTRIBUTOR AGGR</text>
          <text x="82" y="90" textAnchor="middle" className="fill-text-muted text-[7.5px] font-mono">5. FILE AGGREGATION</text>
          <text x="82" y="104" textAnchor="middle" className="fill-amber-400 text-[7.5px] font-mono">6. OWNERSHIP MATRIX</text>
          <text x="82" y="118" textAnchor="middle" className="fill-rose-400 text-[7.5px] font-bold font-mono">7. RISK MATERIALIZATION</text>
          <text x="82" y="134" textAnchor="middle" className="fill-emerald-400 text-[7px] font-mono">533 PASSING TESTS</text>
        </g>

        {/* Arrow 3 */}
        <path d="M 480 142 L 510 142" className="stroke-border-grid" />
        <polygon points="510,142 504,139 504,145" className="fill-border-grid stroke-none" />

        {/* 4. Storage & Cache */}
        <g transform="translate(510, 95)">
          <rect width="125" height="95" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="62" y="18" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">STORAGE &amp; CACHE</text>
          <text x="62" y="34" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">POSTGRESQL 16</text>
          <text x="62" y="48" textAnchor="middle" className="fill-text-muted text-[7.5px] font-mono">FLYWAY V1-V9</text>
          <text x="62" y="62" textAnchor="middle" className="fill-rose-400 text-[7.5px] font-mono">REDIS 7 (5m TTL)</text>
          <text x="62" y="76" textAnchor="middle" className="fill-emerald-400 text-[7px] font-mono">BEST-EFFORT FALLBACK</text>
        </g>

        {/* Arrow 4 */}
        <path d="M 635 142 L 665 142" className="stroke-border-grid" />
        <polygon points="665,142 659,139 659,145" className="fill-border-grid stroke-none" />

        {/* 5. Frontend UI */}
        <g transform="translate(665, 95)">
          <rect width="85" height="95" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="42" y="18" textAnchor="middle" className="fill-text-main text-[8.5px] font-bold font-mono">DASHBOARD</text>
          <text x="42" y="34" textAnchor="middle" className="fill-accent-cyan text-[7.5px] font-mono">REACT 18</text>
          <text x="42" y="48" textAnchor="middle" className="fill-text-muted text-[7.5px] font-mono">VITE 5</text>
          <text x="42" y="62" textAnchor="middle" className="fill-purple-400 text-[7px] font-mono">RECHARTS 3</text>
          <text x="42" y="76" textAnchor="middle" className="fill-accent-cyan text-[7px] font-mono">6 VIEWS</text>
        </g>
      </svg>
    </div>
  );
};
