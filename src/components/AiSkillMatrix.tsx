import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { SkillCategory } from '../content/portfolioData';

interface AiSkillMatrixProps {
  skills: SkillCategory[];
}

const projectMap: Record<string, string[]> = {
  "PyTorch": ["AeroFind"],
  "YOLOv8": ["FlowSync"],
  "Physics-Informed Neural Networks (PINN)": ["AeroFind"],
  "React.js": ["FlowSync", "ProgramEnergy", "Portfolio", "PeerBridge"],
  "FastAPI": ["FlowSync"],
  "MongoDB": ["ProgramEnergy"],
  "Express.js": ["ProgramEnergy"],
  "Node.js": ["ProgramEnergy", "PeerBridge"],
  "Socket.io": ["ProgramEnergy"],
  "JWT": ["ProgramEnergy"],
  "Python": ["AeroFind", "FlowSync"],
  "Pandas": ["AeroFind"],
  "NumPy": ["AeroFind"],
  "Scikit-learn": ["AeroFind"],
  "SUMO": ["FlowSync"],
  "TraCI": ["FlowSync"],
  "Java": ["PeerBridge"],
  "Spring Boot": ["PeerBridge"],
  "SQL": ["PeerBridge"],
  "MySQL": ["PeerBridge"]
};

const SkillPill: React.FC<{ skill: string }> = ({ skill }) => {
  const projects = projectMap[skill];
  
  return (
    <div className="relative group/pill z-10">
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="px-2.5 py-1 text-[10px] font-mono text-text-main border border-border-grid/50 rounded-[2px] bg-canvas-bg/50 group-hover/pill:border-accent-cyan group-hover/pill:text-accent-cyan group-hover/pill:shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-colors duration-300 cursor-default"
      >
        {skill}
      </motion.div>
      
      {/* Contextual Hover Tooltip */}
      {projects && projects.length > 0 && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] bg-[#08051a]/95 border border-accent-purple/50 px-3 py-2 rounded-[2px] opacity-0 group-hover/pill:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-xl backdrop-blur-md">
          <span className="text-[8px] font-mono text-text-muted block mb-1 uppercase tracking-wider border-b border-border-grid/50 pb-0.5">
            Module Activity
          </span>
          <span className="text-[9px] font-mono text-accent-cyan leading-tight block">
            Integrated in: {projects.join(", ")}
          </span>
        </div>
      )}
    </div>
  );
};

const SkillModule: React.FC<{ category: SkillCategory; className?: string }> = ({ category, className = "" }) => {
  return (
    <div className={`glass-panel p-5 rounded-[4px] border border-border-grid hover:border-accent-cyan/40 transition-colors duration-500 bg-surface-bg/30 backdrop-blur-md relative group ${className}`}>
      {/* Active/Loaded Badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan/80 animate-pulse" />
        <span className="text-[8px] font-mono text-accent-cyan tracking-widest opacity-80">ACTIVE</span>
      </div>
      
      <h3 className="font-mono text-[11px] uppercase text-text-main font-bold mb-4 tracking-widest group-hover:text-accent-cyan transition-colors">
        {category.category}
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill, idx) => (
          <SkillPill key={idx} skill={skill} />
        ))}
      </div>
    </div>
  );
};

export const AiSkillMatrix: React.FC<AiSkillMatrixProps> = ({ skills }) => {
  const totalTech = useMemo(() => skills.reduce((acc, cat) => acc + cat.skills.length, 0), [skills]);
  const totalProjects = 4; // Based on portfolio data

  // For the desktop radial layout, we assign specific absolute positions to each of the 5 categories.
  // We assume skills array has 5 items.
  const desktopPositions = [
    { left: '2%', top: '5%', width: '30%' },         // Top Left (AI/ML)
    { right: '2%', top: '5%', width: '30%' },        // Top Right (Programming)
    { left: '2%', bottom: '5%', width: '30%' },      // Bottom Left (Full Stack)
    { right: '2%', bottom: '5%', width: '30%' },     // Bottom Right (DB/Tools)
    { left: '50%', bottom: '5%', width: '36%', transform: 'translateX(-50%)' } // Bottom Center (CS Core)
  ];

  // SVG lines connecting the center core to the modules on desktop
  const connectionLines = [
    { x1: '50%', y1: '40%', x2: '17%', y2: '15%' }, // to Top Left
    { x1: '50%', y1: '40%', x2: '83%', y2: '15%' }, // to Top Right
    { x1: '50%', y1: '40%', x2: '17%', y2: '80%' }, // to Bottom Left
    { x1: '50%', y1: '40%', x2: '83%', y2: '80%' }, // to Bottom Right
    { x1: '50%', y1: '40%', x2: '50%', y2: '85%' }, // to Bottom Center
  ];

  return (
    <div className="w-full relative">
      
      {/* MOBILE LAYOUT (Stack) */}
      <div className="flex lg:hidden flex-col gap-8 relative z-10">
        {/* Central Core (Mobile) */}
        <div className="flex flex-col items-center justify-center my-6">
          <div className="relative w-32 h-32 rounded-full border border-accent-cyan/50 bg-surface-bg/80 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <motion.div 
              animate={{ top: ['-20%', '120%'] }} 
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              className="absolute left-0 w-full h-[2px] bg-accent-cyan shadow-[0_0_12px_#06B6D4]" 
            />
            <span className="font-syncopate text-[10px] text-text-main tracking-widest text-center leading-tight">
              SKILL<br/>MATRIX
            </span>
          </div>
          <div className="mt-5 flex flex-col items-center font-mono text-[9px] text-text-muted space-y-1 bg-surface-bg/40 px-4 py-2.5 rounded-[4px] border border-border-grid/50 backdrop-blur-sm">
            <span className="text-accent-cyan font-bold tracking-widest mb-1">SYSTEM ONLINE</span>
            <span>MODULES: {skills.length < 10 ? `0${skills.length}` : skills.length}</span>
            <span>TECHNOLOGIES: {totalTech}</span>
            <span>PROJECTS: 0{totalProjects}</span>
          </div>
        </div>

        {/* Modules (Mobile) */}
        {skills.map((cat, idx) => (
          <SkillModule key={idx} category={cat} />
        ))}
      </div>

      {/* DESKTOP LAYOUT (Radial Matrix) */}
      <div className="hidden lg:block relative w-full h-[750px] xl:h-[800px] z-10">
        
        {/* SVG Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {connectionLines.map((line, idx) => (
            <motion.line 
              key={idx}
              x1={line.x1} y1={line.y1} 
              x2={line.x2} y2={line.y2}
              className="stroke-accent-cyan/20" 
              strokeWidth="1.5"
              strokeDasharray="4 4"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 3, delay: idx * 0.5 }}
            />
          ))}
        </svg>

        {/* Central Core (Desktop) */}
        <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-20">
          <div className="relative w-44 h-44 rounded-full border border-accent-cyan/60 bg-[#08051a]/90 flex items-center justify-center overflow-hidden shadow-[0_0_35px_rgba(6,182,212,0.25)] group">
            
            {/* Inner Rotating Ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute inset-2 rounded-full border border-dashed border-accent-purple/30"
            />
            
            {/* Core Scanning Line */}
            <motion.div 
              animate={{ top: ['-20%', '120%'] }} 
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              className="absolute left-0 w-full h-[2px] bg-accent-cyan shadow-[0_0_15px_#06B6D4]" 
            />
            
            <span className="font-syncopate text-[11px] text-text-main tracking-[0.2em] text-center leading-loose z-10 group-hover:text-accent-cyan transition-colors">
              SKILL<br/>MATRIX
            </span>
          </div>

          {/* Telemetry Readout */}
          <div className="mt-8 flex flex-col items-center font-mono text-[10px] text-text-muted space-y-1.5 bg-surface-bg/60 px-6 py-3 rounded-[4px] border border-border-grid backdrop-blur-md shadow-lg">
            <span className="text-accent-cyan font-bold tracking-[0.2em] mb-1">SYSTEM ONLINE</span>
            <div className="flex gap-4 opacity-80">
               <span className="flex flex-col items-center">
                 <span className="text-[8px]">MODULES</span>
                 <span className="text-text-main">{skills.length < 10 ? `0${skills.length}` : skills.length}</span>
               </span>
               <span className="flex flex-col items-center border-l border-r border-border-grid/50 px-4">
                 <span className="text-[8px]">TECH</span>
                 <span className="text-text-main">{totalTech}</span>
               </span>
               <span className="flex flex-col items-center">
                 <span className="text-[8px]">PROJECTS</span>
                 <span className="text-text-main">0{totalProjects}</span>
               </span>
            </div>
          </div>
        </div>

        {/* Surrounding Modules (Desktop) */}
        {skills.map((cat, idx) => {
          const pos = desktopPositions[idx] || { left: '0', top: '0' };
          return (
            <div 
              key={idx} 
              className="absolute z-10" 
              style={{ 
                left: pos.left, 
                right: pos.right, 
                top: pos.top, 
                bottom: pos.bottom, 
                width: pos.width,
                transform: pos.transform 
              }}
            >
              <SkillModule category={cat} />
            </div>
          );
        })}

      </div>
    </div>
  );
};
