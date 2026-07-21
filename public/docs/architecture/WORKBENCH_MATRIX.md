# IntegrateWise — Workbench Matrix (Canonical)

**Status**: FROZEN
**Date**: July 17, 2026
**Source**: Founder specification

---

# The Workbench

> **The User Workbench is the role-specific projection of work and context presented to a human.**

One surface. One sidebar. No L1/L2/L4/L7 layers in the UI.

---

# Sidebar = Capability Navigation

```
┌────────────────────────────────────────────────────────────┐
│ Header                                                     │
├──────────────┬─────────────────────────────────────────────┤
│ Left Sidebar │                                             │
│              │          Active Workspace                   │
│              │                                             │
│ ── Operational ──                                          │
│ Home         │                                             │
│ Accounts     │                                             │
│ Contacts     │                                             │
│ Meetings     │                                             │
│ Tasks        │                                             │
│ Calendar     │                                             │
│ Docs         │                                             │
│ Knowledge    │                                             │
│ Analytics    │                                             │
│              │                                             │
│ ── Platform ──                                             │
│ Continuity   │                                             │
│ Governance   │                                             │
│ Integrations │  (Integration Manager)                     │
│ Configuration│  (Configuration Manager)                    │
│ Activation   │  (Activation Hub)                           │
│ Network Graphs│ (Spine relationship graph)                │
│ Settings     │                                             │
│              │                                             │
│ Twin: NOT a sidebar item. It surfaces contextually,      │
│       invoked by "Ask your Twin" / "Assign your Twin".    │
│              │                                             │
└──────────────┴─────────────────────────────────────────────┘
```

> **Platform section = the platform control surfaces.** Each is a real module
> wired to the platform, not an architectural layer and not the Twin.
>
> - **Integrations** → Integration Manager (connectors, sync, webhooks, schemas)
> - **Configuration** → Configuration Manager (tenant schema, depth matrix, policies)
> - **Activation** → Activation Hub (onboarding completion, intelligence activation)
> - **Network Graphs** → Spine entity relationship graph
> - **Governance** → Approvals, audit, policy gates
> - **Continuity** → Memory, context
>
> **Twin is silent by default.** It is NOT a permanent sidebar destination, panel, or layer.
> It observes the pipeline continuously and surfaces only when there is material value
> or when the user explicitly engages via the Four Buttons.

---

# Role → Sidebar Projection

## Customer Success

```
── Operational ──
Home
Accounts
Contacts
Meetings
Tasks
Calendar
Risks
Renewals
Analytics
── Platform ──
Continuity
Governance
Integrations
Configuration
Activation
Network Graphs
Settings
(Twin is silent — surfaces contextually, not a nav item)
```

**Connected Systems**: Salesforce, HubSpot, Gainsight, Slack, Gmail, Calendar
**AI Capabilities**: Risk Prediction, Next Best Action, Meeting Intelligence
**Operational Features**: QBRs, Health Scores, Expansion, Renewals

---

## Sales

```
── Operational ──
Home
Pipeline
Accounts
Contacts
Meetings
Tasks
Calendar
Docs
Analytics
── Platform ──
Continuity
Governance
Integrations
Configuration
Activation
Network Graphs
Settings
(Twin is silent — surfaces contextually, not a nav item)
```

**Connected Systems**: Salesforce, HubSpot, Outreach, LinkedIn
**AI Capabilities**: Deal Intelligence, Forecasting, Opportunity Scoring
**Operational Features**: Pipeline Reviews, Forecasting, Approvals

---

## Support

```
── Operational ──
Home
Tickets
Customers
Knowledge Base
Incidents
Analytics
── Platform ──
Continuity
Governance
Integrations
Configuration
Activation
Network Graphs
Settings
(Twin is silent — surfaces contextually, not a nav item)
```

**Connected Systems**: Zendesk, Freshdesk, Jira, Slack
**AI Capabilities**: Case Summaries, Auto Classification, Suggested Resolution
**Operational Features**: SLA Tracking, Escalations, Incident Response

---

## Project Management

```
── Operational ──
Home
Projects
Tasks
Sprints
Roadmaps
Knowledge
Analytics
── Platform ──
Continuity
Governance
Integrations
Configuration
Activation
Network Graphs
Settings
(Twin is silent — surfaces contextually, not a nav item)
```

**Connected Systems**: Jira, Linear, Asana, GitHub
**AI Capabilities**: Delivery Intelligence, Sprint Analysis
**Operational Features**: Resource Planning, Dependencies, Risks

---

## Marketing

```
── Operational ──
Home
Campaigns
Leads
Content
Analytics
── Platform ──
Continuity
Governance
Integrations
Configuration
Activation
Network Graphs
Settings
(Twin is silent — surfaces contextually, not a nav item)
```

**Connected Systems**: HubSpot, Google Analytics, Meta, LinkedIn
**AI Capabilities**: Campaign Intelligence, Attribution, Content Assistant
**Operational Features**: Campaign Planning, ROI Analysis

---

## Business Operations

```
── Operational ──
Home
Operations
Processes
Workflows
KPIs
── Platform ──
Continuity
Governance
Integrations
Configuration
Activation
Network Graphs
Settings
(Twin is silent — surfaces contextually, not a nav item)
```

**Connected Systems**: ERP, CRM, HRIS, Finance
**AI Capabilities**: Operational Twin, Process Mining
**Operational Features**: Cross-functional Coordination

---

## Technology

```
── Operational ──
Home
Repositories
Services
APIs
Infrastructure
Knowledge
Analytics
── Platform ──
Continuity
Governance
Integrations
Configuration
Activation
Network Graphs
Settings
(Twin is silent — surfaces contextually, not a nav item)
```

**Connected Systems**: GitHub, Cloudflare, Vercel, Kubernetes
**AI Capabilities**: Code Intelligence, Architecture Advisor
**Operational Features**: Deployments, Incidents, Change Management

---

## Human Resources

```
── Operational ──
Home
Employees
Hiring
Performance
Analytics
── Platform ──
Continuity
Governance
Integrations
Configuration
Activation
Network Graphs
Settings
(Twin is silent — surfaces contextually, not a nav item)
```

**Connected Systems**: Workday, BambooHR, Greenhouse
**AI Capabilities**: Talent Intelligence, Hiring Assistant
**Operational Features**: Reviews, Onboarding, Compliance

---

## Finance

```
── Operational ──
Home
Revenue
Expenses
Billing
Forecasting
Analytics
── Platform ──
Continuity
Governance
Integrations
Configuration
Activation
Network Graphs
Settings
(Twin is silent — surfaces contextually, not a nav item)
```

**Connected Systems**: NetSuite, QuickBooks, Stripe
**AI Capabilities**: Financial Intelligence, Variance Analysis
**Operational Features**: Budgeting, Approvals, Close Process

---

## Legal

```
── Operational ──
Home
Contracts
Policies
Compliance
Analytics
── Platform ──
Continuity
Governance
Integrations
Configuration
Activation
Network Graphs
Settings
(Twin is silent — surfaces contextually, not a nav item)
```

**Connected Systems**: DocuSign, Ironclad, Google Drive
**AI Capabilities**: Contract Intelligence, Clause Review
**Operational Features**: Approvals, Compliance Tracking

---

## Founder (Customer Zero)

```
── Operational ──
All operational modules (union of all roles)
── Platform ──
Continuity, Governance, Integrations, Settings
(Twin is silent — surfaces contextually, not a nav item)
```

**Connected Systems**: All connected systems
**AI Capabilities**: Executive Twin, Cross-domain Intelligence, Predictive Insights
**Operational Features**: Governance, Continuity, Approvals, KPIs, Command Center

---

## Personal

```
── Operational ──
Tasks
Calendar
Notes
Goals
Personal KB
── Platform ──
Continuity
Governance
Integrations
Configuration
Activation
Network Graphs
Settings
(Twin is silent — surfaces contextually, not a nav item)
```

**Connected Systems**: Gmail, Calendar, Notion
**AI Capabilities**: Personal Twin, Daily Briefing
**Operational Features**: Personal Productivity

---

# The User Never Sees Layers

| ❌ Never in UI      | ✅ Always in UI   |
| ------------------- | ----------------- |
| "Open L2"           | "Open Twin"       |
| "Switch to L4"      | "Open Continuity" |
| "Go to L7"          | "Open Governance" |
| "Layer 1 Workbench" | "Open Home"       |

---

# Internal Architecture (invisible to user)

```
Workbench (UI)
    ↓
Continuity (L4 — memory, context)
Governance (L7 — approvals, policies)
Twin (L2 — cognitive overlay)
Spine (SSOT)
Gateway (routing)
MCP (capabilities)
```

---

# Documentation Convention

| Context              | Reference                                                                   |
| -------------------- | --------------------------------------------------------------------------- |
| **Product docs**     | Workbench, Operational Modules, Platform Capabilities, Twin, Adaptive Spine |
| **Engineering docs** | L1 (Workbench), L2 (Cognitive), L4 (Memory), L7 (Governance)                |
| **User-facing**      | Never mention L1–L7                                                         |

---

# Implementation Reference

## packages/workbench-config/

```typescript
// Each role config defines:
interface RoleConfig {
  id: RoleId;
  label: string;
  sidebar: {
    operational: ModuleId[]; // role-specific modules
    platform: PlatformCapability[]; // shared across all roles
  };
  connectedSystems: ConnectedSystem[];
  aiCapabilities: AiCapability[];
  operationalFeatures: OperationalFeature[];
}
```

## apps/web/

```typescript
// Sidebar renders based on role config
function Sidebar({ role }: { role: RoleId }) {
  const config = getRoleConfig(role);
  return (
    <nav>
      <Section label="Operational">
        {config.sidebar.operational.map(m => <NavItem key={m.id} {...m} />)}
      </Section>
      <Section label="Platform">
        {config.sidebar.platform.map(c => <NavItem key={c.id} {...c} />)}
      </Section>
    </nav>
  );
}
```
