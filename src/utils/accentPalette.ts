/**
 * Centralized Multi-Accent Cinematic Color System
 * 
 * Provides continuous, scroll-driven interpolation across 5 distinct architectural accent identities:
 * 01 // INIT     -> Electric Blue / Cyan    (Hero / System Init)
 * 02 // WORK     -> Sophisticated Amber     (Projects / Architecture)
 * 03 // MATRIX   -> Emerald Green          (Skills / ML / Computation)
 * 04 // REGISTRY -> Electric Violet/Purple (Credentials / Cryptographic Verification)
 * 05 // PING     -> Sophisticated Magenta   (Connect / Terminal / Link Carrier)
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface AccentPhase {
  id: string;
  code: string;
  label: string;
  progress: number;
  primary: RGB;
  secondary: RGB;
  hex: string;
}

export const ACCENT_PHASES: AccentPhase[] = [
  {
    id: 'hero',
    code: '01',
    label: 'INIT',
    progress: 0.0,
    primary: { r: 6, g: 182, b: 212 },      // Electric Cyan / Blue (#06b6d4)
    secondary: { r: 14, g: 165, b: 233 },   // Sky Blue (#0ea5e9)
    hex: '#06b6d4',
  },
  {
    id: 'projects',
    code: '02',
    label: 'WORK',
    progress: 0.26,
    primary: { r: 245, g: 158, b: 11 },    // Sophisticated Amber / Orange (#f59e0b)
    secondary: { r: 234, g: 88, b: 12 },    // Warm Ochre (#ea580c)
    hex: '#f59e0b',
  },
  {
    id: 'skills',
    code: '03',
    label: 'MATRIX',
    progress: 0.52,
    primary: { r: 16, g: 185, b: 129 },    // Emerald Green (#10b981)
    secondary: { r: 5, g: 150, b: 105 },    // Forest Tech Green (#059669)
    hex: '#10b981',
  },
  {
    id: 'certifications',
    code: '04',
    label: 'REGISTRY',
    progress: 0.76,
    primary: { r: 139, g: 92, b: 246 },    // Deep Electric Violet / Purple (#8b5cf6)
    secondary: { r: 168, g: 85, b: 247 },  // Cyber Iris (#a855f7)
    hex: '#8b5cf6',
  },
  {
    id: 'contact',
    code: '05',
    label: 'PING',
    progress: 0.96,
    primary: { r: 244, g: 63, b: 94 },     // Sophisticated Red / Rose-Magenta (#f43f5e)
    secondary: { r: 225, g: 29, b: 72 },   // Deep Crimson (#e11d48)
    hex: '#f43f5e',
  },
];

/**
 * Linear interpolation between two RGB color vectors.
 */
export function lerpColor(c1: RGB, c2: RGB, t: number): RGB {
  const clampedT = Math.max(0, Math.min(1, t));
  return {
    r: Math.round(c1.r + (c2.r - c1.r) * clampedT),
    g: Math.round(c1.g + (c2.g - c1.g) * clampedT),
    b: Math.round(c1.b + (c2.b - c1.b) * clampedT),
  };
}

/**
 * Calculates continuous primary and secondary RGB color objects based on normalized scroll progress (0.0 to 1.0).
 */
export function getInterpolatedAccent(progress: number): {
  primary: RGB;
  secondary: RGB;
  activePhaseIndex: number;
} {
  const p = Math.max(0, Math.min(1, progress));

  if (p <= ACCENT_PHASES[0].progress) {
    return {
      primary: ACCENT_PHASES[0].primary,
      secondary: ACCENT_PHASES[0].secondary,
      activePhaseIndex: 0,
    };
  }

  const lastIndex = ACCENT_PHASES.length - 1;
  if (p >= ACCENT_PHASES[lastIndex].progress) {
    return {
      primary: ACCENT_PHASES[lastIndex].primary,
      secondary: ACCENT_PHASES[lastIndex].secondary,
      activePhaseIndex: lastIndex,
    };
  }

  for (let i = 0; i < lastIndex; i++) {
    const p1 = ACCENT_PHASES[i].progress;
    const p2 = ACCENT_PHASES[i + 1].progress;

    if (p >= p1 && p <= p2) {
      const t = (p - p1) / (p2 - p1);
      const primary = lerpColor(ACCENT_PHASES[i].primary, ACCENT_PHASES[i + 1].primary, t);
      const secondary = lerpColor(ACCENT_PHASES[i].secondary, ACCENT_PHASES[i + 1].secondary, t);
      const activePhaseIndex = t < 0.5 ? i : i + 1;
      return { primary, secondary, activePhaseIndex };
    }
  }

  return {
    primary: ACCENT_PHASES[0].primary,
    secondary: ACCENT_PHASES[0].secondary,
    activePhaseIndex: 0,
  };
}

/**
 * Applies interpolated accent values directly to root CSS variables.
 */
export function applyAccentToCssVariables(primary: RGB, secondary: RGB): void {
  const root = document.documentElement;
  const { r, g, b } = primary;
  const { r: rSec, g: gSec, b: bSec } = secondary;

  root.style.setProperty('--dynamic-accent', `rgb(${r}, ${g}, ${b})`);
  root.style.setProperty('--dynamic-accent-secondary', `rgb(${rSec}, ${gSec}, ${bSec})`);
  root.style.setProperty('--dynamic-glow', `rgba(${r}, ${g}, ${b}, 0.16)`);
  root.style.setProperty('--dynamic-glow-subtle', `rgba(${r}, ${g}, ${b}, 0.05)`);
  root.style.setProperty('--dynamic-dim', `rgba(${r}, ${g}, ${b}, 0.08)`);
  root.style.setProperty('--dynamic-border', `rgba(${r}, ${g}, ${b}, 0.35)`);
  root.style.setProperty('--dynamic-border-hover', `rgba(${r}, ${g}, ${b}, 0.6)`);
  root.style.setProperty('--accent-cyan', `rgb(${r}, ${g}, ${b})`);
  root.style.setProperty('--accent-cobalt', `rgb(${r}, ${g}, ${b})`);
  root.style.setProperty('--accent-purple', `rgb(${rSec}, ${gSec}, ${bSec})`);
}
