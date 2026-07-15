import React, { useEffect } from 'react';
import { AadeshOSTerminal } from './AadeshOSTerminal';
import { Terminal } from 'lucide-react';
import { Text } from '../../components/Text';

export const ConnectPage: React.FC = () => {
  // Scroll to top on mount — this is the correct place for scrollTo since it's
  // a dedicated page route, not an embedded section. The terminal itself does NOT
  // call scrollIntoView or window.scrollTo anywhere.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full flex-1 flex flex-col bg-canvas-bg/30">

      {/* Section Header — matches the existing section header pattern */}
      <section className="py-20 bg-surface-bg/35 scroll-mt-12 text-left app-container flex-1">
        <div className="max-w-5xl mx-auto space-y-10">

          <div className="flex items-center justify-between border-b border-border-grid/50 pb-4">
            <div className="flex items-center gap-2.5">
              <Terminal className="w-4 h-4 text-accent-cyan animate-pulse" />
              <Text variant="label" className="text-accent-cyan font-bold tracking-[0.15em]">[ CONNECT // TERMINAL_ONLINE ]</Text>
            </div>
            <span className="text-[10px] font-mono text-text-muted">PORT:_8080 TCP</span>
          </div>

          <AadeshOSTerminal />

        </div>
      </section>

    </div>
  );
};
