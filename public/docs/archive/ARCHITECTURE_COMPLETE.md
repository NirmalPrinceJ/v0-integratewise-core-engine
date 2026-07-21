# IntegrateWise Complete Architecture - Tasks 1-3 Built & Documented


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## High-Level Data Flow (End-to-End)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ NEW USER JOURNEY: Auth → Onboarding → Workspace                             │
└─────────────────────────────────────────────────────────────────────────────┘

1. OAuth Callback (Gateway)
   ├─ User → app.integratewise.ai
   ├─ Clicks "Sign in with Google"
   ├─ OAuth callback → gateway/auth.ts
   ├─ Call: getOrCreateUser(email, name, tenantId)
   └─ Check: onboarding_completed_at?

2. Onboarding (if NEW user)
   ├─ Redirect to /onboarding
   ├─ Step 1: Select role (10 options)
   │  └─ role-selector.tsx renders roles
   ├─ Step 2: Select connectors (5-7 per role)
   │  └─ connector-selector.tsx shows suggested
   ├─ Step 3: Review selections
   │  └─ onboarding-wizard.tsx handles flow
   ├─ POST /api/v1/onboarding/complete
   │  ├─ Store: users.role + users.onboarding_completed_at
   │  ├─ Store: tenant_spine_config.connected_connectors
   │  ├─ Issue: MCP token (15 min HMAC)
   │  └─ Return: redirect URL
   └─ sessionStorage.setItem('mcp_token', token)

3. Workspace Load (Existing or Post-Onboarding)
   ├─ Redirect to /workspace/{domain}/{view}
   ├─ L1Provider generates projection for role
   ├─ Normalizer queries Spine via MCP tool
   │  ├─ Header: Authorization: Bearer {mcp_token}
   │  ├─ MCP Server: validateMcpToken()
   │  ├─ MCP Server: resolveActor() from D1
   │  ├─ MCP Server: validateActorCanAccessTool()
   │  └─ Query: encrypted vault
   ├─ Dashboard renders with real metrics
   │  ├─ Metrics: active_accounts, pipeline_value, mrr_total
   │  ├─ Widgets: account health, deal stages
   │  └─ Actions: linked to domain wiring
   └─ User sees hydrated workspace

┌─────────────────────────────────────────────────────────────────────────────┐
│ CONNECTOR DATA FLOW: Live Spine Hydration                                   │
└─────────────────────────────────────────────────────────────────────────────┘

4. Connectors (Freshsales + Razorpay)
   ├─ FreshsalesConnector
   │  ├─ runFullSync()
   │  ├─ syncContacts() → API paginated requests
   │  │  ├─ Map: Freshsales contact → Spine Contact
   │  │  ├─ Merge fields: name, email, owner, engagement_level
   │  │  └─ Emit: SpineEmitter.emit(...)
   │  ├─ syncAccounts() → API paginated requests
   │  │  ├─ Map: Freshsales account → Spine Account
   │  │  ├─ Merge fields: name, industry, revenue, health_score
   │  │  └─ Emit: SpineEmitter.emit(...)
   │  └─ syncDeals() → API paginated requests
   │     ├─ Map: Freshsales deal → Spine Opportunity
   │     ├─ Merge fields: name, stage, value, probability, age_days
   │     └─ Emit: SpineEmitter.emit(...)
   │
   └─ RazorpayConnector
      ├─ runFullSync()
      ├─ syncCustomers() → API paginated requests
      │  ├─ Map: Razorpay customer → Spine Account
      │  ├─ Merge fields: name, email, gstin
      │  └─ Emit: SpineEmitter.emit(...)
      ├─ syncInvoices() → API paginated requests
      │  ├─ Map: Razorpay invoice → Spine Invoice
      │  ├─ Merge fields: amount, status, days_overdue
      │  └─ Emit: SpineEmitter.emit(...)
      └─ syncSubscriptions() → API paginated requests
         ├─ Map: Razorpay subscription → Spine Subscription
         ├─ Merge fields: plan_id, status, mrr, renewal_date
         └─ Emit: SpineEmitter.emit(...)

5. Spine Service (receives events)
   ├─ Validate: normalized event schema
   ├─ Check: idempotency_key (deduplicate)
   ├─ Encrypt: AES-256 (data at rest)
   ├─ Store: D1 vault
   ├─ Index: Vectorize (semantic search)
   └─ Update: last_sync_time

┌─────────────────────────────────────────────────────────────────────────────┐
│ CHATGPT INTEGRATION: MCP Server with Auth                                   │
└─────────────────────────────────────────────────────────────────────────────┘

6. ChatGPT Enterprise
   ├─ Settings → Connectors → IntegrateWise Spine
   ├─ OAuth → get MCP token (same token format)
   └─ Ask question: "What accounts are at risk?"

7. MCP Server (authenticated)
   ├─ Receive: POST /call
   │  └─ Authorization: Bearer {token}
   │
   ├─ Auth Middleware (mcp-connector/src/middleware/auth.ts)
   │  ├─ Parse: "Bearer {payload_b64}.{sig_b64}"
   │  ├─ Verify: HMAC-SHA256({payload_b64}, secret)
   │  ├─ Check: expiration (now < exp)
   │  ├─ Extract: tenant_id, user_id
   │  └─ Result: { success: true, actor }
   │
   ├─ Actor Resolver (mcp-connector/src/middleware/actor.ts)
   │  ├─ Query D1: users table
   │  │  └─ Get: email, name, role
   │  ├─ Query D1: tenant_spine_config
   │  │  └─ Get: tier, connected_connectors, allowed_entity_types
   │  ├─ Derive: permissions from role + tier
   │  │  ├─ admin: all permissions
   │  │  ├─ manager: read + write + report + user management
   │  │  └─ user: read + execute
   │  │  ├─ free: spine tools only
   │  │  ├─ starter: + memory tools
   │  │  ├─ pro: + advanced features
   │  │  └─ enterprise: all features
   │  └─ Result: full actor context
   │
   ├─ Permission Gate
   │  ├─ Check: actor.permissions includes "spine:query"?
   │  ├─ Check: entity_type in allowed_entity_types?
   │  ├─ Check: connector in connected_sources?
   │  └─ Result: allow or deny with reason
   │
   ├─ Tool Dispatch (dispatchSpineTool)
   │  ├─ Tool: spine.query
   │  │  └─ Query: vault for entities matching filters
   │  ├─ Tool: spine.get
   │  │  └─ Get: single entity by source_id
   │  ├─ Tool: memory.search
   │  │  └─ Semantic search via Vectorize
   │  ├─ Tool: memory.propose
   │  │  └─ Submit to proposals table (triage bot queue)
   │  └─ Tool: spine.connected_sources
   │     └─ List: connected connectors for tenant
   │
   └─ Response: JSON with canonical entities
      └─ ChatGPT generates: natural language response

```

---

## Component Architecture (What's Built)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ LAYER 1: Frontend (React / Next.js)                                          │
├──────────────────────────────────────────────────────────────────────────────┤
│
├─ Onboarding Components (TASK 1 - BUILT)
│  ├─ apps/web/app/onboarding/page.tsx
│  │  └─ Entry point for new users
│  │
│  └─ apps/web/components/onboarding/
│     ├─ onboarding-wizard.tsx
│     │  ├─ Manages 3-step flow
│     │  ├─ Calls API endpoints
│     │  ├─ Stores MCP token in session
│     │  └─ Handles completion + redirect
│     │
│     ├─ role-selector.tsx
│     │  ├─ Grid of 10 role cards
│     │  ├─ Click → select → step 2
│     │  └─ Shows suggested connectors
│     │
│     └─ connector-selector.tsx
│        ├─ Multi-select checkboxes
│        ├─ Shows suggested connectors first
│        ├─ "Select All" button
│        └─ Continue button
│
├─ API Routes (TASK 1 - BUILT)
│  └─ apps/web/app/api/v1/onboarding/
│     ├─ start/route.ts
│     │  ├─ Check if user is new
│     │  └─ Return wizard config
│     │
│     └─ complete/route.ts
│        ├─ Validate role + connectors
│        ├─ Call gateway to issue MCP token (TODO)
│        ├─ Return token + redirect URL
│        └─ Frontend stores token in session
│
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ LAYER 2: Backend Gateway (Cloudflare Workers)                                │
├──────────────────────────────────────────────────────────────────────────────┤
│
├─ Onboarding Service (TASK 1 - BUILT)
│  └─ services/gateway/src/onboarding.ts
│     ├─ getOrCreateUser(email, name, tenantId)
│     │  └─ Query/insert D1 users table
│     │
│     ├─ getAvailableRoles()
│     │  └─ Return 10 role options + suggested connectors
│     │
│     ├─ getAvailableConnectors(tier)
│     │  └─ Return 15 connectors filtered by tier
│     │
│     └─ completeOnboarding(userId, role, connectors)
│        ├─ Update D1 users table
│        ├─ Store in tenant_spine_config
│        └─ Log to audit_log
│
├─ Auth Endpoints (EXISTING)
│  └─ services/gateway/src/auth.ts
│     ├─ OAuth callback handlers (Google, GitHub)
│     ├─ Call getOrCreateUser() (TASK 1)
│     ├─ Issue MCP token (TODO - WIRE TASK 1)
│     └─ Return jwt_token for session
│
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ LAYER 3: MCP Server (Cloudflare Workers)                                     │
├──────────────────────────────────────────────────────────────────────────────┤
│
├─ Auth Middleware (TASK 2 - BUILT)
│  └─ services/mcp-connector/src/middleware/auth.ts
│     ├─ validateMcpToken(authHeader, secret)
│     │  ├─ Parse "Bearer {token}"
│     │  ├─ Verify HMAC-SHA256 signature
│     │  ├─ Check expiration (15 min)
│     │  └─ Return: { valid, payload }
│     │
│     ├─ extractTenantId(headers, tokenPayload)
│     │  └─ Get from header or token
│     │
│     ├─ extractUserId(headers, tokenPayload)
│     │  └─ Get from header or token
│     │
│     ├─ validateTenantIsolation(requestTenantId, tokenTenantId)
│     │  └─ Hard wall: IDs must match
│     │
│     └─ authMiddleware(request, secret)
│        └─ Full pipeline: parse → verify → extract → validate
│
├─ Actor Resolution (TASK 2 - BUILT)
│  └─ services/mcp-connector/src/middleware/actor.ts
│     ├─ resolveActor(db, tenantId, userId)
│     │  ├─ Query D1: users (email, name, role)
│     │  ├─ Query D1: tenant_spine_config (tier, connectors)
│     │  ├─ Derive permissions
│     │  └─ Return: full actor context
│     │
│     ├─ hasPermission(actor, requiredPerm)
│     │  ├─ Exact match
│     │  ├─ Wildcard match ("spine:*")
│     │  └─ Global wildcard ("*")
│     │
│     ├─ canAccessEntityType(db, actor, entityType)
│     │  └─ Check: tenant configured + actor can access
│     │
│     ├─ hasConnectorConnected(actor, connectorId)
│     │  └─ Check: in actor.connected_sources
│     │
│     └─ validateActorCanAccessTool(actor, toolName, db, context)
│        └─ Combined permission + entity + connector gate
│
├─ MCP Server (EXISTING + TODO integration)
│  └─ services/mcp-connector/src/spine-mcp-server.ts
│     ├─ spine.query → query vault
│     ├─ spine.get → get single entity
│     ├─ spine.summary → stats
│     ├─ memory.search → semantic search
│     ├─ memory.propose → submit to governance
│     └─ spine.connected_sources → list connectors
│     (TODO: wire auth middleware + actor resolver before dispatch)
│
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ LAYER 4: Connectors (Node.js / Web Services)                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│
├─ Freshsales Connector (TASK 3 - BUILT)
│  └─ packages/connectors/src/adapters/freshsales.ts
│     ├─ FreshsalesConnector(config)
│     │  ├─ constructor(apiKey, accountUrl, tenantId, spineUrl)
│     │  │  └─ Create axios client + SpineEmitter
│     │  │
│     │  ├─ syncContacts()
│     │  │  ├─ GET /crm/sales/contacts (paginated 100/page)
│     │  │  ├─ Map: Freshsales → Spine Contact
│     │  │  ├─ Merge fields: name, email, phone, owner, engagement_level
│     │  │  └─ Emit each via SpineEmitter
│     │  │
│     │  ├─ syncAccounts()
│     │  │  ├─ GET /crm/sales/accounts (paginated)
│     │  │  ├─ Map: Freshsales → Spine Account
│     │  │  ├─ Merge fields: name, industry, revenue, employee_count, health_score
│     │  │  └─ Emit each via SpineEmitter
│     │  │
│     │  ├─ syncDeals()
│     │  │  ├─ GET /crm/sales/deals (paginated)
│     │  │  ├─ Map: Freshsales → Spine Opportunity
│     │  │  ├─ Merge fields: name, stage, value, probability, owner, age_days
│     │  │  └─ Emit each via SpineEmitter
│     │  │
│     │  └─ runFullSync()
│     │     ├─ Promise.all([syncContacts, syncAccounts, syncDeals])
│     │     ├─ Parallel execution
│     │     └─ Return: count of entities synced
│     │
│     └─ createFreshsalesConnector(apiKey, accountUrl, tenantId, spineUrl)
│        └─ Factory function
│
├─ Razorpay Connector (TASK 3 - BUILT)
│  └─ packages/connectors/src/adapters/razorpay.ts
│     ├─ RazorpayConnector(config)
│     │  ├─ constructor(keyId, keySecret, tenantId, spineUrl)
│     │  │  └─ Create axios client (basic auth) + SpineEmitter
│     │  │
│     │  ├─ syncCustomers()
│     │  │  ├─ GET /customers (paginated skip/count)
│     │  │  ├─ Map: Razorpay customer → Spine Account
│     │  │  ├─ Merge fields: name, email, contact, gstin
│     │  │  └─ Emit each via SpineEmitter
│     │  │
│     │  ├─ syncInvoices()
│     │  │  ├─ GET /invoices (paginated)
│     │  │  ├─ Map: Razorpay invoice → Spine Invoice
│     │  │  ├─ Merge fields: amount, currency, status, payment_status, days_overdue
│     │  │  └─ Emit each via SpineEmitter
│     │  │
│     │  ├─ syncSubscriptions()
│     │  │  ├─ GET /subscriptions (paginated)
│     │  │  ├─ Map: Razorpay subscription → Spine Subscription
│     │  │  ├─ Merge fields: plan_id, status, start_date, mrr, renewal_date
│     │  │  └─ Emit each via SpineEmitter
│     │  │
│     │  └─ runFullSync()
│     │     ├─ Promise.all([syncCustomers, syncInvoices, syncSubscriptions])
│     │     ├─ Parallel execution
│     │     └─ Return: count of entities synced
│     │
│     └─ createRazorpayConnector(keyId, keySecret, tenantId, spineUrl)
│        └─ Factory function
│
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ LAYER 5: Data (D1 + Vectorize + Vault)                                       │
├──────────────────────────────────────────────────────────────────────────────┤
│
├─ D1 Database Tables (TODO: CREATE)
│  ├─ users
│  │  ├─ id (PRIMARY KEY)
│  │  ├─ email
│  │  ├─ name
│  │  ├─ tenant_id
│  │  ├─ role (from onboarding)
│  │  ├─ onboarding_completed_at (NULL if not completed)
│  │  ├─ created_at
│  │  └─ updated_at
│  │
│  └─ tenant_spine_config
│     ├─ tenant_id (PRIMARY KEY)
│     ├─ allowed_entity_types (JSON array)
│     ├─ connected_connectors (JSON array, from onboarding)
│     ├─ subscription_tier
│     └─ updated_at
│
├─ Spine Vault (Encrypted)
│  ├─ Contains: entities (contacts, accounts, invoices, etc.)
│  ├─ Storage: D1 table (encrypted AES-256)
│  ├─ Indexed: Vectorize (semantic search)
│  ├─ Populated by: SpineEmitter.emit() from connectors
│  └─ Queried by: MCP tools (spine.query, spine.get, etc.)
│
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Token Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Token Lifecycle (15 minutes)                                                │
└─────────────────────────────────────────────────────────────────────────────┘

T=0 seconds
├─ User completes onboarding
├─ POST /api/v1/onboarding/complete { role, connectors }
│  ├─ Store role in D1 users table
│  ├─ Store connectors in tenant_spine_config
│  └─ Call: issueMcpToken(secret, tenantId, userId)
│
├─ Token Generation
│  ├─ Payload: { tenant_id, user_id, exp, iat }
│  ├─ exp = now + 15*60*1000 (15 minutes)
│  ├─ iat = now
│  ├─ payloadB64 = base64(JSON.stringify(payload))
│  ├─ sig = HMAC-SHA256(payloadB64, secret)
│  ├─ sigB64 = base64(sig)
│  └─ token = `${payloadB64}.${sigB64}`
│
├─ Token in Session
│  └─ sessionStorage.setItem('mcp_token', token)
│
├─ Token Used (anytime T < 15 min)
│  └─ fetch('https://mcp.integratewise.ai/call', {
│     headers: { Authorization: `Bearer ${token}` }
│     })
│
├─ Token Validation (in MCP server)
│  ├─ Parse: authHeader.split(' ') → ['Bearer', token]
│  ├─ Split: token.split('.') → [payloadB64, sigB64]
│  ├─ Decode: payload = JSON.parse(atob(payloadB64))
│  ├─ Check: payload.exp > Date.now()
│  ├─ Verify: sig = HMAC-SHA256(payloadB64, secret)
│  ├─ Compare: sigB64 === btoa(sig)
│  └─ Result: { success: true, payload }
│
└─ T > 15 min: Token Expired
   └─ Validate fails: return 401 Unauthorized
```

---

## Permission Gate Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Permission Gating (Multi-Layer)                                             │
└─────────────────────────────────────────────────────────────────────────────┘

ChatGPT calls: spine.query(entity_type="account", filters={status: "active"})
│
├─ Layer 1: Token Validation
│  ├─ Parse + verify HMAC
│  ├─ Check expiration
│  └─ Extract: tenant_id, user_id
│     └─ Result: actor_basic = { tenant_id, user_id, _authenticated }
│
├─ Layer 2: Actor Resolution
│  ├─ Query D1 users → email, name, role
│  ├─ Query D1 tenant_spine_config → tier, connectors
│  ├─ Derive permissions: role + tier → permission list
│  └─ Result: actor_full = {
│        tenant_id, user_id, email, name, role, tier,
│        connected_sources, permissions, _authenticated
│     }
│
├─ Layer 3: Tenant Isolation
│  ├─ Check: request.tenant_id != actor.tenant_id?
│  └─ Hard wall: 403 Forbidden if mismatch
│
├─ Layer 4: Permission Gate
│  ├─ Check: actor.permissions includes "spine:query"?
│  │  ├─ Exact match: "spine:query"
│  │  ├─ Wildcard match: "spine:*"
│  │  └─ Global: "*"
│  ├─ Result: allowed or "Permission denied"
│     └─ Free tier might block memory.search
│
├─ Layer 5: Entity Type Gate
│  ├─ Query D1: tenant_spine_config.allowed_entity_types
│  ├─ Check: "account" in allowed_entity_types?
│  └─ Result: allowed or "Entity type not configured"
│
├─ Layer 6: Connector Gate
│  ├─ If querying "account" from Razorpay source:
│  ├─ Check: "razorpay" in actor.connected_sources?
│  └─ Result: allowed or "Connector not connected"
│
└─ Layer 7: Tool Execution
   ├─ All gates passed
   ├─ Query vault for accounts with status="active"
   ├─ Return canonical entities
   └─ ChatGPT generates natural language response
```

---

## Key Files Reference

### Documentation (Read First)
- `PIPELINE_AUTH_TO_MEMORY.md` — 666 lines, complete spec
- `ONBOARDING_IMPLEMENTATION.md` — 206 lines, task 1
- `IW_BRIDGE_IMPLEMENTATION.md` — 387 lines, task 2
- `CHATGPT_CONNECTOR_GUIDE.md` — 342 lines, task 2
- `SPINE_HYDRATION_IMPLEMENTATION.md` — 431 lines, task 3
- `IMPLEMENTATION_COMPLETE_TASKS_1_3.md` — 503 lines, this summary
- `v0_memories/user/integratewise-pipeline-implementation.md` — 236 lines, quick ref

### Task 1: Onboarding (9 files)
- `services/gateway/src/onboarding.ts` — 432 lines
- `apps/web/app/api/v1/onboarding/{start,complete}/route.ts` — ~100 lines
- `apps/web/components/onboarding/{wizard,role-selector,connector-selector}.tsx` — ~420 lines
- `apps/web/app/onboarding/page.tsx` — ~30 lines

### Task 2: MCP Bridge (4 files)
- `services/mcp-connector/src/middleware/auth.ts` — 209 lines
- `services/mcp-connector/src/middleware/actor.ts` — 327 lines
- `CHATGPT_CONNECTOR_GUIDE.md` — 342 lines
- `IW_BRIDGE_IMPLEMENTATION.md` — 387 lines

### Task 3: Connectors (2 files)
- `packages/connectors/src/adapters/freshsales.ts` — 376 lines
- `packages/connectors/src/adapters/razorpay.ts` — 396 lines

---

## What's Done vs TODO

### ✅ DONE (Tasks 1-3)
- [x] Onboarding UI + API endpoints
- [x] 10 role options with suggested connectors
- [x] Role → domain mapping
- [x] MCP token generation (format, HMAC)
- [x] Auth token validation middleware
- [x] Actor resolution from D1
- [x] Permission derivation (role + tier)
- [x] Freshsales CRM adapter (contacts, accounts, deals)
- [x] Razorpay payments adapter (customers, invoices, subscriptions)
- [x] Merge field mapping for all entity types
- [x] Calculated fields (engagement, health, MRR, days_overdue)
- [x] Complete documentation

### ❌ TODO (Next Immediate Steps - Blocking)
1. **D1 Schema Creation** (prerequisite for all)
   - Create users table
   - Create tenant_spine_config table
   - Create audit_log table

2. **Wire Task 1: Onboarding → Auth** (enables onboarding flow)
   - In gateway/auth.ts, call getOrCreateUser() after OAuth
   - Redirect to /onboarding if not onboarded
   - Issue MCP token on completion

3. **Wire Task 2: Auth → MCP** (enables ChatGPT)
   - In spine-mcp-server.ts, call authMiddleware() in dispatchSpineTool()
   - Call resolveActor() to populate context
   - Add permission checks before tool execution

4. **Create Schema Endpoint** (for ChatGPT discovery)
   - GET /schema.json returns tool definitions

5. **Create Sync UI** (enables data population)
   - Settings → Connectors panel
   - Show connected connectors, last sync time
   - "Sync Now" button

### ⏳ TODO (Tasks 4-6)
6. **Workspace Loader** — hydrate dashboards with Spine data
7. **Intelligent Overlay** — risk badges, recommendations
8. **Memory Governance** — capture, triage, promote conversations

---

## Success Criteria

### Task 1 (Onboarding) ✅ Built → ⏳ Testing
- [ ] New user → /onboarding
- [ ] 10 roles render + select
- [ ] Suggested connectors show
- [ ] Multi-select works
- [ ] Complete API persists to D1
- [ ] Redirect to role workspace
- [ ] MCP token in session

### Task 2 (MCP Bridge) ✅ Built → ⏳ Integration
- [ ] Token valid for 15 min
- [ ] Invalid signature rejected
- [ ] Tenant isolation enforced
- [ ] Actor resolved from D1
- [ ] Permissions correct per role+tier
- [ ] Free tier blocks memory
- [ ] Admin bypasses all checks
- [ ] ChatGPT can authenticate

### Task 3 (Connectors) ✅ Built → ⏳ Testing
- [ ] Freshsales API credentials work
- [ ] syncContacts() returns entities
- [ ] Merge fields populated
- [ ] Calculated fields correct
- [ ] Razorpay credentials work
- [ ] syncInvoices() returns entities
- [ ] Parallel sync works
- [ ] Spine receives events
- [ ] Entities queryable via MCP

---

## Timeline to Full Launch

**Week 1: Wiring (Tasks 1-3 integration)**
- D1 schema creation (2 hours)
- Auth → onboarding wiring (4 hours)
- MCP auth integration (4 hours)
- Testing onboarding flow (4 hours)
- **Deliverable:** New users can complete onboarding

**Week 2: Data Hydration**
- Sync UI creation (4 hours)
- Test Freshsales connector (4 hours)
- Test Razorpay connector (4 hours)
- Verify Spine data (2 hours)
- **Deliverable:** Live data in Spine

**Week 3-4: Dashboard + AI (Tasks 4-5)**
- Workspace Loader (8 hours)
- Normalizer (8 hours)
- AI Home + overlays (16 hours)
- Testing (8 hours)
- **Deliverable:** Dashboards with live metrics

**Week 5-6: Memory (Task 6)**
- Memory capture (8 hours)
- Triage Bot (8 hours)
- Org memory UI (8 hours)
- Testing (8 hours)
- **Deliverable:** Full pipeline live

**Total: 6 weeks to full activation**

---

## Summary

**Phase Complete: 50% (Tasks 1-3 of 6)**

- ✅ Auth + Onboarding fully implemented (9 files)
- ✅ MCP Bridge with auth middleware (4 files)
- ✅ Live connectors for Customer-Zero (2 files)
- ✅ Complete architecture documented (2300+ lines)
- ❌ Still needs: D1 schema + wiring + Tasks 4-6

**Ready for:** Next developer to integrate + test

**Blocking:** D1 schema (everything depends on it)

**Next Action:** Create D1 tables + wire auth flow
