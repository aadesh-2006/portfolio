---
title: "GitPulse"
status: "PRODUCTION-ORIENTED / SYSTEM & INTELLIGENCE"
tags: ["Java 21", "Spring Boot 3.3.4", "Apache Kafka 3.8", "PostgreSQL 16", "Redis 7", "React 18", "TypeScript 5.6", "Flyway", "Docker"]
metrics:
  - label: "AUTOMATED TESTS"
    value: "533 Passing Tests (JUnit 5 / MockMvc / Kafka)"
  - label: "CORE RUNTIME"
    value: "Java 21 / Spring Boot 3.3.4"
  - label: "EVENT STREAMING"
    value: "Apache Kafka 3.8.0 KRaft"
  - label: "DATA PERSISTENCE"
    value: "PostgreSQL 16 / Flyway V1–V9"
  - label: "ANALYTICS CACHE"
    value: "Redis 7 / Best-Effort Fallback"
  - label: "ANALYTICS UI"
    value: "6-View React 18 + Recharts 3"
---

### 01 // SYSTEM OVERVIEW & PROBLEM STATEMENT

Modern engineering leaders and developers frequently lack granular, empirical visibility into how codebases evolve over time. While Git repositories contain exhaustive historical records of every code change, author interaction, and file modification, standard Git tooling presents this data in raw, fragmented formats—commit logs, diffs, and disconnected pull requests.

Crucial engineering intelligence remains obscured:
* **Unidentified File Hotspots:** High-churn, heavily-edited files that represent systemic architectural bottlenecks or operational friction.
* **Knowledge Concentration Risk:** Single-contributor file ownership and bus-factor vulnerabilities across mission-critical modules.
* **Unclassified Development Dynamics:** Difficulty distinguishing routine maintenance, refactoring, documentation, and feature velocity across releases.
* **Absence of Deterministic Stability Scoring:** Lack of unified, multi-factor risk scoring grounded in verifiable historical change frequency.

**GitPulse** was engineered as an enterprise-grade engineering intelligence platform that ingests Git repository histories, processes commit activity asynchronously through an event-driven Kafka pipeline, and derives actionable signals across repository evolution, file hotspots, contributor attribution, ownership concentration, and deterministic risk modeling.

---

### 02 // HIGH-LEVEL ARCHITECTURE & EVENT PIPELINE

GitPulse follows an asynchronous, event-driven architecture designed to handle deep repository histories with resilient processing boundaries:

```
[GitHub REST API]
       │ (Link Header Pagination & Rate-Limit Handling)
       ▼
[Spring Boot 3.3.4 REST API Layer]
       │ (Analysis Job Submission)
       ▼
[Apache Kafka 3.8.0 KRaft // topic: analysis-jobs]
       │
       ▼
[AnalysisJobEventConsumer]
       │
       ▼
[RepositoryAnalysisProcessor (Pipeline Orchestrator)]
       ├── 1. CommitIngestionService (Paginated commit tree fetch)
       ├── 2. CommitClassificationPipelineService (Deterministic heuristics)
       ├── 3. FileChangeIngestionService (Per-commit file patch changes)
       ├── 4. ContributorAggregationService (Author email attribution)
       ├── 5. RepositoryFileAggregationService (Revisions & code churn)
       ├── 6. RepositoryContributorFileAggregationService (Ownership matrix)
       └── 7. RepositoryFileRiskMaterializationService (Composite risk scoring)
       │
       ▼
[PostgreSQL 16 (Strict Source of Truth // Flyway V1-V9)]
       │
       ├── (Best-Effort 5-Min TTL Caching) ──► [Redis 7 Alpine]
       │                                            │ (Fallback on Miss)
       ▼                                            ▼
[Spring Boot Analytics REST API Layer] ◄────────────┘
       │
       ▼
[React 18 + Vite 5 + TypeScript + Recharts 3 Dashboard (6 Views)]
```

---

### 03 // GITHUB REST API INGESTION

The ingestion layer interfaces with the GitHub REST API through Spring 6 `RestClient`:
* **RFC 5988 Pagination:** Dynamically traverses paginated commit endpoints using standard `Link` headers without hardcoding page limits.
* **Rate-Limit & Backoff Handling:** Inspects rate-limit response headers (`X-RateLimit-Remaining`, `X-RateLimit-Reset`) and gracefully manages quota exhaustion.
* **Commit Deduplication:** Enforces unique database constraints across `(repository_id, github_commit_sha)`, preventing duplicate ingestion during retries.
* **Detailed Patch Inspection:** Inspects per-commit file modifications, additions, deletions, and patch metadata to track atomic change volume.

---

### 04 // KAFKA-BASED ASYNCHRONOUS ANALYSIS PIPELINE

Repository analysis is fundamentally decoupled from HTTP request-response cycles via **Apache Kafka 3.8.0 (KRaft mode)**:
* **Job Lifecycle State Machine:** Transitions analysis jobs across `PENDING` $\to$ `RUNNING` $\to$ `COMPLETED` / `FAILED` with execution timing and error diagnosis.
* **Deterministic Stage Orchestration:** The `RepositoryAnalysisProcessor` executes seven sequential analysis stages, ensuring data dependencies (commits $\to$ file changes $\to$ contributor aggregations $\to$ risk materialization) are strictly satisfied.
* **Idempotent Ingestion & Resiliency:** Kafka consumers operate with idempotent retry policies, backoff intervals, and transactional boundaries to maintain database consistency.

---

### 05 // COMMIT CLASSIFICATION ENGINE

GitPulse incorporates a deterministic, rule-based classification engine that categorizes commits into standard engineering types:

* **Classification Categories:** `FEATURE`, `BUG_FIX`, `REFACTOR`, `DOCUMENTATION`, `TEST`, `BUILD`, `CONFIGURATION`, `DEPENDENCY`, `OTHER`.
* **Heuristic Parser:** Evaluates Conventional Commit prefixes (e.g., `feat:`, `fix:`, `refactor:`), regex patterns, and commit message keyword signals.
* **Historical Composition Analysis:** Aggregates classification distribution across configurable time windows and monthly evolution intervals.

---

### 06 // FILE-CHANGE & HOTSPOT INTELLIGENCE

Every individual file modification is tracked across commit histories:
* **Lifecycle Tracking:** Categorizes file mutations across `ADDED`, `MODIFIED`, `REMOVED`, and `RENAMED` states.
* **Materialized Aggregations:** Computes cumulative `totalRevisions`, `totalAdditions`, `totalDeletions`, and `totalChurn` (`additions + deletions`).
* **Hotspot Detection:** Identifies systemic architectural hotspots by ranking files across normalized revision frequency and churn intensity.

---

### 07 // CONTRIBUTOR ATTRIBUTION & OWNERSHIP CONCENTRATION

Contributor dynamics are analyzed to uncover maintenance patterns and organizational risks:
* **Deterministic Author Attribution:** Utilizes normalized author email (`LOWER(TRIM(author_email))`) as the primary attribution key.
* **Contributor-to-File Matrix:** Materializes relational mappings between individual contributors and modified files.
* **Ownership Concentration:** Quantifies single-contributor dominance as:
  $$\text{OwnershipConcentration} = \frac{\text{topContributorRevisions}}{\text{totalRevisionsAcrossContributors}}$$
* *Note*: Author email is treated as an engineering attribution key and does not imply verified human identity.

---

### 08 // DETERMINISTIC RISK & STABILITY SCORING

GitPulse implements a transparent, multi-dimensional scoring model to assess file volatility:

#### Scoring Dimensions
1. **Revision Frequency ($S_{\text{rev}}$)**: Log-normalized commit count against the repository maximum (weight = $0.30$).
2. **Code Churn ($S_{\text{churn}}$)**: Log-normalized line churn (additions + deletions) against repository maximum (weight = $0.30$).
3. **Recency ($S_{\text{rec}}$)**: True 90-day half-life exponential decay factor (weight = $0.20$):
   $$S_{\text{rec}} = \exp\left(-\frac{\ln(2) \cdot \text{ageDays}}{90}\right)$$
4. **Ownership Concentration ($S_{\text{own}}$)**: Top contributor revision share clamped to $[0.0, 1.0]$ (weight = $0.20$).

#### Composite Formula
$$S_{\text{composite}} = 0.30 S_{\text{rev}} + 0.30 S_{\text{churn}} + 0.20 S_{\text{rec}} + 0.20 S_{\text{own}}$$

> [!IMPORTANT]
> **Descriptive Analytical Metric**: This is a deterministic scoring formula of historical engineering churn, change recency, and author concentration. It is **NOT** a machine learning model and does **NOT** claim to detect security vulnerabilities or code bugs.

---

### 09 // REDIS CACHING WITH POSTGRESQL FALLBACK

* **Evolution Analytics Caching:** Caches high-compute monthly evolution queries and period comparison deltas in **Redis 7**.
* **Composite Cache Keys:** Incorporates repository ID, analysis timestamp, and query parameters with a 5-minute configurable TTL (`EVOLUTION_CACHE_TTL`).
* **Graceful Degradation:** PostgreSQL 16 remains the strict source of truth. If Redis is unavailable or encounters connection errors, the service automatically falls back to PostgreSQL without failing user requests.

---

### 10 // PRODUCTION OBSERVABILITY & METRICS

* **Correlation ID Tracing:** Propagates unique `X-Correlation-ID` headers across HTTP filters, asynchronous threads, and structured log contexts.
* **Custom Micrometer Metrics:** Emits fine-grained telemetry including `gitpulse.analysis.jobs`, `gitpulse.commits.ingested`, `gitpulse.filechanges.ingested`, `gitpulse.cache.hits`, `gitpulse.cache.misses`, and `gitpulse.kafka.publish.retries`.
* **Actuator Health Probes:** Exposes production liveness and readiness endpoints (`/actuator/health`, `/actuator/metrics`, `/actuator/info`).

---

### 11 // REACT ANALYTICS DASHBOARD

The frontend is built with **React 18, TypeScript 5.6, Vite 5, Recharts 3, and Tailwind CSS**, featuring 6 dedicated views:

1. **Overview Dashboard:** Repository status, GitHub metadata synchronization, and job execution timeline.
2. **Evolution Dashboard:** Monthly commit activity, code churn intensity graphs, and classification trends.
3. **File Intelligence & Hotspots:** Paginated file tables, code churn distributions, and file extension filters.
4. **Contributors & Ownership:** Contributor activity rankings, churn attribution, and file-level ownership share distributions.
5. **Commit Intelligence:** Paginated commit log, classification filters, author selection, and per-commit diff inspection.
6. **Risk & Stability Dashboard:** Side-by-side comparison of baseline revision-frequency scores vs composite multi-factor hotspot scores with factor decomposition.

---

### 12 // TEMPORAL BENCHMARK METHODOLOGY

GitPulse includes a research benchmark harness designed to evaluate whether multi-dimensional hotspot scoring provides superior predictive signals for future repository activity compared to revision frequency alone.

#### Evaluation Setup
* **Historical Window $(-\infty, T_{\text{cutoff}}]$:** Reconstructs historical metrics strictly using commits on or before $T_{\text{cutoff}}$.
* **Future Window $(T_{\text{cutoff}}, T_{\text{cutoff}} + 90\text{ days}]$:** Observes actual file changes in the subsequent 90-day horizon.
* **Anti-Leakage Guarantee:** Aggregates exclusively from immutable source tables up to $T_{\text{cutoff}}$ without reading present-day materialized state.
* **Primary Evaluation Metric:** **Precision@10 for `futureChanged`** (fraction of top 10 predicted hotspot files modified in the future window).

#### Current Benchmark Status
> [!NOTE]
> **CONFIGURED / NOT YET EXECUTED**: The benchmark harness, statistical evaluation algorithms (Precision@K, Recall@K, Spearman $\rho$, Mann-Whitney ROC-AUC, 10,000 bootstrap resamples), and 15-repository evaluation configuration ($15 \text{ repos} \times 3 \text{ cutoffs} = 45 \text{ planned runs}$) are fully implemented in code. The actual live execution of the 45 benchmark runs remains **pending**. No empirical findings or predictive performance claims are made at this stage.
