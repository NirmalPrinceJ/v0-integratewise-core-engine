# Getting Started

This guide is for developers and technical partners who want to understand IntegrateWise as an integration and extension target, not just as an end-user product.

## Prerequisites

- A workspace tenant and user account with access to at least one domain.
- Access to the systems you intend to connect.
- Developer access to review API behaviors, webhook behaviors, and capability availability.

Recommended reading before integration work:

- `docs/spec/INTEGRATEWISE_CANONICAL_SPEC_v1.0.md`
- `docs/architecture/PRODUCT_ARCHITECTURE.md`
- `docs/internal/operations/API_REFERENCE.md`

## What IntegrateWise is

IntegrateWise is a governed operational continuity platform. At the product layer, it gives users a connected Workbench and a persistent Twin. At the platform layer, it normalizes operational context, reasons across connected systems, and executes approved actions with full traceability.

For partners and integrators, the most important concept is the **four-path integration model**:

- API Connector
- MCP Connector
- AI Connector
- API Wrapper

Each path has a distinct contract, auth lifecycle, capability surface, and governance boundary. Do not collapse them into one generic “integration connector” model.

## What this docs site covers

- Platform and runtime architecture.
- Integration setup and capability wiring.
- Governance, execution, observability, and incident behavior.
- Operational runbooks and troubleshooting.

This site does not cover end-user marketing positioning, pitch decks, or selling language. For that, see `docs/marketing/` and `docs/public/` only if you need context, but treat them as Tier B material under `docs/CANON.md`.

## How to use this site

Start from the conceptual docs, then move to implementation and operations:

1. Platform Overview
2. Runtime Topology
3. Integration Manager
4. Connectors
5. Capability Fabric
6. Core Concepts
7. Operations and Runbooks

If you are integrating externally, pay special attention to governance, approval tokens, execution plans, and outcome ingestion. Those are the external contract boundaries.
