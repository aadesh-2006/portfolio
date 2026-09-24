import React from 'react';

export const CrickXploreDiagram: React.FC = () => {
  return (
    <div className="w-full border border-border-grid rounded-[4px] bg-canvas-bg/30 p-6 flex flex-col items-center select-none font-mono">
      <div className="text-[10px] text-text-muted uppercase tracking-wider mb-4 border-b border-border-grid pb-2 w-full text-center">
        [ SYSTEM SCHEMATIC // SPATIAL_CRICKET_UNIVERSE_&_AI_DATA_ENGINE ]
      </div>
      <svg
        viewBox="0 0 760 270"
        className="w-full max-w-2xl text-text-main"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <defs>
          <pattern id="diagram-grid-crick" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" className="stroke-border-grid/10" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagram-grid-crick)" className="opacity-50" />

        {/* 1. Client Spatial Layer */}
        <g transform="translate(10, 85)">
          <rect width="130" height="85" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="65" y="18" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">CLIENT SPATIAL UI</text>
          <text x="65" y="34" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">REACT 19 + GSAP</text>
          <text x="65" y="48" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">FRAMER MOTION</text>
          <text x="65" y="62" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">WEB AUDIO DRONE</text>
          <text x="65" y="74" textAnchor="middle" className="fill-accent-cyan text-[7.5px] font-bold font-mono">[ 147-YR TIMELINE ]</text>
        </g>

        {/* Arrow 1 */}
        <path d="M 140 127 L 170 127" className="stroke-border-grid" />
        <polygon points="170,127 164,124 164,130" className="fill-border-grid stroke-none" />

        {/* 2. Collectibles & Game Engine */}
        <g transform="translate(170, 85)">
          <rect width="135" height="85" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="67" y="18" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">RELICS &amp; GAME ENGINE</text>
          <text x="67" y="34" textAnchor="middle" className="fill-amber-400 text-[8px] font-mono">457 HOLOGRAPHIC CARDS</text>
          <text x="67" y="48" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">CSS PRISM SHADERS</text>
          <text x="67" y="62" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">1v1 TOP-TRUMPS BATTLE</text>
          <text x="67" y="74" textAnchor="middle" className="fill-emerald-400 text-[7.5px] font-bold font-mono">PITCH MODIFIERS</text>
        </g>

        {/* Arrow 2 */}
        <path d="M 305 127 L 335 127" className="stroke-border-grid" />
        <polygon points="335,127 329,124 329,130" className="fill-border-grid stroke-none" />

        {/* 3. Provenance & Stories Layer */}
        <g transform="translate(335, 85)">
          <rect width="145" height="85" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="72" y="18" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">PROVENANCE &amp; STORIES</text>
          <text x="72" y="34" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">457 PLAYER RECORDS</text>
          <text x="72" y="48" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">SourcedValue MODEL</text>
          <text x="72" y="62" textAnchor="middle" className="fill-purple-400 text-[8px] font-mono">9 CINEMATIC ESSAYS</text>
          <text x="72" y="74" textAnchor="middle" className="fill-text-muted text-[7.5px] font-mono">STADIUM ATLAS DATA</text>
        </g>

        {/* Arrow 3 */}
        <path d="M 480 127 L 510 127" className="stroke-border-grid" />
        <polygon points="510,127 504,124 504,130" className="fill-border-grid stroke-none" />

        {/* 4. AI Scouting & Proxy Layer */}
        <g transform="translate(510, 85)">
          <rect width="135" height="85" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="67" y="18" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">AI SCOUTING PROXY</text>
          <text x="67" y="34" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">GEMINI 2.5 FLASH</text>
          <text x="67" y="48" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">/api/gemini/[action]</text>
          <text x="67" y="62" textAnchor="middle" className="fill-amber-400 text-[8px] font-mono">IN-FLIGHT DEDUP CACHE</text>
          <text x="67" y="74" textAnchor="middle" className="fill-rose-400 text-[7.5px] font-bold font-mono">NUMERIC PRESERVATION</text>
        </g>

        {/* Arrow 4 */}
        <path d="M 645 127 L 675 127" className="stroke-border-grid" />
        <polygon points="675,127 669,124 669,130" className="fill-border-grid stroke-none" />

        {/* 5. Enterprise Backend */}
        <g transform="translate(675, 85)">
          <rect width="75" height="85" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="37" y="18" textAnchor="middle" className="fill-text-main text-[8.5px] font-bold font-mono">BACKEND</text>
          <text x="37" y="34" textAnchor="middle" className="fill-accent-cyan text-[7.5px] font-mono">JAVA 21</text>
          <text x="37" y="48" textAnchor="middle" className="fill-text-muted text-[7.5px] font-mono">SPRING 3.3</text>
          <text x="37" y="62" textAnchor="middle" className="fill-emerald-400 text-[7.5px] font-mono">JWT AUTH</text>
          <text x="37" y="74" textAnchor="middle" className="fill-text-muted text-[7px] font-bold font-mono">MONGODB</text>
        </g>
      </svg>
    </div>
  );
};
