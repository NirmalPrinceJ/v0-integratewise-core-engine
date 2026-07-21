# Core Engine Excavation Report

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**The Precious Gold: integratewise-core-engine (Jan 2026)**

---

## What We Found

The **integratewise-core-engine** is the missing backbone of IntegrateWise. It's the **event ingestion → Spine → AI routing → task generation** pipeline that makes the Human Workbench continuous and adaptive.

---

## Five Versions Across the Ecosystem

| Version | Location | Status | What It Is |
|---------|----------|--------|-----------|
| **CURRENT** | NirmalPrinceJ/integratewise-core-engine (standalone) | Updated 20h ago (62676c0) | Live production version |
| **MONOREPO** | apps/integratewise-core-engine in ai-workspace | Jan 2026 | Archived production code |
| **v0-VARIANT** | NirmalPrinceJ/v0-integratewise-core-engine | Jan 25 | Abandoned |
| **v0-VARIANT-2** | NirmalPrinceJ/v0-integratewise-core-engine-yu | Jan 25 | Abandoned |
| **EMBEDDED** | integrationwise-os app/api route | v11 | Merged into monorepo |

**The Precious Gold Lives In:** Monorepo version (v1.0.0, production-ready)

---

## Architecture: Event → Spine → AI → Tasks

```
┌─────────────────────────────────────┐
│  Webhook Ingress (Stripe, Slack,    │
│  HubSpot, Notion, GitHub, etc.)     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  CORE ENGINE (Hono Worker)          │
│  • Event validation                 │
│  • Normalization                    │
│  • Spine storage                    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  SPINE EVENTS TABLE (Neon)          │
│  • id: UUID                         │
│  • source: string                   │
│  • type: string                     │
│  • timestamp: ISO string            │
│  • payload: JSONB                   │
│  • metadata: JSONB                  │
│  • created_at, updated_at           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  AI ROUTER                          │
│  • Model selection (GPT-4o, Haiku)  │
│  • Task generation                  │
│  • Insight extraction               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  AI_TASKS Table / Workbench         │
│  • Generated tasks (priority, due)  │
│  • Insights (patterns)              │
│  • Actions (to Twin or Human)       │
└─────────────────────────────────────┘
```

---

## Core Engine: Code Structure

### 1. **index.ts** (Hono Worker Entry Point)
```typescript
- GET /health              → Check database connectivity
- GET /readiness           → K8s readiness probe
- POST /events             → Receive normalized event
                             (validate → save → analyze → route to AI async)
- GET /events              → Get recent events (all sources)
- GET /events/:source      → Get events by source (e.g., /events/stripe)
- GET /events/:source/:id  → Get single event
- POST /ai/route           → Explicit AI routing endpoint
- Error handler            → Structured error responses
```

**Key Feature:** Event ingestion is **non-blocking**. Save to database, then route to AI async. Fast feedback to caller, background task generation.

### 2. **ai-router.ts** (Multi-Model Orchestration)
```typescript
selectModel(event) {
  - 'stripe'        → gpt-4o-mini (simple financial)
  - 'slack/discord' → claude-3-haiku (fast conversation)
  - 'notion/github' → gpt-4o (complex understanding)
  - default         → gpt-4o-mini
}

generateTasks(event):
  - Stripe payment → "Process successful payment" (high priority)
  - Slack mention → "Respond to Slack mention" (medium priority)
  - GitHub PR     → "Review pull request" (medium priority)

generateInsights(event):
  - Extract patterns, trends, anomalies
  - Source-specific analysis
  - Return as insight array
```

### 3. **database.ts** (Neon Postgres Operations)
```typescript
saveEvent()        → INSERT + UPSERT (ON CONFLICT)
getEventsBySource()→ SELECT by source + limit
getEventById()     → SELECT by ID
getRecentEvents()  → SELECT recent across all sources
checkDatabaseHealth() → Health probe
```

**Database Client:** @neondatabase/serverless (works in CF Workers)

### 4. **types/spine-event.ts** (Schema Definition)
```typescript
SpineEvent = {
  id:        UUID
  source:    string  (stripe, slack, hubspot, etc.)
  type:      string  (payment_intent.succeeded, app_mention, etc.)
  timestamp: ISO string
  payload:   Record<string, unknown>  (source-specific data)
  metadata?: Record<string, unknown>  (optional)
}
```

---

## What This Enables

### 1. **Continuous Context Building**
- Every event → saved to Spine
- Spine becomes source-of-truth for "what happened"
- No context lost between sessions

### 2. **Adaptive Task Generation**
- Event → AI analysis → task (not manual)
- Different models per source (efficiency)
- Async background processing (fast UX)

### 3. **Multi-Source Event Ingestion**
- Stripe: Payments, customers, invoices
- Slack: Mentions, reactions, messages
- GitHub: PRs, issues, commits
- Notion: Updates, database entries
- HubSpot: Deals, companies, contacts
- Discord: Similar to Slack
- 100+ more via webhook normalization

### 4. **Memory Without Forgetting**
- Event stored permanently
- Queryable by source, type, timestamp
- Accessible to Twin for daily routines
- Accessible to Human in workbench

---

## Database: Two New Migrations

```sql
-- Migration 1: spine_events table
CREATE TABLE spine_events (
  id UUID PRIMARY KEY,
  source VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  payload JSONB NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX source_timestamp ON (source, timestamp DESC),
  INDEX created_at ON (created_at DESC)
);

-- Migration 2: ai_tasks table (from AI Router)
CREATE TABLE ai_tasks (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES spine_events(id),
  title VARCHAR NOT NULL,
  description TEXT,
  priority VARCHAR NOT NULL,  -- low, medium, high, critical
  due_date TIMESTAMP,
  model VARCHAR NOT NULL,     -- which AI generated this
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

---

## Integration Points

### 1. **With Webhook Workers**
```
Stripe Webhook → normalizes to SpineEvent
                    → POST /events (Core Engine)
                       → Save + Analyze + Route
```

### 2. **With Twin Routines**
```
Twin morning routine:
  1. Query recent events: GET /events?limit=100
  2. For each event: analyze patterns
  3. Generate daily briefing
```

### 3. **With Human Workbench**
```
Sales user opens dashboard:
  1. Fetch recent Stripe events (revenue)
  2. Fetch recent Slack events (conversation)
  3. Fetch AI tasks generated
  4. Display as insights + actionable tasks
```

### 4. **With Spine Memory**
```
Event → Spine → Memory
  "Renewal Risk" detected from 5 Stripe events
  → Save as Memory: { scope: 'org', content: {...} }
  → Available to Twin + Human across all surfaces
```

---

## Stack

| Component | Package | Version | Purpose |
|-----------|---------|---------|---------|
| **Runtime** | Cloudflare Workers | CF | Serverless event processing |
| **Framework** | Hono | 4.6.0 | Lightweight CF Worker HTTP server |
| **Database** | @neondatabase/serverless | 1.0.0 | Serverless Postgres client |
| **Schema** | Zod | 3.24.0 | Event validation + TypeScript types |
| **DevTools** | Wrangler | 4.0.0 | CF Workers CLI |
| **TypeScript** | ts | 5.0.0 | Full type safety |

---

## Deployment

```bash
# Local dev
npm run dev

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:prod

# Health check
curl https://core-engine.integratewise.com/health
→ { status: "ok", database: "connected", service: "integratewise-core-engine", version: "1.0.0" }

# Send event
curl -X POST https://core-engine.integratewise.com/events \
  -H "Content-Type: application/json" \
  -d '{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "source": "stripe",
    "type": "payment_intent.succeeded",
    "timestamp": "2026-01-21T10:30:00Z",
    "payload": { "amount": 5000, "customer": "cus_123" }
  }'
→ { success: true, event_id: "550e8400...", analysis: { summary: "...", importance: "high", actionable: true } }
```

---

## What Was Lost / What's Missing

### Lost in Consolidation
- Original v0-integratewise-core-engine variants (abandoned)
- Desktop client code for event ingestion
- Mobile event handler

### Still Needed
- Webhook workers (integratewise-webhooks) normalizes → Core Engine
- Consumer code that calls /events, /ai/route
- Twin daily routine service (consumes events)
- Memory consolidation service (events → memories)

---

## Integration with Platform Activation Framework

The Core Engine is **Layer 4 (AI Infrastructure)** from Platform Activation:

```
Layer 1: Human Workbench ← displays tasks/insights from Core Engine
         ↓
Layer 2: AI Workbench ← reads events from Core Engine
         ↓
Layer 3: Continuity Engine (Spine) ← stores events here
         ↓
Layer 4: AI Infrastructure
         ├─ Core Engine (Event → Spine → AI → Tasks)
         ├─ MCP routers
         ├─ ADK discovery
         ├─ Twin routines
         └─ Memory consolidation
         ↓
Layer 5: Connected Applications (100+)
```

The Core Engine **powers the continuity** by:
1. Saving every event to Spine (persistent context)
2. Routing to AI for task generation (automated inference)
3. Generating insights (patterns from raw data)
4. Enabling Twin to operate 24/7 (not idle)

---

## Why This Is "Precious Gold"

1. **Production-Ready**
   - Tested with real Stripe events
   - Handles 5+ webhook sources
   - Async processing (no timeouts)
   - Error handling + logging

2. **Event-Driven Architecture**
   - Not polling or cron jobs
   - Real-time ingestion
   - Scalable to 1000s of events/min

3. **Multi-Model Awareness**
   - Routes to right AI model per source
   - Optimizes cost + latency
   - Extensible selection logic

4. **Spine Integration**
   - Single source of truth for events
   - Queryable by source/type/time
   - JSONB payload (flexible)
   - Audit trail (created_at, updated_at)

5. **Async Task Generation**
   - Events ingested fast (save + return)
   - Tasks generated in background
   - No UX blocking
   - Twin can operate independently

---

## Next Steps: Integration Plan

### Immediate (This Week)
1. Copy Core Engine code into v0-project/services/core-engine
2. Integrate with Platform Activation SDK (expose as Capability endpoints)
3. Test event flow: Webhook → Core Engine → Spine → Workbench

### Short Term (Week 2-3)
4. Integrate with webhook workers (normalize incoming events)
5. Wire up Twin daily routines (consume events)
6. Wire up Memory consolidation (events → memories)

### Medium Term (Weeks 4+)
7. Add support for 50+ more webhook sources
8. Implement event deduplication
9. Add event replay (replay lost events)
10. Optimize for scale (million+ events/day)

---

## Status

✅ **Core Engine Production Ready** — Extracted from monorepo
✅ **Schema Defined** — spine_events + ai_tasks tables
✅ **Stack Validated** — Hono + Neon + Zod working
✅ **API Documented** — POST /events, GET /events, POST /ai/route

⏳ **Integration Pending** — Copy into v0-project + wire up

---

*Excavation Complete. Precious Gold Located and Documented.*
*Next: Deploy and activate the core engine in the unified platform.*

