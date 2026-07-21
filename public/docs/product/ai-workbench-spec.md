# IntegrateWise — AI Workbench Specification

> **Version:** 1.0.0 | **Date:** 2026-07-03 | **Status:** Human-First AI Management Surface  
> **Philosophy:** The AI Workbench is where humans manage the AI's work. It is separate from the human workbench. It is organized. It is human-controlled.

---

## Table of Contents

1. [What the AI Workbench Is](#what-the-ai-workbench-is)
2. [What the AI Workbench Is NOT](#what-the-ai-workbench-is-not)
3. [The Seven AI Workbench Panels](#the-seven-ai-workbench-panels)
4. [Navigation & Access](#navigation--access)
5. [Human Control Model](#human-control-model)
6. [Data Flow](#data-flow)
7. [States & Interactions](#states--interactions)
8. [Accessibility](#accessibility)
9. [TypeScript Interfaces](#typescript-interfaces)
10. [Appendix: Difference from Audit Logs](#appendix-difference-from-audit-logs)

---

## What the AI Workbench Is

The AI Workbench is a **dedicated management surface** where humans can:

- **Review** all AI proposals in one place, organized and filterable
- **Organize** AI actions into categories, projects, or workflows
- **Monitor** AI performance — accuracy, acceptance rates, outcomes
- **Explore** AI memory — what the AI knows, how it learned it, confidence levels
- **Adjust** AI behavior — thresholds, scope, auto-approve rules
- **Audit** AI decisions in context, not just as a raw log
- **Manage** AI workflows — what the AI is running, what it will run, what it completed

The AI Workbench is **the human's window into the AI's operations**. It is not the AI's window into itself. The AI does not "use" this interface. Humans use it to manage the AI.

```
┌─────────────────────────────────────────────────────────────────┐
│  HUMAN WORKBENCH          │  AI WORKBENCH (separate tab)       │
│  ─────────────────        │  ─────────────────────────────     │
│  Entity list              │  Proposals Queue                   │
│  Detail pane              │  AI Actions History                │
│  Human actions            │  AI Memory Explorer                │
│  Timeline                 │  AI Workflow Monitor               │
│  Search                   │  AI Performance Dashboard          │
│  Projections              │  AI Governance Settings            │
│                           │  AI Model Management               │
│  → Human does work here   │  → Human manages AI here           │
│  → AI is subtle, ambient  │  → AI operations are surfaced     │
│  → AI helps when asked    │  → Human controls and organizes   │
└─────────────────────────────────────────────────────────────────┘
```

---

## What the AI Workbench Is NOT

| NOT This           | Because                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| **AI Home / Chat** | The AI Home is for conversation. The AI Workbench is for management.                                          |
| **Audit Logs**     | Audit Logs are passive historical records. The AI Workbench is active operational control.                    |
| **AI Dashboard**   | The AI does not own this. The human does. It is not "AI's dashboard" — it is "human's AI management surface." |
| **Default View**   | The human workbench is the default. The AI Workbench is a secondary, opt-in surface.                          |
| **Auto-Executing** | Nothing in the AI Workbench auto-executes. Every action requires human approval.                              |
| **AI-Proposed UI** | The AI does not redesign this interface. Humans configure it.                                                 |

---

## The Seven AI Workbench Panels

### Panel 1: Proposals Queue

**Purpose:** All AI proposals, organized and actionable.

**Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│  Proposals Queue                                  [Filter ▼] │
│  ─────────────────────────────────────────────────────────── │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ [○] All   [○] Pending   [○] Approved   [○] Rejected   [○]││
│  │     Executed                                              ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ ⚠️  PENDING (3)                                          ││
│  │                                                            ││
│  │ ┌────────────────────────────────────────────────────────┐││
│  │ │ Acme Corp health dropped to 62. Escalate to VP?       │││
│  │ │ Confidence: 82%  │  Source: Twin  │  Time: 2h ago      │││
│  │ │ [View Context]  [Approve]  [Modify]  [Dismiss]        │││
│  │ └────────────────────────────────────────────────────────┘││
│  │                                                            ││
│  │ ┌────────────────────────────────────────────────────────┐││
│  │ │ Schedule QBR with Northwind for next week?              │││
│  │ │ Confidence: 91%  │  Source: Twin  │  Time: 5h ago       │││
│  │ │ [View Context]  [Approve]  [Modify]  [Dismiss]        │││
│  │ └────────────────────────────────────────────────────────┘││
│  │                                                            ││
│  │ ┌────────────────────────────────────────────────────────┐││
│  │ │ Draft follow-up email to Meridian's champion?         │││
│  │ │ Confidence: 76%  │  Source: Twin  │  Time: 1d ago       │││
│  │ │ [View Context]  [Approve]  [Modify]  [Dismiss]        │││
│  │ └────────────────────────────────────────────────────────┘││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ ✅  APPROVED (12 today)                                    ││
│  │                                                            ││
│  │ ┌────────────────────────────────────────────────────────┐││
│  │ │ Escalated Acme Corp to VP CS — executed 2h ago        │││
│  │ │ Confidence: 82%  │  Approved by: Sarah  │  Outcome: ✓   │││
│  │ │ [View Details]                                          │││
│  │ └────────────────────────────────────────────────────────┘││
│  │                                                            ││
│  │ ┌────────────────────────────────────────────────────────┐││
│  │ │ Scheduled Northwind QBR — executed 5h ago             │││
│  │ │ Confidence: 91%  │  Approved by: Sarah  │  Outcome: ✓   │││
│  │ │ [View Details]                                          │││
│  │ └────────────────────────────────────────────────────────┘││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

**Key Features:**

- **Filter tabs:** All / Pending / Approved / Rejected / Executed
- **Batch actions:** Select multiple proposals → Approve All / Dismiss All / Modify All
- **Context view:** Click "View Context" → see Entity360 + reasoning trace + evidence
- **Confidence visible:** But not dominant. Small badge, not large score.
- **Time-ordered:** Most recent first. Human scans quickly.
- **No auto-execute:** Every proposal requires human action. No "auto-approve after X hours."

**States:**

- Empty: "No pending proposals. The AI is watching."
- Loading: Skeleton cards for proposals.
- Error: "Could not load proposals. Retry."
- Success: Proposal list with actions.

---

### Panel 2: AI Actions History

**Purpose:** What the AI did, when, why, and the outcome.

**Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│  AI Actions History                               [Filter ▼] │
│  ─────────────────────────────────────────────────────────── │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ [○] All Actions  [○] Proposals  [○] Executions  [○]    ││
│  │     Enrichments  [○] Memory Updates  [○] Tool Calls  ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ Timeline                                                   ││
│  │                                                            ││
│  │  Today                                                     ││
│  │  ───────────────────────────────────────────────────────── ││
│  │  09:14 AM  ├─ Escalated Acme Corp to VP CS                ││
│  │            │  Confidence: 82%  │  Approved by: Sarah      ││
│  │            │  [View Details]  [View Entity360]            ││
│  │                                                            ││
│  │  07:30 AM  ├─ Scheduled Northwind QBR for 2026-07-10     ││
│  │            │  Confidence: 91%  │  Approved by: Sarah      ││
│  │            │  [View Details]  [View Entity360]            ││
│  │                                                            ││
│  │  Yesterday                                                 ││
│  │  ───────────────────────────────────────────────────────── ││
│  │  04:22 PM  ├─ Enriched Acme Corp entity with 3 new      ││
│  │            │  contacts from LinkedIn                      ││
│  │            │  Confidence: 88%  │  Auto-approved (enrich) ││
│  │            │  [View Details]  [View Entity360]            ││
│  │                                                            ││
│  │  02:15 PM  ├─ Twin analyzed Q2 churn pattern             ││
│  │            │  Confidence: 95%  │  Read-only (no action)  ││
│  │            │  [View Details]  [View Report]               ││
│  │                                                            ││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

**Key Features:**

- **Timeline view:** Chronological, grouped by day.
- **Action types:** Proposal (human-approved), Execution (AI performed), Enrichment (data added), Memory Update (pattern learned), Tool Call (external API), Read-only (analysis only).
- **Context links:** Every action links to the entity, the proposal, the reasoning trace.
- **Outcome tracking:** Did the action succeed? What was the result?
- **Filter by type:** Human can see only "executions" or only "proposals" or only "enrichments."

**Difference from Audit Logs:**

- Audit Logs = passive compliance record (what happened for legal reasons)
- AI Actions History = active operational record (what the AI did for operational understanding)

---

### Panel 3: AI Memory Explorer

**Purpose:** What the AI knows, how it learned it, and how confident it is.

**Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│  AI Memory Explorer                               [Search...]  │
│  ─────────────────────────────────────────────────────────── │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ [○] All Memories  [○] Personal  [○] Work  [○] Org     ││
│  │     [○] AI Patterns                                      ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ Memory Graph (visual network)                              ││
│  │                                                            ││
│  │           ┌──────────┐                                    ││
│  │           │ Acme Corp│                                    ││
│  │           │ (entity) │                                    ││
│  │           └────┬─────┘                                    ││
│  │                │                                          ││
│  │    ┌───────────┼───────────┐                               ││
│  │    │           │           │                               ││
│  │    ▼           ▼           ▼                               ││
│  │ ┌────────┐ ┌────────┐ ┌────────┐                            ││
│  │ │Champion│ │ Health │ │ Risk   │                            ││
│  │ │John S. │ │ Score  │ │ Level  │                            ││
│  │ └────────┘ └────────┘ └────────┘                            ││
│  │                                                            ││
│  │ [Zoom In]  [Zoom Out]  [Reset View]                        ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ Memory List                                                  ││
│  │                                                            ││
│  │ ┌────────────────────────────────────────────────────────┐││
│  │ │ Acme Corp's CEO prefers phone calls over email        │││
│  │ │ Confidence: 95%  │  Source: user input  │  Permanent  │││
│  │ │ Learned: 2026-01-15  │  Last reinforced: 2026-07-01 │││
│  │ │ [Reinforce]  [Challenge]  [Delete]                      │││
│  │ └────────────────────────────────────────────────────────┘││
│  │                                                            ││
│  │ ┌────────────────────────────────────────────────────────┐││
│  │ │ Health drops for Acme correlate with unresolved bugs  │││
│  │ │ Confidence: 89%  │  Source: AI pattern  │  Active       │││
│  │ │ Learned: 2026-05-20  │  Repetitions: 7  │  Decay: 23d   │││
│  │ │ [Reinforce]  [Challenge]  [Delete]                      │││
│  │ └────────────────────────────────────────────────────────┘││
│  │                                                            ││
│  │ ┌────────────────────────────────────────────────────────┐││
│  │ │ Q1 churn pattern: health < 60 at renewal = 73% churn  │││
│  │ │ Confidence: 92%  │  Source: AI pattern  │  Cold       │││
│  │ │ Learned: 2026-04-01  │  Repetitions: 12  │  Decay: 67d  │││
│  │ │ [Reinforce]  [Challenge]  [Delete]                      │││
│  │ └────────────────────────────────────────────────────────┘││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

**Key Features:**

- **Memory Graph:** Visual network of entities, relationships, and knowledge nodes. Human can explore connections.
- **Memory List:** Text list with confidence, source, tier, decay status.
- **Human actions:** Reinforce (strengthen), Challenge (reduce confidence), Delete (remove).
- **Source attribution:** Every memory shows where it came from (user input, AI pattern, external data).
- **Tier indicators:** Active (hot), Warm, Cold, Permanent — color-coded.
- **Decay visibility:** Human sees when memories will fade, can choose to reinforce.

**The Human Controls the AI's Memory:**

- The human can delete memories the AI got wrong.
- The human can reinforce memories that are important.
- The human can challenge memories that seem questionable.
- The AI does not delete or modify its own memory without human oversight.

---

### Panel 4: AI Workflow Monitor

**Purpose:** What AI workflows are running, scheduled, or completed.

**Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│  AI Workflow Monitor                              [Filter ▼] │
│  ─────────────────────────────────────────────────────────── │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ [○] Running  [○] Scheduled  [○] Completed  [○] Failed  ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ RUNNING (2)                                                ││
│  │                                                            ││
│  │ ┌────────────────────────────────────────────────────────┐││
│  │ │ Daily Standup Summary                                  │││
│  │ │ Trigger: Cron (daily 8:00 AM)                        │││
│  │ │ Status: ● Running  │  Progress: 3/5 steps            │││
│  │ │ Next: Send Slack summary to #standups                 │││
│  │ │ [Pause]  [Stop]  [View Details]                        │││
│  │ └────────────────────────────────────────────────────────┘││
│  │                                                            ││
│  │ ┌────────────────────────────────────────────────────────┐││
│  │ │ Health Score Update                                    │││
│  │ │ Trigger: Event (Salesforce update)                    │││
│  │ │ Status: ● Running  │  Progress: 2/4 steps            │││
│  │ │ Next: Write updated score to Spine                    │││
│  │ │ [Pause]  [Stop]  [View Details]                        │││
│  │ └────────────────────────────────────────────────────────┘││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ SCHEDULED (5)                                              ││
│  │                                                            ││
│  │ ┌────────────────────────────────────────────────────────┐││
│  │ │ Weekly Churn Analysis                                  │││
│  │ │ Trigger: Cron (weekly, Monday 6:00 AM)                │││
│  │ │ Next run: 2026-07-07 06:00 AM                         │││
│  │ │ [Run Now]  [Edit]  [Delete]                            │││
│  │ └────────────────────────────────────────────────────────┘││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

**Key Features:**

- **Running workflows:** Real-time progress, step-by-step, human can pause/stop.
- **Scheduled workflows:** Cron or event-driven triggers, human can run now/edit/delete.
- **Completed workflows:** History with outcomes, success/failure, logs.
- **Failed workflows:** Error details, retry options, human investigation.
- **Human control:** Pause, stop, run now, edit, delete. The human is the operator.

---

### Panel 5: AI Performance Dashboard

**Purpose:** How accurate is the AI? How often are its proposals accepted?

**Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│  AI Performance Dashboard                         [Date ▼]   │
│  ─────────────────────────────────────────────────────────── │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Proposal │ │ Accepted │ │ Rejected │ │ Accuracy │       │
│  │  47      │ │  38      │ │  9       │ │  81%     │       │
│  │ this week│ │ 81%      │ │ 19%      │ │ ↑ 5%     │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ Acceptance Rate Over Time                                  ││
│  │                                                            ││
│  │  100% │                                                    ││
│  │   80% │    ██                                              ││
│  │   60% │    ██  ██                                          ││
│  │   40% │    ██  ██  ██                                      ││
│  │   20% │    ██  ██  ██  ██  ██  ██  ██  ██  ██             ││
│  │    0% └──────────────────────────────────────────────────  ││
│  │         W1  W2  W3  W4  W5  W6  W7  W8  W9  W10  W11      ││
│  │                                                            ││
│  │ [View Details]                                             ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ Top Performing Capabilities                                ││
│  │                                                            ││
│  │ Capability          │ Proposals │ Accepted │ Accuracy     ││
│  │ ────────────────────┼───────────┼──────────┼──────────────││
│  │ Health Scoring      │     12    │    11    │    92%  ↑    ││
│  │ QBR Scheduling      │      8    │     7    │    88%  ↑    ││
│  │ Churn Prediction    │     15    │    11    │    73%  ↓    ││
│  │ Email Drafting      │     12    │     9    │    75%  →    ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ Recent Failures                                            ││
│  │                                                            ││
│  │ ┌────────────────────────────────────────────────────────┐││
│  │ │ Churn prediction for Dataway was wrong (predicted      │││
│  │ │ churn, but they renewed). Confidence was 89%.         │││
│  │ │ [Investigate]  [Retrain Model]  [Adjust Threshold]    │││
│  │ └────────────────────────────────────────────────────────┘││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

**Key Features:**

- **Summary cards:** Proposals, accepted, rejected, accuracy.
- **Trends:** Acceptance rate over time, accuracy changes.
- **Capability breakdown:** Which AI capabilities perform well, which need tuning.
- **Failure analysis:** What went wrong, why, how to fix.
- **Human actions:** Investigate, retrain model, adjust threshold, disable capability.

---

### Panel 6: AI Governance Settings

**Purpose:** Human controls AI thresholds, scope, and auto-approve rules.

**Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│  AI Governance Settings                                      │
│  ─────────────────────────────────────────────────────────── │
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ Confidence Thresholds                                      ││
│  │                                                            ││
│  │ Auto-approve proposals with confidence ≥ [85%]  [─●────] ││
│  │ Queue for review: 70% ─────────────────────── 85%         ││
│  │ Discard proposals with confidence < [70%]  [────●──]     ││
│  │                                                            ││
│  │ [Save Changes]                                             ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ AI Scope (What the AI Can Do)                              ││
│  │                                                            ││
│  │ ☑ Read entity data                                         ││
│  │ ☑ Propose actions                                          ││
│  │ ☑ Send notifications                                       ││
│  │ ☐ Execute actions without approval (DANGER)             ││
│  │ ☑ Enrich entity data (auto-approved)                     ││
│  │ ☐ Access sensitive data (PII, financials)                ││
│  │ ☐ Delete entity data                                       ││
│  │                                                            ││
│  │ [Save Changes]                                             ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ Per-Capability Settings                                    ││
│  │                                                            ││
│  │ Capability          │ Threshold │ Auto-Approve │ Enabled  ││
│  │ ────────────────────┼───────────┼──────────────┼──────────││
│  │ Health Scoring      │    85%    │      Yes     │    ☑    ││
│  │ QBR Scheduling      │    85%    │      Yes     │    ☑    ││
│  │ Churn Prediction    │    80%    │      No      │    ☑    ││
│  │ Email Drafting      │    90%    │      No      │    ☑    ││
│  │ Escalation Routing  │    95%    │      No      │    ☑    ││
│  │ Budget Adjustment   │    99%    │      No      │    ☐    ││
│  │                                                            ││
│  │ [Save Changes]                                             ││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

**Key Features:**

- **Confidence sliders:** Human adjusts thresholds. Real-time preview of what would happen.
- **Scope toggles:** What the AI can and cannot do. Explicit opt-in for dangerous actions.
- **Per-capability settings:** Different thresholds for different capabilities.
- **Save changes:** Changes are versioned, audited, reversible.
- **Danger warnings:** Red highlights for high-risk settings.

---

### Panel 7: AI Model Management

**Purpose:** Which AI models are used, per-capability, cost tracking.

**Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│  AI Model Management                                         │
│  ─────────────────────────────────────────────────────────── │
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ Default Model                                              ││
│  │                                                            ││
│  │ Model: GPT-4o Mini (via OpenRouter)                      ││
│  │ Provider: OpenRouter                                       ││
│  │ Cost: $0.15 / 1M tokens                                   ││
│  │ [Change Model]                                             ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ Per-Capability Model Assignment                            ││
│  │                                                            ││
│  │ Capability          │ Model        │ Cost (week) │ Status ││
│  │ ────────────────────┼──────────────┼─────────────┼────────││
│  │ Health Scoring      │ GPT-4o Mini  │    $0.02    │   ●   ││
│  │ QBR Scheduling      │ GPT-4o Mini  │    $0.01    │   ●   ││
│  │ Churn Prediction    │ Claude 3.5   │    $0.12    │   ●   ││
│  │ Email Drafting      │ GPT-4o Mini  │    $0.03    │   ●   ││
│  │ Escalation Routing  │ GPT-4o Mini  │    $0.01    │   ●   ││
│  │                                                            ││
│  │ [Reassign]  [View Usage]  [Test Model]                   ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ Model Usage This Month                                     ││
│  │                                                            ││
│  │ Total tokens: 2.3M                                       ││
│  │ Total cost: $0.34                                         ││
│  │                                                            ││
│  │ [View Breakdown]                                           ││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

**Key Features:**

- **Default model:** Change the global model.
- **Per-capability assignment:** Use cheap models for simple tasks, strong models for complex ones.
- **Cost tracking:** See how much each capability costs.
- **Usage breakdown:** Token usage, cost per capability, trends.
- **Model testing:** Test a model on a sample before assigning it.

---

## Navigation & Access

### How the Human Reaches the AI Workbench

```
┌─────────────────────────────────────────────────────────────────┐
│  [IntegrateWise Logo]  [Workbench]  [AI Workbench]  [Settings]  │
│                         ▲            ↑                           │
│                         │            │                           │
│              Default (human)    Secondary (AI management)        │
│                                                                 │
│  Clicking "AI Workbench" opens the AI management surface.        │
│  Clicking "Workbench" returns to the human workbench.            │
│                                                                 │
│  The AI Workbench is NEVER the default. The human must choose.  │
└─────────────────────────────────────────────────────────────────┘
```

### Sub-Navigation Within AI Workbench

```
┌─────────────────────────────────────────────────────────────────┐
│  [AI Workbench]                                                 │
│  [Proposals] [History] [Memory] [Workflows] [Performance]      │
│  [Governance] [Models]                                          │
│                                                                 │
│  ← Sub-navigation tabs, one per panel                          │
│  ← Default tab: Proposals Queue                                │
│  ← Human switches between panels                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Human Control Model

Every action in the AI Workbench follows this model:

```
┌─────────────────────────────────────────────────────────────────┐
│  HUMAN CONTROL MODEL                                            │
│                                                                 │
│  1. OBSERVE  → Human sees AI operations surfaced               │
│  2. REVIEW   → Human evaluates proposals, memory, performance  │
│  3. DECIDE   → Human approves, rejects, modifies, deletes     │
│  4. EXECUTE  → Human triggers action (or confirms AI action)   │
│  5. VERIFY   → Human checks outcome, provides feedback        │
│  6. ADJUST   → Human tunes thresholds, scope, models          │
│                                                                 │
│  The AI never executes without human confirmation.             │
│  The AI never modifies its own settings.                       │
│  The AI never deletes its own memory without human approval.   │
│  The AI never changes governance thresholds.                   │
│                                                                 │
│  The human is the operator. The AI is the tool.                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  AI WORKBENCH DATA FLOW                                         │
│                                                                 │
│  Spine (source of truth)                                        │
│     │                                                           │
│     ├──→ Proposals Queue  ←── action_proposals table (D1)     │
│     │      │                                                    │
│     │      └──→ Human reviews → approves/rejects/modifies      │
│     │                                                           │
│     ├──→ AI Actions History  ←── spine_audit_log (D1)           │
│     │      │                                                    │
│     │      └──→ Human explores → filters → investigates          │
│     │                                                           │
│     ├──→ AI Memory Explorer  ←── memory table (D1)              │
│     │      │                                                    │
│     │      └──→ Human reinforces/challenges/deletes            │
│     │                                                           │
│     ├──→ AI Workflow Monitor  ←── workflow state (DO)         │
│     │      │                                                    │
│     │      └──→ Human pauses/stops/edits                       │
│     │                                                           │
│     ├──→ AI Performance Dashboard  ←── metrics (KV)           │
│     │      │                                                    │
│     │      └──→ Human tunes thresholds/models                  │
│     │                                                           │
│     ├──→ AI Governance Settings  ←── policy_registry (D1)     │
│     │      │                                                    │
│     │      └──→ Human adjusts scope/thresholds                 │
│     │                                                           │
│     └──→ AI Model Management  ←── model config (KV)           │
│            │                                                    │
│            └──→ Human reassigns models                         │
│                                                                 │
│  All writes go through the Pipeline (§5.2, §6.6).               │
│  All changes are audited (§11.4).                               │
│  All changes require human authorization (§6.3).                │
└─────────────────────────────────────────────────────────────────┘
```

---

## States & Interactions

### Empty State

```
┌─────────────────────────────────────────────────────────────────┐
│  Proposals Queue                                                │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │              📭 No pending proposals                     │   │
│  │                                                          │   │
│  │     The AI is watching your workbench and learning.      │   │
│  │     When it has a suggestion, it will appear here.       │   │
│  │                                                          │   │
│  │     [Go to Workbench]                                    │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Loading State

```
┌─────────────────────────────────────────────────────────────────┐
│  Proposals Queue                                                │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ┌──────────────┐                                        │   │
│  │  │ ██████░░░░░░ │  Loading proposals...                   │   │
│  │  └──────────────┘                                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │   │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │   │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │   │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │   │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Error State

```
┌─────────────────────────────────────────────────────────────────┐
│  Proposals Queue                                                │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │              ⚠️  Could not load proposals                │   │
│  │                                                          │   │
│  │     The AI management service is temporarily unavailable.  │   │
│  │     Your workbench and data are not affected.            │   │
│  │                                                          │   │
│  │     [Retry]  [Contact Support]                           │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Accessibility

### Screen Reader Experience

```
"AI Workbench. Proposals Queue. 3 pending proposals. First proposal:
Acme Corp health dropped to 62. Escalate to VP? Confidence 82 percent.
Actions: View Context, Approve, Modify, Dismiss."

[User presses Tab]
"View Context button."

[User presses Tab]
"Approve button."

[User presses Enter]
"Proposal approved. Acme Corp escalation queued for execution."
```

### Keyboard Navigation

| Key                    | Action                                  |
| ---------------------- | --------------------------------------- |
| `Tab`                  | Navigate between proposals and actions  |
| `Enter`                | Activate button (Approve, Reject, View) |
| `Shift + D`            | Dismiss selected proposal               |
| `Shift + A`            | Approve selected proposal               |
| `Shift + M`            | Modify selected proposal                |
| `Shift + V`            | View context of selected proposal       |
| `Esc`                  | Close detail panel / return to list     |
| `Cmd/Ctrl + Shift + A` | Open AI Workbench from human workbench  |
| `Cmd/Ctrl + Shift + W` | Return to human workbench               |

### Focus Management

- When switching to AI Workbench, focus lands on first proposal card.
- When a proposal is approved, focus moves to next proposal.
- When detail panel opens, focus traps inside panel until closed.
- When empty state, focus lands on "Go to Workbench" button.

---

## TypeScript Interfaces

```typescript
// AI Workbench Panel
interface AIWorkbenchProps {
  activePanel: AIWorkbenchPanel;
  tenantId: string;
  userId: string;
  onClose: () => void; // Returns to human workbench
}

type AIWorkbenchPanel =
  | "proposals"
  | "history"
  | "memory"
  | "workflows"
  | "performance"
  | "governance"
  | "models";

// Proposal Queue
interface ProposalQueueProps {
  proposals: AIProposal[];
  filter: ProposalFilter;
  onApprove: (proposalId: string) => void;
  onReject: (proposalId: string) => void;
  onModify: (proposalId: string, modification: string) => void;
  onDismiss: (proposalId: string) => void;
  onViewContext: (proposalId: string) => void;
  onBatchApprove: (proposalIds: string[]) => void;
  onBatchDismiss: (proposalIds: string[]) => void;
}

type ProposalFilter = "all" | "pending" | "approved" | "rejected" | "executed";

interface AIProposal {
  id: string;
  entityId: string;
  entityName: string;
  capability: string;
  description: string;
  confidence: number; // 0.0–1.0
  source: "twin" | "workflow" | "user";
  status: "pending" | "approved" | "rejected" | "executed" | "expired";
  createdAt: Date;
  expiresAt: Date;
  context: Entity360; // Full context for human review
  reasoningTrace: ReasoningTrace;
  humanAction?: HumanAction; // What the human did
}

// AI Actions History
interface AIActionsHistoryProps {
  actions: AIAction[];
  filter: ActionFilter;
  onViewDetails: (actionId: string) => void;
  onViewEntity360: (entityId: string) => void;
}

type ActionFilter =
  | "all"
  | "proposal"
  | "execution"
  | "enrichment"
  | "memory"
  | "tool_call"
  | "read_only";

interface AIAction {
  id: string;
  type: ActionType;
  entityId: string;
  entityName: string;
  capability: string;
  description: string;
  confidence: number;
  source: "twin" | "workflow" | "user";
  status: "success" | "failure" | "pending";
  outcome?: string; // What happened
  createdAt: Date;
  humanApprover?: string; // Who approved it
  reasoningTrace?: ReasoningTrace;
}

type ActionType =
  | "proposal"
  | "execution"
  | "enrichment"
  | "memory_update"
  | "tool_call"
  | "read_only";

// AI Memory Explorer
interface AIMemoryExplorerProps {
  memories: AIMemory[];
  filter: MemoryFilter;
  onReinforce: (memoryId: string) => void;
  onChallenge: (memoryId: string) => void;
  onDelete: (memoryId: string) => void;
  onViewGraph: (entityId: string) => void;
}

type MemoryFilter = "all" | "personal" | "work" | "organization" | "ai_pattern";

interface AIMemory {
  id: string;
  entityId: string;
  entityName: string;
  content: string;
  confidence: number;
  source: "user_input" | "ai_pattern" | "external_data";
  tier: "active" | "warm" | "cold" | "permanent";
  repetitions: number;
  decayDays: number; // Days until decay
  createdAt: Date;
  lastReinforcedAt: Date;
  relationships: EntityRelationship[];
}

// AI Workflow Monitor
interface AIWorkflowMonitorProps {
  workflows: AIWorkflow[];
  filter: WorkflowFilter;
  onPause: (workflowId: string) => void;
  onStop: (workflowId: string) => void;
  onRunNow: (workflowId: string) => void;
  onEdit: (workflowId: string) => void;
  onDelete: (workflowId: string) => void;
  onViewDetails: (workflowId: string) => void;
}

type WorkflowFilter = "running" | "scheduled" | "completed" | "failed";

interface AIWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  status: "running" | "scheduled" | "completed" | "failed" | "paused";
  progress?: { current: number; total: number }; // For running workflows
  nextRunAt?: Date; // For scheduled workflows
  lastRunAt?: Date;
  lastRunOutcome?: "success" | "failure";
  steps: WorkflowStep[];
  createdBy: string;
  createdAt: Date;
}

interface WorkflowTrigger {
  type: "cron" | "event" | "manual" | "ai_proposed";
  config: string; // Cron expression or event filter
}

interface WorkflowStep {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  output?: string;
  error?: string;
}

// AI Performance Dashboard
interface AIPerformanceDashboardProps {
  metrics: AIPerformanceMetrics;
  dateRange: DateRange;
  onViewDetails: (capability: string) => void;
  onInvestigate: (failureId: string) => void;
  onRetrainModel: (capability: string) => void;
  onAdjustThreshold: (capability: string) => void;
}

interface AIPerformanceMetrics {
  totalProposals: number;
  acceptedProposals: number;
  rejectedProposals: number;
  accuracy: number; // 0.0–1.0
  acceptanceRate: number; // 0.0–1.0
  trend: "up" | "down" | "stable";
  capabilityBreakdown: CapabilityMetric[];
  recentFailures: AIFailure[];
}

interface CapabilityMetric {
  capability: string;
  totalProposals: number;
  acceptedProposals: number;
  accuracy: number;
  trend: "up" | "down" | "stable";
}

interface AIFailure {
  id: string;
  capability: string;
  description: string;
  expected: string;
  actual: string;
  confidence: number;
  createdAt: Date;
}

// AI Governance Settings
interface AIGovernanceSettingsProps {
  settings: AIGovernanceConfig;
  onSave: (settings: AIGovernanceConfig) => void;
  onPreview: (settings: AIGovernanceConfig) => void;
}

interface AIGovernanceConfig {
  autoApproveThreshold: number; // 0.0–1.0
  queueThreshold: number; // 0.0–1.0
  discardThreshold: number; // 0.0–1.0
  scope: AIAllowedScope;
  perCapability: Record<string, CapabilityGovernance>;
}

interface AIAllowedScope {
  readEntity: boolean;
  proposeAction: boolean;
  sendNotification: boolean;
  executeWithoutApproval: boolean;
  enrichData: boolean;
  accessSensitiveData: boolean;
  deleteEntity: boolean;
}

interface CapabilityGovernance {
  threshold: number;
  autoApprove: boolean;
  enabled: boolean;
}

// AI Model Management
interface AIModelManagementProps {
  defaultModel: AIModelConfig;
  perCapabilityModels: Record<string, AIModelConfig>;
  usage: AIModelUsage;
  onChangeDefaultModel: (model: AIModelConfig) => void;
  onReassignModel: (capability: string, model: AIModelConfig) => void;
  onTestModel: (model: AIModelConfig, sample: string) => void;
}

interface AIModelConfig {
  model: string; // e.g., "gpt-4o-mini"
  provider: string; // e.g., "openrouter"
  costPerMillionTokens: number;
}

interface AIModelUsage {
  totalTokens: number;
  totalCost: number;
  breakdown: Record<string, number>; // capability → cost
}
```

---

## Appendix: Difference from Audit Logs

| Aspect            | AI Workbench                              | Audit Logs                              |
| ----------------- | ----------------------------------------- | --------------------------------------- |
| **Purpose**       | Human manages AI operations               | Compliance and legal record             |
| **Audience**      | Human operators, AI managers              | Auditors, compliance officers, legal    |
| **Content**       | Proposals, memory, workflows, performance | All system events, data access, changes |
| **Interaction**   | Active — human takes action               | Passive — human reviews                 |
| **UI**            | Rich interactive panels                   | Simple timeline/filter table            |
| **Actions**       | Approve, reject, modify, delete, adjust   | Read, export, search                    |
| **Mutability**    | Human can change AI behavior              | Immutable, append-only                  |
| **Scope**         | AI operations only                        | All operations (human + AI)             |
| **Location**      | Secondary tab in app                      | Admin section or external tool          |
| **Default view**  | Proposals Queue                           | Full event timeline                     |
| **Human control** | High — human adjusts AI settings          | None — read-only compliance             |

**The AI Workbench is the human's control panel for the AI.  
The Audit Logs are the legal record of everything that happened.**

---

## The Human-First AI Workbench Philosophy

```
┌─────────────────────────────────────────────────────────────────┐
│  THE HUMAN-FIRST AI WORKBENCH                                   │
│                                                                 │
│  The AI Workbench is not where the AI lives.                    │
│  It is where the human controls the AI.                         │
│                                                                 │
│  The AI lives in the Capability Layer, watching the Spine.      │
│  The human lives in the Workbench, doing their work.          │
│  When the human wants to manage the AI, they open the AI        │
│  Workbench — a separate, organized, human-controlled surface.   │
│                                                                 │
│  The AI does not own this interface.                            │
│  The human does.                                                │
│  The AI does not use this interface.                            │
│  The human uses it to manage the AI.                            │
│                                                                 │
│  Every AI proposal is a request, not a command.                 │
│  Every AI memory is a suggestion, not a fact.                   │
│  Every AI workflow is a tool, not an autonomous agent.        │
│  Every AI setting is a human decision, not a system default.    │
│                                                                 │
│  The human is the operator.                                     │
│  The AI is the tool.                                            │
│  The AI Workbench is the human's control panel.                 │
│  The Workbench is the human's workspace.                        │
│                                                                 │
│  Two separate surfaces.                                         │
│  One human protagonist.                                         │
│  One AI supporting character.                                   │
│                                                                 │
│  That is the human-first AI Workbench.                        │
└─────────────────────────────────────────────────────────────────┘
```

---

**END OF DOCUMENT**

_IntegrateWise AI Workbench Specification v1.0.0. Human-first. AI-managed. Separated. Organized._
