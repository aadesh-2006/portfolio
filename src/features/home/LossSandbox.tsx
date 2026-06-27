import React, { useEffect, useRef, useState } from 'react';

type OptimizerType = 'SGD' | 'MOMENTUM' | 'ADAM' | 'RACE';

interface ParticleState {
  name: string;
  u: number; // x coordinate relative to center
  v: number; // y coordinate relative to center
  mu: number; // momentum x
  mv: number; // momentum y
  vu: number; // adam v_x
  vv: number; // adam v_y
  color: string;
  history: { x: number; y: number }[];
  isDone: boolean;
  status: 'OPTIMIZING' | 'CONVERGED' | 'TRAPPED';
}

export const LossSandbox: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [optimizer, setOptimizer] = useState<OptimizerType>('ADAM');
  const [learningRate, setLearningRate] = useState<number>(0.05);
  const [epochs, setEpochs] = useState<number>(0);
  const [particles, setParticles] = useState<ParticleState[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Constants
  const maxEpochs = 400;
  const targetThreshold = 1.5; // pixel distance from center

  // Loss function: Anisotropic Valley with periodic ripples (local minima)
  // L(u, v) = u^2/30000 + v^2/2500 - 0.2 * cos(u/10) * cos(v/10)
  const computeLoss = (u: number, v: number): number => {
    return (u * u) / 30000 + (v * v) / 2500 - 0.2 * Math.cos(u / 10) * Math.cos(v / 10) + 0.2;
  };

  // Gradients: dL/du, dL/dv
  const computeGradients = (u: number, v: number): { gu: number; gv: number } => {
    const gu = u / 15000 + (0.2 / 10) * Math.sin(u / 10) * Math.cos(v / 10);
    const gv = v / 1250 + (0.2 / 10) * Math.cos(u / 10) * Math.sin(v / 10);
    return { gu, gv };
  };

  // Initialize a simulation run
  const initSimulation = (clickU: number, clickV: number, selectedOpt: OptimizerType) => {
    setEpochs(0);
    setIsSimulating(true);

    const initialHistory = [{ x: clickU, y: clickV }];

    if (selectedOpt === 'RACE') {
      setParticles([
        {
          name: 'SGD',
          u: clickU,
          v: clickV,
          mu: 0,
          mv: 0,
          vu: 0,
          vv: 0,
          color: '#F97316', // Orange
          history: [...initialHistory],
          isDone: false,
          status: 'OPTIMIZING',
        },
        {
          name: 'MOMENTUM',
          u: clickU,
          v: clickV,
          mu: 0,
          mv: 0,
          vu: 0,
          vv: 0,
          color: '#EAB308', // Yellow
          history: [...initialHistory],
          isDone: false,
          status: 'OPTIMIZING',
        },
        {
          name: 'ADAM',
          u: clickU,
          v: clickV,
          mu: 0,
          mv: 0,
          vu: 0,
          vv: 0,
          color: '#3B82F6', // Blue (calculated cobalt)
          history: [...initialHistory],
          isDone: false,
          status: 'OPTIMIZING',
        },
      ]);
    } else {
      const colorMap = {
        SGD: '#F97316',
        MOMENTUM: '#EAB308',
        ADAM: '#3B82F6',
      };
      setParticles([
        {
          name: selectedOpt,
          u: clickU,
          v: clickV,
          mu: 0,
          mv: 0,
          vu: 0,
          vv: 0,
          color: colorMap[selectedOpt as keyof typeof colorMap] || '#3B82F6',
          history: [...initialHistory],
          isDone: false,
          status: 'OPTIMIZING',
        },
      ]);
    }
  };

  // Triggered when user clicks the canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Convert to relative coordinates
    const clickU = x - cx;
    const clickV = y - cy;

    initSimulation(clickU, clickV, optimizer);
  };

  // Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const render = () => {
      // Clear and draw background grid
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0,0,0,0.01)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw mathematical contour lines (Equipotentials)
      ctx.lineWidth = 1;
      const totalContours = 12;
      for (let i = 1; i <= totalContours; i++) {
        ctx.beginPath();
        const baseRadiusU = i * 22;
        const baseRadiusV = i * 11;

        // Draw perturbed ellipses representing mathematical loss surfaces
        for (let angle = 0; angle <= Math.PI * 2 + 0.1; angle += 0.05) {
          const uVal = baseRadiusU * Math.cos(angle);
          const vVal = baseRadiusV * Math.sin(angle);

          // Add minor ripples to contours
          const rippleU = uVal + 4 * Math.sin(uVal / 10) * Math.cos(vVal / 10);
          const rippleV = vVal + 4 * Math.cos(uVal / 10) * Math.sin(vVal / 10);

          const drawX = cx + rippleU;
          const drawY = cy + rippleV;

          if (angle === 0) {
            ctx.moveTo(drawX, drawY);
          } else {
            ctx.lineTo(drawX, drawY);
          }
        }
        ctx.strokeStyle = document.documentElement.classList.contains('dark')
          ? 'rgba(255, 255, 255, 0.035)'
          : 'rgba(0, 0, 0, 0.04)';
        ctx.stroke();
      }

      // Draw Global Minimum Target (Calculated ground truth)
      ctx.strokeStyle = document.documentElement.classList.contains('dark')
        ? 'rgba(255,255,255,0.08)'
        : 'rgba(0,0,0,0.08)';
      ctx.lineWidth = 0.5;
      ctx.setLineDash([2, 4]);
      // Crosshair lines
      ctx.beginPath();
      ctx.moveTo(cx - 30, cy);
      ctx.lineTo(cx + 30, cy);
      ctx.moveTo(cx, cy - 30);
      ctx.lineTo(cx, cy + 30);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw global minimum dot
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#3B82F6';
      ctx.fill();

      // Render optimizer trails and particles
      particles.forEach((p) => {
        // Draw history path line
        if (p.history.length > 1) {
          ctx.beginPath();
          ctx.moveTo(cx + p.history[0].x, cy + p.history[0].y);
          for (let idx = 1; idx < p.history.length; idx++) {
            ctx.lineTo(cx + p.history[idx].x, cy + p.history[idx].y);
          }
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.name === 'ADAM' ? 2 : 1.2;
          ctx.stroke();
        }

        // Draw particle dot
        const px = cx + p.u;
        const py = cy + p.v;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Pulsating halo for active optimizing nodes
        if (!p.isDone && isSimulating) {
          ctx.beginPath();
          ctx.arc(px, py, 8 + Math.sin(Date.now() / 80) * 3, 0, Math.PI * 2);
          ctx.strokeStyle = p.color + '44'; // Add opacity
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    };

    render();
  }, [particles, isSimulating]);

  // Simulation physics update step
  useEffect(() => {
    if (!isSimulating || particles.length === 0) return;
    if (epochs >= maxEpochs) {
      setIsSimulating(false);
      return;
    }

    const timer = setTimeout(() => {
      let allDone = true;

      const nextParticles = particles.map((p) => {
        if (p.isDone) return p;

        allDone = false;
        const { gu, gv } = computeGradients(p.u, p.v);
        const gradNorm = Math.sqrt(gu * gu + gv * gv);

        let nextU = p.u;
        let nextV = p.v;
        let nextMu = p.mu;
        let nextMv = p.mv;
        let nextVu = p.vu;
        let nextVv = p.vv;
        let pStatus: ParticleState['status'] = p.status;
        let pIsDone: boolean = p.isDone;

        // Base learning scaling factor
        const lrScale = learningRate * 50;

        if (p.name === 'SGD') {
          // Standard Gradient Descent
          nextU -= lrScale * gu;
          nextV -= lrScale * gv;
        } else if (p.name === 'MOMENTUM') {
          // Gradient Descent with Momentum (gamma = 0.9)
          const gamma = 0.9;
          nextMu = gamma * p.mu + lrScale * gu;
          nextMv = gamma * p.mv + lrScale * gv;
          nextU -= nextMu;
          nextV -= nextMv;
        } else if (p.name === 'ADAM') {
          // Adam Optimizer (beta1 = 0.9, beta2 = 0.999, eps = 1e-8)
          const beta1 = 0.9;
          const beta2 = 0.999;
          const eps = 1e-8;
          const t = epochs + 1;

          nextMu = beta1 * p.mu + (1 - beta1) * gu;
          nextMv = beta1 * p.mv + (1 - beta1) * gv;

          nextVu = beta2 * p.vu + (1 - beta2) * gu * gu;
          nextVv = beta2 * p.vv + (1 - beta2) * gv * gv;

          // Bias corrections
          const muHat = nextMu / (1 - Math.pow(beta1, t));
          const mvHat = nextMv / (1 - Math.pow(beta1, t));
          const vuHat = nextVu / (1 - Math.pow(beta2, t));
          const vvHat = nextVv / (1 - Math.pow(beta2, t));

          nextU -= (lrScale * muHat) / (Math.sqrt(vuHat) + eps);
          nextV -= (lrScale * mvHat) / (Math.sqrt(vvHat) + eps);
        }

        // Check Convergence
        const distFromCenter = Math.sqrt(nextU * nextU + nextV * nextV);
        if (distFromCenter < targetThreshold) {
          pIsDone = true;
          pStatus = 'CONVERGED';
        }

        // Check if trapped in local minima
        // (if gradient norm is small, epochs > 50, but not converged to global center)
        if (!pIsDone && gradNorm < 0.0015 && epochs > 60) {
          pIsDone = true;
          pStatus = 'TRAPPED';
        }

        return {
          ...p,
          u: nextU,
          v: nextV,
          mu: nextMu,
          mv: nextMv,
          vu: nextVu,
          vv: nextVv,
          history: [...p.history, { x: nextU, y: nextV }],
          isDone: pIsDone,
          status: pStatus,
        };
      });

      setParticles(nextParticles);
      setEpochs((prev) => prev + 1);

      if (allDone) {
        setIsSimulating(false);
      }
    }, 16); // ~60 FPS rate

    return () => clearTimeout(timer);
  }, [isSimulating, particles, epochs, learningRate]);

  // Active particle metrics for HUD display
  const activeParticle = particles.find((p) => p.name === optimizer) || particles[0];
  const activeLoss = activeParticle ? computeLoss(activeParticle.u, activeParticle.v) : 0;
  const activeGrads = activeParticle ? computeGradients(activeParticle.u, activeParticle.v) : { gu: 0, gv: 0 };
  const activeGradNorm = Math.sqrt(activeGrads.gu * activeGrads.gu + activeGrads.gv * activeGrads.gv);

  return (
    <div className="w-full border border-border-grid bg-surface-bg rounded-[4px] p-4 font-mono text-[11px] text-text-muted flex flex-col gap-4 select-none">
      {/* Sandbox Header */}
      <div className="flex items-center justify-between border-b border-border-grid pb-2">
        <span className="font-bold text-text-main uppercase tracking-wider">
          [ OPTIMIZER_HUD // SANDBOX ]
        </span>
        <span className="text-[10px] text-accent-cobalt font-bold animate-pulse">
          {isSimulating ? '● CALCULATING_OPTIMIZATION_PATH' : '○ ENGINE_STANDBY'}
        </span>
      </div>

      {/* Tabs / Optimizer selection */}
      <div className="grid grid-cols-4 gap-1 border-b border-border-grid/50 pb-2">
        {(['ADAM', 'MOMENTUM', 'SGD', 'RACE'] as OptimizerType[]).map((opt) => (
          <button
            key={opt}
            onClick={() => {
              setOptimizer(opt);
              setIsSimulating(false);
              setParticles([]);
              setEpochs(0);
            }}
            className={`px-1 py-1 rounded-[2px] text-[10px] border transition-colors uppercase font-bold focus:outline-none ${
              optimizer === opt
                ? 'bg-text-main text-canvas-bg border-text-main'
                : 'border-border-grid hover:bg-canvas-bg/50 hover:text-text-main'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Interactive Canvas Canvas */}
      <div className="relative border border-border-grid/60 bg-canvas-bg/10 rounded-[2px] flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={350}
          height={210}
          onClick={handleCanvasClick}
          className="cursor-crosshair w-full block"
        />

        {/* Empty state instruction overlay */}
        {particles.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-canvas-bg/25 backdrop-blur-[0.5px] text-center pointer-events-none">
            <span className="text-accent-cobalt font-bold tracking-wider">[ CLICK ON THE LANDSCAPE ]</span>
            <span className="text-[9px] text-text-muted mt-1 leading-relaxed max-w-[220px]">
              Drop a parameter vector \(\theta\) to trace convergence trajectories down local minima.
            </span>
          </div>
        )}
      </div>

      {/* Parameter Adjustment Sliders */}
      <div className="space-y-2 border-t border-border-grid/50 pt-2 text-left">
        <div className="flex items-center justify-between">
          <span>LEARNING_RATE (\(\eta\)):</span>
          <span className="font-bold text-text-main">{learningRate.toFixed(3)}</span>
        </div>
        <input
          type="range"
          min="0.005"
          max="0.15"
          step="0.005"
          value={learningRate}
          onChange={(e) => setLearningRate(parseFloat(e.target.value))}
          disabled={isSimulating}
          className="w-full h-[3px] bg-border-grid rounded-lg appearance-none cursor-pointer accent-accent-cobalt focus:outline-none"
        />
      </div>

      {/* Real-time Telemetry Stats Panel */}
      <div className="border border-border-grid/80 rounded-[2px] p-2.5 bg-canvas-bg/20 space-y-1.5 text-left">
        <div className="grid grid-cols-2 gap-2 border-b border-border-grid/40 pb-1.5">
          <div>
            <span className="text-[9px] text-text-muted block">EPOCHS_RUN</span>
            <span className="text-xs font-bold text-text-main">{epochs.toString().padStart(4, '0')}</span>
          </div>
          <div>
            <span className="text-[9px] text-text-muted block">LOSS: L(\(\theta\))</span>
            <span className="text-xs font-bold text-text-main">
              {particles.length > 0 ? activeLoss.toFixed(6) : '0.000000'}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <div>
            <span className="text-[9px] text-text-muted block">GRADIENT_NORM</span>
            <span className="text-xs font-bold text-text-main">
              {particles.length > 0 ? activeGradNorm.toFixed(6) : '0.000000'}
            </span>
          </div>
          <div>
            <span className="text-[9px] text-text-muted block">CONVERGENCE_STATUS</span>
            <span
              className={`text-xs font-bold uppercase ${
                !particles.length
                  ? 'text-text-muted'
                  : activeParticle?.status === 'CONVERGED'
                  ? 'text-green-600 dark:text-green-400'
                  : activeParticle?.status === 'TRAPPED'
                  ? 'text-red-500'
                  : 'text-accent-cobalt'
              }`}
            >
              {particles.length > 0 ? activeParticle.status : 'STANDBY'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
