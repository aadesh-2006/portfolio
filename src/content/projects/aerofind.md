---
title: "AeroFind Satellite Tracker"
status: "Active Research Project"
tags: ["Physics-Informed ML", "Python", "PyTorch", "DeepXDE"]
metrics:
  - label: "FRAMEWORK"
    value: "DeepXDE / PINN"
  - label: "ACCURACY"
    value: "92% Localization"
  - label: "Telemetry"
    value: "Real-time Telemetry"
  - label: "GPU Target"
    value: "NVIDIA CUDA"
---

### The Engineering Challenge

Tracking lost satellites or space debris using purely statistical deep learning often yields physically impossible trajectories (e.g., orbits that violate Kepler's laws of planetary motion or conservation of energy). 

AeroFind resolves this by utilizing Physics-Informed Neural Networks (PINNs). By embedding physical orbital laws directly into the neural network loss function, the model achieves high localization accuracy even with highly sparse or noisy telemetry logs.

---

### System Architecture

The software is structured as a pipeline with three decoupled boundaries:

1. **Telemetry Pipeline:** Standardizes and preprocesses orbital telemetry parameters (velocity, altitude, epoch) using Pandas and NumPy.
2. **Physics Optimization Loop (PINN Engine):** A PyTorch neural network that evaluates satellite drift coordinates. The loss function contains a mean squared error (MSE) term for historical telemetry matching, plus a Keplerian constraint penalty term.
3. **Tracking visualizer:** A 3D orbital trajectory dashboard representing satellite drift paths.

```
[Telemetry Input] -> [Preprocess: Pandas/NumPy] -> [PINN Loss: Keplerian Constraints] -> [GPU Optimization: CUDA] -> [Output Path]
```

---

### Technical Obstacles & Debugging Logs

During training, the optimizer experienced severe gradient instability. The physical loss term and data-driven loss term were competing, causing the gradients to vanish or explode during backpropagation.

#### Isolation & Resolution
1. **Dynamic Loss Weighting:** Implemented an adaptive learning rate algorithm that scales the physics penalty factor relative to the telemetry matching MSE.
2. **Double Precision Floating-Point:** Upgraded tensors from float32 to float64 (double precision) to reduce rounding errors during high-magnitude gravity calculations.
3. **Pre-training step:** First trained the network on standard Keplerian orbits for 1,000 epochs before activating the physics constraint loss loop.

These adjustments stabilized gradient convergence and brought localization accuracy to **92%** on test telemetry sets.

---

### Prototype Limitations & Future Roadmap
* **Atmospheric Drag:** The current physics loss term assumes a perfect vacuum and does not account for atmospheric drag at low earth orbit (LEO).
* **Multi-body Gravity:** Limited to two-body gravity calculations. Tracking paths near Lagrange points requires three-body gravity equations.
