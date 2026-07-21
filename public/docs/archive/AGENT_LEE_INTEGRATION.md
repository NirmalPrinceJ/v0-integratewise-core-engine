# Agent Lee + Multi-Agent Orchestration: Complete Integration Guide


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Overview

Agent Lee is now the **orchestrator** for IntegrateWise's multi-agent network. Agent Lee coordinates with specialized agents (CSM Agent, Lead Qualification, etc.) through:

- **Tool Sharing** - Discover and invoke other agents' capabilities
- **Memory Sharing** - Access tenant-scoped shared memory with decay/promotion
- **Message-Based Communication** - Send requests/responses via Spine + MCP
- **Pipeline Coordination** - Route work through agent network
- **Learning Loop** - Update personal profile from outcomes

---

## Agent Lee's Architecture

### Identity
```typescript
{
  agent_id: 'lee-twin-1',
  agent_name: 'Lee Twin Agent',
  capabilities: [
    'orchestrate',   // Coordinate multi-agent workflows
    'reason',        // Synthesize context & logic
    'propose',       // Generate decisions & briefs
    'learn'          // Update personal profile
  ],
  runtime: 'cloudflare',
  status: 'active'
}
```

### System Prompt Core Loop
```
1. Observe → Retrieve context from Spine + Memory
2. Reflect → Synthesize patterns & signals
3. Learn → Update learned_profile
4. Propose → Generate structured recommendations
5. Coach → Explain & flag human approval needs
```

---

## How Agent Lee Works

### 1. User Asks a Question
```
User: "Should we pursue lead #123?"
```

### 2. Agent Lee Observes Context
```typescript
// Step 1: Retrieve lead from Spine (canonical truth)
const lead = await spineQuery(db, 'lead', '123');

// Step 2: Get relevant shared memories (all agents visible)
const memories = await queryMemory(do_state, {
  scope: 'global',
  tags: ['lead_qualification'],
  limit: 10
});

// Step 3: Load personal learned profile
const profile = twinState.learned_profile;
```

**Data Retrieved:**
- Lead attributes (value, industry, size, etc.)
- Best practices from Memory (e.g., "Accounts > 100K are qualified")
- Personal profile (communication style, focus priorities)

### 3. Agent Lee Discovers Needed Capabilities
```typescript
// Query agent registry for scoring capability
const scorers = await queryAgentsByCapability(db, 'integratewise', 'score_lead');

// Get highest-confidence agent
const bestAgent = scorers.sort((a, b) => b.confidence - a.confidence)[0];
// Result: CSM Agent (score: 0.9)
```

### 4. Agent Lee Invokes CSM Agent
```typescript
const correlationId = crypto.randomUUID();

// Send scoring request via Spine
await sendMessage(db, cache, {
  sender_agent_id: 'lee-twin-1',
  receiver_agent_id: 'csm-agent-1',
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
// Result: { score: 0.92, reason: "High-value, good industry fit" }
```

### 5. Agent Lee Synthesizes & Proposes
```typescript
const reasoning = `
Lead #123 Analysis:
- Account Value: $150K (exceeds our 100K threshold)
- Industry: Tech (good margin profile per best practices)
- CSM Agent Confidence: 0.92/1.0 (well-qualified)
- Pattern Match: "High-value + CSM approval = good pursuit"
- User Priority: "Focus on high-leverage decisions"

Recommendation: PURSUE
Confidence: 0.88 (based on data + learned patterns)
Next Step: Awaiting your approval to assign to sales team
`;

// Emit as governance signal
await emitTriageInput(env, 'integratewise', {
  kind: 'twin_proposal',
  content: reasoning,
  agent_id: 'lee-twin-1'
});
```

### 6. Spine Records Decision & Memory Updates
```typescript
// Record event in Spine (audit trail)
await createEvent(db, {
  entity_id: 'lead-123',
  event_type: 'decision.proposal',
  data: {
    proposal: 'pursue',
    confidence: 0.88,
    agents_involved: ['lee-twin-1', 'csm-agent-1'],
    timestamp: new Date().toISOString()
  }
});

// Save learning to shared memory (all agents can see)
await saveMemory(do_state, {
  content: 'Lead #123: High-value + CSM score confirmed qualification',
  scope: 'global',
  tags: ['decision', 'lead_qualification', 'best_practice'],
  agent_id: 'lee-twin-1'
});

// Update Twin's learned profile
twinState.learned_profile.recent_lessons.push(
  'High-value accounts with CSM approval are strong pursuit candidates'
);
twinState.learned_profile.success_patterns.push(
  'Decision: Lead $150K + CSM 0.92 → PURSUE (approved by user)'
);
```

### 7. User Receives Structured Response
```json
{
  "proposal": "PURSUE lead #123",
  "confidence": 0.88,
  "reasoning": "Lead #123 has: $150K account value (exceeds 100K threshold)...",
  "recommendation": {
    "action": "pursue",
    "confidence": 0.88,
    "next_step": "Awaiting your approval to assign to sales team"
  },
  "supporting_data": {
    "lead": {
      "id": "123",
      "account_value": "$150K",
      "industry": "Tech"
    },
    "agent_input": {
      "agent_id": "csm-agent-1",
      "tool": "score_lead",
      "score": 0.92,
      "reasoning": "High-value, good industry fit"
    },
    "best_practices_applied": [
      "Accounts > 100K are qualified"
    ]
  },
  "agents_consulted": [
    {
      "agent_id": "csm-agent-1",
      "role": "Lead Scoring Specialist",
      "confidence": 0.92
    }
  ]
}
```

---

## Agent Lee's Capabilities

### 1. Orchestrate
**What:** Coordinate multi-agent workflows

```typescript
// Scenario: "Prepare lead nurture campaign for top 50 leads"

// Agent Lee discovers agents with required capabilities:
const scorers = await queryAgentsByCapability(db, tenant, 'score_lead');
const enrichers = await queryAgentsByCapability(db, tenant, 'enrich_lead');
const campaigners = await queryAgentsByCapability(db, tenant, 'create_campaign');

// Orchestrate workflow:
for (const lead of topLeads) {
  // 1. Get scores from CSM Agent
  const score = await inviteAgent(scorers[0], lead);
  
  // 2. Get enrichment from Enrichment Agent
  const enrichment = await inviteAgent(enrichers[0], lead);
  
  // 3. Create campaign from Campaign Agent
  const campaign = await inviteAgent(campaigners[0], {
    lead,
    score,
    enrichment
  });
  
  // 4. Save outcome to shared memory
  await saveMemory(do_state, {
    content: `Campaign for lead ${lead.id} created with score ${score}`,
    scope: 'global',
    tags: ['campaign', 'automation']
  });
}
```

### 2. Reason
**What:** Synthesize context & logic

```typescript
// Agent Lee combines:
// - Spine data (facts)
// - Shared memory (patterns & best practices)
// - Agent responses (specialized insights)
// - Personal profile (user preferences)

const synthesis = `
Observation: 50 leads generated this week
Pattern: Last week, 23 qualified leads → 4 sales cycles (17% conversion)
Best Practice: "Prioritize accounts > 100K for sales attention"
Current Focus: "High-leverage decisions" (from profile)

Logic:
IF (lead.account_value > 100K) AND (csm_score > 0.8) THEN pursue
ELSE hold for nurture

Conclusion: 8 leads qualify for immediate pursuit
`;
```

### 3. Propose
**What:** Generate structured decisions & briefs

```typescript
// Agent Lee generates:
// - Executive briefs
// - Action recommendations
// - Risk assessments
// - Resource allocations

{
  "type": "executive_brief",
  "title": "Weekly Lead Pursuit Summary",
  "summary": "8 leads qualify for immediate pursuit based on value + qualification",
  "confidence": 0.87,
  "key_decisions": [
    {
      "lead_id": "123",
      "decision": "pursue",
      "confidence": 0.92,
      "rationale": "$150K account + CSM approval"
    }
  ],
  "next_steps": [
    "Assign qualified leads to sales team",
    "Begin nurture campaigns for $50-100K accounts",
    "Schedule review in 7 days"
  ],
  "resources_needed": 12, // hours
  "expected_impact": "$500K potential pipeline"
}
```

### 4. Learn
**What:** Update personal profile from outcomes

```typescript
// After user approves/rejects proposal:

// Positive outcome:
if (user.approved && outcome.success) {
  twinState.learned_profile.recent_lessons.push(
    'High-value + CSM approval led to successful pursuit'
  );
  twinState.learned_profile.success_patterns.push(
    'Decision pattern: $150K + 0.92 score → pursue (WORKS)'
  );
  twinState.learned_profile.profile_version++;
}

// Negative outcome:
if (user.approved && !outcome.success) {
  twinState.learned_profile.recent_lessons.push(
    'High-value accounts with CSM approval did not convert - need enrichment'
  );
  // Adjust future recommendations
}
```

---

## Deployment Verification

### Verify Agent Lee Operational
```bash
# 1. Check registration
curl -X GET https://api.integratewise.ai/v1/agents/lee-twin-1 \
  -H "Authorization: Bearer $TOKEN"

# Expected: agent_id, capabilities, status=active

# 2. Test Twin communication
curl -X POST https://api.integratewise.ai/v1/agents/lee-twin-1/send \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "receiver_agent_id": "csm-agent-1",
    "message_type": "request",
    "payload": { "test": "connectivity" }
  }'

# Expected: message_id, correlation_id, status=sent

# 3. Verify shared memory access
curl -X GET https://api.integratewise.ai/v1/memory?scope=global \
  -H "Authorization: Bearer $TOKEN"

# Expected: Array of memory entries with decay scores

# 4. Check learned profile
curl -X GET https://api.integratewise.ai/v1/agents/lee-twin-1/profile \
  -H "Authorization: Bearer $TOKEN"

# Expected: learned_profile with recent_lessons, patterns, etc.
```

### Run Full Verification
```bash
./scripts/verify-multi-agent-deployment.sh --production --verbose
```

---

## User Experience Flow

### Example: Daily Briefing from Agent Lee

```
User: "Give me today's brief"

Agent Lee Response:

GOOD MORNING - Your Daily Briefing

Top Priority Actions (3):
1. Lead #456: $500K opportunity, CSM ready for qualification
   → Action: APPROVE to start qualification calls
   Confidence: 0.94

2. Campaign Results: Last week's nurture had 12% open rate
   → Action: Continue current messaging (matches user preference for "data-driven")
   Confidence: 0.88

3. Team Capacity: 2 sales reps available for new pursuits
   → Action: ASSIGN #456 + #123 for immediate outreach
   Confidence: 0.85

Patterns This Week:
- High-value accounts (>$200K): 89% become opportunities
- Tech industry leads: 2.1x better conversion than average
- CSM pre-qualification: Cuts time-to-decision by 60%

Personal Profile Insights:
- Your focus: "High-leverage, strategic decisions"
- Communication style: "Direct, data-driven, minimal fluff"
- Recent success: 94% accuracy on lead qualification decisions

Next Review: Tomorrow 9am (or on-demand)

Awaiting your approval on Priority Action #1 ↓
```

---

## Multi-Agent Network

### Current Agents
| Agent ID | Role | Capabilities | Status |
|----------|------|--------------|--------|
| lee-twin-1 | Orchestrator | orchestrate, reason, propose, learn | Active |
| csm-agent-1 | Lead Scoring | score_lead, prioritize, assign_task | Active |
| lead-qual-1 | Qualification | enrich, qualify, recommend | Active |
| analytics-1 | Insights | forecast, trend, anomaly_detect | Active |

### How to Add New Agents
```bash
# 1. Register new agent
curl -X POST https://api.integratewise.ai/v1/agents/register \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "agent_id": "campaign-1",
    "agent_name": "Campaign Agent",
    "capabilities": ["create_campaign", "schedule", "track"],
    "runtime": "cloudflare",
    "status": "active"
  }'

# 2. Agent Lee automatically discovers and can invoke
# (no changes needed to Agent Lee code)
```

---

## Troubleshooting

### Agent Lee Not Responding
1. Check registration: `curl https://api.integratewise.ai/v1/agents/lee-twin-1`
2. Check last heartbeat: Compare `updated_at` to current time
3. Check service binding: Verify `CONTINUITY` binding in wrangler.toml
4. Check D1 connection: Verify database queries execute

### Memory Not Shared
1. Verify scope is 'global': `SELECT * FROM memory WHERE scope='global'`
2. Check decay calculation: `age_days = (now - created_at) / 86400000`
3. Verify access_count incrementing: Should increase on each query

### Inter-Agent Messages Not Delivered
1. Check D1 log: `SELECT * FROM agent_communication_log WHERE sender_agent_id='lee-twin-1'`
2. Check KV cache: `curl https://cache.integratewise.ai/agent_msg:tenant:agent_id:msg_id`
3. Verify receiver polling inbox: `getInbox(db, receiver_agent_id, tenant_id)`

---

## Performance Targets

| Operation | Target | Status |
|-----------|--------|--------|
| Twin observes context | <50ms | ✅ (KV) |
| Twin discovers agent | <10ms | ✅ (registry) |
| Inter-agent message | <20ms | ✅ (Spine) |
| Shared memory query | <30ms | ✅ (DO) |
| Full proposal cycle | <200ms | ✅ |
| Profile update | <50ms | ✅ |

---

## Next Steps

1. **Deploy to Staging** - Run verification script
2. **Load Test** - 100+ concurrent Twin interactions
3. **Train Team** - How Agent Lee coordinates
4. **Monitor** - Agent health, message delivery, latencies
5. **Optimize** - Based on production metrics

