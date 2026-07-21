# Multi-Agent Orchestration: Complete System Architecture


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Executive Summary

IntegrateWise is now a **fully distributed multi-agent system** where:
- **Agent Lee** (Twin Agent) orchestrates with specialized agents
- **Tool Sharing** across agents enables capability discovery & reuse
- **Memory Sharing** (Spine + KV Cache + Durable Objects) allows context continuity
- **Pipeline Orchestration** routes work through agent network
- **MCP Server** exposes all agent operations to external systems

All infrastructure already exists. This document provides deployment verification & integration guide.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE EDGE NETWORK                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            SERVICE BINDINGS (Inter-worker calls)         │   │
│  │                                                           │   │
│  │  Twin Agent ↔ Specialized Agents (via Spine + MCP)      │   │
│  │  Twin Agent ↔ Memory Pipeline (Continuity Service)      │   │
│  │  Twin Agent ↔ ADK (capabilities & execution)            │   │
│  └──────────────────────────────────────────────────────────┘   │
│           ↓                    ↓                    ↓             │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ │
│  │   Twin Agent     │ │  CSM Agent       │ │  Lead Qual Agent │ │
│  │  (iw-agent      │ │  (specialized)   │ │  (specialized)   │ │
│  │   -runtime)     │ │                  │ │                  │ │
│  │                 │ │  Capabilities:   │ │  Capabilities:   │ │
│  │ Capabilities:   │ │  - lead scoring  │ │  - enrichment    │ │
│  │ - orchestrate   │ │  - task routing  │ │  - qualification │ │
│  │ - reason        │ │  - priority mgmt │ │  - recommendation│ │
│  │ - propose       │ │                  │ │                  │ │
│  │ - learn/adapt   │ └──────────────────┘ └──────────────────┘ │
│  └──────────────────┘                                            │
│           ↓                                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         DURABLE OBJECTS (Stateful Storage)               │   │
│  │                                                           │   │
│  │  • TenantBrainDO (tenant state, signals, approvals)     │   │
│  │  • SharedMemoryDO (indexed, cross-agent visible)        │   │
│  │  • PipelineCoordinatorDO (route & track jobs)           │   │
│  └──────────────────────────────────────────────────────────┘   │
│           ↓                    ↓                    ↓             │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ │
│  │    Spine (D1)    │ │   KV Cache       │ │    Queues        │ │
│  │                  │ │                  │ │                  │ │
│  │ • Events         │ │ • Tool registry  │ │ • Agent tasks    │ │
│  │ • Audit trail    │ │ • Capabilities   │ │ • Signals        │ │
│  │ • Canonical truth│ │ • Agent context  │ │ • Proposals      │ │
│  │ • Relationships  │ │ • Memory index   │ │ • Outcomes       │ │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Agent Registry & Discovery
**File:** `services/mcp-connector/src/agent/registry.ts`

Agents register with capabilities:
```typescript
// Register Agent Lee
await registerAgent(db, {
  agent_id: 'lee-twin-1',
  agent_name: 'Lee Twin Agent',
  tenant_id: 'integratewise',
  capabilities: ['orchestrate', 'reason', 'propose', 'learn'],
  runtime: 'cloudflare',
  status: 'active'
});

// Query agents by capability
const scorers = await queryAgentsByCapability(db, 'integratewise', 'score_lead');
```

**DB Schema:**
```sql
CREATE TABLE agent_registry (
  agent_id TEXT PRIMARY KEY,
  agent_name TEXT,
  tenant_id TEXT,
  capabilities TEXT, -- JSON array
  endpoint TEXT,
  runtime TEXT,
  status TEXT,
  metadata TEXT,
  updated_at DATETIME
);
```

### 2. Agent Communication
**File:** `services/mcp-connector/src/agent/communication.ts`

Inter-agent messaging with correlation tracking:
```typescript
// Send message from Twin to CSM Agent
const result = await sendMessage(db, cache, {
  sender_agent_id: 'lee-twin-1',
  receiver_agent_id: 'csm-agent-1',
  message_type: 'request',
  payload: { tool_name: 'score_lead', lead_id: '123' },
  correlation_id: crypto.randomUUID()
});

// CSM Agent receives message
const inbox = await getInbox(db, 'csm-agent-1', 'integratewise');

// Mark as processed
await markProcessed(db, message_id);
```

**Storage:** D1 (durable log) + KV (fast 5-min cache)

### 3. Shared Memory with Decay
**File:** `services/iw-agent-runtime/src/ecosystem/memory-pipeline.ts`

Cross-agent visible memory:
```typescript
// Save learning (all agents can see)
await saveMemory(do_state, {
  content: 'Accounts > 100K are qualified leads',
  scope: 'global',
  tags: ['lead_qualification', 'best_practice'],
  agent_id: 'lee-twin-1'
});

// Retrieve with decay & promotion applied
const memories = await queryMemory(do_state, {
  scope: 'global',
  tags: ['lead_qualification'],
  limit: 10
});
// Older memories weighted lower via: score *= exp(-age_days / 7)
```

### 4. Twin Agent (Orchestrator)
**File:** `services/iw-agent-runtime/src/twin-agent.ts`

User's personal orchestrator:
```typescript
// Twin receives query
const response = await twinAgent.chat({
  user_message: 'Should we pursue lead #123?',
  tenant_id: 'integratewise'
});

// Twin loop:
// 1. Observe (retrieve Spine + Memory)
// 2. Reflect (synthesize patterns)
// 3. Learn (update personal profile)
// 4. Propose (generate recommendation)
// 5. Coach (explain & flag approvals)
```

### 5. Pipeline Orchestration
**File:** `services/pipeline/src/index.ts`

Task routing to agents:
```typescript
// User submits task
POST /api/v1/pipelines/execute {
  task_type: 'lead_score',
  params: { lead_id: '123' },
  tenant_id: 'integratewise'
}

// Pipeline:
// 1. Queries registry for lead_score agents
// 2. Sends to best agent (CSM Agent score: 0.9)
// 3. Captures result in Spine
// 4. Returns to user
```

### 6. MCP Server (Agent Protocol)
**File:** `services/mcp-connector/src/mcp-server.ts`

Exposed tools for external consumption:
```
- agent.register
- agent.send
- agent.inbox
- agent.discover_capabilities
- agent.execute_tool
- spine.query_events
- memory.query
- memory.save
- pipeline.submit_task
```

---

## Deployment Verification

### Step 1: Verify Agent Registration
```bash
# Check Twin Agent is registered
curl -X GET https://api.integratewise.ai/v1/agents/lee-twin-1 \
  -H "Authorization: Bearer $TOKEN"

# Expected response:
{
  "agent_id": "lee-twin-1",
  "agent_name": "Lee Twin Agent",
  "capabilities": ["orchestrate", "reason", "propose", "learn"],
  "status": "active",
  "runtime": "cloudflare"
}

# Verify all agents active
curl -X GET https://api.integratewise.ai/v1/agents/registry \
  -H "Authorization: Bearer $TOKEN"
```

### Step 2: Test Inter-Agent Communication
```bash
# Twin sends message to CSM Agent
curl -X POST https://api.integratewise.ai/v1/agents/lee-twin-1/send \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "receiver_agent_id": "csm-agent-1",
    "message_type": "request",
    "payload": {
      "tool_name": "score_lead",
      "params": { "lead_id": "test-123" }
    }
  }'

# Expected: message_id, correlation_id, status=sent

# CSM Agent retrieves inbox
curl -X GET https://api.integratewise.ai/v1/agents/csm-agent-1/inbox \
  -H "Authorization: Bearer $TOKEN"

# Expected: Pending message from Lee Twin
```

### Step 3: Verify Shared Memory
```bash
# Save memory (global scope)
curl -X POST https://api.integratewise.ai/v1/memory/save \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "content": "Test learning from Twin Agent",
    "scope": "global",
    "tags": ["test", "verification"],
    "agent_id": "lee-twin-1"
  }'

# Query memory (any agent can access)
curl -X GET https://api.integratewise.ai/v1/memory?scope=global&tags=verification \
  -H "Authorization: Bearer $TOKEN"

# Expected: Memory entry with decay/promotion scores
```

### Step 4: Test Pipeline End-to-End
```bash
# Submit pipeline task
curl -X POST https://api.integratewise.ai/v1/pipelines/execute \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "task_type": "lead_score",
    "params": { "lead_id": "test-123" },
    "tenant_id": "integratewise"
  }'

# Expected: { task_id, status: "queued", agent_id: "csm-agent-1" }

# Poll for result
curl -X GET https://api.integratewise.ai/v1/pipelines/test-task-id \
  -H "Authorization: Bearer $TOKEN"

# Expected: { status: "complete", result: { score: 0.92, reason: "..." } }
```

### Step 5: Verify MCP Server
```bash
# List all MCP tools
curl -X POST https://mcp.integratewise.ai/v1/messages \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'

# Expected: 18+ tools available
```

### Step 6: Check Spine Events
```bash
# Query decision events
curl -X GET https://api.integratewise.ai/v1/spine/events?type=decision \
  -H "Authorization: Bearer $TOKEN"

# Expected: Events from Twin Agent proposals
```

---

## Complete Multi-Agent Flow Example

**Scenario:** User asks Twin: "Should we pursue lead #123?"

### Step 1: Twin Observes
```typescript
// Retrieve lead from Spine
const lead = await spineQuery(db, 'lead', '123');

// Get relevant memories (global scope)
const memories = await queryMemory(do_state, {
  tags: ['lead_qualification'],
  limit: 10
});

// Load personal learned profile
const profile = twinState.learned_profile;
```

### Step 2: Twin Discovers & Coordinates Agents
```typescript
// Find CSM Agent capable of scoring
const csm = await queryAgentsByCapability(db, 'integratewise', 'score_lead');

// Send scoring request
await sendMessage(db, cache, {
  sender_agent_id: 'lee-twin-1',
  receiver_agent_id: csm[0].agent_id,
  message_type: 'request',
  payload: {
    tool_name: 'score_lead',
    params: {
      lead_id: '123',
      account_value: lead.account_value,
      industry: lead.industry
    }
  },
  correlation_id: correlationId
});

// Wait for CSM response
const responses = await getInbox(db, 'lee-twin-1', 'integratewise');
const result = responses.find(m => m.correlation_id === correlationId);
```

### Step 3: Twin Synthesizes & Proposes
```typescript
const reasoning = `
Lead #123 Analysis:
- Account Value: $150K (exceeds 100K threshold)
- Industry: Tech (good margins)
- CSM Score: 0.92/1.0 (qualified)
- Learned Pattern: "High-value + CSM approval = pursuit"

Recommendation: PURSUE (confidence: 0.88)
`;

// Emit as governance signal
await emitTriageInput(env, 'integratewise', {
  kind: 'twin_proposal',
  content: reasoning,
  agent_id: 'lee-twin-1'
});
```

### Step 4: Spine Records & Memory Updates
```typescript
// Record decision in Spine
await createEvent(db, {
  entity_id: 'lead-123',
  event_type: 'decision.proposal',
  data: {
    proposal: 'pursue',
    confidence: 0.88,
    agents: ['lee-twin-1', 'csm-agent-1'],
    timestamp: new Date().toISOString()
  }
});

// Save learning to shared memory
await saveMemory(do_state, {
  content: 'Lead #123: High-value + CSM score confirmed qualification',
  scope: 'global',
  tags: ['decision', 'lead_123'],
  agent_id: 'lee-twin-1'
});

// Update Twin's learned profile
twinState.learned_profile.recent_lessons.push(
  'High-value accounts with CSM approval are good pursuit candidates'
);
```

### Step 5: User Receives Response
```json
{
  "proposal": "PURSUE lead #123",
  "confidence": 0.88,
  "reasoning": "Lead has strong indicators...",
  "next_step": "Awaiting your approval to assign",
  "agents_consulted": [
    {
      "agent_id": "csm-agent-1",
      "contribution": "lead scoring",
      "confidence": 0.92
    }
  ],
  "supporting_data": {
    "lead_value": "$150K",
    "csm_score": 0.92,
    "best_practices_matched": 1
  }
}
```

---

## Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| Twin observes (retrieve Spine) | <50ms | ✅ (KV cache) |
| Twin discovers agent | <10ms | ✅ (registry in KV) |
| Inter-agent message send | <20ms | ✅ (D1 + KV dual-write) |
| Agent receives message | <100ms | ✅ (KV polling) |
| Shared memory query | <30ms | ✅ (Durable Object) |
| Pipeline task completion | <200ms | ✅ (async queue) |
| Spine event recorded | <50ms | ✅ (D1) |
| Memory decay computed | <10ms | ✅ (on-query) |

---

## Monitoring & Alerts

### Health Checks
```typescript
// Agent heartbeat check
setInterval(async () => {
  const agents = await listActiveAgents(db);
  for (const agent of agents) {
    const lastHeartbeat = agent.last_heartbeat;
    if (Date.now() - lastHeartbeat > 300000) { // 5 min
      alert(`Agent ${agent.agent_id} offline`);
    }
  }
}, 60000);

// Message delivery tracking
const undelivered = await db.prepare(`
  SELECT COUNT(*) as count FROM agent_communication_log
  WHERE status IN ('sent', 'delivered')
  AND created_at < datetime('now', '-5 minutes')
`).first();

if (undelivered.count > 10) {
  alert('Messages not processed within 5 minutes');
}
```

### Metrics to Track
- Agent registration count (should be stable)
- Message send/deliver/process rates
- Inter-agent latency (p50, p95, p99)
- Memory decay accuracy
- Pipeline throughput & latency
- MCP tool invocation counts
- Spine event creation rate

---

## Production Rollout Checklist

- [ ] All agents registered in `agent_registry`
- [ ] All agents marked `active` status
- [ ] Inter-agent communication latency <50ms
- [ ] Shared memory decay algorithm verified
- [ ] Pipeline routing tested with 10+ task types
- [ ] MCP server all 18+ tools accessible
- [ ] Spine audit trail capturing all events
- [ ] Monitoring alerts configured
- [ ] Graceful degradation if agent goes offline
- [ ] Rollback plan documented & tested
- [ ] Team trained on multi-agent workflow
- [ ] User documentation updated
- [ ] Load test with 100+ concurrent agents

---

## Troubleshooting

### Agent Not Found
```bash
# Check agent registry
SELECT * FROM agent_registry WHERE agent_id = 'lea-twin-1';

# If missing, re-register:
curl -X POST https://api.integratewise.ai/v1/agents/register ...
```

### Message Not Delivered
```bash
# Check D1 log
SELECT * FROM agent_communication_log
WHERE correlation_id = 'corr-123'
ORDER BY created_at DESC;

# Check KV cache
curl -X GET https://cache.integratewise.ai/agent_msg:tenant:agent_id:msg_id

# Check if receiver agent is polling
SELECT last_inbox_check FROM agent_registry WHERE agent_id = 'csm-agent-1';
```

### Memory Decay Score Wrong
```bash
# Verify decay formula: score *= exp(-age_days / 7)
const age_days = (Date.now() - memory.created_at) / 86400000;
const decay_factor = Math.exp(-age_days / 7);
console.log(`Age: ${age_days} days, Decay factor: ${decay_factor}`);

// Should be close to actual stored relevance_score
```

### Pipeline Task Stuck
```bash
# Check task status
curl -X GET https://api.integratewise.ai/v1/pipelines/task-id

# Check queue
SELECT COUNT(*) FROM pipeline_queue WHERE task_id = 'task-123';

# Check assigned agent's inbox
curl -X GET https://api.integratewise.ai/v1/agents/agent-id/inbox
```

---

## Next Steps

1. **Deploy to Staging**
   - Run verification script
   - Load test with 10x expected volume
   - Monitor latencies & error rates

2. **Team Training**
   - How agents coordinate
   - How to build new agents
   - How to add new capabilities

3. **Production Rollout**
   - Blue/green deployment
   - Monitor for 24 hours
   - Gradual traffic increase

4. **Continuous Improvement**
   - Track agent performance
   - Optimize hot paths
   - Add new specialized agents

