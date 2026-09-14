import React from 'react';
import { User, Terminal, Code2, Cpu, ShieldCheck, Compass } from 'lucide-react';
import { Text } from '../../components/Text';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-black scroll-mt-12 text-left app-container relative z-10">
      <div className="space-y-10">
        
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-border-grid/50 pb-4">
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-accent-cyan animate-pulse" />
            <Text variant="label" className="text-accent-cyan font-bold tracking-[0.15em]">
              [ PROFILE // MODULE_04 ]
            </Text>
          </div>
          <span className="text-[10px] font-mono text-text-muted uppercase">
            SYSTEM PROFILE // IDENTITY MATRIX
          </span>
        </div>

        {/* Main Content Layout: Compact 2-column on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Technical Metadata & System Status Indicators */}
          <div className="lg:col-span-4 space-y-4">
            <div className="border border-border-grid bg-[#080808] p-5 rounded-[4px] font-mono space-y-4 relative overflow-hidden">
              
              {/* Card Title & Pulsing Beacon */}
              <div className="flex items-center justify-between border-b border-border-grid/40 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-accent-cyan" />
                  <span className="text-[10px] uppercase font-bold text-text-main tracking-wider">
                    OPERATOR_TELEMETRY
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">ONLINE</span>
                </div>
              </div>

              {/* Prominent Academic Profile Block */}
              <div className="bg-[#0c0c0c] border border-border-grid/70 p-3 rounded-[3px] space-y-1.5">
                <div className="flex items-center justify-between text-[8px] text-text-muted uppercase tracking-widest border-b border-border-grid/30 pb-1">
                  <span className="text-accent-cyan font-bold">// ACADEMIC PROFILE</span>
                  <span className="text-emerald-400 font-semibold">3RD YEAR</span>
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-text-main tracking-wide">
                    B.TECH CSE
                  </div>
                  <div className="text-[10px] text-zinc-400 font-medium">
                    Computer Science &amp; Engineering
                  </div>
                  <div className="text-[9px] text-accent-cyan font-semibold tracking-wider">
                    VIT-AP UNIVERSITY
                  </div>
                </div>
              </div>

              {/* Status Key-Value Pairs */}
              <div className="space-y-2.5 text-[10px]">
                <div className="flex items-center justify-between py-1 border-b border-border-grid/20">
                  <span className="text-text-muted uppercase">PROFILE_STATUS</span>
                  <span className="text-accent-cyan font-semibold">ACTIVE</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-border-grid/20">
                  <span className="text-text-muted uppercase">DISCIPLINE</span>
                  <span className="text-text-main font-semibold">CS &amp; ENGINEERING</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-border-grid/20">
                  <span className="text-text-muted uppercase">PRIMARY FOCUS</span>
                  <span className="text-accent-cyan font-semibold">BACKEND + AI/ML</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-border-grid/20">
                  <span className="text-text-muted uppercase">OPERATIONAL MODE</span>
                  <span className="text-text-main font-semibold">BUILD / LEARN / SHIP</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-border-grid/20">
                  <span className="text-text-muted uppercase">CORE PILLARS</span>
                  <span className="text-text-main font-semibold">DSA &bull; ARCHITECTURE</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-text-muted uppercase">EXPANDING INTO</span>
                  <span className="text-accent-cyan font-semibold">OPEN-SOURCE &bull; APPLIED AI</span>
                </div>
              </div>

              {/* Subtle bottom telemetry signature */}
              <div className="pt-2 border-t border-border-grid/30 flex items-center justify-between text-[8px] text-text-muted">
                <span>NODE_ID: AADESH_GUND</span>
                <span>SYS_VER: 2026.4</span>
              </div>
            </div>

            {/* Quick Core Focus Tags */}
            <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
              <div className="border border-border-grid/60 bg-[#060606] px-3 py-2 rounded-[3px] flex items-center gap-2">
                <Code2 className="w-3 h-3 text-accent-cyan shrink-0" />
                <span className="text-text-muted truncate">Full-Stack &amp; APIs</span>
              </div>
              <div className="border border-border-grid/60 bg-[#060606] px-3 py-2 rounded-[3px] flex items-center gap-2">
                <Cpu className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="text-text-muted truncate">AI &amp; Neural Nets</span>
              </div>
              <div className="border border-border-grid/60 bg-[#060606] px-3 py-2 rounded-[3px] flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-accent-cyan shrink-0" />
                <span className="text-text-muted truncate">Stateful Runtimes</span>
              </div>
              <div className="border border-border-grid/60 bg-[#060606] px-3 py-2 rounded-[3px] flex items-center gap-2">
                <Compass className="w-3 h-3 text-purple-400 shrink-0" />
                <span className="text-text-muted truncate">Algorithmic DSA</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Main Narrative Statement */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                <span className="text-[10px] font-mono text-accent-cyan tracking-wider uppercase font-semibold">
                  DEVELOPER PROFILE &bull; ENGINEERING MINDSET
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-main font-syncopate tracking-tight leading-snug">
                Engineering Practical Systems <br />
                <span className="text-accent-cyan">From Architecture to Production.</span>
              </h3>
            </div>

            <div className="space-y-4 font-sans text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
              <p>
                I am a <strong className="text-text-main font-medium">Computer Science &amp; Engineering student</strong> dedicated to building real, production-minded software systems rather than stopping at superficial exercises.
              </p>
              <p>
                I enjoy translating ideas into functional tools — spanning <span className="text-white font-medium">high-performance backend services</span>, <span className="text-white font-medium">developer productivity platforms</span>, and <span className="text-white font-medium">applied AI/ML workflows</span>. My projects serve as hands-on testbeds where I experiment with modular architecture, asynchronous pipelines, data schemas, and the real engineering decisions that make software scalable and dependable.
              </p>
              <p>
                I consistently sharpen my problem-solving and computer science fundamentals through active competitive programming and system design while expanding deeper into open-source engineering and distributed architectures. The objective is straightforward: <span className="text-accent-cyan font-medium">understand systems end-to-end and engineer reliable software that solves real problems.</span>
              </p>
            </div>

            {/* Engineering Principles Highlights */}
            <div className="pt-4 border-t border-border-grid/40 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#080808] border border-border-grid/60 p-3.5 rounded-[3px] space-y-1">
                <span className="text-[9px] font-mono text-accent-cyan block font-semibold">01 // BACKEND &amp; APIS</span>
                <p className="text-[11px] font-mono text-text-muted leading-snug">
                  Stateful runtimes, REST contracts, caching, and message queues.
                </p>
              </div>

              <div className="bg-[#080808] border border-border-grid/60 p-3.5 rounded-[3px] space-y-1">
                <span className="text-[9px] font-mono text-emerald-400 block font-semibold">02 // APPLIED AI / ML</span>
                <p className="text-[11px] font-mono text-text-muted leading-snug">
                  Computer vision, AI/ML workflows, and RAG pipelines.
                </p>
              </div>

              <div className="bg-[#080808] border border-border-grid/60 p-3.5 rounded-[3px] space-y-1">
                <span className="text-[9px] font-mono text-purple-400 block font-semibold">03 // CORE RIGOR</span>
                <p className="text-[11px] font-mono text-text-muted leading-snug">
                  Data structures, algorithmic analysis, clean typing, and tests.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
