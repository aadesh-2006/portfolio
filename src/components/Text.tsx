import React from 'react';

interface TextProps {
  variant?: 'title' | 'subheading' | 'label' | 'body' | 'code';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'code';
  className?: string;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  as,
  className = '',
  children,
}) => {
  let Tag: any = as;

  if (!Tag) {
    switch (variant) {
      case 'title':
        Tag = 'h1';
        break;
      case 'subheading':
        Tag = 'h2';
        break;
      case 'label':
        Tag = 'span';
        break;
      case 'code':
        Tag = 'code';
        break;
      default:
        Tag = 'p';
    }
  }

  const baseStyles = {
    title: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-main font-sans leading-tight',
    subheading: 'text-2xl md:text-3xl font-semibold tracking-tight text-text-main font-sans',
    label: 'text-xs font-mono uppercase tracking-wider text-text-muted',
    body: 'text-base font-sans font-normal leading-relaxed text-text-muted',
    code: 'text-sm font-mono leading-normal bg-canvas-bg px-1.5 py-0.5 rounded-[2px] text-text-main border border-border-grid',
  };

  return (
    <Tag className={`${baseStyles[variant]} ${className}`}>
      {children}
    </Tag>
  );
};
