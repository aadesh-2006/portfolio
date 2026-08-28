import React, { useEffect, useLayoutEffect } from 'react';
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
  Terminal
} from 'lucide-react';

const HOME_SCROLL_KEY = 'home_page_scroll_pos';
const RESTORE_HOME_FLAG = 'restore_home_scroll';

export const HomeScroll: React.FC = () => {
  const navigate = useNavigate();

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
                className="flex items-start justify-between border border-border-grid bg-[#080808] p-4 rounded-[4px] hover:border-accent-cyan/30 transition-all font-mono"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-accent-cyan" />
                    <span className="text-xs font-semibold text-text-main">{cert.title}</span>
                  </div>
                  <span className="text-[9px] text-text-muted block">{cert.issuer.toUpperCase()}</span>
                </div>
                <span className="text-[9px] text-accent-cyan font-bold tracking-widest">{cert.date.toUpperCase()}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

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
