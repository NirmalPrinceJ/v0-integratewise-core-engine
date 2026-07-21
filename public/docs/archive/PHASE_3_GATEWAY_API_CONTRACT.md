# Phase 3: Gateway API Contract


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

The binding contract between all frontends and the IntegrateWise platform. Every HTTP request flows through this contract. No exceptions.

## Core Principle

**Every frontend calls Gateway. Gateway dispatches to platform services. Frontends never reach beyond Gateway.**

```
Frontend
  ↓
Gateway SDK (in frontend)
  ↓
Gateway API (HTTP/gRPC)
  ↓
Platform Services (Spine, Memory, Entity360, Governance, Skills, etc.)
```

---

## Authentication Flow

### 1. Stack Auth Token
User authenticates via Stack Auth (OAuth, email/password).

```
Stack Auth
  ↓
Access Token (JWT)
  ↓
Refresh Token (stored securely)
```

### 2. Gateway Authentication
Frontend sends Stack Auth token to Gateway.

```
POST /gateway/auth/validate
Authorization: Bearer <stack_auth_token>

Response:
{
  "user_id": "usr_123",
  "org_id": "org_456",
  "team_id": "team_789",
  "role": "admin",
  "permissions": ["read", "write", "delete"],
  "gateway_token": "<scoped_gateway_jwt>",
  "expires_at": 1719000000
}
```

Gateway returns a scoped gateway token (not reusable across orgs).

### 3. All Subsequent Requests
Frontend uses gateway token.

```
Authorization: Bearer <gateway_token>
X-Org-ID: org_456
X-Team-ID: team_789
```

---

## Request/Response Envelope

### Standard Request

```json
{
  "namespace": "workspace",
  "action": "listEntities",
  "version": "v1",
  "params": {
    "type": "customer",
    "filters": { "status": "active" },
    "limit": 50,
    "offset": 0
  },
  "context": {
    "request_id": "req_abc123",
    "timestamp": 1719000000,
    "trace_id": "trace_xyz789"
  }
}
```

### Standard Response

```json
{
  "success": true,
  "data": {
    "entities": [
      {
        "id": "ent_123",
        "type": "customer",
        "fields": { "name": "Acme Inc", "status": "active" },
        "version": 1,
        "updated_at": 1719000000
      }
    ],
    "pagination": {
      "limit": 50,
      "offset": 0,
      "total": 1250,
      "has_more": true
    }
  },
  "context": {
    "request_id": "req_abc123",
    "processed_at": 1719000000,
    "latency_ms": 125
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "User does not have permission to read customer entities",
    "details": {
      "required_permission": "entity.customer.read",
      "user_role": "viewer"
    },
    "request_id": "req_abc123",
    "timestamp": 1719000000
  }
}
```

---

## Error Format

All errors follow this structure:

| Code | HTTP | Meaning |
|------|------|---------|
| `INVALID_REQUEST` | 400 | Malformed request |
| `UNAUTHORIZED` | 401 | Invalid or expired auth token |
| `FORBIDDEN` | 403 | Valid auth but insufficient permissions |
| `NOT_FOUND` | 404 | Resource does not exist |
| `CONFLICT` | 409 | Optimistic lock violation or constraint violation |
| `RATE_LIMITED` | 429 | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Downstream service unavailable |

---

## Pagination

All list endpoints support:

```
GET /gateway/workspace/entities?type=customer&limit=50&offset=100

Response includes:
{
  "pagination": {
    "limit": 50,
    "offset": 100,
    "total": 1250,
    "has_more": true,
    "cursor": "cur_next_set_123"  // optional: use instead of offset for stability
  }
}
```

---

## Streaming Responses

For long-running operations:

```
POST /gateway/workspace/search/stream
Content-Type: application/json

Request:
{
  "action": "searchEntities",
  "query": "customer name contains 'tech'",
  "limit": 1000
}

Response (Server-Sent Events):
event: progress
data: {"matched": 100, "total_estimate": 1250}

event: progress
data: {"matched": 500, "total_estimate": 1250}

event: result
data: {"id": "ent_123", "type": "customer", "name": "TechCorp Inc"}

event: result
data: {"id": "ent_124", "type": "customer", "name": "Tech Solutions Ltd"}

event: complete
data: {"total": 642, "duration_ms": 2341}
```

---

## Realtime Events

Frontends subscribe to Spine changes via WebSocket:

```
WebSocket Connection:
wss://gateway.integratewise.com/realtime?token=<gateway_token>

Subscribe:
{
  "action": "subscribe",
  "namespaces": ["workspace", "memory"],
  "filters": {
    "workspace": { "org_id": "org_456", "type": "customer" },
    "memory": { "org_id": "org_456" }
  }
}

Events:
{
  "namespace": "workspace",
  "event": "entity.created",
  "entity_id": "ent_999",
  "type": "customer",
  "changes": { "name": "New Corp", "status": "pending" },
  "version": 1,
  "timestamp": 1719000000
}

{
  "namespace": "workspace",
  "event": "entity.updated",
  "entity_id": "ent_123",
  "type": "customer",
  "changes": { "status": "active" },
  "version": 5,
  "timestamp": 1719000100,
  "previous_version": 4
}

{
  "namespace": "memory",
  "event": "conversation.new",
  "conversation_id": "conv_456",
  "summary": "Customer renewal discussion",
  "participants": ["usr_123", "usr_456"],
  "timestamp": 1719000200
}
```

---

## Versioning

### API Version in Request

```
GET /gateway/v1/workspace/entities
```

vs.

```
GET /gateway/v2/workspace/entities
```

### Capability Versioning

Each namespace can have independent versions:

```
{
  "versions": {
    "workspace": "v1",
    "memory": "v2",
    "twin": "v1",
    "approvals": "v3",
    "integrations": "v1"
  }
}
```

Frontends declare which versions they support at connection:

```
POST /gateway/auth/validate
{
  "stack_auth_token": "...",
  "supported_versions": {
    "workspace": ["v1", "v2"],
    "memory": ["v2"],
    "twin": ["v1"]
  }
}
```

---

## Capability Namespaces

### 1. `workspace`
Core entity management (customers, deals, tickets, documents, etc.)

```
workspace.listEntities()
workspace.getEntity(id)
workspace.createEntity(data)
workspace.updateEntity(id, changes)
workspace.deleteEntity(id)
workspace.search(query)
workspace.bulkWrite(entities)
```

### 2. `memory`
Organizational knowledge and conversations.

```
memory.search(query)
memory.getConversation(id)
memory.listConversations(filters)
memory.createConversation(data)
memory.addMessage(conversation_id, message)
memory.getTimeline(entity_id)
memory.getRelationships(entity_id)
```

### 3. `twin`
AI reasoning and chat.

```
twin.createSession(context)
twin.sendMessage(session_id, message)
twin.getResponse(session_id)
twin.streamResponse(session_id)
twin.explainEntity(entity_id)
twin.draftAction(action_type, entity_id)
twin.executeAction(action_id)
```

### 4. `approvals`
Human governance.

```
approvals.getPendingReviews(user_id)
approvals.submitForReview(action_id, reviewers)
approvals.approve(action_id, comment)
approvals.reject(action_id, comment)
approvals.getAuditTrail(action_id)
approvals.getPolicies(org_id)
```

### 5. `integrations`
External system connections.

```
integrations.listConnected(org_id)
integrations.getConnectionStatus(integration_id)
integrations.authorize(provider)
integrations.revoke(integration_id)
integrations.sync(integration_id)
integrations.getAvailable()
integrations.getCapabilities(provider)
```

### 6. `skills`
Platform capabilities and automations.

```
skills.listAvailable(org_id)
skills.execute(skill_id, params)
skills.schedule(skill_id, params, cron_expression)
skills.getExecutionHistory(skill_id)
skills.create(definition)  // org-specific automation
skills.update(skill_id, definition)
```

### 7. `entity360`
Unified entity view.

```
entity360.get(entity_id)  // full view: fields, relationships, history, governance, memory
entity360.getRelated(entity_id)
entity360.getTimeline(entity_id, limit)
entity360.getGovernance(entity_id)  // approval status, policies, actions pending
```

### 8. `identity`
User and team management.

```
identity.getCurrentUser()
identity.getTeam(team_id)
identity.listTeamMembers(team_id)
identity.getOrganization(org_id)
identity.getPermissions(user_id)
identity.getRoles(org_id)
identity.getRoleDefinition(role_name)
```

---

## Rate Limiting

```
X-RateLimit-Limit: 10000
X-RateLimit-Remaining: 9250
X-RateLimit-Reset: 1719003600

429 Too Many Requests
Retry-After: 60
```

---

## Monitoring & Observability

Every request includes:

```
X-Request-ID: req_abc123
X-Trace-ID: trace_xyz789
X-Span-ID: span_def456
X-User-ID: usr_123
X-Org-ID: org_456
X-Team-ID: team_789
```

Response includes:

```
X-Process-Time: 125ms
X-Cache-Hit: false
X-Latency-Breakdown: gateway=10ms,spine=50ms,entity360=65ms
```

---

## Security Headers

All responses include:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

---

## Backward Compatibility

- Old API versions remain supported for 12 months
- Deprecation notices sent in headers 6 months before removal
- Migration guides published when versions are deprecated
- Gateway maintains adapter layer for old versions

---

## Testing & Development

### Mock Gateway (for offline frontend development)

```
import { createMockGateway } from '@packages/gateway-sdk/mock'

const gateway = createMockGateway({
  fixtures: 'fixtures/production-like-data.json'
})

// Behaves like real Gateway but uses local data
```

### Gateway Sandbox (for integration testing)

```
POST https://sandbox-gateway.integratewise.com/...

Uses in-memory Spine and Memory. Resets on new test.
```

---

## Summary

This contract defines:
- ✅ How frontends authenticate
- ✅ How they request data
- ✅ How they receive responses
- ✅ How they handle errors
- ✅ How they stream and subscribe to realtime events
- ✅ What capabilities are available
- ✅ How to version APIs
- ✅ Security and observability requirements

Every frontend (AI Workspace, Wise Docs, Wise Ops, etc.) follows this contract exactly. No variations, no shortcuts.
