import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  filename,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`border border-border-grid rounded-[4px] overflow-hidden bg-surface-bg font-mono text-sm ${className}`}>
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-grid bg-canvas-bg/30 select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-border-grid" />
          {filename && <span className="text-xs text-text-muted">{filename}</span>}
          {!filename && <span className="text-xs text-text-muted">{language}</span>}
        </div>
        <button
          onClick={handleCopy}
          className="p-1 rounded-[2px] hover:bg-border-grid text-text-muted hover:text-text-main transition-colors focus:outline-none"
          title="Copy Code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-accent-cobalt" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      {/* Code window */}
      <pre className="p-4 overflow-x-auto text-text-main leading-relaxed text-left select-text">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
};
