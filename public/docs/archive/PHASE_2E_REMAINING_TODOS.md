# Phase 2e Remaining Implementation (15%)


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Status:** 58 TODOs across codebase
**Est. Effort:** 50-70 engineering hours
**Pattern:** All follow consistent Service Client → Compose → Response pattern

---

## Critical Path (Tier 1) - 12 TODOs

### Gateway Authentication (3 TODOs)
These block all API access.

1. **services/gateway/src/router.ts:51**
   - TODO: Validate token against auth service
   - Impact: Security gate for all requests
   - Pattern: Call AuthServiceClient.validateToken()
   - Effort: 2 hours

2. **services/gateway/src/router.ts:52**
   - TODO: Call auth service
   - Impact: User session management
   - Pattern: Call AuthServiceClient.getSession()
   - Effort: 2 hours

3. **services/gateway/src/router.ts:53**
   - TODO: Fetch current user
   - Impact: Context population
   - Pattern: Call AuthServiceClient.getCurrentUser()
   - Effort: 1 hour

### FacadeRegistry Initialization (3 TODOs)
These block projection endpoint.

4. **services/gateway/src/router.ts:75**
   - TODO: Initialize FacadeRegistry
   - Impact: All projections become routable
   - Pattern: Create FacadeRegistry instance, register with dependency injection
   - Effort: 2 hours

5. **services/projection-engine/src/facades/facade-registry.ts:120**
   - TODO: Apply caching if appropriate
   - Impact: Performance optimization
   - Pattern: Cache projection for 5 min if no sensitive data
   - Effort: 3 hours

6. **services/projection-engine/src/facades/facade-registry.ts:121**
   - TODO: Apply rate limiting
   - Impact: DoS protection
   - Pattern: Use Redis token bucket via Upstash
   - Effort: 2 hours

### Core Entity & Memory (6 TODOs)
These are core continuity features.

7. **services/gateway/src/router.ts:115**
   - TODO: Call entity service to fetch entity + relationships + signals + memory
   - Endpoint: GET /entities/:id
   - Pattern: Call EntityServiceClient, compose Entity360
   - Effort: 4 hours

8. **services/gateway/src/router.ts:118**
   - TODO: Query adaptive memory with decay, links, promotion
   - Endpoint: GET /memory
   - Pattern: Call MemoryServiceClient with decay/link/promotion filters
   - Effort: 3 hours

9. **services/gateway/src/router.ts:120**
   - TODO: Save to adaptive memory with scoping
   - Endpoint: POST /memory
   - Pattern: Call MemoryServiceClient with scope context
   - Effort: 3 hours

10. **services/gateway/src/router.ts:122**
    - TODO: Delete memory item
    - Endpoint: DELETE /memory/:id
    - Pattern: Call MemoryServiceClient.delete with auth check
    - Effort: 1 hour

11. **services/gateway/src/router.ts:117**
    - TODO: Call entity search service
    - Endpoint: GET /search/entities
    - Pattern: Call SearchServiceClient with query
    - Effort: 2 hours

12. **services/gateway/src/router.ts:119**
    - TODO: Query adaptive memory with decay, links, promotion
    - Endpoint: GET /memory/search
    - Pattern: Call MemoryServiceClient with semantic search
    - Effort: 3 hours

---

## Important (Tier 2) - 28 TODOs

### Remaining 7 Adapters (7 TODOs)
These complete projection coverage.

1. **GovernanceBoardFacade** - services/projection-engine/src/facades/adapters.ts
   - Wire tasks + proposals + decisions
   - Services: Workspace.getTasks(), Intelligence.getProposals(), Spine.getDecisions()
   - Effort: 3 hours

2. **InboxFacade**
   - Wire signals + proposals unified queue
   - Services: Intelligence.getSignals(), Intelligence.getProposals()
   - Effort: 2 hours

3. **AccountHealthFacade**
   - Wire spine + signals + timeline
   - Services: Spine.getEntity360(), Intelligence.getSignals(), Spine.getTimeline()
   - Effort: 4 hours

4. **RenewalForecastFacade**
   - Wire spine + insights + renewals
   - Services: Spine.getEntity360(), Intelligence.getInsights(), Spine.getRenewals()
   - Effort: 3 hours

5. **MCPConsoleFacade**
   - Wire MCP registry + schema
   - Services: ConnectorClient.getMCPRegistry(), ConnectorClient.getSchema()
   - Effort: 4 hours

6. **WorkflowEditorFacade**
   - Wire workflows + templates
   - Services: WorkflowClient.getWorkflows(), WorkflowClient.getTemplates()
   - Effort: 3 hours

7. **BrainstormWorkbenchFacade**
   - Wire memory + entities + chat
   - Services: Spine.getMemory(), Spine.getEntity360(), ChatClient.getThreads()
   - Effort: 4 hours

### Connector Management (4 TODOs)
These enable integration hub.

8. **services/gateway/src/router.ts:129**
   - TODO: Get all connectors for tenant + their status
   - Endpoint: GET /connectors
   - Pattern: Call ConnectorClient.getTenantConnectors()
   - Effort: 2 hours

9. **services/gateway/src/router.ts:131**
   - TODO: Get specific connector status
   - Endpoint: GET /connectors/:id/status
   - Pattern: Call ConnectorClient.getStatus()
   - Effort: 1 hour

10. **services/gateway/src/router.ts:133**
    - TODO: Trigger sync for connector
    - Endpoint: POST /connectors/:id/sync
    - Pattern: Call ConnectorClient.triggerSync() via workflow
    - Effort: 2 hours

11. **services/gateway/src/router.ts:135**
    - TODO: Exchange OAuth code for connector access
    - Endpoint: POST /connectors/:id/oauth
    - Pattern: Call OAuth service, store credentials
    - Effort: 3 hours

### Proposals & Governance (6 TODOs)
These are core to doctrine.

12. **services/gateway/src/router.ts:171**
    - TODO: Create proposal
    - Endpoint: POST /proposals
    - Pattern: Call ProposalClient.create(), emit to governance
    - Effort: 3 hours

13. **services/gateway/src/router.ts:173**
    - TODO: Get proposal
    - Endpoint: GET /proposals/:id
    - Pattern: Call ProposalClient.get()
    - Effort: 1 hour

14. **services/gateway/src/router.ts:175**
    - TODO: Approve/reject proposal and execute action if approved
    - Endpoint: POST /proposals/:id/approve OR /proposals/:id/reject
    - Pattern: Call GovernanceClient.approve(), then WorkflowClient.execute()
    - Effort: 4 hours

### Capabilities & Execution (4 TODOs)
These enable the workflow runtime.

15. **services/gateway/src/router.ts:151**
    - TODO: List all available capabilities
    - Endpoint: GET /capabilities
    - Pattern: Call CapabilityClient.list()
    - Effort: 1 hour

16. **services/gateway/src/router.ts:153**
    - TODO: Get capability schema
    - Endpoint: GET /capabilities/:id/schema
    - Pattern: Call CapabilityClient.getSchema()
    - Effort: 1 hour

17. **services/gateway/src/router.ts:155**
    - TODO: Queue capability execution
    - Endpoint: POST /capabilities/:id/execute
    - Pattern: Call WorkflowClient.queueCapability()
    - Effort: 2 hours

18. **services/gateway/src/router.ts:157**
    - TODO: Get execution status
    - Endpoint: GET /capabilities/:id/execution/:execId
    - Pattern: Call WorkflowClient.getExecutionStatus()
    - Effort: 1 hour

### Insights (2 TODOs)
These feed intelligence to frontends.

19. **services/gateway/src/router.ts:177**
    - TODO: Generate/retrieve insights based on query
    - Endpoint: GET /insights
    - Pattern: Call IntelligenceClient.getInsights() with query
    - Effort: 2 hours

20. **services/gateway/src/router.ts:179**
    - TODO: Get specific insight
    - Endpoint: GET /insights/:id
    - Pattern: Call IntelligenceClient.getInsight()
    - Effort: 1 hour

### Tasks (3 TODOs)
These are operational units.

21. **services/gateway/src/router.ts:181**
    - TODO: Create task
    - Endpoint: POST /tasks
    - Pattern: Call WorkspaceClient.createTask()
    - Effort: 2 hours

22. **services/gateway/src/router.ts:183**
    - TODO: Get task
    - Endpoint: GET /tasks/:id
    - Pattern: Call WorkspaceClient.getTask()
    - Effort: 1 hour

23. **services/gateway/src/router.ts:185**
    - TODO: Complete task
    - Endpoint: POST /tasks/:id/complete
    - Pattern: Call WorkspaceClient.completeTask(), emit to memory
    - Effort: 2 hours

### Chat (3 TODOs)
These enable conversational interface.

24. **services/gateway/src/router.ts:187**
    - TODO: Create chat thread
    - Endpoint: POST /chat/threads
    - Pattern: Call ChatClient.createThread()
    - Effort: 1 hour

25. **services/gateway/src/router.ts:189**
    - TODO: Send message to chat, get AI response
    - Endpoint: POST /chat/threads/:id/messages
    - Pattern: Call ChatClient.sendMessage(), call Twin for AI response
    - Effort: 4 hours

26. **services/gateway/src/router.ts:191**
    - TODO: Get chat history
    - Endpoint: GET /chat/threads/:id/messages
    - Pattern: Call ChatClient.getMessages()
    - Effort: 1 hour

27. **services/gateway/src/router.ts:193**
    - TODO: Delete thread
    - Endpoint: DELETE /chat/threads/:id
    - Pattern: Call ChatClient.deleteThread()
    - Effort: 1 hour

### Spine Events (2 TODOs)
These track operational changes.

28. **services/gateway/src/router.ts:145**
    - TODO: Query Spine events with filters
    - Endpoint: GET /events
    - Pattern: Call SpineClient.getEvents() with filters
    - Effort: 2 hours

29. **services/gateway/src/router.ts:147**
    - TODO: Get specific event from Spine
    - Endpoint: GET /events/:id
    - Pattern: Call SpineClient.getEvent()
    - Effort: 1 hour

---

## Enhancement (Tier 3) - 18 TODOs

### Admin Analytics (4 TODOs)
Low priority - not needed for MVP.

1. **services/admin/src/index.ts:42**
   - TODO: Query Cloudflare Analytics API for real data
   - Effort: 3 hours

2. **services/admin/src/index.ts:85**
   - TODO: Trigger wrangler deploy via CF API
   - Effort: 3 hours

3. **services/admin/src/index.ts:92**
   - TODO: Rollback via CF API
   - Effort: 3 hours

4. **services/admin/src/index.ts:101**
   - For now, return mock data (TODO: wire to real CF Analytics)
   - Effort: 2 hours

### Intelligence & Signals (4 TODOs)
Optimization layer - not blocking.

5. **services/continuity/src/index.ts:28**
   - TODO: Wire to MorningBriefWorkflow when ready
   - Effort: 2 hours

6. **services/continuity/src/index.ts:42**
   - TODO: Replace with AI Search when available (PRIORITY 4)
   - Effort: 3 hours

7. **services/intelligence/src/index.ts:45**
   - TODO: Store brief in D1 or send to Knowledge service
   - Effort: 2 hours

8. **services/intelligence/src/index.ts:78**
   - TODO: Wire to SignalWorkflow when ready (2x instances)
   - Effort: 2 hours

### Twin & Execution (2 TODOs)
Advanced features - Phase 3.

9. **services/twin-orchestrator/src/index.ts:156**
   - TODO: Stream-based reasoning implementation
   - Effort: 8 hours (complex)

10. **services/workflow/src/index.ts:34**
    - TODO: Workflow executor implementation
    - Effort: 6 hours (complex)

### Knowledge & Chunking (2 TODOs)
Content processing - nice to have.

11. **services/knowledge/src/chunking/chunker.ts:31**
    - TODO: List preservation (extractLists) – currently unused
    - Effort: 2 hours

12. **services/knowledge/src/index.ts:55**
    - Tenant-scoped consumer (CONSOLIDATED_AGENT_TODO D.19)
    - Effort: 1 hour

### MCP Connector (2 TODOs)
Integration deepening - Phase 3.

13. **services/mcp-connector/src/spine-mcp-server.ts:41**
    - TODO: Call pipeline service binding for vault reads
    - Effort: 2 hours

14. **services/mcp-connector/src/spine-mcp-server.ts:156**
    - TODO: Spine MCP server completeness
    - Effort: 3 hours

### Infrastructure (4 TODOs)
Plumbing - low priority.

15. **services/loader/src/handlers/ai-relay.ts:1**
    - TODO: Move AIRelayWebhookSchema to @integratewise/types/webhooks
    - Effort: 1 hour

16. **services/normalizer/src/normalizer-accelerator.ts:88**
    - TODO: Accelerator implementation
    - Effort: 4 hours

17. **services/projection-engine/src/facades/adapters.ts:100**
    - TODO: Remaining adapter wiring (already covered above)
    - Effort: 0 hours (included in Tier 2)

18. **services/projection-engine/src/facades/facade-registry.ts:122**
    - TODO: Emit audit event
    - Effort: 2 hours

---

## Summary by Effort

| Tier | Count | Est. Hours | Critical? |
|------|-------|-----------|-----------|
| **Tier 1** | 12 | 30-35 | YES - blocks API |
| **Tier 2** | 28 | 70-80 | YES - completes Phase 2e |
| **Tier 3** | 18 | 40-50 | NO - Phase 3+ |
| **TOTAL** | 58 | 140-165 | |

## Implementation Strategy

**Minimum Viable**: Complete Tier 1 (12 TODOs, 30-35 hours)
- All APIs become functional
- Basic auth + projections work
- Frontend can start consuming

**Phase 2e Complete**: Add Tier 2 (28 TODOs, 70-80 hours)
- Full projection coverage
- All connector management
- Governance loop complete
- Chat & execution ready

**Phase 3+**: Tier 3 (18 TODOs, 40-50 hours)
- Analytics & optimization
- Advanced Twin reasoning
- Knowledge deepening
- Audit & compliance

---

**Last Updated:** Phase 2e scan complete
**Total Implementation:** 58 TODOs, ~15% of codebase
**Est. Duration:** 5-7 engineering weeks for full completion
