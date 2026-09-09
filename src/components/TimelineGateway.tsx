import React from 'react';

interface TimelineGatewayProps {
  label: string;
  sublabel: string;
  sourceCode: string;
  targetCode: string;
}

export const TimelineGateway: React.FC<TimelineGatewayProps> = ({
  label,
  sublabel,
  sourceCode,
  targetCode,
}) => {
  return (
    <div className="w-full py-8 flex flex-col items-center justify-center select-none font-mono relative overflow-hidden">
      {/* Background connector line */}
      <div className="w-full max-w-xl flex items-center justify-between px-6 relative">
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-border-grid to-[var(--dynamic-accent,#06b6d4)] opacity-40" />
        
        {/* Central Gateway Node Indicator */}
        <div className="mx-4 px-3 py-1 rounded-[3px] bg-[#070707] border border-border-grid shadow-lg flex items-center gap-2 z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--dynamic-accent,#06b6d4)] animate-pulse" />
          <span className="text-[9px] text-text-muted uppercase tracking-widest">
            {sourceCode} &rarr; {targetCode} // <span className="text-[var(--dynamic-accent,#06b6d4)] font-bold">{label}</span>
          </span>
        </div>

        <div className="flex-1 h-[1px] bg-gradient-to-r from-[var(--dynamic-accent,#06b6d4)] via-border-grid to-transparent opacity-40" />
      </div>

      <span className="text-[8px] text-zinc-600 uppercase tracking-widest mt-1.5">
        {sublabel}
      </span>
    </div>
  );
};
