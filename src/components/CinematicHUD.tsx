import React, { useEffect, useState } from 'react';
import { Cpu, Terminal, Award, Layers, Sparkles, Activity } from 'lucide-react';

interface TimelinePhase {
  id: string;
  code: string;
  label: string;
  icon: React.ReactNode;
  threshold: number;
}

const PHASES: TimelinePhase[] = [
  { id: 'hero', code: '01', label: 'INIT', icon: <Sparkles className="w-3 h-3" />, threshold: 0.0 },
  { id: 'projects', code: '02', label: 'WORK', icon: <Cpu className="w-3 h-3" />, threshold: 0.15 },
  { id: 'skills', code: '03', label: 'SKILLS', icon: <Layers className="w-3 h-3" />, threshold: 0.35 },
  { id: 'metrics', code: '04', label: 'METRICS', icon: <Activity className="w-3 h-3" />, threshold: 0.55 },
  { id: 'certifications', code: '05', label: 'REGISTRY', icon: <Award className="w-3 h-3" />, threshold: 0.75 },
  { id: 'contact', code: '06', label: 'PING', icon: <Terminal className="w-3 h-3" />, threshold: 0.90 },
];

export const CinematicHUD: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const totalScrollable = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const progress = Math.min(Math.max(scrollY / totalScrollable, 0), 1);
      setScrollProgress(progress);

      // Determine active phase by element position for accurate tracking
      const sectionOffsets = PHASES.map(p => {
        if (p.id === 'hero') return 0;
        const el = document.getElementById(p.id);
        return el ? el.offsetTop - 200 : Infinity;
      });

      let current = 0;
      for (let i = sectionOffsets.length - 1; i >= 0; i--) {
        if (scrollY >= sectionOffsets[i]) {
          current = i;
          break;
        }
      }
      setActivePhaseIndex(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToPhase = (phaseId: string) => {
    if (phaseId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(phaseId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const activePhase = PHASES[activePhaseIndex];

  return (
    <aside 
      aria-label="System Timeline Telemetry"
      className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end select-none pointer-events-none"
    >
      <div className="bg-[#080808]/90 border border-border-grid/80 rounded-[4px] p-3 shadow-2xl backdrop-blur-md pointer-events-auto space-y-3 font-mono text-[10px] w-48 text-right glass-panel">
        
        {/* Top Telemetry Header */}
        <div className="border-b border-border-grid/40 pb-2 flex items-center justify-between text-text-muted">
          <span className="text-[8px] uppercase tracking-widest">TIMELINE_HUD</span>
          <span className="flex items-center gap-1 text-[9px] text-[var(--dynamic-accent,#06b6d4)] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--dynamic-accent,#06b6d4)] animate-pulse" />
            {(scrollProgress * 100).toFixed(0)}%
          </span>
        </div>

        {/* Active Phase Display */}
        <div className="space-y-0.5">
          <div className="text-[9px] text-text-muted uppercase tracking-wider">ACTIVE_MODULE</div>
          <div className="text-xs font-bold text-text-main flex items-center justify-end gap-1.5 transition-colors">
            <span className="text-[var(--dynamic-accent,#06b6d4)]">{activePhase.icon}</span>
            <span>[{activePhase.code} // {activePhase.label}]</span>
          </div>
        </div>

        {/* Phase Step Nodes (Clickable Navigation) */}
        <div className="space-y-1 pt-0.5">
          {PHASES.map((phase, idx) => {
            const isActive = idx === activePhaseIndex;
            return (
              <button
                key={phase.id}
                onClick={() => scrollToPhase(phase.id)}
                className={`w-full flex items-center justify-between px-2 py-0.5 rounded-[2px] transition-all duration-200 cursor-pointer text-[9px] ${
                  isActive
                    ? 'bg-[var(--dynamic-dim,rgba(6,182,212,0.1))] text-[var(--dynamic-accent,#06b6d4)] font-bold border-l-2 border-[var(--dynamic-accent,#06b6d4)]'
                    : 'text-text-muted hover:text-text-main hover:bg-[#111111]'
                }`}
              >
                <span>{phase.code}</span>
                <span>{phase.label}</span>
              </button>
            );
          })}
        </div>

        {/* Continuous Progress Bar */}
        <div className="pt-2 border-t border-border-grid/40">
          <div className="w-full h-1 bg-[#141414] rounded-full overflow-hidden relative">
            <div
              className="h-full bg-[var(--dynamic-accent,#06b6d4)] transition-all duration-100 rounded-full"
              style={{ width: `${Math.max(scrollProgress * 100, 4)}%` }}
            />
          </div>
        </div>

      </div>
    </aside>
  );
};

