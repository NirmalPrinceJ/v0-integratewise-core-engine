# Capability-First: Implementation Roadmap


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Phase Breakdown

### Phase 1: Foundation (Weeks 1-2)
**Goal: Model the first 40 capabilities + build the lifecycle engine**

Tasks:
- Define capabilities schema (inputs, AI prompt, response, execution, learning)
- Implement capability lifecycle engine (context → recommend → execute → learn)
- Model 40 core capabilities across 4 domains (Sales, CSM, Finance, Support)
- Build entity enrichment system (transform flat records to living objects)
- Implement Digital Twin for Customer entity

Deliverable:
- Capability registry (40 capabilities defined and coded)
- Lifecycle engine (proven pattern)
- First Digital Twin operational

### Phase 2: Scale Capabilities (Weeks 3-4)
**Goal: Add remaining 160 capabilities + build orchestration**

Tasks:
- Model remaining 160 capabilities (all 12 domains)
- Build capability discovery/search (user thinks goal → system finds capability)
- Implement cross-capability orchestration (handoffs)
- Build operating rhythm system (daily/weekly/monthly)
- Extend Digital Twin to all major entity types

Deliverable:
- Full 200+ capability platform
- Orchestration for 50+ cross-functional workflows
- Operating rhythms configured

### Phase 3: Intelligence (Weeks 5-6)
**Goal: Add predictive + modeling + learning layer**

Tasks:
- Build predictive alerts (churn risk, cash flow risk, etc.)
- Implement scenario modeling ("what if" simulations)
- Build outcome tracking + learning capture
- Create pattern recognition (what leads to success)
- Build continuous improvement loops

Deliverable:
- Predictive system running
- Scenario modeling for planning
- Learning loop established

### Phase 4: UX & Adoption (Weeks 7-8)
**Goal: Make it intuitive and useful**

Tasks:
- Build capability-first UI (goal-based, not tool-based)
- Implement context-rich dashboards
- Create mobile command center
- Run adoption playbook with teams
- Gather feedback + iterate

Deliverable:
- Production-ready UX
- 80%+ team adoption
- Positive feedback on AI collaboration

---

## What Changes in Architecture

### Before (What I Built)
```
Workbenches (12)
├─ Sales Workbench
├─ CSM Workbench
├─ Finance Workbench
└─ ... (9 more departments)

Cross-Domain Context (sidebars)
└─ Show related data from other domains

Problem: Still app/department-centric
Problem: Users must know which workbench to open
```

### After (What You're Proposing)
```
Capability Layer (200+)
├─ Find Prospect
├─ Sell
├─ Prepare Meeting
├─ Monitor Health
├─ Detect Risk
├─ Invoice
├─ Forecast
└─ ... (190+ more)

Entity Layer (Living Objects)
├─ Customer (13 dimensions)
├─ Deal (13 dimensions)
├─ Invoice (13 dimensions)
├─ Employee (13 dimensions)
└─ ... (all entities enriched)

Execution Layer
├─ Capability lifecycle engine
├─ Orchestration for handoffs
├─ Operating rhythms

Intelligence Layer
├─ Predictive alerts
├─ Scenario modeling
├─ Learning + continuous improvement

Governance Layer
├─ Policy checks
├─ Approval chains
├─ Audit trails

Result: User-centric, goal-driven system
Result: "What do I need to do?" → AI handles everything
```

---

## 200+ Capabilities Overview

### Revenue (12)
Find Prospect, Research Account, Qualify, Understand Decision Makers, Schedule Meeting, Run Meeting, Create Proposal, Negotiate, Close, Onboard, Renew, Expand

### Customer Success (8)
Monitor Health, Prepare Meeting, Review Adoption, Detect Risk, Build Success Plan, Coordinate Internally, Prepare QBR, Drive Renewal

### Support (7)
Triage Ticket, Diagnose Issue, Resolve Ticket, Escalate Risk, Identify Patterns, Prepare For Meeting, Close & Learn

### Finance (9)
Invoice, Track Payment, Collect Payment, Forecast Revenue, Budget, Manage Expense, Process Payroll, Recognize Revenue, Tax Planning

### Engineering (8)
Plan Sprint, Review PR, Deploy Release, Monitor Incident, Post-Incident Review, Architecture Review, Plan Roadmap, Manage Dependencies

### People (7)
Plan Hire, Recruit, Onboard, Manage Performance, Develop Talent, Offboard, Manage Workload

### Operations (9)
Vendor Management, Procurement, Facilities, Security & Compliance, Knowledge Management, Process Improvement, Policy Management, Risk Management, Data Governance

### Plus more domains...
**Total: 200+ operational capabilities**

---

## The Entity Enrichment Pattern

Every entity goes from:
```
Customer
- Name
- Email
- Status
```

To:
```
Customer (Living Operational Object)
├── Identity (who/what)
├── Relationships (connected to)
├── Operational State (current status)
├── Timeline (history + future)
├── Tasks (open work)
├── Decisions (to be made)
├── Conversations (communication)
├── Documents (files + contracts)
├── Intelligence (AI observations)
├── Memory (learning)
├── Governance (ownership + approvals)
├── Health (score + trends)
├── Signals (live events)
├── Automation (available actions)
├── Twin Context (AI knows)
├── Capabilities (what you can do)
└── Metrics (KPIs)
```

This becomes reusable for all entity types.

---

## The Capability Lifecycle

Every capability follows:

```
User: "I need to [do X]"
    ↓
System: Find capability [X]
    ↓
System: Assemble context (Spine + memory + signals)
    ↓
AI: Synthesize understanding
    ↓
AI: Run Digital Twin analysis
    ↓
AI: Generate recommendations
    ↓
Human: Review + decide
    ↓
AI: Execute (implement + coordinate + notify)
    ↓
System: Capture outcome
    ↓
AI: Extract learning
    ↓
System: Update memory
    ↓
AI: Improve future recommendations
```

This is the same for all 200+ capabilities.

---

## Success Metrics

By Week 8:

**Speed**
- Decisions in hours, not weeks
- Context assembly instant, not 30 min of manual research
- Handoffs automatic, not manual back-and-forth

**Quality**
- Decision quality: 100% data vs 60% before
- Prediction accuracy: Improving weekly
- Organizational alignment: Measured

**Adoption**
- 80%+ of team using daily
- Satisfaction: 4+/5
- AI collaboration feels natural

**Business Impact**
- Decision-making velocity 10x
- Process efficiency 30% better
- Revenue/op metrics trending up

---

## Key Implementation Points

### 1. Capability Schema
Each capability needs:
- Name + description
- Primary domain + affected domains
- Required data fields (what from Spine?)
- AI prompt template (what does AI ask?)
- Response template (how does AI suggest?)
- Execution rules (what actions can it take?)
- Learning rules (what to capture?)
- Approval chain (who needs to sign off?)
- Operating rhythm (daily/weekly/monthly?)

### 2. Entity Enrichment
Each entity type needs 13 dimensions implemented:
- Identity + Relationships + State + Timeline + Tasks + Decisions + Conversations + Documents + Intelligence + Memory + Governance + Health + Signals + Automation + Twin + Metrics

### 3. Orchestration
Handoffs between capabilities:
- When [capability A] completes → Trigger [capability B]
- Pass context through the handoff
- Notify affected teams
- Track end-to-end workflow completion

### 4. Operating Rhythms
Configure when capabilities activate:
- Daily: Stand-ups, priorities, follow-ups
- Weekly: Forecast, planning, reviews
- Monthly: Payroll, renewals, reconciliation
- Quarterly: Planning, hiring, budgets

### 5. Learning Loop
Capture + extract + improve:
- Log every recommendation made
- Capture human decision
- Track actual outcome
- Extract pattern
- Improve future AI

---

## From Departments to Capabilities

**Before (Siloed)**
```
Sales thinks: "I work in Sales"
CSM thinks: "I work in Customer Success"
Finance thinks: "I work in Finance"
Result: Silos, handoffs, misalignment
```

**After (Integrated)**
```
Person thinks: "I need to [close deal]"
System: "That's 'Close Deal' capability. You need data from Sales, Finance, CSM, Legal"
System: "Here's everything you need. Here's what AI recommends. You decide."
Person decides.
System: Orchestrates across Sales/Finance/CSM/Legal automatically
Result: Seamless, coordinated execution
```

---

## Competitive Advantage

By completing all 4 phases:

- **Speed**: 10x faster decision-making
- **Quality**: Better data, better predictions, better decisions
- **Efficiency**: 30% better unit economics (scale without headcount)
- **Alignment**: Teams move as one, not silos
- **Learning**: Organization gets smarter continuously
- **Culture**: "AI helps me do my job better" instead of "AI replacing me"

---

## Next Week: Start Phase 1

1. Define 40 core capabilities (Sales 12, CSM 8, Finance 9, Support 7, others 4)
2. Build capability schema + lifecycle engine
3. Implement first 5 capabilities
4. Test end-to-end on real data
5. Gather team feedback
6. Iterate

This is not an incremental improvement.

This is a fundamental architectural shift from app-centric to capability-centric.

From department workbenches to organizational operating system.

