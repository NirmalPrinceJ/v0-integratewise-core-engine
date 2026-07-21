# Canonical Architecture v4.1.0

Status: CURRENT
Scope: IntegrateWise runtime boundaries, communication hierarchy, capability/execution/sync separation
Canonical Owner: IntegrateWise Platform
Last Verified: 2026-07-20
Evidence Basis: Product doctrine v4.1.0, existing Gateway/Spine code, Cloudflare runtime substrate

## 1. CORE PRINCIPLE

The Spine is the canonical runtime substrate. Internal communication must not be implemented as a chain of HTTP microservice calls. Cloudflare Workers, D1, KV, R2, Queues, and Durable Objects are first-class primitives; use them directly.

## 2. COMMUNICATION HIERARCHY

| Priority | Mechanism                | Use When                                                        |
| -------- | ------------------------ | --------------------------------------------------------------- |
| 1        | In-process function call | Logic lives in the same Worker/module                           |
| 2        | Repository access        | Reading/writing shared state (D1/KV/R2/DO)                      |
| 3        | Service binding          | Invoking another Worker that owns a distinct runtime capability |
| 4        | Queue                    | Background or long-running work, retries, async propagation     |
| 5        | External HTTP            | Browser ↔ Gateway, SaaS APIs, webhooks, public APIs only        |

Anti-pattern: chaining internal APIs through HTTP for operations that could use repositories or service bindings.

## 3. RUNTIME LAYERS

```text
User
  │
  ▼
Projection              ← UI never consumes raw API responses
  │
  ▼
Capability Layer        ← declarative: what can be done
  │
  ▼
Execution Layer         ← imperative: how it is performed, governed, committed
  │
  ▼
Sync Layer              ← async: how the rest of the world converges
  │
  ▼
Spine / Memory / Intelligence / Governance
```

### 3.1 Capability Layer

Capabilities are declarative contracts. They declare:

- Input/output shapes
- Required permissions/scopes
- Policy requirements
- Approval requirements
- UI metadata
- Audit requirements

They do not implement execution logic.

### 3.2 Execution Layer

Execution is the runtime. When a capability is invoked:

1. Validate intent and inputs
2. Load context
3. Run governance gates
4. Execute steps
5. Emit events
6. Return result

Execution commits canonical state first. Sync is independent.

### 3.3 Sync Layer

Sync detects committed changes and propagates them to external/internal targets asynchronously. Failures in sync do not invalidate successful execution.

## 4. GOVERNANCE: TWO-GATE MODEL

```text
Capability Invocation
  │
  ▼
Gate 1: Pre-Proposal Evaluation
  - role/scopes/allowlists/denylists
  - Output: ALLOW_PROCEED | DENY | REQUIRE_PRE_APPROVAL
  │
  ▼
Twin Processing / Execution Plan Generation
  │
  ▼
Gate 2: Post-Proposal Evaluation
  - risk scoring, evidence linking, confidence floors
  - Output: AUTO_APPROVE | REQUIRE_HUMAN_APPROVAL | DENY
```

Both gates are enforced in the Execution Layer. The UI only emits intent.

## 5. UI BOUNDARY

```text
User
  │
  ▼
Gateway API           ← only HTTP boundary the UI crosses
  │
  ▼
Projection Layer     ← stable contract consumed by React
  │
  ▼
Capability/Execution/Sync
```

Rules:

- UI components must not call raw databases
- UI components must not bypass the Gateway for mutations
- Projections must be swappable by changing the adapter, not the component

## 6. EVENT FLOW

```text
Capability
  │
  ▼
Execution
  │
  ▼
Spine Commit
  │
  ▼
Event Bus
  ├── Sync Engine
  ├── Projection Engine
  ├── Intelligence Engine
  ├── Notification Engine
  ├── Automation Engine
  └── Analytics Engine
```

Everything after Spine commit is event-driven.

## 7. IMPLEMENTATION BOUNDARIES IN REPO

- Gateway: orchestration, auth, routing, capability registry front-door
- Spine: canonical state in D1 + KV + DO primitives
- Pipeline: ingress/normalization/staging path
- Web app: projection consumers only; no direct infra imports

## 8. MIGRATION RULES

- Do not introduce new public HTTP routes between internal Workers without explicit naming
- Prefer adding modules under `services/gateway/src/{capabilities,execution,sync}` over expanding `workspace-spine.ts`
- UI changes must go through projection contracts in `apps/web/src/projections/`
