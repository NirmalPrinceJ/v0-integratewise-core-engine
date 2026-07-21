# IntegrateWise Repository Layer Mapping (REPOSITION_MAP)

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

This file maps the active codebase directories to the 9 logical architecture layers. To maintain codebase integrity and comply with the [AGENTS.md](file:///Users/nirmal/integratewise-live/AGENTS.md) safety protocol, physical directories are kept in their canonical locations, and this schema serves as the authoritative map.

---

## 🗺️ Layer Mapping Schema

```json
{
  "project": "integratewise-live",
  "version": "3.8.0",
  "layers": {
    "auth": {
      "description": "Authentication, JWT verification, and credential handling",
      "paths": ["services/gateway/src/auth.ts", "services/tenants/"]
    },
    "ingress": {
      "description": "Webhook receivers, delta monitors, and file event listeners",
      "paths": ["services/webhook-ingress/", "services/folder-watcher/", "services/connector-sync/"]
    },
    "userworkbench": {
      "description": "Dashboard interface workbench and read projections",
      "paths": ["apps/web/", "services/gateway/src/workspace-spine.ts"]
    },
    "intelligent_layer": {
      "description": "Cognitive reasoning engines, AI gateway, and sandbox agents",
      "paths": ["services/intelligence/"]
    },
    "twin_workbench": {
      "description": "Stateful user twin conversational runtime and sessions",
      "paths": ["services/iw-agent-runtime/"]
    },
    "memory": {
      "description": "KB ingestion, semantic D1 chunks, and Vectorize indexes",
      "paths": ["services/knowledge/", "/Users/nirmal/.iw-memory/"]
    },
    "notification": {
      "description": "Governance approvals, workflows, and billing escalations",
      "paths": ["services/workflow/", "services/billing/", "services/intelligence/src/handoff/"]
    },
    "spine": {
      "description": "Canonical database partitions and normalization pipeline",
      "paths": ["services/pipeline/"]
    },
    "backend": {
      "description": "Shared configurations, connectors, and admin utilities",
      "paths": ["packages/types/", "packages/connectors/", "services/admin/"]
    }
  }
}
```

---

## 📂 Physical Directory Structure

```
integratewise-live/
├── apps/
│   ├── web/                        <-- [userworkbench] React/Next.js Workbench UI
│   └── web-frontend-reference/     <-- Reference Layout Components
├── services/
│   ├── gateway/                    <-- [auth] JWT resolution & D1 projections
│   ├── webhook-ingress/            <-- [ingress] Webhook membrane
│   ├── folder-watcher/             <-- [ingress] DO file monitor
│   ├── connector-sync/             <-- [ingress] Delta pollers
│   ├── intelligence/               <-- [intelligent_layer] Cognitive Think/Act/Govern agents
│   ├── iw-agent-runtime/           <-- [twin_workbench] Stateful TwinAgent DO
│   ├── knowledge/                  <-- [memory] KB indexing (D1/R2/Vectorize)
│   ├── workflow/                   <-- [notification] Workflow scheduler
│   ├── billing/                    <-- [notification] Stripe subscriptions
│   └── pipeline/                   <-- [spine] Stage 1-8 Normalizer
└── packages/
    ├── types/                      <-- [backend] Shared schemas
    └── connectors/                 <-- [backend] Connector integrations
```
