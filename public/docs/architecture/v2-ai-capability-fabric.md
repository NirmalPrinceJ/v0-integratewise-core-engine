# IntegrateWise AI Capability Fabric

**Status:** FROZEN — Final Platform Boundary  
**Domain:** AI substrate, provider independence, model routing, capability contracts  
**Date:** 2026-07-12  
**Version:** 1.0.0-CANONICAL  
**Supersedes:** `docs/architecture/v2-provider-fabric.md` §AI surface; prior provider/routing drafts  
**Authority:** Founder / Platform Doctrine

**Canonical Reference:** [CANONICAL_PLATFORM_ARCHITECTURE.md](./CANONICAL_PLATFORM_ARCHITECTURE.md)

> This document is downstream of the Canonical Platform Architecture. When this document contradicts the canonical architecture, the canonical architecture wins.

---

## 1. Architecture Law

> **No external provider owns an IntegrateWise architectural boundary.**

That applies to AI and every other provider plane:

```text
Auth / Database / Spine / Cache / Queue / Storage / Vector / Search
AI provider / Model / AI gateway / Embedding / Reranking / Inference
Agent runtime / Tool runtime / MCP runtime
Connector provider / OAuth broker
Observability / Analytics / Billing / Mail / Secrets / Feature flags
```

Law:

```text
IntegrateWise defines capability contracts
      ↓
Platform resolves configured implementations
      ↓
Providers execute them
```

Specifically for AI:

> **Twin asks for intelligence.  
> Hermes determines execution.  
> Governance determines permission.  
> The router determines capability/model.  
> The gateway determines transport.  
> The provider performs inference.  
> No model owns truth or workflow state.**

This is the **Provider Independence Law**.

---

## 2. AI Is a Capability Fabric

Product/Workbench/Twin must never target a vendor, model, or gateway in architecture or contract shape.

```text
Product / Workbench / Twin
            │
            ▼
       AI Capability SDK
            │
            ▼
      AI Runtime / Hermes
            │
   ┌────────┼───────────┐
   ▼        ▼           ▼
Gateway   Router     Governance
   │        │           │
   ▼        ▼           ▼
Provider  Model      Policy /
Adapter   Resolver   Approval
   │
   ▼
External AI Substrate
```

Product code only sees capability contracts and intents.

---

## 3. Contract Surfaces

```text
AIProvider
ModelProvider
AIGateway
ModelRouter
EmbeddingProvider
RerankProvider
InferenceProvider
AgentRuntime
ToolRuntime
MemoryProvider
PromptRegistry
ContextProvider
GuardrailProvider
EvaluationProvider
ObservabilityProvider
```

---

## 4. AIProvider

Represents the external AI vendor/API substrate.

```ts
interface AIProvider {
  id: string;

  generate(request: GenerationRequest): Promise<GenerationResult>;

  stream(request: GenerationRequest): AsyncIterable<GenerationChunk>;

  capabilities(): Promise<ProviderCapabilities>;
}
```

Adapters are implementation details only:

```text
OpenAIProvider
AnthropicProvider
GoogleProvider
OpenRouterProvider
AzureOpenAIProvider
BedrockProvider
CloudflareAIProvider
LocalInferenceProvider
```

Providers may target OpenAI, Anthropic, Google AI, OpenRouter, Bedrock, Cloudflare Workers AI, or other substrates. None of these provider names belong in product architecture.

---

## 5. ModelProvider

Model identity/capability metadata is separate from API execution.

```ts
interface ModelDescriptor {
  id: string;
  provider: string;

  capabilities: {
    reasoning: boolean;
    vision: boolean;
    tools: boolean;
    structuredOutput: boolean;
    embeddings: boolean;
  };

  contextWindow: number;

  economics: {
    inputCost: number;
    outputCost: number;
  };

  governance: {
    dataResidency?: string[];
    allowedScopes?: MemoryScope[];
    sensitivityLevel?: number;
  };
}
```

Model identity examples:

```text
provider = anthropic
model    = claude-sonnet-x

provider = openai
model    = gpt-x

provider = openrouter
model    = provider/model
```

**Never use model names as architecture.**

Bad:

```ts
callClaude();
callGPT();
callGemini();
```

Correct:

```ts
ai.execute({
  capability: "reasoning",
  task: "account-risk-analysis",
});
```

---

## 6. AIGateway

The AI Gateway is an execution transport boundary, not a product boundary.

```ts
interface AIGateway {
  execute(request: AIExecutionRequest): Promise<AIExecutionResult>;

  stream(request: AIExecutionRequest): AsyncIterable<AIExecutionChunk>;
}
```

Possible implementations:

```text
DirectGateway
CloudflareAIGateway
OpenRouterGateway
LiteLLMGateway
InternalHermesGateway
EnterpriseProxyGateway
```

Routing:

```text
Twin
 │
 ▼
AI SDK
 │
 ▼
Hermes
 │
 ▼
AIGateway
 │
 ├── Direct Provider
 ├── Cloudflare AI Gateway
 ├── OpenRouter
 ├── Enterprise AI Proxy
 └── Customer-hosted Gateway
```

Product code must not know which gateway implementation is active.

---

## 7. ModelRouter

Hermes requests a capability, not a model.

```ts
interface ModelRouter {
  resolve(intent: AIIntent, context: ExecutionContext): Promise<ModelRoute>;
}
```

Example:

```ts
await ai.execute({
  intent: "summarize_customer_history",
  requirements: {
    latency: "interactive"
    sensitivity: "internal"
    reasoning: "medium"
    structuredOutput: true
  }
})
```

Resolution order:

```text
Intent
  ↓
Policy
  ↓
Tenant AI Config
  ↓
Data Sensitivity
  ↓
Required Capability
  ↓
Cost Budget
  ↓
Latency Target
  ↓
Model Health
  ↓
Model Route
```

Result:

```ts
{
  provider: "anthropic";
  model: "claude-sonnet-x";
  gateway: "cloudflare-ai-gateway";
}
```

Tomorrow it may return:

```ts
{
  provider: "openai";
  model: "gpt-x";
  gateway: "internal-hermes";
}
```

No product code changes.

---

## 8. Full Platform Contract

```ts
interface PlatformRuntime {
  auth: AuthProvider;
  spine: SpineStore;
  cache: CacheProvider;
  objectStore: ObjectStore;
  queue: QueueProvider;
  vector: VectorStore;

  ai: {
    runtime: AIRuntime;
    provider: AIProviderRegistry;
    models: ModelRegistry;
    gateway: AIGateway;
    router: ModelRouter;

    embeddings: EmbeddingProvider;
    reranker: RerankProvider;
    inference: InferenceProvider;

    agents: AgentRuntime;
    tools: ToolRuntime;

    context: ContextProvider;
    memory: MemoryProvider;

    prompts: PromptRegistry;
    guardrails: GuardrailProvider;
    evaluation: EvaluationProvider;
    observability: AIObservabilityProvider;
  };
}
```

Configuration:

```yaml
platform:
  auth:
    provider: descope

  spine:
    provider: postgres

  cache:
    provider: upstash

ai:
  runtime: hermes

  gateway:
    provider: cloudflare-ai-gateway

  routing:
    provider: hermes-router

  providers:
    - anthropic
    - openai
    - google
    - openrouter

  embeddings:
    provider: configurable

  reranker:
    provider: configurable

  agents:
    runtime: hermes

  memory:
    provider: continuity-memory

  governance:
    provider: iw-governance
```

---

## 9. Provider Fabric

The Platform resolves these contracts:

```ts
interface ProviderFabric {
  auth: AuthProvider;
  database: DatabaseProvider;
  spineStore: SpineStoreProvider;

  cache: CacheProvider;
  queue: QueueProvider;
  objectStore: ObjectStoreProvider;
  vectorStore: VectorStoreProvider;
  search: SearchProvider;

  aiProvider: AIProviderRegistry;
  modelProvider: ModelRegistry;
  aiGateway: AIGateway;
  modelRouter: ModelRouter;
  embedding: EmbeddingProvider;
  reranker: RerankProvider;
  inference: InferenceProvider;

  agentRuntime: AgentRuntimeProvider;
  toolRuntime: ToolRuntimeProvider;
  mcpRuntime: MCPRuntimeProvider;

  connector: ConnectorProvider;
  oauth: OAuthProvider;

  email: EmailProvider;
  notification: NotificationProvider;

  billing: BillingProvider;
  analytics: AnalyticsProvider;
  observability: ObservabilityProvider;

  secrets: SecretsProvider;
  featureFlags: FeatureFlagProvider;
}
```

Provider implementations may use Cloudflare, Supabase, Upstash, Descope, OpenAI, Anthropic, OpenRouter, Bedrock, or other vendors. **Those vendors do not define the platform domains.**

---

## 10. Final Platform Boundary

Product owns experience. Platform owns capability.  
Platform contracts are canonical. Providers are replaceable.  
Deployment configuration selects infrastructure. Application architecture does not.

```text
┌──────────────────────────────────────────────────────────────────┐
│                         PRODUCT PLANE                            │
│                                                                  │
│ Landing → Auth UX → Onboarding → Workbench → Governance → Twin  │
│                                                                  │
│ Product owns EXPERIENCE. It consumes Platform capabilities.      │
└───────────────────────────────┬──────────────────────────────────┘
                                │
                         Platform SDK / API
                                │
┌───────────────────────────────▼──────────────────────────────────┐
│                     INTEGRATEWISE PLATFORM                       │
│                                                                  │
│  01 IDENTITY       02 TENANCY        03 CONFIGURATION            │
│  04 SPINE          05 MEMORY         06 CONTINUITY               │
│  07 INTEGRATION    08 CAPABILITY     09 AI                       │
│  10 GOVERNANCE     11 EXECUTION      12 COMMUNICATION            │
│  13 COMMERCIAL     14 OPERATIONS     15 DEVELOPER                │
│                                                                  │
└───────────────────────────────┬──────────────────────────────────┘
                                │
                       Provider Contracts
                                │
┌───────────────────────────────▼──────────────────────────────────┐
│                       PROVIDER PLANE                             │
│                                                                  │
│ Auth │ DB │ Cache │ Queue │ Storage │ Vector │ AI │ MCP │ OAuth │
│ Mail │ Billing │ Analytics │ Observability │ Secrets │ Search    │
│                                                                  │
│                    ALL CONFIGURABLE                              │
└──────────────────────────────────────────────────────────────────┘
```

### 10.1 Final 15 Platform Domains

| #   | Platform domain   | Platform owns                                                                            |
| --- | ----------------- | ---------------------------------------------------------------------------------------- |
| 01  | **Identity**      | Auth contract, sessions, users, organizations, RBAC, service identity                    |
| 02  | **Tenancy**       | Tenant lifecycle, isolation, memberships, environments, tenant context                   |
| 03  | **Configuration** | Runtime config, provider config, tenant config, secrets refs, feature policy             |
| 04  | **Spine**         | Canonical entity contracts, IDs, state ownership, entity graph, canonical writes         |
| 05  | **Memory**        | User/Work/Org memory, promotion, compaction, retrieval, memory lifecycle                 |
| 06  | **Continuity**    | Continuity Bridge, context bundles, hydration, workspace transition, operational history |
| 07  | **Integration**   | Connector catalog, connection lifecycle, OAuth abstraction, sync, ingestion              |
| 08  | **Capability**    | Capability registry, tools, actions, permissions, provider-backed capabilities           |
| 09  | **AI**            | AI runtime, model registry, provider registry, gateway, router, embeddings, reranking    |
| 10  | **Governance**    | Policy, evidence, approval, HITL, audit, AI/action permission boundaries                 |
| 11  | **Execution**     | Jobs, workflows, queues, orchestration, retries, schedules, event execution              |
| 12  | **Communication** | Email, notifications, webhooks, delivery channels, templates                             |
| 13  | **Commercial**    | Plans, entitlements, metering, usage, billing abstraction                                |
| 14  | **Operations**    | Observability, audit logs, health, analytics, telemetry, admin operations                |
| 15  | **Developer**     | SDKs, API contracts, MCP exposure, webhooks, CLI, schemas, extension contracts           |

---

## 11. Live Repo Boundary

**Platform Admin UI/page stays only in the live repo.**

Boundary:

```text
LIVE REPO
────────────────────────────
Landing
Auth UX
Onboarding UX
Workbench
Governance Workbench
Twin / AI Workbench
Platform Admin UI   ← HERE
Developer UI
Connector Marketplace UI

             │
             ▼

PLATFORM SDK / GATEWAY

             │
             ▼

PLATFORM REPO
────────────────────────────
Admin APIs
Admin capabilities
Tenant operations
Provider configuration
Runtime configuration
RBAC / policy
Billing / entitlement control
AI provider configuration
Model registry
Gateway configuration
Connector administration
Health / telemetry
Audit
Operational controls
```

Law:

> **Admin experience belongs to Live. Admin authority belongs to Platform.**

The live repo renders and orchestrates the Platform Admin page. The platform repo exposes the governed APIs, contracts, configuration, state, and operational capabilities behind it.

---

## 12. Development Boundary

**Live repo becomes the contract consumer and mock execution environment.**  
**Platform repo becomes the real capability implementation.**

```text
Live UI
   ↓
Platform Client
   ↓
Platform Contract
   ↓
Resolver
   ├── mock → Live mock endpoint
   └── remote → Platform gateway
```

Endpoint namespace:

```text
/api/platform/v1/auth/*
/api/platform/v1/tenants/*
/api/platform/v1/spine/*
/api/platform/v1/memory/*
/api/platform/v1/continuity/*
/api/platform/v1/integrations/*
/api/platform/v1/capabilities/*
/api/platform/v1/ai/*
/api/platform/v1/governance/*
/api/platform/v1/execution/*
/api/platform/v1/communication/*
/api/platform/v1/commercial/*
/api/platform/v1/operations/*
/api/platform/v1/admin/*
```

```env
PLATFORM_MODE=mock
PLATFORM_API_URL=/api/platform/v1
```

Later:

```env
PLATFORM_MODE=remote
PLATFORM_API_URL=https://platform.integratewise.ai/api/v1
```

**No UI changes.**

---

## 13. Mock Endpoint Law

> **Mock behavior may be fake. Contract, route, schema, status codes, pagination, errors, and state transitions must be real.**

Example:

If the Platform contract is:

```ts
AccountEntitySchema.parse({
  entityId: "acc_001",
  tenantId: "tenant_001",
  entityType: "account",
  attributes: { name: "Acme" },
  intelligence: { healthScore: 92 },
  provenance: [],
  version: 1,
});
```

then a mock returning only `{ name: "Acme", health: 92 }` is invalid. The mock must return the real contract shape.

---

## 14. Final Repo Shape

```text
integratewise-platform/
│
├── services/
│   ├── gateway
│   ├── identity
│   ├── tenancy
│   ├── spine
│   ├── memory
│   ├── continuity
│   ├── integration
│   ├── capability
│   ├── ai
│   ├── governance
│   ├── execution
│   ├── communication
│   ├── commercial
│   └── operations
│
├── packages/
│   ├── contracts
│   ├── sdk
│   ├── schemas
│   ├── config
│   ├── runtime
│   ├── provider-core
│   │
│   ├── providers/
│   │   ├── auth
│   │   ├── database
│   │   ├── cache
│   │   ├── queue
│   │   ├── storage
│   │   ├── vector
│   │   ├── search
│   │   ├── ai
│   │   ├── gateway
│   │   ├── connector
│   │   ├── oauth
│   │   ├── email
│   │   ├── billing
│   │   └── observability
│   │
│   ├── ai-sdk
│   ├── continuity-sdk
│   ├── governance-sdk
│   ├── integration-sdk
│   └── capability-sdk
│
├── migrations/
├── deployments/
├── scripts/
└── docs/
```

---

## 15. The Five Architecture Laws

1. **Product owns experience. Platform owns capability.**
2. **Platform contracts are canonical; providers are replaceable.**
3. **No provider SDK crosses into product code or domain services outside its adapter.**
4. **No model, agent, connector, or workflow writes directly to Spine. Canonical writes cross the governed state boundary.**
5. **Deployment configuration selects infrastructure; application architecture does not.**

---

## Canonical Source Status

| Doc                                            | Status                                        |
| ---------------------------------------------- | --------------------------------------------- |
| `docs/CANON.md`                                | Canonical index                               |
| `docs/architecture/PRODUCT_ARCHITECTURE.md`    | Canonical                                     |
| `docs/architecture/WORKBENCH_DOCTRINE.md`      | Canonical                                     |
| `docs/architecture/v2-ai-capability-fabric.md` | **Final AI / Provider Independence boundary** |

When conflict arises between this document and prior docs, this document is canonical.
