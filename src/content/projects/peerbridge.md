---
title: "PeerBridge Sync Pipeline"
status: "Beta Deployment"
tags: ["P2P Networks", "WebRTC", "Socket.io", "React"]
metrics:
  - label: "SIGNALING PROTOCOL"
    value: "Socket.io / WebRTC"
  - label: "SYNC LATENCY"
    value: "85 ms (LAN)"
  - label: "BACKEND"
    value: "Node.js / Express"
  - label: "CLIENT SDK"
    value: "JavaScript SDK"
---

### The Engineering Challenge

Sharing files and syncing text data across localized networks often relies on external cloud servers, which increases latency, wastes internet bandwidth, and introduces security vulnerabilities.

PeerBridge establishes direct peer-to-peer data channels. By bypassing intermediate cloud servers, users sync files and messages locally with minimum overhead.

---

### System Architecture

The software is structured as a pipeline with three decoupled boundaries:

1. **Signaling Server:** An Express and Socket.io application hosted in Node.js that coordinates peer registration, signaling SDP exchanges, and ICE candidates.
2. **P2P Data Channel:** Direct WebRTC RTCDataChannel instances created between peers for data exchange.
3. **Sync Client:** A React client interface that reports connection statistics and transfer progress.

```
[Peer Client A] <-> [Socket.io Signaling] <-> [Peer Client B]
      ^                                            ^
      └────────────── [WebRTC Data Channel] ────────┘
```

---

### Technical Obstacles & Debugging Logs

Symmetric NAT firewalls blocked direct peer-to-peer connections during external Internet connection tests, causing connection timeouts.

#### Isolation & Resolution
1. **STUN/TURN Fallback:** Configured standard Google STUN servers for NAT mapping, with a secure TURN server relay backup for symmetric NATs.
2. **Connection State Handlers:** Added explicit listeners on WebRTC connection states to automatically trigger reconnect retries on tunnel drop.
3. **Payload Chunking:** Implemented a binary chunking algorithm (16 KB payload limit) on the RTCDataChannel buffer to prevent socket overflows during file sync.

These optimizations successfully enabled peer synchronization across separate NAT networks.

---

### Prototype Limitations & Future Roadmap
* **Peer Limit:** Group channels scale poorly due to full-mesh connection overhead (each peer connecting to all other peers).
* **Identity Management:** Lacks decentralized public-key cryptography to verify peer identities without a signaling database.
* **Offline Store:** Local synchronization profiles are currently kept in-memory; need local database synchronization.
