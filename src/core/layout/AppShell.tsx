import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ThreeDBackground } from '../../components/ThreeDBackground';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-canvas-bg flex flex-col transition-colors duration-400 relative">
      
      {/* Global Hardware-Accelerated 3D Background */}
      <ThreeDBackground />

      {/* Overlay blueprint grid columns (edge-to-edge fixed behind content) */}
      <div className="w-screen h-screen fixed inset-0 pointer-events-none grid grid-cols-4 opacity-[0.025] dark:opacity-[0.015] -z-15">
        <div className="border-r border-text-main" />
        <div className="border-r border-text-main" />
        <div className="border-r border-text-main" />
      </div>

      {/* Blueprint Grid layout wrapper */}
      <div className="flex-1 w-full flex flex-col bg-surface-bg/40 relative z-10">
        <Header />
        
        {/* Core page components render area */}
        <main className="flex-1 w-full flex flex-col relative z-10">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
};
