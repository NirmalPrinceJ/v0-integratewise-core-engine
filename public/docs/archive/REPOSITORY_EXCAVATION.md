# IntegrateWise Repository: Complete Excavation Report


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## 🔍 System Overview

**Repository:** NirmalPrinceJ/integratewise-live  
**Date:** December 2024  
**Architecture:** Monorepo (turborepo) with 40+ services and 20+ packages  
**Runtime:** 100% Cloudflare (Workers, Durable Objects, D1, KV, Queues)  

---

## 📊 Repository Structure

```
integratewise-live/
├── apps/                          # User-facing applications
│   ├── web/                       # Main web application (React/Next)
│   ├── desktop/                   # Electron desktop app
│   ├── mobile/                    # Mobile application
│   └── web.old/                   # Legacy web app
│
├── services/                      # 40+ Cloudflare Workers services
│   ├── twin-orchestrator/         # Agent Lee (Twin Orchestrator) ⭐
│   ├── iw-agent-runtime/          # Agent runtime (with Twin Agent)
│   ├── intelligence/              # Specialized agents
│   ├── pipeline/                  # Task orchestration
│   ├── mcp-connector/             # MCP protocol server
│   ├── continuity/                # Memory & state persistence
│   ├── connector/                 # Integration connectors
│   ├── gateway/                   # API gateway
│   ├── knowledge/                 # Knowledge base system
│   ├── hermes/                    # Event streaming
│   ├── capability-resolver/       # Agent capability discovery
│   ├── agent-registry/            # Agent registration
│   └── 25+ more specialized services
│
├── packages/                      # 20+ shared libraries
│   ├── adk/                       # Agent Development Kit ⭐
│   ├── db/                        # Database schemas
│   ├── lib/                       # Shared utilities
│   ├── types/                     # Type definitions
│   ├── hermes-spine-memory/       # Spine/Memory system
│   ├── integratewise-mcp-tool-connector/ # MCP tools
│   ├── config/                    # Configuration
│   ├── rbac/                      # Role-based access control
│   ├── tenancy/                   # Multi-tenancy
│   └── 11+ more packages
│
├── docs/                          # Documentation
│   ├── architecture/
│   ├── internal/
│   ├── operations/
│   ├── tech/
│   └── public/
│
├── infra/                         # Infrastructure code
│   ├── cloudflare/                # Cloudflare config
│   └── vercel/                    # Vercel config
│
└── tests/                         # 6 test suites
    ├── e2e/
    ├── functional/
    ├── playwright/
    ├── edge/
    ├── doctrine/
    └── thesis/
```

---

## 🤖 AGENT LEE (THE TWIN)

### Location: `services/iw-agent-runtime/src/twin-agent.ts`

**What is Agent Lee?**

Agent Lee is the **personal orchestrator and adaptive mind** for each IntegrateWise user. Not a replaceable chatbot—a persistent operational system that:

1. **Synthesizes** context from Spine, Memory, and sessions
2. **Reasons** about decisions and operational patterns
3. **Proposes** structured recommendations with confidence scores
4. **Learns** from outcomes and updates personal profile
5. **Coaches** users through complex decisions

### Twin System Prompt (Core Loop)

```typescript
// From line 19-43
You are the personal IntegrateWise Twin for the user — the adaptive personal mind, 
orchestrator, and operator for this user's operational continuity system.

CORE IDENTITY & SELF-REALISATION LOOP (run before every response):
  1. Observe    → Retrieve context from Spine/Memory/Sessions
  2. Reflect    → Synthesize patterns
  3. Learn      → Update learned_profile
  4. Propose    → Generate decision with confidence
  5. Coach      → Explain & flag approval needs
```

### Twin State (Learned Profile)

```typescript
// From buildLearnedProfileBlock (line 63-80)
learned_profile: {
  communication_style: "concise, strategic",
  focus_priorities: ["high-leverage decisions", "strategic planning"],
  recent_lessons: [
    "Accounts > 100K are qualified leads",
    "CSM approval indicates good qualification"
  ],
  success_patterns: [
    "High-value + CSM approval → pursue",
    "Industry: Tech = 2x conversion"
  ],
  risk_tolerance_signals: ["Prefer data-driven decisions"],
  profile_version: number  // Increments on updates
}
```

### Twin Capabilities

```typescript
// From line 1
import { Agent, callable } from "agents";
```

Agent Lee is built on the `agents` library with:
- **Capabilities:** orchestrate, reason, propose, learn, coach
- **Voice Integration:** Cloudflare Workers AI (STT/TTS)
- **Memory:** Durable Objects + D1 (persistent)
- **State:** TenantBrainDO (per-tenant state machine)

---

## 🏗️ Twin Orchestrator Service

### Location: `services/twin-orchestrator/src/`

**Modules:**
```
twin-orchestrator/
├── index.ts           # Main orchestration entry point (15KB)
├── context.ts         # Context assembly (4KB)
├── reasoning.ts       # Reasoning logic (3KB)
├── proposals.ts       # Proposal generation (2.5KB)
├── coordination.ts    # Multi-agent coordination (2.5KB)
├── state.ts           # State management (1.6KB)
└── types.ts           # TypeScript types (1.6KB)
```

**Key Responsibilities:**
1. Coordinate work across specialized agents
2. Maintain persistent Twin state
3. Manage learned profiles
4. Route tasks to appropriate agents
5. Aggregate results and propose decisions

---

## 📚 Agent Development Kit (ADK)

### Location: `packages/adk/src/`

**Purpose:** Framework for building and composing agents

**Components:**
```typescript
// agent-registry.ts - Register agents with capabilities
interface AgentCapability {
  name: string;
  description: string;
  inputSchema: JSONSchema;
  outputSchema: JSONSchema;
}

// registry.ts - Query agents by capability
queryAgentsByCapability(capability: string): Agent[]

// resolver.ts - Resolve which agent should handle a task
getAgentForTask(task: Task): Agent

// spine-cache.ts - Cache agent discovery results
// types.ts - Shared TypeScript interfaces
```

---

## 🧠 Ecosystem (Twin Runtime)

### Location: `services/iw-agent-runtime/src/ecosystem/`

**Files:**
```
ecosystem/
├── continuity.ts          # Continuity context assembly
├── memory-pipeline.ts     # Shared memory system
├── index.ts               # Ecosystem exports
└── (more specialized modules)
```

### Memory Pipeline

```typescript
// Shared, cross-agent memory with decay
saveMemory(content: string, scope: 'global' | 'tenant' | 'user')
queryMemory(filters: {tags, scope}, limit: number)
// Decay: score *= exp(-age_days / 7)
// Promotion: access_count boosting
```

### Continuity Context

```typescript
// Assembly of context for Twin decisions
assembleContinuity(tenantId: string, userId: string): {
  spine_data: {},        // Facts from Spine
  shared_memory: [],     // Global learnings
  session_history: [],   // Recent interactions
  learned_profile: {}    // Twin's evolution
}
```

---

## 🗄️ Tenant Brain Durable Object

### Location: `services/iw-agent-runtime/src/tenant-brain-do.ts`

**What:** Per-tenant persistent state machine (Cloudflare Durable Object)

**Stores:**
```typescript
{
  tenant_id: string;
  learned_profile: {
    recent_lessons: string[];
    success_patterns: string[];
    risk_tolerance_signals: string[];
  };
  session_state: {
    current_context: {};
    active_proposals: [];
    pending_approvals: [];
  };
  signal_queue: [];  // Governance signals
  last_updated: Date;
}
```

**Lifecycle:**
1. Twin detects change
2. Emits signal via `emitTriageInput`
3. Signal goes through governance pipeline
4. State updated in Durable Object
5. Learned profile evolves

---

## 🔌 Key Service Integrations

### MCP Connector
**Location:** `services/mcp-connector/src/`

Exposes Agent Lee's capabilities as MCP tools:
- `agent.orchestrate` - Coordinate multi-agent workflows
- `agent.reason` - Synthesize decisions
- `agent.propose` - Generate recommendations
- `agent.learn` - Update from outcomes
- `agent.coach` - Explain decisions

### Pipeline Service
**Location:** `services/pipeline/src/`

Routes work to specialized agents:
1. Task submitted
2. Registry queries for matching agent
3. Agent executes
4. Result captured in Spine
5. Memory updated
6. Twin learns

### Intelligence Service
**Location:** `services/intelligence/src/`

Specialized agents:
- Lead Scoring Agent
- Qualification Agent
- Analytics Agent
- Triage Agent
- Forecasting Agent

### Hermes (Event Streaming)
**Location:** `services/hermes/src/`

Event bus for agent communication:
- Agent discovery events
- Proposal events
- Learning signals
- State changes

---

## 📡 Spine (Canonical Truth)

### What is Spine?

Central event log + database:
```
Spine = D1 Database + Event Stream
```

**Stores:**
- Events (all agent actions)
- Decisions (with reasoning)
- Outcomes (results of decisions)
- Relationships (entity links)
- Audit trail (immutable history)

**Spine Query Language:**
```typescript
// Example from Twin
const leadData = await spineQuery(db, 'lead', '123');
const relatedDecisions = await spineQuery(db, 'decision', {
  entity_id: '123',
  type: 'qualification'
});
```

---

## 🔄 Data Flow: User Query → Twin Response

```
User: "Should we pursue lead #123?"
  ↓
[1] Twin ACTIVATES
    → evaluateActivation() checks eligibility
    → Loads TenantBrainDO state
  ↓
[2] Twin OBSERVES (retrieveContext)
    → Query Spine for lead data
    → Query Memory for patterns
    → Load learned_profile
  ↓
[3] Twin REFLECTS (reasoning.ts)
    → Synthesize: lead + memory + profile
    → Calculate confidence score
  ↓
[4] Twin COORDINATES (coordination.ts)
    → Query registry for specialized agents
    → Send requests to CSM Agent, Analytics Agent, etc.
  ↓
[5] Twin SYNTHESIZES RESULTS
    → Combine responses into reasoning
    → Apply learned patterns
  ↓
[6] Twin PROPOSES (proposals.ts)
    → Generate recommendation with confidence
    → Flag approval needs
    → Create governance signal
  ↓
[7] Signal EMITTED (emitTriageInput)
    → Signal → Governance Pipeline
    → Update TenantBrainDO
    → Spine records decision event
  ↓
[8] Memory UPDATES (memory-pipeline.ts)
    → Save learning: "Lead #123 qualified via CSM + value"
    → Add to global memory
    → Update decay scores
  ↓
[9] Profile EVOLVES
    → Add recent_lesson
    → Update success_pattern
    → Increment profile_version
  ↓
User RECEIVES:
  {
    "proposal": "PURSUE lead #123",
    "confidence": 0.88,
    "reasoning": "...",
    "agents_consulted": [...],
    "supporting_data": {...},
    "next_step": "Awaiting your approval"
  }
```

---

## 🛠️ Building Blocks

### 1. Agents Library
```typescript
import { Agent, callable } from "agents";

// Base class for all agents
const twinAgent = new Agent({
  name: "Lee Twin",
  model: "claude-3.5-sonnet",
  instructions: buildTwinSystemPrompt(...)
});

// Voice capability
const VoiceTwin = withVoice(Agent);
```

### 2. Cloudflare Platform
```typescript
// D1 (Database)
const db = env.DB;  // SQL database binding

// KV (Cache)
const cache = env.CACHE;  // Key-value store

// Durable Objects (State)
const tenantBrain = env.TENANT_BRAIN_DO;  // State machine

// Workers AI
const ai = new Ai(env.AI);  // LLM + voice models

// Service Bindings
const mcp = env.MCP_CONNECTOR;  // Other workers
const pipeline = env.PIPELINE;
const continuity = env.CONTINUITY;
```

### 3. Capability Contract
**Location:** `services/iw-agent-runtime/src/capability-contract.ts`

Defines what Twin can do:
```typescript
const CAPABILITY_CONTRACT = {
  orchestrate: {
    input: { task: string, context: object },
    output: { agent_id: string, result: object }
  },
  reason: {
    input: { facts: [], patterns: [] },
    output: { synthesis: string, confidence: number }
  },
  propose: {
    input: { synthesis: string },
    output: { recommendation: string, confidence: number, approval_needed: boolean }
  },
  learn: {
    input: { outcome: object },
    output: { lessons_updated: number, profile_version: number }
  }
};
```

---

## 📦 Key Packages

### `packages/hermes-spine-memory/`
Spine + Memory system

### `packages/integratewise-mcp-tool-connector/`
MCP tool integration

### `packages/types/`
Shared TypeScript interfaces

### `packages/config/`
Environment configuration

### `packages/db/`
Database schema + migrations

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│      Cloudflare Global Edge Network              │
├─────────────────────────────────────────────────┤
│                                                 │
│  Workers (iw-agent-runtime, twin-orchestrator) │
│  ├─ Twin Agent (Lee)                           │
│  ├─ Specialized Agents                         │
│  └─ MCP Server                                  │
│           ↓↓↓                                    │
│  ┌─────────────────────────────────┐           │
│  │  Durable Objects                │           │
│  │  ├─ TenantBrainDO (state)       │           │
│  │  ├─ SharedMemoryDO (memory)     │           │
│  │  └─ PipelineCoordinatorDO       │           │
│  └─────────────────────────────────┘           │
│           ↓↓↓                                    │
│  ┌─────────────────────────────────┐           │
│  │  D1 (PostgreSQL)                │           │
│  │  ├─ Spine (events)              │           │
│  │  ├─ agent_registry              │           │
│  │  ├─ communication_log           │           │
│  │  └─ tenant_state                │           │
│  └─────────────────────────────────┘           │
│           ↓↓↓                                    │
│  ┌─────────────────────────────────┐           │
│  │  KV Namespace                   │           │
│  │  ├─ agent_msg:*                 │           │
│  │  ├─ tool_registry:*             │           │
│  │  └─ cache:*                     │           │
│  └─────────────────────────────────┘           │
│           ↓↓↓                                    │
│  ┌─────────────────────────────────┐           │
│  │  Queues                         │           │
│  │  ├─ agent_tasks                 │           │
│  │  ├─ signals                     │           │
│  │  └─ proposals                   │           │
│  └─────────────────────────────────┘           │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 📊 Services Summary

| Service | Purpose | Tech |
|---------|---------|------|
| **twin-orchestrator** | Agent coordination | CF Worker |
| **iw-agent-runtime** | Twin Agent runtime | CF Worker + VO |
| **mcp-connector** | MCP protocol | CF Worker |
| **pipeline** | Task routing | CF Worker |
| **intelligence** | Specialized agents | CF Worker |
| **continuity** | Memory persistence | CF Worker + VO |
| **connector** | Integration connectors | CF Worker |
| **gateway** | API gateway | CF Worker |
| **knowledge** | Knowledge base | CF Worker |
| **hermes** | Event streaming | CF Worker |
| **capability-resolver** | Agent capability discovery | CF Worker |
| **agent-registry** | Agent registration | CF Worker + D1 |

---

## 🎓 Learning Path

### Level 1: Understanding Twin Architecture (1 hour)
1. Read `twin-agent.ts` (system prompt + core loop)
2. Review `twin-orchestrator/index.ts` (coordination logic)
3. Understand `TenantBrainDO` (persistent state)

### Level 2: Agent Communication (2 hours)
1. Read `packages/adk/` (agent capabilities)
2. Study `services/mcp-connector/` (MCP protocol)
3. Understand inter-agent messaging

### Level 3: Memory & Learning (2 hours)
1. Review `memory-pipeline.ts` (decay algorithm)
2. Study `continuity/` (context assembly)
3. Understand learned profile evolution

### Level 4: Full System (4+ hours)
1. Trace full data flow (user query → Twin response)
2. Study all 40 services
3. Understand Cloudflare platform integration

---

## 🔗 Key Files to Review

| File | Purpose | Lines |
|------|---------|-------|
| `services/iw-agent-runtime/src/twin-agent.ts` | Twin Agent core | 600+ |
| `services/twin-orchestrator/src/index.ts` | Orchestration | 400+ |
| `services/iw-agent-runtime/src/tenant-brain-do.ts` | State management | 300+ |
| `packages/adk/src/registry.ts` | Agent registry | 200+ |
| `services/mcp-connector/src/mcp-server.ts` | MCP server | 300+ |
| `services/iw-agent-runtime/src/ecosystem/memory-pipeline.ts` | Memory system | 200+ |

---

## ✨ System Highlights

1. **100% Cloudflare** - No external infrastructure needed
2. **Persistent Twin** - State machine per tenant
3. **Learned Profile** - Twin evolves from interactions
4. **Multi-Agent Network** - Specialized agents coordinate
5. **Governance Pipeline** - All decisions tracked
6. **Complete Audit Trail** - Spine records everything
7. **MCP Protocol** - External integration via standard protocol
8. **Voice-Enabled** - Cloudflare Workers AI integration

---

## 🚀 Next Steps

1. **Understand Twin** - Read `twin-agent.ts` system prompt
2. **Study Orchestration** - Review `twin-orchestrator/` logic
3. **Learn Memory** - Study decay + promotion algorithm
4. **Explore Agents** - Review ADK and agent capabilities
5. **Map Services** - Understand 40-service architecture
6. **Deploy** - Use provided deployment scripts

---

**Status:** Full system mapped and documented.

