import React from 'react';
import { Text } from './Text';

interface Metric {
  label: string;
  value: string;
}

interface AbstractBlockProps {
  title: string;
  status: string;
  metrics: Metric[];
  tags: string[];
  className?: string;
}

export const AbstractBlock: React.FC<AbstractBlockProps> = ({
  title,
  status,
  metrics,
  tags,
  className = '',
}) => {
  return (
    <div className={`border border-border-grid rounded-[4px] bg-surface-bg font-mono text-sm ${className}`}>
      {/* Abstract Header */}
      <div className="px-4 py-2 border-b border-border-grid bg-canvas-bg/30 select-none">
        <Text variant="label" className="text-text-main font-semibold">
          [ PROJECT ABSTRACT // {title.toUpperCase()} ]
        </Text>
      </div>
      {/* Parameters */}
      <div className="p-4 space-y-4 select-text text-left">
        <div className="grid grid-cols-2 gap-4 border-b border-border-grid pb-4">
          <div>
            <span className="text-xs text-text-muted block uppercase tracking-wider">PROJECT STATUS</span>
            <span className="text-sm font-semibold text-text-main uppercase">{status}</span>
          </div>
          <div>
            <span className="text-xs text-text-muted block uppercase tracking-wider">TAXONOMY</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {tags.map((tag, i) => (
                <span key={i} className="text-[10px] bg-canvas-bg border border-border-grid px-1.5 py-0.5 rounded-[2px] text-text-main font-mono">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metrics.map((metric, i) => (
            <div key={i} className="border border-border-grid/50 p-2.5 rounded-[2px] bg-canvas-bg/10">
              <span className="text-[10px] text-text-muted block uppercase tracking-wider">{metric.label}</span>
              <span className="text-base font-bold text-accent-cobalt mt-0.5 block">{metric.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
