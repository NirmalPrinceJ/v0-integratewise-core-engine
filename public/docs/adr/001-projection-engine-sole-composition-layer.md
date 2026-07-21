# ADR-001: Projection Engine is the Sole Composition Layer

**Status:** Accepted  
**Date:** 2026-07-21  
**Deciders:** Nirmal (Founder)

---

## Context

The IntegrateWise platform has multiple services that read from the Adaptive Spine: gateway, twin-orchestrator, intelligence, workflow. Without a single composition point, each service would construct its own view of the workbench, leading to inconsistent projections and duplicated logic.

## Decision

The `@integratewise/projection-engine` package is the **sole component** that produces a `SharedWorkbench`. No other package, service, or route handler may construct this shape.

The gateway (BFF) delegates all composition to `ProjectionEngine.compose()`. It handles auth, routing, and response formatting — but never assembles entities, relationships, or capabilities directly.

## Consequences

- **Positive:** Single source of truth for workbench composition. Consistent output shape across all consumers. Easier to test and reason about.
- **Negative:** All composition logic lives in one package. Changes to composition affect all consumers simultaneously.
- **Mitigation:** Versioned contract (`contracts/shared-workbench/v1.ts`). Breaking changes require version bump and ADR.

## Evidence

- `packages/projection-engine/src/projection-engine.ts` — `compose()`, `morningContext()`, `entity360()`, `inbox()`
- `services/gateway/src/projections.ts` — delegates to `ProjectionEngine`
- `contracts/shared-workbench/v1.ts` — frozen contract
