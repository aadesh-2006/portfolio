import React from 'react';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { portfolioData } from '../../content/portfolioData';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border-grid bg-surface-bg py-8 font-mono select-none">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 app-container">
        <div className="text-center md:text-left space-y-1.5">
          <Text variant="label" className="text-[10px] block text-accent-cyan font-bold">
            COORDINATES // {portfolioData.coordinates}
          </Text>
          <Text variant="label" className="text-[9px] block text-text-muted">
            STATUS // {portfolioData.role.toUpperCase()}
          </Text>
          <Text variant="label" className="text-[9px] block text-text-muted">
            LOCATED // {portfolioData.location.toUpperCase()}
          </Text>
        </div>

        {/* Directory links */}
        <div className="flex gap-4 items-center">
          <Button variant="link" href={portfolioData.github} className="text-xs text-text-muted hover:text-accent-cyan transition-colors">
            GitHub
          </Button>
          <span className="text-border-grid">/</span>
          <Button variant="link" href={portfolioData.linkedin} className="text-xs text-text-muted hover:text-accent-cyan transition-colors">
            LinkedIn
          </Button>
          <span className="text-border-grid">/</span>
          <Button variant="link" href={portfolioData.leetcode} className="text-xs text-text-muted hover:text-accent-cyan transition-colors">
            LeetCode
          </Button>
          <span className="text-border-grid">/</span>
          <Button variant="link" href={`mailto:${portfolioData.email}`} className="text-xs text-text-muted hover:text-accent-cyan transition-colors">
            Email
          </Button>
        </div>
      </div>

      <div className="border-t border-border-grid/40 mt-6 pt-6 text-[9px] text-text-muted flex flex-col sm:flex-row justify-between gap-2 app-container">
        <span>© {currentYear} {portfolioData.name.toUpperCase()}. ALL RIGHTS SECURITY PROTOCOLS INTACT.</span>
        <span className="text-accent-purple font-bold">CORE_ARCH // REACT + THREE_D_ACCELERATION</span>
      </div>
    </footer>
  );
};
