import React from 'react';
import { Text } from './Text';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
}) => {
  // Split content by blank lines to parse paragraph blocks
  const blocks = content.split(/\n\s*\n/);

  return (
    <div className={`space-y-6 ${className}`}>
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Fenced code blocks
        if (trimmed.startsWith('```')) {
          const lines = trimmed.split('\n');
          const firstLine = lines[0].replace('```', '').trim();
          const language = firstLine || 'text';
          const code = lines.slice(1, -1).join('\n');
          return <CodeBlock key={index} code={code} language={language} />;
        }

        // Markdown headings
        if (trimmed.startsWith('### ')) {
          return (
            <Text key={index} variant="subheading" className="mt-8 mb-4 border-b border-border-grid/50 pb-2 text-left">
              {trimmed.replace('### ', '')}
            </Text>
          );
        }

        if (trimmed.startsWith('#### ')) {
          return (
            <Text key={index} variant="body" className="font-semibold text-text-main text-left mt-6 mb-2">
              {trimmed.replace('#### ', '')}
            </Text>
          );
        }

        // Horizontal divider lines
        if (trimmed === '---') {
          return <hr key={index} className="border-t border-border-grid my-8" />;
        }

        // Bulleted lists
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const items = trimmed.split('\n').map(item => item.replace(/^[\s*-*]+\s*/, ''));
          return (
            <ul key={index} className="list-disc pl-5 space-y-2 text-left text-text-muted">
              {items.map((item, i) => (
                <li key={i} className="text-base leading-relaxed">
                  {renderInlineElements(item)}
                </li>
              ))}
            </ul>
          );
        }

        // Standard paragraph block
        return (
          <Text key={index} variant="body" className="text-left text-base leading-relaxed">
            {renderInlineElements(trimmed)}
          </Text>
        );
      })}
    </div>
  );
};

// Custom inline parser to handle inline code backticks (`) and bold markdown (**)
const renderInlineElements = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const codeMatch = remaining.match(/`([^`]+)`/);
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);

    const matches = [
      { match: codeMatch, type: 'code' },
      { match: boldMatch, type: 'bold' }
    ].filter(m => m.match && m.match.index !== undefined) as Array<{ match: RegExpMatchArray; type: string }>;

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    // Sort to process the earliest match in the line first
    matches.sort((a, b) => (a.match.index || 0) - (b.match.index || 0));
    const { match, type } = matches[0];
    const index = match.index || 0;

    if (index > 0) {
      parts.push(remaining.substring(0, index));
    }

    const content = match[1];
    if (type === 'code') {
      parts.push(
        <code key={key++} className="text-sm font-mono bg-canvas-bg px-1.5 py-0.5 rounded-[2px] border border-border-grid text-text-main">
          {content}
        </code>
      );
    } else if (type === 'bold') {
      parts.push(
        <strong key={key++} className="font-semibold text-text-main">
          {content}
        </strong>
      );
    }

    remaining = remaining.substring(index + match[0].length);
  }

  return <>{parts}</>;
};
