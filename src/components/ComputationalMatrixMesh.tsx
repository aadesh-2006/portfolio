import React, { useEffect, useRef, useState } from 'react';

interface ComputationalMatrixMeshProps {
  activeModuleIndex: number | null;
  hoveredModuleIndex: number | null;
  scanProgress: number; // 0.0 to 1.0 through the skills section
}

/**
 * ComputationalMatrixMesh
 * 
 * High-performance vector/SVG computational bus architecture running behind
 * the Skills Matrix cards. Visualizes data flow conduits, neural synapse lines,
 * and active node status.
 */
export const ComputationalMatrixMesh: React.FC<ComputationalMatrixMeshProps> = ({
  activeModuleIndex,
  hoveredModuleIndex,
  scanProgress,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<{ x: number; y: number; id: number }[]>([]);

  // Track the 6 card anchor positions if available
  useEffect(() => {
    const updateAnchors = () => {
      if (!containerRef.current) return;
      const cardElements = document.querySelectorAll('[data-skill-module-index]');
      const containerRect = containerRef.current.getBoundingClientRect();
      
      const newNodes: { x: number; y: number; id: number }[] = [];
      cardElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        newNodes.push({
          id: index,
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
        });
      });
      setNodes(newNodes);
    };

    updateAnchors();
    window.addEventListener('resize', updateAnchors);
    const timer = setTimeout(updateAnchors, 300);

    return () => {
      window.removeEventListener('resize', updateAnchors);
      clearTimeout(timer);
    };
  }, []);

  // Predefined architectural bus conduits between modules
  const conduits = [
    { from: 0, to: 1, label: 'BUS_01' }, // Languages -> Backend
    { from: 0, to: 2, label: 'BUS_02' }, // Languages -> Frontend
    { from: 1, to: 4, label: 'BUS_03' }, // Backend -> Databases
    { from: 2, to: 1, label: 'BUS_04' }, // Frontend -> Backend
    { from: 3, to: 0, label: 'BUS_05' }, // Data Science -> Languages
    { from: 3, to: 5, label: 'BUS_06' }, // Data Science -> Core Concepts
    { from: 4, to: 5, label: 'BUS_07' }, // Databases -> Core Concepts
  ];

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* Background Matrix Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--dynamic-accent, #10b981) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Traveling Computational Scanline */}
      <div
        className="absolute left-0 right-0 h-[2px] transition-all duration-75 pointer-events-none"
        style={{
          top: `${Math.min(Math.max(scanProgress * 100, 0), 100)}%`,
          background: `linear-gradient(90deg, transparent 0%, var(--dynamic-accent, #10b981) 50%, transparent 100%)`,
          boxShadow: `0 0 16px var(--dynamic-accent, #10b981)`,
          opacity: scanProgress > 0.05 && scanProgress < 0.95 ? 0.7 : 0,
        }}
      />

      {/* Computational Network Conduit SVG */}
      <svg className="w-full h-full absolute inset-0">
        <defs>
          <linearGradient id="conduitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--dynamic-accent, #10b981)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="var(--dynamic-accent, #10b981)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--dynamic-accent, #10b981)" stopOpacity="0.1" />
          </linearGradient>

          <filter id="conduitGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Draw conduits if nodes are measured */}
        {nodes.length >= 6 &&
          conduits.map((conduit, i) => {
            const n1 = nodes[conduit.from];
            const n2 = nodes[conduit.to];
            if (!n1 || !n2) return null;

            const isHighlighted =
              hoveredModuleIndex === conduit.from ||
              hoveredModuleIndex === conduit.to ||
              activeModuleIndex === conduit.from ||
              activeModuleIndex === conduit.to;

            const midX = (n1.x + n2.x) / 2;
            const midY = (n1.y + n2.y) / 2;

            return (
              <g key={i}>
                {/* Conduit Circuit Line */}
                <path
                  d={`M ${n1.x} ${n1.y} Q ${midX + (i % 2 === 0 ? 20 : -20)} ${midY} ${n2.x} ${n2.y}`}
                  fill="none"
                  stroke={isHighlighted ? "var(--dynamic-accent, #10b981)" : "rgba(255, 255, 255, 0.06)"}
                  strokeWidth={isHighlighted ? 1.5 : 1}
                  strokeDasharray={isHighlighted ? "4 4" : "2 8"}
                  className="transition-all duration-300"
                  filter={isHighlighted ? "url(#conduitGlow)" : undefined}
                  opacity={isHighlighted ? 0.75 : 0.25}
                />

                {/* Flow Packet Node */}
                {isHighlighted && (
                  <circle
                    r="2.5"
                    fill="var(--dynamic-accent, #10b981)"
                    className="animate-pulse"
                  >
                    <animateMotion
                      path={`M ${n1.x} ${n1.y} Q ${midX + (i % 2 === 0 ? 20 : -20)} ${midY} ${n2.x} ${n2.y}`}
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}
      </svg>
    </div>
  );
};
