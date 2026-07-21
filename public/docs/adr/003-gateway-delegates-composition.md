# ADR-003: Gateway Never Assembles Entities

**Status:** Accepted  
**Date:** 2026-07-21  
**Deciders:** Nirmal (Founder)

---

## Context

The gateway (BFF) previously contained inline composition logic: parallel service binding calls, D1 queries, and response assembly. This duplicated composition logic that should live in the Projection Engine.

## Decision

The gateway **never constructs SharedWorkbench directly**. It delegates all composition to `ProjectionEngine` methods. The gateway handles only:

1. Authentication and session resolution
2. Request routing
3. Response formatting and CORS
4. Rate limiting

## Consequences

- **Positive:** Gateway is thin and focused. Composition logic is testable in isolation. No duplicate assembly code.
- **Negative:** Gateway becomes a pass-through for composition requests. Adds one function call layer.
- **Mitigation:** Performance is acceptable because composition is in-process (same worker), not a network hop.

## Evidence

- `services/gateway/src/projections.ts` — `routeProjectionRequest()` delegates to `ProjectionEngine`
- Before: inline `Promise.allSettled()` with 4+ service binding calls per endpoint
- After: single `engine.compose(request)` call per endpoint
