# Customer Zero Daily Operating Manual

Status: DRAFT
Scope: Operational rhythm for IntegrateWise running IntegrateWise — not UI screens, but what happens, when, with which entities, Twin behavior, capabilities, governance, and memory promotion.
Canonical Owner: IntegrateWise Platform
Last Verified: 2026-07-20

---

## 1. Purpose

This document describes **how the company operates**.

`Customer Zero Constitution` defines departments, roles, objectives, workflows, KPIs, approvals, and execution plans.

`Adaptive Workbench Constitution` defines what each screen contains.

This document defines the **daily operational rhythm** that ties them together.

---

## 2. How to read this document

Each event follows this structure:

```text
TIME: HH:MM
Event: Name
Duration: X min
Departments: ...
Attendees: ...
Views opened: ...
Entities involved: ...
Twin observations: ...
Decisions expected: ...
Capabilities executed: ...
Governance required: ...
Memory promoted: ...
```

Abbreviations:

- **Twin**: IntegrateWise cognitive runtime
- **Cap**: canonical capability contract
- **Spine**: canonical runtime substrate
- **OODA**: Observe → Orient → Decide → Act
- **Memory**: promoted continuity record in Spine

---

## 3. Daily rhythm

### 08:00 — Founder Brief

- **Event**: Founder Brief
- **Duration**: 15 min
- **Departments**: Founder
- **Attendees**: Founder only
- **Views opened**: Founder's Cockpit, Intelligence Center
- **Entities involved**: account, opportunity, campaign, incident, invoice, employee, project
- **Twin observations**:
  - Overnight health changes
  - Renewal/watchlist changes
  - Incident/severe ticket escalations
  - Campaign performance deltas
  - Cash/burn movement
  - Hiring pipeline update
  - Board/legal/compliance deadlines
- **Decisions expected**:
  - Which accounts need immediate executive attention
  - Which risks require resource reallocation
  - Which campaigns need budget or messaging change
- **Capabilities executed**:
  - `dashboard.view`
  - `report.generate`
  - `alert.configure`
- **Governance required**: none for read-only brief
- **Memory promoted**: founder daily brief record, prioritized decisions log

### 09:00 — Engineering Standup

- **Event**: Engineering Standup
- **Duration**: 30 min
- **Departments**: Engineering
- **Attendees**: Engineering Lead, QA, Engineering Manager
- **Views opened**: Dashboard, Sprints, Incidents, Deployments
- **Entities involved**: sprint, task, bug, incident, deployment
- **Twin observations**:
  - Sprint burndown and blockers
  - Overnight incident activity
  - Deployment health and rollback risk
  - Bug severity trends
  - PR review backlog
- **Decisions expected**:
  - Blocker resolution assignment
  - Hotfix approval
  - Sprint scope adjustment
- **Capabilities executed**:
  - `sprint.view`
  - `issue.create`
  - `deployment.view`
  - `task.create`
  - `message.send`
- **Governance required**: medium/high-risk mutations require Engineering Manager approval
- **Memory promoted**: standup summary, blocker register, sprint commitment delta

### 10:00 — Customer Health Review

- **Event**: Customer Health Review
- **Duration**: 45 min
- **Departments**: Customer Success
- **Attendees**: CSM Lead, CSMs, CS Manager
- **Views opened**: CSM Dashboard, Accounts, Renewals, Risk Matrix
- **Entities involved**: account, renewal, risk, engagement, task
- **Twin observations**:
  - Health drops and engagement gaps
  - Renewal window accounts
  - At-risk account clustering
  - Open ticket severity and aging
  - Expansion signals
- **Decisions expected**:
  - At-risk account intervention plan
  - Renewal sequencing and QBR scheduling
  - Escalation to founder/Sales where ARR warrants
  - Next-best-action assignment per account
- **Capabilities executed**:
  - `account.view`, `account.update`
  - `renewal.view`, `renewal.update`
  - `risk.create`, `risk.update`
  - `meeting.schedule`
  - `task.create`
  - `message.send`
- **Governance required**: account updates and renewal changes require CS Manager approval
- **Memory promoted**: customer health summary, renewal watchlist, risk register update

### 11:00 — Revenue Review

- **Event**: Revenue Review
- **Duration**: 30 min
- **Departments**: Sales, Finance, RevOps
- **Attendees**: Sales Manager, RevOps Analyst, Finance Manager
- **Views opened**: Sales Pipeline, Deals, Revenue Waterfall, Finance Dashboard
- **Entities involved**: opportunity, deal, forecast, invoice, payment
- **Twin observations**:
  - Forecast vs quota gap
  - Stale deals and stage slippage
  - Collections and invoice aging
  - Budget variance explanations
  - Coverage risk by segment
- **Decisions expected**:
  - Forecast adjustment and rationale
  - Deal coaching priorities
  - Pricing or exception approval if needed
  - Collection action priority
- **Capabilities executed**:
  - `opportunity.view`, `opportunity.update`
  - `forecast.view`, `forecast.update`
  - `invoice.view`
  - `payment.record`
  - `report.generate`
  - `message.send`
- **Governance required**: forecast update and quota adjustment require VP/Sales Director approval
- **Memory promoted**: revenue narrative, forecast assumption log, deal risk register

### 13:00 — Marketing Campaign Review

- **Event**: Marketing Campaign Review
- **Duration**: 30 min
- **Departments**: Marketing
- **Attendees**: Marketing Manager, Campaign Ops
- **Views opened**: Marketing Dashboard, Campaigns, Attribution, Ads, Forms
- **Entities involved**: campaign, lead, attribution, form, ad, content
- **Twin observations**:
  - Campaign performance vs target
  - MQL quality trends
  - Cost per lead and paid ROI
  - Content/audience fatigue signals
  - Hot lead alerts for Sales
- **Decisions expected**:
  - Campaign pause/resume/budget reallocation
  - Audience or messaging adjustment
  - A/B test launch decision
  - Content calendar priority
- **Capabilities executed**:
  - `campaign.view`, `campaign.update`
  - `lead.view`, `lead.assign`
  - `email.draft`, `email.send`
  - `report.generate`
  - `message.send`
- **Governance required**: campaign launch and budget increase require Marketing Manager approval
- **Memory promoted**: campaign decision log, budget reallocation rationale, lead routing changes

### 15:00 — Product Planning

- **Event**: Product Planning
- **Duration**: 45 min
- **Departments**: Product, Engineering
- **Attendees**: Product Manager, Engineering Lead, QA Lead
- **Views opened**: Product Roadmap, Sprints, Customer Feedback, Bugs, Releases
- **Entities involved**: feature, epic, sprint, story, bug, feedback, release
- **Twin observations**:
  - Feedback theme clusters
  - Blocker and dependency mapping
  - Sprint capacity vs commitment
  - Critical bug trajectory
  - Competitive feature gaps
- **Decisions expected**:
  - Sprint scope adjustment
  - Bug triage and assignment
  - Feature prioritization
  - Release readiness gate
- **Capabilities executed**:
  - `feature.view`, `feature.prioritize`
  - `bug.view`, `bug.triage`, `bug.assign`
  - `sprint.view`, `sprint.update`
  - `release.view`, `release.schedule`
  - `feedback.cluster`
  - `prd.draft`
  - `meeting.schedule`
- **Governance required**: release promotion and scope changes require Engineering Manager + Product Manager approval
- **Memory promoted**: product decision log, sprint scope delta, release readiness notes

### 17:00 — Operational Summary

- **Event**: Operational Summary
- **Duration**: 20 min
- **Departments**: Founder, BizOps
- **Attendees**: Founder, COO or BizOps Analyst
- **Views opened**: Founder's Cockpit, COO Dashboard, Executive Dashboards
- **Entities involved**: workflow, incident, ops_metric, initiative, forecast, account
- **Twin observations**:
  - Cross-functional bottlenecks
  - Workflow failure clusters
  - Ops metric deviations
  - Forecast accuracy and variance
  - Initiative progress and blockers
- **Decisions expected**:
  - Resource reallocation
  - Process or policy changes
  - Weekly priorities for next day
  - Escalation items for Founder Brief
- **Capabilities executed**:
  - `workflow.view`, `workflow.update`
  - `metric.configure`
  - `alert.configure`
  - `report.generate`
  - `message.send`
- **Governance required**: process and budget changes require Founder approval
- **Memory promoted**: operational summary, daily priority list, exception log

### 19:00 — Executive Digest

- **Event**: Executive Digest
- **Duration**: 10 min
- **Departments**: Founder, Customer Success, Sales, Marketing, Finance, Engineering, Product, Operations
- **Attendees**: Founder, department heads as applicable
- **Views opened**: Intelligence Center, Executive Dashboards, Finance Dashboard
- **Entities involved**: account, opportunity, campaign, invoice, incident, project, employee
- **Twin observations**:
  - Portfolio, pipeline, product, customer, cash, risk, hiring, roadmap, and strategy signals
  - Cross-department pattern anomalies
  - Board/investor narrative gaps
  - Upcoming deadlines and compliance windows
- **Decisions expected**:
  - High-level priority confirmation
  - Required approvals carried over to next day
  - Narrative alignment for external communications
- **Capabilities executed**:
  - `dashboard.view`
  - `report.generate`
  - `forecast.view`
  - `message.send`
  - `meeting.schedule`
- **Governance required**: strategic decisions and external communications require Founder approval
- **Memory promoted**: executive decisions log, board narrative, risk register, priority carry-over

---

## 4. Recurring cadences

| Cadence   | Event                     | Primary Departments    | Deliverable                         |
| --------- | ------------------------- | ---------------------- | ----------------------------------- |
| Daily     | Founder Brief             | Founder                | prioritized decisions log           |
| Daily     | Engineering Standup       | Engineering            | blocker register                    |
| Daily     | Customer Health Review    | Customer Success       | renewal watchlist                   |
| Daily     | Revenue Review            | Sales, Finance, RevOps | forecast assumption log             |
| Daily     | Marketing Campaign Review | Marketing              | campaign decision log               |
| Daily     | Product Planning          | Product, Engineering   | sprint scope delta                  |
| Daily     | Operational Summary       | Founder, BizOps        | daily priority list                 |
| Daily     | Executive Digest          | Founder, All           | executive decisions log             |
| Weekly    | Sales Pipeline Review     | Sales, RevOps          | forecast and deal risk              |
| Weekly    | Support Quality Review    | Support, CS            | CSAT and escalation trends          |
| Weekly    | Finance Close Review      | Finance                | P&L and burn review                 |
| Weekly    | Hiring Review             | HR, Founder            | hiring pipeline update              |
| Weekly    | Security/IT Review        | IT                     | incident and patch review           |
| Biweekly  | Board/Investor Update     | Founder, Finance       | board materials                     |
| Monthly   | OKR Review                | All                    | OKR progress and adjustments        |
| Monthly   | Budget Review             | Finance, Founder       | budget reforecast                   |
| Quarterly | Contract + Renewal Review | CS, Sales, Legal       | renewal pipeline and legal pipeline |
| Quarterly | Strategy Review           | Founder, Product       | roadmap and strategy alignment      |

---

## 5. Example execution: Renewal approval for Acme Corp

**Trigger**: Renewal in 23 days, health 62, last exec engagement 45 days ago.

**Workflow**:

1. Twin observes renewal window + engagement gap + support tickets
2. CSM opens Accounts/Renewals view
3. Twin proposes recovery plan with evidence chain
4. CSM escalates to Manager approval
5. Manager approves renewal + exec check-in
6. Capabilities execute: `account.update`, `meeting.schedule`, `message.send`, `task.create`
7. Timeline and notifications side effects commit to Spine
8. Projection refresh shows updated status

**Views**: Accounts, Renewals, Risk Matrix
**Entities**: account, renewal, risk, task, engagement
**Twin**: observe → orient → decide → act
**Approval**: CS Manager
**Memory**: renewal outcome, engagement cadence change, risk mitigation notes

---

## 6. Example execution: LinkedIn campaign launch

**Trigger**: MQL drop in India SaaS segment; LinkedIn historically outperforms Google Ads 3x for this audience.

**Workflow**:

1. Twin observes MQL drop + historical channel performance
2. Marketing Manager opens Marketing Dashboard/Campaigns
3. Twin proposes LinkedIn campaign with audience, budget, and expected MQLs
4. Marketing Manager approves launch
5. Capabilities execute: `campaign.create`, `ad.adjust`, `form.create`, `workflow.create`, `message.send`
6. Sales notified of hot leads
7. Projection refresh shows new campaign status

**Views**: Marketing Dashboard, Campaigns, Attribution
**Entities**: campaign, lead, attribution, form, ad, workflow
**Twin**: observe → orient → decide → act
**Approval**: Marketing Manager
**Memory**: campaign launch record, ROI expectation, lead routing rule

---

## 7. Governance rules by event

| Event                  | Auto-Approve                      | Requires Approval                          | Risk   |
| ---------------------- | --------------------------------- | ------------------------------------------ | ------ |
| Founder Brief          | read-only                         | none                                       | Low    |
| Engineering Standup    | task.create, message.send         | sprint update, hotfix                      | Medium |
| Customer Health Review | task.create, message.send         | account.update, renewal.draft, risk.create | High   |
| Revenue Review         | report.generate, message.send     | forecast.update, quota.adjust              | High   |
| Campaign Review        | report.generate, pause/resume     | campaign launch, budget change             | Medium |
| Product Planning       | feedback.cluster, report.generate | feature.create, release.schedule           | Medium |
| Operational Summary    | report.generate, alert.configure  | workflow.update, process.update            | Medium |
| Executive Digest       | report.generate, dashboard.view   | strategic decisions                        | High   |

---

## 8. Memory promotion rules

After every event, promote continuity to Spine:

1. Event summary with attendees and duration
2. Decisions made and owners
3. Actions created and assignees
4. Capabilities executed and adapters used
5. Approval chain and tokens
6. Outcome status and sync status
7. Follow-up required and due date

Memory promotion is mandatory for:

- high-risk executed plans
- cross-department decisions
- founder/executive approvals
- external sends to customers, vendors, regulators

---

## 9. Relationship to other constitutions

- **Customer Zero Constitution**: what IntegrateWise is as an organization
- **Adaptive Workbench Constitution**: what each screen shows
- **Canonical Entity Constitution**: entity shapes and state machines
- **Capability Constitution**: business-intent contracts
- **Twin Constitution**: runtime behavior and continuity memory
- **Execution Constitution**: governed execution lifecycle
- **Runtime Constitution**: Cloudflare substrate and communication hierarchy
