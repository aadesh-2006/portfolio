import React, { useEffect } from 'react';
import { parseMarkdown } from '../../core/utils/markdown';
import { AbstractBlock } from '../../components/AbstractBlock';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';
import { PortfolioDiagram } from './PortfolioDiagram';
import { Button } from '../../components/Button';
import { ArrowLeft } from 'lucide-react';
import portfolioMarkdown from '../../content/projects/portfolio.md?raw';

export const PortfolioCaseStudy: React.FC = () => {
  const { frontmatter, content } = parseMarkdown(portfolioMarkdown);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full flex-1 flex flex-col bg-surface-bg select-text">
      {/* Back to Archive Nav */}
      <div className="border-b border-border-grid px-6 py-4 flex items-center bg-canvas-bg/10 select-none">
        <Button variant="link" to="/projects" className="inline-flex items-center gap-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Archive
        </Button>
      </div>

      {/* Two Column Layout Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-full">
        {/* Left Column (Sticky info block on desktop) */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-border-grid p-6 bg-canvas-bg/5 select-none lg:sticky lg:top-0 lg:h-[calc(100vh-140px)] overflow-y-auto">
          <div className="space-y-6">
            <AbstractBlock
              title={frontmatter.title}
              status={frontmatter.status}
              metrics={frontmatter.metrics}
              tags={frontmatter.tags}
            />

            <div className="border border-border-grid rounded-[4px] bg-surface-bg p-4 space-y-4">
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider block">RESOURCES</span>
              <div className="flex flex-col gap-2">
                <Button variant="secondary" href="https://github.com" className="w-full text-center">
                  CODE REPOSITORY
                </Button>
                <Button variant="secondary" href="#" className="w-full text-center" disabled>
                  PROTOTYPE RUNTIME
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Scrollable narrative deep-dive) */}
        <div className="lg:col-span-8 p-6 md:p-8 max-w-3xl mx-auto lg:max-w-none w-full">
          {/* SVG Pipeline Schematic */}
          <div className="mb-8 select-none">
            <PortfolioDiagram />
          </div>

          <MarkdownRenderer content={content} />
        </div>
      </div>
    </div>
  );
};
