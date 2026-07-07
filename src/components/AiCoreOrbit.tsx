import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ----------------------------------------------------
// Orbit Config & Skills List
// ----------------------------------------------------
const ORBIT_CONFIG = [
  {
    name: 'ML STACK',
    color: '#6366F1', // Indigo
    radius: 3.2,
    tiltX: 0.08,
    tiltZ: 0.04,
    speed: 0.0035,
    skills: ['Python', 'PyTorch', 'YOLOv8', 'NumPy']
  },
  {
    name: 'BACKEND',
    color: '#A855F7', // Purple
    radius: 5.2,
    tiltX: -0.06,
    tiltZ: -0.06,
    speed: -0.0028,
    skills: ['FastAPI', 'Spring Boot', 'Node.js', 'MongoDB']
  },
  {
    name: 'FRONTEND',
    color: '#06B6D4', // Cyan
    radius: 7.2,
    tiltX: 0.10,
    tiltZ: -0.04,
    speed: 0.0022,
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML']
  },
  {
    name: 'INFRA',
    color: '#3B82F6', // Blue
    radius: 9.2,
    tiltX: -0.08,
    tiltZ: 0.08,
    speed: -0.0016,
    skills: ['Git', 'Docker', 'Linux', 'GitHub']
  }
];

// Helper to determine skill tier sizing
const getSkillSizeCategory = (text: string): 'large' | 'medium' | 'small' => {
  const large = ['Python', 'PyTorch', 'React', 'FastAPI', 'TypeScript', 'YOLOv8'];
  const medium = ['JavaScript', 'MongoDB', 'Git', 'Docker', 'Node.js', 'Linux'];
  if (large.includes(text)) return 'large';
  if (medium.includes(text)) return 'medium';
  return 'small';
};

// Helper to pre-render premium rounded glass UI chips as CanvasTextures
const createChipTexture = (text: string, color: string, isCategory = false): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 256, 64);

    const sizeCat = isCategory ? 'medium' : getSkillSizeCategory(text);

    let x = 24, y = 12, w = 208, h = 40, r = 20; // Default medium
    let fontSize = 15;
    let accentY = 22;
    let accentH = 20;

    if (sizeCat === 'large') {
      x = 6;
      y = 6;
      w = 244;
      h = 52;
      r = 26;
      fontSize = 19;
      accentY = 18;
      accentH = 28;
    } else if (sizeCat === 'small') {
      x = 42;
      y = 16;
      w = 172;
      h = 32;
      r = 16;
      fontSize = 12;
      accentY = 24;
      accentH = 16;
    }

    // 1. Draw rounded rectangle background (semi-transparent glass)
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle = isCategory ? 'rgba(15, 23, 42, 0.85)' : 'rgba(8, 12, 32, 0.68)';
    ctx.fill();

    // 2. Draw thin border
    ctx.lineWidth = isCategory ? 1.5 : 1.0;
    ctx.strokeStyle = isCategory ? color : 'rgba(255, 255, 255, 0.12)';
    ctx.stroke();

    if (isCategory) {
      // Draw category title (Uppercase centered)
      ctx.font = `bold ${fontSize}px "Orbitron", sans-serif`;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowBlur = 4;
      ctx.shadowColor = color;
      ctx.fillText(text, 128, 32);
    } else {
      // 3. Draw vertical accent bar on the left edge
      ctx.beginPath();
      ctx.roundRect(x + 16, accentY, 3, accentH, 1.5);
      ctx.fillStyle = color;
      ctx.fill();

      // 4. Measure text and autoscale down for long labels (like TypeScript or Spring Boot)
      let currentFontSize = fontSize;
      ctx.font = `bold ${currentFontSize}px "Orbitron", sans-serif`;
      const maxTextWidth = w - 48; // Space available inside chip for text
      while (ctx.measureText(text).width > maxTextWidth && currentFontSize > 9) {
        currentFontSize -= 1;
        ctx.font = `bold ${currentFontSize}px "Orbitron", sans-serif`;
      }

      // Draw white skill label text (crisp and readable)
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.shadowBlur = 0;
      ctx.fillText(text, x + 26, 32);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

// ----------------------------------------------------
// UI Chip Sprite Component
// ----------------------------------------------------
interface ChipSpriteProps {
  text: string;
  color: string;
  isCategory: boolean;
  position: THREE.Vector3;
  tagId: string;
  hoveredRef: React.MutableRefObject<string | null>;
  spriteRegistryRef: React.MutableRefObject<Record<string, THREE.Sprite>>;
  occlusionRegistryRef: React.MutableRefObject<Record<string, { scale: number; opacity: number }>>;
}

const ChipSprite: React.FC<ChipSpriteProps> = ({
  text,
  color,
  isCategory,
  position,
  tagId,
  hoveredRef,
  spriteRegistryRef,
  occlusionRegistryRef
}) => {
  const spriteRef = useRef<THREE.Sprite>(null);

  // Smooth lerp transitions for scale/opacity multiplier changes (prevent pops)
  const currentScaleMult = useRef(1.0);
  const currentOpacityMult = useRef(1.0);

  // Generate canvas texture exactly once
  const texture = useMemo(() => createChipTexture(text, color, isCategory), [text, color, isCategory]);

  // Clean texture on unmount
  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  // Register sprite position ref for world coordinates tracking
  useEffect(() => {
    if (spriteRef.current) {
      spriteRegistryRef.current[tagId] = spriteRef.current;
    }
    return () => {
      delete spriteRegistryRef.current[tagId];
    };
  }, [tagId, spriteRegistryRef]);

  // Adjust hover scale and visual depth dynamically inside frame loop
  useFrame(() => {
    if (!spriteRef.current) return;

    // Retrieve target occlusion modifiers set by SystemGroup (smooth overlap fading)
    const occlusionData = occlusionRegistryRef.current[tagId] || { scale: 1.0, opacity: 1.0 };
    
    currentScaleMult.current = THREE.MathUtils.lerp(currentScaleMult.current, occlusionData.scale, 0.1);
    currentOpacityMult.current = THREE.MathUtils.lerp(currentOpacityMult.current, occlusionData.opacity, 0.1);

    // Hover check
    const isHovered = hoveredRef.current === tagId;
    const hoverScale = isHovered ? 1.2 : 1.0;
    
    // Set final scale (increased to compensate for camera distance at Z = 19.0)
    spriteRef.current.scale.set(
      hoverScale * currentScaleMult.current * 4.6, 
      hoverScale * currentScaleMult.current * 1.15, 
      1
    );
    
    const mat = spriteRef.current.material as THREE.SpriteMaterial;
    if (mat) {
      mat.opacity = 0.85 * currentOpacityMult.current;
      mat.color.set('#FFFFFF');
    }
  });

  return (
    <sprite
      ref={spriteRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        hoveredRef.current = tagId;
      }}
      onPointerOut={() => {
        if (hoveredRef.current === tagId) {
          hoveredRef.current = null;
        }
      }}
    >
      <spriteMaterial attach="material" map={texture} transparent depthWrite={false} depthTest />
    </sprite>
  );
};

// ----------------------------------------------------
// The 3D System Logic
// ----------------------------------------------------
interface SystemGroupProps {
  radius: number;
  hoveredRef: React.MutableRefObject<string | null>;
  spriteRegistryRef: React.MutableRefObject<Record<string, THREE.Sprite>>;
  occlusionRegistryRef: React.MutableRefObject<Record<string, { scale: number; opacity: number }>>;
}

const SystemGroup: React.FC<SystemGroupProps> = ({ hoveredRef, spriteRegistryRef, occlusionRegistryRef }) => {
  const systemRef = useRef<THREE.Group>(null);
  const connectionLineRef = useRef<THREE.Line>(null);
  const networkLinesRef = useRef<THREE.LineSegments>(null);

  // Group references for orbits (for individual rotations and reveal)
  const orbit1Ref = useRef<THREE.Group>(null);
  const orbit2Ref = useRef<THREE.Group>(null);
  const orbit3Ref = useRef<THREE.Group>(null);
  const orbit4Ref = useRef<THREE.Group>(null);

  const orbitGroups = [orbit1Ref, orbit2Ref, orbit3Ref, orbit4Ref];

  // Particle Trace Ref
  const tracerRef = useRef<THREE.Mesh>(null);
  const traceLineRef = useRef<THREE.Line>(null);

  // Track dragging state and velocities locally (no React state)
  const pointerStart = useRef({ x: 0, y: 0 });
  const rotationStart = useRef({ x: 0, y: 0 });
  const targetRot = useRef({ x: 0, y: 0 });
  const prevRot = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const introTime = useRef(0);

  // Computation Path State
  const activePathIndex = useRef(0);
  const pathProgress = useRef(0);
  const pathActive = useRef(false);
  const nextPathTriggerTime = useRef(2.5);

  // pre-generate circles lines
  const circleGeom = useMemo(() => {
    const pts = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  // Pre-generate segment coordinates buffer for structured neural graph segments
  const networkGeom = useMemo(() => {
    const pts = [];
    // 19 connections * 2 (start + end endpoints) = 38 points
    for (let i = 0; i < 38; i++) {
      pts.push(new THREE.Vector3());
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  // Clean textures
  useEffect(() => {
    return () => {
      circleGeom.dispose();
      networkGeom.dispose();
    };
  }, [circleGeom, networkGeom]);

  // Define paths tracing nodes: Core(0) -> Skill1 -> Skill2 -> Skill3 -> Core(0)
  const paths = [
    ['ML STACK-Python', 'ML STACK-PyTorch', 'ML STACK-YOLOv8'],
    ['FRONTEND-React', 'BACKEND-FastAPI', 'BACKEND-MongoDB'],
    ['FRONTEND-TypeScript', 'BACKEND-Node.js', 'INFRA-Docker']
  ];

  // Define connection links: Category to its skills + Cross-orbit bridges
  const connectionPairs = [
    // Orbit 1 (ML STACK)
    ['ML STACK-Category', 'ML STACK-Python'],
    ['ML STACK-Category', 'ML STACK-PyTorch'],
    ['ML STACK-Category', 'ML STACK-YOLOv8'],
    ['ML STACK-Category', 'ML STACK-NumPy'],
    // Orbit 2 (BACKEND)
    ['BACKEND-Category', 'BACKEND-FastAPI'],
    ['BACKEND-Category', 'BACKEND-Spring Boot'],
    ['BACKEND-Category', 'BACKEND-Node.js'],
    ['BACKEND-Category', 'BACKEND-MongoDB'],
    // Orbit 3 (FRONTEND)
    ['FRONTEND-Category', 'FRONTEND-React'],
    ['FRONTEND-Category', 'FRONTEND-TypeScript'],
    ['FRONTEND-Category', 'FRONTEND-JavaScript'],
    ['FRONTEND-Category', 'FRONTEND-HTML'],
    // Orbit 4 (INFRA)
    ['INFRA-Category', 'INFRA-Git'],
    ['INFRA-Category', 'INFRA-Docker'],
    ['INFRA-Category', 'INFRA-Linux'],
    ['INFRA-Category', 'INFRA-GitHub'],
    // Cross-orbit bridges (meaningful routes)
    ['ML STACK-PyTorch', 'BACKEND-FastAPI'],
    ['BACKEND-FastAPI', 'FRONTEND-React'],
    ['FRONTEND-TypeScript', 'INFRA-Docker']
  ];

  // Mouse Drag Events inside canvas overlay
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    pointerStart.current = { x: e.clientX, y: e.clientY };
    if (systemRef.current) {
      rotationStart.current = { x: systemRef.current.rotation.x, y: 0 };
      targetRot.current = { x: systemRef.current.rotation.x, y: 0 };
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dy = e.clientY - pointerStart.current.y;
    targetRot.current.x = rotationStart.current.x + dy * 0.003;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  // Main 3D Animation Frame Loop
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.05);

    // 1. Zero-Repositioning Occlusion Solver
    const registryKeys = Object.keys(spriteRegistryRef.current);
    // Reset all target occlusion multipliers to 1.0 (no overlap)
    registryKeys.forEach((k) => {
      occlusionRegistryRef.current[k] = { scale: 1.0, opacity: 1.0 };
    });

    // Sort active sprites by Z-depth descending (near to far)
    const sortedKeys = [...registryKeys].sort((a, b) => {
      const sA = spriteRegistryRef.current[a];
      const sB = spriteRegistryRef.current[b];
      if (!sA || !sB) return 0;
      const pA = new THREE.Vector3();
      const pB = new THREE.Vector3();
      sA.getWorldPosition(pA);
      sB.getWorldPosition(pB);
      return pB.z - pA.z;
    });

    // Detect view-space overlaps and fade/shrink the rear element (smaller Z)
    for (let i = 0; i < sortedKeys.length; i++) {
      const keyNear = sortedKeys[i];
      const spriteNear = spriteRegistryRef.current[keyNear];
      if (!spriteNear) continue;

      const wNear = new THREE.Vector3();
      spriteNear.getWorldPosition(wNear);

      for (let j = i + 1; j < sortedKeys.length; j++) {
        const keyFar = sortedKeys[j];
        const spriteFar = spriteRegistryRef.current[keyFar];
        if (!spriteFar) continue;

        const wFar = new THREE.Vector3();
        spriteFar.getWorldPosition(wFar);

        // Calculate 2D delta offset inside camera view projection (X / Y coordinates)
        const dx = Math.abs(wFar.x - wNear.x);
        const dy = Math.abs(wFar.y - wNear.y);

        // Overlap threshold: width ~ 2.8, height ~ 0.75
        if (dx < 2.8 && dy < 0.75) {
          // Shrink rear node and fade to 35% opacity (completely readable background)
          occlusionRegistryRef.current[keyFar] = { scale: 0.68, opacity: 0.35 };
        }
      }
    }

    // Resolve hovered orbit index
    let hoveredOrbitIdx = -1;
    const hoveredTag = hoveredRef.current;
    if (hoveredTag) {
      if (hoveredTag.startsWith('ML STACK')) hoveredOrbitIdx = 0;
      else if (hoveredTag.startsWith('BACKEND')) hoveredOrbitIdx = 1;
      else if (hoveredTag.startsWith('FRONTEND')) hoveredOrbitIdx = 2;
      else if (hoveredTag.startsWith('INFRA')) hoveredOrbitIdx = 3;
    }

    // Set orbit ring basic line basic material opacity (brighten hovered orbit to 0.35)
    orbitGroups.forEach((group, index) => {
      if (group.current && group.current.children[0]) {
        const lineLoop = group.current.children[0] as THREE.LineLoop;
        const mat = lineLoop.material as THREE.LineBasicMaterial;
        if (mat) {
          const baseOpacity = 0.12;
          const targetRingOpacity = hoveredOrbitIdx === index ? 0.35 : baseOpacity;
          mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetRingOpacity, 0.1);
        }
      }
    });

    // 2. Dynamic Orbit rotation updates
    introTime.current += dt;
    orbitGroups.forEach((group, index) => {
      if (group.current) {
        const revealStart = 0.6 + index * 0.3;
        const reveal = THREE.MathUtils.clamp((introTime.current - revealStart) / 0.6, 0, 1);
        
        // Apply breathing (vary orbit radius by 1-2px)
        const breathe = 1.0 + Math.sin(time * (1.2 - index * 0.2)) * 0.012;
        group.current.scale.set(reveal * breathe, reveal * breathe, reveal * breathe);
        
        // Alternating rotations and dynamic speeds over time
        const dir = ORBIT_CONFIG[index].speed > 0 ? 1 : -1;
        const baseSpeed = Math.abs(ORBIT_CONFIG[index].speed);
        const speedFluct = baseSpeed * (1.0 + Math.sin(time * 0.5 + index) * 0.15);
        group.current.rotation.z += dir * speedFluct * dt * 50.0;
      }
    });

    // 3. Camera Parallax Drift (XY plane movement)
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 0.45, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.pointer.y * 0.35, 0.05);
    state.camera.lookAt(0, 0, 0);

    // 4. System Global Rotation & Inertia Damping (Lock X/Y, spin dial on Z)
    if (systemRef.current) {
      systemRef.current.rotation.x = 0;
      systemRef.current.rotation.y = 0;
      if (isDragging.current) {
        systemRef.current.rotation.z = THREE.MathUtils.lerp(systemRef.current.rotation.z, targetRot.current.y, 0.12);
        velocity.current.y = systemRef.current.rotation.z - prevRot.current.y;
        velocity.current.x = 0;
      } else {
        systemRef.current.rotation.z += velocity.current.y;
        velocity.current.y *= 0.96;
        velocity.current.x = 0;
      }
      prevRot.current = { x: 0, y: systemRef.current.rotation.z };
    }

    // 5. Neural network lines geometry updates (1 draw call segments renderer)
    if (networkLinesRef.current) {
      const linePoints: THREE.Vector3[] = [];
      connectionPairs.forEach((pair) => {
        const startNode = spriteRegistryRef.current[pair[0]];
        const endNode = spriteRegistryRef.current[pair[1]];
        if (startNode && endNode) {
          const pStart = new THREE.Vector3();
          const pEnd = new THREE.Vector3();
          startNode.getWorldPosition(pStart);
          endNode.getWorldPosition(pEnd);
          linePoints.push(pStart, pEnd);
        } else {
          // Placeholder defaults
          linePoints.push(new THREE.Vector3(), new THREE.Vector3());
        }
      });
      networkLinesRef.current.geometry.setFromPoints(linePoints);
    }

    // 6. Hover glowing connection line drawing
    if (hoveredTag && connectionLineRef.current && spriteRegistryRef.current[hoveredTag]) {
      const activeSprite = spriteRegistryRef.current[hoveredTag];
      const worldPos = new THREE.Vector3();
      activeSprite.getWorldPosition(worldPos);

      const points = [new THREE.Vector3(0, 0, 0), worldPos];
      connectionLineRef.current.geometry.setFromPoints(points);
      connectionLineRef.current.visible = true;
    } else if (connectionLineRef.current) {
      connectionLineRef.current.visible = false;
    }

    // 7. Intelligent computation paths particles
    if (introTime.current > 2.0) {
      if (!pathActive.current && time > nextPathTriggerTime.current) {
        pathActive.current = true;
        pathProgress.current = 0;
        activePathIndex.current = Math.floor(Math.random() * paths.length);
      }

      if (pathActive.current && tracerRef.current && traceLineRef.current) {
        pathProgress.current += dt * 1.1; // traversal speed
        const currentPath = paths[activePathIndex.current];
        const numSegments = currentPath.length + 1; // Core -> S1 -> S2 -> S3 -> Core

        if (pathProgress.current >= numSegments) {
          pathActive.current = false;
          tracerRef.current.visible = false;
          traceLineRef.current.visible = false;
          nextPathTriggerTime.current = time + Math.random() * 3.0 + 2.0;
        } else {
          const segment = Math.floor(pathProgress.current);
          const tSegment = pathProgress.current - segment;

          const pStart = new THREE.Vector3(0, 0, 0);
          const pEnd = new THREE.Vector3(0, 0, 0);

          if (segment > 0) {
            const startNodeId = currentPath[segment - 1];
            if (spriteRegistryRef.current[startNodeId]) {
              spriteRegistryRef.current[startNodeId].getWorldPosition(pStart);
            }
          }
          if (segment < currentPath.length) {
            const endNodeId = currentPath[segment];
            if (spriteRegistryRef.current[endNodeId]) {
              spriteRegistryRef.current[endNodeId].getWorldPosition(pEnd);
            }
          }

          const particlePos = pStart.clone().lerp(pEnd, tSegment);
          tracerRef.current.position.copy(particlePos);
          tracerRef.current.visible = true;

          // Draw active trace path pathSegments
          const pathPoints = [new THREE.Vector3(0, 0, 0)];
          let allSpritesValid = true;
          for (let i = 0; i < currentPath.length; i++) {
            const nodeId = currentPath[i];
            if (spriteRegistryRef.current[nodeId]) {
              const nodePos = new THREE.Vector3();
              spriteRegistryRef.current[nodeId].getWorldPosition(nodePos);
              pathPoints.push(nodePos);
            } else {
              allSpritesValid = false;
            }
          }
          pathPoints.push(new THREE.Vector3(0, 0, 0));

          if (allSpritesValid) {
            traceLineRef.current.geometry.setFromPoints(pathPoints);
            traceLineRef.current.visible = true;
          }
        }
      }
    }
  });

  return (
    <>
      {/* Interactive mouse drag overlay wrapping the canvas dimensions */}
      <mesh
        position={[0, 0, 0]}
        visible={false}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <planeGeometry args={[15, 15]} />
      </mesh>

      {/* Main system container rotating globally with mouse drag and inertia */}
      <group ref={systemRef}>
        
        {/* Dynamic neural connection segment lines (rendered in 1 draw call segments mesh) */}
        <lineSegments ref={networkLinesRef} geometry={networkGeom}>
          <lineBasicMaterial attach="material" color="#818CF8" transparent opacity={0.08} />
        </lineSegments>

        {/* 2. Concentric Orbits Group */}
        {ORBIT_CONFIG.map((cfg, oIndex) => {
          // Pre-generate connection nodes along the orbits (joint points)
          const orbitNodeAngles = [Math.PI / 3, Math.PI, (5 * Math.PI) / 3]; // Fixed 90, 210, 330 degrees
          
          return (
            <group
              key={cfg.name}
              ref={orbitGroups[oIndex]}
              rotation={[0, 0, 0]}
            >
              {/* Draw thin vector ring line loop */}
              <lineLoop geometry={circleGeom} scale={cfg.radius}>
                <lineBasicMaterial attach="material" color={cfg.color} transparent opacity={0.12} />
              </lineLoop>

              {/* Decorative neural connection constellation points along the orbit loop */}
              {orbitNodeAngles.map((ang, nodeIdx) => {
                const nx = cfg.radius * Math.cos(ang);
                const ny = cfg.radius * Math.sin(ang);
                return (
                  <mesh key={nodeIdx} position={[nx, ny, 0]}>
                    <sphereGeometry args={[0.026, 8, 8]} />
                    <meshBasicMaterial color="#06B6D4" transparent opacity={0.25} />
                  </mesh>
                );
              })}

              {/* Category tag chip (distributed at theta = 0) */}
              <ChipSprite
                text={cfg.name}
                color={cfg.color}
                isCategory
                position={new THREE.Vector3(cfg.radius, 0, 0)}
                tagId={`${cfg.name}-Category`}
                hoveredRef={hoveredRef}
                spriteRegistryRef={spriteRegistryRef}
                occlusionRegistryRef={occlusionRegistryRef}
              />

              {/* Skills distributed evenly and pre-staggered along the orbit (prevent overlaps) */}
              {cfg.skills.map((skill, sIndex) => {
                // Apply pre-staggered angles based on orbit configurations to prevent overlaps
                const baseOffsetAngle = (oIndex * 15 * Math.PI) / 180; // 0, 15, 30, 45 degree stagger offsets
                const angle = baseOffsetAngle + ((sIndex + 1) / (cfg.skills.length + 1)) * Math.PI * 2;
                const x = cfg.radius * Math.cos(angle);
                const y = cfg.radius * Math.sin(angle);
                return (
                  <ChipSprite
                    key={skill}
                    text={skill}
                    color={cfg.color}
                    isCategory={false}
                    position={new THREE.Vector3(x, y, 0)}
                    tagId={`${cfg.name}-${skill}`}
                    hoveredRef={hoveredRef}
                    spriteRegistryRef={spriteRegistryRef}
                    occlusionRegistryRef={occlusionRegistryRef}
                  />
                );
              })}
            </group>
          );
        })}

        {/* 3. Ambient Dust/Stars (Faint particles floating inside system space) */}
        <AmbientStars />

      </group>

      {/* 5. Glowing connection line to hovered tag */}
      <line ref={connectionLineRef as any}>
        <bufferGeometry attach="geometry" />
        <lineBasicMaterial attach="material" color="#06B6D4" transparent opacity={0.55} linewidth={1.5} />
      </line>

      {/* 6. Computation path traces particles and lines */}
      <line {...({ ref: traceLineRef, visible: false } as any)}>
        <bufferGeometry attach="geometry" />
        <lineBasicMaterial attach="material" color="#06B6D4" transparent opacity={0.35} linewidth={2} />
      </line>
      <mesh ref={tracerRef} visible={false}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#06B6D4" />
      </mesh>
    </>
  );
};

// ----------------------------------------------------
// Ambient Dust Particles Component
// ----------------------------------------------------
const AmbientStars = () => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate 35 ambient stars inside a 3D box region
  const [positions, velocities] = useMemo(() => {
    const coords = new Float32Array(35 * 3);
    const vels = new Float32Array(35 * 3);
    for (let i = 0; i < 35; i++) {
      coords[i * 3] = (Math.random() - 0.5) * 10;
      coords[i * 3 + 1] = (Math.random() - 0.5) * 10;
      coords[i * 3 + 2] = (Math.random() - 0.5) * 10;

      // Slow drift velocity
      vels[i * 3] = (Math.random() - 0.5) * 0.06;
      vels[i * 3 + 1] = (Math.random() - 0.5) * 0.06;
      vels[i * 3 + 2] = (Math.random() - 0.5) * 0.06;
    }
    return [coords, vels];
  }, []);

  // Update positions for ambient stars drift
  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    const dt = Math.min(delta, 0.05);

    for (let i = 0; i < 35; i++) {
      array[i * 3] += velocities[i * 3] * dt;
      array[i * 3 + 1] += velocities[i * 3 + 1] * dt;
      array[i * 3 + 2] += velocities[i * 3 + 2] * dt;

      // Boundary check reset
      if (Math.abs(array[i * 3]) > 5) array[i * 3] *= -0.9;
      if (Math.abs(array[i * 3 + 1]) > 5) array[i * 3 + 1] *= -0.9;
      if (Math.abs(array[i * 3 + 2]) > 5) array[i * 3 + 2] *= -0.9;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        color="#818CF8"
        size={0.03}
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </points>
  );
};

// ----------------------------------------------------
// Faint Grid Background guides
// ----------------------------------------------------
const BackgroundGuides: React.FC = () => {
  // Generate 5 faint concentric radar guide lines
  const circlePoints = useMemo(() => {
    const pts = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  useEffect(() => {
    return () => circlePoints.dispose();
  }, [circlePoints]);

  return (
    <group position={[0, 0, -2.5]}>
      {/* Guide lines */}
      {[1.5, 3.0, 4.5, 6.0].map((rad, idx) => (
        <lineLoop key={idx} geometry={circlePoints} scale={rad}>
          <lineBasicMaterial attach="material" color="#1E293B" transparent opacity={0.12} />
        </lineLoop>
      ))}
    </group>
  );
};

// ----------------------------------------------------
// Main Canvas Wrapper Component
// ----------------------------------------------------
interface AiCoreOrbitProps {
  radius?: number;
  maxCanvasSize?: number;
}

export const AiCoreOrbit: React.FC<AiCoreOrbitProps> = ({
  radius = 210,
  maxCanvasSize = 580
}) => {
  const hoveredRef = useRef<string | null>(null);
  const spriteRegistryRef = useRef<Record<string, THREE.Sprite>>({});
  const occlusionRegistryRef = useRef<Record<string, { scale: number; opacity: number }>>({});

  const coreRef = useRef<THREE.Sprite>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);


  useEffect(() => {
    if (maxCanvasSize) {
      // noop
    }
  }, [maxCanvasSize]);

  // Pre-generate central AI Core Label Texture (Displays only "SKILLS")
  const coreTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 128, 128);
      
      // Glass/plasma central core gradient
      const grad = ctx.createRadialGradient(64, 64, 18, 64, 64, 62);
      grad.addColorStop(0, 'rgba(10, 15, 36, 0.98)');   // Deep glass center
      grad.addColorStop(0.45, 'rgba(99, 102, 241, 0.65)'); // Indigo halo
      grad.addColorStop(0.72, 'rgba(6, 182, 212, 0.38)');  // Cyan edge glow
      grad.addColorStop(1, 'rgba(8, 12, 32, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(64, 64, 64, 0, Math.PI * 2);
      ctx.fill();

      // Thin outer boundary circle representing core border
      ctx.beginPath();
      ctx.arc(64, 64, 46, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Core typography (Displays only "SKILLS")
      ctx.font = 'bold 15px "Orbitron", sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#6366F1';
      ctx.fillText('SKILLS', 64, 64);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  // Clean textures on unmount
  useEffect(() => {
    return () => {
      coreTexture.dispose();
    };
  }, [coreTexture]);

  // Handle breathing animation of the fixed core centerpiece inside a separate useFrame
  // (Since central core is outside rotating SystemGroup and stays stationary)
  const CoreAnimation = () => {
    useFrame((state) => {
      const time = state.clock.getElapsedTime();
      const breathing = 0.95 + Math.sin(time * 1.5) * 0.05;

      if (coreRef.current) {
        // Keeps core stationary and breathes scale slowly
        coreRef.current.scale.setScalar(breathing * 3.2);
      }

      // Energy rings pulse expansions
      if (ring1Ref.current && ring2Ref.current) {
        const pulse1 = (time * 0.22) % 1.0;
        ring1Ref.current.scale.setScalar(0.8 + pulse1 * 2.8);
        const mat1 = ring1Ref.current.material as THREE.MeshBasicMaterial;
        if (mat1) mat1.opacity = (1.0 - pulse1) * 0.25;

        const pulse2 = (time * 0.22 + 0.5) % 1.0;
        ring2Ref.current.scale.setScalar(0.8 + pulse2 * 2.8);
        const mat2 = ring2Ref.current.material as THREE.MeshBasicMaterial;
        if (mat2) mat2.opacity = (1.0 - pulse2) * 0.25;
      }
    });
    return null;
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden select-none">
      {/* Subtle radial overlay ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.035),transparent_75%)] pointer-events-none" />

      {/* R3F 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 19.0], fov: 48 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Subtle, standard studio light setup */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={0.4} />
        <directionalLight position={[-5, 5, -5]} intensity={0.15} />
        <pointLight position={[0, 0, 0]} intensity={0.35} color="#06B6D4" />

        {/* Faint mathematical guide circles in depth background */}
        <BackgroundGuides />

        {/* Rotating Orbits system centerpiece (revolving around core) */}
        <SystemGroup
          radius={radius}
          hoveredRef={hoveredRef}
          spriteRegistryRef={spriteRegistryRef}
          occlusionRegistryRef={occlusionRegistryRef}
        />

        {/* FIXED AI Core centerpiece (outside SystemGroup so it remains stationary) */}
        <group>
          {/* Concentric Aura Energy Rings */}
          <mesh ref={ring1Ref}>
            <ringGeometry args={[0.5, 0.51, 64]} />
            <meshBasicMaterial color="#06B6D4" transparent opacity={0.25} side={THREE.DoubleSide} />
          </mesh>
          <mesh ref={ring2Ref}>
            <ringGeometry args={[0.5, 0.51, 64]} />
            <meshBasicMaterial color="#6366F1" transparent opacity={0.25} side={THREE.DoubleSide} />
          </mesh>

          {/* Glowing central core billboard sprite */}
          <sprite ref={coreRef} position={[0, 0, 0]}>
            <spriteMaterial attach="material" map={coreTexture} transparent depthWrite={false} depthTest />
          </sprite>

          {/* Stationary Core Breathing animation loops handler */}
          <CoreAnimation />
        </group>
      </Canvas>
    </div>
  );
};

export default AiCoreOrbit;
