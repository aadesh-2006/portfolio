import React, { useMemo } from 'react';
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
  Sparkles
} from 'lucide-react';
import type { SkillCategory } from '../content/portfolioData';

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

const SkillPill: React.FC<{ skill: string }> = ({ skill }) => {
  const projects = projectMap[skill];

  return (
    <div className="relative group/pill z-10">
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.15 }}
        className="px-3 py-1.5 text-[11px] sm:text-xs font-mono text-zinc-300 border border-white/[0.08] rounded-[4px] bg-[#0c0c0c] hover:border-emerald-400/50 hover:text-emerald-300 hover:bg-emerald-950/20 transition-all duration-200 cursor-default flex items-center gap-1.5 shadow-sm"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 group-hover/pill:bg-emerald-400 transition-colors" />
        <span>{skill}</span>
      </motion.div>

      {/* Contextual Hover Tooltip */}
      {projects && projects.length > 0 && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[220px] bg-[#0a0a0a] border border-emerald-500/30 px-3 py-2 rounded-[3px] opacity-0 group-hover/pill:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-2xl backdrop-blur-md">
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

  return (
    <div className="w-full space-y-10 text-left select-none">
      
      {/* 1. SECTION HEADER */}
      <div className="space-y-4 max-w-3xl">
        {/* Tracker badge */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <span className="font-mono text-xs text-emerald-400 font-semibold tracking-widest uppercase">
            // SKILLS
          </span>
        </div>

        {/* Main Heading & Subtitle */}
        <div className="space-y-3">
          <h2 className="font-syncopate text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Skills That Power <br />
            <span className="text-emerald-400 drop-shadow-[0_0_25px_rgba(52,211,153,0.35)]">
              Real-World Impact.
            </span>
          </h2>
          <p className="font-sans text-sm sm:text-base text-zinc-400 font-light leading-relaxed max-w-2xl">
            A diverse set of technologies, frameworks and tools I use to build scalable, high-performance and impactful solutions.
          </p>
        </div>
      </div>

      {/* 2. SKILLS OVERVIEW PANEL (3 Compact Balanced Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="bg-[#080808] border border-white/[0.08] hover:border-emerald-500/40 p-4 sm:p-5 rounded-[6px] transition-all duration-300 group shadow-lg">
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
        <div className="bg-[#080808] border border-white/[0.08] hover:border-emerald-500/40 p-4 sm:p-5 rounded-[6px] transition-all duration-300 group shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <Layers className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">SYS_METRIC</span>
          </div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
            {skills.length > 0 ? `${skills.length}+` : '8+'}
          </div>
          <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5 font-medium">
            Categories
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#080808] border border-white/[0.08] hover:border-emerald-500/40 p-4 sm:p-5 rounded-[6px] transition-all duration-300 group shadow-lg">
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

      {/* 3. SKILL CATEGORY GRID (Responsive 1/2/3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {skills.map((category, idx) => {
          const meta = categoryConfig[category.category] || {
            icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
            strength: "Strength: Strong",
            subtext: "Technical Capabilities"
          };

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-[#080808] border border-white/[0.08] hover:border-emerald-500/40 p-5 sm:p-6 rounded-[6px] transition-all duration-300 flex flex-col justify-between group shadow-xl relative overflow-hidden"
            >
              {/* Subtle top indicator glow bar */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div>
                {/* Header with icon, title, and strength indicator */}
                <div className="flex items-start justify-between gap-3 mb-4 pb-3.5 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-[#0e0e0e] border border-white/[0.06] rounded-[4px] group-hover:border-emerald-500/30 transition-colors">
                      {meta.icon}
                    </div>
                    <div>
                      <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider group-hover:text-emerald-300 transition-colors">
                        {category.category}
                      </h3>
                      <span className="text-[9px] font-mono text-zinc-500 block">
                        {meta.subtext}
                      </span>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-2 py-0.5 rounded-[2px] whitespace-nowrap font-medium">
                    {meta.strength}
                  </span>
                </div>

                {/* Individual Technology Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {category.skills.map((skill, sIdx) => (
                    <SkillPill key={sIdx} skill={skill} />
                  ))}
                </div>
              </div>

              {/* Status footer line */}
              <div className="mt-5 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[9px] font-mono text-zinc-500">
                <span className="uppercase tracking-widest">MODULE // 0{idx + 1}</span>
                <span className="text-emerald-400/80 font-medium">SYS_VERIFIED ✓</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 4. BOTTOM TERMINAL STRIP */}
      <div className="bg-[#080808] border border-white/[0.08] hover:border-emerald-500/30 rounded-[6px] px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono select-none transition-all duration-300 shadow-lg">
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
