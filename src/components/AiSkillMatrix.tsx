import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Server, 
  Layout, 
  BrainCircuit, 
  Database, 
  Cpu, 
  Layers, 
  Zap,
  Sparkles,
  Activity
} from 'lucide-react';
import type { SkillCategory } from '../content/portfolioData';
import { ComputationalMatrixMesh } from './ComputationalMatrixMesh';

interface AiSkillMatrixProps {
  skills: SkillCategory[];
}

const projectMap: Record<string, string[]> = {
  "PyTorch": ["AeroFind"],
  "YOLOv8": ["FlowSync"],
  "Physics-Informed Neural Networks (PINN)": ["AeroFind"],
  "React": ["FlowSync", "WealthTrack", "IntelliRAG", "Portfolio"],
  "FastAPI": ["FlowSync", "IntelliRAG"],
  "MongoDB": ["WealthTrack"],
  "Express.js": ["WealthTrack"],
  "Node.js": ["WealthTrack"],
  "Python": ["AeroFind", "FlowSync", "IntelliRAG"],
  "Pandas": ["AeroFind"],
  "NumPy": ["AeroFind"],
  "Scikit-learn": ["AeroFind"],
  "SUMO": ["FlowSync"],
  "TraCI": ["FlowSync"],
  "Groww API": ["WealthTrack"]
};

// Metadata for category cards
const categoryConfig: Record<string, { icon: React.ReactNode; strength: string; subtext: string }> = {
  "Languages": {
    icon: <Code2 className="w-4 h-4 text-emerald-400" />,
    strength: "Strength: Strong",
    subtext: "Core Languages & Scripting"
  },
  "Backend": {
    icon: <Server className="w-4 h-4 text-emerald-400" />,
    strength: "Strength: Strong",
    subtext: "APIs & Distributed Architecture"
  },
  "Frontend": {
    icon: <Layout className="w-4 h-4 text-emerald-400" />,
    strength: "Strength: Strong",
    subtext: "Interactive Web Interfaces"
  },
  "Data Science & ML": {
    icon: <BrainCircuit className="w-4 h-4 text-emerald-400" />,
    strength: "Strength: Advanced",
    subtext: "Neural Networks & Physics-ML"
  },
  "Databases & Tools": {
    icon: <Database className="w-4 h-4 text-emerald-400" />,
    strength: "Strength: Proficient",
    subtext: "Storage, DevOps & Tooling"
  },
  "Core Concepts": {
    icon: <Cpu className="w-4 h-4 text-emerald-400" />,
    strength: "Strength: Solid",
    subtext: "Algorithms & System Design"
  }
};

const SkillPill: React.FC<{ skill: string; isParentActive?: boolean }> = ({ skill, isParentActive }) => {
  const projects = projectMap[skill];

  return (
    <div className="relative group/pill z-10">
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.15 }}
        className={`px-3 py-1.5 text-[11px] sm:text-xs font-mono border rounded-[4px] bg-[#0c0c0c] transition-all duration-200 cursor-default flex items-center gap-1.5 shadow-sm ${
          isParentActive
            ? 'border-emerald-500/25 text-zinc-200 hover:border-emerald-400/60 hover:text-emerald-300 hover:bg-emerald-950/30'
            : 'border-white/[0.08] text-zinc-400 hover:border-emerald-400/40 hover:text-zinc-200'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full transition-colors ${
          isParentActive ? 'bg-emerald-400' : 'bg-zinc-600 group-hover/pill:bg-emerald-400'
        }`} />
        <span>{skill}</span>
      </motion.div>

      {/* Contextual Hover Tooltip */}
      {projects && projects.length > 0 && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[220px] bg-[#0a0a0a] border border-emerald-500/40 px-3 py-2 rounded-[3px] opacity-0 group-hover/pill:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-2xl backdrop-blur-md">
          <span className="text-[8px] font-mono text-zinc-400 block mb-0.5 uppercase tracking-wider border-b border-white/[0.08] pb-1">
            PROJECT INTEGRATION
          </span>
          <span className="text-[9px] font-mono text-emerald-400 font-semibold leading-tight block">
            Used in: {projects.join(", ")}
          </span>
        </div>
      )}
    </div>
  );
};

export const AiSkillMatrix: React.FC<AiSkillMatrixProps> = ({ skills }) => {
  const totalTech = useMemo(() => skills.reduce((acc, cat) => acc + cat.skills.length, 0), [skills]);
  const matrixSectionRef = useRef<HTMLDivElement>(null);

  const [scanProgress, setScanProgress] = useState(0);
  const [hoveredModuleIndex, setHoveredModuleIndex] = useState<number | null>(null);

  // Track scroll position within the Skills section for the traveling scan and activation
  useEffect(() => {
    const handleScroll = () => {
      if (!matrixSectionRef.current) return;
      const rect = matrixSectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Section visible range
      const totalDist = rect.height + windowHeight;
      const currentDist = windowHeight - rect.top;
      const progress = Math.min(Math.max(currentDist / totalDist, 0), 1);
      setScanProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate active module index based on scan progress
  const activeModuleIndex = useMemo(() => {
    if (scanProgress <= 0.1) return null;
    if (scanProgress >= 0.9) return 5;
    const step = 0.8 / skills.length;
    return Math.min(Math.floor((scanProgress - 0.1) / step), skills.length - 1);
  }, [scanProgress, skills.length]);

  return (
    <div ref={matrixSectionRef} className="w-full space-y-10 text-left select-none relative">
      
      {/* Background Computational Mesh Conduit Layer */}
      <ComputationalMatrixMesh
        scanProgress={scanProgress}
        activeModuleIndex={activeModuleIndex}
        hoveredModuleIndex={hoveredModuleIndex}
      />

      {/* 1. SECTION HEADER WITH LIVE MATRIX TELEMETRY */}
      <div className="space-y-4 max-w-3xl relative z-10">
        {/* Tracker badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="font-mono text-xs text-emerald-400 font-semibold tracking-widest uppercase">
              // COMPUTATIONAL_MATRIX // CORE_ENGINE
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 font-mono text-[9px] text-zinc-500">
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>TOPOLOGY: 6_NODES // 7_BUSES // ONLINE</span>
          </div>
        </div>

        {/* Main Heading & Subtitle */}
        <div className="space-y-3">
          <h2 className="font-syncopate text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Skills That Power <br />
            <span className="text-emerald-400 drop-shadow-[0_0_25px_rgba(16,185,129,0.35)]">
              Real-World Impact.
            </span>
          </h2>
          <p className="font-sans text-sm sm:text-base text-zinc-400 font-light leading-relaxed max-w-2xl">
            A diverse set of technologies, frameworks and tools I use to build scalable, high-performance and impactful solutions.
          </p>
        </div>
      </div>

      {/* 2. SKILLS OVERVIEW PANEL (3 Compact Balanced Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 relative z-10">
        {/* Metric 1 */}
        <div className="bg-[#080808]/90 border border-white/[0.08] hover:border-emerald-500/40 p-4 sm:p-5 rounded-[6px] transition-all duration-300 group shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <Code2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">SYS_METRIC</span>
          </div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
            {totalTech > 0 ? `${totalTech}+` : '20+'}
          </div>
          <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5 font-medium">
            Technologies
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#080808]/90 border border-white/[0.08] hover:border-emerald-500/40 p-4 sm:p-5 rounded-[6px] transition-all duration-300 group shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <Layers className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">SYS_METRIC</span>
          </div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
            {skills.length > 0 ? `${skills.length}+` : '6+'}
          </div>
          <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5 font-medium">
            Categories
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#080808]/90 border border-white/[0.08] hover:border-emerald-500/40 p-4 sm:p-5 rounded-[6px] transition-all duration-300 group shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <Zap className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">SYS_METRIC</span>
          </div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-emerald-400">
            ∞
          </div>
          <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5 font-medium">
            Learning
          </div>
        </div>
      </div>

      {/* 3. COMPUTATIONAL SKILL CATEGORY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
        {skills.map((category, idx) => {
          const meta = categoryConfig[category.category] || {
            icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
            strength: "Strength: Strong",
            subtext: "Technical Capabilities"
          };

          const isNodeActive = activeModuleIndex !== null && idx <= activeModuleIndex;
          const isCurrentScanFocus = activeModuleIndex === idx;
          const isHovered = hoveredModuleIndex === idx;

          return (
            <div
              key={idx}
              data-skill-module-index={idx}
              onMouseEnter={() => setHoveredModuleIndex(idx)}
              onMouseLeave={() => setHoveredModuleIndex(null)}
              className={`p-5 sm:p-6 rounded-[6px] transition-all duration-300 flex flex-col justify-between group shadow-xl relative overflow-hidden glass-panel ${
                isHovered
                  ? 'border-emerald-400/60 bg-[#0a0a0a] shadow-[0_0_25px_rgba(16,185,129,0.12)]'
                  : isCurrentScanFocus
                  ? 'border-emerald-500/50 bg-[#090909] shadow-[0_0_20px_rgba(16,185,129,0.08)]'
                  : isNodeActive
                  ? 'border-emerald-500/30 bg-[#080808]'
                  : 'border-white/[0.08] bg-[#070707] opacity-85'
              }`}
            >
              {/* Corner Cyber Brackets */}
              <span className={`absolute top-1.5 left-1.5 font-mono text-[9px] transition-colors duration-200 pointer-events-none select-none ${
                isHovered || isCurrentScanFocus ? 'text-emerald-400' : 'text-zinc-700'
              }`}>┌</span>
              <span className={`absolute top-1.5 right-1.5 font-mono text-[9px] transition-colors duration-200 pointer-events-none select-none ${
                isHovered || isCurrentScanFocus ? 'text-emerald-400' : 'text-zinc-700'
              }`}>┐</span>
              <span className={`absolute bottom-1.5 left-1.5 font-mono text-[9px] transition-colors duration-200 pointer-events-none select-none ${
                isHovered || isCurrentScanFocus ? 'text-emerald-400' : 'text-zinc-700'
              }`}>└</span>
              <span className={`absolute bottom-1.5 right-1.5 font-mono text-[9px] transition-colors duration-200 pointer-events-none select-none ${
                isHovered || isCurrentScanFocus ? 'text-emerald-400' : 'text-zinc-700'
              }`}>┘</span>

              {/* Top Accent Scanline Bar */}
              {(isHovered || isCurrentScanFocus) && (
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />
              )}

              <div>
                {/* Header with icon, title, and node state */}
                <div className="flex items-start justify-between gap-3 mb-4 pb-3.5 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-[4px] border transition-colors ${
                      isHovered || isCurrentScanFocus
                        ? 'bg-[#101010] border-emerald-500/40 text-emerald-400'
                        : 'bg-[#0e0e0e] border-white/[0.06] text-zinc-400'
                    }`}>
                      {meta.icon}
                    </div>
                    <div>
                      <h3 className={`font-mono text-xs font-bold uppercase tracking-wider transition-colors ${
                        isHovered || isCurrentScanFocus ? 'text-emerald-300' : 'text-white'
                      }`}>
                        {category.category}
                      </h3>
                      <span className="text-[9px] font-mono text-zinc-500 block">
                        {meta.subtext}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-[2px] whitespace-nowrap font-medium transition-colors ${
                    isHovered || isCurrentScanFocus
                      ? 'text-emerald-300 bg-emerald-950/50 border border-emerald-500/40'
                      : isNodeActive
                      ? 'text-emerald-400 bg-emerald-950/20 border border-emerald-500/20'
                      : 'text-zinc-500 bg-zinc-900 border border-white/[0.05]'
                  }`}>
                    {meta.strength}
                  </span>
                </div>

                {/* Individual Technology Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {category.skills.map((skill, sIdx) => (
                    <SkillPill key={sIdx} skill={skill} isParentActive={isNodeActive || isHovered} />
                  ))}
                </div>
              </div>

              {/* Status footer line with live node status */}
              <div className="mt-5 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[9px] font-mono text-zinc-500">
                <span className="uppercase tracking-widest">
                  {isHovered ? (
                    <span className="text-emerald-400 font-bold">BUS_CONDUIT // ACTIVE</span>
                  ) : isNodeActive ? (
                    <span>MODULE // 0{idx + 1}</span>
                  ) : (
                    <span>NODE // STANDBY</span>
                  )}
                </span>
                <span className={`font-medium flex items-center gap-1 ${
                  isNodeActive || isHovered ? 'text-emerald-400' : 'text-zinc-600'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isNodeActive || isHovered ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-700'
                  }`} />
                  {isNodeActive || isHovered ? 'ONLINE' : 'IDLE'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. BOTTOM TERMINAL STRIP */}
      <div className="bg-[#080808] border border-white/[0.08] hover:border-emerald-500/30 rounded-[6px] px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono select-none transition-all duration-300 shadow-lg relative z-10">
        <div className="flex items-center gap-2 text-zinc-300">
          <span className="text-emerald-400 font-bold">&gt;</span>
          <span className="tracking-wide">Always learning. Always building. Always shipping.</span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400">
          <span className="text-emerald-400 font-semibold">aadesh@portfolio:~$</span>
          <span className="w-2 h-3.5 bg-emerald-400 animate-pulse inline-block" />
        </div>
      </div>

    </div>
  );
};
export default AiSkillMatrix;
