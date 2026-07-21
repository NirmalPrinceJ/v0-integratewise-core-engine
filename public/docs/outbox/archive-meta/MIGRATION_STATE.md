# MIGRATION STATE

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

Status: CURRENT
Scope: Option B migration state, product reconciliation, Supabase removal, auth mission state
Canonical Owner: Platform
Last Verified: 2026-07-11
Evidence Basis: docs/CANON.md, docs/migrations/DE_SUPABASE_MIGRATION.md, docs/architecture/l1-reality-check.md, OPTION_B_BRANCH_DIVERGENCE_AUDIT.md, OPTION_B_WAVE0_LOG.md, wrangler manifests, README.md, Option B worktree evidence, customer-zero evidence
Supersedes: none
Superseded By: none

Disclaimer: This document reports migration state based on documented and manifest evidence, not inferred operational facts. Deployment, runtime, and end-to-end completion remain separately verified.

---

## 1. MIGRATION TARGET OVERVIEW

Current enterprise direction: Option B product reconciliation.

Option B collapses or repositions historical runtime identities into canonical platform boundaries and Platform/Product boundaries. Target runtime topology is expected to converge around:

- gateway
- loader
- normalizer
- schema-synthesis
- spine-writer
- continuity
- governance
- hermes
- knowledge
- store
- workflow
- webhook-ingress
- mcp-connector
- telemetry
- huggingface-inference
- admin
- tenants
- billing

Historical or deprecated runtime identities expected to migrate:

- act
- agent-registry
- connector
- folder-watcher
- govern
- intelligence
- iw-agent-runtime
- l2
- pipeline
- signals
- think
- twin-orchestrator

Migration completion criteria:

- customer-zero activation end-to-end on canonical topology
- one-auth enforcement on production runtime
- Supabase removal complete in product runtime
- package topology stabilized
- frontend corpus consolidated into L1 target app

Current state is not complete. Classification for each migration thread is below.

---

## 2. SUPABASE REMOVAL

Target: Supabase removed from product plane.

Evidence of current partial state:

- Supposedly still ~71 code references to Supabase in repo
- WRANGLER manifests for services/act, services/govern, services/tenants, services/billing, services/store reference SUPABASE_URL secrets
- docs/migrations/DE_SUPABASE_MIGRATION.md treats removal as in progress
- docs/architecture/l1-reality-check.md documents Supabase entanglement

Classification:

- Removed: UNKNOWN
- In progress: CURRENT
- Complete: NO

Do not document as complete.

---

## 3. ONE-AUTH ENFORCEMENT

Target: one-auth enforcement on production runtime.

Evidence:

- docs/FINAL_E2E_SYSTEM.md and docs/CANON.md cite DECISION 22 combined with auth rationalization plans
- docs/architecture/l1-reality-check.md documents Auth model still using Supabase Auth earlier than target JWT Gateway auth in some corpus
- Option B does not conclude auth migration as complete

Classification: CURRENT in migration, UNKNOWN whether enabled in production runtime.

---

## 4. FRONTEND CORPUS MIGRATION

Target: single L1 Workbench app substantially replacing historical Next.js Vercel multi-page corpus.

Options documented under migration history include:

- dual-repo strategy
- Vite + Cloudflare Pages canonical surface
- legacy Next.js surface retained temporarily as Customer Zero consumer

Current evidence:

- apps directories present: apps/web, apps/workspace, apps/desktop, apps/mobile, apps/docs
- docs/architecture/l1-reality-check.md documents Next.js entanglement
- canonical target remains apps/web unless evidence shifts

Classification: MIGRATING

---

## 5. PACKAGE TOPOLOGY STABILIZATION

Target package publication surface:

- contracts
- canonical
- auth-sdk
- tenant-sdk
- spine-sdk
- continuity-sdk
- governance-sdk
- capability-sdk
- integration-sdk

Current evidence:

- packages/types and other existing packages exist in manifest notation
- many packages present but not necessarily matching canonical target
- backup packages named config-backup-_ and types-backup-_ suggest recent consolidation without yet settled publication truth

Classification: MIGRATING

All backup packages must be classified:

- KEEP
- MERGE
- REPOSITION
- ARCHIVE
- UNKNOWN

Do not assume stabilization is complete until package filesystem and package metadata prove it.

---

## 6. OPTION B WAVE 0 EVIDENCE

OPTION_B_BRANCH_DIVERGENCE_AUDIT.md evidences a clean cherry-pick feasibility for Wave 0 gateway/connector decoupling.

Wave 0 artifacts include:

- services/gateway/wrangler.toml bindings for ADMIN, BILLING, TENANTS
- services/connector/wrangler.toml bindings for LOADER, MCP, STORE
- services/loader/lib/nango.ts and token-refresh.ts
- services/mcp-connector/lib/oauth-jwt.ts
- connector and OAuth tests

Classification:

- Work merged onto local worktree: YES
- Approved for canonical branch: NO, pending
- Cherry-pickable with LOW risk: evidence supported

---

## 7. WORKSPACE LAYER CONSOLIDATION

Target platforms/experience separation rules:

- Platform = services/packages/runtimes
- Experience = apps/UIs
- Workbench reserved for primary end user experience only

Current state:

- services/wrangler manifests show extensive runtime coverage
- apps corpora show multiple app surface candidates
- doc legacy shows Workbench Doctrine spanning multiple workbench types

Classification: MIGRATION IN PROGRESS, platform/experience boundary documents need finalization.

---

## 8. MIGRATION COMPLETION CRITERIA

Do not declare migration complete without evidence for each of:

- Supabase removal verified
- One-auth enforced
- Package topology matches target publish boundary
- Frontend corpus evaluated against apps/web canonical mission
- Runtime topology matches target service identities
- Customer Zero activation end-to-end verified
- Documentation lifecycle labels accurate across corpus
