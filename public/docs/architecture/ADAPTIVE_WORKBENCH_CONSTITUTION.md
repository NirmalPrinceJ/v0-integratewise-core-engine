# Adaptive Workbench Constitution

Status: CANONICAL
Scope: Exact view-level operational wiring — departments, roles, views, connectors, KPIs, Twin OODA, Twin KPIs, capabilities.
Canonical Owner: IntegrateWise Platform
Last Verified: 2026-07-20

---

## 1. View Catalog by Department

### Account Success

Views:

- CSM Accounts Hub (`csm-accounts-hub.tsx`) — CSM Lead, Account Success, SaaS
- Account Detail (`accounts-view.tsx`) — CSM, Account Success, SaaS
- Renewal Pipeline (`renewals-view.tsx`) — CSM / Renewal Manager, Account Success, SaaS
- Risk Matrix (`risk-matrix-view.tsx`) — CSM / Risk Manager, Account Success, SaaS
- Executive Dashboard (`executive-dashboard-wired.tsx`) — VP Customer Success / CCO, Account Success, SaaS
- Intelligence Center (`intelligence-center.tsx`) — CSM / CS Ops, Account Success, SaaS

### BizOps

Views:

- Founder's Cockpit (`founder-ops-view.tsx`) — Founder / CEO, BizOps, SaaS
- CEO Dashboard (`ceo-view.tsx`) — CEO, BizOps, SaaS
- COO Dashboard (`coo-view.tsx`) — COO, BizOps, SaaS
- Business Intelligence (`business-intelligence-view.tsx`) — BizOps Analyst, BizOps, SaaS
- Ops Command Center (`ops-command-center-view.tsx`) — Ops Analyst, BizOps, SaaS

### SalesOps

Views:

- Sales Pipeline (`salesops-views.tsx`) — Sales Rep, SalesOps, SaaS

### Service

Views:

- Tickets (`tickets-view.tsx` / `service-views.tsx`) — Support Agent, Service, SaaS

### Marketing

Views:

- Marketing Dashboard (`dashboard.tsx`) — Marketing Manager, Marketing, SaaS

### Product-Engineering

Views:

- Product Roadmap (`product-views.tsx` / `roadmap-view.tsx`) — Product Manager, Product-Engineering, SaaS

### RevOps

Views:

- Revenue Waterfall (`revops-views.tsx`) — RevOps Analyst, RevOps, SaaS

### Finance

Views:

- Finance Dashboard (`finance-views.tsx`) — Finance Manager, Finance, SaaS

### Personal

Views:

- Personal Dashboard (`dashboard.tsx`) — Individual, Personal, Any

---

## 2. View Contract Template

Every view follows this contract:

```
[View Name] → [Role] + [Department] + [Industry]
├── Connectors: [List of tools that hydrate this view]
├── KPIs: [What metrics surface here]
├── Twin OODA: [How the Twin observes, orients, decides, acts for this entity]
├── Twin KPIs: [How the Twin's own performance is measured on this view]
└── Capabilities: [What actions can be executed from this view]
```

---

## 3. Twin OODA Reference by Entity Type

| Entity Type | Observe                                                                                              | Orient                                                                              | Decide                                    | Act                                                                             |
| ----------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------- |
| Account     | Health deltas, engagement drops, support spikes, billing anomalies, competitive mentions             | Health history, peer benchmarks, contract terms, stakeholder map, renewal playbook  | Renew, expand, rescue, maintain, escalate | Recovery plan, renewal proposal, exec check-in, QBR schedule, ticket escalation |
| Deal        | Stage progression, engagement signals, stakeholder activity, competitive intel, close date proximity | Winning pattern match, missing stakeholder identification, similar win/loss history | Close, advance, stall, risk, expand       | Follow-up sequence, proposal draft, stakeholder engagement, manager alert       |
| Ticket      | Content, sentiment, account context, historical solutions, product issues, SLA clock                 | Known solution match, escalation triggers, customer impact, agent workload          | Solve, escalate, defer, request info      | Response draft, macro suggestion, Jira bug, account team alert                  |
| Lead        | Source, engagement, fit score, behavior, competitive research                                        | ICP match, nurture path, sales readiness, similar conversion history                | Qualify, nurture, disqualify, fast-track  | Sequence start, lead score update, sales assignment, content recommendation     |
| Campaign    | Performance, spend, engagement, conversion, competitive messaging                                    | ICP fit, channel effectiveness, historical benchmark, content resonance             | Optimize, pause, expand, reallocate       | Budget shift, audience refinement, A/B test, content suggestion                 |
| Feature     | Feedback volume, request patterns, bug severity, usage analytics, sprint health                      | Theme clustering, roadmap priority, technical debt, competitor gap                  | Prioritize, defer, kill, fast-track       | Roadmap update, PRD draft, sprint scope change, Jira epic                       |
| Invoice     | Payment status, collection history, account health, contract terms                                   | Collection risk, payment pattern, account tier, escalation path                     | Remind, escalate, write off, renegotiate  | Collection reminder, account team alert, payment plan, dunning sequence         |
| Employee    | Engagement, performance, workload, feedback, flight risk signals                                     | Peer comparison, career trajectory, comp benchmark, team health                     | Retain, develop, coach, transition        | 1:1 schedule, coaching plan, comp review, succession planning                   |
| Vendor      | Spend, performance, SLA compliance, risk signals, contract terms                                     | Cost benchmark, quality trend, alternative options, strategic importance            | Renew, renegotiate, replace, consolidate  | RFQ launch, contract negotiation, vendor review, procurement alert              |
| Student     | Grades, attendance, engagement, assignment submission, at-risk signals                               | Peer comparison, historical performance, advisor notes, support resources           | Intervene, support, monitor, accelerate   | Advisor alert, tutoring schedule, assignment extension, parent notification     |

---

## 4. Governance Levels by View

| View                  | Auto-Approve                                                                                                                                                                                       | Requires Approval                                                                                                          | Risk   |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------ |
| CSM Accounts Hub      | account.view, contact.view, task.create, engagement.log, message.send, meeting.schedule                                                                                                            | account.update, risk.flag, opportunity.create                                                                              | Medium |
| Account Detail        | account.view, contact.view, engagement.log, task.create, note.create, message.send, meeting.schedule, ticket.view                                                                                  | account.update, contact.create, risk.flag, escalation.create, opportunity.create, health.update                            | High   |
| Renewal Pipeline      | renewal.view, renewal.schedule, engagement.log, task.create, message.send, meeting.schedule, report.generate                                                                                       | renewal.update, renewal.draft                                                                                              | High   |
| Risk Matrix           | risk.view, message.send, task.create, ticket.view                                                                                                                                                  | risk.create, risk.update, risk.mitigate, risk.close, jira.issue.create                                                     | High   |
| Executive Dashboard   | report.generate, dashboard.share, forecast.view, team.view, budget.view, message.send, meeting.schedule, qbr.schedule                                                                              | alert.configure, forecast.update, team.assign                                                                              | High   |
| Intelligence Center   | signal.view, signal.dismiss, signal.investigate, report.generate, message.send                                                                                                                     | playbook.update                                                                                                            | Low    |
| Founder's Cockpit     | dashboard.view, report.generate, task.create, task.assign, message.send, meeting.schedule, decision.record                                                                                         | forecast.update, okr.update, hiring.open, budget.adjust, alert.configure                                                   | High   |
| CEO Dashboard         | report.generate, forecast.view, message.send, meeting.schedule                                                                                                                                     | forecast.update, hiring.open, budget.adjust                                                                                | High   |
| COO Dashboard         | workflow.view, process.view, task.create, task.assign, report.generate, message.send, meeting.schedule                                                                                             | workflow.create, workflow.update, process.update, metric.configure                                                         | Medium |
| Business Intelligence | metric.view, dashboard.view, report.generate, prediction.view, data-source.view, message.send                                                                                                      | metric.create, metric.update, prediction.configure, data-source.configure                                                  | Medium |
| Sales Pipeline        | deal.view, lead.view, contact.view, sequence.start, sequence.stop, email.send, email.draft, meeting.schedule, call.log, task.create, note.create, competitor.add, message.send                     | deal.create, deal.update, deal.close, lead.create, lead.convert, contact.create                                            | High   |
| Tickets               | ticket.view, ticket.create, response.draft, macro.apply, kb.search, customer.view, message.send, task.create, meeting.schedule                                                                     | ticket.update, ticket.solve, ticket.escalate, ticket.merge, kb.create, jira.issue.create                                   | Medium |
| Marketing Dashboard   | campaign.view, campaign.pause, lead.view, lead.assign, email.draft, form.view, ad.view, report.generate, content.suggest, content.draft, message.send                                              | campaign.create, campaign.update, campaign.resume, email.send, form.create, ad.adjust                                      | Medium |
| Product Roadmap       | feature.view, bug.view, sprint.view, release.view, feedback.view, feedback.cluster, analytics.view, report.generate, message.send, meeting.schedule                                                | feature.create, feature.prioritize, feature.assign, bug.triage, bug.assign, sprint.create, sprint.update, release.schedule | Medium |
| Revenue Waterfall     | forecast.view, pipeline.view, pipeline.analyze, quota.view, rep.view, rep.coach, territory.view, cohort.view, report.generate, message.send                                                        | forecast.update, quota.adjust, deal.risk, territory.adjust                                                                 | High   |
| Finance Dashboard     | invoice.view, expense.view, budget.view, forecast.view, report.generate, collection.remind, message.send                                                                                           | invoice.create, invoice.approve, expense.approve, budget.adjust, forecast.update, payment.schedule                         | High   |
| Personal Dashboard    | task.view, task.create, task.complete, task.prioritize, meeting.view, meeting.schedule, meeting.prep, note.create, document.view, goal.view, goal.update, focus.block, break.suggest, message.send | —                                                                                                                          | Low    |

---

## 5. Execution Lifecycle

```text
User Initiates Capability
        │
        ▼
Gate 1: Pre-Proposal
  - Role check
  - Context compatibility
  - Policy check
        │
        ▼
Pending Approval
  - Immutable plan created
  - Signed and stored in Spine
  - UI shows review surface
        │
        ▼
User Approves
        │
        ▼
Gate 2: Execution
  - Adapter resolved
  - Mock or live adapter executes
  - Side effects: timeline, notifications, evidence
        │
        ▼
Spine Sync
  - External adapter confirms or queues
  - Sync status updated
        │
        ▼
Projection Refresh
  - UI reflects new state
  - Twin may react to change
```

---

## 6. Invariants

1. The user never leaves IntegrateWise.
2. All projections come from the Spine.
3. External applications are execution providers only.
4. Twin is always context-bound.
5. Capabilities are resolved by business intent, not vendor name.
6. Approval gates apply to medium/high-risk mutations.
