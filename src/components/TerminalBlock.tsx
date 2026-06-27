import React from 'react';

export interface TerminalLine {
  type: 'command' | 'output' | 'error';
  text: string;
}

interface TerminalBlockProps {
  lines: TerminalLine[];
  className?: string;
}

export const TerminalBlock: React.FC<TerminalBlockProps> = ({
  lines,
  className = '',
}) => {
  return (
    <div className={`border border-border-grid rounded-[4px] overflow-hidden bg-[#0C0C0B] text-[#E0E0DB] font-mono text-sm ${className}`}>
      {/* Window Header */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[#242422] bg-[#161615] select-none">
        <span className="w-2 h-2 rounded-full bg-[#E54B4B]" />
        <span className="w-2 h-2 rounded-full bg-[#EAE03D]" />
        <span className="w-2 h-2 rounded-full bg-[#46B45F]" />
        <span className="text-xs text-[#808078] ml-2">console log</span>
      </div>
      {/* Console Area */}
      <div className="p-4 overflow-x-auto text-left leading-relaxed select-text space-y-1">
        {lines.map((line, index) => {
          if (line.type === 'command') {
            return (
              <div key={index} className="flex gap-2">
                <span className="text-accent-cobalt font-bold">$</span>
                <span>{line.text}</span>
              </div>
            );
          }
          if (line.type === 'error') {
            return (
              <div key={index} className="text-[#E54B4B] pl-4">
                {line.text}
              </div>
            );
          }
          return (
            <div key={index} className="text-[#808078] pl-4 whitespace-pre-wrap">
              {line.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};
