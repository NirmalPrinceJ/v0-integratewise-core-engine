# IntegrateWise — Strategic Build Plan

Status: ACTIVE
Owner: Founder
Created: 2026-07-13
Supersedes: all prior planning documents for execution sequencing

> After nine documents, hundreds of pages, and a complete intellectual framework — the one thing that matters is: a real user opens a real app, sees their real data, and feels their daily pain get lighter. Everything we have built exists to make that moment possible. But that moment does not happen on paper. It happens in code.

---

## What We Have

**A complete intellectual framework.** The architecture is sound. The 15 domains make sense. The swappable provider model is correct. The three lifecycles are the right product story. The financial model is defensible. The investor pitch is clean. The technical architecture is detailed enough to build from.

**Significant infrastructure code.** This is not a zero-code situation. The repo has:

- 31 services with real implementations (gateway, think, govern, pipeline, connector, loader, intelligence, etc.)
- 629 TypeScript files in apps/web (Vite + React Router rebuild)
- Gateway monolith with 2,260 lines handling auth, routing, rate limiting, webhooks
- OAuth infrastructure (tenants service, mcp-connector with full OAuth flow)
- HubSpot handler already exists (`services/loader/src/handlers/hubspot.ts`)
- Governance engine with policies, proposals, workflow, audit
- AI cognitive brain with fusion, context-to-truth, entity360 assembly
- Spine pipeline with entity360-assembler, vault, memory promoter

**What we do not have is an end-to-end flow.** No user can log in, connect a tool, see their data, and feel the product work. The infrastructure is built. The plumbing is not connected.

---

## The Honest Assessment

### What is actually hard

**1. The first connector.**
Everything depends on real data flowing from a real tool into a real workspace. The first connector must authenticate, pull accounts, pull contacts, pull deals, map fields, create canonical entities, and display them. Budget 2-3 weeks longer than expected.

**2. The AI observation loop.**
The difference between "here are 47 things that changed" and "here are the 3 things that matter" is the entire product. Plan for iteration — versions 1-3 will be noisy. By version 4-5 it will be good.

**3. Getting the first 5 users to care.**
They will not care about architecture, provider independence, or 15 domains. They will care about one thing: does this save me time today?

### What is actually uncertain

1. Will users trust AI observations?
2. Will teams pay $59/seat?
3. Will AI costs stay within $6-12/seat/month projections?
4. Will the architecture hold under real shortcuts?

---

## The 180-Day Build Plan

### Day 1-7: Decide one thing

**CRM (HubSpot) + Customer Success Manager.**

Why HubSpot first (not Salesforce):

- HubSpot handler already exists in `services/loader/src/handlers/hubspot.ts`
- OAuth infrastructure already exists in `services/tenants/src/oauth-configs.ts`
- HubSpot APIs are simpler and faster to integrate
- CSMs feel the most pain from tool fragmentation
- CRM data is the richest and most structured

### Day 7-30: Build the minimum viable work

**One thing: a CSM opens the app, sees their HubSpot accounts, clicks into one, and sees a unified view with recent changes.**

```
1. Login (auth) — AuthProvider exists in apps/web, needs Descope wiring
2. Connect HubSpot (OAuth) — OAuth configs exist, needs end-to-end flow
3. See my accounts (Spine populated from CRM) — HubSpot handler + pipeline exist
4. Click an account — Entity360 assembler exists, needs UI
5. See: account info, contacts, deals, recent activity, last 30 days of changes
6. A simple "what changed" summary (rule-based, not AI)
```

### Day 30-60: Add one AI layer

```
7. AI scans connected accounts nightly
8. AI surfaces 2-3 observations per account
9. User sees: "Acme: Executive engagement declined 40%"
10. User can click "Tell me more" for context
```

First AI features: change detection, risk signals. NOT drafting, delegation, memory, governance.

### Day 60-90: Add continuity and drafting

```
11. App remembers where the user was when they return
12. "Since you were away" summary on return
13. AI drafts a follow-up email for the user to review
14. User edits, approves, sends
```

### Day 90-120: Second connector + workbench

```
15. Connect Zendesk or Intercom
16. Account view now shows CRM + support data together
17. AI observations now span both tools
```

### Day 120-180: Governance, memory, third connector

```
18. AI proposals require user approval
19. User corrections improve AI observations
20. Connect Slack or email
21. Entity 360 now spans three tools
22. First paying customer
```

### The Critical Path

```
MONTH 1:  One tool + one view        → Proof: user comes back tomorrow
MONTH 2:  AI observations            → Proof: user says "I would have missed that"
MONTH 3:  Continuity + drafting      → Proof: user says "I cannot go back"
MONTH 4:  Second tool + unified view → Proof: user says "better than my CRM alone"
MONTH 5:  Third tool + governance    → Proof: user's team adopts
MONTH 6:  First paying customer      → Proof: someone will pay money for this
```

---

## What To Stop Doing

- **Stop writing architecture documents.** The architecture is defined. Code makes it real.
- **Stop planning for 50 connectors.** Build one connector well. Then build a second.
- **Stop designing the full workbench.** The Universal Workbench is the year-2 product. Month-1 is a list of accounts.
- **Stop optimizing for swappable providers.** Pick Postgres. Pick Anthropic. Build. Swap later.
- **Stop fundraising until there is something to show.** Build the first version. Show 3 design partners. Then fundraise.

---

## Codebase Gap Analysis

### What exists and works

| Component           | Status   | Evidence                                                     |
| ------------------- | -------- | ------------------------------------------------------------ |
| Gateway routing     | ✅ Built | 2,260 lines, 15+ route handlers                              |
| Auth infrastructure | ✅ Built | AuthProvider, Descope SDK installed                          |
| OAuth flow          | ✅ Built | `services/tenants/src/oauth-configs.ts`, mcp-connector OAuth |
| HubSpot handler     | ✅ Built | `services/loader/src/handlers/hubspot.ts`                    |
| Spine pipeline      | ✅ Built | entity360-assembler, vault, memory-promoter                  |
| Governance engine   | ✅ Built | policies, proposals, workflow, audit                         |
| AI cognitive brain  | ✅ Built | fusion, context-to-truth, narrative                          |
| apps/web shell      | ✅ Built | 629 files, Vite + React Router, routing                      |
| Connector service   | ✅ Built | sync-producer/consumer, token-refresh                        |

### What needs end-to-end wiring

| Component                           | Gap                                    | Priority     |
| ----------------------------------- | -------------------------------------- | ------------ |
| HubSpot OAuth → Spine flow          | No verified E2E data flow              | P0           |
| Account list view                   | UI needs to display Spine entities     | P0           |
| Account detail view                 | Entity360 UI needs to render           | P0           |
| Auth → app shell                    | Descope integration needs verification | P0           |
| "What changed" summary              | Rule-based diff engine                 | P1           |
| AI observation loop                 | Nightly scan + significance scoring    | P1 (Month 2) |
| Continuity ("since you were away")  | State persistence + return summary     | P2 (Month 3) |
| AI drafting                         | Email/proposal generation              | P2 (Month 3) |
| Second connector (Zendesk/Intercom) | New OAuth + entity mapping             | P3 (Month 4) |

### What exists but is not needed yet

| Component                   | When needed |
| --------------------------- | ----------- |
| Full 15-domain platform     | Year 2      |
| Connector marketplace       | Month 9+    |
| Role-adaptive workbench     | Month 6+    |
| Swappable provider adapters | Month 9+    |
| MCP runtime                 | Month 6+    |
| Full governance workflow    | Month 5+    |
| Memory/knowledge system     | Month 4+    |

---

## After the Product Exists

- **Month 3:** Raise the seed. Working product + real feedback + demo that isn't a slide deck.
- **Month 6:** Technical co-founder joins. Architecture guides modular decomposition.
- **Month 9:** Platform boundary formalized. Provider swappability implemented.
- **Month 12:** 10-25 paying teams. AI observation loop refined. Connector count grows.
- **Month 18:** Series A. The documents become the pitch.

---

## The One Metric That Matters

**Does the user open the app tomorrow morning?**

Everything else is noise until that question is answered with a yes.
