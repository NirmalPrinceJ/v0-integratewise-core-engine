# Architecture Overview

This page gives developers and partners a compact but practical view of IntegrateWise platform architecture. It is not a marketing summary. It is oriented around integration points, ownership boundaries, runtime behavior, and operational expectations.

For the complete canonical platform specification, see:

- `docs/spec/INTEGRATEWISE_CANONICAL_SPEC_v1.0.md`
- `docs/architecture/PRODUCT_ARCHITECTURE.md`
- `docs/architecture/WORKBENCH_DOCTRINE.md`
- `docs/architecture/SPINE_MODEL.md`

## High-level architecture

IntegrateWise has three major responsibilities:

- Assemble permitted operational context across connected systems.
- Provide a governed execution and continuity loop.
- Present role-aware Workbench surfaces without leaking raw provider complexity to users.

The platform achieves this through a contract-driven runtime stack with strict separation between internal state, provider adapters, AI connectors, governance, execution, and presentation.

## Key invariants

These are non-negotiable platform rules:

- Adaptive Spine owns canonical operational truth.
- No model owns canonical truth.
- No agent writes directly to the Spine.
- Product code never imports provider SDKs directly.
- No external provider owns an architectural boundary.
- Twin proposes; the user approves; Hermes coordinates execution when authorized.
- Execution and synchronization are independent modes.
- Confidence never grants authority.
- Every consequential action is logged with actor, authority, evidence, execution-plan version, approval record, provider outcome, sync result, and a tamper-proof audit event.

## Integration-facing architecture

For developers and partners, the most practical architectural rule is the swappable provider resolution pipeline:

```text
Plane -> Contract -> Configuration Binding -> Provider Registry -> Adapter -> Provider
```

This means you do not integrate against a hardcoded provider interface. You integrate against a contract. The Configuration Manager resolves the concrete adapter. The Provider Registry manages lifecycle, health, and failover. The adapter owns authentication, serialization, retries, and vendor error mapping.

## Connectivity surface

The platform preserves four distinct connectivity paths:

- REST/GraphQL
- Webhooks
- MCP
- Database/queue

These four paths are first-class and non-interchangeable. Each path has its own contract, auth model, capability registry, and boundary conditions.

## Data continuity architecture

Operational continuity flows through three load modes:

- Creamy Load: deep initial hydration.
- Delta Load: recurring time-window change absorption.
- Streaming Load: real-time event ingestion.

All three paths feed into the Adaptive Spine. Spine truth is promoted, not assumed. Provider success is not automatically canonical truth. Sync reconciles state. Promotion decides whether resolved state becomes canonical.

## Execution architecture

Execution follows a governed contract chain:

- Pre-Proposal Governance evaluates authority, scope, and policy.
- Plan Builder compiles an immutable ExecutionPlan.
- Post-Proposal Governance evaluates risk, evidence, confidence, and approval requirement.
- The user approves when required.
- Hermes coordinates execution through runtime adapters.
- Sync reconciles provider state.
- Outcome and promotion evaluate whether resulting state becomes canonical.

For external customers, the handoff layer replaces native execution. Execution happens in the customer environment, and outcomes are ingested back into IntegrateWise.

## Security and tenant boundaries

Multi-tenant isolation is enforced at the Provider Fabric layer. Tenant-specific workloads should assume:

- tenant-scoped execution contexts.
- workspace-scoped queries and permissions.
- secrets resolved just-in-time and never persisted in configuration.
- provider credential rotation without customer-visible downtime.

## Observability expectations

Operators and partners should expect:

- correlation IDs at the edge.
- structured audit events for every consequential action.
- provider health and degradation states exposed through registry telemetry.
- execution tracking by approval token, proposal, plan version, and outcome event.

These are not optional for production integrations.
