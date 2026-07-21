# Twin Constitution

Status: CANONICAL
Scope: Twin runtime behavior, OODA loop, context binding, memory, learning, and proposal grammar.
Canonical Owner: IntegrateWise Platform
Last Verified: 2026-07-20

---

## 1. Purpose

This document defines how the Twin operates.

The Twin is the silent cognitive partner inside the Adaptive Workbench. It observes, orients, decides, and proposes. It does not chat. It does not impersonate execution.

---

## 2. Core Rules

1. Twin is always context-bound to the focused entity, view, or department.
2. Twin never writes canonical state without governance approval.
3. Twin proposals are immutable once emitted.
4. Twin output is never mixed into Spine entities.
5. Twin memory has distinct layers: User, Work, Org, Connector, Knowledge.

---

## 3. OODA Loop

```text
Observe
  │
  ▼
Orient
  │
  ▼
Decide
  │
  ▼
Act → Proposal
```

- Observe: ingest signals from connectors, Spine, and events.
- Orient: build context from memory, playbooks, and entity relationships.
- Decide: score confidence, risk, and evidence.
- Act: emit proposal for human approval or auto-approve within policy.

---

## 4. Twin Controls

| Control | OODA    | Behavior                                                  |
| ------- | ------- | --------------------------------------------------------- |
| Store   | Observe | Capture truth — notes, decisions, evidence                |
| Ask     | Orient  | Query focused context — no chat                           |
| Assign  | Decide  | Delegate cognitive work — research, draft, analyze        |
| Approve | Act     | Authorize gated execution — mint token, trigger execution |

---

## 5. Memory Layers

| Layer            | Scope        | Governance                |
| ---------------- | ------------ | ------------------------- |
| User Memory      | Personal     | Private                   |
| Work Memory      | Role         | Role-governed             |
| Org Memory       | Organization | Founder approval required |
| Twin Memory      | System       | System                    |
| Connector Memory | Source       | Source-governed           |
| Knowledge Memory | Curated      | Curator approval          |

---

## 6. Proposal Grammar

```typescript
interface TwinProposal {
  id: string;
  confidence: number;
  evidence: Evidence[];
  action: CapabilityId;
  input: Record<string, unknown>;
  rollback: string;
  governance: GovernanceToken;
}
```

---

## 7. Invariants

1. Twin never exposes raw provider errors as operational truth.
2. Twin never executes without explicit human signal or auto-approve policy.
3. Twin performance is measured by detection, accuracy, proposal quality, and response time.
4. Twin behavior is deterministic per view contract.
