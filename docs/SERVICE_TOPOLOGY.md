# Service Topology — Who Handles What

The Gateway is the single entry point. It routes requests to downstream services via Cloudflare Workers service bindings.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT                                  │
│            (Browser, Mobile, Third-party App)                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      GATEWAY (BFF)                              │
│              gateway.dev.integratewise.ai                       │
├─────────────────────────────────────────────────────────────────┤
│  • JWT Validation        • Tenant Resolution                    │
│  • Rate Limiting         • CORS Policy                          │
│  • Request Routing       • Circuit Breaker                      │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  INTERNAL     │   │   DOWNSTREAM  │   │   DOWNSTREAM  │
│  HANDLERS     │   │   SERVICES    │   │   SERVICES    │
└───────────────┘   └───────────────┘   └───────────────┘
```

---

## Service Mapping

### Internal Handlers (Gateway Process)

These are handled directly by the Gateway Worker:

| Target | Routes | Handler |
|--------|--------|---------|
| `INTERNAL_AUTH` | `/api/v1/auth/*` | `routeAuthRequest()` |
| `INTERNAL_ADMIN` | `/admin/*` | `routeAdminRequest()` |
| `INTERNAL_SUPPORT` | `/api/v1/public/*`, `/api/v1/support/*` | `routeSupportRequest()` |
| `INTERNAL_BILLING` | `/api/v1/billing/*` | `routeBillingRequest()` |
| `INTERNAL_PROJECTIONS` | `/api/v1/workspace/projection/*`, `/api/v1/workspace/entities` | `routeProjectionRequest()` |
| `INTERNAL_TENANTS` | `/api/v1/tenants/*` | `routeTenantsRequest()` |
| `INTERNAL_SPINE` | `/api/v1/workspace/initialize-spine`, `/api/v1/workspace/connectors`, `/api/v1/workspace/spine-config`, `/api/v1/workspace/dashboard`, `/api/v1/workspace/profile`, `/api/v1/workspace/progress` | `routeWorkspaceSpineRequest()` |

---

### Spine (Adaptive Spine)

The Spine is the canonical operational memory layer. It's NOT a database — it's the single source of truth for all workspace data.

| Component | Location | Description |
|-----------|----------|-------------|
| **Spine Schema** | D1 `tenant_spine_config` | Domain, industry, department, connectors |
| **Spine Entities** | D1 `spine_entities` | All canonical entities (accounts, contacts, deals, etc.) |
| **Spine Events** | D1 `spine_events` | Activity log and audit trail |
| **Projection Engine** | `packages/projection-engine` | Composes SharedWorkbench from Spine |

**Spine Endpoints (Internal to Gateway):**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/workspace/initialize-spine` | Initialize Spine schema |
| `GET` | `/api/v1/workspace/connectors` | Get connected connectors |
| `GET` | `/api/v1/workspace/spine-config` | Get Spine configuration |
| `GET` | `/api/v1/workspace/dashboard` | Get dashboard data |
| `GET` | `/api/v1/workspace/profile` | Get workspace profile |
| `GET` | `/api/v1/workspace/progress` | Get sync progress |
| `GET` | `/api/v1/workspace/projection/:department` | Compose SharedWorkbench |
| `GET` | `/api/v1/workspace/entities` | Query entities |
| `GET` | `/api/v1/workspace/readiness` | Get readiness scores |

**Spine Data Flow:**

```
External Systems → Connector → Loader → Pipeline → Spine (D1)
                                                     │
                                                     ▼
                                              Projection Engine
                                                     │
                                                     ▼
                                              SharedWorkbench
                                                     │
                                                     ▼
                                                  Gateway
                                                     │
                                                     ▼
                                                  Client
```

---

### Downstream Services (Service Bindings)

These are separate Cloudflare Workers connected via service bindings:

| Binding | Service | Handles | Endpoints |
|---------|---------|---------|-----------|
| `CONNECTOR` | `integratewise-connector` | Connector operations | `/api/v1/workspace/connectors/*`, `/api/v1/workspace/register-connector` |
| `CONNECTOR_SYNC` | `integratewise-connector-sync` | Sync operations | `/api/v1/workspace/connectors/nango-session` |
| `PIPELINE` | `integratewise-pipeline` | Data processing | `/api/v1/pipeline/*`, `/api/v1/loader/*` |
| `INTELLIGENCE` | `integratewise-intelligence` | AI/ML operations | `/api/v1/capabilities/*`, `/api/v1/brainstorm`, `/api/v1/cognitive/*` |
| `KNOWLEDGE` | `integratewise-knowledge` | Knowledge base | `/api/v1/knowledge/*` |
| `BFF` | `integratewise-bff` | Backend for Frontend | `/api/v1/workbench/*` |
| `AGENT_RUNTIME` | `iw-agent-runtime` | Agent operations | `/api/v1/agent/*`, `/api/v1/twin/*` |
| `L2` | `integratewise-l2` | L2 API layer | `/api/v1/l2/*` |
| `WEBHOOK_INGRESS` | `integratewise-webhook-ingress` | Webhook ingestion | `/webhooks/*` |
| `HUB_CONTROLLER` | `hub-controller-api` | Hub operations | `/api/v1/hub/*` |
| `ADMIN` | `integratewise-admin` | Admin operations | `/admin/*` |
| `BILLING` | `integratewise-billing` | Billing operations | `/api/v1/billing/*` |
| `TENANTS` | `integratewise-tenants` | Tenant management | `/api/v1/tenants/*` |

---

## Request Flow Examples

### 1. Get Workbench

```
Client → Gateway → INTERNAL_PROJECTIONS → Projection Engine → Response
```

```
GET /api/v1/workspace/projection/SALES
  ↓
Gateway validates JWT, resolves tenant
  ↓
routeProjectionRequest() handles internally
  ↓
ProjectionEngine.compose() assembles SharedWorkbench
  ↓
Returns SharedWorkbench JSON
```

---

### 2. List Connectors

```
Client → Gateway → CONNECTOR Service → Response
```

```
GET /api/v1/workspace/connectors/catalog
  ↓
Gateway validates JWT, resolves tenant
  ↓
routeConnectorRequest() forwards to CONNECTOR binding
  ↓
integratewise-connector Worker handles request
  ↓
Returns connector catalog
```

---

### 3. Execute Capability

```
Client → Gateway → INTELLIGENCE Service → Response
```

```
POST /api/v1/capabilities/resolve
  ↓
Gateway validates JWT, resolves tenant
  ↓
routeIntelligenceRequest() forwards to INTELLIGENCE binding
  ↓
integratewise-intelligence Worker executes capability
  ↓
Returns capability result
```

---

### 4. OAuth Flow

```
Client → Gateway → CONNECTOR_SYNC Service → Nango → Response
```

```
POST /api/v1/integrations/salesforce/authorize
  ↓
Gateway validates JWT, resolves tenant
  ↓
routeConnectorRequest() forwards to CONNECTOR binding
  ↓
integratewise-connector starts OAuth via Nango
  ↓
Returns auth_url for redirect
```

---

### 5. Webhook Ingress

```
External Service → Gateway → WEBHOOK_INGRESS Service → Pipeline
```

```
POST /webhooks/stripe
  ↓
Gateway verifies webhook signature
  ↓
routeWebhookIngressRequest() forwards to WEBHOOK_INGRESS binding
  ↓
integratewise-webhook-ingress processes event
  ↓
Triggers pipeline for data sync
```

---

## Service Health

Check all services via readiness probe:

```bash
curl https://gateway.dev.integratewise.ai/health/ready
```

**Response:**
```json
{
  "status": "ready",
  "services": [
    {"name": "connector", "healthy": true, "latency_ms": 45},
    {"name": "pipeline", "healthy": true, "latency_ms": 32},
    {"name": "intelligence", "healthy": true, "latency_ms": 67},
    {"name": "knowledge", "healthy": true, "latency_ms": 28},
    {"name": "bff", "healthy": true, "latency_ms": 41},
    {"name": "agent-runtime", "healthy": true, "latency_ms": 55},
    {"name": "webhook-ingress", "healthy": true, "latency_ms": 22}
  ]
}
```

---

## Environment Variables (Gateway)

```typescript
export interface Env {
  // D1 Database
  DB: D1Database;
  
  // Service Bindings
  CONNECTOR: Fetcher;
  CONNECTOR_SYNC?: Fetcher;
  PIPELINE: Fetcher;
  INTELLIGENCE: Fetcher;
  KNOWLEDGE: Fetcher;
  BFF: Fetcher;
  L2: Fetcher;
  AGENT_RUNTIME: Fetcher;
  WEBHOOK_INGRESS?: Fetcher;
  HUB_CONTROLLER: Fetcher;
  ADMIN: Fetcher;
  BILLING: Fetcher;
  TENANTS: Fetcher;
  
  // KV Namespaces
  RATE_LIMITS: KVNamespace;
  SESSIONS: KVNamespace;
  CONNECTOR_STATUS?: KVNamespace;
  SIGNAL_CACHE?: KVNamespace;
  METRICS?: KVNamespace;
  OAUTH_STATE_KV?: KVNamespace;
  
  // Secrets
  NANGO_SECRET_KEY?: string;
  DESCOPE_MANAGEMENT_KEY?: string;
  HUBSPOT_WEBHOOK_SECRET?: string;
  SALESFORCE_WEBHOOK_SECRET?: string;
  GITHUB_WEBHOOK_SECRET?: string;
  STRIPE_WEBHOOK_SECRET?: string;
}
```

---

## Summary

| Endpoint Category | Handler |
|-------------------|---------|
| Auth | Gateway (internal) |
| **Spine** | **Gateway (internal) → D1** |
| Workspace/Projection | Gateway (internal) → Projection Engine |
| Connectors | CONNECTOR service |
| Integrations | CONNECTOR service |
| Sync | CONNECTOR_SYNC service |
| Capabilities | INTELLIGENCE service |
| Brainstorm/Cognitive | INTELLIGENCE service |
| Workbench | BFF service |
| Twin/Proposals | AGENT_RUNTIME service |
| Webhooks | WEBHOOK_INGRESS service |
| Pipeline/Loader | PIPELINE service |
| Knowledge | KNOWLEDGE service |
| Admin | ADMIN service |
| Billing | BILLING service |

---

**Gateway:** `https://gateway.dev.integratewise.ai`  
**All requests go through Gateway** — no direct service access.  
**Spine is the canonical data layer** — accessed via Gateway internal handlers.
