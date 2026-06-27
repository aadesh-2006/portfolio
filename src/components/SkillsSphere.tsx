import React, { useEffect, useRef } from 'react';

interface SkillTag {
  text: string;
  x: number;
  y: number;
  z: number;
  color: string;
  // Resolved drawing layout properties (two-pass rendering)
  screenX?: number;
  screenY?: number;
  fontSize?: number;
  opacity?: number;
  spacing?: number;
  blurAmount?: number;
  t?: number;
}

interface SkillsSphereProps {
  radius?: number;
  maxCanvasSize?: number;
}

export const SkillsSphere: React.FC<SkillsSphereProps> = ({
  radius = 160,
  maxCanvasSize = 480
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // List of technical skills for the sphere
  const skills = [
    'PyTorch', 'YOLOv8', 'PINN', 'React.js', 'FastAPI', 'Node.js', 
    'Express.js', 'Spring Boot', 'Python', 'Java', 'SQL', 'MongoDB', 
    'MySQL', 'SUMO', 'TraCI', 'Git', 'GitHub', 'C++', 'Data Structures',
    'DeepXDE', 'Pandas', 'NumPy', 'Scikit-learn'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 450;
    let height = 450;

    // Adjust size based on container width (Optimized to prevent canvas clearing on same size values)
    const updateSize = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.clientWidth;
        const targetWidth = Math.min(maxCanvasSize, parentWidth);
        if (canvas.width !== targetWidth) {
          width = canvas.width = targetWidth;
          height = canvas.height = targetWidth;
        }
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Color distribution based on categories
    const colors = [
      '#6366F1', // Indigo (ML/DS)
      '#06B6D4', // Cyan (Frontend/Web)
      '#A855F7', // Purple (Languages/Backend)
      '#3B82F6', // Blue (Databases/Tools)
    ];

    // Spherical distribution math
    const tags: SkillTag[] = [];
    const count = skills.length;

    for (let i = 0; i < count; i++) {
      // Golden spiral distribution on a sphere
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      tags.push({
        text: skills[i],
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        color: colors[i % colors.length],
      });
    }

    // Interactive mouse controls
    let mouse = { x: 0, y: 0, isDown: false, lastX: 0, lastY: 0 };
    // Continuous rotation speed
    let speed = { x: 0.003, y: 0.003 };
    let hoveredTagVal: string | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      if (mouse.isDown) {
        const dx = clientX - mouse.lastX;
        const dy = clientY - mouse.lastY;
        speed.x = dy * 0.005;
        speed.y = -dx * 0.005;
      } else {
        // Slow hover pull
        const cx = width / 2;
        const cy = height / 2;
        speed.x = (clientY - cy) * 0.00003;
        speed.y = -(clientX - cx) * 0.00003;
      }

      mouse.lastX = clientX;
      mouse.lastY = clientY;

      // Check hit detection for hover label
      let matchedTag: string | null = null;
      let closestZ = -Infinity;

      tags.forEach((tag) => {
        // Using cached projection positions from the last render frame
        if (tag.screenX === undefined || tag.screenY === undefined || tag.fontSize === undefined) return;
        
        // Bounding check for hit detection
        const textWidth = ctx.measureText(tag.text).width;
        if (
          clientX >= tag.screenX - textWidth / 2 - 10 &&
          clientX <= tag.screenX + textWidth / 2 + 10 &&
          clientY >= tag.screenY - 12 &&
          clientY <= tag.screenY + 12
        ) {
          // Keep only the closest depth node
          if (tag.z > closestZ) {
            closestZ = tag.z;
            matchedTag = tag.text;
          }
        }
      });

      if (hoveredTagVal !== matchedTag) {
        hoveredTagVal = matchedTag;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      mouse.isDown = true;
      const rect = canvas.getBoundingClientRect();
      mouse.lastX = e.clientX - rect.left;
      mouse.lastY = e.clientY - rect.top;
    };

    const handleMouseUp = () => {
      mouse.isDown = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Rotate coordinates around X and Y axis
      const cosX = Math.cos(speed.x);
      const sinX = Math.sin(speed.x);
      const cosY = Math.cos(speed.y);
      const sinY = Math.sin(speed.y);

      tags.forEach((tag) => {
        // Rotation around Y axis
        const x1 = tag.x * cosY - tag.z * sinY;
        const z1 = tag.z * cosY + tag.x * sinY;

        // Rotation around X axis
        const y2 = tag.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + tag.y * sinX;

        tag.x = x1;
        tag.y = y2;
        tag.z = z2;
      });

      // ----------------------------------------------------
      // PASS 1: Layout Resolution & Collision Offset (Front-to-Back)
      // ----------------------------------------------------
      // Sort closest tags (most negative z) first
      const layoutTags = [...tags].sort((a, b) => a.z - b.z);
      const resolvedForeground: { x: number; y: number; w: number; h: number }[] = [];

      layoutTags.forEach((tag) => {
        // Dynamic perspective scaling
        const scale = (radius * 1.55) / (radius * 1.55 + tag.z);
        let screenX = tag.x * scale + cx;
        let screenY = tag.y * scale + cy;

        // Normalized depth: t goes from 0 (deep background) to 1 (foreground)
        const t = (radius - tag.z) / (2 * radius);

        // Smooth transition curves (Hermite smoothstep)
        const easeT = t * t * (3 - 2 * t);

        // Scale font proportionally (Foreground = 1.15x, Background = 0.85x)
        const fontScale = 0.85 + 0.3 * easeT;
        const baseFontSize = radius > 200 ? 12 : 11;

        // Skill hierarchy weights
        const importantSkills = ['PyTorch', 'YOLOv8', 'PINN', 'React.js', 'FastAPI', 'Python', 'Java', 'SQL', 'MongoDB'];
        const isImportant = importantSkills.includes(tag.text);
        const weight = isImportant ? 1.12 : 0.92;

        let fontSize = Math.round(baseFontSize * fontScale * weight);
        let opacity = 0.38 + 0.62 * easeT; // Smooth curve from 38% to 100% opacity

        // Screen-space collision avoidance for overlapping prominent foreground tags
        const textWidth = ctx.measureText(tag.text).width;
        const boxW = textWidth + 16;
        const boxH = fontSize + 8;

        if (t > 0.45) {
          for (const other of resolvedForeground) {
            const hOverlap = Math.abs(screenX - other.x) < (boxW + other.w) * 0.48;
            const vOverlap = Math.abs(screenY - other.y) < (boxH + other.h) * 0.5;

            if (hOverlap && vOverlap) {
              // Offset vertically to prevent overlapping text overlapping
              screenY += screenY < other.y ? -12 : 12;
              // Reduce prominence of the farther colliding tag
              opacity *= 0.75;
              fontSize = Math.round(fontSize * 0.9);
              break;
            }
          }
          resolvedForeground.push({ x: screenX, y: screenY, w: boxW, h: boxH });
        }

        // Letter spacing (foreground has wider spacing)
        const spacing = Math.max(0, easeT * 1.5);

        // Cache parameters on tag for Pass 2 drawing
        tag.screenX = screenX;
        tag.screenY = screenY;
        tag.fontSize = fontSize;
        tag.opacity = opacity;
        tag.spacing = spacing;
        tag.t = t;
      });

      // ----------------------------------------------------
      // PASS 2: Drawing & Layering (Back-to-Front / Painter's Algorithm)
      // ----------------------------------------------------
      // Sort farthest tags (most positive z) first so they draw background-first
      const drawTags = [...tags].sort((a, b) => b.z - a.z);

      drawTags.forEach((tag) => {
        if (
          tag.screenX === undefined || 
          tag.screenY === undefined || 
          tag.fontSize === undefined || 
          tag.opacity === undefined || 
          tag.spacing === undefined || 
          tag.t === undefined
        ) return;

        ctx.save();

        // Apply letter spacing
        if ('letterSpacing' in ctx) {
          ctx.letterSpacing = `${tag.spacing}px`;
        }

        ctx.font = `bold ${tag.fontSize}px "Orbitron", sans-serif`;
        ctx.globalAlpha = tag.opacity;
        ctx.fillStyle = tag.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const isHovered = hoveredTagVal === tag.text;
        const isFront = tag.t > 0.88; // highlight closest 2-3 tags (t > 0.88)

        // Draw active or frontmost glow highlights
        if (isHovered || isFront) {
          ctx.shadowBlur = isHovered ? 18 : 6;
          ctx.shadowColor = tag.color;
          if (isHovered) {
            ctx.font = `bold ${tag.fontSize + 1}px "Orbitron", sans-serif`;
            ctx.fillStyle = '#FFFFFF';
          }
        } else {
          ctx.shadowBlur = 0;
        }

        // Draw label text
        ctx.fillText(tag.text, tag.screenX, tag.screenY);

        // Draw tiny node anchors
        ctx.beginPath();
        ctx.arc(tag.screenX, tag.screenY + tag.fontSize/2 + 4, 2, 0, Math.PI * 2);
        ctx.fillStyle = tag.color;
        ctx.fill();

        ctx.restore();
      });

      // Gradually decay drag speed back to base slow rotation
      if (!mouse.isDown) {
        speed.x += (0.001 - speed.x) * 0.05;
        speed.y += (0.001 - speed.y) * 0.05;
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', updateSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [radius, maxCanvasSize]);

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center justify-center relative select-none">
      <div className="relative border border-dashed border-accent-cobalt/25 rounded-full p-4 overflow-hidden bg-canvas-bg/25">
        <canvas ref={canvasRef} className="cursor-grab active:cursor-grabbing max-w-full" />
      </div>
    </div>
  );
};
export default SkillsSphere;
