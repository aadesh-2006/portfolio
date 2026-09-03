---
title: "AI Financial Research Analyst"
status: "PRODUCTION-ORIENTED / ENGINEERING PROJECT"
tags: ["Financial Intelligence", "AI", "Backend Systems", "Data Engineering", "Valuation"]
metrics:
  - label: "DATA SOURCES"
    value: "SEC EDGAR / yfinance / News"
  - label: "ANALYSIS"
    value: "Deterministic Engine"
  - label: "AI LAYER"
    value: "Grounded LLM Synthesis"
  - label: "BACKEND API"
    value: "FastAPI REST (/docs)"
  - label: "PERSISTENCE"
    value: "PostgreSQL 17 / Alembic"
  - label: "DEPLOYMENT"
    value: "Docker Compose / Nginx"
---

### The Engineering Challenge

Financial research requires combining heterogeneous sources such as regulatory filings, market data, and news while maintaining a clear distinction between observed data, model assumptions, calculated values, and qualitative interpretation.

The system was designed around a strict architectural principle: the **deterministic financial engine remains the single source of truth for all numerical analysis**, while the **LLM operates exclusively as a qualitative research synthesis layer**.

This prevents the language model from calculating financial values, inventing metrics, modifying valuation outputs, or fabricating citations.

---

### System Architecture

The end-to-end data and synthesis pipeline enforces rigorous boundary separation between quantitative data ingestion, deterministic mathematical modeling, context assembly, and grounded natural language generation:

```
[Stock Ticker]
      │
      ▼
[Data Orchestrator] ──► Ingests SEC EDGAR (5-Yr 10-K) + yfinance + News Sources
      │
      ▼
[Normalized CompanyData] ──► Pydantic Data Models & Type Validation
      │
      ▼
[Financial Analysis Engine] ──► Deterministic Math (Growth, Margins, Ratios, DCF/WACC, 2D Sensitivity)
      │
      ▼
[Research Context Builder] ──► 9-Section Briefing + Verified Source Provenance
      │
      ▼
[OpenAI Structured Outputs] ──► GPT-4o / GPT-4o-mini (Strict 11 Grounding Rules; Zero Math)
      │
      ▼
[ResearchReport Output] ──► Structured Thesis, Catalysts, Risks, DCF Interpretation, Citations
      │
      ▼
[FastAPI Service Layer] ──► REST Endpoints (/api/analyze, /api/research, /api/companies)
      │
      ▼
[PostgreSQL Persistence] ──► SQLAlchemy 2.x + Psycopg 3 + Alembic Migrations
```

#### Core Architecture Subsystems

1. **SEC EDGAR Ingestion:** Automated CIK ticker resolution, tag fallback matrix across US GAAP taxonomies, and 5-year 10-K statement flow extraction.
2. **yfinance Market Feed:** Live share price, market capitalization, beta, and comparative valuation multiples.
3. **News Ingestion Layer:** Aggregates real-time news headlines, publishers, timestamps, and article URLs (Yahoo Finance / Finnhub).
4. **Data Orchestration:** Concurrently dispatches upstream fetch jobs and handles upstream failures gracefully.
5. **Normalized CompanyData:** Standardizes heterogeneous financial inputs into strictly typed Pydantic models.
6. **Deterministic Financial Analysis Engine:** Pure programmatic computation of performance metrics, margins, leverage, returns, DCF, WACC, and financial health scores.
7. **Research Context Builder:** Assembles a structured 9-section briefing package containing verified analytical outputs and source citations.
8. **OpenAI Structured Outputs Layer:** LLM inference (GPT-4o / GPT-4o-mini) constrained by 11 explicit grounding guardrails; strictly forbidden from performing arithmetic.
9. **ResearchReport Schema:** Structured delivery of executive summary, investment thesis, key strengths, operational risks, market catalysts, DCF sensitivity commentary, and verifiable sources.
10. **FastAPI REST API:** Async endpoints for real-time analysis, full research generation, health checks, and company lookup with OpenAPI/Swagger documentation.
11. **PostgreSQL Persistence:** Normalized relational storage with Alembic schema versioning for auditability and historical tracking.

---

### Deterministic Financial Analysis

To eliminate numerical hallucination, all analytical calculations are executed programmatically by the deterministic financial engine:

* **Growth Dynamics:** Year-over-Year (YoY) revenue and earnings growth, 3-year Compound Annual Growth Rate (CAGR).
* **Profitability & Margins:** Gross margin, operating margin, EBITDA margin, net profit margin.
* **Return Metrics:** Return on Equity (ROE), Return on Assets (ROA), Return on Invested Capital (ROIC).
* **Leverage & Solvency:** Debt-to-Equity, Net Debt / EBITDA, interest coverage ratios.
* **Cash Flow & Capital Efficiency:** Operating cash flow, Free Cash Flow (FCF), cash flow conversion ratios.
* **Market Valuation Multiples:** Price-to-Sales (P/S), Price-to-Free-Cash-Flow (P/FCF), EV/EBITDA, Trailing & Forward P/E.
* **Financial Health Assessment:** Multi-factor scoring evaluating balance sheet robustness, liquidity, and operational stability.
* **Valuation Modeling:** Discounted Cash Flow (DCF), Weighted Average Cost of Capital (WACC), and 2-dimensional sensitivity analysis.

> [!IMPORTANT]
> All mathematical calculations are executed natively in Python using deterministic formulas. The LLM is never permitted to calculate, re-compute, or alter any numerical metric.

---

### Valuation Engine (DCF / WACC)

The system implements a deterministic Discounted Cash Flow (DCF) model paired with a Capital Asset Pricing Model (CAPM) based Weighted Average Cost of Capital (WACC) framework:

#### 1. Observed Inputs & Market Data
* Market Beta, current share price, diluted shares outstanding, total debt, total cash & short-term investments, and 5-year historical Free Cash Flow.

#### 2. Explicit Model Assumptions
* Risk-free rate ($R_f$), Equity Risk Premium (ERP), long-term terminal growth rate ($g$), and effective corporate tax rate ($t$).

#### 3. Programmatic Valuation Calculations
* **Cost of Equity:** $K_e = R_f + (\beta \times \text{ERP})$
* **Cost of Debt & Capital Weights:** Effective after-tax debt cost weighted alongside equity market capitalization.
* **WACC Computation:** Blended hurdle rate reflecting enterprise capital structure.
* **5-Year FCF Projections & Terminal Value:** Discrete projection discounting and Gordon Growth terminal valuation.
* **Enterprise & Equity Value:** Net debt bridge adjustment yielding model-implied equity value and fair share price.
* **2D Sensitivity Matrix:** 2-dimensional grid evaluating intrinsic value across varying WACC discount rates ($\pm 1.0\%$) and terminal growth rates ($\pm 0.5\%$).

#### 4. Sector-Specific Gating
* **Financial Institutions Gating:** For commercial banks, insurance providers, and asset managers, traditional DCF valuation is automatically gated as **Not Applicable (N/A)** due to non-standard debt/capital structures, preventing misleading intrinsic value estimates.
* **Intrinsic Value Classification:** DCF outputs are treated explicitly as model-implied reference benchmarks under stated assumptions, not speculative market forecasts.

---

### Grounded LLM Research Layer

The research synthesis layer bridges quantitative financial modeling with qualitative investment reasoning while enforcing uncompromising data integrity:

```
[VERIFIED FINANCIAL DATA] ──► [DETERMINISTIC ANALYSIS] ──► [STRUCTURED CONTEXT] ──► [LLM QUALITATIVE SYNTHESIS]
```

*(Contrasted against unsafe architectures: `DATA ──► LLM ──► CALCULATED NUMBERS`)*

#### The 11 Strict Grounding Safeguards

1. **Zero Invented Financial Numbers:** The LLM cannot introduce numerical values that do not exist within the structured context.
2. **Zero Financial Calculations:** Arithmetic, metric derivation, and ratio computations are strictly prohibited in prompts.
3. **Authoritative Deterministic Source:** Pre-computed metrics from the engine remain the sole authority.
4. **Explicit Handling of Unavailable Metrics:** Missing or unpopulated data points must be explicitly cited as unavailable rather than estimated.
5. **Rejection of Fabricated Citations:** References, news links, and filing dates must match ingested records exactly.
6. **Strict Information Classification:** Data points are distinctly categorized by provenance (10-K filing vs. market quote vs. news report).
7. **Model-Implied DCF Interpretation:** Valuation outputs are discussed as conditional mathematical outputs governed by assumptions.
8. **No Guaranteed Return Claims:** Prohibits speculative promotional language, price targets, or guaranteed return assertions.
9. **Mandatory Sensitivity Discussion:** Qualitative commentary must incorporate the 2D sensitivity matrix spread.
10. **Financial Sector Constraint Enforcement:** Adheres to sector-specific valuation gating rules.
11. **Institutional Research Tone:** Enforces objective, balanced, institutional-grade analytical tone.

---

### FastAPI Service Layer

The backend exposes a high-performance REST API built with FastAPI, complete with interactive OpenAPI/Swagger documentation accessible at `/docs`:

* `GET /api/health` — Service health verification and database connectivity check.
* `POST /api/analyze` — Dispatches multi-source ingestion and executes deterministic financial analysis.
* `POST /api/research` — Coordinates complete ingestion, deterministic analysis, context assembly, and grounded LLM report generation.
* `GET /api/companies` — Lists indexed companies and coverage status.
* `GET /api/companies/{ticker}/analyses` — Retrieves historical deterministic analysis snapshots chronologically.
* `GET /api/companies/{ticker}/research` — Fetches historical research reports and qualitative syntheses for a company.

#### Resiliency & Error Handling
The API implements standardized, sanitized JSON error responses for malformed ticker queries, missing environment credentials, upstream provider timeouts, rate-limit throttling, and internal service exceptions.

---

### Persistence & Historical Analysis

Data persistence is managed through PostgreSQL 17 utilizing **SQLAlchemy 2.x** declarative models and **Psycopg 3** with schema evolution governed by **Alembic migrations**:

* **`companies`:** Master registry of tracked corporate entities, CIK mappings, tickers, and sector classifications.
* **`analysis_snapshots`:** Immutable historical records of deterministic financial metrics, ratio evaluations, and DCF calculations.
* **`research_reports`:** Stored structured qualitative research dossiers with generated theses, strengths, catalysts, and risk factors.
* **`research_sources`:** Traceable provenance linking specific report sections to raw SEC filings, market quotes, and news timestamps.

Chronological history endpoints enable retrospective auditing of how financial health, intrinsic valuation, and qualitative outlook have evolved over time.

---

### Reliability & Production Hardening

* **SEC EDGAR Retries:** Bounded exponential backoff with jitter to comply with SEC rate limits (10 requests/second) and handle transient network hiccups.
* **OpenAI Resilience:** Automatic retry wrappers handling transient API rate limits (HTTP 429) and upstream gateway timeouts (HTTP 5xx).
* **Database Rollback Safety:** Atomic transaction boundaries ensuring automatic rollback upon unexpected pipeline exceptions.
* **Input Validation:** Strict Pydantic schemas validating ticker symbol formats and numerical boundary constraints.
* **Sensitive Data Scrubbing:** Automated masking filters ensuring API keys, database passwords, and authorization tokens are scrubbed from application logs.
* **Sanitized Responses:** Internal stack traces and database error internals are suppressed in production API error payloads.

---

### Containerized Deployment

The platform is designed as an isolated multi-container architecture orchestrated via Docker Compose:

```
[User Browser]
      │
      ▼
[Frontend: React + Vite + Nginx]
      │
      ▼  (Proxy /api requests)
[Backend: FastAPI + Python 3.12]
      │
      ├──► [PostgreSQL 17 Database] (Auto-executes Alembic migrations on startup)
      │
      └──► [External Services] (SEC EDGAR API, yfinance API, OpenAI API)
```

* **Multi-Stage Dockerfiles:** Minified production images for both frontend (Nginx alpine) and backend (Python 3.12 slim).
* **Automated Migrations:** Backend container startup scripts automatically verify database readiness and execute `alembic upgrade head`.
* **Runtime Verification Note:** Container configurations follow standard multi-stage patterns; local Docker CLI/daemon runtime execution was unverified on the Windows development workstation.

---

### Verification & Automated Testing

The codebase includes an extensive automated test suite covering unit calculations, integration flows, and end-to-end service layers:

* **Backend Test Suite:** **105 automated tests** validating deterministic math formulas, SEC parser edge cases, valuation algorithms, guardrail compliance, and FastAPI endpoints.
* **Frontend Test Suite:** **29 automated tests** verifying UI rendering, Recharts financial data visualization, navigation state, and form interactions.
* **Build Validation:** Production bundle compilation validated cleanly via `tsc -b && vite build`.

---

### Engineering Milestones

The project was engineered through structured, iterative development milestones:

* **Milestone 0:** Environment inspection, architecture blueprint, relational schema design.
* **Milestone 1:** SEC EDGAR, yfinance, and news data ingestion pipelines + Pydantic normalization.
* **Milestone 2:** Deterministic financial analysis engine (growth, margins, leverage, cash flow, multiples).
* **Milestone 3:** Valuation engine (DCF, CAPM/WACC, terminal value, 2D sensitivity grid, sector gating).
* **Milestone 4:** Grounded LLM research layer with 11 strict grounding guardrails and structured outputs.
* **Milestone 5:** FastAPI backend service layer with async endpoints, validation, and `/docs` Swagger.
* **Milestone 6:** React + TypeScript + Tailwind CSS dashboard with interactive Recharts visualizations.
* **Milestone 7:** PostgreSQL persistence layer, SQLAlchemy 2.x models, Alembic migrations, and chronological history API.
* **Milestone 8:** Reliability controls, retry policies, sensitive credential masking, and production hardening.
* **Milestone 9:** Multi-stage Docker containerization, Nginx proxy configuration, and deployment orchestration.
