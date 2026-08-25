import React from 'react';

export const IntelliRAGDiagram: React.FC = () => {
  return (
    <div className="w-full border border-border-grid rounded-[4px] bg-canvas-bg/30 p-6 flex flex-col items-center select-none font-mono">
      <div className="text-[10px] text-text-muted uppercase tracking-wider mb-4 border-b border-border-grid pb-2 w-full text-center">
        [ SYSTEM SCHEMATIC // RAG_RETRIEVAL_PIPELINE ]
      </div>
      <svg
        viewBox="0 0 600 240"
        className="w-full max-w-lg text-text-main"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <defs>
          <pattern id="diagram-grid-rag" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" className="stroke-border-grid/10" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagram-grid-rag)" className="opacity-50" />

        {/* Input box */}
        <g transform="translate(10, 80)">
          <rect width="100" height="60" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="50" y="24" textAnchor="middle" className="fill-text-main text-[10px] font-bold font-mono">DOCUMENT</text>
          <text x="50" y="38" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">PDF / TEXT</text>
          <text x="50" y="50" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">EXTRACTION</text>
        </g>

        {/* Arrow 1 */}
        <path d="M 110 110 L 145 110" className="stroke-border-grid" />
        <polygon points="145,110 139,107 139,113" className="fill-border-grid stroke-none" />

        {/* Chunking & Vector DB Box */}
        <g transform="translate(145, 80)">
          <rect width="130" height="60" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="65" y="22" textAnchor="middle" className="fill-text-main text-[10px] font-bold font-mono">VECTOR ENGINE</text>
          <text x="65" y="36" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">CHUNK EMBEDDINGS</text>
          <text x="65" y="48" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">VECTOR DATABASE</text>
        </g>

        {/* Arrow 2 */}
        <path d="M 275 110 L 310 110" className="stroke-border-grid" />
        <polygon points="310,110 304,107 304,113" className="fill-border-grid stroke-none" />

        {/* Retrieval & Augmentation Box */}
        <g transform="translate(310, 80)">
          <rect width="135" height="60" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="67" y="22" textAnchor="middle" className="fill-text-main text-[10px] font-bold font-mono">SIMILARITY SEARCH</text>
          <text x="67" y="36" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">TOP-K CHUNKS</text>
          <text x="67" y="48" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">CONTEXT SYNTHESIS</text>
        </g>

        {/* Arrow 3 */}
        <path d="M 445 110 L 480 110" className="stroke-border-grid" />
        <polygon points="480,110 474,107 474,113" className="fill-border-grid stroke-none" />

        {/* LLM Output Box */}
        <g transform="translate(480, 80)">
          <rect width="110" height="60" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="55" y="24" textAnchor="middle" className="fill-text-main text-[10px] font-bold font-mono">LLM INFERENCE</text>
          <text x="55" y="38" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">GROUNDED ANSWER</text>
          <text x="55" y="50" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">+ CITATIONS</text>
        </g>
      </svg>
    </div>
  );
};
