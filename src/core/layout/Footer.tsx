import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { Code2, Mail, Download, Loader2, CheckCircle2, XCircle, Copy, Check, X } from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

import { portfolioData } from '../../content/portfolioData';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [latency, setLatency] = useState(24);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  
  // Close modal on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsEmailModalOpen(false);
    };
    if (isEmailModalOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isEmailModalOpen]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('aadeshgund.2006@gmail.com');
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };
  
  // Simulate fluctuating latency for terminal feel
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * (45 - 12 + 1) + 12));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTransmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setStatus('sending');

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // MOCK MODE if keys are missing
    if (!serviceId || !templateId || !publicKey) {
      setTimeout(() => {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 4000);
      }, 1800);
      return;
    }

    try {
      await emailjs.send(serviceId, templateId, formData, publicKey);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    } catch (error) {
      console.error('Transmission Error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/aadesh-2006', icon: <GithubIcon className="w-5 h-5" /> },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/aadesh-gund-83b19a225/', icon: <LinkedinIcon className="w-5 h-5" /> },
    { name: 'LeetCode', url: 'https://leetcode.com/u/Aadesh_2006/', icon: <Code2 className="w-5 h-5" /> },
    { name: 'Email', url: 'mailto:aadeshgund.2006@gmail.com', icon: <Mail className="w-5 h-5" />, internal: true }
  ];

  return (
    <footer className="w-full bg-[#03010a] border-t border-border-grid/40 relative select-none">
      
      {/* Subtle Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-between">
        <div className="w-[30%] h-full bg-accent-cyan/5 blur-[120px] rounded-full -translate-x-1/2" />
        <div className="w-[30%] h-full bg-accent-purple/5 blur-[120px] rounded-full translate-x-1/2" />
      </div>

      <div className="app-container py-24 relative z-10 flex flex-col lg:flex-row gap-16 xl:gap-24">
        
        {/* =========================================
            LEFT COLUMN: CONNECTION HUB
        ========================================= */}
        <div className="w-full lg:w-1/2 flex flex-col space-y-10">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-border-grid/50 pb-5">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_10px_#06b6d4]" />
              <span className="font-syncopate text-sm text-accent-cyan tracking-[0.2em] font-bold">
                [ PING // CONNECTION_SETUP ]
              </span>
            </div>
            <p className="font-mono text-xs text-text-muted leading-relaxed max-w-md">
              Interested in collaborating on AI, Full Stack, or Software Engineering projects? 
              Feel free to reach out or connect with me.
            </p>
          </div>

          {/* Social Cards 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {socialLinks.map((link, idx) => {
              const content = (
                <>
                  {/* Neon edge glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-[inset_0_0_20px_rgba(6,182,212,0.15)]" />
                  
                  <div className="text-text-muted group-hover:text-accent-cyan transition-colors duration-300 drop-shadow-[0_0_8px_rgba(6,182,212,0)] group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
                    {link.icon}
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-text-main font-semibold group-hover:text-white transition-colors">
                    {link.name}
                  </span>
                </>
              );
              
              const baseClasses = "group relative glass-panel border border-border-grid hover:border-accent-cyan/60 bg-surface-bg/30 p-5 rounded-[4px] flex items-center gap-4 transition-colors duration-300 backdrop-blur-sm overflow-hidden w-full text-left focus:outline-none focus:ring-1 focus:ring-accent-cyan";

              if (link.name === 'Email') {
                return (
                  <motion.button
                    key={idx}
                    onClick={() => setIsEmailModalOpen(true)}
                    whileHover={{ y: -3, scale: 1.02 }}
                    className={baseClasses}
                  >
                    {content}
                  </motion.button>
                );
              }

              return (
                <motion.a
                  key={idx}
                  href={link.url}
                  target={link.internal ? undefined : '_blank'}
                  rel={link.internal ? undefined : 'noreferrer'}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className={baseClasses}
                >
                  {content}
                </motion.a>
              );
            })}
          </div>

          {/* Resume Button */}
          <div className="pt-2">
            <a 
              href={portfolioData.resume} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 bg-[#0a071d] border border-accent-cyan/40 hover:border-accent-cyan text-accent-cyan font-mono text-xs uppercase tracking-[0.2em] font-bold rounded-[3px] transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-accent-cyan/5 w-0 group-hover:w-full transition-all duration-500 ease-out" />
              <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" /> 
              <span className="relative z-10">DOWNLOAD RESUME</span>
            </a>
          </div>
        </div>

        {/* =========================================
            RIGHT COLUMN: CONTACT TERMINAL
        ========================================= */}
        <div className="w-full lg:w-1/2">
          <div className="border border-border-grid bg-[#08051a]/70 backdrop-blur-xl rounded-[6px] flex flex-col shadow-2xl relative overflow-hidden group/terminal">
            
            {/* Terminal Top Bar */}
            <div className="bg-[#0b0821] border-b border-border-grid/60 p-5 rounded-t-[5px]">
              <div className="text-[10px] font-mono text-text-muted/70 tracking-[0.25em] border-b border-border-grid/40 pb-3 mb-3 font-semibold">
                CONNECTION STATUS
              </div>
              <div className="grid grid-cols-2 gap-y-2.5 text-[10px] font-mono tracking-wider">
                <div className="flex justify-between pr-5">
                  <span className="text-text-muted">SERVER</span>
                  <span className="text-accent-cyan font-bold drop-shadow-[0_0_3px_#06b6d4]">ONLINE</span>
                </div>
                <div className="flex justify-between pl-5 border-l border-border-grid/50">
                  <span className="text-text-muted">ENCRYPTION</span>
                  <span className="text-accent-purple font-bold drop-shadow-[0_0_3px_#8b5cf6]">ACTIVE</span>
                </div>
                <div className="flex justify-between pr-5">
                  <span className="text-text-muted">CHANNEL</span>
                  <span className="text-accent-cyan font-bold drop-shadow-[0_0_3px_#06b6d4]">SECURE</span>
                </div>
                <div className="flex justify-between pl-5 border-l border-border-grid/50">
                  <span className="text-text-muted">LATENCY</span>
                  <span className="text-text-main font-bold">{latency} ms</span>
                </div>
              </div>
            </div>
            
            {/* Communication Form */}
            <form onSubmit={handleTransmit} className="p-6 sm:p-8 flex flex-col gap-6 relative z-10">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[9px] text-text-muted tracking-[0.15em] uppercase pl-1">NAME_ID</label>
                  <input 
                    required
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#05030f]/60 border border-border-grid rounded-[3px] p-3 font-mono text-xs text-text-main focus:outline-none focus:border-accent-cyan/80 focus:bg-[#0a071d] transition-all shadow-inner focus:shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[9px] text-text-muted tracking-[0.15em] uppercase pl-1">RETURN_ADDRESS</label>
                  <input 
                    required
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#05030f]/60 border border-border-grid rounded-[3px] p-3 font-mono text-xs text-text-main focus:outline-none focus:border-accent-cyan/80 focus:bg-[#0a071d] transition-all shadow-inner focus:shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] text-text-muted tracking-[0.15em] uppercase pl-1">TRANSMISSION_SUBJECT</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-[#05030f]/60 border border-border-grid rounded-[3px] p-3 font-mono text-xs text-text-main focus:outline-none focus:border-accent-cyan/80 focus:bg-[#0a071d] transition-all shadow-inner focus:shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] text-text-muted tracking-[0.15em] uppercase pl-1">DATA_PAYLOAD</label>
                <textarea 
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-[#05030f]/60 border border-border-grid rounded-[3px] p-3 font-mono text-xs text-text-main focus:outline-none focus:border-accent-cyan/80 focus:bg-[#0a071d] transition-all shadow-inner focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] resize-none h-32" 
                />
              </div>

              <button 
                disabled={status !== 'idle'} 
                type="submit" 
                className="w-full py-4 mt-2 bg-text-main text-[#03010a] hover:bg-accent-cyan hover:text-[#03010a] font-mono text-xs font-bold tracking-[0.2em] rounded-[3px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-text-main relative overflow-hidden flex items-center justify-center h-[52px]"
              >
                <AnimatePresence mode="wait">
                  {status === 'idle' && (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      TRANSMIT MESSAGE
                    </motion.span>
                  )}
                  {status === 'sending' && (
                    <motion.span key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-accent-cyan">
                      <Loader2 className="w-4 h-4 animate-spin" /> ENCRYPTING & SENDING...
                    </motion.span>
                  )}
                  {status === 'success' && (
                    <motion.span key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-green-500">
                      <CheckCircle2 className="w-4 h-4" /> TRANSMISSION SUCCESSFUL
                    </motion.span>
                  )}
                  {status === 'error' && (
                    <motion.span key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-red-500">
                      <XCircle className="w-4 h-4" /> TRANSMISSION FAILED
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* =========================================
          BOTTOM TELEMETRY BAR
      ========================================= */}
      <div className="w-full border-t border-border-grid/50 bg-[#020108] py-8">
        <div className="app-container flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          
          {/* Coordinates & Status */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 text-[9px] font-mono text-text-muted tracking-[0.15em] uppercase">
            <span className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-accent-cyan font-bold">&gt;</span> 
              <span>COORD: {portfolioData.coordinates}</span>
            </span>
            <span className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-accent-purple font-bold">&gt;</span> 
              <span>STATUS: {portfolioData.role}</span>
            </span>
            <span className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-accent-cyan font-bold">&gt;</span> 
              <span>LOC: {portfolioData.location}</span>
            </span>
          </div>

          {/* Copyright & Architecture */}
          <div className="flex flex-col text-[9px] font-mono tracking-[0.15em] uppercase text-text-muted/60 items-center md:items-end gap-1.5">
            <span>© {currentYear} {portfolioData.name}. ALL RIGHTS SECURITY PROTOCOLS INTACT.</span>
            <span className="text-accent-purple/60 font-semibold tracking-[0.2em]">CORE_ARCH // REACT + THREE_D_ACCELERATION</span>
          </div>
        </div>
      </div>
      {/* =========================================
          EMAIL MODAL
      ========================================= */}
      <AnimatePresence>
        {isEmailModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#03010a]/80 backdrop-blur-md cursor-pointer"
              onClick={() => setIsEmailModalOpen(false)}
            />
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-[#08051a] border border-border-grid rounded-[6px] shadow-[0_0_50px_rgba(6,182,212,0.1)] overflow-hidden glass-panel"
            >
              <div className="border-b border-border-grid/50 p-4 flex justify-between items-center bg-[#0b0821]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_#06b6d4]" />
                  <span className="font-mono text-[10px] tracking-widest text-text-muted uppercase">SYSTEM_CONTACT</span>
                </div>
                <button 
                  onClick={() => setIsEmailModalOpen(false)}
                  className="text-text-muted hover:text-accent-cyan transition-colors focus:outline-none"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-8 flex flex-col items-center text-center space-y-6">
                <div className="w-12 h-12 rounded-full bg-surface-bg border border-accent-cyan/30 flex items-center justify-center text-accent-cyan shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1 w-full relative">
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest block">EMAIL ADDRESS</span>
                  <div className="mt-2 py-3 px-4 bg-surface-bg/50 border border-border-grid rounded-[3px] select-all">
                    <span className="text-sm font-mono text-text-main font-bold tracking-wide">aadeshgund.2006@gmail.com</span>
                  </div>
                </div>
                <div className="flex gap-4 w-full pt-4">
                  <button 
                    onClick={handleCopyEmail}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-surface-bg border border-border-grid hover:border-accent-cyan text-text-main hover:text-accent-cyan font-mono text-[10px] uppercase tracking-widest rounded-[3px] transition-all"
                  >
                    {hasCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {hasCopied ? 'COPIED' : 'COPY EMAIL'}
                  </button>
                  <button 
                    onClick={() => setIsEmailModalOpen(false)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-text-main text-[#03010a] hover:bg-accent-cyan hover:text-white font-mono text-[10px] uppercase tracking-widest font-bold rounded-[3px] transition-all"
                  >
                    CLOSE
                  </button>
                </div>
                <AnimatePresence>
                  {hasCopied && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: -20 }} 
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute bottom-6 text-[10px] font-mono text-green-400 tracking-widest"
                    >
                      Email copied to clipboard.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};
