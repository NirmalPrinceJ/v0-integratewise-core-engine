# ADR-007: Governance is Consulted During Composition and Enforced During Execution

**Status:** Accepted  
**Date:** 2026-07-21  
**Deciders:** Nirmal (Founder)

---

## Context

Governance (RBAC, policy, approval) needs to apply at two points: when composing the workbench (what the user sees) and when executing actions (what the user does). If governance only applies at execution, users see actions they can't perform.

## Decision

Governance applies at **two gates**:

1. **Composition gate:** Projection Engine evaluates governance for each capability when composing SharedWorkbench. The `governance` field tells the frontend which actions are allowed, which need approval, and which are denied.

2. **Execution gate:** Capability Fabric re-evaluates governance before executing any action. This prevents TOCTOU (time-of-check-time-of-use) issues where policy changes between composition and execution.

## Consequences

- **Positive:** Users see accurate action availability. No surprise denials at execution time. Double-gated security.
- **Negative:** Governance evaluation runs twice (compose + execute). Adds latency.
- **Mitigation:** Composition gate uses cached policy. Execution gate uses fresh policy. Cache TTL is short (30s).

## Evidence

- `packages/projection-engine/src/evaluators/governance-evaluator.ts` — composition gate
- `services/intelligence/src/govern.ts` — execution gate
- `contracts/shared-workbench/v1.ts` — `governance` field in SharedWorkbench
