# AI Connector MCP Flow — Marketplace → Onboarding → Execution

Status: CURRENT
Scope: End-to-end flow for AI-provider MCP connectors (Claude / OpenAI / Perplexity) from marketplace install through governed execution, mapped to what exists in this repo and in the live Cloudflare account.
Canonical Owner: Platform
Last Verified: 2026-07-19 (live Cloudflare account inventory + repo audit)
Evidence Basis: `services/gateway/src/ai-plugin-marketplace.ts`, `services/mcp-pool/`, `services/integration-management-mcp/`, `services/hermes/`, `packages/adk/`, `HERMES.md`, deployed workers `integratewise-anthropic-mcp-prod` / `integratewise-perplexity-mcp-prod` / `integratewise-mcp-pool-prod` / `integratewise-integration-management-mcp-prod`
**Canonical Reference:** [CANONICAL_PLATFORM_ARCHITECTURE.md](CANONICAL_PLATFORM_ARCHITECTURE.md)

> Downstream of the Canonical Platform Architecture and [HERMES.md](../../HERMES.md).
> Where this document contradicts them, they win. Hermes orchestrates; Hermes
> does not own canonical truth. No AI action executes without approval.

---

## 1. The canonical flow

```text
                    AI Connector Marketplace
                            │
                            ▼
                   User installs connector
                            │
                            ▼
                 Identity & Authentication
              (Descope / Auth0 / Enterprise SSO)
                            │
                            ▼
                    Tenant Onboarding
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
 Create Tenant       Create User        Create Workspace
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
                    Initialize Spine
                            │
                            ▼
                  Register Connected Systems
                            │
                            ▼
                 Register Capability Fabric
                            │
                            ▼
                Register MCP Server/Connector
                            │
                            ▼
                 Register AI Runtime (ADK)
                            │
                            ▼
                 Register Governance Policies
                            │
                            ▼
                Provision Tenant MCP Endpoint
                            │
                            ▼
          Claude / OpenAI / Perplexity connect
                            │
                            ▼
                   MCP Server / Gateway
                            │
                            ▼
                         Hermes
                    (Orchestrator)
                            │
        ┌───────────────┬───────────────┬───────────────┐
        ▼               ▼               ▼
 Capability Fabric   Context Engine   Policy Engine
        │               │               │
        └───────────────┼───────────────┘
                        ▼
                  ADK Agent Runtime
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
   Tool Registry   Workflow Engine   Memory Services
        │               │                │
        └───────────────┼────────────────┘
                        ▼
                     Spine
        (Memory • Context • Knowledge)
                        │
                        ▼
             Connector Execution Layer
                        │
        ┌───────────────┼──────────────────────────┐
        ▼               ▼              ▼           ▼
   Salesforce        Slack         GitHub      Google Workspace
        │               │              │           │
        └───────────────┼──────────────┼───────────┘
                        ▼
                Execution Results
                        │
                        ▼
               Governance & Approval
                        │
                        ▼
                Update Spine Memory
                        │
                        ▼
              Response returned to AI
```

Two directions run over the same fabric:

- **Inbound (AI as client):** an AI assistant (Claude, ChatGPT, Perplexity)
  installs the IntegrateWise plugin, gets a tenant, and reaches the workspace
  through the gateway — the marketplace flow above.
- **Outbound (AI as capability):** IntegrateWise tenants connect AI providers
  as MCP connectors (`anthropic-mcp`, `perplexity-mcp`, `openai-mcp`) whose
  capabilities (reasoning, vision, code, long-context) become tools in the
  Capability Fabric on the **cognitive plane** — subject to the same approval
  gates as every other cognitive capability.

---

## 2. Stage-by-stage: where each piece lives

| #   | Stage                                     | Implementation                                                                                                                                                                                                                                                            | State                                                               |
| --- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1   | AI Connector Marketplace                  | `services/gateway/src/ai-plugin-marketplace.ts` — plugin manifest (`getPluginManifest`, OAuth via `auth.integratewise.ai`, scopes `iw:connect iw:search iw:act iw:reason iw:sync`), install webhook (`handlePluginInstall`), connector install (`handleConnectorInstall`) | IN REPO + LIVE (gateway-prod)                                       |
| 2   | User installs connector                   | `plugin.installed` event → `handlePluginInstall`                                                                                                                                                                                                                          | IN REPO + LIVE                                                      |
| 3   | Identity & Authentication                 | Descope: `resolveDescopePrincipal` (gateway), `VITE_DESCOPE_PROJECT_ID` (web); plugin OAuth (PKCE) declared in the manifest                                                                                                                                               | IN REPO + LIVE                                                      |
| 4   | Tenant Onboarding (tenant/user/workspace) | `handlePluginInstall` creates tenant `ai-{platform}-{user_id}` in D1 `tenants`, stores tokens in `ai_platform_tokens`, returns `onboarding_url` → `app.integratewise.ai/onboarding`; full onboarding via `integratewise-tenants` + web activation flow                    | IN REPO + LIVE                                                      |
| 5   | Initialize Spine                          | `tenant_spine_config` (D1) written during onboarding; Spine workers + `integratewise-spine-cache` / `integratewise-spine-prod` D1                                                                                                                                         | IN REPO + LIVE                                                      |
| 6   | Register Connected Systems                | Nango-backed catalog + connect sessions (`workspace-spine.ts`, connector service); `integration-management-mcp` (connector/schema/sync/webhook managers)                                                                                                                  | IN REPO + LIVE                                                      |
| 7   | Register Capability Fabric                | `services/gateway/src/workbench-capabilities.ts` + [CAPABILITY_FABRIC.md](CAPABILITY_FABRIC.md); planes `operational` / `cognitive`                                                                                                                                       | IN REPO + LIVE                                                      |
| 8   | Register MCP Server/Connector             | MCP Pool `POST /register` with an `MCPServiceManifest`; pre-wired registrations in `services/mcp-pool/src/registrations.ts`                                                                                                                                               | IN REPO + LIVE (see gaps)                                           |
| 9   | Register AI Runtime (ADK)                 | `packages/adk` (agent-registry, registry, resolver, spine-cache); `iw-agent-runtime` worker                                                                                                                                                                               | IN REPO + LIVE                                                      |
| 10  | Register Governance Policies              | Gateway HITL orchestrator (approval gates, rejection paths); AGENTS.md hard rules (no approval token → no execution)                                                                                                                                                      | IN REPO + LIVE                                                      |
| 11  | Provision Tenant MCP Endpoint             | —                                                                                                                                                                                                                                                                         | **MISSING** (see gaps)                                              |
| 12  | AI providers connect                      | Deployed AI provider MCP workers (see §3)                                                                                                                                                                                                                                 | LIVE, **not in repo**                                               |
| 13  | MCP Server / Gateway                      | `gateway-prod` routes; `mcp-connector-prod`                                                                                                                                                                                                                               | IN REPO + LIVE                                                      |
| 14  | Hermes (orchestrator)                     | `services/hermes` — `orchestrator.ts` (n8n → Durable Objects → direct service-mesh fallback chain), `execution-engine.ts`, `stream.ts`                                                                                                                                    | IN REPO; deployed worker `integratewise-hermes` is stale (May 2026) |
| 15  | ADK Agent Runtime (tools/workflow/memory) | `packages/adk` + `iw-agent-runtime` + `services/workflow` + `packages/hermes-spine-memory`                                                                                                                                                                                | IN REPO + LIVE                                                      |
| 16  | Spine (memory/context/knowledge)          | Spine workers, `knowledge-prod`, `continuity-prod`                                                                                                                                                                                                                        | IN REPO + LIVE                                                      |
| 17  | Connector Execution Layer                 | `connector-prod` + Nango OAuth + `integratewise-webhook-ingress`                                                                                                                                                                                                          | IN REPO + LIVE                                                      |
| 18  | Governance & Approval                     | Approval Gate (HITL) — non-bypassable; results persist only after approval                                                                                                                                                                                                | IN REPO + LIVE                                                      |
| 19  | Update Spine Memory                       | Session summaries / governed outputs enter the Spine as the third flow (Truth · Context · Knowledge)                                                                                                                                                                      | IN REPO + LIVE                                                      |

---

## 3. The AI provider MCP connector contract (as deployed)

`integratewise-anthropic-mcp-prod` and `integratewise-perplexity-mcp-prod`
(Hono workers) expose a uniform surface:

```text
GET  /mcp/manifest   → MCPServiceManifest:
                        id ("anthropic-mcp"), provider, version,
                        capabilities[] (id, input/output JSON Schema),
                        connectionConfig { type: "api_key", fields },
                        syncConfig { supportsScheduledSync, defaultSyncInterval, syncableData }
POST /mcp/invoke     → { capability, args, context: { credentials: { apiKey } } }
                        → provider API call → { success, data }
GET  /health         → { status: "ok" }
POST /sync           → scheduled sync entry point (chat_history / usage / models)
```

Anthropic capabilities as deployed: `reasoning`, `vision`, `code_generation`,
`long_context_analysis`, `chat_completion`. Credentials are **per-tenant,
passed per-invoke** — the workers hold no provider keys.

This manifest shape is exactly what the MCP Pool registers (`pool.register(manifest, binding)`),
which is how these connectors surface in the marketplace and become
Capability-Fabric tools on the cognitive plane.

---

## 4. Divergence register (repo ↔ live account)

1. **AI provider MCP workers are not in the monorepo.**
   `integratewise-anthropic-mcp-prod` and `integratewise-perplexity-mcp-prod`
   (deployed 2026-07-18) have no source, wrangler config, or CI here — they
   were deployed from outside this repo. They bundle `hono@4.12.8` from a
   pnpm store path, so they came from _a_ monorepo checkout, just not a
   committed one. **Action: repatriate their source into `services/` so the
   repo is the single source of truth.**
2. **No OpenAI MCP worker is deployed** despite the flow (and the plugin
   manifest copy) naming Claude / OpenAI / Perplexity. **Action: build+deploy
   `integratewise-openai-mcp` to the same contract (§3).**
3. **MCP Pool pre-wired bindings were dead config.** `wrangler.toml` declared
   bindings as bare TOML keys, which wrangler ignores — so `registerPreWired`
   skipped everything and the pool started empty. Fixed (same commit as this
   doc) to real `[[services]]` blocks, binding only workers that actually
   exist (`integratewise-integration-management-mcp-prod`,
   `integratewise-spine`). `PROVIDER_MANAGEMENT` and `TASK_MANAGEMENT` stay
   commented until those workers are deployed — a binding to a nonexistent
   worker fails the deploy.
4. **Per-tenant MCP endpoint provisioning (stage 11) does not exist yet.**
   Today the AI provider MCPs are shared multi-tenant workers keyed by
   per-invoke credentials. A per-tenant endpoint (URL or token-scoped route
   provisioned at onboarding) is the design target, not current behavior.
5. **The deployed `integratewise-hermes` worker predates the current
   `services/hermes` source** (deployed May 2026; orchestrator has since
   gained the n8n → DO → mesh fallback chain). **Action: redeploy Hermes from
   the repo once its wiring is reviewed.**

---

## 5. Governance invariants (non-negotiable, per AGENTS.md)

- The Twin/AI **proposes**; execution happens only after Approval Gate passes.
  This applies identically to inbound AI assistants (plugin scopes `iw:act`)
  and outbound AI-provider capabilities (cognitive plane, confidence-capped).
- Hermes coordinates reasoning and execution but never writes canonical truth;
  the Spine is SSOT and memory informs truth without being truth.
- Every invoke carries tenant context; credentials are tenant-scoped and never
  stored in the MCP workers.
