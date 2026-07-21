# Canonical Runtime Restoration Plan

> **Status: PROPOSED**
>
> **Approved: NO**
>
> **Execution Authority: NONE**
>
> **Evidence Authority: `POST_STOP_FORENSIC_RECONCILIATION.md`**
>
> Historical annotation: the original status below claimed execution. No execution authority was granted, and this document must not be used as an operational instruction.

**Original Status Claim**: Executing Recommendation D from Active Runtime Topology Audit — **NOT APPROVED / NOT AUTHORITATIVE**  
**Target**: 18-Worker canonical architecture  
**Original Action Claim**: Deploy only canonical services; document migration path for historical traffic — **PROPOSAL ONLY**

---

## Canonical 18-Worker Target

```
1.  gateway                    - API entry, routing, TLS, rate limiting
2.  loader                     - Package loading, capability caching
3.  normalizer                 - Data normalization, canonical ID resolution
4.  schema-synthesis           - Schema inference, AI-driven generation
5.  spine-writer               - Operational Spine write path, entity mutations
6.  continuity                 - Continuity records, recovery, audit
7.  governance                 - Approval chains, policy evaluation
8.  hermes                     - Intelligent agent execution, decisions
9.  knowledge                  - Knowledge graph, reasoning queries
10. store                      - Data persistence, eventual consistency
11. workflow                   - Automation orchestration, triggers
12. webhook-ingress            - Inbound webhooks, routing, queuing
13. mcp-connector              - MCP protocol bridge, tool invocation
14. telemetry                  - Metrics, tracing, observability
15. admin                      - Administrative operations, tenant mgmt
16. tenants                    - Multi-tenancy context, isolation
17. billing                    - Usage metering, subscription
18. huggingface-inference      - Inference endpoint, model calls
```

---

## Deployment Status

### Already Deployed (Canonical)

- continuity → `integratewise-continuity` ✓
- hermes → `integratewise-hermes` ✓
- knowledge → `integratewise-knowledge` ✓
- store → `integratewise-store` ✓
- workflow → `integratewise-workflow` ✓
- webhook-ingress → `integratewise-webhook-ingress` ✓
- mcp-connector → `integratewise-mcp-connector` ✓
- admin → `integratewise-admin` ✓
- tenants → `integratewise-tenants` ✓
- billing → `integratewise-billing` ✓
- normalizer → `integratewise-normalizer` ✓
- loader → `integratewise-loader` ✓

### Missing or Incorrectly Named (Must Deploy)

- gateway → Deploy `integratewise-gateway` (canonical naming)
- telemetry → Deploy production telemetry service (currently only staging exists)
- spine-writer → **CRITICAL** - Not deployed; `integratewise-pipeline` exists but is legacy
- schema-synthesis → **CRITICAL** - Not deployed; unknown implementation
- governance → **CRITICAL** - Not deployed; `integratewise-govern` exists (wrong name)
- huggingface-inference → **CRITICAL** - Not deployed; inference endpoint missing

---

## Migration Strategy

### Phase 1: Canonicalize Naming (No Traffic Change)

Redirect legacy bare names to canonical `integratewise-*` variants using service bindings or routes:

- `gateway` → `integratewise-gateway`
- `pipeline` → (route to `integratewise-pipeline` if needed, or mark for decommission)
- `workflow` → `integratewise-workflow`
- `knowledge` → `integratewise-knowledge`
- `continuity` → `integratewise-continuity`

### Phase 2: Deploy Missing Canonical Services

1. Deploy `integratewise-gateway` if not already active
2. Deploy `schema-synthesis` (new service)
3. Deploy `governance` (replacing misnamed `govern`)
4. Deploy production `telemetry` service
5. Deploy `huggingface-inference` endpoint

### Phase 3: Migrate Traffic (Observed)

1. Inspect routes on legacy Workers to identify active endpoints
2. Migrate routes from historical to canonical variants
3. Update service bindings in canonical Workers to point to canonical targets
4. Monitor logs for errors during migration

### Phase 4: Decommission Historical Workers

1. Confirm no active bindings depend on historical Workers
2. Delete staging-only variants (`*-staging`, `*-test`)
3. Delete developer instances (`misty-brook-99b1d`, `orange-*`, etc.)
4. Delete duplicate legacy names (`gateway`, `pipeline`, `workflow` bare names)

### Phase 5: Verify Canonical Topology

1. List all remaining deployed Workers (should be ~18)
2. Verify all canonical service bindings point to canonical targets
3. Verify no active external traffic to historical Workers
4. Confirm telemetry and observability working on canonical services

---

## Implementation

**Current Status**: Awaiting execution  
**Estimated Duration**: 2–4 hours (depending on route inspection effort)  
**Risk**: LOW if historical Workers have no active bindings; HIGH if traffic is unknown
