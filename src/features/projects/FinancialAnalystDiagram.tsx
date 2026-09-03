import React from 'react';

export const FinancialAnalystDiagram: React.FC = () => {
  return (
    <div className="w-full border border-border-grid rounded-[4px] bg-canvas-bg/30 p-6 flex flex-col items-center select-none font-mono">
      <div className="text-[10px] text-text-muted uppercase tracking-wider mb-4 border-b border-border-grid pb-2 w-full text-center">
        [ SYSTEM SCHEMATIC // DETERMINISTIC_FINANCIAL_ENGINE_&_GROUNDED_AI_SYNTHESIS ]
      </div>
      <svg
        viewBox="0 0 740 260"
        className="w-full max-w-2xl text-text-main"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <defs>
          <pattern id="diagram-grid-fin" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" className="stroke-border-grid/10" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagram-grid-fin)" className="opacity-50" />

        {/* 1. Multi-Source Ingestion */}
        <g transform="translate(10, 85)">
          <rect width="125" height="75" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="62" y="20" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">INGESTION LAYER</text>
          <text x="62" y="35" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">SEC EDGAR (10-K)</text>
          <text x="62" y="48" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">yfinance MARKET DATA</text>
          <text x="62" y="61" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">NEWS FEED ORCHESTRATOR</text>
        </g>

        {/* Arrow 1 */}
        <path d="M 135 122 L 165 122" className="stroke-border-grid" />
        <polygon points="165,122 159,119 159,125" className="fill-border-grid stroke-none" />

        {/* 2. Deterministic Engine */}
        <g transform="translate(165, 85)">
          <rect width="135" height="75" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="67" y="20" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">QUANT ENGINE</text>
          <text x="67" y="35" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">GROWTH &amp; MARGINS</text>
          <text x="67" y="48" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">DCF &amp; WACC VALUATION</text>
          <text x="67" y="61" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">2D SENSITIVITY GRID</text>
        </g>

        {/* Arrow 2 */}
        <path d="M 300 122 L 330 122" className="stroke-border-grid" />
        <polygon points="330,122 324,119 324,125" className="fill-border-grid stroke-none" />

        {/* 3. Research Context Builder */}
        <g transform="translate(330, 85)">
          <rect width="125" height="75" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="62" y="20" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">CONTEXT BUILDER</text>
          <text x="62" y="35" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">9-SECTION BRIEFING</text>
          <text x="62" y="48" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">PROVENANCE MAPPING</text>
          <text x="62" y="61" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">VERIFIED AUDIT LOG</text>
        </g>

        {/* Arrow 3 */}
        <path d="M 455 122 L 485 122" className="stroke-border-grid" />
        <polygon points="485,122 479,119 479,125" className="fill-border-grid stroke-none" />

        {/* 4. Grounded LLM Layer */}
        <g transform="translate(485, 85)">
          <rect width="125" height="75" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="62" y="20" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">GROUNDED AI</text>
          <text x="62" y="35" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">GPT-4o STRUCTURED</text>
          <text x="62" y="48" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">11 SAFEGUARDS</text>
          <text x="62" y="61" textAnchor="middle" className="fill-accent-purple text-[8px] font-bold font-mono">[ ZERO MATH IN LLM ]</text>
        </g>

        {/* Arrow 4 */}
        <path d="M 610 122 L 640 122" className="stroke-border-grid" />
        <polygon points="640,122 634,119 634,125" className="fill-border-grid stroke-none" />

        {/* 5. API & Persistence */}
        <g transform="translate(640, 85)">
          <rect width="90" height="75" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="45" y="20" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">FASTAPI / DB</text>
          <text x="45" y="35" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">REST ENDPOINTS</text>
          <text x="45" y="48" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">POSTGRESQL 17</text>
          <text x="45" y="61" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">ALEMBIC MIGR</text>
        </g>
      </svg>
    </div>
  );
};
