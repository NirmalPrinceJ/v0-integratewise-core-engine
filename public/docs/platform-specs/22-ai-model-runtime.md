# 22 — AI Model Runtime

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** third_region
> **Original line:** 3011
> **Lines:** 74 | **Chars:** 3,538
> **Status:** Raw extraction — requires review and canonicalization

22 — AI Model Runtime
22.1 Responsibilities
Own the AI Gateway at the model-routing layer (Cloudflare AI Gateway).
Model selection, routing, cost optimization, latency routing, fallback hierarchy.
Prompt versioning, evaluation, safety filters, caching, streaming.
22.2 Pipeline (preserves user’s ASCII diagram)
CopyUser Request
↓
Intent Detection
↓
Model Router
↓
Model Selection
↓
Tool Calls (via 05 Capability Fabric)
↓
Response Validation
↓
Memory Commit (via 07 Memory → L1)
22.3 Inputs
Twin chat (06).
Workflow steps (11) calling capability cap*llm_x.
Ad-hoc admin calls from /ai/run.
22.4 Outputs
Streamed (SSE or chunked) or buffered model output.
Memory intake events (07 / L1).
Cost/latency metrics (16, 30).
22.5 Events produced
ModelRouted, ModelInvoked, ModelStreamingStarted, ModelCompleted, ModelFailed, ModelFallbackEngaged, PromptVersionUsed, SafetyFilterTriggered, CacheHit, CacheMiss, EvalRunCompleted.
22.6 Events consumed
TwinChat, CapabilityInvoked (when capability is llm*\*), WorkflowStepStarted.
22.7 APIs
POST /ai/run, POST /ai/route, POST /ai/eval, GET /ai/prompts/{prompt_id}/versions, POST /ai/prompts/{prompt_id}/publish.
22.8 State transitions
Per invocation: received → intent → routed → invoked → streaming → validating → completed | failed | fallback | aborted. Prompt versions: draft → canary → stable → deprecated → removed. Safety filters: bypass → warn → block → quarantine.

22.9 Failure handling
Primary model timeout → fallback to next in hierarchy (22.10).
Fallback exhaustion → degrade to “Last Good Answer” projection (06.10).
Safety filter trigger: warn returns redacted content, block denies, quarantine sends to admin review.
Eval regression detected on stable prompt version → auto-rollback to last known-good version.
22.10 Fallback hierarchy (default)
Primary (provider × model) per tenant*spine_config.model_profile.
Cheap secondary (smaller/cheaper model same vendor).
Cross-vendor secondary.
Cached prior good response (cache TTL ≤ 7 d).
Persona-template static fallback (“Last Good Answer”).
Quarantine + alert.
22.11 Cost & latency routing
Per-route cost_budget_per_turn_cents and p95_latency_ms.
Router picks provider/model by (capability_needed × cost × latency × traffic_class).
Off-peak windows may choose smaller models automatically; near SLA breach escalates to premium model.
22.12 Prompt versioning
Every prompt template is a mod_prompt*{id} with version (semver), status, owner, evalset*ref.
Browse + diffing in CLI (iw prompt diff v1.4 v1.5).
Canary rollout through feature flags (15.3, 19.4).
22.13 Evaluation
evalset = golden prompts × expected behaviors (text, tool-calls, JSON schema, refusal). Runs on every prompt publish and every model swap.
Run record: mod_evalrun*{id} with pass/fail per expectation; downstream alerting.
22.14 Safety filters
Categories: PII exfiltration, jailbreak, toxicity, secret-leak, prompt-injection, vendor-policy-violation.
Levels: bypass (debug only), warn, block, quarantine.
Tenant overrides require governancePolicy=judicial (09).
22.15 Caching
Prompt-level cache keyed by prompt_id + version + params_hash.
Response cache keyed by prompt_id + version + params_hash + tenant.tier.
TTL configurable; default 7 d.
22.16 Streaming
Workspaces and Chat both consume via SSE; mobile via chunked JSON.
Late chunk miss → fetch from response cache; surface degraded badge.
22.17 Extension points
Custom router strategies AI_ROUTER(name).
Custom safety filters SAFETY_FILTER(name).
New model provider adapters via @integratewise/connector-sdk.
