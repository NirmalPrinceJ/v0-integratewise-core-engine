# Customer Zero Constitution

Status: DRAFT
Scope: How IntegrateWise runs IntegrateWise itself — departments, roles, objectives, workflows, Twin playbooks, KPIs, approvals, execution.
Canonical Owner: IntegrateWise Platform
Last Verified: 2026-07-20

---

## 1. Purpose

This document answers: **How does IntegrateWise run IntegrateWise?**

It does not describe UI screens. It describes the company as a governed operation inside the Adaptive Workbench.

---

## 2. Organizational structure

| Department       | Primary Role               | Industry Context |
| ---------------- | -------------------------- | ---------------- |
| Founder          | CEO / Founder              | SaaS             |
| Sales            | Sales Rep / Sales Manager  | SaaS             |
| Marketing        | Marketing Manager          | SaaS             |
| Customer Success | CSM Lead / Renewal Manager | SaaS             |
| Finance          | Finance Manager            | SaaS             |
| Engineering      | Engineering Lead / QA      | SaaS             |
| Product          | Product Manager            | SaaS             |
| Operations       | COO / Ops Analyst          | SaaS             |
| Support          | Support Agent / CSM        | SaaS             |
| HR               | HR Manager                 | SaaS             |
| IT               | IT Admin                   | SaaS             |
| Legal            | Legal Counsel              | SaaS             |

---

## 3. Per-department operating model

### 3.1 Founder

- **Objectives**: company health, revenue, product-market fit, cash, hiring, strategy
- **Daily workflows**: Founder Brief, Revenue Review, Pipeline Review, Hiring Review, Board Preparation
- **Views**: Founder's Cockpit, CEO Dashboard, Revenue Waterfall, Executive Dashboards
- **Connected systems**: Salesforce, Stripe, HubSpot, Zendesk, Jira, Slack, Google Calendar, Notion, QuickBooks, LinkedIn
- **Canonical entities**: account, opportunity, campaign, incident, invoice, employee, project, decision
- **Twin playbooks**: morning brief, risk digest, board narrative, hiring pipeline review
- **KPIs**: ARR, MRR, Pipeline, Burn, Runway, NPS, NRR, Win Rate, Hiring Velocity, OKR Progress
- **Approval chains**: Founder → Department Head → Execution
- **Execution plans**: budget adjustment, hiring open, forecast update, decision record

### 3.2 Sales

- **Objectives**: pipeline coverage, win rate, deal velocity, forecast accuracy
- **Daily workflows**: pipeline triage, deal review, sequence management, forecasting
- **Views**: Sales Pipeline, Deals, Accounts, Contacts, Activities, Analytics
- **Connected systems**: Salesforce, HubSpot, LinkedIn, Gmail, Slack, Google Calendar, Zoom
- **Canonical entities**: deal, opportunity, lead, contact, account, activity
- **Twin playbooks**: deal risk analysis, next best action, forecast update, stakeholder mapping
- **KPIs**: Pipeline, Win Rate, Avg Deal Cycle, Pipeline Velocity, Activity Score, Forecast Accuracy
- **Approval chains**: Rep → Manager → Sales Director
- **Execution plans**: discount approval, exception pricing, legal review, deal close

### 3.3 Marketing

- **Objectives**: lead generation, MQL volume, campaign ROI, pipeline influence, CAC efficiency
- **Daily workflows**: campaign monitoring, lead routing, content review, A/B test analysis
- **Views**: Marketing Dashboard, Campaigns, Attribution, Analytics, Forms, Ads
- **Connected systems**: HubSpot, Mailchimp, Google Ads, LinkedIn Ads, Google Analytics, Salesforce, Slack
- **Canonical entities**: campaign, lead, attribution, form, ad, content
- **Twin playbooks**: campaign optimization, lead scoring, channel mix, creative refresh
- **KPIs**: MQLs, SQLs, CAC, Pipeline Generated, Campaign ROI, Lead-to-Win, CTR
- **Approval chains**: Marketing Manager → VP Marketing
- **Execution plans**: campaign launch, budget increase, audience refinement, content creation

### 3.4 Customer Success

- **Objectives**: retention, expansion, health, NRR, renewal rate
- **Daily workflows**: health review, renewal triage, QBR prep, risk mitigation, executive check-ins
- **Views**: CSM Dashboard, Accounts, Renewals, Risk Matrix, Executive Dashboard, Intelligence Center
- **Connected systems**: Salesforce, HubSpot, Zendesk, Slack, Google Calendar, Jira, Stripe, Notion
- **Canonical entities**: account, renewal, risk, engagement, task, opportunity, ticket
- **Twin playbooks**: renewal forecast, risk detection, expansion signal, QBR preparation
- **KPIs**: Total ARR, At-Risk ARR, Renewal Rate, Health Score, NPS, CSAT, Expansion ARR
- **Approval chains**: CSM → CS Manager → VP Customer Success
- **Execution plans**: renewal approval, escalation, discount, executive alert

### 3.5 Finance

- **Objectives**: runway, collections, budget adherence, P&L accuracy, cash flow
- **Daily workflows**: invoice review, expense approval, collection follow-up, budget reforecast, board financials
- **Views**: Finance Dashboard, Invoices, Expenses, Budget, Forecasting
- **Connected systems**: QuickBooks, Stripe, Salesforce, Bill.com, Google Sheets, Slack
- **Canonical entities**: invoice, expense, payment, budget, forecast, revenue_metric
- **Twin playbooks**: anomaly detection, collection risk, budget variance, runway trajectory
- **KPIs**: Revenue, Gross Margin, Burn Rate, Runway, Collections Rate, Net Margin, Cash Flow
- **Approval chains**: Finance Manager → CFO → Founder
- **Execution plans**: invoice approval, expense approval, payment schedule, collection reminder, budget adjust

### 3.6 Engineering

- **Objectives**: deployment reliability, incident response, velocity, bug resolution, technical debt
- **Daily workflows**: standup, incident triage, PR review, deployment monitoring, postmortem
- **Views**: Dashboard, Sprints, Releases, Incidents, Bugs, Deployments
- **Connected systems**: GitHub, Jira, Linear, Slack, Google Calendar, Notion, Mixpanel
- **Canonical entities**: sprint, task, bug, incident, deployment, pull_request, release
- **Twin playbooks**: sprint risk, bug triage, deployment anomaly, technical debt assessment
- **KPIs**: Velocity, Cycle Time, Deployment Frequency, MTTR, Bug Severity, PR Throughput
- **Approval chains**: Engineer → Tech Lead → Engineering Manager
- **Execution plans**: hotfix approval, release promotion, incident escalation, scope change

### 3.7 Product

- **Objectives**: roadmap execution, feature adoption, customer satisfaction, strategic alignment
- **Daily workflows**: feedback review, roadmap prioritization, sprint planning, PRD review, analytics review
- **Views**: Product Roadmap, Sprints, Backlog, Customer Feedback, Feature Intelligence, Releases
- **Connected systems**: Jira, GitHub, Linear, Notion, Zendesk, Intercom, Mixpanel, Slack, Google Calendar
- **Canonical entities**: feature, epic, sprint, story, bug, feedback, release, analytics
- **Twin playbooks**: feedback clustering, roadmap prioritization, bug triage, competitive analysis
- **KPIs**: Adoption, NPS, Feature Usage, Sprint Velocity, Bug Resolution Time, Release Frequency
- **Approval chains**: Product Manager → VP Product → Founder
- **Execution plans**: roadmap update, sprint scope change, feature prioritization, PRD approval

### 3.8 Operations

- **Objectives**: process efficiency, cross-functional flow, cost control, SLA compliance
- **Daily workflows**: ops review, workflow monitoring, incident response, resource planning, metric review
- **Views**: Ops Command Center, Workflows, Analytics, Tasks, Initiatives
- **Connected systems**: Salesforce, Jira, Zendesk, HubSpot, Slack, Google Calendar, Notion, internal HRIS/finance
- **Canonical entities**: workflow, incident, ops_metric, initiative, task, process
- **Twin playbooks**: bottleneck detection, process optimization, capacity forecasting, tool evaluation
- **KPIs**: Cycle Time, Error Rate, Throughput, Cost Variance, SLA Compliance, Capacity Utilization
- **Approval chains**: Ops Manager → COO → Founder
- **Execution plans**: workflow update, process change, resource reallocation, tool evaluation

### 3.9 Support

- **Objectives**: first response time, resolution time, CSAT, SLA compliance, first contact resolution
- **Daily workflows**: ticket triage, response drafting, escalation, knowledge base update, customer follow-up
- **Views**: Tickets, SLA Dashboard, Knowledge Base, Analytics, Customer Context
- **Connected systems**: Zendesk, Freshdesk, Intercom, Jira, Slack, Salesforce, Internal KB
- **Canonical entities**: ticket, response, macro, kb_article, customer, escalation
- **Twin playbooks**: response drafting, escalation prediction, knowledge suggestion, sentiment analysis
- **KPIs**: First Response Time, Avg Resolution Time, CSAT, FCR, SLA Compliance, Escalation Rate, NPS
- **Approval chains**: Support Agent → Support Lead → Support Manager
- **Execution plans**: escalation, compensation, SLA exception, process change, knowledge article creation

### 3.10 HR

- **Objectives**: retention, headcount, performance, onboarding, compliance
- **Daily workflows**: 1:1 review, performance check, onboarding coordination, policy update, hiring review
- **Views**: Dashboard, Team, Tasks, Docs, Meetings, Analytics
- **Connected systems**: BambooHR, Deel, LinkedIn, Slack, Google Calendar, Notion, Gusto
- **Canonical entities**: employee, project, team, goal, performance_review, hiring_req
- **Twin playbooks**: retention risk, onboarding assistance, performance insights, policy compliance
- **KPIs**: Headcount, Retention Rate, Time-to-Hire, Employee NPS, Training Completion, Pay Equity
- **Approval chains**: HR Manager → HR Director → Founder
- **Execution plans**: hiring open, offboarding, performance review, compensation adjustment, accommodation

### 3.11 IT

- **Objectives**: system health, security, uptime, patch compliance, license management
- **Daily workflows**: system monitoring, incident response, patch management, vendor review, access review
- **Views**: Dashboard, Systems, Incidents, Vulnerabilities, Connected Apps
- **Connected systems**: Cloudflare, internal monitoring, Slack, Google Calendar, vendor portals
- **Canonical entities**: system, incident, vulnerability, ops_metric, access_request
- **Twin playbooks**: patch aging, license expiry, incident detection, access anomaly
- **KPIs**: Uptime, Incident Count, Patch Compliance, Vulnerability Age, License Utilization, Access Requests
- **Approval chains**: IT Admin → IT Manager → Founder
- **Execution plans**: change window, vendor spend, incident escalation, access approval

### 3.12 Legal

- **Objectives**: contract compliance, risk mitigation, regulatory adherence, IP protection
- **Daily workflows**: contract review, compliance check, renewal reminder, legal request, policy update
- **Views**: Dashboard, Contracts, Compliance, Requests
- **Connected systems**: DocuSign, Notion, Slack, Google Calendar, internal repository
- **Canonical entities**: contract, compliance_requirement, legal_request, policy, renewal
- **Twin playbooks**: contract review, compliance check, risk assessment, renewal reminder
- **KPIs**: Contract Renewal Rate, Compliance Score, Legal Request TAT, Risk Exposure, Audit Findings
- **Approval chains**: Legal Counsel → General Counsel → Founder
- **Execution plans**: contract approval, compliance exception, legal request approval, policy update

---

## 4. Cross-functional workflows

| Workflow      | Trigger                   | Departments              | Twin Role                   | Governance                |
| ------------- | ------------------------- | ------------------------ | --------------------------- | ------------------------- |
| Renewal       | 30 days before renewal    | CS, Sales, Finance       | Propose renewal playbook    | CS approval               |
| Expansion     | Health > 75 + usage spike | CS, Sales                | Propose opportunity         | Sales approval            |
| Incident      | Sev-1 or customer impact  | Support, Engineering, CS | Propose escalation + comms  | Engineering + CS approval |
| Campaign      | MQL drop or budget shift  | Marketing, Sales         | Propose optimization        | Marketing approval        |
| Hiring        | Headcount gap             | HR, Founder              | Propose JD + interview loop | Founder approval          |
| Budget Review | Monthly close             | Finance, Founder, all    | Propose reallocation        | Founder approval          |

---

## 5. Twin operational behavior

1. Twin is always context-bound to the focused entity, view, or department.
2. Twin proactively monitors signals across all connected systems.
3. Twin norns recommendations are categorized as: observe, orient, decide, act.
4. All consequential mutations require human approval.
5. Twin learns from outcomes and updates playbooks.

---

## 6. Governance and approvals

- **Auto-approve**: low-risk read/list/create operations within role scope
- **Require approval**: update/delete/execute on medium/high-risk entities; cross-department actions; external sends
- **Founder-only**: budget adjust, hiring open, forecast update at company level, decision record

---

## 7. Customer Zero KPIs

| Category         | KPI                  | Current  | Target  |
| ---------------- | -------------------- | -------- | ------- |
| Revenue          | ARR                  | $180K    | $500K   |
| Revenue          | MRR                  | $12K     | $25K    |
| Revenue          | NRR                  | 114%     | 120%    |
| Revenue          | Win Rate             | 28%      | 35%     |
| Sales            | Pipeline Coverage    | 4.2x     | 5x      |
| Sales            | Forecast Accuracy    | ±12%     | ±5%     |
| Customer Success | At-Risk ARR          | $24K     | <$10K   |
| Customer Success | Renewal Rate         | 85%      | 92%     |
| Customer Success | Health Score         | 62       | 75      |
| Product          | Sprint Velocity      | 34 pts   | 40 pts  |
| Product          | Bug Resolution       | 2.4d     | 1d      |
| Engineering      | MTTR                 | 45 min   | 30 min  |
| Engineering      | Deployment Frequency | 2/week   | 5/week  |
| Support          | First Response Time  | 45 min   | 15 min  |
| Support          | CSAT                 | 4.2      | 4.5     |
| Marketing        | MQLs                 | 42/mo    | 75/mo   |
| Marketing        | Campaign ROI         | 3.2x     | 5x      |
| Finance          | Burn Rate            | $108K/mo | $80K/mo |
| Finance          | Runway               | 18 mo    | 24 mo   |
| HR               | Retention            | 88%      | 92%     |
| IT               | Uptime               | 99.5%    | 99.9%   |

---

## 8. Execution plans

All execution plans follow the canonical lifecycle:

1. Pre-proposal governance check
2. Immutable plan creation
3. Human approval
4. Adapter resolution
5. Execution with side effects
6. Spine sync
7. Projection refresh

Examples:

- Renewal approval for Acme Corp (`plan_renewal_acme_001`)
- LinkedIn campaign launch (`plan_campaign_linkedin_001`)

---

## 9. Relationship to other constitutions

- **Adaptive Workbench Constitution**: describes views, connectors, KPIs, Twin OODA, capabilities per screen
- **Canonical Entity Constitution**: describes entity shapes, relationships, state machines
- **Capability Constitution**: describes canonical capability contracts, input/output, policies
- **Connector Constitution**: describes provider adapters, OAuth, sync, webhook lifecycle
- **Twin Constitution**: describes Twin runtime, memory, context, proposal grammar
- **Projection Constitution**: describes projection generation, caching, refresh triggers
- **Governance Constitution**: describes two-gate model, approval tokens, audit requirements
- **Execution Constitution**: describes execution engine, adapter resolution, rollback, side effects
- **Runtime Constitution**: describes Workers, D1, KV, R2, Queues, DO, service bindings, communication hierarchy
