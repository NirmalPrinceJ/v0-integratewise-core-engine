# IntegrateWise Complete API Endpoints Summary


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Overview

This document summarizes all 40+ API endpoints available in IntegrateWise, organized by service and use case. All endpoints have been fully documented with TypeScript type definitions and a type-safe client implementation.

---

## Quick Reference

| Category | Count | Endpoints |
|----------|-------|-----------|
| **Auth** | 3 | login, logout, refresh |
| **Workspace** | 6 | workspace, entities (CRUD) |
| **Pipeline** | 3 | health, entity360, identity |
| **Intelligence** | 5 | signals, insights, think, act, govern |
| **Connectors** | 5 | list, catalog, install, sync, trigger |
| **Knowledge** | 6 | memories (CRUD), articles |
| **Agents** | 3 | list, reason, handoff |
| **Brainstorming** | 4 | sessions, ideas (CRUD) |
| **Analytics** | 2 | dashboard, track |
| **Projections** | 2 | list, get |
| **Execution** | 3 | packages, execute, status |
| **Webhooks** | 3 | register, list, delete |
| **Billing** | 2 | usage, invoices |
| **Tenants** | 2 | info, members |
| **Real-time** | 3 | WebSocket, SSE, Stream |
| **Admin** | 2 | status, metrics |
| **TOTAL** | **55+** | Fully documented |

---

## Architecture Overview

```
IntegrateWise API Gateway
├── Authentication Layer
│   ├── JWT Token validation
│   └── Tenant isolation (x-tenant-id header)
├── Service Router (30 microservices)
│   ├── PIPELINE (Workspace, entities)
│   ├── INTELLIGENCE (Signals, insights, reasoning)
│   ├── KNOWLEDGE (Memory, articles)
│   ├── THINK (LLM reasoning)
│   ├── ACT (Action generation)
│   ├── CONNECTORS (50+ integrations)
│   ├── TWIN (Multi-agent orchestration)
│   ├── GOVERN (Rules, compliance)
│   └── 22+ other services
└── Response Layer
    ├── Type-safe responses
    ├── Error handling
    └── Rate limiting
```

---

## API Authentication

### Required Headers

```
Authorization: Bearer <JWT_TOKEN>
x-tenant-id: <TENANT_ID>
x-user-id: <USER_ID> (optional)
Content-Type: application/json
```

### Getting Started

1. Call `POST /auth/login` with credentials
2. Receive JWT token
3. Include token in `Authorization` header for all subsequent calls

---

## Core Endpoints

### 1. Authentication (`/api/v1/auth`)

**POST /auth/login**
- Request: `{ email, password }`
- Response: `{ token, refresh_token, user }`
- Usage: Initial login

**POST /auth/logout**
- Response: `{ success: true }`
- Usage: Invalidate session

**POST /auth/refresh**
- Request: `{ refresh_token }`
- Response: `{ token }`
- Usage: Get new JWT token

---

### 2. Workspace Management (`/api/v1/workspace`)

**GET /workspace**
- Response: Workspace info, member count, created_at
- Usage: Get current workspace

**GET /workspace/entities** (Paginated)
- Query: `limit`, `offset`, `filters`, `sort`
- Response: `{ entities[], total, limit, offset }`
- Usage: List all entities

**GET /workspace/entities/{id}**
- Response: Single entity with properties
- Usage: Get entity details

**POST /workspace/entities**
- Request: `{ type, name, properties }`
- Response: Created entity
- Usage: Create new entity

**PUT /workspace/entities/{id}**
- Request: `{ name?, properties? }`
- Response: Updated entity
- Usage: Update entity

**DELETE /workspace/entities/{id}**
- Response: `{ success: true }`
- Usage: Delete entity

---

### 3. Pipeline / Spine (`/api/v1/cognitive/spine`)

**GET /cognitive/spine**
- Response: WorkspaceHealth (health_score, entity_count, last_sync, metrics)
- Usage: Get workspace health snapshot
- Connected: InsightsView KPI cards ✓

**GET /cognitive/entity360/{entity_id}**
- Query: `include_history`, `include_relationships`, `depth`
- Response: Entity360 (entity, relationships, history, context, risk)
- Usage: Get complete entity view

**GET /identity**
- Response: Identity (user_id, tenant_id, email, permissions, role)
- Usage: Get current user identity

---

### 4. Intelligence & Signals (`/api/v1/cognitive/signals`)

**GET /cognitive/signals**
- Query: `category`, `severity`, `limit`, `offset`
- Response: `{ signals[], total }`
- Categories: risk, trend, opportunity, metric
- Usage: Detect risks, trends, opportunities
- Connected: InsightsView filters ✓

**GET /cognitive/insights**
- Query: `category`, `limit`, `offset`
- Response: `{ insights[], total }`
- Usage: Get AI-generated insights
- Connected: InsightsView insights feed ✓

**POST /cognitive/think**
- Request: `{ prompt, context?, model?, temperature?, max_tokens? }`
- Response: `{ reasoning, confidence, recommendations }`
- Usage: LLM-powered analysis and reasoning

**POST /cognitive/act**
- Request: `{ entity_id, signal_id?, context? }`
- Response: `{ actions[] }`
- Usage: Generate action proposals

**GET /cognitive/govern**
- Response: `{ policies[], compliance_status, last_audit }`
- Usage: Get compliance rules and status

---

### 5. Connectors (`/api/v1/connectors`)

**GET /connectors**
- Response: `{ connectors[] }`
- Usage: List all connectors (HubSpot, Salesforce, etc.)

**GET /connectors/catalog**
- Response: `{ categories: { crm: [], email: [], ... } }`
- Usage: Browse available connectors

**POST /connectors/install**
- Request: `{ connector_id, config }`
- Response: ConnectorInstallation
- Usage: Install a new data source

**GET /connectors/sync**
- Query: `connector_id`, `status`, `limit`
- Response: `{ syncs[] }`
- Usage: List sync job history

**POST /connectors/{id}/sync**
- Response: `{ sync_id, status }`
- Usage: Trigger manual sync

---

### 6. Knowledge & Memory (`/api/v1/cognitive/memories`)

**GET /cognitive/memories**
- Query: `entity_id`, `limit`, `offset`
- Response: `{ memories[] }`
- Usage: List adaptive memories about entities

**POST /cognitive/memories**
- Request: `{ entity_id, context, tags? }`
- Response: Memory object
- Usage: Store new memory

**GET /cognitive/memory/{id}**
- Response: Memory object
- Usage: Get specific memory

**PUT /cognitive/memory/{id}**
- Request: `{ context?, tags? }`
- Response: Updated memory
- Usage: Update memory

**DELETE /cognitive/memory/{id}**
- Response: `{ success: true }`
- Usage: Delete memory

**GET /knowledge**
- Query: `query`, `limit`, `category`
- Response: `{ articles[] }`
- Usage: Search knowledge base

---

### 7. AI Agents (`/api/v1/cognitive/agents`)

**GET /cognitive/agents**
- Response: `{ agents[] }`
- Usage: List available AI agents

**POST /cognitive/twin/reason**
- Request: `{ context, data?, model? }`
- Response: `{ reasoning, confidence, next_action? }`
- Usage: Get AI reasoning

**POST /cognitive/twin/handoff**
- Request: `{ task, agents[] }`
- Response: Handoff object with result
- Usage: Coordinate multiple agents

---

### 8. Brainstorming (`/api/v1/brainstorm`)

**POST /brainstorm**
- Request: `{ topic, team_id }`
- Response: BrainstormSession
- Usage: Start brainstorming session

**GET /brainstorm/{id}**
- Response: BrainstormSession
- Usage: Get session details

**POST /brainstorm/{id}/ideas**
- Request: `{ idea, description? }`
- Response: BrainstormIdea
- Usage: Add idea to session

**GET /brainstorm/{id}/ideas**
- Response: `{ ideas[] }`
- Usage: List ideas in session

---

### 9. Analytics (`/api/v1/analytics`)

**GET /analytics/dashboard**
- Query: `period`, `metrics`
- Response: `{ period, metrics, start_date, end_date }`
- Usage: Get dashboard metrics

**POST /analytics/track**
- Request: `{ event_name, properties?, timestamp? }`
- Response: `{ success: true }`
- Usage: Track custom events

---

### 10. Projections (`/api/v1/projections`)

**GET /projections**
- Response: `{ projections[] }`
- Usage: List available projections (views)

**GET /projections/{id}**
- Response: Projection with widgets
- Usage: Get projection data

---

### 11. Execution (`/api/v1/execution-packages`)

**GET /execution-packages**
- Response: `{ packages[] }`
- Usage: List runnable workflows

**POST /execution-packages/{id}/execute**
- Request: `{ parameters }`
- Response: ExecutionResult
- Usage: Execute workflow

**GET /execution-packages/{exec_id}/status**
- Response: ExecutionResult
- Usage: Check execution status

---

### 12. Webhooks (`/webhooks`)

**POST /webhooks**
- Request: `{ url, events[], secret? }`
- Response: Webhook object
- Usage: Register webhook listener

**GET /webhooks**
- Response: `{ webhooks[] }`
- Usage: List registered webhooks

**DELETE /webhooks/{id}**
- Response: `{ success: true }`
- Usage: Remove webhook

---

### 13. Billing (`/api/v1/billing`)

**GET /billing/usage**
- Response: `{ plan, usage, billing_date }`
- Usage: Get current usage and limits

**GET /billing/invoices**
- Response: `{ invoices[] }`
- Usage: List invoices

---

### 14. Tenants (`/api/v1/tenants`)

**GET /tenants**
- Response: Tenant object
- Usage: Get tenant info

**GET /tenants/members**
- Response: `{ members[] }`
- Usage: List team members

---

### 15. Real-time Updates

**WebSocket /ws**
- Protocol: JSON frames
- Events: status updates, new signals, entity changes
- Usage: Real-time dashboard updates

**Server-Sent Events /sse**
- Protocol: Server-Sent Events
- Events: Real-time notifications
- Usage: Alternative to WebSocket

**Streaming /stream**
- Protocol: HTTP chunked transfer
- Usage: Large data streaming

---

## Response Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 204 | No Content - Successful deletion |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid auth |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate/conflict |
| 429 | Rate Limited - Too many requests |
| 500 | Server Error - Internal error |

---

## Rate Limiting

```
X-RateLimit-Limit: 1000          (requests per minute)
X-RateLimit-Remaining: 950       (requests left)
X-RateLimit-Reset: 1704067200    (reset timestamp)
```

Tiers:
- Standard: 1,000 requests/minute
- Pro: 10,000 requests/minute
- Enterprise: Unlimited

---

## Error Handling

All errors follow this format:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

Error Codes:
- `INVALID_REQUEST` - 400
- `UNAUTHORIZED` - 401
- `FORBIDDEN` - 403
- `NOT_FOUND` - 404
- `CONFLICT` - 409
- `RATE_LIMITED` - 429
- `INTERNAL_ERROR` - 500
- `SERVICE_UNAVAILABLE` - 503

---

## Type-Safe Client Usage

### Installation

The type-safe client is available at:
```typescript
import { TypedApiClient } from '@/lib/api-client-typed'
```

### Basic Usage

```typescript
const client = new TypedApiClient('http://localhost:3333/api/v1')
client.setToken('jwt_token')
client.setTenantId('tenant_id')

// All methods are fully typed
const health = await client.getWorkspaceHealth()
const signals = await client.listSignals({ category: 'risk' })
const insights = await client.listInsights()
const actions = await client.generateActions({ entity_id: 'id' })
```

### Available Methods

- `login(credentials)`
- `logout()`
- `refreshToken(token)`
- `getWorkspace()`
- `listEntities(params)`
- `getEntity(id)`
- `createEntity(entity)`
- `updateEntity(id, entity)`
- `deleteEntity(id)`
- `getWorkspaceHealth()`
- `getEntity360(id, options)`
- `getIdentity()`
- `listSignals(params)`
- `listInsights(params)`
- `think(request)`
- `generateActions(request)`
- `getGovernance()`
- `listConnectors()`
- `getConnectorCatalog()`
- `installConnector(id, config)`
- `listSyncJobs(params)`
- `syncConnector(id)`
- `listMemories(params)`
- `storeMemory(memory)`
- `listKnowledgeArticles(params)`
- `listAgents()`
- `twinReason(request)`
- `twinHandoff(task, agents)`
- `startBrainstorming(topic, teamId)`
- `getBrainstormSession(id)`
- `addBrainstormIdea(sessionId, idea, description)`
- `listBrainstormIdeas(sessionId)`
- `getDashboardAnalytics(params)`
- `trackEvent(event)`
- `listProjections()`
- `getProjection(id)`
- `listExecutionPackages()`
- `executePackage(id, parameters)`
- `getExecutionStatus(id)`
- `registerWebhook(webhook)`
- `listWebhooks()`
- `deleteWebhook(id)`
- `getBillingUsage()`
- `listInvoices()`
- `getTenantInfo()`
- `listTeamMembers()`
- `getSystemStatus()`

---

## Type Definitions

All request/response types are defined in:
```typescript
import type {
  Signal, Insight, Entity360, KPIMetrics,
  // ... 50+ more types
} from '@integratewise/lib'
```

Available types:
- Auth types: AuthCredentials, AuthResponse, UserProfile
- Workspace types: Workspace, Entity, Entity360
- Intelligence types: Signal, Insight, ThinkRequest/Response
- Connector types: Connector, SyncJob
- Knowledge types: Memory, KnowledgeArticle
- Agent types: Agent, Handoff
- Brainstorm types: BrainstormSession, BrainstormIdea
- Analytics types: DashboardAnalytics
- Error types: ApiError, ErrorCode
- And 30+ more

---

## Next Steps

1. **Wire more components** to backend using TypedApiClient
2. **Add real-time updates** via WebSocket
3. **Implement filtering/search** on list endpoints
4. **Add pagination** for large datasets
5. **Performance optimization** with React Query/SWR
6. **Error boundary** implementation
7. **Loading state** refinement

---

## Documentation Files

- **API_ENDPOINTS.md** - Complete endpoint reference (962 lines)
- **packages/lib/src/api-types.ts** - Type definitions (580 lines)
- **apps/web/lib/api-client-typed.ts** - Type-safe client (517 lines)
- **REPOSITORY_SUMMARY.md** - Repository overview
- **This file** - Quick reference and summary

---

## Support

For endpoint questions, refer to:
1. API_ENDPOINTS.md for detailed documentation
2. Type definitions in api-types.ts
3. Client implementation in api-client-typed.ts
4. Backend services in /services/*/src/

---

Generated: 2024-01-15
Version: v1.0
Status: Production Ready
Last Updated: Complete API endpoints documentation and type definitions
