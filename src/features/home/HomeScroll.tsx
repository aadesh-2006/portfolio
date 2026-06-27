import React, { useState } from 'react';
import { Hero } from './Hero';
import { ThreeDCard } from '../../components/ThreeDCard';
import { Text } from '../../components/Text';
import { portfolioData } from '../../content/portfolioData';
import type { Project } from '../../content/portfolioData';
import { 
  ArrowRight, 
  Cpu, 
  Code, 
  Award, 
  Terminal, 
  Send
} from 'lucide-react';

export const HomeScroll: React.FC = () => {
  // Contact Form state variables
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      setStatus('ERROR: EMAIL_AND_MESSAGE_REQUIRED');
      return;
    }
    setStatus('TRANSMITTING...');
    setTimeout(() => {
      setStatus('TRANSMISSION_SUCCESSFUL // LOGGED_TO_SYSTEM');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="w-full flex-1 flex flex-col divide-y divide-border-grid bg-canvas-bg/30 relative">
      
      {/* 3D Nebula particle background */}
      {/* (Rendered underneath all content) */}

      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. PROJECTS SECTION */}
      <section id="projects" className="py-20 scroll-mt-12 text-left app-container">
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
                className="h-full flex flex-col justify-between p-6 group glass-panel"
                glowColor="rgba(6, 182, 212, 0.15)"
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
                    <span className="text-[10px] font-mono text-accent-purple tracking-wide block uppercase font-bold">
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
                        className="text-[9px] font-mono border border-border-grid/50 bg-canvas-bg/30 px-1.5 py-0.5 rounded-[2px] text-text-muted"
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
                    <a 
                      href={`#${project.links.caseStudy}`}
                      className="inline-flex items-center gap-1 font-mono text-[10px] text-accent-cyan hover:text-text-main hover:translate-x-1 transition-all"
                    >
                      DIAGNOSE CASE <ArrowRight className="w-3 h-3" />
                    </a>
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
      <section id="skills" className="py-20 bg-surface-bg/35 scroll-mt-12 text-left app-container">
        <div className="space-y-10">
          
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-border-grid/50 pb-4">
            <div className="flex items-center gap-2.5">
              <Code className="w-4 h-4 text-accent-cyan animate-pulse" />
              <Text variant="label" className="text-accent-cyan font-bold tracking-[0.15em]">[ SYSTEMS // MODULE_02 ]</Text>
            </div>
            <span className="text-[10px] font-mono text-text-muted">SKILL MATRIX DISTRIBUTION</span>
          </div>

          {/* Detailed structured skills cards (Full-Width Grid) */}
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {portfolioData.skills.map((cat, idx) => (
                <div 
                  key={idx} 
                  className="border border-border-grid bg-canvas-bg/30 p-4 rounded-[4px] space-y-3 hover:border-accent-cyan/30 transition-all duration-300"
                >
                  <span className="text-[10px] font-mono text-accent-cyan uppercase tracking-widest font-bold block border-b border-border-grid/30 pb-1">
                    // {cat.category.toUpperCase()}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((skill, i) => (
                      <span 
                        key={i} 
                        className="text-[10px] font-mono bg-surface-bg border border-border-grid px-2 py-0.5 rounded-[2px] text-text-main"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 4. CERTIFICATIONS SECTION */}
      <section id="certifications" className="py-20 scroll-mt-12 text-left app-container">
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
                className="flex items-start justify-between border border-border-grid/60 bg-surface-bg/40 p-4 rounded-[4px] hover:border-accent-cyan/20 transition-all font-mono"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-accent-cyan" />
                    <span className="text-xs font-semibold text-text-main">{cert.title}</span>
                  </div>
                  <span className="text-[9px] text-text-muted block">{cert.issuer.toUpperCase()}</span>
                </div>
                <span className="text-[9px] text-accent-purple font-bold tracking-widest">{cert.date.toUpperCase()}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. CONTACT SECTION (Interactive Terminal Theme) */}
      <section id="contact" className="py-20 bg-surface-bg/35 scroll-mt-12 text-left app-container">
        <div className="max-w-5xl mx-auto space-y-10">
          
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-border-grid/50 pb-4">
            <div className="flex items-center gap-2.5">
              <Terminal className="w-4 h-4 text-accent-cyan animate-pulse" />
              <Text variant="label" className="text-accent-cyan font-bold tracking-[0.15em]">[ PING // CONNECTION_SETUP ]</Text>
            </div>
            <span className="text-[10px] font-mono text-text-muted">PORT:_8080 TCP</span>
          </div>

          {/* Cyber Terminal block form */}
          <div className="border border-border-grid bg-canvas-bg/90 rounded-[4px] overflow-hidden shadow-2xl glass-panel relative scanlines">
            
            {/* Terminal Header header */}
            <div className="bg-surface-bg border-b border-border-grid/80 px-4 py-2 flex items-center justify-between font-mono text-[10px] text-text-muted select-none">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                <span className="ml-1 text-accent-cyan font-bold">AADESH_TERMINAL // SECURE_LINE</span>
              </div>
              <span>TTY // 004</span>
            </div>

            {/* Terminal Body */}
            <form onSubmit={handleSendMessage} className="p-6 font-mono text-xs space-y-4">
              
              <div className="space-y-1">
                <div className="text-text-muted font-bold">// INITIALIZE TRANSMISSION DIRECTIVE</div>
                <div className="text-text-muted">GUEST@AADESH_SYS:~# cd /sys/network/ports/connect</div>
              </div>

              {/* Email Input prompt */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-accent-cyan font-bold">GUEST@AADESH_SYS:/connect$</span>
                  <span>input_email --verify</span>
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  required
                  className="w-full bg-surface-bg/40 border border-border-grid px-3 py-2 text-text-main rounded-[2px] focus:outline-none focus:border-accent-cyan/80 font-mono text-xs transition-colors"
                />
              </div>

              {/* Message Textarea prompt */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-accent-cyan font-bold">GUEST@AADESH_SYS:/connect$</span>
                  <span>write_buffer --log-message</span>
                </div>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter message details for systems operator..."
                  required
                  rows={4}
                  className="w-full bg-surface-bg/40 border border-border-grid px-3 py-2 text-text-main rounded-[2px] focus:outline-none focus:border-accent-cyan/80 font-mono text-xs transition-colors resize-none"
                />
              </div>

              {/* System response logs */}
              {status && (
                <div className="border border-accent-cobalt/35 bg-surface-bg/35 p-3 rounded-[2px] text-[10px] text-accent-cyan font-bold">
                  <span className="text-accent-purple font-semibold">STATUS_LOG:</span> {status}
                </div>
              )}

              {/* Submit / Transmit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-accent-cyan hover:bg-accent-cobalt text-white font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] cursor-pointer transition-colors focus:outline-none"
                >
                  TRANSMIT PING <Send className="w-3.5 h-3.5" />
                </button>
              </div>

            </form>
          </div>

          {/* Social connections pill */}
          <div className="flex justify-center gap-6 font-mono text-xs text-text-muted">
            <a 
              href={portfolioData.linkedin} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 hover:text-accent-cyan transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg> LINKEDIN
            </a>
            <span className="text-border-grid/40 select-none">|</span>
            <a 
              href={portfolioData.github} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 hover:text-accent-cyan transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg> GITHUB
            </a>
          </div>

        </div>
      </section>

    </div>
  );
};
