# ADR-002: SharedWorkbench is the Sole Composed Output

**Status:** Accepted  
**Date:** 2026-07-21  
**Deciders:** Nirmal (Founder)

---

## Context

Multiple downstream consumers (web app, twin runtime, capability fabric) need a unified view of workspace state. Without a single output type, each consumer would define its own shape, leading to type drift and inconsistent data.

## Decision

`SharedWorkbench` (defined in `contracts/shared-workbench/v1.ts`) is the **sole output type** of the Projection Engine. Every downstream consumer imports this contract. No consumer may define its own workbench shape.

## Consequences

- **Positive:** Type-safe contracts across the entire stack. Consumers know exactly what data is available.
- **Negative:** Adding fields to SharedWorkbench requires version bump. Consumers may receive fields they don't use.
- **Mitigation:** Optional fields (`user?`, `metadata?`). Versioned contract with changelog.

## Evidence

- `contracts/shared-workbench/v1.ts` — frozen contract
- `contracts/shared-workbench/schema.json` — JSON Schema validation
- `contracts/shared-workbench/CHANGELOG.md` — version history
