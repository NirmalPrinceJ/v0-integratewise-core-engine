# IntegrateWise — Twin Behavior Model

**Status**: FROZEN
**Date**: July 17, 2026

---

# Product Model

```text
Onboarding
    ↓
User Workbench
    ├── user works in departmental modules
    ├── pipeline executes
    └── Twin silently observes
             ↓ (only when explicitly engaged or material value exists)
        ORIENT → THINK → RECOMMEND
             ↓
        approved outcome returns through Pipeline → Spine
```

The user experience has three concepts only:

1. **Onboarding** — establishes role, connected systems, permissions, and initial Spine context.
2. **User Workbench** — the primary operational surface.
3. **Twin** — a silent context-aware partner, not another workspace, permanent panel, or sidebar destination.

---

# Twin Modes

## 1. Passive Mode — Always Observe, Stay Lightweight

The Twin is continuously aware without continuously performing expensive reasoning.

```text
Pipeline events
Spine changes
Current Workbench surface
Current entity
User actions
OODA state
Approvals and outcomes
Context changes
        ↓
Lightweight observation
        ↓
Only material signal → small, contextual surfacing
```

Examples of permitted lightweight surfacing:

- “Renewal risk detected.”
- “Meeting starts in 10 minutes.”
- “Three approvals pending.”
- “Connector sync failed; account data may be stale.”

Passive mode does not open a Twin panel, generate a long analysis, or compete with the user's work.

## 2. Active Mode — Ask your Twin → Orient

When the user needs detail or clicks **Ask your Twin**, the Twin escalates from observation to grounded reasoning.

```text
Ask your Twin
    ↓
ORIENT
    ├── Current Workbench surface
    ├── Current entity and related entities
    ├── Adaptive Spine projection, timeline, relationships, and provenance
    ├── Pipeline state, freshness, and ingestion status
    ├── OODA state
    ├── Evidence and connected-system context
    └── Organizational memory
    ↓
THINK
    ↓
Evidence-backed recommendation
    ↓
User decides
```

The Twin only performs comprehensive analysis after explicit engagement or a material pipeline event that justifies proactive assistance.

---

# Grounded Twin Inputs

Every Twin response is grounded in the same bounded context:

```text
Current Surface
    + Current Entity
    + Pipeline State
    + OODA State
    + Adaptive Spine
    + Evidence
    + Connected Systems
    + Organizational Memory
    ↓
Twin Reasoning
```

The Twin must distinguish facts, evidence, freshness, uncertainty, and recommendations. It never invents missing operational truth.

---

# OODA Grammar — Four Buttons

The four buttons are the explicit human-to-platform control grammar. They do not replace normal operational interactions such as navigating modules, editing a record, or logging activity.

| Button                    | OODA phase | User intent                               | Platform behavior                                                                                                                                     |
| ------------------------- | ---------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Store in Spine**        | Observe    | Capture a durable observation or decision | Workbench submits a governed write through the Pipeline; Spine records entity, timeline, provenance, and links. The Twin does **not** write directly. |
| **Ask your Twin**         | Orient     | Request understanding of current work     | Twin reads the current surface and bounded context, then reasons over Pipeline, Spine, OODA, evidence, connected systems, and memory.                 |
| **Assign your Twin**      | Decide     | Delegate a bounded task                   | Twin creates a draft, analysis, or proposed action from grounded context; it does not externally execute.                                             |
| **Approve Twin's Action** | Act        | Authorize a proposal                      | Governance validates approval; the Pipeline invokes the authorized capability; external result is reconciled back to Spine.                           |

## Example: Customer Success Account

```text
User opens FinanceFlow account
    ↓
Passive Twin notices: renewal in 18 days + health decline + two unresolved P1 tickets
    ↓
Small inline signal: “Renewal risk detected.” [Review] [Ignore]
    ↓
User needs detail → [Ask your Twin]
    ↓
Twin ORIENTS over account Entity 360, signal evidence, sync freshness,
meeting history, OODA state, and related contacts
    ↓
Twin RECOMMENDS: “Prepare an intervention plan; evidence: …”
    ↓
User → [Assign your Twin]: “Draft the intervention email and QBR recovery plan.”
    ↓
Twin returns a proposal and evidence; no external action occurred
    ↓
User → [Approve Twin's Action]
    ↓
Governance gate → authorized Pipeline capability → connected system
    ↓
Outcome is re-ingested and reconciled to Spine
```

---

# Pipeline Relationship

```text
LOAD → NORMALIZE → STORE → THINK → RECOMMEND → APPROVE → ACT → REPEAT
                          ↑                   ↑
                   Twin reasons here    Human authority here
```

- **Pipeline** owns ingestion, normalization, durable writes, authorized execution, and reconciliation.
- **Spine** owns canonical truth, timelines, provenance, relationships, and projections.
- **Twin** observes the pipeline and OODA state; when engaged, it orients and thinks over grounded context.
- **Governance** is a hard gate: no approval token, no external mutation.

The Twin never directly writes truth to Spine and never directly mutates a connected system.

---

# Surfacing Rules

1. **Silent by default.** No permanent Twin pane or sidebar item across surfaces.
2. **Contextual by exception.** A material signal may appear inline, as a small notification, or as a proposal card.
3. **Deep only on demand.** `Ask your Twin` starts Orient; the Twin reads the current surface rather than requiring the user to restate context.
4. **Evidence before recommendation.** Every recommendation identifies its supporting evidence and data freshness.
5. **Human authority is final.** A proposed action is inert until explicitly approved.
6. **Pipeline is the execution boundary.** Approved outcomes return through the Pipeline and are reconciled to Spine.

---

# UI Placement

The Twin is invoked **where work is happening**, not housed as a universal destination:

- An inline risk signal on an Account view.
- A contextual **Ask your Twin** affordance in a module header or entity detail.
- A proposal card after an assignment or material detection.
- A contextual **Approve Twin's Action** control only when a governed proposal exists.

The Workbench remains primary. The Twin appears only as much as the current work and user request require.
