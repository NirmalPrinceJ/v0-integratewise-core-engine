# Governance Constitution

Status: CANONICAL
Scope: Two-gate governance model, approval tokens, risk scoring, audit, and compliance rules.
Canonical Owner: IntegrateWise Platform
Last Verified: 2026-07-20

---

## 1. Purpose

This document defines how IntegrateWise governs execution.

No capability mutates canonical state without governance. No external side effect occurs without approval.

---

## 2. Two-Gate Model

```
Gate 1: Pre-Proposal
  - ALLOW_PROCEED
  - DENY
  - REQUIRE_PRE_APPROVAL
        │
        ▼
Twin Proposal
        │
        ▼
Gate 2: Post-Proposal
  - AUTO_APPROVE
  - REQUIRE_HUMAN_APPROVAL
  - DENY
```

---

## 3. Confidence Thresholds

| Confidence | Gate 2 Action                                 | Token       |
| ---------- | --------------------------------------------- | ----------- |
| ≥ 0.95     | Auto-promote to Organizational Memory         | Auto        |
| ≥ 0.85     | Auto-approve low-risk / one-click medium-risk | Short-lived |
| 0.70–0.85  | Surface for human review                      | Standard    |
| < 0.70     | Discard                                       | None        |

---

## 4. Approval Chains

| Action                 | Level 1          | Level 2       | Level 3 |
| ---------------------- | ---------------- | ------------- | ------- |
| deal.close (<$10K)     | Sales Rep        | —             | —       |
| deal.close ($10K-$25K) | Sales Rep        | Head of Sales | —       |
| deal.close (>$25K)     | Sales Rep        | Head of Sales | Founder |
| hiring.open            | Department Head  | Founder       | —       |
| budget.adjust          | Finance Manager  | Founder       | —       |
| release.deploy         | Engineering Lead | CTO           | —       |
| code.rollback          | Engineering Lead | CTO           | —       |

---

## 5. Audit Rules

1. Every action is logged with actor, capability, evidence, and approval status.
2. Audit retention is immutable and seven-year minimum.
3. Every approval emits a governance token with expiry and scope.
4. Cross-department actions require cross-department approval.
5. Emergency override is Founder-only with full audit trail.

---

## 6. Invariants

1. Governance is enforced by architecture, not policy alone.
2. No execution path bypasses Gate 1.
3. No side effect occurs without Gate 2 approval or explicit auto-approve rule.
4. Approval authority matches risk.
