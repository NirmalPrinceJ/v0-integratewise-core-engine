# IntegrateWise Complete Pipeline: Auth → IW Bridge → Spine Hydration → Workbench → Memory


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Executive Overview

This document specifies the **complete end-to-end pipeline** for IntegrateWise, building on the existing infrastructure:

- ✅ **OAuth + Clerk Auth** (already in gateway)
- ✅ **MCP Server** (spine-mcp-server.ts production-ready)
- ✅ **Connector Registry** (domain-master pattern in place)
- ✅ **L1 Projections** (role-aware, 16 workbenches)
- ✅ **Domain Workspaces** (5 domains, 30+ views)
- ❌ **Missing: Onboarding → Connector Approval → Spine Hydration → Workspace Loader → AI Memory**

## 1. Auth + Onboarding Flow

### 1.1 Current State
- Gateway handles OAuth (Google/GitHub)
- Users resolve to tenants via email domain or metadata
- Clerk stores user metadata (role, org, preferences)

### 1.2 What's Missing: Onboarding Sequence

**Flow:**
```
OAuth Callback
  ↓
Check if user exists in tenant
  ↓
If NEW → Onboarding Wizard
  ├─ Map role → functional category (Sales, CS, Support, etc.)
  ├─ Display suggested connectors per role
  ├─ Collect connector preferences (which to activate)
  └─ Store in tenant_spine_config
  ↓
If EXISTING → Skip to Workspace Load
  ↓
Issue MCP token (15 min, HMAC-signed)
  ↓
Redirect to /workspace/{domain}/{defaultView}
```

### 1.3 Implementation Tasks

1. **Create Onboarding API** (`POST /api/v1/onboarding/start`)
   - Input: user profile from OAuth
   - Output: role options, suggested connectors, wizard config
   - Storage: write to D1 tenant_spine_config

2. **Create Connector Selection UI** (`components/onboarding/connector-selector.tsx`)
   - Display role → connectors matrix
   - Multi-select with descriptions
   - Store selections in session

3. **Create Onboarding Completion API** (`POST /api/v1/onboarding/complete`)
   - Input: selected connectors, role confirmation
   - Action: activate connectors in registry (not authorize yet)
   - Issue MCP token
   - Redirect to workspace

**Files to Create:**
- `services/gateway/src/onboarding.ts`
- `apps/web/app/api/v1/onboarding/start/route.ts`
- `apps/web/app/api/v1/onboarding/complete/route.ts`
- `apps/web/components/onboarding/connector-selector.tsx`
- `apps/web/components/onboarding/onboarding-wizard.tsx`

---

## 2. IW Bridge + MCP Server (Already Built)

### 2.1 Current State
✅ `services/mcp-connector/src/spine-mcp-server.ts` is production-ready with:
- `spine.query`, `spine.get`, `spine.summary`
- `memory.search`, `memory.propose`
- `spine.connected_sources`
- Tenant isolation, schema projection, tier gating

### 2.2 Missing: ConnectorContext Middleware

**What's needed:**
- Extract MCP token from request headers
- Validate HMAC signature
- Populate SpineMcpActor from token
- Middleware in CF Worker to inject actor into tool dispatch

**Files to Create:**
- `services/mcp-connector/src/middleware/auth.ts` (token validation)
- `services/mcp-connector/src/middleware/actor.ts` (actor resolution)

### 2.3 Missing: ChatGPT Connector Registration

**Action:**
1. Register IW MCP server in ChatGPT's connector UI
   - URL: `https://mcp.integratewise.ai/mcp`
   - Auth: Bearer token from session
2. ChatGPT can now call IW tools (spine.query, memory.search, etc.)
3. IW can call ChatGPT's tools (Salesforce, Gmail, etc.) via ChatGPT's connector API

**No new code needed** — registration is manual/UI-driven

---

## 3. Spine Hydration from Connectors

### 3.1 Architecture

**Data Flow:**
```
Connector (Freshsales, Apollo, Gmail)
  ↓ (emits raw events)
IW Bridge MCP Emitter
  ↓ (calls spine-emitter.ts)
Spine Schema Provider
  ├─ Resolve: functional_category + connector → capabilities
  ├─ Map: raw fields → merge fields
  ├─ Derive: business objects (Account, Contact, Deal)
  └─ Hydrate: into Spine (D1 + encrypted vault)
  ↓
Spine Hydrated (canonical entities)
```

### 3.2 Current State

✅ `packages/types/src/spine-schema-provider.ts` — formula works
✅ `packages/connectors/src/spine-emitter.ts` — emitter pattern exists
✅ `services/connector/src/connector.test.ts` — tests passing

### 3.3 Missing: LiveConnector Implementations

**For Customer-Zero (B2B SaaS GTM):**

1. **Freshsales** (CRM)
   - Adapter: map Lead, Contact, Deal → Opportunity, Account, Contact
   - Merge fields: stage, value, probability, owner, fit_score, last_activity
   - Events: new_contact, deal_moved, activity_logged

2. **Apollo** (Enrichment)
   - Adapter: map enriched Contact + Company → Contact + Account signals
   - Merge fields: industry, revenue, employee_count, verified_email, phone
   - Events: new_enrichment_available

3. **Razorpay/Stripe** (Payments)
   - Adapter: map Customer, Invoice, Subscription → Account, Invoice, Subscription
   - Merge fields: MRR, ARR, payment_status, renewal_date, days_overdue, churn_risk
   - Events: payment_success, subscription_created, invoice_due

4. **Gmail** (Communications)
   - Adapter: map Thread, Message → Communication (linked to Contact/Deal)
   - Merge fields: last_email_date, email_sentiment, response_time
   - Events: new_email, email_opened, reply_received

5. **Zoom** (Meetings)
   - Adapter: map Recording, Participant → Meeting (linked to Account/Contact)
   - Merge fields: attendance_rate, duration, sentiment, action_items
   - Events: meeting_recorded, participant_engaged

### 3.4 Implementation Tasks

For each connector:

1. **Create Connector Adapter** (`packages/connectors/src/adapters/{connector}.ts`)
   ```typescript
   export interface ConnectorAdapter {
     connectorId: string
     functionalCategory: 'crm' | 'enrichment' | 'accounting' | 'comms' | 'analytics'
     mapToMergeFields(rawRecord: any): MergeFieldMap
     mapToBusinessObjects(record: any): BusinessObject[]
     getEventStream(): AsyncIterable<ConnectorEvent>
   }
   ```

2. **Register in ConnectorRegistry** 
   ```typescript
   const registry = ConnectorRegistry.getInstance()
   registry.configure('crm', 'freshsales', { accessToken, instanceUrl })
   ```

3. **Stream events through Spine Emitter**
   ```typescript
   const emitter = getSpineEmitter(tenantId)
   adapter.getEventStream().pipe((event) => {
     emitter.emit('connector.event', event)
   })
   ```

4. **Write to D1 Vault** (encrypted)
   - Spine Emitter calls vault.upsert()
   - Vault encrypts and stores
   - Searchable via Vectorize index

**Files to Create:**
- `packages/connectors/src/adapters/freshsales.ts`
- `packages/connectors/src/adapters/apollo.ts`
- `packages/connectors/src/adapters/razorpay.ts`
- `packages/connectors/src/adapters/gmail.ts`
- `packages/connectors/src/adapters/zoom.ts`

---

## 4. Workspace Loader & Normalizer ("Creamy Load")

### 4.1 Architecture

**UI Load Flow:**
```
User navigates to /workspace/{domain}/{view}
  ↓
Workspace Loader (server component)
  ├─ Read: user role, org, domain mapping
  ├─ Call: L1Provider → generateProjectionForRole(role)
  └─ Call: Normalizer → convert Spine data to L1 metrics/widgets
  ↓
Normalizer (data layer)
  ├─ Query: Spine for entity_type + filters
  ├─ Transform: canonical fields → L1Projection metrics
  ├─ Bind: widgets to data sources
  └─ Return: fully hydrated L1Projection
  ↓
Dashboard renders
  ├─ Metrics display values
  ├─ Widgets show data
  ├─ Quick actions enabled
  └─ User sees their domain view

```

### 4.2 Current State
✅ L1Provider generates projections (static data)
✅ RoleAwareDashboard renders projections
✅ Domain workspaces render views
❌ Missing: hydration from actual Spine data

### 4.3 Implementation Tasks

1. **Create Workspace Loader** (`apps/web/components/workspace-loader.tsx`)
   ```typescript
   interface WorkspaceLoaderProps {
     userRole: UserRole
     domainId: DomainId
     viewId: string
   }
   
   export async function WorkspaceLoader({ userRole, domainId, viewId }: WorkspaceLoaderProps) {
     // 1. Get projection from L1Provider
     const projection = generateProjectionForRole(userRole)
     
     // 2. Load Spine data via normalizer
     const normalizedData = await normalizeSpineForProjection(projection, domainId)
     
     // 3. Render view with hydrated data
     return <WorkspaceView projection={projection} data={normalizedData} />
   }
   ```

2. **Create Normalizer** (`apps/web/lib/spine-normalizer.ts`)
   ```typescript
   export async function normalizeSpineForProjection(
     projection: L1Projection,
     tenantId: string
   ): Promise<NormalizedData> {
     // For each metric in projection
     for (const metric of projection.metrics) {
       const rawData = await querySpine(metric.data_source, metric.filters)
       metric.value = calculateValue(rawData)
       metric.trend = calculateTrend(rawData)
     }
     
     // For each widget
     for (const widget of projection.widgets) {
       const rawData = await querySpine(widget.data_source, widget.filters)
       widget.data = normalizeWidgetData(rawData)
     }
     
     return { metrics: projection.metrics, widgets: projection.widgets }
   }
   ```

3. **Create Spine Query Helper** (`apps/web/lib/spine-query.ts`)
   ```typescript
   export async function querySpine(
     dataSource: string,
     filters: Record<string, any>
   ): Promise<any[]> {
     // Call MCP tool via server action
     const result = await callSpineMcpTool('spine.query', {
       entity_type: dataSource,
       ...filters,
     })
     return result.entities
   }
   ```

4. **Create Server Action for MCP Calls** (`apps/web/app/actions/spine.ts`)
   ```typescript
   'use server'
   
   export async function callSpineMcpTool(
     toolName: string,
     args: Record<string, any>
   ) {
     const token = await getMcpToken() // from session
     const response = await fetch('https://mcp.integratewise.ai/call', {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ tool: toolName, arguments: args }),
     })
     return response.json()
   }
   ```

**Files to Create:**
- `apps/web/components/workspace-loader.tsx`
- `apps/web/lib/spine-normalizer.ts`
- `apps/web/lib/spine-query.ts`
- `apps/web/app/actions/spine.ts`

---

## 5. Indirect Data from ChatGPT → Spine

### 5.1 Architecture

**Conversation Capture Flow:**
```
User talks to ChatGPT (via integratewise-connector)
  ↓ (ChatGPT uses IW MCP tools: spine.query, spine.get, etc.)
ChatGPT generates response + calls spine.propose() or external tool
  ↓
IW Bridge captures:
  ├─ Conversation metadata (user_id, tenant_id, timestamp)
  ├─ Entity refs (which accounts/deals were mentioned)
  ├─ Proposed memory (decisions, insights, actions)
  └─ Executed actions (deals created, meetings scheduled)
  ↓
Spine Emitter writes:
  ├─ Conversation entity
  ├─ Memory proposals (to Triage Bot queue)
  └─ Action audit log
  ↓
Spine Hydrated with conversation context
```

### 5.2 Implementation Tasks

1. **Capture Conversation Metadata** (in MCP server)
   ```typescript
   // When memory.propose is called from ChatGPT
   const proposal = {
     id: generateId(),
     source_type: 'ai_conversation',
     source_id: req.headers['x-conversation-id'],
     proposed_by: 'mcp_agent',
     tenant_id: actor.tenant_id,
     user_id: actor.user_id,
     content_type: args.content_type,
     title: args.title,
     body: args.body,
     entity_refs: args.entity_refs,
     confidence: args.confidence,
     evidence: args.evidence,
     created_at: new Date().toISOString(),
   }
   
   await db.prepare(
     `INSERT INTO proposals (...) VALUES (...)`
   ).bind(...).run()
   ```

2. **Triage Bot for Governance** (`services/governance/src/triage-bot.ts`)
   - Scores proposals by confidence + entity refs
   - Auto-approves ≥0.85
   - Routes 0.60-0.84 to HITL (human)
   - Rejects <0.60

3. **Sync Actions Back to ChatGPT** (optional)
   - When MCP tool modifies Spine, notify ChatGPT
   - ChatGPT can track what it did

**Files to Create:**
- `services/governance/src/triage-bot.ts`
- `services/mcp-connector/src/handlers/proposal.ts` (enhanced)
- `services/governance/src/rules/auto-approve.ts`

---

## 6. Intelligent Overlay + AI Home (Gradual Activation)

### 6.1 Phases

#### Phase 0: Static Summaries (Week 1)
- AI Home shows **morning brief**
- Uses Spine data (no AI generation)
- Hardcoded templates

#### Phase 1: Recommendations (Week 2)
- Overlays on each domain view
- "Account at risk" badges
- "Deal stalled" warnings
- Powered by L2 twins (learned patterns)

#### Phase 2: Workflows (Week 3)
- "Schedule EBR" with context
- "Send renewal email" with template
- "Escalate ticket" with suggested priority

#### Phase 3: Agent Loops (Week 4+)
- Multi-step orchestrations
- Governed by policies
- E.g., "check health, schedule EBR if <70, send playbook"

### 6.2 Implementation Tasks

1. **Create AI Home View** (`apps/web/components/ai-home/index.tsx`)
   ```typescript
   export async function AIHome() {
     const briefData = await generateMorningBrief()
     return (
       <div>
         <MorningBrief data={briefData} />
         <OperatingPulse data={briefData} />
         <RoleBasedSuggestions data={briefData} />
       </div>
     )
   }
   ```

2. **Create Intelligence Overlay** (`apps/web/components/intelligence-overlay/index.tsx`)
   - Appears on domain views
   - Fetches twin insights for visible entities
   - Renders badges + recommendations

3. **Create Twin Insights Service** (`apps/web/lib/twin-insights.ts`)
   - Calls L2 context to get learned patterns
   - Calculates risk scores
   - Returns actionable recommendations

**Files to Create:**
- `apps/web/components/ai-home/index.tsx`
- `apps/web/components/ai-home/morning-brief.tsx`
- `apps/web/components/ai-home/operating-pulse.tsx`
- `apps/web/components/intelligence-overlay/index.tsx`
- `apps/web/lib/twin-insights.ts`

---

## 7. Memory: Conversational + Organizational

### 7.1 Architecture

**Memory Layers:**
```
Conversational Memory (AI chats)
  ↓ (patterns + insights extracted)
Organizational Memory (shared knowledge)
  ├─ Doctrine (how we work)
  ├─ Decisions (what we decided)
  ├─ Workflows (processes that work)
  ├─ Insights (patterns we learned)
  └─ Commitments (what we promised)
```

### 7.2 Implementation Tasks

1. **Store Conversations** (`services/knowledge/src/handlers/conversation.ts`)
   - On ChatGPT tool calls, capture thread context
   - Write to `conversations` table in D1
   - Link to entities (contacts, deals, etc.)

2. **Triage & Promote** (`services/governance/src/memory-promoter.ts`)
   - Periodically scan conversations
   - Find patterns (e.g., "renewal deals close faster with X playbook")
   - Propose promotion to org memory

3. **Memory UI** (`apps/web/components/org-memory/knowledge-base.tsx`)
   - Browse org memory by category
   - Search semantic
   - Contribute new memories

**Files to Create:**
- `services/knowledge/src/handlers/conversation.ts`
- `services/governance/src/memory-promoter.ts`
- `apps/web/components/org-memory/knowledge-base.tsx`
- `apps/web/components/org-memory/memory-search.tsx`

---

## 8. Integration with Existing System

### How This Connects to What We've Built

**Layer 1: Frontend (Already Built)**
- ✅ OAuth + role-aware L1Provider
- ✅ 16 role workbenches
- ✅ 5 domain workspaces
- ✅ 40+ action routes, 30+ widget routes
- ❌ Missing: Loader & Normalizer to hydrate from Spine

**Layer 2: Backend (Partially Built)**
- ✅ MCP server (production-ready)
- ✅ Connector Registry (pattern in place)
- ✅ Spine Schema Provider (formula working)
- ❌ Missing: Live connector implementations, hydration pipeline

**Layer 3: Data (Partially Built)**
- ✅ Merge fields + business objects
- ✅ D1 + encrypted vault infrastructure
- ❌ Missing: Population from connectors

**Layer 4: AI (Not Started)**
- ❌ Missing: Onboarding, AI Home, intelligence overlays, memory governance

---

## 9. Critical Path Implementation Order

For **Customer-Zero GTM (Sales + CS B2B SaaS)**:

1. **Week 1: Auth + Onboarding**
   - Onboarding wizard
   - Connector selector UI
   - MCP token generation

2. **Week 1-2: Live Connectors (Freshsales + Razorpay)**
   - Freshsales adapter (leads, deals, contacts)
   - Razorpay adapter (invoices, subscriptions, MRR)
   - Spine hydration working

3. **Week 2: Workspace Loader + Normalizer**
   - Dashboard fully hydrated with real data
   - Metrics calculate from Spine
   - Widgets display connector data

4. **Week 3: ChatGPT Integration**
   - Register MCP server as ChatGPT connector
   - Test spine.query, memory.search from ChatGPT
   - Capture conversation proposals

5. **Week 3-4: AI Home + Intelligence Overlay**
   - Morning brief template
   - Risk badge overlays
   - Gradual feature rollout

6. **Week 4+: Memory Governance + Org Knowledge**
   - Triage Bot for proposal scoring
   - Memory promotion from conversations
   - Org memory UI

---

## 10. Success Metrics

Track after launch:

- **Adoption**: % users completing onboarding
- **Data Freshness**: Last sync time for each connector
- **Workbench Usage**: Metrics viewed, actions clicked per role/domain
- **AI Engagement**: Memory searches, proposals generated
- **Projection Accuracy**: Metrics match source-of-truth (Freshsales, Razorpay, etc.)

---

## 11. Files Summary

### New Files to Create (35 total)

**Onboarding:**
- `services/gateway/src/onboarding.ts`
- `apps/web/app/api/v1/onboarding/start/route.ts`
- `apps/web/app/api/v1/onboarding/complete/route.ts`
- `apps/web/components/onboarding/connector-selector.tsx`
- `apps/web/components/onboarding/onboarding-wizard.tsx`

**MCP + Bridge:**
- `services/mcp-connector/src/middleware/auth.ts`
- `services/mcp-connector/src/middleware/actor.ts`

**Connectors:**
- `packages/connectors/src/adapters/freshsales.ts`
- `packages/connectors/src/adapters/apollo.ts`
- `packages/connectors/src/adapters/razorpay.ts`
- `packages/connectors/src/adapters/gmail.ts`
- `packages/connectors/src/adapters/zoom.ts`

**Workspace Loader:**
- `apps/web/components/workspace-loader.tsx`
- `apps/web/lib/spine-normalizer.ts`
- `apps/web/lib/spine-query.ts`
- `apps/web/app/actions/spine.ts`

**ChatGPT Integrations:**
- `services/mcp-connector/src/handlers/proposal.ts` (enhanced)
- `services/governance/src/triage-bot.ts`
- `services/governance/src/rules/auto-approve.ts`

**AI Home + Overlay:**
- `apps/web/components/ai-home/index.tsx`
- `apps/web/components/ai-home/morning-brief.tsx`
- `apps/web/components/ai-home/operating-pulse.tsx`
- `apps/web/components/intelligence-overlay/index.tsx`
- `apps/web/lib/twin-insights.ts`

**Memory:**
- `services/knowledge/src/handlers/conversation.ts`
- `services/governance/src/memory-promoter.ts`
- `apps/web/components/org-memory/knowledge-base.tsx`
- `apps/web/components/org-memory/memory-search.tsx`

### Files to Enhance (8 total)

- `services/mcp-connector/src/spine-mcp-server.ts` (add conversation capture)
- `apps/web/lib/l1-l2-context.ts` (add twin insights context)
- `apps/web/app/(app)/dashboard/page.tsx` (route to workspace-loader)
- `apps/web/components/domains/domain-views.tsx` (integrate intelligence overlay)
- `services/gateway/src/auth.ts` (issue MCP token on callback)
- `packages/types/src/projection-layers.ts` (add memory types)

---

## Next Actions

1. **Start Onboarding** (Task 1 in TodoList)
   - Create onboarding APIs
   - Build connector selector UI
   - Test flow end-to-end

2. **Implement Live Connectors** (Task 2)
   - Freshsales adapter (sales + contacts)
   - Razorpay adapter (invoices + MRR)
   - Test hydration

3. **Build Workspace Loader** (Task 3)
   - Connect L1Provider to actual Spine data
   - Test metrics calculation
   - Dashboard displays real data

4. **Enable ChatGPT** (Task 4)
   - Register MCP connector
   - Test spine.query from ChatGPT
   - Capture proposals

5. **Add AI Features** (Task 5-6)
   - AI Home + overlays
   - Memory governance
   - Gradual rollout

---

## Summary

This pipeline transforms IntegrateWise from a **projection engine** into a **living operational platform**:

- Auth + Onboarding makes entry seamless
- IW Bridge + MCP connects to ChatGPT and tools
- Spine Hydration populates with real data
- Workspace Loader renders workbenches with live metrics
- ChatGPT conversations become learnable memories
- Intelligence Overlay makes insights visible
- Organizational Memory preserves knowledge

**Timeline: 4-6 weeks to full activation**
**Team: 2-3 engineers**
**Customer-Zero: Sales + CS GTM team (8-10 users)**
