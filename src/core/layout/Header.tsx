import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Link, useLocation } from 'react-router-dom';
import { portfolioData } from '../../content/portfolioData';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [time, setTime] = useState<string>('');

  const isHome = location.pathname === '/';

  // Live futuristic clock updater
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hrs = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      const secs = now.getSeconds().toString().padStart(2, '0');
      setTime(`${hrs}:${mins}:${secs} UTC`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const NavLink = ({ to, href, label }: { to?: string; href?: string; label: string }) => {
    const classes = "text-[11px] font-mono uppercase tracking-wider text-text-muted hover:text-accent-cyan transition-colors duration-150 px-2.5 py-1 rounded-[2px] focus:outline-none relative group";
    
    if (href) {
      return (
        <a href={href} className={classes}>
          {label}
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-accent-cyan group-hover:w-3/4 transition-all duration-300" />
        </a>
      );
    }
    
    return (
      <Link to={to || '/'} className={classes}>
        {label}
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-accent-cyan group-hover:w-3/4 transition-all duration-300" />
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full flex items-center justify-between app-container py-4 border-b border-border-grid bg-canvas-bg/75 backdrop-blur-md select-none">
      
      {/* Brand logo & title */}
      <div className="flex items-center gap-3">
        <Link to="/" className="focus:outline-none flex items-center gap-2">
          <span className="font-syncopate text-xs font-bold tracking-widest text-text-main hover:text-accent-cyan transition-colors uppercase">
            {portfolioData.name}
          </span>
        </Link>
        <span className="hidden md:inline-flex items-center gap-1.5 text-[9px] font-mono border border-border-grid px-2 py-0.5 bg-surface-bg rounded-[2px] text-text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
          SYS_NODE_03 // ACTIVE
        </span>
      </div>

      {/* Floating style Navigation links */}
      <nav className="flex items-center gap-3 sm:gap-6 bg-surface-bg border border-border-grid px-4 py-1.5 rounded-full shadow-[0_8px_32px_0_rgba(99,102,241,0.03)] glass-panel">
        <NavLink to="/" href={isHome ? "#projects" : "/#projects"} label="Projects" />
        <NavLink to="/" href={isHome ? "#skills" : "/#skills"} label="Skills" />
        <NavLink to="/" href={isHome ? "#certifications" : "/#certifications"} label="Credentials" />
        <NavLink to="/" href={isHome ? "#contact" : "/#contact"} label="Ping" />
      </nav>

      {/* Futuristic telemetry / status */}
      <div className="flex items-center gap-4">
        {/* Pulsing Status badge */}
        <div className="hidden lg:flex items-center gap-2 border border-accent-cobalt/25 rounded-full px-3 py-1 bg-surface-bg font-mono text-[9px] text-accent-cyan font-bold shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)]">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
          <span>READY FOR WORK</span>
        </div>

        {/* Live ticking clock */}
        <span className="hidden sm:inline font-mono text-[10px] text-text-muted">
          {time}
        </span>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-[2px] border border-border-grid bg-surface-bg hover:bg-canvas-bg text-text-muted hover:text-text-main transition-all duration-150 focus:outline-none"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};
