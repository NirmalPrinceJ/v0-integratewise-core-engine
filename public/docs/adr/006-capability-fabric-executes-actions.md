# ADR-006: Capability Fabric Executes Actions

**Status:** Accepted  
**Date:** 2026-07-21  
**Deciders:** Nirmal (Founder)

---

## Context

Actions (create task, send email, update record) need a consistent execution path. If actions execute through ad-hoc service calls, governance and audit become impossible.

## Decision

The **Capability Fabric** is the exclusive execution path for all workspace actions. When a user or Twin triggers an action, it flows through:

1. Governance evaluation (allowed/approval_required/denied)
2. Capability Fabric execution (tool routing, agent routing, MCP routing)
3. Outcome written back to Spine by Loader Runtime

Capabilities never mutate the Spine directly. They go through governed write paths.

## Consequences

- **Positive:** All actions are governance-evaluated and auditable. Single execution path.
- **Negative:** Adds a routing layer for all actions. May introduce latency for simple operations.
- **Mitigation:** Capability Fabric supports fast-path for low-risk actions (auto-approved).

## Evidence

- `packages/projection-engine/src/evaluators/governance-evaluator.ts` — governance gate
- `packages/projection-engine/src/resolvers/capability-resolver.ts` — capability resolution
- `contracts/shared-workbench/v1.ts` — `actions`, `governance` fields
