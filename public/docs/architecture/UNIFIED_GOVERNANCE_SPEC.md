# Unified Governance Specification

> **Status:** Canonical governance architecture  
> **Date:** July 12, 2026  
> **Authority:** Nirmal (Founder)  
> **Canonical Reference:** [CANONICAL_PLATFORM_ARCHITECTURE.md](./CANONICAL_PLATFORM_ARCHITECTURE.md)  
> **Reconciles:** Document 1 (confidence-based governance) and Document 3 (authority-based governance)  
> **Cross-Reference:** [PLANE_LAYER_CROSS_REFERENCE.md](./PLANE_LAYER_CROSS_REFERENCE.md)

---

## The Problem

Two governance models exist across the architecture documents:

1. **Document 1 (Confidence-Based):** AI proposals are scored 0.0–1.0. Thresholds determine disposition:
   - `< 0.70 → discard`
   - `0.70–0.85 → queue for HITL`
   - `≥ 0.85 → auto-approve`

2. **Document 3 (Authority-Based):** Every action is evaluated against policy, authority, evidence, risk, scope, and approval requirements. Three outcomes: `ALLOW · DENY · REQUIRE APPROVAL`.

These are not conflicting — they are orthogonal dimensions of the same governance problem. A complete governance system needs both.

---

## The Unified Model: Three-Layer Governance

```
                    GOVERNANCE ENGINE
                          │
          ┌───────────────┼───────────────┐
          │               │               │
     AUTHORITY        CONFIDENCE       EVIDENCE
     GOVERNANCE       GOVERNANCE       GOVERNANCE
          │               │               │
   Who can do what   How sure is the   What proof exists
   under what policy  system about      for this action?
          │           this proposal?        │
          │               │               │
          └───────────────┼───────────────┘
                          │
                    UNIFIED OUTCOME
                          │
              ┌───────────┼───────────┐
              │           │           │
           ALLOW       DENY      REQUIRE
                                  APPROVAL
```

### Layer 1: Authority Governance (Who)

**Question:** Is this user authorized to perform this action under this policy?

**Inputs:**

- User identity (JWT claims)
- User role (RBAC)
- Tenant policy (configuration)
- Action scope (which entity, which field, which system)
- Time window (business hours, deadline constraints)
- Delegation chain (is this user acting on behalf of someone?)

**Evaluation:**

```typescript
interface AuthorityCheck {
  userId: string;
  tenantId: string;
  action: string; // e.g., "capability:invoke", "spine:write", "proposal:approve"
  entity?: string; // which entity this action targets
  scope?: string; // field-level or system-level scope
  delegationChain?: string[]; // who delegated this action
}

interface AuthorityResult {
  allowed: boolean;
  reason: string; // why allowed or denied
  policyRef: string; // which policy was applied
  requiresApproval: boolean; // even if allowed, does it need approval?
  approver?: string; // who must approve
}
```

**Rules:**

1. Authority is checked BEFORE confidence. If authority denies, the action stops.
2. Authority can REQUIRE APPROVAL even when confidence is high.
3. Authority can ALLOW auto-execution when confidence is high.
4. Authority can DENY regardless of confidence level.

### Layer 2: Confidence Governance (How Sure)

**Question:** How confident is the AI system in this proposal?

**Inputs:**

- Model confidence score (0.0–1.0)
- Proposal complexity (single action vs. multi-step workflow)
- Historical accuracy (how often has this model been right for this action type?)
- Context quality (how complete is the input data?)

**Evaluation:**

```typescript
interface ConfidenceCheck {
  proposalId: string;
  confidence: number; // 0.0–1.0
  modelId: string; // which model generated this
  actionType: string; // simple vs. complex
  contextCompleteness: number; // 0.0–1.0
}

interface ConfidenceResult {
  disposition: "auto_approve" | "hitl_review" | "discard";
  reason: string;
  threshold: number; // which threshold was applied
}
```

**Thresholds (Configurable per Tenant):**

```typescript
interface ConfidenceThresholds {
  autoApprove: number; // default: 0.85
  hitlReview: number; // default: 0.70
  // below hitlReview → discard
}
```

**Rules:**

1. Confidence is checked AFTER authority. Authority must allow first.
2. High confidence + authority allowed = auto-approve (if policy permits).
3. Medium confidence + authority allowed = HITL review required.
4. Low confidence = discard (regardless of authority).

### Layer 3: Evidence Governance (What Proof)

**Question:** What evidence exists to support this action and its outcome?

**Inputs:**

- Intent (what was the user trying to do?)
- Action (what did the system do?)
- Evidence (what proof exists that the action was performed correctly?)
- Outcome (what was the result?)
- Audit trail (who approved, when, under what policy?)

**Evaluation:**

```typescript
interface EvidenceCheck {
  intentId: string;
  actionId: string;
  evidence: EvidenceRecord[];
  outcome: OutcomeRecord;
}

interface EvidenceResult {
  valid: boolean;
  auditRef: string; // reference to audit log
  promotionEligible: boolean; // can this outcome be promoted to Spine?
}
```

**Rules:**

1. Evidence is collected AFTER execution. It does not gate the action.
2. Evidence is required for Spine promotion. No evidence = no promotion.
3. Evidence is required for audit. All actions must have evidence.
4. Evidence quality determines promotion confidence.

---

## The Governance Flow

```
USER / TWIN INTENT
        │
        ▼
┌───────────────────┐
│  AUTHORITY CHECK  │ ◄── Who is this user? What policy applies?
│                   │     What scope? What delegation?
│  ALLOW / DENY /   │
│  REQUIRE APPROVAL │
└────────┬──────────┘
         │
    DENY? ──► STOP (return denial reason)
         │
    ALLOW? │
         ▼
┌───────────────────┐
│ CONFIDENCE CHECK  │ ◄── How sure is the AI? What threshold?
│                   │     What action complexity? What context quality?
│  AUTO / HITL /    │
│  DISCARD          │
└────────┬──────────┘
         │
    DISCARD? ──► STOP (return discard reason)
         │
    HITL? │
         ▼
┌───────────────────┐
│  HITL REVIEW      │ ◄── Present proposal to human
│                   │     Show intent, confidence, evidence, impact
│  APPROVE / REJECT │
│  / MODIFY         │
└────────┬──────────┘
         │
    REJECT? ──► STOP (return rejection reason)
         │
    APPROVE? │
         ▼
┌───────────────────┐
│    EXECUTION      │ ◄── Hermes orchestrates
│                   │     Capability Fabric resolves how
│  LOCAL / API /    │     Sync Policy determines when
│  DISTRIBUTED      │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ EVIDENCE CAPTURE  │ ◄── Record intent, action, evidence, outcome
│                   │     Write to audit log
│  AUDIT LOG        │     Prepare for Spine promotion
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ SPINE PROMOTION   │ ◄── Promote outcome to canonical truth
│                   │     Invalidate cache
│  CONTINUITY       │     Trigger rehydration
│  PIPELINE         │     Next OODA loop begins
└───────────────────┘
```

---

## Governance State Machine

```typescript
interface GovernanceState {
  id: string;
  proposalId: string;

  // Authority layer
  authority: {
    status: "pending" | "allowed" | "denied" | "requires_approval";
    userId: string;
    policyRef: string;
    reason?: string;
    approver?: string;
  };

  // Confidence layer
  confidence: {
    status: "pending" | "auto_approve" | "hitl_review" | "discard";
    score: number;
    modelId: string;
    threshold: number;
    reason?: string;
  };

  // Evidence layer
  evidence: {
    status: "pending" | "captured" | "validated" | "promoted";
    intentId: string;
    actionId: string;
    records: EvidenceRecord[];
    auditRef?: string;
  };

  // Overall disposition
  disposition:
    | "pending"
    | "auto_approved"
    | "hitl_pending"
    | "approved"
    | "rejected"
    | "discarded"
    | "executed"
    | "promoted";

  // Timeline
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}
```

---

## Integration with Document 1's Capability Registry

Document 1's Capability Registry already stores governance fields per capability:

```typescript
interface CapabilityDefinition {
  // ... other fields ...
  governance: {
    requiresApproval: boolean;
    minConfidence: number;
    autoApproveThreshold: number;
    requiredRoles: string[];
    requiredScopes: string[];
  };
}
```

The unified governance model extends this:

```typescript
interface GovernancePolicy {
  // Authority layer
  authority: {
    requiredRoles: string[]; // who can invoke
    requiredScopes: string[]; // what scope is needed
    delegationAllowed: boolean; // can this be delegated?
    timeWindow?: TimeWindow; // when can this be invoked
    approverRole?: string; // who must approve (if requiresApproval)
  };

  // Confidence layer
  confidence: {
    autoApproveThreshold: number; // default: 0.85
    hitlThreshold: number; // default: 0.70
    minConfidence: number; // below this = discard
    contextCompletenessRequired: number; // minimum context quality
  };

  // Evidence layer
  evidence: {
    required: boolean; // must evidence be captured?
    promotionEligible: boolean; // can this outcome be promoted to Spine?
    auditRetention: number; // days to retain audit records
  };
}
```

This preserves Document 1's registry structure while adding the authority and evidence dimensions from Document 3.

---

## The HITL Review Contract

The approval UX needs a technical contract. Here is the proposal:

```typescript
interface HITLProposal {
  id: string;
  proposalId: string;

  // What the user/Twin wants to do
  intent: {
    description: string;
    targetEntity?: string;
    targetSystem?: string;
    capabilityId: string;
  };

  // What the system will do
  execution: {
    plan: ExecutionStep[];
    estimatedImpact: ImpactSummary;
    rollbackPlan?: ExecutionStep[];
  };

  // AI confidence
  confidence: {
    score: number;
    modelId: string;
    reasoning: string; // why the AI proposed this
    alternatives: string[]; // what else could have been done
  };

  // Evidence
  evidence: {
    contextUsed: string[]; // what data informed this proposal
    sourceEntities: string[]; // which entities are involved
    precedentActions: string[]; // similar past actions
  };

  // Governance
  governance: {
    authorityStatus: string;
    confidenceDisposition: string;
    requiredApprover: string;
    expiresAt: string; // proposal expiration
  };

  // UI contract
  ui: {
    summary: string; // one-line summary
    detail: string; // full explanation
    preview: string; // execution preview (diff, preview, etc.)
    riskLevel: "low" | "medium" | "high" | "critical";
    canPartialApprove: boolean;
    canModify: boolean;
  };
}
```

### Proposal Lifecycle

```
PROPOSED → PENDING_AUTHORITY → PENDING_CONFIDENCE → PENDING_REVIEW →
  → APPROVED → EXECUTING → COMPLETED → PROMOTED
  → REJECTED → ARCHIVED
  → EXPIRED → ARCHIVED
  → MODIFIED → RE-PROPOSED
```

### Expiration Rules

| Risk Level | Default Expiration | Configurable |
| ---------- | ------------------ | ------------ |
| Low        | 7 days             | Yes          |
| Medium     | 3 days             | Yes          |
| High       | 24 hours           | Yes          |
| Critical   | 4 hours            | Yes          |

---

## Four-Button OODA → Governance Mapping

| OODA Button               | Governance Layer                                                         | Auto-Executes?                                       |
| ------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------- |
| **Store in Spine**        | Authority: user can write to Spine                                       | Yes (user action, no AI)                             |
| **Ask Your Twin**         | Authority: user can query Twin; Confidence: N/A (read-only)              | Yes (read-only, no governance gate)                  |
| **Assign Your Twin**      | Authority: user can delegate to Twin; Confidence: Twin's proposal scored | No (produces proposal for approval)                  |
| **Approve Twin's Action** | Authority: user can approve; Confidence: HITL review; Evidence: capture  | Yes (after approval, executes and captures evidence) |

The four buttons are the user-facing entry points. All capability invocations flow through one of these four paths. The governance engine applies the appropriate layer(s) based on which button was pressed.

---

## Implementation Priorities

1. **P0:** Unify the governance state machine (this document)
2. **P0:** Extend CapabilityRegistry with GovernancePolicy
3. **P0:** Define HITLProposal contract for the approval UX
4. **P1:** Implement authority check service
5. **P1:** Implement confidence check service (already partially exists)
6. **P1:** Implement evidence capture pipeline
7. **P2:** Build approval UI using HITLProposal contract
8. **P2:** Add configurable thresholds per tenant
