# MCP

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

Status: CURRENT
Scope: MCP protocol boundary, role, endpoints, authorization, integration blockers
Canonical Owner: Platform / MCP
Last Verified: 2026-07-11
Evidence Basis: docs/CANON.md, docs/FINAL_E2E_SYSTEM.md, docs/platform-specs/19-api-contracts.md, docs/ip/tech/MCP_OAUTH_ARCHITECTURE.md, docs/internal/operations/API_REFERENCE.md, docs/internal/operations/CUSTOMER_ZERO_FLOW_TEST.md, wrangler manifests for mcp-connector and webhook-ingress, Option B divergence audit, documented MCP auth evidence
Supersedes: none
Superseded By: none

---

## 1. MCP IS A PROTOCOL, NOT A PRODUCT DATA PLANE

MCP is a protocol/tool boundary.

```text
L1 PRODUCT
      ↓
PLATFORM FACADE / GATEWAY
```

```text
MCP CLIENT / AGENT
      ↓
MCP CONNECTOR
      ↓
TOOLS / PLATFORM CAPABILITY
```

MCP must not be documented as the normal L1 product data plane.

MCP is an externally authenticated protocol surface connecting AI assistants and tools to governed IntegrateWise capability.

---

## 2. CURRENT RUNTIME BOUNDARIES

Current wrangler manifests show:

- services/mcp-connector exposes route `mcp.integratewise.ai`

Current repo must not assume other MCP pools or secondary MCP home names unless explicitly documented in tenant/runtime evidence.

---

## 3. CURRENT AUTHORIZATION STATE

Reported unresolved MCP client authorization issue:

- tenant: integratewise
- client: kiro-iw
- result: 403

Classification: Current integration blocker if reproduction is still valid.

Documentation must not classify MCP as required for Customer Zero activation unless verified.

Inbound MCP configuration documentation must not be published before tenant and client registration are authorized and verified.

---

## 4. MCP POOL DOCUMENTATION BAN

The `iw-mcppool-mcp-server` must not be documented as the Customer Zero backend unless actual product routing proves it.

Customer Zero activation documentation must use verified Spine/Gateway paths unless alternative paths are explicitly tested and authorized.

---

## 5. DO NOT TREAT MCP AS DEFAULT L1 BACKEND

MCP is not automatically the default Customer Zero backend.

MCP is not a fallback connection for the L1 product when Gateway/projection paths are uncertain.

MCP is:

- an AI and tool access boundary
- a governed discovery, capability query, and action invocation surface
- a protocol path for authorized tenants/clients

If Customer Zero or onboarding needs a non-MCP path, document that fact explicitly.

---

## 6. DOCUMENTS THAT PRECEDE THIS

- docs/FINAL_E2E_SYSTEM.md §5
- docs/platform-specs/19-api-contracts.md
- docs/ip/tech/MCP_OAUTH_ARCHITECTURE.md
- docs/ip/tech/MCP_ADK_ROUTING_SPINE_MEMORY_ARCHITECTURE.md
- docs/archive/MCP_ADK_SPINE_CACHE_ARCHITECTURE.md

When conflict arises between this document and those documents, this document is canonical.
