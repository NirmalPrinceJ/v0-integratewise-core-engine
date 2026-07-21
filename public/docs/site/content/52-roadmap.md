# Roadmap

This page captures the current platform progress and likely near-term direction from canonical docs. It is not a marketing commitment timeline.

For canonical state, see:

- `docs/CANONICAL_STATE.md`
- `docs/README.md`
- `docs/architecture/PRODUCT_ARCHITECTURE.md`
- `docs/spec/INTEGRATEWISE_CANONICAL_SPEC_v1.0.md`

## Platform maturity themes

- L0 onboarding and tenant hydration are solid for Customer Zero.
- L1 Workbench is the primary operational surface with domain-aware projections.
- L2, L3, L4 surfaces are functional and continue to mature.
- Governance, approvals, audit, and execution surfaces are active inside Customer Zero.
- Handoff layer, outcome ingestion, and external customer dispatch flows are targeted and advancing.

## External customer priorities

- Approval Center and Handoff Layer remain major external customer enablers.
- Adapter implementations for JSON, MCP, Hermes, OpenClaw, n8n, and other targets need completion.
- Outcome ingestion webhook contracts need stabilized implementation.
- Async state machine behavior needs consistent operator and partner documentation.

## Architectural guardrails for roadmap items

Any new capability must preserve:

- Workbench-first composition.
- four-button interaction grammar.
- four distinct connection paths.
- hard separation between Activation Bridge and Continuity Bridge.
- Creamy, Delta, and Streaming Load semantics.
- Spine Networking as governed context topology, not an ESB.
- state ownership boundaries.
- two-gate governance.
- ExecutionPlan as the approval target.
- promotion as the only path to canonical truth after execution.

## Documentation direction

This docs site should grow with:

- API versioning and breaking-change policy
- example handoff contracts per adapter target
- partner integration tests and verification scripts
- partner SLA and escalation guidance
- tenant isolation best practices for SaaS builders
- organization readiness criteria before enabling writeback or execution paths

Do not add roadmap claims that contradict canonical state. If a capability is marked as target or partial in canon, this roadmap should reflect that state.
