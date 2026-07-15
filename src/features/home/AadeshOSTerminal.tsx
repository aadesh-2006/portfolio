import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

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

export const AadeshOSTerminal: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [bootStep, setBootStep] = useState(0); // 0: typing "boot", 1: boot lines, 2: ready
  const [typedBootText, setTypedBootText] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Startup Experience - auto typing "boot" and booting log sequence
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

  // 2. Play boot loading lines sequentially
  useEffect(() => {
    if (bootStep === 1) {
      let currentLineIdx = 0;
      setHistory([
        { type: 'prompt', text: 'boot' }
      ]);
      const interval = setInterval(() => {
        if (currentLineIdx < STARTUP_LINES.length) {
          const line = STARTUP_LINES[currentLineIdx];
          if (line) {
            setHistory((prev) => [...prev, line]);
          }
          currentLineIdx++;
        } else {
          clearInterval(interval);
          setBootStep(2);
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
    setHistory((prev) => [...prev, { type: 'prompt', text: cmd }]);

    switch (trimmedCmd) {
      case 'clear':
        // Smoothly clear terminal history back to the startup lines
        setHistory([...STARTUP_LINES]);
        break;

      case 'help':
        setHistory((prev) => [
          ...prev,
          {
            type: 'output',
            text: 'Available commands: about, skills, projects, resume, github, linkedin, leetcode, email, clear'
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
          window.open('https://aadeshgund.github.io/resume/resume.pdf', '_blank');
        }, 1000);
        break;

      case 'github':
        setHistory((prev) => [
          ...prev,
          { type: 'system', text: 'Opening GitHub Repository...' },
          { type: 'system', text: 'Connection established. Launching...' }
        ]);
        setTimeout(() => {
          window.open('https://github.com/AadeshGund', '_blank');
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

      case 'email':
        setHistory((prev) => [
          ...prev,
          { type: 'system', text: 'Launching mail client...' },
          { type: 'system', text: 'Redirecting to mail client...' }
        ]);
        setTimeout(() => {
          window.location.href = 'mailto:contact@aadesh.dev';
        }, 1200);
        break;

      default:
        setHistory((prev) => [
          ...prev,
          { type: 'system', text: `Command not recognized: "${cmd}". Type "help" for a list of valid commands.` }
        ]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bootStep !== 2) return;
    const cmd = inputValue;
    setInputValue('');
    executeCommand(cmd);
  };

  const handleReturnToPortfolio = () => {
    // Navigate back to the Hero section via React Router
    navigate('/');
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
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
          className="inline-flex items-center gap-2 font-mono text-xs text-text-muted hover:text-accent-cyan cursor-pointer transition-colors duration-200 border border-border-grid bg-surface-bg/40 px-3 py-1.5 rounded-[4px] focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          ← Return to Portfolio
        </button>
      </div>

      {/* Interactive OS Terminal Panel */}
      <div 
        onClick={focusInput}
        className="border border-border-grid bg-[#08051a]/95 rounded-[6px] overflow-hidden shadow-2xl glass-panel relative scanlines cursor-text"
      >
        {/* macOS traffic light window bars */}
        <div className="bg-surface-bg/80 border-b border-border-grid/50 px-4 py-3 flex items-center justify-between select-none">
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
                <div key={idx} className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1 select-none">
                  {['FlowSync', 'ProgramEnergy', 'PeerBridge', 'AeroFind', 'Portfolio'].map((proj) => (
                    <button
                      key={proj}
                      onClick={() => navigate(`/projects/${proj.toLowerCase()}`)}
                      className="border border-border-grid bg-surface-bg/30 hover:border-accent-cyan/80 hover:text-accent-cyan px-2.5 py-1.5 rounded-[3px] text-center font-mono text-[10px] text-text-muted uppercase font-bold transition-all cursor-pointer"
                    >
                      {proj}
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
                autoFocus
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
        {['about', 'skills', 'projects', 'resume', 'github', 'linkedin', 'leetcode', 'email', 'clear'].map((cmd) => (
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

    </div>
  );
};
