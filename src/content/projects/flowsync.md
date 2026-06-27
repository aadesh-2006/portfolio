---
title: "FlowSync Traffic Signal Optimizer"
status: "Prototype / Academic Project"
tags: ["Computer Vision", "Python", "OpenCV", "Dynamic Timing"]
metrics:
  - label: "FRAME RATE"
    value: "30 FPS (Target)"
  - label: "INTERFACE"
    value: "JSON / REST API"
  - label: "DETECTION MODEL"
    value: "YOLOv8 Nano"
  - label: "REAL-TIME CAMERA"
    value: "Webcam / Video Input"
---

### The Engineering Challenge

Standard traffic management systems rely heavily on pre-configured, static timers. Regardless of actual vehicular flow, a signal remains green for a fixed duration. This leads to clear inefficiencies: empty lanes blocking active traffic flow, and congested lanes receiving insufficient transition windows.

FlowSync was built to explore dynamic traffic signal control by estimating real-time vehicle queues using computer vision. The system analyzes raw camera streams, estimates traffic density in active lanes, and adjusts the light timers on the fly based on density equations.

---

### System Architecture

The software is structured as a pipeline with three decoupled boundaries:

1. **Perception Engine (Computer Vision):** A Python script utilizing OpenCV and YOLOv8 Nano to process video frames. It draws Region of Interest (ROI) boundaries over each traffic lane and counts active vehicle bounding boxes intersecting the ROI.
2. **Controller Logic (Timer Engine):** A state machine that translates vehicle counts into delay equations. Instead of sudden timing changes, it updates green-light timers within strict boundaries (minimum 15 seconds, maximum 60 seconds) to maintain traffic safety bounds.
3. **Visualization client:** A lightweight dashboard showing active video streams, density charts, and current state transitions.

```
[Camera Input] -> [Perception: YOLO/OpenCV] -> [Density Metric] -> [Controller State Machine] -> [GPIO / Simulation Timers]
```

---

### Technical Obstacles & Debugging Logs

During development, the prototype experienced a severe frame processing bottleneck. Processing raw high-resolution video streams on standard CPU hardware dropped the estimation loop to under 5 FPS, creating latency between vehicle detection and signal activation.

#### Isolation & Resolution
1. **Model Size:** Replaced standard YOLOv8 Medium with YOLOv8 Nano (`yolov8n.pt`), reducing parameters from 25M to 3.2M. This increased frame rates immediately, but estimation accuracy at distance decreased.
2. **Frame Skipping:** Configured the perception loop to perform inference only on every 3rd frame, relying on simple bounding-box tracking interpolation in between.
3. **Resolution Downscaling:** Downscaled input resolution to `640x480` before passing frames to the model.

These optimizations brought the processing speed back to the target **30 FPS** on local CPU hardware without significant density loss.

---

### Prototype Limitations & Future Roadmap

As an academic prototype, FlowSync has clear operating constraints:
* **Occlusion:** Vehicles tailgating large trucks are occasionally missed by the detection bounding boxes.
* **Low Light Performance:** Under night conditions or heavy rain, model accuracy decreases, requiring infrared cameras or hybrid inductive loop backups.
* **Scalability:** The current centralized model scales poorly to multi-signal intersections due to network latency, indicating a future need for decentralized edge computing.
