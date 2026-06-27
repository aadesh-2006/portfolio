import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  color: string;
  size: number;
}

export const ThreeDBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // 3D camera properties
    const fov = 350; // Field of View distance
    const centerX = width / 2;
    const centerY = height / 2;

    const particles: Particle[] = [];
    const particleCount = Math.min(120, Math.floor((width * height) / 12000)); // Responsive count

    // Mouse coordinates (centered)
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollY = 0;

    // Colors matched to the theme (indigo, cyan, violet)
    const colors = [
      'rgba(99, 102, 241, 0.45)', // Indigo
      'rgba(6, 182, 212, 0.45)',  // Cyan
      'rgba(168, 85, 247, 0.45)', // Purple
    ];

    // Initialize particles in a 3D box
    for (let i = 0; i < particleCount; i++) {
      const zVal = Math.random() * 800 - 400; // depth
      particles.push({
        x: Math.random() * width - centerX,
        y: Math.random() * height - centerY,
        z: zVal,
        baseX: Math.random() * width - centerX,
        baseY: Math.random() * height - centerY,
        baseZ: zVal,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 1.5 + 0.8,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse to -0.5 to 0.5 range
      mouse.targetX = (e.clientX - centerX) / centerX;
      mouse.targetY = (e.clientY - centerY) / centerY;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    // Render loop
    const render = () => {
      // Clear canvas with space void color
      ctx.fillStyle = '#030014';
      ctx.fillRect(0, 0, width, height);

      // Expo ease mouse smoothing
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // 3D rotations based on mouse offsets and scroll
      const angleY = mouse.x * 0.25; // Yaw
      const angleX = (mouse.y + scrollY * 0.0005) * 0.25; // Pitch

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // Project and draw particles
      particles.forEach((p) => {
        // Rotate on Y axis
        let x1 = p.baseX * cosY - p.baseZ * sinY;
        let z1 = p.baseZ * cosY + p.baseX * sinY;

        // Rotate on X axis
        let y1 = p.baseY * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.baseY * sinX;

        // Apply a slight parallax depth drift
        z2 -= 50; 

        // Don't draw if behind camera
        if (z2 + fov <= 0) return;

        // Perspective projection math
        const scale = fov / (fov + z2);
        const projX = x1 * scale + centerX;
        const projY = y1 * scale + centerY;

        // Fade size and opacity based on depth
        const opacity = Math.min(1, Math.max(0.05, scale * 0.7));
        const finalSize = p.size * scale;

        if (projX >= 0 && projX <= width && projY >= 0 && projY <= height) {
          ctx.beginPath();
          ctx.arc(projX, projY, finalSize, 0, Math.PI * 2);
          ctx.fillStyle = p.color.replace('0.45', opacity.toFixed(2));
          ctx.fill();
        }
      });

      // Draw constellation connection lines for close nodes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          // Simple distance formula in 3D
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < 110) {
            // Apply current rotation to project coordinates
            let x1 = p1.baseX * cosY - p1.baseZ * sinY;
            let z1 = p1.baseZ * cosY + p1.baseX * sinY;
            let y1 = p1.baseY * cosX - z1 * sinX;
            let z2 = z1 * cosX + p1.baseY * sinX;

            let x2 = p2.baseX * cosY - p2.baseZ * sinY;
            let z3 = p2.baseZ * cosY + p2.baseX * sinY;
            let y2 = p2.baseY * cosX - z3 * sinX;
            let z4 = z3 * cosX + p2.baseY * sinX;

            if (z2 + fov > 0 && z4 + fov > 0) {
              const scale1 = fov / (fov + z2);
              const scale2 = fov / (fov + z4);

              const projX1 = x1 * scale1 + centerX;
              const projY1 = y1 * scale1 + centerY;
              const projX2 = x2 * scale2 + centerX;
              const projY2 = y2 * scale2 + centerY;

              const alpha = (1 - distance / 110) * 0.15;

              ctx.beginPath();
              ctx.moveTo(projX1, projY1);
              ctx.lineTo(projX2, projY2);
              ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-20 pointer-events-none" />;
};
