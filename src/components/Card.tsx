import React from 'react';

interface CardProps {
  as?: 'div' | 'section' | 'article' | 'nav';
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  as: Tag = 'div',
  interactive = false,
  className = '',
  children,
  onClick,
}) => {
  const baseClasses = 'bg-surface-bg border border-border-grid rounded-[4px] p-6 transition-all duration-200 ease-damping';
  const interactiveClasses = interactive
    ? 'hover:border-accent-cobalt cursor-pointer'
    : '';

  return (
    <Tag
      onClick={onClick}
      className={`${baseClasses} ${interactiveClasses} ${className}`}
    >
      {children}
    </Tag>
  );
};
