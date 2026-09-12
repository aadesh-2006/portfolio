import React from 'react';

export const MockAPILabDiagram: React.FC = () => {
  return (
    <div className="w-full border border-border-grid rounded-[4px] bg-canvas-bg/30 p-6 flex flex-col items-center select-none font-mono">
      <div className="text-[10px] text-text-muted uppercase tracking-wider mb-4 border-b border-border-grid pb-2 w-full text-center">
        [ SYSTEM SCHEMATIC // MODULAR_MONOLITH_&_DISTRIBUTED_STATEFUL_RUNTIME ]
      </div>
      <svg
        viewBox="0 0 760 270"
        className="w-full max-w-2xl text-text-main"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <defs>
          <pattern id="diagram-grid-mock" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" className="stroke-border-grid/10" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagram-grid-mock)" className="opacity-50" />

        {/* 1. Ingestion / AI Layer */}
        <g transform="translate(10, 85)">
          <rect width="130" height="85" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="65" y="18" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">INGESTION &amp; AI</text>
          <text x="65" y="34" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">OPENAPI 3.x SPEC</text>
          <text x="65" y="48" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">SPRING BOOT CODE</text>
          <text x="65" y="62" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">GEMINI EXTRACTION</text>
          <text x="65" y="74" textAnchor="middle" className="fill-accent-purple text-[7.5px] font-bold font-mono">[ DETERMINISTIC DTO ]</text>
        </g>

        {/* Arrow 1 */}
        <path d="M 140 127 L 170 127" className="stroke-border-grid" />
        <polygon points="170,127 164,124 164,130" className="fill-border-grid stroke-none" />

        {/* 2. Contract Engine */}
        <g transform="translate(170, 85)">
          <rect width="135" height="85" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="67" y="18" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">CONTRACT ENGINE</text>
          <text x="67" y="34" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">CANONICAL CONTRACT</text>
          <text x="67" y="48" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">SCHEMA VALIDATOR</text>
          <text x="67" y="62" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">VERSION TREE</text>
          <text x="67" y="74" textAnchor="middle" className="fill-emerald-400 text-[7.5px] font-bold font-mono">DRIFT CLASSIFICATION</text>
        </g>

        {/* Arrow 2 */}
        <path d="M 305 127 L 335 127" className="stroke-border-grid" />
        <polygon points="335,127 329,124 329,130" className="fill-border-grid stroke-none" />

        {/* 3. Scenario & Runtime Core */}
        <g transform="translate(335, 85)">
          <rect width="145" height="85" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="72" y="18" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">STATEFUL RUNTIME</text>
          <text x="72" y="34" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">/mock/{'{runtimeId}'}/**</text>
          <text x="72" y="48" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">SCENARIO ENGINE</text>
          <text x="72" y="62" textAnchor="middle" className="fill-amber-400 text-[8px] font-mono">401/429/500 INJECTION</text>
          <text x="72" y="74" textAnchor="middle" className="fill-text-muted text-[7.5px] font-mono">CRUD STATE MUTATION</text>
        </g>

        {/* Arrow 3 */}
        <path d="M 480 127 L 510 127" className="stroke-border-grid" />
        <polygon points="510,127 504,124 504,130" className="fill-border-grid stroke-none" />

        {/* 4. Distributed Infrastructure Layer */}
        <g transform="translate(510, 85)">
          <rect width="135" height="85" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="67" y="18" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">DISTRIBUTED INFRA</text>
          <text x="67" y="34" textAnchor="middle" className="fill-rose-400 text-[8px] font-mono">REDIS 7 (SHARED STATE)</text>
          <text x="67" y="48" textAnchor="middle" className="fill-amber-400 text-[8px] font-mono">KAFKA 3.7 (ASYNC JOBS)</text>
          <text x="67" y="62" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">POSTGRESQL 16</text>
          <text x="67" y="74" textAnchor="middle" className="fill-text-muted text-[7.5px] font-mono">FLYWAY MIGRATIONS</text>
        </g>

        {/* Arrow 4 */}
        <path d="M 645 127 L 675 127" className="stroke-border-grid" />
        <polygon points="675,127 669,124 669,130" className="fill-border-grid stroke-none" />

        {/* 5. Observability & Testing */}
        <g transform="translate(675, 85)">
          <rect width="75" height="85" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="37" y="18" textAnchor="middle" className="fill-text-main text-[8.5px] font-bold font-mono">ASSURANCE</text>
          <text x="37" y="34" textAnchor="middle" className="fill-accent-cyan text-[7.5px] font-mono">151 TESTS</text>
          <text x="37" y="48" textAnchor="middle" className="fill-text-muted text-[7.5px] font-mono">ACTUATOR</text>
          <text x="37" y="62" textAnchor="middle" className="fill-text-muted text-[7.5px] font-mono">MICROMETER</text>
          <text x="37" y="74" textAnchor="middle" className="fill-emerald-400 text-[7px] font-bold font-mono">TRACING</text>
        </g>
      </svg>
    </div>
  );
};
