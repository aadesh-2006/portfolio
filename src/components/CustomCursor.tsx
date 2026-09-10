import React, { useEffect, useRef } from 'react';

/**
 * CustomCursor
 * 
 * High-performance, unified technical reticle cursor:
 * - 13px precision targeting center dot
 * - 40px outer lerp targeting reticle ring with 4-axis notches
 * - 3-point subtle data signal trail with velocity interpolation
 * - Magnetic UI for primary CTA buttons
 * 
 * Performance & Accessibility:
 * - 0 React re-renders on pointer movement (RAF + direct ref transforms).
 * - Automatic disable on touch / coarse-pointer devices.
 * - pointer-events: none ensures zero interference with clicks, selections, inputs, or terminal.
 */
export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cursorWrapperRef = useRef<HTMLDivElement>(null);

  // Trail particle refs
  const trail1Ref = useRef<HTMLDivElement>(null);
  const trail2Ref = useRef<HTMLDivElement>(null);
  const trail3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch / coarse-pointer devices
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    const wrapper = cursorWrapperRef.current;
    const t1 = trail1Ref.current;
    const t2 = trail2Ref.current;
    const t3 = trail3Ref.current;

    if (!dot || !ring || !wrapper) return;

    // Pointer coordinates & interpolated positions
    let mouseX = -100;
    let mouseY = -100;
    let prevMouseX = -100;
    let prevMouseY = -100;
    let ringX = -100;
    let ringY = -100;

    // Trail positions
    let t1X = -100, t1Y = -100;
    let t2X = -100, t2Y = -100;
    let t3X = -100, t3Y = -100;

    let isVisible = false;
    let isClicking = false;
    let currentMode: 'default' | 'interactive' | 'card' | 'text' = 'default';

    // Magnetic UI tracking
    let activeMagneticEl: HTMLElement | null = null;
    let magneticTargetX = 0;
    let magneticTargetY = 0;
    let magneticCurrentX = 0;
    let magneticCurrentY = 0;

    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        wrapper.style.opacity = '1';
        ringX = mouseX;
        ringY = mouseY;
        t1X = mouseX; t1Y = mouseY;
        t2X = mouseX; t2Y = mouseY;
        t3X = mouseX; t3Y = mouseY;
      }

      const target = e.target as HTMLElement | null;
      if (target) {
        // 1. Context detection
        if (target.closest('input, textarea, [contenteditable="true"]')) {
          currentMode = 'text';
        } else if (target.closest('.glass-panel, [data-cursor="card"], .project-card, article')) {
          currentMode = 'card';
        } else if (target.closest('a, button, [role="button"], .cursor-pointer, input[type="submit"]')) {
          currentMode = 'interactive';
        } else {
          currentMode = 'default';
        }

        // 2. Magnetic UI Element Detection
        const magEl = target.closest('[data-magnetic="true"], .magnetic-btn') as HTMLElement | null;
        if (magEl) {
          activeMagneticEl = magEl;
          const rect = magEl.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const dist = Math.hypot(mouseX - centerX, mouseY - centerY);

          if (dist < 70) {
            // Subtle 1-4px pull
            const pullFactor = (1 - dist / 70) * 3.5;
            magneticTargetX = ((mouseX - centerX) / (rect.width / 2)) * pullFactor;
            magneticTargetY = ((mouseY - centerY) / (rect.height / 2)) * pullFactor;
          } else {
            magneticTargetX = 0;
            magneticTargetY = 0;
          }
        } else if (activeMagneticEl) {
          activeMagneticEl.style.transform = 'translate3d(0, 0, 0)';
          activeMagneticEl = null;
          magneticTargetX = 0;
          magneticTargetY = 0;
          magneticCurrentX = 0;
          magneticCurrentY = 0;
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
      if (activeMagneticEl) {
        activeMagneticEl.style.transform = 'translate3d(0, 0, 0)';
        activeMagneticEl = null;
      }
    };

    const onMouseEnter = () => {
      isVisible = true;
      wrapper.style.opacity = '1';
    };

    // Main 60fps RAF Render Loop
    const render = () => {
      // 1. Direct placement of center point (zero latency)
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      // 2. Smooth lerp for outer reticle ring (easing factor 0.20)
      const lerpFactor = 0.2;
      ringX += (mouseX - ringX) * lerpFactor;
      ringY += (mouseY - ringY) * lerpFactor;

      // Calculate velocity for trail scaling
      const velocity = Math.hypot(mouseX - prevMouseX, mouseY - prevMouseY);
      prevMouseX = mouseX;
      prevMouseY = mouseY;

      // 3. Staggered Minimal Trail Particles
      if (t1 && t2 && t3) {
        t1X += (mouseX - t1X) * 0.35;
        t1Y += (mouseY - t1Y) * 0.35;
        t2X += (t1X - t2X) * 0.25;
        t2Y += (t1Y - t2Y) * 0.25;
        t3X += (t2X - t3X) * 0.18;
        t3Y += (t2Y - t3Y) * 0.18;

        const baseAlpha = Math.min(0.25 + velocity * 0.015, 0.45);
        t1.style.transform = `translate3d(${t1X}px, ${t1Y}px, 0)`;
        t1.style.opacity = (baseAlpha * 0.7).toFixed(2);

        t2.style.transform = `translate3d(${t2X}px, ${t2Y}px, 0)`;
        t2.style.opacity = (baseAlpha * 0.45).toFixed(2);

        t3.style.transform = `translate3d(${t3X}px, ${t3Y}px, 0)`;
        t3.style.opacity = (baseAlpha * 0.25).toFixed(2);
      }

      // 4. Consistent Reticle Styling across entire site
      let ringScale = 1;
      let ringOpacity = 0.45;
      let ringBorderColor = 'rgba(6, 182, 212, 0.5)';

      if (currentMode === 'interactive') {
        ringScale = 1.35;
        ringOpacity = 0.85;
        ringBorderColor = 'rgba(6, 182, 212, 0.9)';
      } else if (currentMode === 'card') {
        ringScale = 1.25;
        ringOpacity = 0.65;
        ringBorderColor = 'rgba(6, 182, 212, 0.7)';
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

      if (ring.dataset.mode !== currentMode) {
        ring.dataset.mode = currentMode;
      }

      // 5. Magnetic UI Spring Interpolation
      if (activeMagneticEl) {
        magneticCurrentX += (magneticTargetX - magneticCurrentX) * 0.25;
        magneticCurrentY += (magneticTargetY - magneticCurrentY) * 0.25;
        activeMagneticEl.style.transform = `translate3d(${magneticCurrentX.toFixed(2)}px, ${magneticCurrentY.toFixed(2)}px, 0)`;
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
      {/* 1. Subtle 3-Point Data Signal Trail */}
      <div
        ref={trail3Ref}
        className="absolute top-0 left-0 w-[2px] h-[2px] -ml-[1px] -mt-[1px] rounded-full bg-accent-cyan pointer-events-none transition-opacity duration-75"
      />
      <div
        ref={trail2Ref}
        className="absolute top-0 left-0 w-[2.5px] h-[2.5px] -ml-[1.25px] -mt-[1.25px] rounded-full bg-accent-cyan pointer-events-none transition-opacity duration-75"
      />
      <div
        ref={trail1Ref}
        className="absolute top-0 left-0 w-[3px] h-[3px] -ml-[1.5px] -mt-[1.5px] rounded-full bg-accent-cyan pointer-events-none transition-opacity duration-75"
      />

      {/* 2. Precision Center Dot (13px) */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 w-[13px] h-[13px] -ml-[6.5px] -mt-[6.5px] rounded-full bg-accent-cyan shadow-[0_0_10px_rgba(6,182,212,0.9)] pointer-events-none"
      />

      {/* 3. Outer Easing Targeting Reticle Ring (40px) */}
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
