# Option B — Wave 0 Log

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Status:** Baseline and Git safety checkpoint — **RESOLVED.**

**Date:** 2026-07-11

---

## 1. Git safety checkpoint

A lightweight tag was created at the original HEAD commit:

- **Tag:** `option-b-wave0-baseline`
- **Original HEAD:** `1d058bf2` — "refactor: remove archive and stale content, add workspace pages and twin features"

A checkpoint commit was then made capturing the local working-tree restructure:

- **Commit:** `cc6d3eda`
- **Message:** "checkpoint: pre-Option B working tree restructure (capture local changes before migration)"

Working tree is now clean.

## 2. Working tree state (resolved)

The pre-existing local restructure has been committed. Key contents:

- `apps/workspace/` deleted.
- `apps/web/` added as untracked-in-working-tree-but-now-committed replacement.
- New services added: `services/capability-resolver/`, `services/core-engine/`, `services/huggingface-inference/`, `services/projection-engine/`, `services/projection-registry/`, `services/schema-ai/`.
- `_archive/` directory deleted.
- Option A/B deliverables committed: `REPOSITORY_RUNTIME_IDENTITY_CENSUS.md`, `OPTION_B_WAVE0_LOG.md`.

## 3. MCP-connector retention decision

**Evidence:**

- `services/mcp-connector/wrangler.toml` declares custom domain `mcp.integratewise.ai`.
- `services/mcp-connector/src/index.ts` exposes:
  - OAuth discovery endpoints (`/.well-known/oauth-*`, `/.well-known/openid-configuration`, `/.well-known/jwks.json`)
  - Dynamic client registration (`POST /oauth/register`)
  - Authorization/token endpoints
  - `/invoke` and `/v1/mcp/*` MCP protocol routes
  - Service bindings to `KNOWLEDGE`, `CONTINUITY`, `PIPELINE`
  - Queue producers `knowledge-ingest`, `pipeline-process`

**Decision:** `services/mcp-connector` is an **externally exposed MCP protocol runtime**.

**Verdict:** **RETAIN as standalone service.** Target deployment name: `iw-mcp-connector`.

## 4. Unresolved Wave 0 failures

None. Wave 0 complete.
