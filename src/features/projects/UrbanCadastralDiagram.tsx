import React from 'react';

export const UrbanCadastralDiagram: React.FC = () => {
  return (
    <div className="w-full border border-border-grid rounded-[4px] bg-canvas-bg/30 p-6 flex flex-col items-center select-none font-mono">
      <div className="text-[10px] text-text-muted uppercase tracking-wider mb-4 border-b border-border-grid pb-2 w-full text-center">
        [ SYSTEM SCHEMATIC // CPU_FIRST_AERIAL_SEGMENTATION_&_GEOSPATIAL_POLYGONIZATION ]
      </div>
      <svg
        viewBox="0 0 740 260"
        className="w-full max-w-2xl text-text-main"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <defs>
          <pattern id="diagram-grid-uc" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" className="stroke-border-grid/10" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagram-grid-uc)" className="opacity-50" />

        {/* 1. Multi-Format Ingestion */}
        <g transform="translate(10, 85)">
          <rect width="125" height="75" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="62" y="20" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">INPUT INGESTION</text>
          <text x="62" y="35" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">GeoTIFF / JPG / PNG</text>
          <text x="62" y="48" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">PERCENTILE SCALING</text>
          <text x="62" y="61" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">2nd–98th CONTRAST</text>
        </g>

        {/* Arrow 1 */}
        <path d="M 135 122 L 165 122" className="stroke-border-grid" />
        <polygon points="165,122 159,119 159,125" className="fill-border-grid stroke-none" />

        {/* 2. LightUNet Neural Inference */}
        <g transform="translate(165, 85)">
          <rect width="135" height="75" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="67" y="20" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">LightUNet INFERENCE</text>
          <text x="67" y="35" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">1.94M PARAMETERS</text>
          <text x="67" y="48" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">4 CPU THREADS</text>
          <text x="67" y="61" textAnchor="middle" className="fill-accent-purple text-[8px] font-bold font-mono">~45.3ms FORWARD PASS</text>
        </g>

        {/* Arrow 2 */}
        <path d="M 300 122 L 330 122" className="stroke-border-grid" />
        <polygon points="330,122 324,119 324,125" className="fill-border-grid stroke-none" />

        {/* 3. Morphological Cleanup & Vectorization */}
        <g transform="translate(330, 85)">
          <rect width="130" height="75" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="65" y="20" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">VECTOR ENGINE</text>
          <text x="65" y="35" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">BINARY MORPHOLOGY</text>
          <text x="65" y="48" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">RDP POLYGONIZATION</text>
          <text x="65" y="61" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">MIN-AREA FILTERING</text>
        </g>

        {/* Arrow 3 */}
        <path d="M 460 122 L 490 122" className="stroke-border-grid" />
        <polygon points="490,122 484,119 484,125" className="fill-border-grid stroke-none" />

        {/* 4. Geospatial Affine Transform */}
        <g transform="translate(490, 85)">
          <rect width="125" height="75" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="62" y="20" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">GEO TRANSFORM</text>
          <text x="62" y="35" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">EPSG:4326 (WGS84)</text>
          <text x="62" y="48" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">AFFINE MATRIX</text>
          <text x="62" y="61" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">PIXEL FALLBACK</text>
        </g>

        {/* Arrow 4 */}
        <path d="M 615 122 L 645 122" className="stroke-border-grid" />
        <polygon points="645,122 639,119 639,125" className="fill-border-grid stroke-none" />

        {/* 5. GIS Workstation & GeoJSON */}
        <g transform="translate(645, 85)">
          <rect width="85" height="75" rx="2" className="fill-surface-bg stroke-border-grid" />
          <text x="42" y="20" textAnchor="middle" className="fill-text-main text-[9px] font-bold font-mono">GIS SUITE</text>
          <text x="42" y="35" textAnchor="middle" className="fill-accent-cyan text-[8px] font-mono">GeoJSON</text>
          <text x="42" y="48" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">OVERLAYS</text>
          <text x="42" y="61" textAnchor="middle" className="fill-text-muted text-[8px] font-mono">OPACITY</text>
        </g>
      </svg>
    </div>
  );
};
