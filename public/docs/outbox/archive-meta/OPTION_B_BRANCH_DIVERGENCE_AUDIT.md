# OPTION B BRANCH DIVERGENCE AUDIT

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Generated**: 2025-07-11  
**Audit Scope**: Gateway/Connector Service-Binding Decoupling (Wave 0) vs. `origin/main` Restructure

---

## 1. COMMIT LINEAGE SNAPSHOT

| Ref                    | SHA        | Description                                                                         |
| ---------------------- | ---------- | ----------------------------------------------------------------------------------- |
| **local `main` HEAD**  | `351e95d9` | Merge PR #59 — identical to `origin/main`                                           |
| **`origin/main` HEAD** | `351e95d9` | Merge PR #59 (recovery/v1-clean-main)                                               |
| **Work Commit**        | `afbdb538` | `OPTION B WAVE 0 COMPLETION: Gateway decoupling complete with service bindings`     |
| **Checkpoint Commit**  | `cc6d3eda` | `checkpoint: pre-Option B working tree restructure`                                 |
| **Refactor Commit**    | `1d058bf2` | `refactor: remove archive and stale content, add workspace pages and twin features` |
| **Merge-Base**         | `db9b3b4e` | `feat: merge all 4 source zips by app and department`                               |

### Commit Count Since Merge-Base

- **`origin/main`**: 2 commits (`cdd2a4af`, `351e95d9`)
- **Work Branch (local only)**: 3 commits (`afbdb538`, `cc6d3eda`, `1d058bf2`)
- **`gateway-decoupling-complete` (remote)**: Reset to `origin/main` — **work not present on remote branch**

---

## 2. PATH-LEVEL DIVERGENCE ANALYSIS

### 2.1 The 11 Files Modified by Gateway/Connector Decoupling (Commit `afbdb538`)

| #   | Path                                          | Exists on `origin/main` | Changed on `origin/main` since merge-base | Changed on Work Branch | Conflict Risk | Recommended Replay Method    |
| --- | --------------------------------------------- | ----------------------- | ----------------------------------------- | ---------------------- | ------------- | ---------------------------- |
| 1   | `OPTION_B_WAVE0_LOG.md`                       | ❌ No (new)             | N/A                                       | ✅ Created             | **None**      | Clean cherry-pick (new file) |
| 2   | `services/connector/src/connector.test.ts`    | ✅ Yes                  | ❌ No                                     | ✅ Modified            | **None**      | Clean cherry-pick            |
| 3   | `services/connector/src/index.ts`             | ✅ Yes                  | ❌ No                                     | ✅ Modified            | **None**      | Clean cherry-pick            |
| 4   | `services/connector/wrangler.toml`            | ✅ Yes                  | ❌ No                                     | ✅ Modified            | **None**      | Clean cherry-pick            |
| 5   | `services/gateway/src/index.ts`               | ✅ Yes                  | ❌ No                                     | ✅ Modified            | **None**      | Clean cherry-pick            |
| 6   | `services/gateway/wrangler.toml`              | ✅ Yes                  | ❌ No                                     | ✅ Modified            | **None**      | Clean cherry-pick            |
| 7   | `services/loader/src/index.ts`                | ✅ Yes                  | ❌ No                                     | ✅ Modified            | **None**      | Clean cherry-pick            |
| 8   | `services/loader/src/lib/nango.ts`            | ✅ Yes                  | ❌ No                                     | ✅ Created             | **None**      | Clean cherry-pick (new file) |
| 9   | `services/loader/src/lib/token-refresh.ts`    | ✅ Yes                  | ❌ No                                     | ✅ Created             | **None**      | Clean cherry-pick (new file) |
| 10  | `services/mcp-connector/src/lib/oauth-jwt.ts` | ✅ Yes                  | ❌ No                                     | ✅ Created             | **None**      | Clean cherry-pick (new file) |
| 11  | `services/mcp-connector/src/oauth.test.ts`    | ✅ Yes                  | ❌ No                                     | ✅ Modified            | **None**      | Clean cherry-pick            |

**Summary**: **All 11 files are unchanged on `origin/main` since the merge-base `db9b3b4e`**. Zero content conflicts expected.

---

## 3. SERVICE BINDING TOPOLOGY VALIDATION

### 3.1 Bindings Introduced by Work Commit

| Binding   | Target Service | Target Worker Name            | Exists on `origin/main`                       |
| --------- | -------------- | ----------------------------- | --------------------------------------------- |
| `ADMIN`   | Admin          | `integratewise-admin`         | ✅ Service exists (`services/admin/`)         |
| `BILLING` | Billing        | `integratewise-billing`       | ✅ Service exists (`services/billing/`)       |
| `TENANTS` | Tenants        | `integratewise-tenants`       | ✅ Service exists (`services/tenants/`)       |
| `LOADER`  | Loader         | `integratewise-loader`        | ✅ Service exists (`services/loader/`)        |
| `MCP`     | MCP Connector  | `integratewise-mcp-connector` | ✅ Service exists (`services/mcp-connector/`) |
| `STORE`   | Store          | `integratewise-store`         | ✅ Service exists (`services/store/`)         |

### 3.2 Binding Name Conflicts on `origin/main`

| Binding   | Defined on `origin/main` (gateway) | Defined on `origin/main` (connector) | Conflict? |
| --------- | ---------------------------------- | ------------------------------------ | --------- |
| `ADMIN`   | ❌ No                              | N/A                                  | No        |
| `BILLING` | ❌ No                              | N/A                                  | No        |
| `TENANTS` | ❌ No                              | N/A                                  | No        |
| `LOADER`  | N/A                                | ❌ No                                | No        |
| `MCP`     | ❌ No (only in `[env.test]`)       | ❌ No (commented in default)         | No        |
| `STORE`   | N/A                                | ❌ No                                | No        |

**Verdict**: No binding name conflicts. All six bindings are new additions that don't collide with existing bindings on `origin/main`.

### 3.3 Service Deployment Names Verification

All six target worker names (`integratewise-admin`, `integratewise-billing`, `integratewise-tenants`, `integratewise-loader`, `integratewise-mcp-connector`, `integratewise-store`) correspond to actual service directories on `origin/main`. The Cloudflare Worker deployment names match the service binding `service = **service** values.

---

## 4. REPLAY FEASIBILITY MATRIX

| Factor                    | Assessment                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Content overlap**       | None — zero files modified on `origin/main` since merge-base                                           |
| **Binding conflicts**     | None — all six bindings are fresh additions                                                            |
| **Service existence**     | ✅ All six target services exist on `origin/main`                                                      |
| **File move/rename risk** | None — file paths identical between branches                                                           |
| **Test impact**           | Only `connector.test.ts` and `oauth.test.ts` modified; no test infrastructure changes on `origin/main` |
| **Config schema drift**   | `wrangler.toml` schema unchanged; only `[[services]]` blocks added                                     |

**Overall Replay Risk**: **LOW** — Clean cherry-pick expected for all 11 files.

---

## 5. RECOMMENDATION

### **A. Clean cherry-pick onto a new branch from `origin/main`**

**Rationale**:

1. All 11 files are unchanged on `origin/main` since the merge-base
2. No binding name conflicts exist
3. All target services exist and are deployed
4. The work commit (`afbdb538`) is a single, coherent logical unit
5. Cherry-pick will preserve authorship, commit message, and history
6. No manual conflict resolution required

### Execution Plan (when approved):

```bash
# 1. Create fresh branch from canonical origin/main
git fetch origin
git checkout -b option-b/wave0-gateway-decoupling origin/main

# 2. Cherry-pick the work commit (single commit, clean)
git cherry-pick afbdb538

# 3. Verify all 11 files applied correctly
git diff origin/main --stat

# 4. Run typecheck/lint (if tooling available)
# npm run typecheck && npm run lint

# 5. Push for PR
git push -u origin option-b/wave0-gateway-decoupling
```

---

## 6. BRANCH STRATEGY GOING FORWARD

| Phase             | Branch                                 | Base                 | Purpose                                                       |
| ----------------- | -------------------------------------- | -------------------- | ------------------------------------------------------------- |
| **Wave 0 (done)** | `option-b/wave0-gateway-decoupling`    | `origin/main`        | Gateway + Connector service bindings                          |
| **Wave 1**        | `option-b/wave1-intelligence-pipeline` | `option-b/wave0-...` | Intelligence (think/act/govern) + Pipeline (normalizer/spine) |
| **Wave 2**        | `option-b/wave2-...`                   | `option-b/wave1-...` | Remaining services                                            |

**Never** rebase `gateway-decoupling-complete` (remote is stale).  
**Never** merge `main` → feature branch (linear history required).  
**Always** cherry-pick forward from `origin/main` for each new wave.

---

## 7. ARTIFACTS PRESERVED

The following work artifacts exist in commit `afbdb538` (local only, recoverable via reflog `HEAD@{9}`):

- `services/gateway/src/index.ts` — ADMIN/BILLING/TENANTS routing via service bindings
- `services/gateway/wrangler.toml` — `[[services]]` for ADMIN, BILLING, TENANTS (default/test/prod)
- `services/connector/src/index.ts` — LOADER/MCP/STORE routing via service bindings
- `services/connector/wrangler.toml` — `[[services]]` for LOADER, MCP, STORE (default/test/prod)
- `services/mcp-connector/src/lib/oauth-jwt.ts` — Shared JWT signing utility (decoupled from gateway)
- `services/mcp-connector/src/oauth.test.ts` — Updated import path
- `services/loader/src/lib/nango.ts` + `token-refresh.ts` — Loader library modules
- `services/connector/src/connector.test.ts` — Integration test suite
- `OPTION_B_WAVE0_LOG.md` — Wave 0 completion log

---

## 8. DECISION REQUIRED

**Approve Option A** to proceed with clean cherry-pick onto new branch from `origin/main`.

Once approved, Wave 1 (Intelligence + Pipeline decoupling) can begin on the validated Wave 0 base.
