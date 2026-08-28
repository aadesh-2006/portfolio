import React, { useEffect, useState, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { portfolioData } from '../../content/portfolioData';

// Key used in sessionStorage to pass a pending scroll target across route transitions
const SCROLL_TARGET_KEY = 'navbar_scroll_target';

/**
 * Smoothly scrolls to a section on the current page by element id.
 * Returns true if the element was found, false if not (i.e. wrong route).
 */
function scrollToSection(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
}

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [time, setTime] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

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

  // After every route change, check if there is a pending scroll target.
  // This fires after HomeScroll mounts and the section elements are in the DOM.
  useEffect(() => {
    const pending = sessionStorage.getItem(SCROLL_TARGET_KEY);
    if (pending && location.pathname === '/') {
      sessionStorage.removeItem(SCROLL_TARGET_KEY);
      // Small delay so the home page DOM is fully painted before scrolling
      const timer = setTimeout(() => scrollToSection(pending), 80);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  /**
   * Handle clicks on section-scroll items (Skills, Credentials).
   * - If already on "/", scroll immediately.
   * - If on another route, store the target and navigate home first.
   *   The useEffect above will fire the scroll once the home page mounts.
   */
  const handleSectionNav = useCallback(
    (sectionId: string) => {
      if (location.pathname === '/') {
        scrollToSection(sectionId);
      } else {
        sessionStorage.removeItem('restore_home_scroll');
        sessionStorage.setItem(SCROLL_TARGET_KEY, sectionId);
        navigate('/');
      }
    },
    [location.pathname, navigate]
  );

  // Derive active state for visual highlighting
  const isHome = location.pathname === '/';
  const isProjects = location.pathname === '/projects' || location.pathname.startsWith('/projects/');
  const isConnect = location.pathname === '/connect';

  const baseClasses =
    'text-[11px] font-mono uppercase tracking-wider transition-colors duration-150 px-2.5 py-1 rounded-[2px] focus:outline-none relative group';
  const activeClasses = 'text-accent-cyan';
  const inactiveClasses = 'text-text-muted hover:text-accent-cyan';

  return (
    <header className="sticky top-0 z-50 w-full flex items-center justify-between app-container py-4 border-b border-border-grid bg-canvas-bg/75 backdrop-blur-md select-none">
      
      {/* Brand logo & title */}
      <div className="flex items-center gap-3">
        <Link 
          to="/" 
          onClick={() => {
            sessionStorage.removeItem('restore_home_scroll');
            sessionStorage.removeItem('home_page_scroll_pos');
            if (location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="focus:outline-none flex items-center gap-2"
        >
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
      <nav className="flex items-center gap-3 sm:gap-6 bg-[#080808]/90 border border-border-grid px-4 py-1.5 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] glass-panel">

        {/* PROJECTS → navigates to /projects route */}
        <Link
          to="/projects"
          onClick={() => {
            if (location.pathname === '/') {
              sessionStorage.setItem('home_page_scroll_pos', window.scrollY.toString());
              sessionStorage.setItem('restore_home_scroll', 'true');
            }
            sessionStorage.removeItem('projects_archive_scroll_pos');
          }}
          className={`${baseClasses} ${isProjects ? activeClasses : inactiveClasses}`}
        >
          Projects
          <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] bg-accent-cyan transition-all duration-300 ${isProjects ? 'w-3/4' : 'w-0 group-hover:w-3/4'}`} />
        </Link>

        {/* SKILLS → smooth-scroll to #skills on home page */}
        <button
          onClick={() => handleSectionNav('skills')}
          className={`${baseClasses} ${isHome ? inactiveClasses : inactiveClasses} cursor-pointer`}
        >
          Skills
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-accent-cyan group-hover:w-3/4 transition-all duration-300" />
        </button>

        {/* CREDENTIALS → smooth-scroll to #certifications on home page */}
        <button
          onClick={() => handleSectionNav('certifications')}
          className={`${baseClasses} ${inactiveClasses} cursor-pointer`}
        >
          Credentials
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-accent-cyan group-hover:w-3/4 transition-all duration-300" />
        </button>

        {/* PING → navigates to /connect terminal page */}
        <Link
          to="/connect"
          className={`${baseClasses} ${isConnect ? activeClasses : inactiveClasses}`}
        >
          Ping
          <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] bg-accent-cyan transition-all duration-300 ${isConnect ? 'w-3/4' : 'w-0 group-hover:w-3/4'}`} />
        </Link>

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
