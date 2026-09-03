---
title: "UrbanCadastral AI"
status: "PRODUCTION-READY / CPU-FIRST CV PIPELINE"
tags: ["Computer Vision", "PyTorch", "GIS", "FastAPI", "Semantic Segmentation", "React", "TypeScript"]
metrics:
  - label: "ARCHITECTURE"
    value: "LightUNet (1.94M params)"
  - label: "MEAN DICE"
    value: "76.54% (±7.07)"
  - label: "MEAN IoU"
    value: "62.53%"
  - label: "CPU LATENCY"
    value: "~45.3 ms (4 Threads)"
  - label: "CHECKPOINT"
    value: "7.78 MB Model"
  - label: "GEOSPATIAL"
    value: "GeoTIFF / EPSG:4326"
---

### The Engineering Challenge

Automated building footprint extraction from high-resolution aerial and satellite imagery is a cornerstone of modern urban cadastral surveying, property tax auditing, disaster impact assessment, and civil infrastructure planning.

Traditional deep segmentation architectures (such as ResNet-101 based DeepLabV3+ or heavy Mask R-CNNs) deliver strong accuracy but require dedicated GPU hardware clusters. This dependency makes them costly to scale and impractical to deploy on lightweight edge devices, mobile survey rigs, or budget cloud instances.

**UrbanCadastral AI** was engineered around a strict **CPU-first constraint**: deliver production-grade building footprint segmentation masks and vectorized GeoJSON polygons at interactive latencies (**~45.3 ms**) running on standard 4-thread CPU hardware without requiring dedicated GPU infrastructure.

---

### System Architecture

The pipeline standardizes heterogeneous aerial inputs, executes sub-50ms neural inference, applies deterministic morphological filtering, and generates georeferenced spatial vectors:

```
[Aerial Image (GeoTIFF / JPG / PNG)]
      │
      ▼
[React + TypeScript GIS Workstation] ──► Canvas Viewport, Layer Control & Inspection
      │
      ▼ (POST /api/inference)
[FastAPI REST API] ──► Async Request Handling & Hardware Monitoring
      │
      ▼
[AerialInferenceEngine]
      ├──► 2nd–98th Percentile Dynamic Range Normalization
      ├──► PyTorch LightUNet Forward Pass (1.94M Params, 4 CPU Threads)
      ├──► Confidence Probability Thresholding (Sigmoid Output)
      ├──► Morphological Cleanup (Opening / Closing & Min-Area Filter)
      └──► Ramer-Douglas-Peucker Polygon Contour Simplification
      │
      ▼
[Geospatial Affine Engine] ──► Transforms Pixel Coordinates ──► EPSG:4326 (WGS84)
      │
      ▼
[Response Payload] ──► Vector GeoJSON FeatureCollection + Segmentation Masks + Metadata
```

#### End-to-End Pipeline Subsystems

1. **Multi-Format Ingestion:** Accepts both georeferenced multi-band GeoTIFF files and standard optical photography (JPG/PNG).
2. **Percentile Normalization:** Applies dynamic 2nd-to-98th percentile contrast stretching to standardize varied atmospheric exposures and sensor dynamic ranges.
3. **LightUNet Neural Inference:** Executes CPU-optimized forward inference across 4 CPU threads using lightweight separable convolutional layers.
4. **Morphological Post-Processing:** Applies mathematical morphology (binary closing to fill internal courtyards and opening to sever thin noise bridges) paired with minimum-area thresholding.
5. **Vector Polygonization:** Uses topological contour detection followed by Ramer-Douglas-Peucker (RDP) polygon simplification to convert raster pixel masks into compact polygon rings.
6. **Geospatial Coordinate Transform:** Maps pixel vertices to real-world longitude/latitude coordinates (WGS84 / EPSG:4326) using GDAL/Rasterio affine transformation matrices.

---

### LightUNet Architecture & CPU-First Inference

To achieve low-latency execution on CPU without sacrificing spatial resolution, UrbanCadastral AI utilizes a custom **LightUNet** architecture:

```
Input (3 x H x W)
  │
  ├──► [Enc Block 1: 32ch]   ──(Skip 1)──► [Dec Block 1: 32ch]   ──► Output (1 x H x W)
  │         │                                     ▲
  ├──► [Enc Block 2: 64ch]   ──(Skip 2)──► [Dec Block 2: 64ch]   ───┘
  │         │                                     ▲
  ├──► [Enc Block 3: 128ch]  ──(Skip 3)──► [Dec Block 3: 128ch]  ───┘
  │         │                                     ▲
  ├──► [Enc Block 4: 256ch]  ──(Skip 4)──► [Dec Block 4: 256ch]  ───┘
  │         │                                     ▲
  └──► [Bottleneck: 512ch] ───────────────────────┘
```

* **Parameter Count:** **1.94 Million parameters** (compared to >25M in standard ResNet-50 UNet models).
* **Model Checkpoint Footprint:** **7.78 MB** on disk, allowing near-instant cold-start loading into system memory.
* **Inference Latency:** **~45.3 ms per tile** on 4 CPU threads.
* **Loss Formulation:** Combined Binary Cross-Entropy (BCE) and Soft Dice Loss ($\mathcal{L}_{\text{total}} = \mathcal{L}_{\text{BCE}} + \mathcal{L}_{\text{Dice}}$) to balance pixel-level classification with boundary intersection overlap.

---

### Quantitative Benchmarks (SpaceNet 2 Dataset)

The model was trained on the **SpaceNet 2 Las Vegas** building dataset, comprising $30\text{ cm}$ Ground Sample Distance (GSD) optical satellite imagery with verified cadastral polygon annotations.

#### Quantitative Validation Across 7 Unseen SpaceNet 2 Tiles

| Evaluation Metric | Observed Result |
| :--- | :--- |
| **Mean Dice Coefficient** | **76.54%** $(\pm 7.07)$ |
| **Mean Intersection over Union (IoU)** | **62.53%** |
| **Best-Tile Dice Coefficient** | **87.99%** |
| **Best-Tile Intersection over Union (IoU)** | **78.56%** |
| **Mean Inference Latency (4 CPU Threads)** | **45.3 ms** |
| **Model Size** | **7.78 MB** |

> [!NOTE]
> All quantitative metrics above represent rigorous validation runs on unseen test tiles held out from the SpaceNet 2 Las Vegas benchmark.

---

### External Domain-Shift Evaluation (UAV Aerial Imagery)

To evaluate real-world generalization under severe sensor and domain shifts, the model was tested on out-of-distribution high-resolution **UAV / Drone optical imagery** featuring different ground resolutions, building styles, and sun angles:

* **Extracted Footprints:** **13 valid building polygons** correctly isolated from complex background terrain.
* **Mean Prediction Confidence:** **78.6%**.
* **Domain-Shift Inference Latency:** **64.5 ms** (CPU).

> [!IMPORTANT]
> The UAV evaluation is an out-of-distribution qualitative stress test demonstrating cross-domain generalization, and is explicitly distinct from the controlled SpaceNet 2 ground-truth benchmark.

---

### Interactive GIS Workstation

The platform includes a browser-based GIS workstation built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**:

* **Multi-Layer Rendering Engine:**
  * **RAW IMAGE:** Displays the high-resolution input aerial orthomosaic.
  * **AI BUILDING MASK:** Visualizes the raw probability segmentation raster.
  * **RAW + AI OVERLAY:** Interactive alpha-blended visualization with a real-time opacity slider $(0\% - 100\%)$.
* **Interactive Polygon Inspector:** Click any detected building polygon to inspect perimeter coordinates, polygon area, and detection confidence.
* **Standard GeoJSON Export:** Export extracted building boundaries directly as standard WGS84 / EPSG:4326 GeoJSON feature collections for immediate loading into **QGIS**, **ArcGIS**, or web mapping applications.
* **Pixel Fallback Mode:** Automatically falls back to standard pixel coordinates when processing non-georeferenced optical imagery (JPG / PNG).

---

### FastAPI REST Service Layer

The backend service is exposed via an asynchronous **FastAPI** service:

* `POST /api/inference` — Accepts multipart image uploads (GeoTIFF, JPG, PNG) and returns confidence scores, segmentation masks, bounding boxes, and vectorized GeoJSON polygons.
* `GET /api/health` — Verifies model readiness, CPU thread allocation, and system uptime.
* `GET /docs` — Interactive OpenAPI / Swagger UI interface for live API testing.

#### Resiliency & Hardware Policy
* **Thread Governance:** Caps PyTorch CPU thread pools to 4 threads to prevent CPU starvation on multi-tenant servers.
* **Morphological Validation:** Discards spurious topological artifacts smaller than the minimum building threshold $(A_{\text{min}} = 50\text{ px})$.

---

### Limitations & Engineering Takeaways

* **Canopy & Shadow Occlusions:** Heavy vegetative tree canopy or extreme sun angles producing long building shadows can obscure structural boundary lines.
* **Non-Nadir Oblique Imagery:** Significant off-nadir viewing angles (>25°) present vertical building facade distortion that shifts footprint ground truth.
* **CPU Efficiency Takeaway:** Purpose-engineered lightweight convolutional backbones (1.94M params) can achieve production segmentation accuracy on commodity CPU hardware without the operational cost of GPU clusters.
