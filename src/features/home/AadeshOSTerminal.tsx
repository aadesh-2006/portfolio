import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, X, Copy, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '../../content/portfolioData';

interface TerminalLine {
  type: 'prompt' | 'output' | 'system';
  text: string;
  isProjectList?: boolean;
}

// Defined outside component so closures inside setInterval / setTimeout
// always reference the same stable array and never capture a stale/undefined value.
const STARTUP_LINES: TerminalLine[] = [
  { type: 'system', text: 'Initializing developer environment...' },
  { type: 'system', text: 'Loading engineering profile...' },
  { type: 'system', text: 'Loading project registry...' },
  { type: 'system', text: 'Loading communication protocols...' },
  { type: 'system', text: 'System Ready. Type "help" for a list of commands.' }
];

// Module-level in-memory session store.
// Persists across component unmount/remount during the client session (route changes),
// and resets only on explicit clear or full site reload.
let sessionTerminalHistory: TerminalLine[] | null = null;
let sessionBootCompleted = false;

export const AadeshOSTerminal: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<TerminalLine[]>(() => sessionTerminalHistory ?? []);
  const [inputValue, setInputValue] = useState('');
  const [bootStep, setBootStep] = useState<number>(() => (sessionBootCompleted ? 2 : 0)); // 0: typing "boot", 1: boot lines, 2: ready
  const [typedBootText, setTypedBootText] = useState<string>(() => (sessionBootCompleted ? 'boot' : ''));
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync state changes to module session store
  useEffect(() => {
    if (history.length > 0) {
      sessionTerminalHistory = history;
    }
  }, [history]);

  useEffect(() => {
    if (bootStep === 2) {
      sessionBootCompleted = true;
    }
  }, [bootStep]);

  // 1. Startup Experience - auto typing "boot" and booting log sequence (only if not booted yet)
  useEffect(() => {
    if (bootStep === 0) {
      const fullText = 'boot';
      let currentIdx = 0;
      const interval = setInterval(() => {
        if (currentIdx < fullText.length) {
          setTypedBootText((prev) => prev + fullText[currentIdx]);
          currentIdx++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setBootStep(1);
          }, 400);
        }
      }, 150);
      return () => clearInterval(interval);
    }
  }, [bootStep]);

  // 2. Play boot loading lines sequentially (only if not booted yet)
  useEffect(() => {
    if (bootStep === 1) {
      let currentLineIdx = 0;
      const initialHistory: TerminalLine[] = [{ type: 'prompt', text: 'boot' }];
      setHistory(initialHistory);
      sessionTerminalHistory = initialHistory;

      const interval = setInterval(() => {
        if (currentLineIdx < STARTUP_LINES.length) {
          const line = STARTUP_LINES[currentLineIdx];
          if (line) {
            setHistory((prev) => {
              const next = [...prev, line];
              sessionTerminalHistory = next;
              return next;
            });
          }
          currentLineIdx++;
        } else {
          clearInterval(interval);
          setBootStep(2);
          sessionBootCompleted = true;
        }
      }, 350);
      return () => clearInterval(interval);
    }
  }, [bootStep]);

  // 3. Auto-scroll the terminal's internal output box to its bottom.
  // Uses scrollTop on the scrollable container div — NOT scrollIntoView on the sentinel —
  // so the browser page position never jumps.
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [history, typedBootText]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    if (!trimmedCmd) return;

    // Append user prompt entry to history
    setHistory((prev) => {
      const next: TerminalLine[] = [...prev, { type: 'prompt', text: cmd }];
      sessionTerminalHistory = next;
      return next;
    });

    switch (trimmedCmd) {
      case 'clear':
        // Smoothly clear terminal history back to the startup lines
        setHistory([...STARTUP_LINES]);
        sessionTerminalHistory = [...STARTUP_LINES];
        break;

      case 'help':
        setHistory((prev) => [
          ...prev,
          {
            type: 'output',
            text: 'Available commands: about, skills, projects, resume, github, linkedin, leetcode, mail, clear'
          }
        ]);
        break;

      case 'about':
        setHistory((prev) => [
          ...prev,
          { type: 'output', text: '• Aadesh Gund - Third Year Computer Science Student' },
          { type: 'output', text: '• Focus Areas: AI / ML, Backend Engineering, Computer Vision, Full Stack Development' },
          { type: 'output', text: '• Engineering Focus: Building scalable, low-latency developer systems and optimized intelligent models.' }
        ]);
        break;

      case 'skills':
        setHistory((prev) => [
          ...prev,
          { type: 'output', text: '--- SKILLS MATRIX ---' },
          { type: 'output', text: 'Languages: Python, Java, JavaScript, TypeScript, SQL, C, C++' },
          { type: 'output', text: 'Frameworks: React, Spring Boot, FastAPI, Express.js, Node.js' },
          { type: 'output', text: 'AI / ML: PyTorch, YOLOv8, Physics-Informed Neural Networks (PINN), NumPy, Scikit-learn' },
          { type: 'output', text: 'Databases: MongoDB, MySQL' },
          { type: 'output', text: 'Tools: Git, GitHub, Docker, Linux, VS Code, Vercel' }
        ]);
        break;

      case 'projects':
        setHistory((prev) => [
          ...prev,
          { type: 'output', text: 'Available Engineering Systems (Click on any name to diagnose case):' },
          { type: 'output', text: '', isProjectList: true }
        ]);
        break;

      case 'resume':
        setHistory((prev) => [...prev, { type: 'system', text: 'Opening Resume...' }]);
        setTimeout(() => {
          window.open(portfolioData.resume, '_blank');
        }, 1000);
        break;

      case 'github':
        setHistory((prev) => [
          ...prev,
          { type: 'system', text: 'Opening GitHub Profile...' },
          { type: 'system', text: 'Connection established. Launching...' }
        ]);
        setTimeout(() => {
          window.open('https://github.com/aadesh-2006', '_blank');
        }, 1200);
        break;

      case 'linkedin':
        setHistory((prev) => [
          ...prev,
          { type: 'system', text: 'Opening LinkedIn Profile...' },
          { type: 'system', text: 'Connection established. Launching...' }
        ]);
        setTimeout(() => {
          window.open('https://www.linkedin.com/in/aadesh-gund-83b19a225/', '_blank');
        }, 1200);
        break;

      case 'leetcode':
        setHistory((prev) => [
          ...prev,
          { type: 'system', text: 'Opening LeetCode Profile...' },
          { type: 'system', text: 'Connection established. Launching...' }
        ]);
        setTimeout(() => {
          window.open('https://leetcode.com/u/Aadesh_2006/', '_blank');
        }, 1200);
        break;

      case 'mail':
      case 'email':
        setHistory((prev) => {
          const next: TerminalLine[] = [
            ...prev,
            { type: 'system', text: 'Initializing secure transmission channel...' },
            { type: 'system', text: 'Opening communication console modal...' }
          ];
          sessionTerminalHistory = next;
          return next;
        });
        setIsEmailModalOpen(true);
        break;

      default:
        setHistory((prev) => [
          ...prev,
          { type: 'system', text: `Command not recognized: "${cmd}". Type "help" for a list of valid commands.` }
        ]);
    }
  };

  const handleCopyEmail = async () => {
    const targetEmail = 'aadeshgund.2006@gmail.com';
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(targetEmail);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = targetEmail;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (!successful) throw new Error('Copy command failed');
      }
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2500);
    } catch {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2500);
    }
  };

  const handleCloseEmailModal = () => {
    setIsEmailModalOpen(false);
    setCopyStatus('idle');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bootStep !== 2) return;
    const cmd = inputValue;
    setInputValue('');
    executeCommand(cmd);
  };

  const handleReturnToPortfolio = () => {
    if (window.location.pathname === '/' || window.location.pathname === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  };

  const handleQuickCommandClick = (cmd: string) => {
    if (bootStep !== 2) return;
    executeCommand(cmd);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 select-none">
      
      {/* Persistent top-left Exit / Return Control */}
      <div className="flex justify-start">
        <button
          onClick={handleReturnToPortfolio}
          className="inline-flex items-center gap-2 font-mono text-xs text-text-muted hover:text-accent-cyan cursor-pointer transition-colors duration-200 border border-border-grid bg-[#080808] px-3 py-1.5 rounded-[4px] focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          ← Return to Portfolio
        </button>
      </div>

      {/* Interactive OS Terminal Panel */}
      <div 
        onClick={focusInput}
        className="border border-border-grid bg-[#080808] rounded-[6px] overflow-hidden shadow-2xl glass-panel relative scanlines cursor-text"
      >
        {/* macOS traffic light window bars */}
        <div className="bg-[#0c0c0c] border-b border-border-grid/50 px-4 py-3 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-xs font-mono font-semibold text-text-muted uppercase tracking-wider">
            AadeshOS Terminal v2.0
          </span>
          <div className="w-12" /> {/* spacer for visual symmetry */}
        </div>

        {/* Console screen display output — scrollContainerRef drives internal auto-scroll */}
        <div ref={scrollContainerRef} className="p-6 font-mono text-xs space-y-3 h-[320px] overflow-y-auto text-left select-text">
          {history.map((line, idx) => {
            // Guard against any undefined entry that may have slipped in via stale closure
            if (!line) return null;

            if (line.type === 'prompt') {
              return (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="text-accent-cyan font-bold">aadesh@system:~$</span>
                  <span className="text-text-main">{line.text}</span>
                </div>
              );
            }
            if (line.isProjectList) {
              return (
                <div key={idx} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1 select-none">
                  {[
                    { label: 'UrbanCadastral', slug: 'urbancadastral-ai' },
                    { label: 'FinAnalyst', slug: 'ai-financial-research-analyst' },
                    { label: 'FlowSync', slug: 'flowsync' },
                    { label: 'AeroFind', slug: 'aerofind' },
                    { label: 'WealthTrack', slug: 'wealthtrack' },
                    { label: 'IntelliRAG', slug: 'intellirag' }
                  ].map((proj) => (
                    <button
                      key={proj.slug}
                      onClick={() => navigate(`/projects/${proj.slug}`)}
                      className="border border-border-grid bg-[#0a0a0a] hover:border-accent-cyan/80 hover:text-accent-cyan px-2 py-1.5 rounded-[3px] text-center font-mono text-[9px] text-text-muted uppercase font-bold transition-all cursor-pointer truncate"
                    >
                      {proj.label}
                    </button>
                  ))}
                </div>
              );
            }
            return (
              <div 
                key={idx} 
                className={`${
                  line.type === 'system' ? 'text-accent-purple font-semibold' : 'text-text-muted'
                } leading-relaxed`}
              >
                {line.text ?? ''}
              </div>
            );
          })}

          {/* Typing simulation next to active prompt input during boot sequence */}
          {bootStep === 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-accent-cyan font-bold">aadesh@system:~$</span>
              <span className="text-text-main">{typedBootText}</span>
              <span className="w-1.5 h-3 bg-accent-cyan animate-pulse inline-block" />
            </div>
          )}

          {/* Prompt line input field area */}
          {bootStep === 2 && (
            <form onSubmit={handleFormSubmit} className="flex items-center gap-1.5 w-full">
              <span className="text-accent-cyan font-bold select-none">aadesh@system:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                className="flex-1 bg-transparent border-none outline-none text-text-main font-mono text-xs caret-accent-cyan"
              />
            </form>
          )}

          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* Quick click command shortcut buttons bar */}
      <div className="flex flex-wrap gap-2.5 justify-center select-none pt-2">
        {['about', 'skills', 'projects', 'resume', 'github', 'linkedin', 'leetcode', 'mail', 'clear'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleQuickCommandClick(cmd)}
            disabled={bootStep !== 2}
            className={`border font-mono text-[10px] uppercase tracking-wider px-3.5 py-2.5 rounded-[4px] transition-all duration-150 focus:outline-none ${
              bootStep === 2
                ? 'border-border-grid bg-surface-bg/60 text-text-main hover:border-accent-cyan hover:text-accent-cyan cursor-pointer hover:bg-surface-bg/85'
                : 'border-border-grid/30 bg-surface-bg/20 text-text-muted/40 cursor-not-allowed'
            }`}
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* =========================================
          EMAIL TRANSMISSION MODAL (Terminal Action)
      ========================================= */}
      <AnimatePresence>
        {isEmailModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
              onClick={handleCloseEmailModal}
            />
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-border-grid rounded-[6px] shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden glass-panel select-none"
            >
              {/* Modal Header */}
              <div className="border-b border-border-grid/50 p-4 flex justify-between items-center bg-[#0d0d0d]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_#06b6d4]" />
                  <span className="font-mono text-[10px] tracking-widest text-text-muted uppercase">SYSTEM_MAIL_COMM</span>
                </div>
                <button 
                  onClick={handleCloseEmailModal}
                  className="text-text-muted hover:text-accent-cyan transition-colors focus:outline-none p-1"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 flex flex-col items-center text-center space-y-6">
                <div className="w-12 h-12 rounded-full bg-[#080808] border border-accent-cyan/30 flex items-center justify-center text-accent-cyan shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                  <Mail className="w-5 h-5" />
                </div>

                <div className="space-y-1.5 w-full relative">
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest block">EMAIL ADDRESS</span>
                  <div className="mt-2 py-3 px-4 bg-[#050505] border border-border-grid rounded-[3px] select-all">
                    <span className="text-sm font-mono text-text-main font-bold tracking-wide">aadeshgund.2006@gmail.com</span>
                  </div>
                </div>

                <div className="flex gap-4 w-full pt-2">
                  <button 
                    onClick={handleCopyEmail}
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border font-mono text-[10px] uppercase tracking-widest rounded-[3px] transition-all font-bold ${
                      copyStatus === 'copied'
                        ? 'border-green-500/60 bg-green-950/20 text-green-400'
                        : copyStatus === 'error'
                        ? 'border-red-500/60 bg-red-950/20 text-red-400'
                        : 'border-border-grid hover:border-accent-cyan bg-[#080808] text-text-main hover:text-accent-cyan'
                    }`}
                  >
                    {copyStatus === 'copied' && (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span>COPIED ✓</span>
                      </>
                    )}
                    {copyStatus === 'error' && (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                        <span>COPY FAILED</span>
                      </>
                    )}
                    {copyStatus === 'idle' && (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>COPY EMAIL</span>
                      </>
                    )}
                  </button>

                  <button 
                    onClick={handleCloseEmailModal}
                    className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-white text-black hover:bg-accent-cyan hover:text-black font-mono text-[10px] uppercase tracking-widest font-bold rounded-[3px] transition-all"
                  >
                    CLOSE
                  </button>
                </div>

                <AnimatePresence>
                  {copyStatus === 'copied' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }} 
                      animate={{ opacity: 1, y: -12 }} 
                      exit={{ opacity: 0, y: -5 }}
                      className="text-[10px] font-mono text-green-400 tracking-widest"
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

    </div>
  );
};
