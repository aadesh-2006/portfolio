import React from 'react';
import { Cpu, ArrowRight } from 'lucide-react';
import { AiCoreOrbit } from '../../components/AiCoreOrbit';
import { portfolioData } from '../../content/portfolioData';

export const Hero: React.FC = () => {
  return (
    <section className="w-full min-h-[calc(100vh-64px)] flex flex-col justify-between relative overflow-hidden select-none py-12">
      
      {/* Blueprint Grid Lines (Exposed structural layout) */}
      <div className="absolute inset-0 pointer-events-none cyber-grid opacity-[0.03] dark:opacity-[0.02]" />

      {/* Top Telemetry Info Margin */}
      <div className="w-full flex items-center justify-between font-mono text-[9px] text-text-muted z-10 border-b border-border-grid/40 pb-2 app-container">
        <span className="flex items-center gap-1.5 font-bold text-accent-cyan">
          <Cpu className="w-3 h-3 animate-pulse" />
          [ SYSTEM_ACTIVE // MODEL_INFERENCE_ONLINE ]
        </span>
        <span className="hidden sm:inline">COORDS // {portfolioData.coordinates}</span>
      </div>

      {/* Main Core Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full z-10 py-10 app-container">
        
        {/* Left Column (45%) */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6 text-left w-full">
          {/* Role pill status */}
          <div className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border-grid bg-surface-bg/85 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
            <span className="text-[10px] font-mono text-text-muted tracking-widest uppercase font-bold">
              {portfolioData.role}
            </span>
          </div>

          {/* Large Glowing Logo Font Name */}
          <div className="space-y-4 relative w-full">
            {/* Glowing Background Radial Ambient Light */}
            <div className="absolute -top-10 left-0 w-[300px] h-[120px] bg-gradient-to-r from-accent-cobalt/10 via-accent-purple/10 to-accent-cyan/10 rounded-full blur-[50px] -z-10 pointer-events-none" />

            {/* The Font Name - Syncopate Styled */}
            <h1 className="font-syncopate text-3xl sm:text-5xl lg:text-4xl xl:text-5xl font-bold tracking-[0.25em] text-text-main leading-tight select-none uppercase">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-[0_2px_15px_rgba(99,102,241,0.4)]">
                {portfolioData.firstName}
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-[0_2px_15px_rgba(99,102,241,0.4)]">
                {portfolioData.lastName}
              </span>
            </h1>
          </div>

          {/* Tagline description text */}
          <p className="max-w-xl text-sm sm:text-base font-sans text-text-muted leading-relaxed font-light">
            {portfolioData.tagline}
          </p>

          {/* Home floating controls capsule */}
          <div className="flex flex-wrap gap-4 pt-2">
            <a 
              href="/projects" 
              className="flex items-center gap-2 px-5 py-2.5 bg-text-main text-canvas-bg hover:bg-accent-cyan hover:text-white font-mono text-xs uppercase tracking-wider font-bold rounded-[2px] transition-all duration-300 shadow-md focus:outline-none"
            >
              EXPLORE SCHEMATICS <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a 
              href="/connect" 
              className="flex items-center gap-2 px-5 py-2.5 border border-border-grid hover:border-accent-cyan bg-surface-bg/60 text-text-main font-mono text-xs uppercase tracking-wider font-bold rounded-[2px] transition-all duration-300 focus:outline-none"
            >
              ESTABLISH LINK
            </a>
          </div>
        </div>

        {/* Right Column (55% / Redesigned for visual balance and centered centerpiece) */}
        <div className="lg:col-span-7 w-full h-[450px] md:h-[520px] lg:h-[580px] xl:h-[620px] flex items-center justify-center relative overflow-hidden">
          <AiCoreOrbit radius={210} maxCanvasSize={580} />
        </div>

      </div>

      {/* Bottom Ticker/Tech Stack Ticker (Trusted tools worldwide) */}
      <div className="w-full z-10 border-t border-border-grid/40 pt-4 mt-6 app-container">
        <p className="text-center font-mono text-[9px] text-text-muted uppercase tracking-widest mb-3">
          // INTEGRATED CORE SYSTEMS INFRASTRUCTURE
        </p>
        <div className="w-full overflow-hidden relative select-none">
          <div className="flex gap-8 justify-around items-center opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
            <span className="font-mono text-xs tracking-wider font-semibold">PYTORCH</span>
            <span className="font-mono text-xs tracking-wider font-semibold">YOLOV8</span>
            <span className="font-mono text-xs tracking-wider font-semibold">REACT.JS</span>
            <span className="font-mono text-xs tracking-wider font-semibold">FASTAPI</span>
            <span className="font-mono text-xs tracking-wider font-semibold">MONGO_DB</span>
            <span className="font-mono text-xs tracking-wider font-semibold">SPRING_BOOT</span>
          </div>
        </div>
      </div>

    </section>
  );
};
export default Hero;
