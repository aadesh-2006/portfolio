---
title: "Portfolio OS Console"
status: "Release / Production"
tags: ["Three.js", "React Three Fiber", "TypeScript", "Vite"]
metrics:
  - label: "RENDERING ENGINE"
    value: "WebGL / Three.js"
  - label: "FRAME TARGET"
    value: "Locked 60 FPS"
  - label: "BUILD TOOL"
    value: "Vite v8"
  - label: "DESIGN SPEC"
    value: "Apple / Vercel HUD"
---

### The Engineering Challenge

Standard web portfolios rely on static templates that fail to capture the technical depth of specialized software engineers.

Portfolio OS is a premium interactive terminal system. It translates complex technical concepts (like AI networks, physics-informed trackers, and distributed microgrids) into 3D visualizations, presenting work as a cohesive engineering database.

---

### System Architecture

The software is structured as a pipeline with three decoupled boundaries:

1. **3D AI Core Canvas:** A React Three Fiber (R3F) layout rendering concentric orbit rings, glass skill chips, and dynamic particle paths.
2. **State & Parallax Engine:** Custom mouse drag handlers and camera drift calculations implemented in useFrame hooks to yield responsive parallax.
3. **Responsive Interface:** A fast responsive web shell built using Vite and Tailwind CSS.

```
[User Drag / Hover] -> [R3F state / useFrame] -> [GPU WebGL Shader] -> [Interactive 3D Interface]
```

---

### Technical Obstacles & Debugging Logs

Rendering 3D glass chips with text labels caused frame rates to drop below 30 FPS on mobile browsers due to CPU canvas texture re-renders.

#### Isolation & Resolution
1. **Static Canvas Caching:** Refactored text rendering to pre-render the canvas textures exactly once on mount, rather than updating them inside the loop.
2. **Flat XY Projection:** Flattened the system rotation onto the XY plane and locked camera Y parallax to prevent vertical collapsing and improve readability.
3. **Draw Call Optimization:** Aggregated all neural connection lines into a single `<lineSegments>` buffer geometry, reducing WebGL draw calls to exactly 1.

These optimizations successfully restored performance to a locked **60 FPS** on both desktop and mobile layouts.

---

### Prototype Limitations & Future Roadmap
* **Offline Bundling:** Needs full service-worker caching for complete offline runtime access.
* **Accessibility:** Monochrome terminal themes present low contrast; needs customizable themes.
