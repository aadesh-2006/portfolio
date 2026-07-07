---
title: "ProgramEnergy Microgrid Balancer"
status: "Operational Microgrid System"
tags: ["Microgrids", "React", "Spring Boot", "MongoDB"]
metrics:
  - label: "DATABASE SCHEMA"
    value: "MongoDB / Timeseries"
  - label: "POLLING LOOP"
    value: "1000 ms"
  - label: "BACKEND"
    value: "Java / Spring Boot"
  - label: "API INTERFACE"
    value: "REST / HTTP"
---

### The Engineering Challenge

Microgrids integrating solar generators and local battery arrays face severe instability. Sudden cloud coverage drops generator output instantly, while local load peaks can exhaust battery reserves.

ProgramEnergy balances microgrid resources. It aggregates load telemetry and coordinates power dispatch schedules across storage devices and the utility grid, ensuring system stability.

---

### System Architecture

The software is structured as a pipeline with three decoupled boundaries:

1. **Telemetry Collector:** A Spring Boot listener that collects voltage and current telemetry from local microgrid endpoints at 1000 ms intervals.
2. **Scheduling Controller:** Calculates battery state of charge (SoC) profiles and schedules power dispatch intervals using time-of-use tariffs.
3. **Operations Dashboard:** A full-stack console built in React, displaying energy generation curves and load curves.

```
[Battery telemetry] -> [Spring Boot Listener] -> [MongoDB Timeseries] -> [Dispatch Scheduler] -> [React Dashboard]
```

---

### Technical Obstacles & Debugging Logs

High-frequency telemetry writes (1000 ms per device) created write lock contention in standard database configurations, leading to dropped telemetry logs.

#### Isolation & Resolution
1. **Timeseries Optimization:** Replaced standard collections in MongoDB with optimized Timeseries collections, compressing logs and reducing disk space.
2. **Batch Ingestion Buffer:** Developed an in-memory queue in Java to buffer telemetry packets before performing batch writes.
3. **Indexes:** Added compound indexes on timestamp and device identifiers to optimize dashboard load queries.

These changes resolved write bottlenecks and achieved stable telemetry logging across the local grid.

---

### Prototype Limitations & Future Roadmap
* **Grid Isolation:** Lacks islanding control relays for offline microgrid self-healing during utility grid blackouts.
* **Database Scaling:** Transitioning historical timeseries archives to distributed database clusters as device count exceeds 100.
