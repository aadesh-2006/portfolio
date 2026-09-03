---
title: "CodeSpeed"
status: "FULL-STACK PLATFORM / ACTIVE"
tags: ["Developer Tooling", "React 19", "Node.js", "Express", "MongoDB", "JWT", "MERN"]
metrics:
  - label: "SNIPPET CORPUS"
    value: "72 Curated Snippets"
  - label: "LANGUAGES"
    value: "8 Syntax Engines"
  - label: "TYPING ENGINE"
    value: "Character-Level Precision"
  - label: "TEST RUNNER"
    value: "node:test / In-Memory Mongo"
  - label: "AUTH ENGINE"
    value: "JWT + bcryptjs"
  - label: "STACK"
    value: "React 19 / Express / MongoDB"
---

### Project Overview

**CodeSpeed** is a developer-centric typing speed and accuracy platform built specifically for programmers. Unlike traditional typing platforms that benchmark user speed against natural language prose or randomized vocabulary, CodeSpeed measures typing proficiency against real-world programming code snippets, syntax constructs, bracket balancing, operators, and indentation patterns.

The platform provides developers with realistic typing challenges across multiple languages, tracks quantitative performance trajectories over time, enforces anti-tamper validation on submitted runs, and offers customizable practice and ranked competitive modes.

---

### The Engineering Problem

Standard typing tests evaluate linear alphanumeric text entry (e.g., words separated by spaces). In real-world software engineering, however, typing mechanics involve a completely different cognitive and physical distribution:

* **High Symbol Density:** Frequent usage of non-alphanumeric characters (`{}`, `[]`, `()`, `=>`, `&&`, `||`, `!=`, `;`, `->`, `::`).
* **Indentation & Whitespace Awareness:** Managing tabs, spaces, multi-line indentation hierarchies, and newline characters.
* **Mixed-Case Identifiers:** Rapid switching between `camelCase`, `snake_case`, `SCREAMING_SNAKE_CASE`, and `PascalCase`.
* **Structural Error Penalties:** A single misplaced punctuation mark or unmatched delimiter in code breaks syntax parsing, making character-level precision far more critical than loose prose speed.

CodeSpeed was engineered to solve this discrepancy by creating a custom code-aware typing engine with character-level accuracy scoring, custom Tab indentation handling, and real-world syntax snippets.

---

### System Architecture

CodeSpeed is structured as a decoupled full-stack architecture with a lightweight, high-performance React 19 client and a resilient Node.js / Express / MongoDB backend:

```
[Developer Browser]
      │
      ▼
[React 19 + Vite Client] ──► Custom Vanilla CSS Theme & Token State (localStorage)
      │
      ▼
[Interactive Typing Engine]
      ├──► Snippet Selector (Randomized, Immediate-Repeat Avoidance)
      ├──► Character-Level Diff Engine (Correct / Incorrect / Remaining)
      ├──► Timer Subsystem (30s, 1m, 2m, 3m, 4m, 5m, 10m)
      ├──► Real-Time WPM Math (5 chars = 1 word standard)
      └──► Real-Time Accuracy Formula ((Correct / Total) * 100)
      │
      ▼ (Client API Service + JWT Bearer Header)
[Node.js + Express REST API]
      ├──► Authentication Controller (JWT Validation, bcryptjs)
      ├──► Anti-Tamper Performance Verification Middleware
      ├──► Ranking & Milestone Badges Processor
      └──► Profile Privacy & Sharing Manager
      │
      ▼ (Mongoose ODM)
[MongoDB Database] ──► Users & Immutable Performance Records
```

---

### Interactive Typing Engine

The core client typing engine handles real-time keyboard inputs with sub-millisecond responsiveness:

#### 1. Character-Level Comparison & Indentation
* Evaluates keystrokes on a character-by-character basis, applying visual feedback for correct characters, syntax errors, and active cursor positioning.
* Intercepts `Tab` key events to prevent browser focus loss, inserting consistent custom indentation matching code snippet conventions.

#### 2. Deterministic Metric Formulations
* **Words Per Minute (WPM):**
  $$\text{WPM} = \frac{\text{correctCharacters} / 5}{\text{elapsedMinutes}}$$
  * *Rules:* Standardized at 5 characters per word. Only correctly typed characters contribute to WPM. Division-by-zero on initial tick is handled safely. Output is rounded to the nearest whole number.
* **Typing Accuracy:**
  $$\text{Accuracy} = \left(\frac{\text{correctCharacters}}{\text{totalTypedCharacters}}\right) \times 100$$
  * *Rules:* Output is rounded to 1 decimal place. Safely returns $0.0\%$ when no characters have been typed.

#### 3. Configurable Timers
* Supports discrete timer intervals: **30 seconds, 1 minute, 2 minutes, 3 minutes, 4 minutes, 5 minutes, and 10 minutes**, accommodating both short sprint tests and extended endurance benchmarks.

---

### Curated 72-Snippet System

The platform features an indexed corpus of **72 curated, realistic programming snippets**:

* **8 Supported Languages:** JavaScript, Python, Java, C++, C, HTML, CSS, SQL.
* **3 Structured Difficulty Tiers:** Easy (basic control flow & syntax), Medium (algorithms & data structures), Hard (concurrency, complex queries & design patterns).
* **Taxonomy & Balance:** Exactly $8\text{ Languages} \times 3\text{ Difficulties} \times 3\text{ Snippets} = 72\text{ Total Snippets}$.
* **Selection Algorithm:** Randomized selection with immediate-repeat avoidance logic and robust fallback handling to prevent duplicate tests back-to-back.

---

### Authentication & Security Architecture

* **Zero-Secrets Policy:** Environment variables managed through `.env` with `.env.example` templates; sensitive keys excluded from version control.
* **Cryptographic Password Security:** User passwords hashed via **bcryptjs** with cryptographic salts prior to storage; `passwordHash` is stripped from all API outputs and JWT token payloads.
* **JWT Stateless Authentication:** Stateless session tokens signed with JSON Web Tokens, validated via express middleware across protected routes.
* **Anti-Tamper Performance Validation:** Backend checks submitted WPM, accuracy, time elapsed, and character counts against theoretical mathematical boundaries to prevent artificial performance injection.
* **Granular Privacy Controls:** Configurable user privacy toggle (`PATCH /api/auth/privacy`) enabling users to selectively keep practice session metrics private while sharing ranked milestones.

---

### Ranked Performance & Analytics Subsystem

* **Dual Operational Modes:**
  * **Practice Mode:** Low-stakes sandbox for warmup, snippet exploration, and muscle memory training without impacting competitive standing.
  * **Ranked Mode:** Competitive environment recording verified benchmark sessions to user profiles.
* **WPM Progression Visualization:** Chronological progression graphs rendering historical WPM and accuracy trajectories.
* **Aggregated Performance Metrics:** Lifetime statistics including average WPM, peak WPM, total tests completed, aggregate typing time, and streak progress.
* **Milestone Badges:** Automatically unlocked achievement tiers recognizing speed thresholds, language versatility, and consistent daily streaks.
* **Public Shareable Profiles:** Unique user profiles (`/api/users/:username/profile`) displaying public stats, earned badges, and language distribution.

---

### REST API Service Layer

The Express backend provides clean, RESTful public and protected routes:

#### Public Endpoints
* `GET /api/health` — Service health check and database connectivity verification.
* `POST /api/auth/signup` — Registers a new user account with validated credentials.
* `POST /api/auth/login` — Authenticates user credentials and returns a signed JWT.
* `GET /api/users/:username/profile` — Retrieves public statistics and badge showcase for a user.

#### Protected Endpoints (JWT Required)
* `GET /api/auth/me` — Fetches current authenticated user profile and privacy settings.
* `PATCH /api/auth/privacy` — Updates user profile visibility and practice data privacy toggles.
* `POST /api/performances` — Submits, validates, and records a completed typing performance.
* `GET /api/performances` — Fetches paginated performance history for the authenticated user.
* `GET /api/performances/graph` — Retrieves chronological data points formatted for WPM progression charts.
* `GET /api/performances/summary` — Returns aggregate metrics (average WPM, peak WPM, total tests, streak).
* `GET /api/performances/badges` — Computes and returns earned ranked milestone badges.

---

### Verification & Automated Testing

The codebase maintains rigorous automated test coverage across both frontend and backend domains:

* **Backend Integration Suite:** Executed using the **Node.js native test runner** (`node:test`, `node:assert`) paired with **`mongodb-memory-server`** for isolated, zero-mock database integration testing.
* **Frontend Unit Suite:** Comprehensive unit testing verifying exact WPM formula execution, accuracy edge cases (empty strings, division-by-zero), and character comparison diffing.
* **Production Build Validation:** Verified clean compilation via Vite client build.

---

### Engineering Takeaways

* **Domain-Specific UX Engineering:** Tailoring typing interaction to handle indentation, punctuation, and multi-line code constructs creates genuine developer utility over generic prose platforms.
* **Anti-Tamper Boundary Validation:** Verifying client-calculated metrics on the server prevents fabricated score submission while maintaining responsive client-side UI calculation.
* **In-Memory Integration Testing:** Utilizing `mongodb-memory-server` with Node's native test runner eliminates external test database dependencies, ensuring fast, deterministic CI pipeline execution.
