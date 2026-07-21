# Presentation Outline

## Page 1 [cover]

- **Title**: IntegrateWise Platform Architecture Suite
- **Content**: v1.0 Architecture Freeze | 35 Documents | 00–34 Complete

## Page 2 [table_of_contents]

- **Title**: Executive Overview
- **Content**: 1. Vision & Doctrine; 2. Core Platform Architecture; 3. Advanced Subsystems; 4. Runtime Contracts & Roadmap

## Page 3 [chapter]

- **Title**: 01 Vision & Doctrine
- **Content**: The operating system that converts AI distribution into tenant truth

## Page 4 [content]

- **Title**: 8 Unifying Doctrines Define Every Decision
- **Content**: From the 00 Vision & Doctrine doc. Core doctrines: Distribution is ingress, Truth you own, AI you rent, Approval in between, One capability every surface, Continuity over asking, Persona barrier, Hard gates are non-negotiable. These 8 doctrines are held constant across all 35 documents and guide every architectural choice.

## Page 5 [chapter]

- **Title**: 02 Core Platform
- **Content**: 15 documents defining the foundational subsystems

## Page 6 [content]

- **Title**: The 7-Layer Reference Stack
- **Content**: From 01 Platform Architecture. Distribution surfaces (ChatGPT, Claude, Perplexity, Web, Slack) → Gateway (Cloudflare Worker, RS256 JWT) → Operational Spine (D1 + DO, canonical entities + timeline) → Projection Engine + Twin Runtime + Workflows → Capability Fabric (soft|real|propose sync) → Connectors (Nango, MCP, Native) → Systems of Record (Salesforce, HubSpot, Jira, NetSuite).

## Page 7 [content]

- **Title**: The Operational Spine Is Canonical Truth
- **Content**: From 02 Operational Spine. Event-sourced append-only timeline. Canonical entity graph: Tenant → Workspace → Entity → Relationship → Timeline → Evidence → Signal → Capability → Memory. Type-prefixed nanoid IDs (ent*, cap*, mem\_). Entity lifecycle: draft → active → archived → soft-deleted → hard-deleted (judicial only). Temporal queries via ?as_of=ISO8601. Merge/conflict rules: most-recent wins except pinned fields and governance-required fields.

## Page 8 [content]

- **Title**: Twin Runtime Drives the OODA Loop
- **Content**: From 06 Twin Runtime. Flow: User input → Context Builder → Memory Retrieval (L1–L7) → Evidence Ranking → Prompt Builder → LLM call → Tool selection → Confidence calibration → Proposal generation → Twin response. Persona grammar: Maya (Sales), Sana (CS), Tomás (Engineering). Activation gate: minimum memory depth, governance posture, Continuity Bridge non-empty. Failure: LLM timeout → "Last Good Answer" projection.

## Page 9 [content]

- **Title**: Memory Pipeline + Governance Engine
- **Content**: From 07 Memory System + 09 Governance Engine. Memory: 8 layers from L1 Twin Memory (ephemeral) to L8 Knowledge (SOPs). L5 Promotion Queue = single most important screen. L6 Human Approval gates every memory promotion. Governance: Confidence ≥0.85 = auto-approve; 0.70–0.85 = single approver; <0.70 = multi-level chain. Judicial posture = N-of-M approvers. Emergency overrides require MFA + auto-audit.

## Page 10 [chapter]

- **Title**: 03 Advanced Subsystems
- **Content**: 14 documents closing the execution model, extensibility, and maintainability gaps

## Page 11 [content]

- **Title**: Business Ontology + AI Model Runtime
- **Content**: From 21 Business Ontology + 22 AI Model Runtime. Ontology: 16 root concepts (Organization, Workspace, Person, Team, Process, Project, Objective, Outcome, Asset, Knowledge, Decision, Policy, Capability, Signal, Memory, Conversation). Everything inherits from Thing. AI Runtime: Intent detection → Model router → Model selection → Tool calls → Response validation → Memory commit. Fallback hierarchy: primary → cheap secondary → cross-vendor → cached → static → quarantine. Safety filters: PII, jailbreak, toxicity, secret-leak, prompt-injection.

## Page 12 [content]

- **Title**: Infrastructure: Cloudflare-Native Topology
- **Content**: From 15 Deployment Architecture + 14 Security + 16 Observability. Gateway (Worker) → Workers (stateless) → Queues → D1 + DO → KV → R2 → Durable Objects → External Connectors. Zero Trust: every request authenticated + authorized. Tenant isolation: row-level + per-tenant DO. Secrets: Cloudflare Secrets + KMS, 90-day rotation. Observability: OpenTelemetry traces, structured logs, 7-year audit retention, P0 alert ≤5 min.

## Page 13 [chapter]

- **Title**: 04 Runtime Contracts
- **Content**: Every subsystem has explicit contracts — no hidden dependencies

## Page 14 [content]

- **Title**: Uniform Runtime Contract Across All 35 Subsystems
- **Content**: Every doc (02–34) carries identical contract template: Responsibilities, Inputs, Outputs, Events produced, Events consumed, APIs, State transitions, Failure handling, Extension points. Cross-spec evolution rule: update Spine vocabulary first → update producers → update consumers → bump schema_version → roll out under feature flag. Business Ontology cross-references ensure every subsystem inherits from canonical root concepts.

## Page 15 [content]

- **Title**: Implementation Roadmap: Three Buckets
- **Content**: Architecture complete. Remaining work categorized: Implementation artifacts (PRDs per module, Database DDL, OpenAPI specs, Infrastructure-as-Code, Coding standards) → Engineering team. Operational artifacts (Security audits, Compliance evidence, SLOs/SLIs, Capacity planning) → SRE + SecOps + Compliance. End-user artifacts (End-user docs, Admin guides) → Product + Documentation. Hand-off rule: every implementation artifact must reference, not duplicate, the architecture doc that defines its contract.

## Page 16 [final]

- **Title**: Architecture Freeze v1.0
- **Content**: 35 documents. 00–34. Complete for architecture. Ready for execution. The suite is the single contract. Teams reference it. The architecture DRI maintains it through Evolution Strategy (31). Nothing redefines it in the dark.
