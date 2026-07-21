# IntegrateWise Release 1.0 Specification


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Platform Doctrine

**One Platform. Many Applications.**

The IntegrateWise Platform is a shared infrastructure that powers multiple user-facing applications. Each application is a projection over the same canonical Spine, Memory, and Governance layers. This document locks the Release 1.0 scope and defines what is complete, MVP, shell-only, or future.

---

## Shared Platform Services

These are built once, used by every application.

### L7 — Identity & Access
**Status: ✅ Complete**

- Stack Auth integration
- Organization creation & management
- Team assignment
- Role-based access control
- User profile management

### L6 — Connected Apps
**Status: 🟡 MVP**

- OAuth connectors (ChatGPT, HubSpot, Slack, Pipedrive, Google Workspace, Microsoft 365, GitHub, Jira)
- Connect UI
- Connector status dashboard
- Basic sync management
- Live sync feedback

### Gateway
**Status: ✅ Complete**

- Request routing
- Identity resolution
- Policy enforcement
- Session management
- Context broker

### Adaptive Spine
**Status: ✅ Complete**

- Schema definition (Customers, Projects, Tasks, Documents, People, etc.)
- Loader (data acquisition)
- Normalizer (canonical transformation)
- Entity360 (unified entity view)

### Memory
**Status: 🟡 MVP**

- Conversation storage
- Timeline UI
- Search interface
- Recent items
- Decision log (shell)
- Organizational memory (shell)

### L5 — Approvals
**Status: 🟡 Shell**

- Approval queue UI
- Empty state
- Basic routing
- Policies (future)
- Governance engine (future)

---

## Experience Levels (Composable)

These can be combined differently per application. Each application selects which levels to emphasize.

### L1 — Workbench (Operational)
**Status: ✅ MVP**

Operational surface where users do daily work.

**Includes:**
- Customers view
- Projects view
- Tasks view
- Documents view
- Timeline view
- Dashboard
- Activity feed

**Excludes:**
- Advanced analytics
- Predictive features

### L2 — Intelligence (Signals & Insights)
**Status: ✅ MVP**

Turn data into actionable awareness.

**Includes:**
- High-value signals (renewed customers, at-risk accounts, new activity)
- Recommendations (next actions)
- Health indicators (customer health, project status)
- What's Changed notifications
- Basic KPIs

**Excludes:**
- Predictive analytics
- Machine learning
- Forecasting

### L3 — Twin (AI Reasoning)
**Status: 🟡 Chat + Shell**

AI assistant for reasoning and collaboration.

**Includes:**
- AI Home (greeting, recent work, model picker)
- Chat interface (Cognitive Twin)
- Basic memory context
- Model selection (ChatGPT, Claude, Gemini)
- Quick prompts

**Excludes:**
- Deep reasoning chains
- Multi-agent collaboration
- Automation execution
- Custom instructions

### L4 — Memory (Continuity)
**Status: 🟡 Shell + Search**

Shared organizational knowledge and continuity.

**Includes:**
- Search interface
- Timeline view
- Recent conversations list
- Conversation history
- Personal memory (decisions, preferences, context)

**Excludes:**
- Organizational memory graph
- Knowledge relationships
- Semantic search
- Inference over memory

---

## Applications

### AI Workspace
**Status: ✅ Live**

The flagship Release 1.0 application.

**Composition:**
- L3 Twin (primary)
- L4 Memory (search, timeline, recent)
- L2 Intelligence (cards on home)
- Minimal L1 (recent work, quick actions)

**Routes:**
- `/workspace` — AI Home
- `/workspace/chat` — Twin Chat
- `/workspace/memory` — Search & Timeline
- `/workspace/actions` — Recent Actions

---

### Sales Workbench
**Status: 🟡 Navigation Shell**

Sales-focused operational application. Coming in v1.1.

**Composition:**
- L1 Workbench (Accounts, Opportunities, Pipeline)
- L2 Intelligence (pipeline health, stage analysis)
- L3 Twin (embedded, sales-focused)
- L4 Memory (search, decision log)

**Routes:**
- `/sales` — Dashboard
- `/sales/accounts` — Customer list
- `/sales/opportunities` — Opportunity pipeline
- `/sales/twin` — Sales AI

---

### Customer Success Workbench
**Status: 🟡 Navigation Shell**

Customer Success-focused operational application. Coming in v1.1.

**Composition:**
- L1 Workbench (Customers, Health, Renewals, Tickets)
- L2 Intelligence (renewal risk, health trends)
- L3 Twin (embedded, CS-focused)
- L4 Memory (search, relationships)

**Routes:**
- `/cs` — Dashboard
- `/cs/customers` — Customer list
- `/cs/health` — Health scores
- `/cs/renewals` — Renewal pipeline
- `/cs/twin` — CS AI

---

### Wise Docs
**Status: 🟡 Navigation Shell**

Knowledge and documentation hub. Coming in v1.2.

**Composition:**
- L1 (Documents, Knowledge Base)
- L4 Memory (search, relationships, timeline)
- L3 Twin (embedded, docs-focused)

---

### Wise Ops
**Status: 🟡 Navigation Shell**

Operations and infrastructure dashboard. Coming in v1.2.

**Composition:**
- L1 (Deployments, Infrastructure, Health)
- L2 Intelligence (system health, alerts)
- L3 Twin (ops-focused AI)

---

### Wise Branding
**Status: 🟡 Navigation Shell**

Brand asset and marketing resource hub. Coming in v1.3.

**Composition:**
- L1 (Assets, Templates, Brand Kit)
- L4 Memory (search, asset relationships)
- L3 Twin (brand-focused)

---

### Wise ERMS
**Status: 🟡 Navigation Shell**

Employee resource and people management system. Coming in v1.3.

**Composition:**
- L1 (People, Roles, Teams)
- L5 Approvals (role changes, policy enforcement)
- L3 Twin (people-focused)

---

### Admin / Settings
**Status: ✅ Shell**

Platform administration and user management.

**Includes:**
- Organization settings
- Team management
- Role administration
- User directory
- Connector management
- API keys
- Audit log

---

## Data Flow: First-Time Experience

```
1. Sign In (Stack Auth)
   ↓
2. Create/Join Organization
   ↓
3. Assign Role
   ↓
4. Connect Applications
   ↓
5. IW Bridge establishes trust & context
   ↓
6. Loader acquires initial data
   ↓
7. Normalizer transforms to canonical schema
   ↓
8. Adaptive Spine hydrates with initial data
   ↓
9. Memory initializes
   ↓
10. User Workbench opens (Spine ready, ingestion continues)
```

**Key point:** Users don't wait for all connectors to finish. They land in the Workbench while background syncs continue.

---

## Data Flow: Ongoing Usage

```
User asks question via Twin
   ↓
Twin reads Spine + Memory
   ↓
Does Twin need fresh data?
   ├─ No → Answer from Spine
   └─ Yes → Trigger Loader
      ↓
   Loader acquires fresh data
      ↓
   Normalizer transforms
      ↓
   Spine hydrated with updates
      ↓
   Twin answers from updated Spine
      ↓
   Response shown in Twin + Workbench
```

---

## Navigation Structure

All applications accessible from left sidebar.

```
🏠 Home

─── Customer Apps ───
📊 AI Workspace
📈 Sales Workbench (Coming Soon)
🤝 Customer Success (Coming Soon)

─── Company Apps ───
📄 Wise Docs (Coming Soon)
⚙️ Wise Ops (Coming Soon)
🎨 Wise Branding (Coming Soon)
👥 Wise ERMS (Coming Soon)

─── Platform ───
💡 Insights
✅ Approvals
🔗 Connected Apps

─── Settings ───
⚙️ Settings
📋 Admin
```

---

## Release Checklist

### Platform Services
- [x] Stack Auth integration
- [x] Gateway + session management
- [x] Adaptive Spine + schema
- [x] Loader + Normalizer
- [x] Entity360
- [x] Memory (basic)
- [x] Connected Apps (OAuth)
- [x] Approval queue (shell)

### AI Workspace
- [x] AI Home
- [x] Twin Chat
- [x] Memory Search
- [x] Memory Timeline
- [x] Recent Actions

### Navigation & Admin
- [x] Sidebar with all apps
- [x] Settings page
- [x] Connector management
- [x] User directory

### Shells (Visible, Not Functional)
- [ ] Sales Workbench nav
- [ ] Customer Success nav
- [ ] Wise Docs nav
- [ ] Wise Ops nav
- [ ] Wise Branding nav
- [ ] Wise ERMS nav

---

## What's NOT in Release 1.0

- Predictive analytics
- Machine learning models
- Multi-agent reasoning
- Automation execution
- Advanced governance policies
- Knowledge graphs
- Organizational memory beyond basic timeline
- Role-based workbenches (Sales, CS, Ops, Executive)
- Write-back to external systems
- Custom workflows
- Marketplace
- Advanced connector management

---

## Release 1.1 Roadmap

- Conversational memory for Twin
- Smarter Twin (better context, follow-up questions)
- More Intelligence signals
- Operational dashboards

## Release 1.2 Roadmap

- Organizational Memory (shared knowledge)
- People & project relationships
- Wise Docs full implementation
- Wise Ops implementation

## Release 1.3 Roadmap

- Governance policies
- Approval workflows
- Wise Branding full implementation
- Wise ERMS full implementation

---

## Principle

Every Release 1.0 decision is made with the long-term vision in mind. No technical debt. No rework. Applications and features are built to last.
