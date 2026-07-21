# IntegrateWise Recovery Plan

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Restore the Human Layer First (June 26, 2026)

---

## Executive Summary

The product drifted from **human-centric** (Jan 2025) to **AI-centric** (current). The fix: Restore the Human Workbench as the PRIMARY product, with AI as invisible infrastructure underneath.

**Execution Timeline:**
1. **NOW (Phase 1)**: Deploy restored Human Workbench
2. **Week 1 (Phase 2)**: Customer Zero connects real tools (Gmail, Slack, GitHub, etc.)
3. **Week 2 (Phase 3)**: Spine Schema evolves from actual usage patterns
4. **Week 3 (Phase 4)**: AI Workbench builds its own environment separately

---

## Core Architecture

```
┌─────────────────────────────────────────────────┐
│         HUMAN WORKBENCH (PRIMARY)               │
│  (Dashboard, Contacts, Companies, Tasks, etc.)  │
│                                                 │
│    What users spend 8 hours a day in            │
└─────────────────────────────────────────────────┘
                       ↑
            ┌──────────┴──────────┐
            ↓                     ↓
    ┌──────────────────┐  ┌──────────────────┐
    │  AI Workbench    │  │ Collaboration    │
    │  (Twin's Home)   │  │ Overlay          │
    │                  │  │ (Questions,      │
    │ • Observations   │  │  Reviews,        │
    │ • Memory         │  │  Approvals)      │
    │ • Routines       │  │                  │
    │ • Recommendations│  └──────────────────┘
    └──────────────────┘
                       ↓
    ┌─────────────────────────────────────────────────┐
    │       CONTINUITY ENGINE (Always IW)             │
    │  • Spine Schema (Canonical Truth)               │
    │  • Shared Memory (Org, Work, Personal, AI)      │
    │  • Entity360 (Unified View)                     │
    │  • Auth & Governance                            │
    └─────────────────────────────────────────────────┘
                       ↓
    ┌─────────────────────────────────────────────────┐
    │    AI INFRASTRUCTURE (Invisible)                │
    │  • MCP Routing                                  │
    │  • ADK (Tool Discovery)                         │
    │  • Multi-Model Orchestration                    │
    │  • Reflection & Memory Promotion                │
    │  • Voice & Multimodal                           │
    └─────────────────────────────────────────────────┘
                       ↓
    ┌─────────────────────────────────────────────────┐
    │    CONNECTED APPLICATIONS (100+)                │
    │  Gmail • Slack • GitHub • Figma • Notion •      │
    │  Salesforce • HubSpot • Linear • Drive •         │
    │  WhatsApp • Calendar • CRM • and more...        │
    └─────────────────────────────────────────────────┘
```

---

## Phase 1: Restore the Human Workbench (IMMEDIATE)

### Current Status
- ✅ Backend services stable (Auth, Gateway, Intelligence, Knowledge, Connector)
- ✅ Real Customer Zero infrastructure exists (tenant: `iw-customer-zero`)
- ✅ Frontend foundation present (shell, L1 domains, L2 overlay)
- ⚠️ Frontend has experimental files that need cleanup
- ❌ Human surfaces not the primary focus (currently AI-first)

### Actions (IMMEDIATE)

**1. Clean up v0's Experimental FE Files**
```bash
# Remove experimental components that conflict
rm components/l1/entity-stretch.tsx
rm -rf components/l1/domains/customer-zero/
rm pages/Metrics.tsx  # v0's founder ops; flag for Replit reconciliation
```

**2. Verify Backend Contract**
```bash
# All critical backend services present:
✓ Auth: ALLOW_PASSWORD_AUTH gateway (gateway/src/auth.ts)
✓ Services: intelligence, connector, knowledge (gateway/wrangler.toml)
✓ Twin: /v1/chat/completions (intelligence/src/index.ts)
✓ Knowledge: Queue consumers + hourly cron (knowledge/wrangler.toml)
```

**3. Deploy to Preview / Production**
```bash
# Deploy the cleaned-up Dashboard
# This is the restored Human Workbench with existing L1/L2 intact
# URL: https://v0-integrate-wise-operating-system-9gg7ctap4-integratewize.vercel.app/dashboard
```

**4. TypeScript Verification**
```bash
tsc --noEmit
# Expected: 0 errors (after removing experimental files)
```

---

## Phase 2: Customer Zero Uses the Workbench (Week 1)

### Customer Zero Initial Setup

**User: Nirmal Prince**
- Organization: IW Customer Zero
- Tenant ID: `iw-customer-zero`
- Role: Founder (full access)

### Surfaces to Activate

**Human Workbench Surfaces** (These exist, ensure they're functional):
- ✅ Dashboard (overview, metrics, quick actions)
- ✅ Accounts (contact info, preferences)
- ✅ Contacts (people, relationships)
- ✅ Companies (prospects, customers, partners)
- ✅ Opportunities (deals, pipeline, status)
- ✅ Tasks (personal, team, recurring)
- ✅ Calendar (meetings, events, sync)
- ✅ Notes (quick capture, scratch pad)
- ✅ Meetings (recording, summary, action items)
- ✅ Communications (email, messages, history)
- ✅ Documents (files, shared, versions)
- ✅ Knowledge (FAQs, processes, learnings)
- ✅ Goals (quarterly, tracking, alignment)
- ✅ Values (principles, culture, decision rules)
- ✅ Reports (custom, scheduled, dashboards)
- ✅ Settings (preferences, integrations)

**Actions for Customer Zero:**

1. **Connect Real Tools** (one by one)
   ```
   Week 1:
   - Gmail (primary email, calendar)
   - Slack (team communication)
   - GitHub (projects, code, releases)
   - Calendar (meetings, availability)
   
   Week 2:
   - Figma (design work)
   - Notion (documentation)
   - HubSpot (leads, sales)
   - Linear (task management)
   
   Week 3:
   - Salesforce (CRM)
   - Drive (file storage)
   - WhatsApp (personal comms)
   - and more as needed
   ```

2. **Use the Workbench Naturally**
   - Work across surfaces as part of daily routine
   - See how context flows between tools
   - Notice what information is lost/duplicated
   - Provide feedback on each surface

3. **Spine Schema Evolves**
   - As Customer Zero connects Gmail → captures email as Continuity Entity
   - As they use Slack → captures conversations as Memory
   - As they view GitHub → captures projects as Spine Nodes
   - Schema grows organically from actual usage

---

## Phase 3: Spine Schema Enhancement (Week 1-2, Parallel)

### What the Spine Schema Tracks

As Customer Zero works, the Spine learns:

**Entities:**
```
Person
  ├─ name, email, role, org
  ├─ relationships (manages, reports-to, collaborates-with)
  └─ memory (notes, preferences, history)

Organization
  ├─ name, industry, size
  ├─ teams, departments
  └─ goals, values, culture

Work Item (Task, Issue, Deal, etc.)
  ├─ title, status, priority
  ├─ owner, team, deadline
  ├─ relationships (blocks, depends-on, related-to)
  └─ history (created, updated, assigned, closed)

Communication (Email, Message, Meeting)
  ├─ participants, timestamp, content
  ├─ entities mentioned (people, companies, projects)
  └─ action items extracted

Document (File, Note, Decision)
  ├─ content, metadata, versions
  ├─ ownership, access, sharing
  └─ relationships (references, citations)
```

**Relationships:**
```
alice works-for company-acme
company-acme has-team engineering
alice owns task-mobile-app
task-mobile-app blocks task-api-gateway
alice received-email from bob
email-12345 mentions company-acme, project-x
```

**Memory:**
```
Org Memory:
  • ACME's Q4 goal: 500K ARR
  • All PRs require 2 reviewers
  • Deployment: Fridays only
  • Security: 2FA mandatory

Work Memory:
  • Alice owns mobile app
  • Bob leads backend team
  • Q4 roadmap: auth, payments, analytics

Personal Memory (Nirmal):
  • Prefers async communication
  • Reviews code Friday mornings
  • Coffee 1:1s every Monday
```

### Spine Evolution Process

**Week 1:**
- Customer Zero connects 4 apps (Gmail, Slack, GitHub, Calendar)
- Spine stores 50+ base entities, 200+ relationships
- Memory captures first org principles and work patterns

**Week 2:**
- Customer Zero connects 5+ more apps
- Spine now tracks 150+ entities, 500+ relationships
- Memory enriched with work practices, communication patterns

**Week 3:**
- Full integrations show data normalization
- Spine handles duplicates, merges, and conflicts
- Schema validated against real work patterns

### Spine Schema Delivery (to Replit/Backend Team)
```
Deliverable: Spine-Schema-v1.0-CustomerZero.json
├─ Entity Types (20+)
├─ Relationship Types (40+)
├─ Memory Scopes (Org, Work, Personal, AI)
├─ Governance Rules (Access Control)
└─ Continuity Rules (Entity Linkage)

This becomes the canonical schema for all future customers.
```

---

## Phase 4: AI Workbench Builds Its Own Home (Week 2-3, Parallel)

### Why AI Needs Its Own Workbench

- **Not idle**: AI continuously observes, learns, reflects
- **Daily routines**: Health checks, memory consolidation, recommendations
- **Persistent memory**: Learnings carry across sessions
- **Autonomous work**: Drafts, summaries, coordination
- **Human-separate**: AI operations don't interrupt human work surface

### AI Workbench Surfaces

**AI Observations** (What Twin sees):
```
Today's Activity:
  • 12 emails received (3 action-required)
  • 4 Slack channels active (2 mentions)
  • 2 GitHub PRs waiting review
  • 1 calendar conflict (meeting overlap)
  • 3 tasks past deadline

Patterns Detected:
  • Alice: Working late (emails at 11pm)
  • Bob: High context switching (7 different projects)
  • Team: Needs API documentation
```

**AI Memory** (Persistent across sessions):
```
Learned Facts:
  • Deployment always Friday (not Wednesday)
  • Alice's code style: 2-space indent
  • Team needs async standup by 9am
  • Customer X has payment issues (recurring)

Recommendations Prepared:
  • Move meeting to avoid conflict
  • Follow up on overdue tasks
  • Review PRs waiting >2 days
  • Summarize Slack discussion
```

**AI Routines** (What Twin does daily):
```
6:00 AM:
  ├─ Review overnight emails
  ├─ Check Slack for urgent messages
  ├─ Read new GitHub issues
  └─ Consolidate overnight facts into memory

8:00 AM (Daily Standup Time):
  ├─ Prepare team summary
  ├─ Highlight blockers
  ├─ Flag deadlines
  └─ Surface recommendations

5:00 PM (EOD):
  ├─ Summarize day's activity
  ├─ Extract learnings
  ├─ Flag follow-ups
  └─ Prepare next day preview

Ongoing:
  ├─ Monitor for anomalies
  ├─ Detect decisions needing approval
  ├─ Track commitment dates
  ├─ Build continuity across disconnected tools
```

**AI Collaboration Points** (When Twin asks for help):
```
"Alice, I noticed 3 PRs waiting your review (>3 days).
Ready to bulk review, or blocked on other work?"

"Team: 5 action items due this week, 2 still unstarted.
Should we adjust timeline or get support?"

"Customer support is responding slow (>6 hours).
Should I draft a faster response template?"
```

### AI Implementation References

The AI should build from reference implementations:
- Existing Twin session patterns (how context is built)
- Existing memory consolidation (how facts are extracted)
- Existing recommendation engine (how options are surfaced)
- Existing multi-model routing (how Claude/GPT/Gemini are orchestrated)

**AI Workbench Delivery (Week 3):**
- Separate UI environment for AI operations
- Daily routine scheduler (morning standup, EOD summary)
- Memory consolidation service
- Observation dashboard
- Human hand-off interface (for approvals, clarifications)

---

## Configuration Model (Surfaces as Features)

### Every Surface is a Separately Built Feature

**Structure:**
```
left-sidebar/
├─ navigation.tsx (configurable menu)
│
workbench-surfaces/
├─ dashboard/
│   ├─ page.tsx
│   ├─ components/
│   └─ hooks/
├─ accounts/
│   ├─ page.tsx
│   ├─ components/
│   └─ hooks/
├─ contacts/
│   ├─ page.tsx
│   ├─ components/
│   └─ hooks/
├─ companies/
│   ├─ page.tsx
│   ├─ components/
│   └─ hooks/
└─ [50+ more surfaces]

surface-registry/
├─ registry.ts (defines all surfaces)
├─ config.ts (which surfaces enabled for which roles)
└─ hooks.ts (enable/disable, reorder)
```

### Left Sidebar Configuration

**How it works:**
```typescript
// Surface Registry
const SURFACES = {
  dashboard: { label: 'Dashboard', icon: 'home', enabled: true },
  accounts: { label: 'Accounts', icon: 'user', enabled: true },
  contacts: { label: 'Contacts', icon: 'users', enabled: true },
  companies: { label: 'Companies', icon: 'building', enabled: true },
  opportunities: { label: 'Opportunities', icon: 'briefcase', enabled: true },
  tasks: { label: 'Tasks', icon: 'checkbox', enabled: true },
  calendar: { label: 'Calendar', icon: 'calendar', enabled: true },
  notes: { label: 'Notes', icon: 'notepad', enabled: false }, // disabled by user
  // ... 50+ more
}

// Sidebar Configuration (per-user)
const sidebarConfig = {
  order: ['dashboard', 'accounts', 'contacts', 'companies', ...],
  pinned: ['dashboard', 'calendar'],
  collapsed: [],
  favorites: ['opportunities', 'tasks'],
}

// Enable/disable surfaces
useSurfaceConfig()
  ├─ getSurfaces() → return visible surfaces
  ├─ toggleSurface(id) → enable/disable
  ├─ reorderSurfaces([...]) → custom order
  └─ resetToDefaults() → back to factory
```

**User Experience:**
1. Open workbench
2. Left sidebar shows configurable surfaces
3. Right-click on surface → "Hide this surface"
4. Click gear icon → "Configure surfaces"
5. Reorder by drag-drop
6. Each surface is independently functional

---

## Implementation Roadmap

### IMMEDIATE (This Week)
- ✅ Clean v0 experimental files (`entity-stretch`, `customer-zero-workspace`)
- ✅ Verify backend contract (all services present)
- ✅ Deploy Human Workbench (preview or production)
- ✅ Confirm TypeScript clean (0 errors)

### WEEK 1
- ✅ Customer Zero begins using workbench
- ✅ Customer Zero connects first 4 apps (Gmail, Slack, GitHub, Calendar)
- ✅ Spine ingests data from connected apps
- ✅ Surfaces tested with real usage patterns

### WEEK 2
- ✅ Customer Zero connects 5+ more apps
- ✅ Spine Schema v1.0 documented (from real usage)
- ✅ AI Workbench begins daily routine observ ations
- ✅ Memory consolidation starts

### WEEK 3
- ✅ Full integration suite working
- ✅ Spine Schema refined based on conflicts/duplicates discovered
- ✅ AI Workbench collaboration overlay ready
- ✅ Human + AI working together over shared continuity

### ONGOING
- Customer Zero provides feedback on each surface
- Spine Schema evolves with new tool connections
- AI learns from daily work patterns
- Surface configuration options expand
- Continuity becomes invisible infrastructure

---

## What Doesn't Change

✅ **Backend Contract** (All verified present):
- Auth with password authentication enabled
- Gateway service bindings (intelligence, connector, knowledge)
- Twin model route (`/v1/chat/completions`)
- Knowledge queue consumers + cron jobs

✅ **Real Customer Zero Infrastructure**:
- Existing tenant: `iw-customer-zero`
- Existing verification component
- Existing Spine client seeding

✅ **Frontend Foundation** (Intact):
- Shell and routing
- L1 domains (all surfaces)
- L2 overlay system
- Real customer-zero infra integration

---

## What Changes

❌ **Focus**: From AI-centric → Human-centric (workbench is PRIMARY)

🔄 **Architecture**: AI moves UNDERNEATH (invisible infrastructure)

📊 **Surfaces**: Each built as separately configured feature (not AI overlay)

🧠 **AI Role**: Has its own workbench (not idle, has daily routines)

🔗 **Memory**: Shared between Human and AI (with boundaries respected)

🌐 **Continuity**: Invisible but always working (the real moat)

---

## Success Metrics

**Phase 1 (Deploy):**
- ✅ TypeScript clean (0 errors)
- ✅ Workbench deployable (no compilation issues)
- ✅ All backend services online
- ✅ Customer Zero can log in

**Phase 2 (Usage):**
- ✅ Customer Zero using workbench 30+ min/day
- ✅ 4+ tools connected and syncing
- ✅ Context flowing between surfaces
- ✅ No duplicate information visible

**Phase 3 (Spine):**
- ✅ Spine Schema v1.0 documented
- ✅ 150+ entities tracked
- ✅ 500+ relationships indexed
- ✅ Memory boundaries enforced

**Phase 4 (AI):**
- ✅ AI Workbench operational
- ✅ Daily routines executing
- ✅ Memory consolidation working
- ✅ Human-AI collaboration successful

---

## Call to Action

**This Week:**
1. Clean experimental files (10 min)
2. Deploy restored workbench (15 min)
3. Verify TypeScript clean (5 min)
4. Confirm Customer Zero can access (5 min)

**Next Week:**
- Customer Zero starts using it
- Tools start connecting
- Spine Schema starts evolving

**Long term:**
- Humans and AI working together
- Shared memory, respected boundaries
- Continuity invisible but omnipresent
- No more "Stop Being Human APIs" — you have a unified surface

---

## Documents to Review

**Already Created:**
- ✅ `UNIVERSAL_CONNECTION_POOL_ARCHITECTURE.md` (Tenant-owned capability pool)
- ✅ `SPINE_CONNECTION_POOL_ARCHITECTURE.md` (Shared connector pattern)

**To Be Created (By Backend/Replit):**
- 🔄 Spine Schema v1.0 (from Customer Zero actual usage)
- 🔄 AI Workbench Reference Implementation
- 🔄 Surface Registry & Configuration System
- 🔄 Memory Consolidation Service

---

**Status: READY TO EXECUTE**

Human Layer Recovery Plan is coherent, actionable, and grounded in existing infrastructure.
Next step: Clean files → Deploy → Activate Customer Zero → Build from real patterns.

