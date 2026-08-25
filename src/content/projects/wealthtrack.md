---
title: "WealthTrack Investment & Finance Platform"
status: "In Development / Active Engineering"
tags: ["MERN Stack", "Groww API", "MongoDB", "Express.js", "React", "Node.js"]
metrics:
  - label: "SYNC SYSTEM"
    value: "Groww API Sync"
  - label: "ARCHITECTURE"
    value: "MERN Decoupled"
  - label: "P&L ENGINE"
    value: "Real-Time Tracking"
  - label: "DATA SECURITY"
    value: "Private User Ledger"
---

### The Engineering Challenge

Managing personal finances and stock market investments often requires juggling fragmented portals, static spreadsheets, and broker reports. Investors face difficulty tracking consolidated portfolio valuations, calculating accurate realized versus unrealized gains, and understanding true net returns across multiple holding periods.

WealthTrack was conceived to unify personal finance tracking and equity portfolio management into a single, high-performance command console. The core engineering philosophy is simple: **"Transaction once → portfolio automatically tracks and updates using current market data."**

---

### System Architecture & Pipeline

WealthTrack utilizes a decoupled MERN (MongoDB, Express, React, Node.js) architecture designed for low-latency transaction processing and automated market synchronization:

1. **Transaction & Ledger Engine:** An immutable transaction log that stores purchase records, buy/sell executions, dividend payouts, and regular expense records.
2. **Groww API Integration Service:** A background synchronization worker that interacts with the Groww API to fetch real-time market prices, holdings snapshots, and executed trade data.
3. **Valuation & P&L Calculator:** A computation module that aggregates transactions to compute invested capital, current valuation, realized P&L, unrealized P&L, return percentages, and holding duration.
4. **Interactive React Command Dashboard:** A dark-themed UI that visualizes asset allocation, stock-wise performance, and historical portfolio growth curves.

```
[User Transaction / Trade Import] -> [Express API Gateway] -> [Groww API Price Engine] -> [MongoDB Ledger Database] -> [React Portfolio Dashboard]
```

---

### Key Capabilities & Data Flow

* **Automated Portfolio Tracking:** Computes net portfolio valuation, total invested amount, profit/loss margins, and asset allocation percentages on the fly.
* **Trade Synchronization:** Integrates with broker APIs (Groww) to synchronize holdings and trade history with live market rates.
* **Cashflow & Expense Tracking:** Combines investment analytics with daily income and expense categorization.
* **Granular Filtering & Audit:** Enables rapid search, multi-criteria filtering, and historical time-series breakdown of past transactions.

---

### Current Status & Roadmap

WealthTrack is actively in development. Ongoing engineering milestones include:
* Completing automated broker session token management and background polling.
* Optimizing MongoDB aggregation pipelines for instant computation across extensive multi-year transaction ledgers.
* Implementing advanced asset rebalancing alerts and tax-harvesting estimation metrics.
