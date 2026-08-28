import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Hero } from './Hero';
import { ThreeDCard } from '../../components/ThreeDCard';
import { Text } from '../../components/Text';
import { portfolioData } from '../../content/portfolioData';
import type { Project } from '../../content/portfolioData';
import { AiSkillMatrix } from '../../components/AiSkillMatrix';
import { AadeshOSTerminal } from './AadeshOSTerminal';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Cpu, 
  Award, 
  Terminal,
  Eye,
  X,
  ExternalLink
} from 'lucide-react';

const HOME_SCROLL_KEY = 'home_page_scroll_pos';
const RESTORE_HOME_FLAG = 'restore_home_scroll';

export const HomeScroll: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProof, setSelectedProof] = useState<{ title: string; issuer: string; image: string } | null>(null);

  // Synchronously restore scroll position BEFORE the browser paints the first frame
  useLayoutEffect(() => {
    const shouldRestore = sessionStorage.getItem(RESTORE_HOME_FLAG);
    if (shouldRestore === 'true') {
      sessionStorage.removeItem(RESTORE_HOME_FLAG);
      const savedPos = sessionStorage.getItem(HOME_SCROLL_KEY);
      if (savedPos) {
        const targetY = parseFloat(savedPos);
        if (!isNaN(targetY) && targetY > 0) {
          window.scrollTo(0, targetY);
        }
      }
    }
  }, []);

  // Track scroll position on Home for session preservation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        sessionStorage.setItem(HOME_SCROLL_KEY, window.scrollY.toString());
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (window.scrollY > 0) {
        sessionStorage.setItem(HOME_SCROLL_KEY, window.scrollY.toString());
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="w-full flex-1 flex flex-col divide-y divide-border-grid bg-black relative">
      
      {/* 3D Nebula particle background */}
      {/* (Rendered underneath all content) */}

      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. PROJECTS SECTION */}
      <section id="projects" className="py-20 scroll-mt-12 text-left app-container bg-black">
        <div className="space-y-10">
          
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-border-grid/50 pb-4">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-accent-cyan animate-pulse" />
              <Text variant="label" className="text-accent-cyan font-bold tracking-[0.15em]">[ WORK // MODULE_01 ]</Text>
            </div>
            <span className="text-[10px] font-mono text-text-muted">CORE PROJECTS SCHEMATIC</span>
          </div>

          {/* Projects grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioData.projects.map((project: Project) => (
              <ThreeDCard
                key={project.id}
                className="h-full flex flex-col justify-between p-6 group glass-panel cursor-pointer"
                glowColor="rgba(6, 182, 212, 0.12)"
                onClick={() => {
                  if (project.links.caseStudy) {
                    sessionStorage.setItem(HOME_SCROLL_KEY, window.scrollY.toString());
                    sessionStorage.setItem(RESTORE_HOME_FLAG, 'true');
                    navigate(project.links.caseStudy);
                  }
                }}
              >
                <div className="space-y-4">
                  {/* Top indicators */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
                      <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider">
                        {project.id.toUpperCase()}_SYS
                      </span>
                    </div>
                    {project.links.github && (
                      <a 
                        href={project.links.github} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-text-muted hover:text-accent-cyan transition-colors"
                        aria-label="GitHub link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                    )}
                  </div>

                  {/* Project Title */}
                  <div className="space-y-1">
                    <Text variant="subheading" className="text-xl font-bold text-text-main group-hover:text-accent-cyan transition-colors">
                      {project.title}
                    </Text>
                    <span className="text-[10px] font-mono text-accent-cyan tracking-wide block uppercase font-bold">
                      {project.tagline}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-text-muted leading-relaxed font-sans font-light">
                    {project.description}
                  </p>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1 pt-2">
                    {project.technologies.map((tech, i) => (
                      <span 
                        key={i} 
                        className="text-[9px] font-mono border border-border-grid/50 bg-[#080808] px-1.5 py-0.5 rounded-[2px] text-text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Bullets detail list */}
                  <ul className="text-[10px] text-text-muted/80 font-mono space-y-1.5 border-t border-border-grid/30 pt-3">
                    {project.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex gap-1.5">
                        <span className="text-accent-cyan select-none">&gt;</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                </div>

                {/* Footer Action link */}
                <div className="pt-6 mt-6 border-t border-border-grid/30 flex items-center justify-between">
                  {project.metrics && project.metrics.length > 0 ? (
                    <div className="flex flex-col">
                      <span className="text-[8px] font-mono text-text-muted uppercase">SYS_METRIC</span>
                      <span className="text-[9px] font-mono text-accent-cyan font-semibold">
                        {project.metrics[0].label}: {project.metrics[0].value}
                      </span>
                    </div>
                  ) : <div />}

                  {project.links.caseStudy ? (
                    <Link 
                      to={project.links.caseStudy}
                      className="inline-flex items-center gap-1 font-mono text-[10px] text-accent-cyan hover:text-text-main hover:translate-x-1 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        sessionStorage.setItem(HOME_SCROLL_KEY, window.scrollY.toString());
                        sessionStorage.setItem(RESTORE_HOME_FLAG, 'true');
                      }}
                    >
                      DIAGNOSE CASE <ArrowRight className="w-3 h-3" />
                    </Link>
                  ) : (
                    <span className="text-[9px] font-mono text-text-muted uppercase italic">
                      [ COMPILED_SUCCESS ]
                    </span>
                  )}
                </div>
              </ThreeDCard>
            ))}
          </div>

        </div>
      </section>

      {/* 3. SKILLS SECTION */}
      <section id="skills" className="py-24 bg-black scroll-mt-12 text-left app-container">
        <AiSkillMatrix skills={portfolioData.skills} />
      </section>

      {/* 4. CERTIFICATIONS SECTION */}
      <section id="certifications" className="py-20 bg-black scroll-mt-12 text-left app-container">
        <div className="space-y-10">
          
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-border-grid/50 pb-4">
            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4 text-accent-cyan animate-pulse" />
              <Text variant="label" className="text-accent-cyan font-bold tracking-[0.15em]">[ REGISTRY // MODULE_03 ]</Text>
            </div>
            <span className="text-[10px] font-mono text-text-muted">VERIFIED CREDENTIALS</span>
          </div>

          {/* List layout of credentials */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {portfolioData.certifications.map((cert, idx) => (
              <div 
                key={idx}
                className={`flex flex-col justify-between border border-border-grid bg-[#080808] p-4 rounded-[4px] hover:border-accent-cyan/40 transition-all duration-300 font-mono group ${
                  cert.proofImage || cert.credentialUrl ? 'border-accent-cyan/30 shadow-[0_0_20px_rgba(6,182,212,0.06)]' : ''
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${cert.proofImage || cert.credentialUrl ? 'bg-accent-cyan animate-pulse' : 'bg-accent-cyan/70'}`} />
                        <span className="text-xs font-semibold text-text-main group-hover:text-accent-cyan transition-colors">
                          {cert.title}
                        </span>
                      </div>
                      <span className="text-[9px] text-text-muted block pl-3">
                        {cert.issuer.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-[9px] text-accent-cyan font-bold tracking-widest whitespace-nowrap">
                      {cert.date.toUpperCase()}
                    </span>
                  </div>

                  {/* Compact proof preview thumbnail for visual certificates (Goldman Sachs, Microsoft NLP) */}
                  {cert.proofImage && (
                    <div className="pt-1 pl-3 space-y-2">
                      <div 
                        onClick={() => setSelectedProof({ title: cert.title, issuer: cert.issuer, image: cert.proofImage! })}
                        className="relative rounded-[3px] overflow-hidden border border-border-grid/80 hover:border-accent-cyan/60 bg-[#050505] cursor-pointer group/thumb transition-all duration-200"
                      >
                        <div className="h-28 w-full overflow-hidden relative">
                          <img 
                            src={cert.proofImage} 
                            alt={`${cert.title} Proof`} 
                            className="w-full h-full object-cover object-top opacity-85 group-hover/thumb:opacity-100 group-hover/thumb:scale-[1.02] transition-all duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end justify-between p-2">
                            <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-emerald-400" />
                              VERIFIED PROOF
                            </span>
                            <span className="inline-flex items-center gap-1 text-[9px] font-mono text-accent-cyan bg-black/80 border border-accent-cyan/40 px-2 py-0.5 rounded-[2px] backdrop-blur-sm group-hover/thumb:bg-accent-cyan group-hover/thumb:text-black font-semibold transition-all">
                              <Eye className="w-2.5 h-2.5" />
                              VIEW PROOF
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* External verification button for credentials with an official link */}
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-1.5 text-[9px] font-mono text-accent-cyan hover:text-black bg-[#0a0a0a] hover:bg-accent-cyan border border-accent-cyan/40 px-3 py-1.5 rounded-[2px] transition-all font-bold tracking-wider uppercase group/btn cursor-pointer shadow-sm"
                        >
                          <span>VIEW CREDENTIAL</span>
                          <ExternalLink className="w-2.5 h-2.5 transition-transform group-hover/btn:translate-x-0.5" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* For credentials with official link but without separate local image screenshot */}
                  {!cert.proofImage && cert.credentialUrl && (
                    <div className="pt-1 pl-3 space-y-2">
                      <div className="h-28 w-full rounded-[3px] border border-border-grid/80 bg-[#050505] p-3 flex flex-col justify-between relative overflow-hidden">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-mono text-accent-cyan uppercase tracking-wider">
                            MS_LEARN // VERIFIED
                          </span>
                          <Award className="w-3.5 h-3.5 text-accent-cyan/80" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold text-text-main block line-clamp-1">
                            {cert.title}
                          </span>
                          <span className="text-[8px] font-mono text-text-muted block">
                            OFFICIAL DIGITAL RECORD
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[8px] font-mono text-zinc-400 uppercase tracking-wider">
                          <span className="w-1 h-1 rounded-full bg-emerald-400" />
                          VERIFIED CREDENTIAL
                        </div>
                      </div>

                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-1.5 text-[9px] font-mono text-accent-cyan hover:text-black bg-[#0a0a0a] hover:bg-accent-cyan border border-accent-cyan/40 px-3 py-1.5 rounded-[2px] transition-all font-bold tracking-wider uppercase group/btn cursor-pointer shadow-sm"
                      >
                        <span>VIEW CREDENTIAL</span>
                        <ExternalLink className="w-2.5 h-2.5 transition-transform group-hover/btn:translate-x-0.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Visual Proof Modal Viewer */}
      {selectedProof && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none"
          onClick={() => setSelectedProof(null)}
        >
          <div 
            className="relative max-w-2xl w-full bg-[#0a0a0a] border border-border-grid rounded-[6px] shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden glass-panel"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-border-grid/50 p-4 flex justify-between items-center bg-[#0d0d0d]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_#06b6d4]" />
                <span className="font-mono text-[10px] tracking-widest text-text-muted uppercase">
                  VERIFIED_CREDENTIAL // PROOF_VIEWER
                </span>
              </div>
              <button 
                onClick={() => setSelectedProof(null)}
                className="text-text-muted hover:text-accent-cyan transition-colors focus:outline-none p-1"
                aria-label="Close proof viewer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content / Inspection */}
            <div className="p-4 sm:p-6 bg-[#050505] flex flex-col items-center">
              <div className="w-full max-h-[70vh] overflow-y-auto rounded-[4px] border border-border-grid/60 bg-[#070707] p-2 flex items-center justify-center">
                <img 
                  src={selectedProof.image} 
                  alt={selectedProof.title} 
                  className="max-w-full max-h-[65vh] w-auto h-auto object-contain rounded-[2px]"
                />
              </div>

              <div className="w-full mt-4 pt-3 border-t border-border-grid/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
                <div>
                  <h4 className="text-text-main font-bold">{selectedProof.title}</h4>
                  <span className="text-[10px] text-text-muted block uppercase mt-0.5">{selectedProof.issuer}</span>
                </div>
                <button
                  onClick={() => setSelectedProof(null)}
                  className="px-4 py-1.5 bg-white text-black hover:bg-accent-cyan hover:text-black font-mono text-[10px] uppercase tracking-wider font-bold rounded-[3px] transition-all cursor-pointer"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. CONTACT SECTION (Interactive Terminal Theme) */}
      <section id="contact" className="py-20 bg-black scroll-mt-12 text-left app-container">
        <div className="max-w-5xl mx-auto space-y-10">
          
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-border-grid/50 pb-4">
            <div className="flex items-center gap-2.5">
              <Terminal className="w-4 h-4 text-accent-cyan animate-pulse" />
              <Text variant="label" className="text-accent-cyan font-bold tracking-[0.15em]">[ PING // CONNECTION_SETUP ]</Text>
            </div>
            <span className="text-[10px] font-mono text-text-muted">PORT:_8080 TCP</span>
          </div>

          {/* Interactive Terminal rendered directly */}
          <AadeshOSTerminal />

        </div>
      </section>

    </div>
  );
};
