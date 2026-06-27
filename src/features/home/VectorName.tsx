import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Types for Vector Nodes
interface NodePosition {
  x: number;
  y: number;
}

interface LetterConfig {
  char: string;
  offset: number;
  initialNodes: NodePosition[];
  pathBuilder: (nodes: NodePosition[]) => string;
}

// Node descriptions and math curves matching original paths
const lettersConfig: LetterConfig[] = [
  {
    char: 'A',
    offset: 8,
    initialNodes: [
      { x: 0, y: 144 },
      { x: 64, y: 0 },
      { x: 128, y: 144 },
      { x: 32, y: 96 },
      { x: 96, y: 96 },
    ],
    pathBuilder: (pts) =>
      `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y} L ${pts[2].x} ${pts[2].y} M ${pts[3].x} ${pts[3].y} L ${pts[4].x} ${pts[4].y}`,
  },
  {
    char: 'A',
    offset: 152,
    initialNodes: [
      { x: 0, y: 144 },
      { x: 64, y: 0 },
      { x: 128, y: 144 },
      { x: 32, y: 96 },
      { x: 96, y: 96 },
    ],
    pathBuilder: (pts) =>
      `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y} L ${pts[2].x} ${pts[2].y} M ${pts[3].x} ${pts[3].y} L ${pts[4].x} ${pts[4].y}`,
  },
  {
    char: 'D',
    offset: 296,
    initialNodes: [
      { x: 0, y: 0 },
      { x: 0, y: 144 },
      { x: 128, y: 72 },
    ],
    pathBuilder: (pts) => {
      const p0 = pts[0];
      const p1 = pts[1];
      const p2 = pts[2];
      const cp1_x = p0.x + 0.75 * (p2.x - p0.x);
      const cp1_y = p0.y;
      const cp2_x = p2.x;
      const cp2_y = p0.y + 0.5 * (p2.y - p0.y);
      const cp3_x = p2.x;
      const cp3_y = p2.y + 0.5 * (p1.y - p2.y);
      const cp4_x = p1.x + 0.75 * (p2.x - p1.x);
      const cp4_y = p1.y;
      return `M ${p0.x} ${p0.y} L ${p1.x} ${p1.y} M ${p0.x} ${p0.y} C ${cp1_x} ${cp1_y}, ${cp2_x} ${cp2_y}, ${p2.x} ${p2.y} C ${cp3_x} ${cp3_y}, ${cp4_x} ${cp4_y}, ${p1.x} ${p1.y}`;
    },
  },
  {
    char: 'E',
    offset: 440,
    initialNodes: [
      { x: 0, y: 0 },
      { x: 0, y: 144 },
      { x: 128, y: 0 },
      { x: 96, y: 72 },
      { x: 128, y: 144 },
      { x: 0, y: 72 },
    ],
    pathBuilder: (pts) =>
      `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y} M ${pts[0].x} ${pts[0].y} L ${pts[2].x} ${pts[2].y} M ${pts[5].x} ${pts[5].y} L ${pts[3].x} ${pts[3].y} M ${pts[1].x} ${pts[1].y} L ${pts[4].x} ${pts[4].y}`,
  },
  {
    char: 'S',
    offset: 584,
    initialNodes: [
      { x: 128, y: 36 },
      { x: 0, y: 36 },
      { x: 128, y: 108 },
      { x: 0, y: 108 },
    ],
    pathBuilder: (pts) => {
      const p0 = pts[0];
      const p1 = pts[1];
      const p2 = pts[2];
      const p3 = pts[3];
      return `M ${p0.x} ${p0.y} C ${p0.x} ${p0.y - 36}, ${p1.x} ${p1.y - 36}, ${p1.x} ${p1.y} L ${p2.x} ${p2.y} C ${p2.x} ${p2.y + 36}, ${p3.x} ${p3.y + 36}, ${p3.x} ${p3.y}`;
    },
  },
  {
    char: 'H',
    offset: 728,
    initialNodes: [
      { x: 0, y: 0 },
      { x: 0, y: 144 },
      { x: 128, y: 0 },
      { x: 128, y: 144 },
      { x: 0, y: 72 },
      { x: 128, y: 72 },
    ],
    pathBuilder: (pts) =>
      `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y} M ${pts[2].x} ${pts[2].y} L ${pts[3].x} ${pts[3].y} M ${pts[4].x} ${pts[4].y} L ${pts[5].x} ${pts[5].y}`,
  },
];

// Individual Letter Component to handle its own vertex drag states and spring returns
const InteractiveLetter: React.FC<{
  config: LetterConfig;
  onHoverNode: (info: string) => void;
}> = ({ config, onHoverNode }) => {
  // Store node positions in states that update the paths
  const [nodes, setNodes] = useState<NodePosition[]>(config.initialNodes);

  return (
    <g transform={`translate(${config.offset}, 0)`}>
      {/* Drafting block boundaries */}
      <rect
        width="128"
        height="144"
        className="stroke-border-grid/30 dark:stroke-border-grid/15"
        strokeWidth="0.5"
        strokeDasharray="2,4"
        fill="none"
      />

      {/* Dynamic letter path */}
      <path
        d={config.pathBuilder(nodes)}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className="text-text-main transition-all duration-75"
      />

      {/* Render draggable node anchors */}
      {config.initialNodes.map((initNode, idx) => {
        return <DraggableNode
          key={idx}
          initX={initNode.x}
          initY={initNode.y}
          letterChar={config.char}
          nodeIdx={idx}
          onPositionChange={(pos) => {
            setNodes((prev) => {
              const updated = [...prev];
              updated[idx] = pos;
              return updated;
            });
          }}
          onHover={onHoverNode}
        />;
      })}
    </g>
  );
};

// Component for a physics-based spring-backed draggable vertex dot
const DraggableNode: React.FC<{
  initX: number;
  initY: number;
  letterChar: string;
  nodeIdx: number;
  onPositionChange: (pos: NodePosition) => void;
  onHover: (info: string) => void;
}> = ({ initX, initY, letterChar, nodeIdx, onPositionChange, onHover }) => {
  // Motion values to drive Framer Motion physics
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // Physics springs for spring-back effect
  const springConfig = { damping: 15, stiffness: 220, mass: 0.8 };
  const sX = useSpring(dragX, springConfig);
  const sY = useSpring(dragY, springConfig);

  // Sync node coordinate adjustments back to parent path builder
  React.useEffect(() => {
    const unsubX = sX.on('change', (latestX) => {
      onPositionChange({ x: initX + latestX, y: initY + sY.get() });
    });
    const unsubY = sY.on('change', (latestY) => {
      onPositionChange({ x: initX + sX.get(), y: initY + latestY });
    });
    return () => {
      unsubX();
      unsubY();
    };
  }, [sX, sY, initX, initY, onPositionChange]);

  const handleDrag = () => {
    const currentX = Math.round(initX + sX.get());
    const currentY = Math.round(initY + sY.get());
    onHover(`VERTEX: ${letterChar}_V${nodeIdx} [${currentX}, ${currentY}]`);
  };

  // Dynamic coordinates for lines and labels
  const currentX = useTransform(sX, (x) => initX + x);
  const currentY = useTransform(sY, (y) => initY + y);
  
  const deltaText = useTransform(sX, (x) => {
    const y = sY.get();
    if (Math.abs(x) < 1.5 && Math.abs(y) < 1.5) return '';
    return `d[${x > 0 ? '+' : ''}${Math.round(x)}, ${y > 0 ? '+' : ''}${Math.round(y)}]`;
  });

  return (
    <g>
      {/* CAD-like displacement vector dashed line */}
      <motion.line
        x1={initX}
        y1={initY}
        x2={currentX}
        y2={currentY}
        className="stroke-accent-cobalt/40 pointer-events-none"
        strokeWidth="1"
        strokeDasharray="2,2"
      />

      {/* Vector node original anchor coordinate crosshair (dimmed) */}
      <circle cx={initX} cy={initY} r="1.5" className="fill-text-muted/20 pointer-events-none" />

      {/* Hovering CAD coordinate difference tooltip */}
      <motion.text
        x={currentX}
        y={useTransform(currentY, (y) => y - 8)}
        className="fill-accent-cobalt font-mono text-[7px] font-bold pointer-events-none select-none"
        textAnchor="middle"
      >
        {deltaText}
      </motion.text>

      {/* Larger touch area */}
      <motion.circle
        cx={initX}
        cy={initY}
        r="14"
        fill="transparent"
        className="cursor-crosshair"
        style={{ x: dragX, y: dragY }}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.8}
        dragMomentum={false}
        onDrag={handleDrag}
        onDragEnd={() => {
          onHover(`VERTEX: ${letterChar}_V${nodeIdx} [${initX}, ${initY}] (IDLE)`);
        }}
      />

      {/* Visible node designator */}
      <motion.rect
        x={initX - 3}
        y={initY - 3}
        width="6"
        height="6"
        className="fill-canvas-bg stroke-accent-cobalt hover:fill-accent-cobalt cursor-crosshair pointer-events-none transition-colors"
        strokeWidth="1.5"
        style={{ x: sX, y: sY }}
      />
    </g>
  );
};

export const VectorName: React.FC<{
  onHoverNode: (info: string) => void;
}> = ({ onHoverNode }) => {
  return (
    <div className="w-full flex justify-center py-6 relative overflow-x-auto select-none no-scrollbar">
      <div className="relative min-w-[864px] h-[144px]">
        {/* Dimensions HUD line */}
        <div className="absolute -top-5 left-0 right-0 h-[1px] bg-border-grid flex items-center justify-between select-none">
          <span className="w-[1px] h-2 bg-text-muted/40" />
          <span className="bg-canvas-bg dark:bg-canvas-bg px-2 font-mono text-[9px] text-text-muted tracking-wider">
            CANVAS_WIDTH: 864.00PX // SYSTEM_CALIBRATED
          </span>
          <span className="w-[1px] h-2 bg-text-muted/40" />
        </div>

        {/* Height dimension guide */}
        <div className="absolute -right-6 top-0 bottom-0 w-[1px] bg-border-grid flex flex-col items-center justify-between select-none">
          <span className="w-2 h-[1px] bg-text-muted/40" />
          <span className="bg-canvas-bg dark:bg-canvas-bg py-1 font-mono text-[9px] text-text-muted tracking-wider rotate-90 my-auto whitespace-nowrap">
            HEIGHT: 144.00PX
          </span>
          <span className="w-2 h-[1px] bg-text-muted/40" />
        </div>

        {/* SVG Drawing Canvas */}
        <svg
          width="864"
          height="144"
          viewBox="0 0 864 144"
          className="overflow-visible"
        >
          {lettersConfig.map((config, i) => (
            <InteractiveLetter key={i} config={config} onHoverNode={onHoverNode} />
          ))}
        </svg>
      </div>
    </div>
  );
};
