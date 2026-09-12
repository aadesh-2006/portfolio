---
title: "MockAPILab"
status: "PRODUCTION-ORIENTED / BACKEND TOOL"
tags: ["Java 21", "Spring Boot 3.4", "PostgreSQL 16", "Redis 7", "Apache Kafka 3.7", "Developer Tooling", "Docker"]
metrics:
  - label: "AUTOMATED TESTS"
    value: "151 Tests (JUnit / MockMvc)"
  - label: "CORE RUNTIME"
    value: "Java 21 / Spring Boot 3.4"
  - label: "STATE MANAGEMENT"
    value: "Redis 7 Shared Runtime State"
  - label: "ASYNC GENERATION"
    value: "Apache Kafka 3.7 Pipeline"
  - label: "PERSISTENCE"
    value: "PostgreSQL 16 / Flyway"
  - label: "MILESTONES"
    value: "11 Development Phases"
---

### 01 // THE PROBLEM

Modern full-stack and frontend development workflows are persistently bottlenecked by backend dependencies. When developing new features, frontend teams frequently encounter blocked pipelines while waiting for backend service implementations, unstable staging environments, or incomplete API contracts.

Traditional solutions to this problem exhibit severe functional limitations:

* **Static Mock Servers:** Return rigid, hardcoded JSON payloads without maintaining mutable state across subsequent requests (e.g., a newly created resource via `POST` does not appear in subsequent `GET` requests).
* **No Edge-Case Simulation:** Incapable of realistically modeling network latency, intermittent 500 server crashes, 429 rate-limiting thresholds, or 401 unauthorized states without custom code modifications.
* **Manual Contract Synchronization:** Creating mock endpoints from large OpenAPI documents, natural-language specifications, or Spring controller source code is labor-intensive and susceptible to silent schema drift.

**MockAPILab** was engineered as a production-grade developer productivity platform that transforms OpenAPI 3.x specifications, natural-language API descriptions, and Spring Boot controller source code into locally runnable, stateful, realistic mock backends with interactive scenario failure injection.

---

### 02 // MODULAR MONOLITH ARCHITECTURE

MockAPILab is architected as a clean, decoupled **Modular Monolith** in Java 21 and Spring Boot 3.4. It enforces strict boundary separation across six core domain modules to ensure maintainability, testability, and isolated failure domains:

```
[Frontend Client / API Consumers]
               │
               ▼
[Spring Security 6 (Stateless JWT Filter)]
               │
               ▼
[Modular Monolith Application Core]
   ├──► Auth Module (Registration, JWT issuance, Password hashing)
   ├──► Project & Workspace Module (Multi-tenant workspace isolation)
   ├──► Contract Engine (OpenAPI parsing, canonical normalization, versioning)
   ├──► AI Engine (Gemini contract extraction + deterministic validation)
   ├──► Scenario Engine (Deterministic rule precedence & execution limits)
   └──► Stateful Runtime Engine (Dynamic route dispatching at /mock/{runtimeId}/**)
               │
               ▼
[Distributed Infrastructure Layer]
   ├──► PostgreSQL 16 (System of record via Spring Data JPA & Flyway)
   ├──► Redis 7 (Distributed mutable mock state & atomic counters)
   └──► Apache Kafka 3.7 (Asynchronous mock generation jobs)
```

#### Domain Module Boundaries

1. **Auth & Security:** Manages user authentication, workspace isolation, and stateless JWT token lifecycle.
2. **Project Management:** Organizes APIs into workspaces, access boundaries, and environment configurations.
3. **Contract Engine:** Serves as the central schema authority, ingesting heterogeneous inputs and converting them into an internal `NormalizedContract` representation.
4. **AI Engine:** Bridges external LLM reasoning capabilities with strict deterministic candidate validation before schema persistence.
5. **Scenario Engine:** Intercepts runtime traffic to evaluate failure injection rules, delay simulation, and probabilistic behaviors.
6. **Stateful Runtime Engine:** Exposes dynamic REST routes under `/mock/{runtimeId}/**` and manages collection-level CRUD state transitions.

---

### 03 // CONTRACT ENGINE & CANONICAL NORMALIZATION

The Contract Engine acts as the definitive contract authority across the entire platform lifecycle. Rather than coupling runtime logic directly to raw OpenAPI JSON/YAML trees or ad-hoc representations, the engine parses and maps all inputs into a canonical **`NormalizedContract`** object model.

```
[OpenAPI 3.x / Natural Language / Spring Code]
                      │
                      ▼
            [Contract Ingestion Layer]
                      │
                      ▼
            [Schema Tree Validator]
                      │
                      ▼
            [Canonical NormalizedContract]
   ├──► Base Path & Server Routing
   ├──► Endpoint Taxonomy (Path, Method, Operation ID)
   ├──► Parameter Matrix (Path, Query, Header constraints)
   ├──► Request Body Schema (Type, Required Fields, Nested Objects)
   └──► Response Definitions (200, 201, 400, 404, 500 status envelopes)
```

#### Contract Integrity & Versioning

* **Deterministic Schema Traversal:** Traverses nested JSON Schema definitions, resolving circular references safely and normalizing primitive types.
* **Contract Versioning:** Each modification creates an immutable contract version record, allowing developers to roll back contracts or run simultaneous parallel runtimes against different API iterations.
* **Schema Validation Pre-Flight:** Before any contract is activated in a runtime, all endpoints, parameters, and response schemas undergo strict type and syntax verification.

---

### 04 // AI CONTRACT EXTRACTION

MockAPILab integrates **Google Gemini** as a specialized extraction subsystem rather than a general-purpose runtime. The platform strictly isolates AI reasoning to contract creation, using deterministic validation to guarantee structural integrity:

```
[Natural Language Prompt / Spring Boot Controller Code]
                         │
                         ▼
        [AI Engine: Structured Prompt Assembler]
                         │
                         ▼
        [Google Gemini API (JSON Schema Enforcement)]
                         │
                         ▼
             [Candidate Contract DTO]
                         │
                         ▼
     [Deterministic Candidate Validator (Pure Java)]
            ├── Validates HTTP Methods & Status Codes
            ├── Enforces JSON Schema syntax compliance
            ├── Rejects hallucinated data types
            └── Validates required path parameter bindings
                         │
                         ▼
           [NormalizedContract Saved to PG16]
```

#### Extraction Modalities

1. **Natural Language Specification:** Converts developer descriptions (e.g., *"Create an e-commerce order management API with customer IDs, items, tracking status, and pagination"*) into structured OpenAPI-compliant contracts.
2. **Spring Boot Code Ingestion:** Parses `@RestController`, `@RequestMapping`, `@GetMapping`, `@PostMapping`, DTO records, and validation annotations (`@NotNull`, `@Size`) directly from Java source files into full contract definitions.
3. **Zero-Hallucination Barrier:** The AI output is treated as untrusted input. The platform runs deterministic schema compilers over the candidate contract, ensuring only 100% valid specifications reach the persistence layer.

---

### 05 // STATEFUL MOCK RUNTIME

The Stateful Runtime Engine powers the core developer experience by mounting dynamic, isolated REST backends at runtime under `/mock/{runtimeId}/**`.

```
[Incoming Request: POST /mock/rt-892/api/v1/users]
                         │
                         ▼
            [Dynamic Route Dispatcher]
                         │
                         ▼
            [Request Schema Validation]
                         │
                         ▼
            [Scenario Engine Interceptor]
                         │
                         ▼
            [State Mutation Handler]
   ├── Auto-generates unique ID (UUID / Sequential)
   ├── Validates payload against collection schema
   └── Appends record into runtime collection in Redis
                         │
                         ▼
    [Response: HTTP 201 Created + Realistic Payload]
```

#### Runtime Capabilities

* **CRUD Lifecycle Semantics:** Automatically manages in-memory and Redis-backed state collections. A `POST` request persists a record; subsequent `GET /{id}`, `PUT /{id}`, `PATCH /{id}`, and `DELETE /{id}` operations reflect real state mutations.
* **Dynamic Route Matching:** Employs hierarchical path matching with URI template resolution for path variables (`/users/{userId}/orders/{orderId}`).
* **Deterministic Mock Data Generation:** When creating initial or mock responses, the engine synthesizes schema-aware realistic data (names, emails, timestamps, addresses) adhering strictly to defined property formats.

---

### 06 // SCENARIO ENGINE & FAILURE INJECTION

To thoroughly validate frontend resilience, MockAPILab features a powerful **Scenario Engine** that dynamically intercepts runtime requests and injects controlled edge-case behaviors:

```
[Runtime Request] ──► [Scenario Rule Evaluator]
                              │
       ┌──────────────────────┼──────────────────────┐
       ▼                      ▼                      ▼
 [FORCE_STATUS]            [DELAY]           [RANDOM_FAILURE]
   • 401 Unauthorized       • Fixed ms latency  • Configurable % error rate
   • 429 Rate Limit         • Gaussian jitter   • Intermittent 503 drops
   • 500 Server Error
                              │
                              ▼
       [Rule Execution Guard: Atomic maxExecutions Counter]
```

#### Rule Precedence & Execution Controls

* **Deterministic Rule Precedence:** When multiple scenario rules match an endpoint, the engine resolves execution using strict, predictable rule priorities.
* **Atomic Execution Limits:** Supports `maxExecutions` counters, enabling developers to simulate transient errors (e.g., *"Fail with 500 for the first 2 requests, then succeed"* to test frontend retry mechanisms).
* **Targeted Matching:** Scenarios can match by HTTP method, exact path, wildcards, query parameters, or specific request header values.

---

### 07 // DISTRIBUTED INFRASTRUCTURE

The backend is engineered for horizontal scalability, high concurrency, and distributed deployment using industry-standard backend infrastructure:

```
[Spring Boot 3.4 Services]
       │
       ├──► [PostgreSQL 16] ── System of Record (Projects, Contracts, Versions, Users)
       │
       ├──► [Redis 7 Cluster] ── High-Speed Shared Mutable State (Collections, Scenarios)
       │
       └──► [Apache Kafka 3.7] ── Event-Driven Asynchronous Pipeline (Large Mock Generation)
```

#### Infrastructure Subsystems

* **Redis 7 State Store:** Backs dynamic mock state across clustered backend instances, utilizing key namespacing by runtime ID. Provides an in-memory fallback for local integration tests.
* **Apache Kafka 3.7 Pipeline:** Handles asynchronous batch mock dataset generation through `GenerationJob` event streaming, ensuring long-running data synthesis does not block HTTP threads.
* **PostgreSQL 16 Persistence:** Stores canonical contracts, version trees, scenario configurations, and user identity with transactional safety and Flyway migrations.

---

### 08 // DETERMINISTIC CONTRACT DRIFT DETECTION

As frontend and backend teams iterate, API specifications evolve. MockAPILab includes an automated **Contract Drift Analysis Engine** that computes structural diffs across contract versions:

```
[Contract Version A] ──┐
                       ├──► [Deterministic Drift Engine] ──► [Drift Report]
[Contract Version B] ──┘      • Cycle-safe schema traversal
                              • Normalized property comparison
                              • Breaking change classification
```

#### Classification Taxonomy

* **BREAKING:** Removal of endpoints, renamed fields, new required request parameters, tightened validation constraints, or altered response structures.
* **NON_BREAKING:** Addition of optional fields, new query parameters, or newly added endpoints.
* **INFORMATIONAL:** Description modifications, tag adjustments, or documentation updates.

---

### 09 // OBSERVABILITY, RESILIENCY & TESTING

MockAPILab implements production-grade backend observability and engineering safeguards:

* **Observability Matrix:** Distributed request tracing with correlation IDs (`X-Correlation-Id`), Spring Boot Actuator health and metrics endpoints, and Micrometer instrumentation.
* **Structured Error Envelopes:** Standardized RFC-7807 problem detail error responses preventing internal stack-trace leakage.
* **151 Automated Tests:** Extensive automated test coverage combining unit tests, MockMvc controller integration tests, Redis state tests, Kafka event pipelines, and end-to-end mock runtime workflows.

---

### 10 // ENGINEERING OUTCOMES

MockAPILab demonstrates production-grade backend software engineering:

* **Modern Distributed Architecture:** Clean Modular Monolith implementation in Java 21, Spring Boot 3.4, Spring Security, PostgreSQL, Redis, and Apache Kafka.
* **Robust State Management:** High-performance mutable state simulation with Redis and in-memory test decoupling.
* **Disciplined AI Integration:** Controlled LLM extraction with deterministic schema compiler validation.
* **Reliability & Developer Tooling:** Practical developer productivity system built to solve core distributed team coordination challenges.
