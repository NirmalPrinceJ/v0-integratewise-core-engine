# Codebase Alignment Specification

> **Status:** Active alignment plan  
> **Date:** July 12, 2026  
> **Authority:** Nirmal (Founder)  
> **Canonical Reference:** [CANONICAL_PLATFORM_ARCHITECTURE.md](./CANONICAL_PLATFORM_ARCHITECTURE.md)  
> **Purpose:** Maps current services to canonical Platform Planes and defines alignment actions

---

## Current State

The codebase has **30 services** in `services/`. The canonical architecture defines **18 Platform Planes**. There is a significant mismatch that needs resolution.

---

## Service → Plane Mapping

### Direct Mappings (Service exists and maps to a Plane)

| Current Service     | Canonical Plane                         | Wrangler Name               | Status                                   |
| ------------------- | --------------------------------------- | --------------------------- | ---------------------------------------- |
| `pipeline`          | **Pipeline**                            | integratewise-pipeline      | ✅ Maps                                  |
| `connector`         | **Integration Manager** (API Connector) | connector                   | ✅ Maps                                  |
| `mcp-connector`     | **Integration Manager** (MCP)           | integratewise-mcp-connector | ✅ Maps                                  |
| `intelligence`      | **Integration Manager** (AI Connector)  | intelligence                | ✅ Maps                                  |
| `knowledge`         | **Knowledge**                           | knowledge                   | ✅ Maps                                  |
| `continuity`        | **Continuity Pipeline**                 | continuity                  | ✅ Maps                                  |
| `hermes`            | **Hermes**                              | integratewise-hermes        | ✅ Maps                                  |
| `govern`            | **Governance Engine**                   | integratewise-govern        | ✅ Maps                                  |
| `store`             | **Adaptive Spine**                      | integratewise-store         | ⚠️ Partial (Spine only, not Cache/Blobs) |
| `think`             | **Twin** (reasoning)                    | integratewise-think         | ⚠️ Partial                               |
| `iw-agent-runtime`  | **Twin** (runtime)                      | iw-agent-runtime            | ⚠️ Partial                               |
| `twin-orchestrator` | **Twin** (orchestration)                | twin-orchestrator           | ⚠️ Partial                               |

### Services Requiring Renaming/Consolidation

| Current Service   | Target Plane            | Action Required                                    |
| ----------------- | ----------------------- | -------------------------------------------------- |
| `loader`          | **Pipeline**            | Consolidate into `pipeline`                        |
| `normalizer`      | **Pipeline**            | Consolidate into `pipeline`                        |
| `act`             | **Hermes** (execution)  | Consolidate into `hermes` or rename to `execution` |
| `connector-sync`  | **Sync Engine**         | Rename to `sync-engine`                            |
| `webhook-ingress` | **Integration Manager** | Consolidate into `connector` or rename             |
| `agent-registry`  | **Capability Fabric**   | Rename to `capability-fabric`                      |
| `workflow`        | **Capability Fabric**   | Consolidate into `capability-fabric`               |

### Services That Are Cross-Cutting Infrastructure

| Current Service | Infrastructure Layer                | Action Required                         |
| --------------- | ----------------------------------- | --------------------------------------- |
| `gateway`       | Identity + Secrets, Queues + Events | Keep as-is (cross-cutting)              |
| `admin`         | Admin + Operations                  | Keep as-is (cross-cutting)              |
| `billing`       | Billing + Entitlements              | Keep as-is (cross-cutting)              |
| `telemetry`     | Observability                       | Keep as-is (cross-cutting)              |
| `tenants`       | Configuration Manager (partial)     | Keep or consolidate into config-manager |
| `signals`       | Queues + Events                     | Keep or consolidate into events         |

### Services That Are Legacy/Unknown

| Current Service         | Assessment            | Action Required                                             |
| ----------------------- | --------------------- | ----------------------------------------------------------- |
| `l2`                    | Legacy overlay schema | Evaluate for retirement                                     |
| `core-engine`           | Unknown purpose       | Evaluate for retirement or consolidation                    |
| `folder-watcher`        | File monitoring       | Evaluate for consolidation into connector                   |
| `huggingface-inference` | Model inference       | Evaluate for consolidation into intelligence                |
| `schema-ai`             | Schema management     | Evaluate for consolidation into config-manager or knowledge |

### Canonical Planes Missing Services

| Canonical Plane           | Current Service                            | Action Required                                       |
| ------------------------- | ------------------------------------------ | ----------------------------------------------------- |
| **Configuration Manager** | `tenants` (partial), `schema-ai` (partial) | Create new `config-manager` service                   |
| **Activation Bridge**     | None                                       | Create new `activation-bridge` service                |
| **Spine Cache**           | None (part of `store`)                     | Extract from `store` or create new service            |
| **Blobs**                 | None (part of `store`)                     | Extract from `store` or create new service            |
| **User Workbench**        | `apps/live` (frontend)                     | Frontend only, no service needed                      |
| **Twin Memory**           | None (part of `iw-agent-runtime`)          | Extract from `iw-agent-runtime` or create new service |
| **Session Logs**          | None (part of `iw-agent-runtime`)          | Extract from `iw-agent-runtime` or create new service |
| **Twin Audit Logs**       | None (part of `iw-agent-runtime`)          | Extract from `iw-agent-runtime` or create new service |
| **Sync Engine**           | `connector-sync` (partial)                 | Rename and expand `connector-sync`                    |

---

## Target State

After alignment, the services should map to:

### Platform Plane Services (18)

| Service               | Canonical Plane       | Wrangler Name                     |
| --------------------- | --------------------- | --------------------------------- |
| `config-manager`      | Configuration Manager | integratewise-config-manager      |
| `integration-manager` | Integration Manager   | integratewise-integration-manager |
| `activation-bridge`   | Activation Bridge     | integratewise-activation-bridge   |
| `pipeline`            | Pipeline              | integratewise-pipeline            |
| `spine`               | Adaptive Spine        | integratewise-spine               |
| `spine-cache`         | Spine Cache           | integratewise-spine-cache         |
| `knowledge`           | Knowledge             | integratewise-knowledge           |
| `blobs`               | Blobs                 | integratewise-blobs               |
| `twin`                | Twin                  | integratewise-twin                |
| `twin-memory`         | Twin Memory           | integratewise-twin-memory         |
| `session-logs`        | Session Logs          | integratewise-session-logs        |
| `twin-audit-logs`     | Twin Audit Logs       | integratewise-twin-audit-logs     |
| `capability-fabric`   | Capability Fabric     | integratewise-capability-fabric   |
| `governance-engine`   | Governance Engine     | integratewise-governance-engine   |
| `hermes`              | Hermes                | integratewise-hermes              |
| `sync-engine`         | Sync Engine           | integratewise-sync-engine         |
| `continuity-pipeline` | Continuity Pipeline   | integratewise-continuity-pipeline |

### Cross-Cutting Infrastructure Services (8)

| Service      | Infrastructure Layer                | Wrangler Name            |
| ------------ | ----------------------------------- | ------------------------ |
| `gateway`    | Identity + Secrets, Queues + Events | gateway                  |
| `admin`      | Admin + Operations                  | integratewise-admin      |
| `billing`    | Billing + Entitlements              | integratewise-billing    |
| `telemetry`  | Observability                       | integratewise-telemetry  |
| `tenants`    | Config State                        | integratewise-tenants    |
| `events`     | Queues + Events                     | integratewise-events     |
| `secrets`    | Identity + Secrets                  | integratewise-secrets    |
| `deployment` | Deployment + Runtime                | integratewise-deployment |

### Frontend Apps (unchanged)

| App              | Purpose                  |
| ---------------- | ------------------------ |
| `apps/live`      | User Workbench (primary) |
| `apps/web`       | Legacy/marketing         |
| `apps/mobile`    | Mobile app               |
| `apps/desktop`   | Desktop app              |
| `apps/workspace` | Internal workspace       |
| `apps/docs`      | Documentation            |

---

## Alignment Actions

### Phase 1: Consolidation (Reduce service count)

1. **Consolidate Pipeline services:** Merge `loader` + `normalizer` into `pipeline`
2. **Consolidate Twin services:** Merge `think` + `iw-agent-runtime` + `twin-orchestrator` into `twin`
3. **Consolidate Capability Fabric:** Merge `agent-registry` + `workflow` into `capability-fabric`
4. **Rename Sync Engine:** Rename `connector-sync` to `sync-engine`

### Phase 2: Creation (Fill gaps)

1. **Create `config-manager`** from `tenants` + `schema-ai`
2. **Create `activation-bridge`** (new service)
3. **Extract `spine-cache`** from `store`
4. **Extract `blobs`** from `store`
5. **Extract `twin-memory`** from `iw-agent-runtime`
6. **Extract `session-logs`** from `iw-agent-runtime`
7. **Extract `twin-audit-logs`** from `iw-agent-runtime`

### Phase 3: Retirement (Remove legacy)

1. **Evaluate `l2`** for retirement
2. **Evaluate `core-engine`** for retirement or consolidation
3. **Evaluate `folder-watcher`** for consolidation into connector
4. **Evaluate `huggingface-inference`** for consolidation into intelligence
5. **Evaluate `webhook-ingress`** for consolidation into connector

### Phase 4: Rename (Align names)

1. **Rename `store`** to `spine`
2. **Rename `connector`** to `integration-manager`
3. **Rename `mcp-connector`** (part of integration-manager)
4. **Rename `intelligence`** to `ai-connector`
5. **Rename `govern`** to `governance-engine`

---

## Priority Order

1. **P0:** Consolidate Pipeline (loader + normalizer → pipeline)
2. **P0:** Consolidate Twin (think + iw-agent-runtime + twin-orchestrator → twin)
3. **P0:** Rename store → spine
4. **P1:** Create config-manager from tenants + schema-ai
5. **P1:** Create activation-bridge (new)
6. **P1:** Rename connector-sync → sync-engine
7. **P2:** Extract spine-cache, blobs from store
8. **P2:** Extract twin-memory, session-logs, twin-audit-logs from iw-agent-runtime
9. **P2:** Consolidate capability-fabric from agent-registry + workflow
10. **P3:** Evaluate and retire legacy services

---

## Verification Criteria

After alignment, verify:

1. Every canonical Plane has a corresponding service
2. No service exists without a canonical Plane mapping
3. All wrangler.toml names follow the pattern `integratewise-{plane-name}`
4. All services have consistent TypeScript types matching the canonical data models
5. All services have consistent API contracts matching the canonical execution sequences
6. Frontend components reference the correct service names
7. Deploy scripts reference the correct service names
8. Documentation references the correct service names
