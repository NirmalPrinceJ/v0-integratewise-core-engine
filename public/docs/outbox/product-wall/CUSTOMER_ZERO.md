# CUSTOMER ZERO

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

Status: CURRENT
Scope: First real tenant activation model, current evidence, target canonical state
Canonical Owner: Platform / Customer Zero
Last Verified: 2026-07-11
Evidence Basis: docs/CANON.md, docs/architecture/ONBOARDING_FLOW.md, docs/internal/playbooks/tenant-onboarding-and-initial-hydration.md, docs/internal/operations/CUSTOMER_ZERO_FLOW_TEST.md, docs/FINAL_E2E_SYSTEM.md, docs/CANONICAL_STATE.md, docs/operations/ENDPOINT_MAP.md, docs/archive/CUSTOMER_ZERO_LAUNCH.md, docs/archive/IMPLEMENTATION_COMPLETE.md, Option B evidence, wrangler manifests, tests/playwright README
Supersedes: none
Superseded By: none

---

## 1. WHAT CUSTOMER ZERO IS

Customer Zero means:

```text
INTEGRATEWISE
USES
INTEGRATEWISE
AS ITS FIRST REAL TENANT
```

It is not a demo wizard.
It is not a frontend onboarding flow in isolation.
It is first real tenant activation of the actual platform.

---

## 2. CANONICAL CUSTOMER ZERO ACTIVATION MODEL

```text
LANDING
   ↓
ACTIVATE WORKSPACE
   ↓
PRE-AUTH INTENT if required
   ↓
AUTHENTICATE
   ↓
USER RESOLUTION
   ↓
ORGANIZATION / TENANT RESOLUTION
   ↓
WORKSPACE RESOLUTION
   ↓
ONBOARDING
   ↓
CONTEXT LENS / ROLE CONTEXT
   ↓
INTEGRATION MANAGER
   ↓
CONNECT REAL SYSTEM
   ↓
INITIAL HYDRATION
   ↓
NORMALIZATION
   ↓
SCHEMA SYNTHESIS WHEN REQUIRED
   ↓
CANONICAL WRITE
   ↓
INITIAL CONTINUITY
   ↓
L1 WORKBENCH READY
```

Each step must be satisfied with evidence before declaring activation advancement.

---

## 3. CURRENT EVIDENCE AND GAPS

Current repo evidence:

- Onboarding flow documents exist: `docs/architecture/ONBOARDING_FLOW.md`
- Tenant onboarding playbook exists: `docs/internal/playbooks/tenant-onboarding-and-initial-hydration.md`
- Customer Zero flow test exists: `docs/internal/operations/CUSTOMER_ZERO_FLOW_TEST.md`
- Playwright tests directory exists: `tests/playwright/README.md`
- Customer Zero launch docs exist in archive

Gaps requiring evidence:

- frontend flow type unknown: UI navigation, frontend state, API contract, integration, or true end-to-end
- Spine hydration state unclear: did hydration write reach canonical state?
- real system connection evidence unclear: did a real external system authorize, hydrate, normalize, and persist?
- canonical write authority unknown: wrote to pipeline, spine-writer, or direct database path?
- continuity initialization evidence unclear: was operational context persisted and recovered?
- L1 Workbench readiness requires end-to-end readback evidence

A frontend flow may be:

- SIMULATED
- PARTIAL
- REAL

Determine the actual state. Do not declare "activation complete" without platform evidence.

---

## 4. DO NOT TREAT FRONTEND FLOW AS ACTIVATION COMPLETION

The presence of a flow component or route such as `customer-zero-flow.tsx` does not prove:

- external system connection
- canonical write
- real hydration
- normalization execution
- continuity initialization

Evidence-based activation completion requires:

- successful end-to-end playback of Customer Zero activation
- verified canonical state after hydration
- verified Continuity state recovery
- verified platform runtime behavior, not just UI state transitions

---

## 5. DO NOT TREAT SPINE ROUTES AS PROOF OF SPINE INTEGRATION

If the Customer Zero frontend calls Next.js routes under `/api/spine/*`, the downstream must be traced:

- does this route proxy to the Gateway?
- does the Gateway call the canonical Spine writer?
- does the writer enforce governance and tenant isolation before canonical write?

Absent evidence, classify this path as UNKNOWN.

---

## 6. MCP AND CUSTOMER ZERO

Do not infer that MCP is required for Customer Zero activation.

Authorization issues such as the reported `tenant: integratewise`, `client: kiro-iw` 403 response block that path but do not establish MCP as the primary Customer Zero path unless alternative product routing proves it.

Customer Zero activation documentation must state:

- the exact product route
- the exact platform route
- evidence of operational success or failure

---

## 7. CURRENT CUSTOMER-ZERO VERDICT

Current evidence-based verdict is:

- Customer Zero documentation/activity exists
- Customer Zero runtime verification is DOCUMENTED_WITH_KNOWN_GAPS

Higher confidence:

- DOCUMENTED_WITH_KNOWN_GAPS

This is not a blocking verdict, but it is not a completion verdict.

Do not add Customer Zero to readiness claims until activation criteria above are replayed and readback-verified.

---

## 8. DOCUMENTS THAT PRECEDE THIS

- docs/internal/playbooks/tenant-onboarding-and-initial-hydration.md
- docs/architecture/ONBOARDING_FLOW.md
- docs/internal/operations/CUSTOMER_ZERO_FLOW_TEST.md
- docs/FINAL_E2E_SYSTEM.md
- docs/CANONICAL_STATE.md
- docs/archive/CUSTOMER_ZERO_LAUNCH.md
- docs/archive/IMPLEMENTATION_COMPLETE.md
- docs/internal/status/TWIN_DEPLOYMENT_STATUS.md

When conflict arises between this document and those documents, this document is canonical.
