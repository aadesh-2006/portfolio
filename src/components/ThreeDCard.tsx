import React, { useState, useRef } from 'react';

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string; // e.g. rgba(99,102,241,0.15)
  onClick?: () => void;
  interactive?: boolean;
}

export const ThreeDCard: React.FC<ThreeDCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(99, 102, 241, 0.15)',
  onClick,
  interactive = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [shineX, setShineX] = useState<number>(50);
  const [shineY, setShineY] = useState<number>(50);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card top-left
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert mouse coordinates to percentage (-50 to 50) relative to center
    const percentX = (mouseX / width) * 100 - 50;
    const percentY = (mouseY / height) * 100 - 50;

    // Calculate rotation degree (max 8 degrees for clean UI UX)
    const factor = 0.16; // tilt sensitivity
    setRotateX(-percentY * factor);
    setRotateY(percentX * factor);

    // Calculate sheen position (0% to 100%)
    setShineX((mouseX / width) * 100);
    setShineY((mouseY / height) * 100);
  };

  const handleMouseEnter = () => {
    if (!interactive) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const cardStyle: React.CSSProperties = {
    transform: isHovered
      ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
      : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s',
    transformStyle: 'preserve-3d',
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={cardStyle}
      className={`glass-panel rounded-[4px] p-6 relative overflow-hidden select-none transition-all duration-300 ease-damping ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Dynamic Sheen overlay */}
      {interactive && isHovered && (
        <div
          className="absolute inset-0 pointer-events-none opacity-30 mix-blend-color-dodge transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 200px at ${shineX}% ${shineY}%, ${glowColor}, transparent 80%)`,
            zIndex: 1,
          }}
        />
      )}

      {/* Cyber ambient glow border indicator */}
      {interactive && isHovered && (
        <div
          className="absolute inset-0 border border-accent-cobalt/35 rounded-[4px] pointer-events-none transition-colors duration-300"
          style={{ zIndex: 2 }}
        />
      )}

      {/* Content wrapper with translateZ to separate from card face */}
      <div style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }} className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};
