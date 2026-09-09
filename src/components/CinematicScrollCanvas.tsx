import React, { useEffect, useRef } from 'react';

/**
 * CinematicScrollCanvas
 * 
 * An ultra-optimized, high-performance background telemetry stream canvas that
 * morphs continuously across the user's scroll timeline:
 * 
 * Timeline Phase 0 (0.00 - 0.20): Hero // System Init (Orbital Telemetry & Signal Rings)
 * Timeline Phase 1 (0.20 - 0.45): Projects // Architecture (Bus Splitter & System Data Flow)
 * Timeline Phase 2 (0.45 - 0.70): Skills // Computation (Neural Graph Synapses & Vector Matrix)
 * Timeline Phase 3 (0.70 - 0.88): Credentials // Verification (Cryptographic Hash Lattice)
 * Timeline Phase 4 (0.88 - 1.00): Ping // Terminal (Transceiver Carrier Beam Convergence)
 */
export const CinematicScrollCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Scroll state tracking
    let currentScrollY = window.scrollY;
    let targetScrollY = window.scrollY;
    let scrollProgress = 0;
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;

    // Mouse proximity tracking for micro-interactions
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Generate telemetry particles
    const PARTICLE_COUNT = 45;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      baseX: Math.random() * width,
      baseY: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1.5 + 0.8,
      alpha: Math.random() * 0.4 + 0.15,
      phase: Math.random() * Math.PI * 2,
    }));

    // Main render loop
    const render = (now: number) => {
      // Smooth scroll interpolation
      currentScrollY += (targetScrollY - currentScrollY) * 0.1;
      const totalScrollable = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      scrollProgress = Math.min(Math.max(currentScrollY / totalScrollable, 0), 1);

      scrollVelocity = (targetScrollY - lastScrollY) * 0.2;
      lastScrollY = targetScrollY;

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // -------------------------------------------------------------
      // 1. Dynamic Accent Color Palette interpolation based on timeline
      // -------------------------------------------------------------
      let r = 6, g = 182, b = 212; // Default Cyan: #06b6d4
      let rSec = 14, gSec = 165, bSec = 233; // Sky

      if (scrollProgress < 0.25) {
        // Hero: Pure Electric Cyan (#06b6d4)
        const t = scrollProgress / 0.25;
        r = 6; g = Math.round(182 - t * 20); b = 212;
        rSec = 56; gSec = 189; bSec = 248;
      } else if (scrollProgress < 0.50) {
        // Projects: Cyan to Sky / Architecture Teal (#0ea5e9 -> #14b8a6)
        const t = (scrollProgress - 0.25) / 0.25;
        r = Math.round(6 + t * 14);
        g = Math.round(162 + t * 22);
        b = Math.round(212 - t * 46);
        rSec = 20; gSec = 184; bSec = 166;
      } else if (scrollProgress < 0.75) {
        // Skills: Neural Emerald / Tech Green (#14b8a6 -> #10b981)
        const t = (scrollProgress - 0.50) / 0.25;
        r = Math.round(20 - t * 4);
        g = Math.round(184 + t * 1);
        b = Math.round(166 - t * 37);
        rSec = 52; gSec = 211; bSec = 153;
      } else if (scrollProgress < 0.90) {
        // Credentials: Verification Teal-Cyan (#10b981 -> #06b6d4)
        const t = (scrollProgress - 0.75) / 0.15;
        r = Math.round(16 - t * 10);
        g = Math.round(185 - t * 3);
        b = Math.round(129 + t * 83);
        rSec = 6; gSec = 182; bSec = 212;
      } else {
        // Ping: Terminal Cyan-Green (#06b6d4)
        r = 6; g = 182; b = 212;
        rSec = 34; gSec = 197; bSec = 94;
      }

      // Update root CSS variables for dynamic theme interpolation across UI
      document.documentElement.style.setProperty('--dynamic-accent', `rgb(${r}, ${g}, ${b})`);
      document.documentElement.style.setProperty('--dynamic-glow', `rgba(${r}, ${g}, ${b}, 0.15)`);
      document.documentElement.style.setProperty('--dynamic-dim', `rgba(${r}, ${g}, ${b}, 0.08)`);

      // -------------------------------------------------------------
      // 2. Persistent Cybernetic Spine (Left Telemetry Axis)
      // -------------------------------------------------------------
      const spineX = Math.max(width * 0.04, 32);
      ctx.beginPath();
      ctx.moveTo(spineX, 0);
      ctx.lineTo(spineX, height);
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.07)`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Active Spine Beacon indicator
      const beaconY = height * 0.15 + (height * 0.7) * scrollProgress;
      ctx.beginPath();
      ctx.arc(spineX, beaconY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fill();

      // Subtle beacon halo
      ctx.beginPath();
      ctx.arc(spineX, beaconY, 9, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.25)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // -------------------------------------------------------------
      // 3. Evolving Timeline Background Graphics
      // -------------------------------------------------------------

      // (A) Hero Phase: Orbital Geometry & Concentric Calibration Rings
      if (scrollProgress < 0.35) {
        const heroAlpha = Math.max(0, 1 - scrollProgress / 0.35);
        const ringRadius = 140 + Math.sin(now * 0.001) * 6;
        
        ctx.save();
        ctx.globalAlpha = heroAlpha * 0.22;
        ctx.translate(width * 0.72, height * 0.45);
        ctx.rotate(now * 0.0003);

        // Outer Ring
        ctx.beginPath();
        ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([8, 16]);
        ctx.stroke();

        // Inner Sub-orbital
        ctx.beginPath();
        ctx.arc(0, 0, ringRadius * 0.65, 0, Math.PI * 2);
        ctx.strokeStyle = `rgb(${rSec}, ${gSec}, ${bSec})`;
        ctx.lineWidth = 0.75;
        ctx.setLineDash([2, 8]);
        ctx.stroke();
        ctx.restore();
      }

      // (B) Projects Phase: Architectural Bus Lines & Circuit Flow
      if (scrollProgress > 0.15 && scrollProgress < 0.55) {
        const projAlpha = Math.sin(((scrollProgress - 0.15) / 0.40) * Math.PI);
        ctx.save();
        ctx.globalAlpha = projAlpha * 0.18;

        const busY1 = height * 0.3 + (now * 0.02) % 40;
        const busY2 = height * 0.65 - (now * 0.015) % 40;

        // Horizontal bus lines with circuit junctions
        ctx.beginPath();
        ctx.moveTo(spineX, busY1);
        ctx.lineTo(width * 0.85, busY1);
        ctx.lineTo(width * 0.85 + 40, busY1 + 40);
        ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 12]);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(spineX, busY2);
        ctx.lineTo(width * 0.75, busY2);
        ctx.lineTo(width * 0.75 + 30, busY2 - 30);
        ctx.strokeStyle = `rgb(${rSec}, ${gSec}, ${bSec})`;
        ctx.lineWidth = 0.75;
        ctx.setLineDash([4, 10]);
        ctx.stroke();

        ctx.restore();
      }

      // (C) Skills Phase: Neural Lattice & Synapse Pulses
      if (scrollProgress > 0.40 && scrollProgress < 0.80) {
        const skillsAlpha = Math.sin(((scrollProgress - 0.40) / 0.40) * Math.PI);
        ctx.save();
        ctx.globalAlpha = skillsAlpha * 0.16;

        // Triangular/Hexagonal Neural Lattice Connectors
        const nodeCols = 4;
        const nodeRows = 3;
        const spacingX = width / (nodeCols + 1);
        const spacingY = height / (nodeRows + 1);

        for (let i = 1; i <= nodeCols; i++) {
          for (let j = 1; j <= nodeRows; j++) {
            const nx = i * spacingX + Math.sin(now * 0.001 + i + j) * 8;
            const ny = j * spacingY + Math.cos(now * 0.001 + i * j) * 8;

            ctx.beginPath();
            ctx.arc(nx, ny, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fill();

            // Connect to neighboring node
            if (i < nodeCols) {
              const nextNx = (i + 1) * spacingX + Math.sin(now * 0.001 + (i + 1) + j) * 8;
              const nextNy = j * spacingY + Math.cos(now * 0.001 + (i + 1) * j) * 8;
              ctx.beginPath();
              ctx.moveTo(nx, ny);
              ctx.lineTo(nextNx, nextNy);
              ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.3)`;
              ctx.lineWidth = 0.5;
              ctx.setLineDash([]);
              ctx.stroke();
            }
          }
        }
        ctx.restore();
      }

      // (D) Credentials Phase: Cryptographic Verification Mesh
      if (scrollProgress > 0.65 && scrollProgress < 0.95) {
        const credAlpha = Math.sin(((scrollProgress - 0.65) / 0.30) * Math.PI);
        ctx.save();
        ctx.globalAlpha = credAlpha * 0.15;

        // Subtle vertical verification scanlines
        for (let x = width * 0.2; x < width * 0.9; x += 160) {
          ctx.beginPath();
          ctx.moveTo(x, height * 0.1);
          ctx.lineTo(x, height * 0.9);
          ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.lineWidth = 0.6;
          ctx.setLineDash([2, 14]);
          ctx.stroke();
        }
        ctx.restore();
      }

      // -------------------------------------------------------------
      // 4. Ambient Particle Physics & Mouse Depth Parallax
      // -------------------------------------------------------------
      particles.forEach((p, idx) => {
        p.x += p.vx + Math.sin(now * 0.0008 + p.phase) * 0.15;
        p.y += p.vy - scrollVelocity * 0.05;

        // Wrap around boundaries cleanly
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse proximity repel
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x -= (dx / dist) * 1.5;
          p.y -= (dy / dist) * 1.5;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.7})`;
        ctx.fill();

        // Connect nearby particles within threshold
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const pDist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (pDist < 85) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${(1 - pDist / 85) * 0.09})`;
            ctx.lineWidth = 0.5;
            ctx.setLineDash([]);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 w-full h-full select-none"
      style={{ opacity: 0.9 }}
    />
  );
};
