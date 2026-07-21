-- =============================================================================
-- IntegrateWise Platform: Canonical Spine
-- =============================================================================
-- Table: spine_organizations
--
-- Entity Definition:
-- spine_organizations represents the root organizational entity in the
-- IntegrateWise platform's Canonical Spine architecture. It is the foundational
-- identity and multi-tenant scoping boundary for all platform resources.
--
-- In the platform model, organizations are the top-level containers that own
-- users, accounts, configurations, and operational data. All other entities are
-- scoped to an organization via the tenant_id column. Organizations may
-- represent customer tenants, partner workspaces, reseller entities, or internal
-- system organizations.
--
-- As one of the 16 root concepts in the Canonical Spine, all domain-specific
-- business types (CRMAccount, Ticket, Contract, etc.) are modeled in relation
-- to the organizational boundary defined by this entity. Concrete business types
-- inherit the platform pattern: id, tenant_id, canonical_id, version, typed
-- business truth columns, provenance JSON, and audit timestamps.
--
-- Design Principles:
-- - All business truth is stored in strongly typed columns. No JSONB data columns.
-- - All relationships are managed via the spine_relationships edge table.
-- - Provenance is required and tracks record origin: { source, record_id, actor }
-- - Every record is tenant-scoped via tenant_id.
-- =============================================================================

CREATE TABLE IF NOT EXISTS spine_organizations (
    -- ═══════════════════════════════════════════════════════════════════════
    -- Platform Pattern: Core Identity
    -- ═══════════════════════════════════════════════════════════════════════
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id TEXT NOT NULL,
    canonical_id TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,

    -- ═══════════════════════════════════════════════════════════════════════
    -- Business Truth: Organization Identity & Classification
    -- ═══════════════════════════════════════════════════════════════════════
    name TEXT NOT NULL,
    display_name TEXT,
    slug TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    type TEXT NOT NULL DEFAULT 'standard',
    tier TEXT,

    -- ═══════════════════════════════════════════════════════════════════════
    -- Business Truth: Locale & Routing
    -- ═══════════════════════════════════════════════════════════════════════
    timezone TEXT,
    locale TEXT,
    primary_domain TEXT,
    website TEXT,

    -- ═══════════════════════════════════════════════════════════════════════
    -- Business Truth: Contact & Identity
    -- ═══════════════════════════════════════════════════════════════════════
    contact_email TEXT,
    avatar_url TEXT,
    description TEXT,

    -- ═══════════════════════════════════════════════════════════════════════
    -- Provenance
    -- Required JSON shape: { source, record_id, actor }
    -- ═══════════════════════════════════════════════════════════════════════
    provenance TEXT NOT NULL,

    -- ═══════════════════════════════════════════════════════════════════════
    -- Audit Timestamps (Unix epoch seconds)
    -- ═══════════════════════════════════════════════════════════════════════
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch()),

    -- ═══════════════════════════════════════════════════════════════════════
    -- Constraints
    -- ═══════════════════════════════════════════════════════════════════════
    CONSTRAINT uq_spine_organizations_tenant_canonical
        UNIQUE (tenant_id, canonical_id),
    CONSTRAINT uq_spine_organizations_tenant_slug
        UNIQUE (tenant_id, slug)
);

-- ═════════════════════════════════════════════════════════════════════════════
-- Indexes
-- ═════════════════════════════════════════════════════════════════════════════

-- Primary lookup: tenant-scoped canonical identity
CREATE INDEX IF NOT EXISTS idx_spine_organizations_tenant_canonical
    ON spine_organizations(tenant_id, canonical_id);

-- Version tracking for optimistic concurrency and history
CREATE INDEX IF NOT EXISTS idx_spine_organizations_tenant_version
    ON spine_organizations(tenant_id, version);

-- Status filtering within tenant scope
CREATE INDEX IF NOT EXISTS idx_spine_organizations_tenant_status
    ON spine_organizations(tenant_id, status);

-- Global status filtering for operational queries
CREATE INDEX IF NOT EXISTS idx_spine_organizations_status
    ON spine_organizations(status);
