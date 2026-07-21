# Execution Constitution

Status: CANONICAL
Scope: Execution lifecycle, plan compilation, adapter dispatch, rollback, side effects, and sync.
Canonical Owner: IntegrateWise Platform
Last Verified: 2026-07-20

---

## 1. Purpose

This document defines how IntegrateWise executes governed capabilities.

Execution commits canonical state first. Sync is independent.

---

## 2. Lifecycle

```text
User Initiates Capability
        │
        ▼
Gate 1: Pre-Proposal
        │
        ▼
Pending Approval
        │
        ▼
User Approves
        │
        ▼
Gate 2: Execution
        │
        ▼
Spine Sync
        │
        ▼
Projection Refresh
```

---

## 3. Execution Plan

```typescript
interface ExecutionPlan {
  id: string;
  tenant: string;
  proposal: string;
  confidence: number;
  evidence: Evidence[];
  context: ExecutionContext;
  steps: ExecutionStep[];
  governance: GovernanceRecord;
  outcome?: ExecutionOutcome;
}
```

---

## 4. Step Contract

```typescript
interface ExecutionStep {
  capability: CapabilityId;
  adapter: AdapterId;
  params: Record<string, unknown>;
  rollback: CapabilityId | null;
}
```

---

## 5. Adapter Dispatch

1. Resolve adapter by capability and configured providers.
2. Prefer live adapter when healthy; fallback to mock when unavailable.
3. Execute step with timeout and retry policy.
4. Emit timeline event for every step.
5. On failure, execute rollback step if defined.

---

## 6. Side Effects

- Timeline entry
- Notification
- Evidence record
- Memory promotion candidate

---

## 7. Sync Behavior

- Sync is asynchronous.
- Sync failures do not invalidate execution success.
- Sync status is surfaced explicitly.
- Retry uses exponential backoff.

---

## 8. Invariants

1. Execution never writes directly to external systems before Spine commit.
2. Every execution plan is immutable after approval.
3. Every step has a defined rollback path.
4. Every execution emits an outcome event.
