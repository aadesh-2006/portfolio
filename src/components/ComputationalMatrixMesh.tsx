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
 * the Skills Matrix cards in the approved Emerald / Green + OLED Black theme.
 * Visualizes data flow conduits, neural synapse lines, and reacts dynamically to cursor proximity.
 */
export const ComputationalMatrixMesh: React.FC<ComputationalMatrixMeshProps> = ({
  activeModuleIndex,
  hoveredModuleIndex,
  scanProgress,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<{ x: number; y: number; id: number }[]>([]);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Track the 6 card anchor positions dynamically
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

  // Track cursor position across the skills section for computational proximity
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      } else if (mousePos !== null) {
        setMousePos(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mousePos]);

  // Predefined architectural bus conduits between skill modules
  const conduits = [
    { from: 0, to: 1, label: 'BUS_01' }, // Languages -> Backend
    { from: 0, to: 2, label: 'BUS_02' }, // Languages -> Frontend
    { from: 1, to: 4, label: 'BUS_03' }, // Backend -> Databases
    { from: 2, to: 1, label: 'BUS_04' }, // Frontend -> Backend
    { from: 3, to: 0, label: 'BUS_05' }, // Data Science -> Languages
    { from: 3, to: 5, label: 'BUS_06' }, // Data Science -> Core Concepts
    { from: 4, to: 5, label: 'BUS_07' }, // Databases -> Core Concepts
  ];

  // Map scanProgress so the scanline only travels across the computational cards (28% to 98%) and never over the heading
  const scanLineTop = Math.min(Math.max(28 + scanProgress * 68, 28), 98);

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
          backgroundImage: `radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Traveling Computational Scanline (Constrained to cards area, below heading) */}
      <div
        className="absolute left-0 right-0 h-[1.5px] transition-all duration-75 pointer-events-none"
        style={{
          top: `${scanLineTop}%`,
          background: `linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.7) 50%, transparent 100%)`,
          boxShadow: `0 0 14px rgba(16, 185, 129, 0.5)`,
          opacity: scanProgress > 0.1 && scanProgress < 0.95 ? 0.75 : 0,
        }}
      />

      {/* Computational Network Conduit SVG */}
      <svg className="w-full h-full absolute inset-0">
        <defs>
          <linearGradient id="greenConduitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
          </linearGradient>

          <filter id="greenConduitGlow">
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

            const midX = (n1.x + n2.x) / 2;
            const midY = (n1.y + n2.y) / 2;

            // Cursor proximity calculation to conduit midpoint
            let isNearCursor = false;
            if (mousePos) {
              const distToMid = Math.hypot(mousePos.x - midX, mousePos.y - midY);
              const distToN1 = Math.hypot(mousePos.x - n1.x, mousePos.y - n1.y);
              const distToN2 = Math.hypot(mousePos.x - n2.x, mousePos.y - n2.y);
              isNearCursor = distToMid < 95 || distToN1 < 80 || distToN2 < 80;
            }

            const isHighlighted =
              hoveredModuleIndex === conduit.from ||
              hoveredModuleIndex === conduit.to ||
              activeModuleIndex === conduit.from ||
              activeModuleIndex === conduit.to ||
              isNearCursor;

            return (
              <g key={i}>
                {/* Conduit Circuit Line */}
                <path
                  d={`M ${n1.x} ${n1.y} Q ${midX + (i % 2 === 0 ? 20 : -20)} ${midY} ${n2.x} ${n2.y}`}
                  fill="none"
                  stroke={isHighlighted ? "#10b981" : "rgba(255, 255, 255, 0.06)"}
                  strokeWidth={isHighlighted ? 1.5 : 1}
                  strokeDasharray={isHighlighted ? "4 4" : "2 8"}
                  className="transition-all duration-300"
                  filter={isHighlighted ? "url(#greenConduitGlow)" : undefined}
                  opacity={isHighlighted ? (isNearCursor ? 0.9 : 0.75) : 0.22}
                />

                {/* Flow Packet Node */}
                {isHighlighted && (
                  <circle
                    r="2.5"
                    fill="#10b981"
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
export default ComputationalMatrixMesh;
