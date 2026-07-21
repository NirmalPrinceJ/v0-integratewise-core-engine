# ADR-004: Loader Runtime is the Only Canonical Writer

**Status:** Accepted  
**Date:** 2026-07-21  
**Deciders:** Nirmal (Founder)

---

## Context

The Adaptive Spine is the canonical operational store. If multiple services write to it directly, data consistency and audit trails become impossible to maintain.

## Decision

The **Loader Runtime** (connector → connector-sync → pipeline) is the **only path** for writing canonical operational entities to the Adaptive Spine. No other service, agent, or package may write directly to Spine tables.

Write path:

```
External System → Webhook/Polling → Connector → Pipeline → Spine (append-only)
```

## Consequences

- **Positive:** Single write path enables consistent audit trails, conflict resolution, and data lineage.
- **Negative:** All data ingestion must go through the Loader. Cannot write directly for quick fixes.
- **Mitigation:** Loader supports batch operations and priority queues for urgent writes.

## Evidence

- `services/connector/` — OAuth, API key, webhook adapters
- `services/connector-sync/` — Sync scheduling
- `services/pipeline/src/canonical/canonical-writer.ts` — sole Spine writer
