## IntegrateWise Wiring Roadmap

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Objective**: Connect all implemented services into a unified platform

---

## Critical Path: Request-to-Response Wiring

### Phase 1A: Gateway Request Entry Point

**Current State**

- Gateway service exists with routing logic
- ADK middleware detects capability type
- Projection facades are wired
- **Missing**: Actually calling the appropriate service for each request

**What Needs to Be Wired**

```
User Request
    ↓
Gateway (index.ts) receives request
    ↓
Identity layer (auth.ts) - JWT validation ✓
    ↓
ADK middleware (adk-middleware.ts) - detects capability type ✓
    ↓
[MISSING] Route to appropriate service based on capability type
    ├── If ADK capability → Check ADK registry
    ├── If MCP capability → Route to mcp-connector
    ├── If Native capability → Route to direct service
    └── If ADX capability → Route to intelligence (agent)
    ↓
[MISSING] Call selected service with tenant context
    ↓
[MISSING] Aggregate response and return to client
```

**Specific Files to Wire**

- `services/gateway/src/index.ts` - Add service dispatcher logic
- `services/gateway/src/adk-middleware.ts` - Hook up capability selection
- `services/gateway/src/projection-facade-wiring.ts` - Actually call facades

**Success Criteria**

- Single POST to gateway routes correctly to at least 3 different services
- Response includes proper tenant context
- Error handling propagates correctly

---

### Phase 1B: Database Connectivity

**Current State**

- D1 schema defined in `services/loader/schema.sql`
- Services have database query logic written
- **Missing**: Connection string setup, migration execution, query execution

**What Needs to Be Wired**

```
Service wants data
    ↓
Query constructed in service code
    ↓
[MISSING] Get D1 database connection from Cloudflare bindings
    ↓
[MISSING] Execute query with proper tenant scoping
    ↓
[MISSING] Return results with error handling
    ↓
Cache in KV if needed
```

**Specific Files to Wire**

- Each service's database queries (e.g., `services/tenants/src/rbac.ts`)
- Environment configuration for D1 connection
- Migration script for schema.sql

**Success Criteria**

- Services can read/write to D1
- Queries are tenant-scoped
- Data survives between requests

---

### Phase 1C: HITL Orchestrator Integration

**Current State**

- HITL orchestrator fully implemented (867 lines, tested)
- Intelligence service exists for proposal generation
- Govern service exists for approvals
- Pipeline service exists for execution
- **Missing**: Gateway → HITL → Intelligence → Govern → Pipeline chain

**What Needs to Be Wired**

```
Human submits intent via gateway
    ↓
[MISSING] Gateway calls HITL orchestrator
    ↓
HITL.captureIntent() - stores request ✓
    ↓
[MISSING] HITL calls intelligence.generateProposal()
    ↓
Intelligence generates reasoning + proposal ✓
    ↓
[MISSING] Return proposal to user for approval
    ↓
[MISSING] Wait for human approval (via gateway callback)
    ↓
Human submits approval via gateway
    ↓
[MISSING] Gateway calls HITL.submitApproval()
    ↓
[MISSING] HITL calls pipeline.execute()
    ↓
Pipeline executes the approved action ✓
    ↓
[MISSING] Capture results for learning
```

**Specific Files to Wire**

- `services/gateway/src/index.ts` - Add HITL endpoints
- `services/gateway/src/hitl-orchestrator.ts` - Hook into intelligence/govern/pipeline
- `services/intelligence/src/index.ts` - Accept proposal requests

**Success Criteria**

- Complete HITL flow works end-to-end
- Human can approve/reject proposals
- Execution happens and results are captured

---

### Phase 1D: Continuity Context Chains

**Current State**

- Continuity service retrieves memory + context
- Twin orchestrator manages per-user context
- Knowledge service provides semantic knowledge
- **Missing**: Request → context retrieval → enrichment → capability execution

**What Needs to Be Wired**

```
Gateway receives request
    ↓
[MISSING] Call continuity.getContext(userId)
    ↓
Continuity calls:
    - Twin orchestrator for user state
    - Knowledge for semantic knowledge
    - Hermes for episodic memory
    ↓
Context assembled with:
    - User preferences
    - Recent actions
    - Relevant knowledge
    - Current task state
    ↓
[MISSING] Attach context to request as it passes through services
    ↓
Each service uses context for decisions
```

**Specific Files to Wire**

- `services/gateway/src/index.ts` - Request enrichment
- `services/continuity/src/index.ts` - Context aggregation
- `services/twin-orchestrator/src/index.ts` - Twin state retrieval

**Success Criteria**

- Requests include user context
- Context is consistent across service calls
- Context improves decision-making

---

## Critical Path: Service-to-Service Bridges

### Phase 2A: Intelligence ↔ Knowledge Bridge

**What Needs to Be Wired**

```
Intelligence agent needs knowledge
    ↓
[MISSING] Intelligence calls knowledge service
    ↓
Knowledge performs semantic search
    ↓
Results returned to intelligence
    ↓
Intelligence integrates into reasoning
```

**Specific Wiring**

- `services/intelligence/src/index.ts` - Add knowledge.query() calls
- `services/knowledge/src/index.ts` - Add semantic search API
- Inter-service authentication tokens

---

### Phase 2B: Pipeline ↔ Connector Bridge

**What Needs to Be Wired**

```
Pipeline needs to execute action on external system
    ↓
[MISSING] Pipeline calls connector service
    ↓
Connector selects appropriate provider
    ↓
Connector calls MCP/OAuth connector
    ↓
Provider executes action
    ↓
Results returned through pipeline
```

**Specific Wiring**

- `services/pipeline/src/index.ts` - Call connector service
- `services/connector/src/index.ts` - Provider selection logic
- `services/mcp-connector/src/index.ts` - MCP call execution

---

### Phase 2C: Govern ↔ Tenants Bridge

**What Needs to Be Wired**

```
Govern checks if action is allowed
    ↓
[MISSING] Govern calls tenants service
    ↓
Tenants service:
    - Checks RBAC
    - Validates permissions
    - Checks tier limits
    ↓
Approval/rejection returned
```

**Specific Wiring**

- `services/govern/src/index.ts` - Call tenants for RBAC
- `services/tenants/src/rbac.ts` - Permission evaluation

---

## Data Layer: Signal Processing

### Phase 3A: Signal Ingestion

**What Needs to Be Wired**

```
External event happens (webhook, connector event, user action)
    ↓
[MISSING] webhook-ingress service receives event
    ↓
[MISSING] Event is stored in signals service
    ↓
[MISSING] Event is broadcast to all listeners
    ↓
Services react to signals
```

**Specific Wiring**

- `services/webhook-ingress/src/index.ts` - Parse incoming events
- `services/signals/src/index.ts` - Store and broadcast events
- Service subscriptions to signal types

---

### Phase 3B: Signal ↔ Learning Loop

**What Needs to Be Wired**

```
HITL execution completes
    ↓
[MISSING] Results are captured as signal
    ↓
[MISSING] Signal is stored in signals service
    ↓
[MISSING] Learning pipeline processes signal
    ↓
Knowledge base is updated
    ↓
Memory is updated with outcome
    ↓
Agent models are adjusted
```

**Specific Wiring**

- `services/signals/src/index.ts` - Capture execution results
- Learning feedback integration points

---

## Configuration & Discovery

### Phase 4A: Service Discovery

**What Needs to Be Done**

```
Service A needs to call Service B
    ↓
[MISSING] Service A looks up Service B's URL
    ↓
Service discovery mechanism needed:
    - Environment variables for known services
    - Dynamic discovery for optional services
    - Fallback chains for resilience
```

**Implementation Options**

1. **Environment-based** (simplest for Cloudflare)
   - Each service.wrangler.toml includes URLs of services it calls
   - Services env section has INTELLIGENCE_URL, PIPELINE_URL, etc.

2. **Registry-based** (more flexible)
   - Agent-registry service lists all services
   - Services query registry on startup

**Recommendation**: Start with environment-based, migrate to registry later

---

### Phase 4B: Inter-Service Authentication

**What Needs to Be Done**

```
Service A calls Service B
    ↓
[MISSING] Service A needs to authenticate
    ↓
Service B validates authentication
    ↓
Service B checks authorization
    ↓
If valid, execute; if not, reject
```

**Implementation**

- Create service-to-service JWT tokens
- Each service has INTERNAL_JWT_SECRET
- Services sign requests with their secret
- Receiving service validates signature

---

## Testing & Validation

### Phase 5A: Integration Test Wiring

**What Needs to Be Done**

```
Test creates request
    ↓
[MISSING] Test calls gateway like real client
    ↓
[MISSING] Request flows through real service chain
    ↓
[MISSING] Test validates end-to-end response
```

**Current State**: 450+ tests written, mostly unit tests
**Missing**: Integration tests calling actual services

**Key Integration Tests to Add**

1. Test complete HITL flow (capture → propose → approve → execute)
2. Test capability discovery and execution
3. Test context enrichment
4. Test error handling across service boundaries
5. Test signal processing
6. Test learning feedback loops

---

## Deployment Pipeline

### Phase 6A: CI/CD Setup

**What Needs to Be Done**

```
Push to main branch
    ↓
[MISSING] GitHub Actions triggered
    ↓
[MISSING] Run test suite
    ↓
[MISSING] If tests pass, deploy to staging
    ↓
[MISSING] Run smoke tests on staging
    ↓
[MISSING] If staging passes, deploy to production
    ↓
Services are live
```

**Specific Needs**

- GitHub Actions workflow file
- Wrangler authentication tokens
- Database migration scripts
- Rollback procedures

---

## Priority Ordering (Recommended)

### Week 1: Critical Path (Enables all features)

1. **Phase 1A**: Gateway service dispatcher
   - Effort: 2 days
   - Impact: High (unblocks everything else)

2. **Phase 1B**: Database connectivity
   - Effort: 2 days
   - Impact: High (needed for state)

3. **Phase 1C**: HITL orchestrator integration
   - Effort: 2 days
   - Impact: High (core feature)

### Week 2: Continuity & Context

4. **Phase 1D**: Continuity context chains
   - Effort: 2 days
   - Impact: High (improves decision-making)

5. **Phase 2A-2C**: Service-to-service bridges
   - Effort: 3 days
   - Impact: High (enables distributed execution)

### Week 3: Data & Operations

6. **Phase 3A-3B**: Signal processing
   - Effort: 2 days
   - Impact: Medium (enables learning loop)

7. **Phase 4A-4B**: Service discovery & auth
   - Effort: 2 days
   - Impact: High (enables reliability)

8. **Phase 5-6**: Testing & deployment
   - Effort: 3 days
   - Impact: Critical (enables go-live)

---

## Success Metrics

- [ ] Single request routes through 5+ services
- [ ] Database CRUD operations work end-to-end
- [ ] HITL flow completes successfully
- [ ] Service-to-service calls succeed
- [ ] Context is enriched across requests
- [ ] 100+ integration tests pass
- [ ] Signals are ingested and processed
- [ ] Learning loop captures results
- [ ] Services can be deployed to Cloudflare
- [ ] Monitoring shows healthy service health

---

## Risk Mitigation

### Risk 1: Service Communication Breaks

**Mitigation**: Implement circuit breakers and fallback chains

- If Intelligence is down, use cached proposals
- If Connector fails, retry with exponential backoff

### Risk 2: Database Deadlocks

**Mitigation**: Implement query timeouts and connection pooling

- D1 max query timeout: 30 seconds
- Connection pool size: 5-10

### Risk 3: Cascading Failures

**Mitigation**: Implement timeout and bulkhead patterns

- Each service call times out after 10 seconds
- Limit concurrent calls to dependent services

### Risk 4: Data Inconsistency

**Mitigation**: Implement event sourcing and audit trails

- All changes captured in signals service
- Replay capability for recovery

---

## Summary

**Wiring is the bridge between "code complete" and "go live."**

- **Code**: 100% complete ✓
- **Testing**: 450+ tests written, mostly unit ✓
- **Wiring**: 0% complete ← YOU ARE HERE
- **Deployment**: 0% complete
- **Production**: Goal

**Next step**: Start with Phase 1A (Gateway dispatcher) and work through the critical path. Each phase unblocks the next.

**Estimated time to production**: 3 weeks of focused wiring work
