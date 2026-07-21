# IntegrateWise — Workbench Experience Package

**Status**: DRAFT — for product/experience review  
**Source of truth**: `docs/architecture/WORKBENCH_MATRIX.md`, `docs/architecture/PLATFORM_LOCK_v1.0.md`  
**Mandatory constraint**: One Workbench surface. No L1/L2/L4/L7 UI labels.

---

## 1. Core belief

The Workbench is not a dashboard. It is an **operational surface**.

The user does not switch contexts to work.
They stay in one place. Connected systems appear here when needed.
AI stays in the background until it is valuable.

---

## 2. What the user experiences

### 2.1 Layout

```
┌───────────────────────────────────────────────────────────────┐
│ Workspace shell                                              │
│ ┌─────────────────┐ ┌───────────────────────────────────────┐ │
│ │ Sidebar         │ │ Content                               │ │
│ │                 │ │                                       │ │
│ │ [Brand]         │ │ Current view:                         │ │
│ │                 │ │  • Home                                │ │
│ │ --- Work ---    │ │  • Accounts / Contacts                │ │
│ │ > Work          │ │  • Tasks / Calendar / Docs            │ │
│ │   Accounts      │ │  • Analytics / Projects               │ │
│ │   Contacts      │ │                                       │ │
│ │   Deals         │ │ ┌───────────────────────────────────┐ │ │
│ │   Tickets       │ │ │ Operational capability bar        │ │ │
│ │                 │ │ │ [Call] [Email] [Slack] [Schedule] │ │ │
│ │ --- Self ---    │ │ │ [Create task] [Open file] [Share] │ │ │
│ │   Tasks         │ │ └───────────────────────────────────┘ │ │
│ │   Calendar      │ │                                       │ │
│ │   Notes         │ │ Detail cards:                         │ │
│ │   Knowledge     │ │ • Summary / health / signals          │ │
│ │                 │ │ • Recent activity timeline            │ │
│ │ --- Platform ---│ │ • Connected entity list               │ │
│ │ > Activation    │ │                                       │ │
│ │   Integrations  │ │                                       │ │
│ │   Configuration │ │                                       │ │
│ │   Governance    │ │                                       │ │
│ │   Continuity    │ │                                       │ │
│ │   Network       │ │                                       │ │
│ │                 │ │                                       │ │
│ │ © Twin          │ │                                       │ │
│ └─────────────────┘ └───────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

Rules:

- Sidebar shows **real control surfaces**, never architecture labels.
- `Twin` is not a sidebar destination. It is a **capability** inside the Workbench.
- Content area changes with the active module. Capability bar stays contextual.

---

### 2.2 User mental model

| The user thinks...                    | The platform does...                           |
| ------------------------------------- | ---------------------------------------------- |
| Where is everything for this account? | One Account view, all connected context        |
| How do I contact this person?         | `Call` / `Email` / `Message` in capability bar |
| What is happening right now?          | Signals + timeline via Continuity              |
| Can I delegate this?                  | `Assign your Twin` via OODA grammar            |
| Is this safe to execute?              | `Approve Twin’s Action` via Governance         |
| Who do I become here?                 | Role projection changes modules/capabilities   |

---

## 3. Module anatomy

### 3.1 Home

Default landing inside `/app`.

Shows:

- Active work summary for the selected role
- Entities needing attention
- Signals from Continuity
- Suggested actions

No duplicate navigation. Home is a dashboard, not a menu.

### 3.2 Work modules

Department-specific operational views:

- Accounts
- Contacts
- Deals / Opportunities
- Tickets / Cases
- Projects / Tasks
- Meetings / Calendar
- Documents / Knowledge
- Analytics

Each module shows the same **entity grammar**:

```
Entity header
  • Identity fields
  • Status / health
  • Key numbers

Context panel
  • Connected records
  • Activity timeline
  • Linked entities

Operational bar
  • Contextual verbs only
  • Disabled when no provider is connected
  • Deep link when provider supports richer action
```

### 3.3 Self modules

Personal workspace:

- Tasks
- Calendar
- Notes
- Knowledge / Memory
- Personal signals

These are personal projections of the same Spine data. Not a separate product.

### 3.4 Platform modules

Real control surfaces, always available:

- **Activation Hub** — finish onboarding, enable intelligence
- **Integration Manager** — connect providers, manage auth/sync
- **Configuration Manager** — tenant schema, depth matrix, policies
- **Network Graphs** — Spine relationships
- **Governance** — approvals, audit, policy gates
- **Continuity** — memory, context timeline

No “settings.” Everything has a name.

---

## 4. Operational capability grammar

The capability bar is **the same grammar everywhere**.
Only the available verbs change by entity type and connected providers.

### 4.1 Universal verbs

| Verb         | Meaning                  | Provider targets               |
| ------------ | ------------------------ | ------------------------------ |
| **View**     | Open canonical entity    | CRM, GitHub, Notion, Jira      |
| **Open**     | Open in native app       | Salesforce, HubSpot, Linear    |
| **Create**   | Create linked record     | Any connected provider         |
| **Message**  | Send message             | Slack, Teams, Gmail, Outlook   |
| **Call**     | Place call / open dialer | Zoom, Teams, Airwatch          |
| **Email**    | Compose email            | Gmail, Outlook                 |
| **Schedule** | Create meeting           | Calendar, Calendly, Zoom       |
| **Share**    | Share record / link      | Any provider with share action |
| **Assign**   | Delegate via Twin        | Twin runtime                   |
| **Approve**  | Execute approved action  | Governance + Hermes            |

### 4.2 Rules

1. **Max 6 visible verbs** per context. Rest hidden under `More`.
2. **Disabled state only** when no provider supports the verb. Never hide capability entirely.
3. **Deep link always preferred** over embedding. Workbench opens native surface when action is non-trivial.
4. **Twin verbs** (`Assign`, `Approve`) are governed. They route through the OODA grammar, not direct execution.

---

## 5. Twin placement

Twin is **not**:

- a left sidebar icon
- a right panel
- a chat widget
- a button in the capability bar

Twin is:

- ambient signal in the header when there is material output
- contextual suggestion inside the capability bar when user is stuck
- surfaced via `Ask your Twin` / `Assign your Twin` buttons

Default silence law applies.

---

## 6. Experience quality rules

1. **One mental model**: “What am I trying to do?”
2. **No app switching penalty**: Workbench opens native app only when needed, with return path.
3. **No duplicate data entry**: Spine is the source of truth. Connected app edits sync back.
4. **No feature discovery tax**: Platform modules are real controls, not settings.
5. **No dead screens**: Every view has actions or explicitly explains why actions are unavailable.

---

## 7. Minimum lovable Workbench (v0)

Deliver exactly these views first:

1. Home — work summary
2. Accounts — operational surface
3. Contacts — operational surface
4. Tasks — self operational surface
5. Calendar — self operational surface
6. Knowledge — personal + team artifacts
7. Integration Manager — connect providers
8. Activation Hub — onboarding completion
9. Governance — approvals
10. Continuity — memory

Everything else is Phase 1+.

---

## 8. Non-negotiables

- One Workbench. No L1/L2/L4/L7 in the UI.
- Sidebar shows Platform modules and Work modules. Nothing else.
- Capability bar is contextual, not global.
- Twin is silent by default.
- AI is infrastructure. User never sees model selection, providers, tokens, or config unless explicitly needed.

---

**Tagline**:  
**Truth you own. AI you rent. Approval in between.**
