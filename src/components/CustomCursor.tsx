import React, { useEffect, useRef } from 'react';

/**
 * CustomCursor
 * 
 * A minimal, high-precision technical reticle cursor tailored for the
 * engineering/system interface aesthetic:
 * 
 * - Precise center dot with zero latency.
 * - Smoothly eased outer targeting reticle ring.
 * - Context-aware states:
 *   - default: 22px subtle cyan reticle
 *   - interactive (links/buttons): 32px expanded targeting bracket
 *   - inspection (cards/projects): 38px technical reticle with corner ticks
 *   - text/input: subtle compact reticle
 *   - mousedown: instant crisp 0.75x compression pulse
 * 
 * Performance:
 * - 0 React re-renders during mouse movement (RAF + ref transforms).
 * - Automatic disable on touch / coarse-pointer devices.
 * - pointer-events: none ensures zero interference with clicks or inputs.
 */
export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cursorWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only initialize if the user is on a fine-pointer (mouse/trackpad) device
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    const wrapper = cursorWrapperRef.current;
    if (!dot || !ring || !wrapper) return;

    // Mouse coordinates & ring interpolated position
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;
    let isClicking = false;
    let currentMode: 'default' | 'interactive' | 'card' | 'text' = 'default';

    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        wrapper.style.opacity = '1';
        ringX = mouseX;
        ringY = mouseY;
      }

      // Context detection using element under cursor
      const target = e.target as HTMLElement | null;
      if (target) {
        if (target.closest('input, textarea, [contenteditable="true"]')) {
          currentMode = 'text';
        } else if (target.closest('.glass-panel, [data-cursor="card"], .project-card, article')) {
          currentMode = 'card';
        } else if (target.closest('a, button, [role="button"], .cursor-pointer, input[type="submit"]')) {
          currentMode = 'interactive';
        } else {
          currentMode = 'default';
        }
      }
    };

    const onMouseDown = () => {
      isClicking = true;
    };

    const onMouseUp = () => {
      isClicking = false;
    };

    const onMouseLeave = () => {
      isVisible = false;
      wrapper.style.opacity = '0';
    };

    const onMouseEnter = () => {
      isVisible = true;
      wrapper.style.opacity = '1';
    };

    // Smooth render loop
    const render = () => {
      // Direct placement of center point (zero latency)
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      // Smooth lerp for outer reticle ring (easing factor 0.20)
      const lerpFactor = 0.2;
      ringX += (mouseX - ringX) * lerpFactor;
      ringY += (mouseY - ringY) * lerpFactor;

      // Mode-specific scales & styling
      let ringScale = 1;
      let ringOpacity = 0.45;
      let ringBorderColor = 'rgba(6, 182, 212, 0.45)';

      if (currentMode === 'interactive') {
        ringScale = 1.35;
        ringOpacity = 0.85;
        ringBorderColor = 'rgba(6, 182, 212, 0.9)';
      } else if (currentMode === 'card') {
        ringScale = 1.6;
        ringOpacity = 0.75;
        ringBorderColor = 'rgba(6, 182, 212, 0.75)';
      } else if (currentMode === 'text') {
        ringScale = 0.65;
        ringOpacity = 0.3;
        ringBorderColor = 'rgba(255, 255, 255, 0.35)';
      }

      if (isClicking) {
        ringScale *= 0.75;
      }

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${ringScale})`;
      ring.style.opacity = ringOpacity.toString();
      ring.style.borderColor = ringBorderColor;

      // Apply mode class to ring for micro-brackets
      if (ring.dataset.mode !== currentMode) {
        ring.dataset.mode = currentMode;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  return (
    <div
      ref={cursorWrapperRef}
      aria-hidden="true"
      className="hidden md:block fixed inset-0 pointer-events-none z-[9999] select-none opacity-0 transition-opacity duration-300"
    >
      {/* Precision Center Dot (13px) */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 w-[13px] h-[13px] -ml-[6.5px] -mt-[6.5px] rounded-full bg-accent-cyan shadow-[0_0_10px_rgba(6,182,212,0.9)] pointer-events-none"
      />

      {/* Outer Easing Targeting Reticle Ring (40px) */}
      <div
        ref={ringRef}
        data-mode="default"
        className="absolute top-0 left-0 w-[40px] h-[40px] -ml-[20px] -mt-[20px] rounded-full border border-accent-cyan/50 pointer-events-none transition-[border-color,background-color] duration-200"
        style={{
          boxShadow: '0 0 16px rgba(6, 182, 212, 0.15)',
        }}
      >
        {/* Subtle 4-axis targeting notches on reticle */}
        <span className="absolute -top-[4px] left-1/2 -translate-x-1/2 w-[1px] h-[4px] bg-accent-cyan/70" />
        <span className="absolute -bottom-[4px] left-1/2 -translate-x-1/2 w-[1px] h-[4px] bg-accent-cyan/70" />
        <span className="absolute top-1/2 -left-[4px] -translate-y-1/2 w-[4px] h-[1px] bg-accent-cyan/70" />
        <span className="absolute top-1/2 -right-[4px] -translate-y-1/2 w-[4px] h-[1px] bg-accent-cyan/70" />
      </div>
    </div>
  );
};
export default CustomCursor;
