# INTEGRATION MANAGER

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

Status: CURRENT
Scope: Integration Manager platform capability
Canonical Owner: Platform / Integration Manager
Last Verified: 2026-07-11
Evidence Basis: docs/CANON.md, docs/platform-specs/08-connector-framework.md, docs/platform-specs/24-integration-manager.md, docs/platform-specs/05-capability-fabric.md, docs/migrations/DE_SUPABASE_MIGRATION.md, docs/internal/operations/ENDPOINT_MAP.md, docs/internal/runbooks/connector-oauth-troubleshooting.md, docs/architecture/ONBOARDING_FLOW.md, Option B branch evidence, wrangler manifests
Supersedes: none
Superseded By: none

---

## 1. WHAT INTEGRATION MANAGER IS

Integration Manager is the configuration center and adapter router for external system connection.

It does not own canonical truth.
It does not act as canonical transport layer except where explicitly authored.
It resolves capability routing for domain adapters such as:

- Nango
- MCP outbound adapters
- Native REST connections
- Webhook ingestion

Connection lifecycle:

- configuration and selection
- tenancy and credential isolation
- credential acquisition and refresh
- transport selection
- inbound/outbound event transformation
- hydration into operational queue handling
- downstream normalization path

---

## 2. INTEGRATION MANAGER AND HYDRATION

Hydration follows:

- onboarding connection approval
- initial data/event ingestion
- transformation/normalization
- canonical write through governed path
- continuity state update

Hydration must not be documented as customer-zero-ready solely because onboarding routes or flows exist.

Frontend hydration flow existence does not prove platform hydration, canonical write, or continuity initialization.

---

## 3. RETIRED-TECH LIMITS

Product-plane integration must not claim Supabase, Postgres, Vercel default hosting, or Cloud alternative persistence as canonical transport unless migration documentation shows completed replacement.

Integration Manager may reference legacy proof evidence for migration purposes only. Such reference must be labeled HISTORICAL.

---

## 4. DOCUMENTS THAT PRECEDE THIS

- docs/platform-specs/24-integration-manager.md
- docs/platform-specs/08-connector-framework.md
- docs/platform-specs/05-capability-fabric.md
- docs/architecture/ONBOARDING_FLOW.md
- docs/archive/AUTH_CONNECTOR_INTEGRATION.md
- docs/archive/TWO_LAYER_CONNECTION_MODEL.md
- docs/archive/UNIVERSAL_CONNECTION_POOL_ARCHITECTURE.md

When conflict arises between this document and those documents, this document is canonical.
