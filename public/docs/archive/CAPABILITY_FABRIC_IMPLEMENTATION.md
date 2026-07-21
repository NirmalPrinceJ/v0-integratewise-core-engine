# Capability Fabric Layer - Implementation Guide


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Overview

The **Capability Fabric** is the runtime execution layer that transforms organizational capabilities into AI-powered workflows. It's the missing link between architecture (what COULD happen) and execution (what WILL happen).

**Status**: Stage 1-2 Complete (Foundation + Runtime Engine)

---

## What We Built

### 1. Capability Registry (`packages/core/capability-registry/`)

**Purpose**: Central registry of 200+ organizational capabilities with metadata, permissions, and requirements.

**Key Components**:
- `types.ts` - Type definitions (CapabilityDefinition, CapabilityInvocation, etc.)
- `registry.ts` - CapabilityRegistryImpl with 3 example capabilities
- Supports: Sell Deal, Monitor Health, Collect Payment

**Example Capability**:
```typescript
{
  id: 'sell-deal',
  name: 'Sell Deal',
  domain: CapabilityDomain.REVENUE,
  steps: [
    { id: 'assess-fit', handler: HandlerType.AI, ai_model: 'gpt-4' },
    { id: 'pricing-analysis', handler: HandlerType.AI, requires_approval: true },
    { id: 'close-approval', handler: HandlerType.HUMAN },
    { id: 'create-order', handler: HandlerType.SYSTEM }
  ],
  requires_data: [
    { entity_type: 'Opportunity', fields: ['name', 'arr', 'stage'], must_exist: true },
    { entity_type: 'Account', fields: ['name', 'industry'], must_exist: true }
  ],
  permissions: [
    { role: 'sales-rep', can_invoke: true, can_approve: false },
    { role: 'sales-manager', can_invoke: true, can_approve: true, can_execute: true }
  ]
}
```

### 2. Capability Engine (`packages/core/capability-engine/`)

**Purpose**: Executes capability workflows through a state machine.

**State Flow**:
```
pending → ai_processing → human_review → execution → completed
                                ↓
                            (if AI fails)
                           escalates
```

**Key Features**:
- Step-by-step execution (AI, human, system, hybrid)
- Event-driven architecture for state transitions
- Metrics collection (duration, success, confidence)
- Mock AI integration (ready for real LLM)

**Usage**:
```typescript
const engine = new CapabilityEngine(config);
const invocation = await engine.execute(invocation, capability, context);
```

### 3. Workflow Router (`packages/core/workflow-router/`)

**Purpose**: Context-aware routing decisions (AI → human → system).

**Routing Logic**:
- **High confidence + no governance**: Route to AI (auto-execute)
- **Medium confidence**: Route to hybrid (AI rec + human approval)
- **Low confidence**: Route to human (escalate)
- **Governance requirements**: Always route to human

**Context-Aware**:
- Same capability executes differently for managers vs individual contributors
- High-value/urgent always requires human review
- Data access levels (own/team/org) control visibility
- Load balancing assigns to least-busy team member

**Example**:
```typescript
const router = new WorkflowRouter();
const decision = await router.route(capability, context, aiConfidence);
// Returns: { handler: 'human', assigned_to: 'sales-manager-1', reason: '... }
```

### 4. Capability Context (`packages/core/capability-context/`)

**Purpose**: Assembles all data needed for capability execution.

**Context Layers**:
1. **Entity Data** - Primary entities from Spine (accounts, opportunities, etc.)
2. **Signals** - Engagement, risk, opportunity scores with trends
3. **Historical** - Past executions of same capability
4. **AI Context** - LLM-formatted summary with interactions & outcomes
5. **User Context** - Role, permissions, team

**Example**:
```typescript
const context = await builder.build(
  capabilityId,
  executionId,
  userId,
  userRole,
  inputData,
  capability
);

// Returns: {
//   entities: { Opportunity: {...}, Account: {...} },
//   signals: { engagement: { score: 72, trend: 'improving' } },
//   history: { past_executions: [...], success_rate: 0.95 },
//   ai_context: { summary: '...', recent_interactions: [...] }
// }
```

### 5. Execution Orchestrator (`packages/core/execution-orchestrator/`)

**Purpose**: Chains capabilities across domains into multi-step workflows.

**Workflows Supported**:
- **Sequential**: Sell Deal → Onboard Customer → Create Project → Notify Finance
- **Parallel**: Independent capabilities run together
- **Dependent**: One capability must complete before next starts
- **With Fallback**: Alternative capability if primary fails

**Example**:
```typescript
const orchestrator = new ExecutionOrchestrator(engine);
const plan = {
  steps: [
    { id: 'sell', capability: sellDeal },
    { id: 'onboard', capability: onboardCustomer, dependsOn: ['sell'] },
    { id: 'create-project', capability: createProject, dependsOn: ['onboard'] }
  ]
};
const results = await orchestrator.orchestrate(plan, context);
```

### 6. Capability Metrics (`packages/core/capability-metrics/`)

**Purpose**: Tracks execution metrics and extracts learning insights.

**Metrics Collected**:
- Success rate, execution time, AI accuracy
- Human override rate, confidence scores
- Business impact (revenue, time saved, etc.)
- Trend analysis (improving/stable/degrading)

**Learning Patterns**:
- Identifies slow capabilities (optimization needed)
- High-override capabilities (AI needs retraining)
- Low-accuracy recommendations (context gaps)
- Improving patterns (learning loop working)

**Example**:
```typescript
const metrics = new CapabilityMetricsService();
metrics.recordExecution({
  capability_id: 'sell-deal',
  execution_time_ms: 3600000,
  success: true,
  ai_confidence: 0.87,
  human_override: false,
  business_impact: { revenue: 500000, time_saved_hours: 2 }
});

const insights = metrics.generateLearningInsights();
// Returns patterns for Twin: slow caps, high overrides, low accuracy
```

### 7. Capability Shell UI (`apps/live/components/capability-shell.tsx`)

**Purpose**: Generic React component for rendering any capability.

**Features**:
- Adaptive UI based on execution state (pending → AI → human → completed)
- Entity context visualization with signals
- AI recommendation panel with confidence scores
- Result/error display
- Approve/reject/execute actions

**States Rendered**:
- `pending`: Ready to execute button
- `ai_processing`: Loading state
- `human_review`: AI recommendation panel with approve/reject
- `executing`: In-progress animation
- `completed`: Success result
- `failed`: Error message

**Usage**:
```tsx
<CapabilityShell
  capabilityId="sell-deal"
  capabilityName="Sell Deal"
  domain="revenue"
  state={executionState}
  entityName="Acme Corp"
  signals={signals}
  aiRecommendation={recommendation}
  onApprove={handleApprove}
  onExecute={handleExecute}
/>
```

### 8. Capabilities Dashboard (`apps/live/app/(app)/capabilities/page.tsx`)

**Purpose**: Homepage showing available capabilities with quick execution.

**Features**:
- List view: Grid of capabilities filtered by role
- Detail view: Full capability execution with shell
- Signals visualization: Real-time health indicators
- Action history: Track recent executions
- Learning insights: Recommendations for improvements

---

## Architecture: The Unified Lifecycle

Every capability execution follows this flow:

```
1. Capability Invoked
   User says "sell this deal" or clicks "Execute"
   ↓
2. Context Assembly
   CapabilityContext fetches entities, signals, historical data
   ↓
3. Routing Decision
   WorkflowRouter decides: AI? Human? System? Hybrid?
   ↓
4. AI Processing (if applicable)
   CapabilityEngine invokes AI with full context
   ↓
5. Human Review (if needed)
   Route to human if confidence low or governance requires
   ↓
6. Execution
   Execute steps via system APIs
   ↓
7. Outcome Tracking
   CapabilityMetrics records results
   ↓
8. Learning
   Extract patterns, improve AI recommendations, update Twin
```

---

## Next Steps: Stage 3 (Metrics & Learning) + Stage 4 (Integration)

### Stage 3: Metrics & Learning (Weeks 5-6)

**3.1 Capability Metrics Dashboard**
- Per-capability performance graphs
- Success rate trends (30-day)
- AI accuracy by recommendation type
- Human override heatmaps
- Cost per execution analysis

**3.2 Learning Service**
- Extract patterns from execution history
- Identify improvement opportunities
- Generate Twin-ready insights
- Recommend model retraining

**3.3 Twin Integration**
- Feed metrics back to Digital Twins
- Update Twin confidence based on feedback
- Twin-driven capability optimization

**Files to create**: 3 files, ~500 lines
- `packages/core/capability-metrics/learning-service.ts`
- `packages/core/capability-metrics/dashboard-metrics.ts`
- `apps/live/app/(app)/capabilities/metrics/page.tsx`

### Stage 4: UI & Integration (Weeks 7-8)

**4.1 Capability Invocation Surfaces**
- Dashboard cards showing next recommended actions
- Chat-based: "Sell this deal" as natural language
- Mobile: Quick capability access
- Conversational: Ask AI for capability suggestions

**4.2 Integration with Existing UI**
- Wire into Workbench (primary workspace)
- Add to AI Home (daily recommendations)
- Embed in entity detail pages
- Mobile app integration

**4.3 Admin Management**
- Capability CRUD interface
- Permission policy editor
- AI model configuration
- Monitoring & debugging tools

**Files to create**: 8+ files, ~800 lines

---

## Key Design Decisions

### 1. Role-Aware Execution
**Why**: Same capability behaves differently for manager vs IC
- Managers always see human review for oversight
- ICs can auto-execute low-risk actions
- Data access controls prevent unauthorized access
- **Result**: Capability Fabric adapts to organization structure

### 2. Confidence-Based Escalation
**Why**: AI recommendations have varying reliability
- High confidence (>85%): Auto-execute if permitted
- Medium confidence (70-85%): Human review with recommendation
- Low confidence (<70%): Escalate to human
- **Result**: Balances speed (auto-execute) with safety (human oversight)

### 3. Event-Driven State Machine
**Why**: Observable, auditable workflow execution
- Each state transition emits event (step_completed, human_decision, etc.)
- Listeners can hook into flow for monitoring/alerts
- Full audit trail of execution
- **Result**: Governance requirements met, debugging enabled

### 4. Context Assembly Pattern
**Why**: AI needs full organizational context
- Data layer (entities from Spine)
- Signal layer (risk/opportunity scores)
- Historical layer (past decisions)
- User layer (role/permissions)
- **Result**: AI recommendations are contextual, not generic

### 5. Metrics-Driven Continuous Improvement
**Why**: Capabilities must get better over time
- Track all metrics (success, speed, accuracy, cost)
- Extract patterns (slow caps, high overrides, etc.)
- Feed insights to Twin for model improvement
- Monitor trends to detect regression
- **Result**: Learning loop that improves AI and human decisions

---

## How to Use the Capability Fabric

### As a Developer

1. **Define a Capability**
```typescript
const myCap: CapabilityDefinition = {
  id: 'revenue/upsell-contract',
  name: 'Upsell Contract',
  domain: CapabilityDomain.REVENUE,
  steps: [ /* workflow steps */ ],
  requires_data: [ /* required entities */ ],
  permissions: [ /* role permissions */ ]
};
registry.register(myCap);
```

2. **Execute a Capability**
```typescript
const context = await contextBuilder.build(...);
const invocation = await engine.execute(myInvocation, myCap, context);
const metrics = await metricsService.recordExecution({
  capability_id: myCap.id,
  execution_time_ms: invocation.duration_ms,
  success: invocation.state === 'completed',
  ...
});
```

3. **Render Capability UI**
```tsx
<CapabilityShell
  capabilityId={capability.id}
  state={invocation.state}
  // ... other props
/>
```

### As a Business User

1. **Browse available capabilities** in dashboard
2. **Click to execute** (e.g., "Sell Deal")
3. **Review AI recommendation** if shown
4. **Approve/execute** to trigger workflow
5. **Monitor results** in timeline

---

## Testing & Validation

### Unit Tests
- Registry lookup & validation
- Router decision logic
- Engine state transitions
- Context assembly

### Integration Tests
- Multi-step orchestration
- Parallel execution
- Rollback on failure
- Metrics collection

### E2E Tests
- Full capability execution end-to-end
- UI interactions (approve/reject)
- Data validation
- Output verification

---

## Deployment Checklist

- [ ] All capability definitions registered
- [ ] AI integration tested (real model, not mock)
- [ ] Metrics collection validated
- [ ] Learning insights verified
- [ ] UI shell responsive on mobile/desktop
- [ ] Capabilities dashboard live
- [ ] Admin interfaces functional
- [ ] Monitoring/alerting configured
- [ ] Documentation complete
- [ ] Team trained

---

## References

- **Platform Spec**: `docs/00-20/PLATFORM.md`
- **Operational Spine**: `packages/platform/spine/`
- **Digital Twin**: `packages/platform/twin/`
- **Workflow Examples**: `docs/CAPABILITY_EXECUTION_PATTERNS.md`
