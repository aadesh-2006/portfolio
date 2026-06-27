import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ----------------------------------------------------
// Types
// ----------------------------------------------------
interface NodeData {
  id: number;
  basePosition: THREE.Vector3;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  size: number;
  cluster: number;
  layer: 'background' | 'midground' | 'foreground';
  phase: number;
  activation: number; // 0 to 1
  cooldown: number; // seconds
}

interface EdgeData {
  id: string;
  source: number;
  target: number;
  weight: number;
  activation: number; // 0 to 1
}

interface SignalData {
  edgeId: string;
  sourceId: number;
  targetId: number;
  progress: number; // 0 to 1
  speed: number;
}

// ----------------------------------------------------
// Main Graph Scene Renderer
// ----------------------------------------------------
const GraphScene: React.FC = () => {
  const { mouse, viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const lineSegmentsRef = useRef<THREE.LineSegments>(null);
  const nodeMeshRef = useRef<THREE.InstancedMesh>(null);
  const signalMeshRef = useRef<THREE.InstancedMesh>(null);

  // 1. Generate Nodes (150 total) arranged to fill a rectangular silhouette
  const initialNodes = useMemo(() => {
    const nodes: NodeData[] = [];
    let id = 0;

    // A. Latent Grid (Background Layer - 60 nodes)
    // Structured grid that fills the background canvas edge-to-edge
    const gridCols = 10;
    const gridRows = 6;
    const startX = -4.5;
    const endX = 4.5;
    const startY = -2.5;
    const endY = 2.5;

    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        // Calculate grid position with a bit of random offset for organic feel
        const x = startX + (c / (gridCols - 1)) * (endX - startX) + (Math.random() - 0.5) * 0.2;
        const y = startY + (r / (gridRows - 1)) * (endY - startY) + (Math.random() - 0.5) * 0.2;
        const z = -2.0 + (Math.random() - 0.5) * 0.4; // Fixed background depth

        nodes.push({
          id,
          basePosition: new THREE.Vector3(x, y, z),
          position: new THREE.Vector3(x, y, z),
          velocity: new THREE.Vector3(),
          size: Math.random() * 0.02 + 0.015, // small
          cluster: -1,
          layer: 'background',
          phase: Math.random() * Math.PI * 2,
          activation: 0,
          cooldown: 0
        });
        id++;
      }
    }

    // B. Active Computational Clusters (Mid & Foreground Layers - 90 nodes)
    // Placed in 3 organic clusters that overlay the grid
    const clusters = [
      { center: new THREE.Vector3(-1.8, 0.4, 0.4), radius: 0.8, count: 28, layer: 'midground' as const },
      { center: new THREE.Vector3(0.2, -0.6, 1.5), radius: 0.9, count: 34, layer: 'foreground' as const }, // Front cluster
      { center: new THREE.Vector3(1.8, 0.5, 0.5), radius: 0.8, count: 28, layer: 'midground' as const }
    ];

    clusters.forEach((cls, clusterIdx) => {
      for (let i = 0; i < cls.count; i++) {
        // Golden spiral or random sphere coordinates
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const r = Math.random() * cls.radius;
        const x = cls.center.x + r * Math.sin(phi) * Math.cos(theta);
        const y = cls.center.y + r * Math.sin(phi) * Math.sin(theta);
        const z = cls.center.z + r * Math.cos(phi);

        // Foreground nodes are larger
        const size = cls.layer === 'foreground' 
          ? Math.random() * 0.07 + 0.06 // foreground
          : Math.random() * 0.045 + 0.035; // midground

        nodes.push({
          id,
          basePosition: new THREE.Vector3(x, y, z),
          position: new THREE.Vector3(x, y, z),
          velocity: new THREE.Vector3(),
          size,
          cluster: clusterIdx,
          layer: cls.layer,
          phase: Math.random() * Math.PI * 2,
          activation: 0,
          cooldown: 0
        });
        id++;
      }
    });

    return nodes;
  }, []);

  // 2. Generate Connections (approx 450 lines)
  const initialEdges = useMemo(() => {
    const edges: EdgeData[] = [];
    const connectionThresholds = {
      background: 1.1,  // Grid connect neighbors
      midground: 0.8,
      foreground: 0.7
    };

    // Keep track of connection counts per node to manage density
    const nodeDegree = new Array(initialNodes.length).fill(0);

    // A. Connect background grid nodes to neighbors
    const bgNodes = initialNodes.filter(n => n.layer === 'background');
    for (let i = 0; i < bgNodes.length; i++) {
      const n1 = bgNodes[i];
      for (let j = i + 1; j < bgNodes.length; j++) {
        const n2 = bgNodes[j];
        const dist = n1.basePosition.distanceTo(n2.basePosition);
        
        if (dist < connectionThresholds.background && nodeDegree[n1.id] < 3 && nodeDegree[n2.id] < 3) {
          edges.push({
            id: `${n1.id}-${n2.id}`,
            source: n1.id,
            target: n2.id,
            weight: 0.25, // dim weights for background grid
            activation: 0
          });
          nodeDegree[n1.id]++;
          nodeDegree[n2.id]++;
        }
      }
    }

    // B. Connect active cluster nodes (Mid/Foreground)
    const activeNodes = initialNodes.filter(n => n.layer !== 'background');
    for (let i = 0; i < activeNodes.length; i++) {
      const n1 = activeNodes[i];
      for (let j = i + 1; j < activeNodes.length; j++) {
        const n2 = activeNodes[j];
        const dist = n1.basePosition.distanceTo(n2.basePosition);
        
        let connectProb = 0;
        if (n1.layer === n2.layer && dist < 0.9) {
          connectProb = 0.65; // High prob within same layer
        } else if (dist < 1.2) {
          connectProb = 0.15; // Sparse across layers
        }

        if (Math.random() < connectProb && nodeDegree[n1.id] < 8 && nodeDegree[n2.id] < 8) {
          edges.push({
            id: `${n1.id}-${n2.id}`,
            source: n1.id,
            target: n2.id,
            weight: Math.random() * 0.6 + 0.4,
            activation: 0
          });
          nodeDegree[n1.id]++;
          nodeDegree[n2.id]++;
        }
      }
    }

    // C. Connect background grid to active clusters (Bridges)
    for (let i = 0; i < bgNodes.length; i++) {
      const bg = bgNodes[i];
      for (let j = 0; j < activeNodes.length; j++) {
        const act = activeNodes[j];
        const dist = bg.basePosition.distanceTo(act.basePosition);

        if (dist < 1.0 && Math.random() < 0.18 && nodeDegree[bg.id] < 4) {
          edges.push({
            id: `bridge-${bg.id}-${act.id}`,
            source: bg.id,
            target: act.id,
            weight: 0.35,
            activation: 0
          });
          nodeDegree[bg.id]++;
          nodeDegree[act.id]++;
        }
      }
    }

    // D. Long-range skip (residual) connections
    const addResidual = (sId: number, tId: number) => {
      edges.push({
        id: `skip-${sId}-${tId}`,
        source: sId,
        target: tId,
        weight: 0.85,
        activation: 0
      });
    };

    // Skip connections from left cluster to right cluster
    const leftCluster = initialNodes.filter(n => n.cluster === 0 && n.layer !== 'background');
    const rightCluster = initialNodes.filter(n => n.cluster === 2 && n.layer !== 'background');
    for (let i = 0; i < 4; i++) {
      if (leftCluster.length > i && rightCluster.length > i) {
        addResidual(leftCluster[i].id, rightCluster[rightCluster.length - 1 - i].id);
      }
    }

    return edges;
  }, [initialNodes]);

  // Keep references in refs for 60 FPS physics updates
  const stateRef = useRef({
    nodes: initialNodes.map(n => ({ ...n })),
    edges: initialEdges.map(e => ({ ...e })),
    signals: [] as SignalData[],
    lastFiredTime: 0,
    firingInterval: 2.0, // starts calm, fires new cascade every 2-5s
  });

  const linePoints = useMemo(() => new Float32Array(initialEdges.length * 2 * 3), [initialEdges]);
  const lineColors = useMemo(() => new Float32Array(initialEdges.length * 2 * 3), [initialEdges]);

  useFrame((state, delta) => {
    const { nodes, edges, signals } = stateRef.current;
    const time = state.clock.getElapsedTime();

    // Limit delta to prevent massive physics jumps on frame drop
    const dt = Math.min(delta, 0.05);

    // 1. Mouse coordinates projected to world space at z = 0
    const mouseWorld = new THREE.Vector3(
      mouse.x * (viewport.width / 2) * 1.5,
      mouse.y * (viewport.height / 2) * 1.5,
      0
    );

    // 2. Slow Camera Drift ( Lissajous sway )
    state.camera.position.x = Math.sin(time * 0.12) * 0.35;
    state.camera.position.y = Math.cos(time * 0.09) * 0.25;
    state.camera.lookAt(0, 0, 0);

    // 3. Node Physics: Idle drift + Mouse Repulsion + Spring return
    nodes.forEach(n => {
      // A. Calculate base idle drift (background grid moves slower)
      const driftSpeed = n.layer === 'background' ? 0.15 : 0.35;
      const driftAmp = n.layer === 'background' ? 0.015 : 0.045;
      const targetPos = new THREE.Vector3(
        n.basePosition.x + Math.sin(time * driftSpeed + n.phase) * driftAmp,
        n.basePosition.y + Math.cos(time * driftSpeed * 0.9 + n.phase) * driftAmp,
        n.basePosition.z + Math.sin(time * driftSpeed * 1.1 + n.phase) * (driftAmp * 0.7)
      );

      // B. Mouse repulsion force (Repels nearby nodes - mid/foreground only)
      if (n.layer !== 'background') {
        // Project mouse vector onto node's Z plane
        const mouseProj = mouseWorld.clone();
        mouseProj.z = n.position.z;

        const distToMouse = n.position.distanceTo(mouseProj);
        const repulsionRadius = 1.6;

        if (distToMouse < repulsionRadius) {
          const dir = n.position.clone().sub(mouseProj).normalize();
          // Force pushes away
          const force = (repulsionRadius - distToMouse) * 0.32;
          n.velocity.addScaledVector(dir, force);
        }
      }

      // C. Spring force pulling back to target base drifting position
      const springStrength = n.layer === 'background' ? 12.0 : 7.0;
      const damping = n.layer === 'background' ? 0.85 : 0.78;

      const disp = targetPos.clone().sub(n.position);
      n.velocity.addScaledVector(disp, springStrength * dt);
      n.velocity.multiplyScalar(damping); // friction
      
      // Update coordinates
      n.position.addScaledVector(n.velocity, dt);

      // Decay activation flashes
      n.activation = Math.max(0, n.activation - dt * 1.8);
      n.cooldown = Math.max(0, n.cooldown - dt);
    });

    // 4. Trigger calm activation cascade (Every 2-5 seconds)
    const timeSinceLastFired = time - stateRef.current.lastFiredTime;
    if (timeSinceLastFired > stateRef.current.firingInterval && signals.length === 0) {
      // Pick random node in Left cluster (midground/foreground) to initiate cascade
      const startNodes = nodes.filter(n => n.layer !== 'background' && n.position.x < -1.0);
      if (startNodes.length > 0) {
        const starter = startNodes[Math.floor(Math.random() * startNodes.length)];
        starter.activation = 1.0;

        // Fire signals along its outgoing edges
        const startEdges = edges.filter(e => e.source === starter.id || e.target === starter.id);
        if (startEdges.length > 0) {
          const selectedEdge = startEdges[Math.floor(Math.random() * startEdges.length)];
          const targetNodeId = selectedEdge.source === starter.id ? selectedEdge.target : selectedEdge.source;

          signals.push({
            edgeId: selectedEdge.id,
            sourceId: starter.id,
            targetId: targetNodeId,
            progress: 0,
            speed: Math.random() * 0.7 + 1.3 // traversal speed
          });
        }
      }
      stateRef.current.lastFiredTime = time;
      stateRef.current.firingInterval = Math.random() * 3.0 + 2.0; // Randomize next interval (2-5s)
    }

    // 5. Update Active Signal Particles
    for (let i = signals.length - 1; i >= 0; i--) {
      const sig = signals[i];
      sig.progress += sig.speed * dt;

      // Highlight connection carrying this signal
      const edge = edges.find(e => e.id === sig.edgeId);
      if (edge) {
        edge.activation = Math.min(1.0, edge.activation + dt * 6.5);
      }

      // Signal reaches destination node
      if (sig.progress >= 1.0) {
        signals.splice(i, 1); // remove signal

        const destNode = nodes.find(n => n.id === sig.targetId);
        if (destNode) {
          destNode.activation = 1.0; // flash node

          // Cascade forward
          if (destNode.cooldown <= 0) {
            destNode.cooldown = 0.8; // prevent double fire/infinite feedback loops

            const connectedEdges = edges.filter(e => 
              (e.source === destNode.id || e.target === destNode.id) && e.id !== sig.edgeId
            );

            // Filter edges going to forward positions (greater X-coordinate or residual skips)
            const forwardEdges = connectedEdges.filter(e => {
              const neighborId = e.source === destNode.id ? e.target : e.source;
              const neighbor = nodes.find(n => n.id === neighborId);
              return neighbor && (neighbor.position.x > destNode.position.x || e.id.startsWith('skip'));
            });

            // Cascade with branching (35% chance to split into 2 paths)
            if (forwardEdges.length > 0) {
              const numBranches = Math.random() < 0.35 ? 2 : 1;
              const selected = forwardEdges.sort(() => 0.5 - Math.random()).slice(0, numBranches);
              selected.forEach(edge => {
                const targetNodeId = edge.source === destNode.id ? edge.target : edge.source;
                signals.push({
                  edgeId: edge.id,
                  sourceId: destNode.id,
                  targetId: targetNodeId,
                  progress: 0,
                  speed: Math.random() * 0.7 + 1.3
                });
              });
            }
          }
        }
      }
    }

    // Fades edge highlights back smoothly
    edges.forEach(e => {
      const isCarryingSignal = signals.some(s => s.edgeId === e.id);
      if (!isCarryingSignal) {
        e.activation = Math.max(0, e.activation - dt * 2.2);
      }
    });

    // 6. Draw Connections in GPU (Vertex Color Shading for Depth Fading)
    if (lineSegmentsRef.current) {
      const geo = lineSegmentsRef.current.geometry;
      let vertexIdx = 0;
      let colorIdx = 0;

      // Theme Colors
      const bgVoidColor = { r: 0.01, g: 0.0, b: 0.08 }; // Space void background
      const normalEdgeColor = { r: 0.06, g: 0.09, b: 0.22 }; // Subtle indigo lines
      const activeEdgeColor = { r: 0.39, g: 0.42, b: 0.95 }; // Cobalt blue highlights

      edges.forEach(e => {
        const sNode = nodes[e.source];
        const tNode = nodes[e.target];

        // Vertices
        linePoints[vertexIdx++] = sNode.position.x;
        linePoints[vertexIdx++] = sNode.position.y;
        linePoints[vertexIdx++] = sNode.position.z;

        linePoints[vertexIdx++] = tNode.position.x;
        linePoints[vertexIdx++] = tNode.position.y;
        linePoints[vertexIdx++] = tNode.position.z;

        // Depth calculations for edge ends
        // Background lines are faded extensively
        const depthFactorS = Math.min(1.0, Math.max(0.12, (sNode.position.z + 2.5) / 5.0));
        const depthFactorT = Math.min(1.0, Math.max(0.12, (tNode.position.z + 2.5) / 5.0));

        // Vertex S color (Interpolate normal vs active, and blend to background for depth)
        const tS = e.activation;
        const rawRS = normalEdgeColor.r + (activeEdgeColor.r - normalEdgeColor.r) * tS;
        const rawGS = normalEdgeColor.g + (activeEdgeColor.g - normalEdgeColor.g) * tS;
        const rawBS = normalEdgeColor.b + (activeEdgeColor.b - normalEdgeColor.b) * tS;

        lineColors[colorIdx++] = bgVoidColor.r + (rawRS - bgVoidColor.r) * depthFactorS;
        lineColors[colorIdx++] = bgVoidColor.g + (rawGS - bgVoidColor.g) * depthFactorS;
        lineColors[colorIdx++] = bgVoidColor.b + (rawBS - bgVoidColor.b) * depthFactorS;

        // Vertex T color
        const tT = e.activation;
        const rawRT = normalEdgeColor.r + (activeEdgeColor.r - normalEdgeColor.r) * tT;
        const rawGT = normalEdgeColor.g + (activeEdgeColor.g - normalEdgeColor.g) * tT;
        const rawBT = normalEdgeColor.b + (activeEdgeColor.b - normalEdgeColor.b) * tT;

        lineColors[colorIdx++] = bgVoidColor.r + (rawRT - bgVoidColor.r) * depthFactorT;
        lineColors[colorIdx++] = bgVoidColor.g + (rawGT - bgVoidColor.g) * depthFactorT;
        lineColors[colorIdx++] = bgVoidColor.b + (rawBT - bgVoidColor.b) * depthFactorT;
      });

      geo.setAttribute('position', new THREE.BufferAttribute(linePoints, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
      geo.attributes.position.needsUpdate = true;
      if (geo.attributes.color) geo.attributes.color.needsUpdate = true;
    }

    // 7. Render All Nodes in InstancedMesh (Optimized: 1 Draw Call)
    const nodeMesh = nodeMeshRef.current;
    if (nodeMesh) {
      const tempObject = new THREE.Object3D();
      const nodeColor = new THREE.Color();

      // Theme Colors
      const baseNodeColor = new THREE.Color('#3B82F6'); // Muted cobalt blue
      const bgVoidColor = new THREE.Color('#030014');   // Background void black
      const flashColor = new THREE.Color('#FFFFFF');    // Pure white active flash

      nodes.forEach((n, idx) => {
        // Set coordinates & sizes
        tempObject.position.copy(n.position);
        tempObject.scale.set(n.size, n.size, n.size);
        tempObject.updateMatrix();
        nodeMesh.setMatrixAt(idx, tempObject.matrix);

        // Depth Factor (0 = background, 1 = foreground)
        const depthFactor = Math.min(1.0, Math.max(0.12, (n.position.z + 2.5) / 5.0));

        // Color flash interpolation
        nodeColor.copy(baseNodeColor).lerp(flashColor, n.activation);

        // Depth Fading (Blend color towards background void to simulate opacity)
        nodeColor.lerp(bgVoidColor, 1.0 - depthFactor);

        nodeMesh.setColorAt(idx, nodeColor);
      });

      nodeMesh.instanceMatrix.needsUpdate = true;
      if (nodeMesh.instanceColor) nodeMesh.instanceColor.needsUpdate = true;
    }

    // 8. Render Signal Particles in InstancedMesh (Optimized: 1 Draw Call)
    const signalMesh = signalMeshRef.current;
    if (signalMesh) {
      const tempObject = new THREE.Object3D();
      
      // Hide all instances offscreen initially
      for (let i = 0; i < 25; i++) {
        tempObject.position.set(999, 999, 999);
        tempObject.scale.set(0, 0, 0);
        tempObject.updateMatrix();
        signalMesh.setMatrixAt(i, tempObject.matrix);
      }

      // Render active signals along edges
      signals.forEach((sig, idx) => {
        if (idx >= 25) return; // guard max active limits
        const sNode = nodes[sig.sourceId];
        const tNode = nodes[sig.targetId];

        // Interpolate current position
        const p = sig.progress;
        const x = sNode.position.x + (tNode.position.x - sNode.position.x) * p;
        const y = sNode.position.y + (tNode.position.y - sNode.position.y) * p;
        const z = sNode.position.z + (tNode.position.z - sNode.position.z) * p;

        tempObject.position.set(x, y, z);
        
        // Depth-scaled sizes
        const depthFactor = Math.min(1.0, Math.max(0.12, (z + 2.5) / 5.0));
        const finalSize = 0.05 * depthFactor;
        tempObject.scale.set(finalSize, finalSize, finalSize);
        tempObject.updateMatrix();
        signalMesh.setMatrixAt(idx, tempObject.matrix);
      });

      signalMesh.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Connections rendering (Single Draw Call segments) */}
      <lineSegments ref={lineSegmentsRef}>
        <bufferGeometry />
        <lineBasicMaterial vertexColors={true} transparent={true} opacity={0.65} linewidth={1} />
      </lineSegments>

      {/* 2. Nodes rendering (Instanced Mesh - Single Draw Call) */}
      <instancedMesh ref={nodeMeshRef} args={[null as any, null as any, initialNodes.length]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial />
      </instancedMesh>

      {/* 3. Signal particles rendering (Instanced Mesh - Single Draw Call) */}
      <instancedMesh ref={signalMeshRef} args={[null as any, null as any, 25]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#06B6D4" /> {/* Cyan active computational signal */}
      </instancedMesh>
    </group>
  );
};

// ----------------------------------------------------
// Responsive Canvas Wrapper (Fills right Hero Column)
// ----------------------------------------------------
export const ComputationGraph: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden select-none">
      
      {/* Ambient background depth lights */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06),transparent_65%)] pointer-events-none" />

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 48 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full pointer-events-none"
        style={{ width: '100%', height: '100%' }} // Occupies 100% of container to support widescreen layout scale
      >
        <ambientLight intensity={0.9} />
        <GraphScene />
      </Canvas>
    </div>
  );
};
export default ComputationGraph;
