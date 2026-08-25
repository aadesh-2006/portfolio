import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'link';
  to?: string; // For react-router Link
  href?: string; // For outbound links
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  to,
  href,
  onClick,
  className = '',
  children,
  disabled = false,
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-mono text-xs uppercase tracking-wider font-medium transition-all duration-150 rounded-[4px] focus:outline-none';
  
  const variantStyles = {
    primary: 'bg-white text-black hover:bg-accent-cyan hover:text-black px-4 py-2.5 border border-transparent font-bold',
    secondary: 'bg-[#080808] text-text-main hover:border-accent-cyan/60 hover:text-white px-4 py-2.5 border border-border-grid',
    link: 'text-accent-cyan hover:text-white underline underline-offset-4 px-0 py-0 rounded-none bg-transparent',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none';
  const combinedClasses = `${variant === 'link' ? 'font-mono text-xs uppercase tracking-wider' : baseStyles} ${variantStyles[variant]} ${disabled ? disabledStyles : ''} ${className}`;

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={combinedClasses}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} className={combinedClasses}>
      {children}
    </button>
  );
};
