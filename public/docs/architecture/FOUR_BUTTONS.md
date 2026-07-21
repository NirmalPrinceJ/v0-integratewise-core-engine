# IntegrateWise — The Four Buttons (OODA Grammar)

**Status**: FROZEN
**Date**: July 17, 2026

---

# The Four Buttons

The four buttons are the explicit OODA control grammar for truth capture, Twin reasoning, delegation, and governed execution. They complement ordinary Workbench interactions such as navigating modules, editing records, and logging activity.

```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ┌──────────────┐  ┌──────────────┐                       │
│   │  Store in    │  │  Ask Your    │                       │
│   │  Spine       │  │  Twin        │                       │
│   │  (Observe)   │  │  (Orient)    │                       │
│   └──────────────┘  └──────────────┘                       │
│                                                             │
│   ┌──────────────┐  ┌──────────────┐                       │
│   │  Assign Your │  │  Approve     │                       │
│   │  Twin        │  │  Twin's      │                       │
│   │  (Decide)    │  │  Action      │                       │
│   └──────────────┘  └──────────────┘                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# Button Definitions

## Store in Spine (Observe)

**User captures truth.**

```text
User: "This account is at risk. Stakeholder changed. Budget cut."
User clicks: [Store in Spine]
Workbench: Submits the observation through the governed Pipeline. Spine records its entity link, timeline event, and provenance.
Twin: Observes the resulting Spine change; it does not write directly.
```

**What it does:**

- Submits the observation to the governed Pipeline
- Records it in Spine as a TimelineEvent with entity links and provenance
- Feeds the resulting canonical change into Twin observation
- The Twin does not write truth directly

**When to use:**

- Capturing a meeting outcome
- Recording a risk or decision
- Logging an operational observation
- Documenting a stakeholder change

---

## Ask your Twin (Orient)

**User asks Twin to understand the work.**

```text
User: "What's the risk on this account?"
User clicks: [Ask your Twin]
Twin: Analyzes Spine context. Surfaces evidence.
```

**What it does:**

- Escalates the Twin from passive observation into Orient reasoning
- Reads the current Workbench surface, current entity, related entities, and OODA state
- Reads grounded Spine context, pipeline state/freshness, evidence, connected-system context, and organizational memory
- Produces an evidence-backed recommendation; it never decides for the user

**When to use:**

- "What should I do next?"
- "What are the risks here?"
- "What did I miss in this meeting?"
- "What's the status of this project?"

---

## Assign your Twin (Decide)

**User delegates intent to Twin.**

```text
User: "Draft an email to the customer about the renewal."
User clicks: [Assign your Twin]
Twin: Drafts email. Waits for approval.
```

**What it does:**

- Twin receives intent + context
- Twin executes draft/proposal/analysis
- Twin presents output for approval
- Twin does NOT execute until approved

**When to use:**

- "Draft a follow-up email"
- "Prepare a QBR deck"
- "Create a risk report"
- "Update the pipeline forecast"

---

## Approve Twin's Action (Act)

**User authorizes execution.**

```text
Twin: "Email drafted. Ready to send."
User clicks: [Approve Twin's Action]
Twin: Sends email. Logs outcome. Updates Spine.
```

**What it does:**

- Governance validates the approval
- Pipeline invokes the authorized capability against the connected system
- Outcome is recorded and reconciled back through Spine
- OODA loop completes

**When to use:**

- Approving an email draft
- Approving a workflow automation
- Approving a pipeline update
- Approving a report submission

---

# The OODA Loop in Action

```text
User opens Account
        ↓
Twin observes:
• Renewal in 18 days
• Two unresolved tickets
• Stakeholder changed
• Health declining
        ↓
Twin surfaces:
"Three risks detected." [Review] [Ignore]
        ↓
User clicks [Review]
        ↓
Twin shows: Risk details, evidence, recommended actions
        ↓
User decides:
├── [Store in Spine] → Save observation
├── [Ask your Twin] → Ask for analysis
├── [Assign your Twin] → Delegate action
└── [Approve Twin's Action] → Execute
```

---

# Button Placement

## In Every Module

Every module view shows the four buttons contextually:

```
┌─────────────────────────────────────────────────────────────┐
│ Account: FinanceFlow Solutions                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [Store in Spine] [Ask your Twin] [Assign your Twin]        │
│                                                             │
│ ── Timeline ──                                              │
│ • 2026-07-15: Stakeholder changed (Source: Salesforce)     │
│ • 2026-07-10: Health score dropped to 42                   │
│ • 2026-07-05: QBR scheduled                                │
│                                                             │
│ ── Twin Observations ──                                     │
│ • Renewal in 18 days — HIGH RISK                          │
│ • 2 unresolved P1 tickets                                 │
│ • Champion silent for 12 days                             │
│                                                             │
│ [Approve Twin's Action] (when Twin proposes)               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## In Twin Panel

When Twin proposes an action:

```
┌─────────────────────────────────────────────────────────────┐
│ Twin Proposal                                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ "Draft intervention email for FinanceFlow renewal"         │
│                                                             │
│ Evidence:                                                   │
│ • Renewal in 18 days                                       │
│ • Health score: 42 (down from 76)                         │
│ • Champion silent 12 days                                  │
│ • 2 P1 tickets unresolved                                 │
│                                                             │
│ Draft:                                                      │
│ "Hi [Champion], I noticed some challenges..."              │
│                                                             │
│ [Edit] [Assign your Twin] [Approve Twin's Action] [Ignore]│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# The Rule

```text
The Twin NEVER acts without approval.

The user ALWAYS has control.

The four buttons are the only way to interact.

No chat required.
No prompt required.
No context explaining required.
```

---

# Pipeline Participation

The Twin participates only at **THINK**:

```text
LOAD → NORMALIZE → STORE → THINK (Twin) → APPROVE → ACT → REPEAT
                         ↑                 ↑
                    Store in Spine    Approve Twin's Action
                    Ask your Twin     Assign your Twin
```

---

# Implementation

## packages/workbench-config/

```typescript
interface RoleConfig {
  // ... existing fields
  buttons: {
    storeInSpine: ButtonConfig; // Always visible
    askYourTwin: ButtonConfig; // Always visible
    assignYourTwin: ButtonConfig; // Context-dependent
    approveTwinAction: ButtonConfig; // When Twin proposes
  };
}
```

## apps/web/

```typescript
// Every module view includes the four buttons
function ModuleView({ module, entity }: ModuleViewProps) {
  return (
    <div>
      <EntityHeader entity={entity} />
      <FourButtons
        onStoreInSpine={() => storeObservation(entity)}
        onAskYourTwin={() => twinAnalyze(entity)}
        onAssignYourTwin={() => twinDraft(entity)}
        onApproveTwinAction={() => twinExecute(entity)}
      />
      <ModuleContent />
      <TwinObservations entity={entity} />
    </div>
  );
}
```
