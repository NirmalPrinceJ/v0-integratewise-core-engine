-- =============================================================================
-- spine_tenants
-- =============================================================================
-- Table:         spine_tenants
-- Description:   Platform-level root entity defining multi-tenant organizations.
--                 Every tenant is a scoped organization that owns all other
--                 entities in the IntegrateWise platform. Tenant records support
--                 hierarchical multi-tenancy via tenant_id self-reference.
--                 Root tenants have tenant_id = NULL.
-- Inherits:      Root Concept (one of 16 platform root concepts)
-- Pattern:        id, tenant_id, canonical_id, version, business truth, provenance,
--                 created_at, updated_at
-- Relationships:  Stored in spine_relationships (typed edge table); no JSON edges
-- Target:        Cloudflare D1 (SQLite-compatible)
-- =============================================================================

CREATE TABLE IF NOT EXISTS spine_tenants (
    -- Identity & versioning (platform standard pattern)
    id            TEXT PRIMARY KEY,                       -- UUID v4, immutable
    tenant_id     TEXT,                                   -- Parent tenant for hierarchical multi-tenancy; NULL for root tenants
    canonical_id  TEXT NOT NULL,                          -- Stable business identifier (e.g., org slug, external system ID)
    version       INTEGER NOT NULL DEFAULT 1,             -- Optimistic locking version; increments on every update

    -- Business truth columns (typed, no JSONB)
    -- These columns represent the universal, platform-level attributes of a tenant.
    -- Domain-specific columns (e.g., cs_score, churn_risk) belong in Dynamic Memory, not here.
    name            TEXT NOT NULL,                        -- Display name of the tenant/organization
    slug            TEXT NOT NULL,                        -- URL-friendly unique identifier (e.g., 'acme-corp')
    status          TEXT NOT NULL DEFAULT 'active',       -- Tenant lifecycle state: active, suspended, pending, archived
    tier            TEXT NOT NULL DEFAULT 'free',         -- Billing/service tier: free, basic, premium, enterprise
    region          TEXT NOT NULL DEFAULT 'us-east',      -- Data residency region for compliance and latency
    primary_domain  TEXT,                                 -- Primary domain for workspace/email routing (e.g., 'acme.com')
    contact_email   TEXT,                                 -- Primary administrative contact email
    timezone        TEXT DEFAULT 'UTC',                   -- Default timezone for the tenant's operations and scheduling

    -- Provenance: JSON object { source, record_id, actor }
    -- Tracks the origin of this record for audit, lineage, and sync reconciliation.
    --   source:    string — name of originating system (e.g., 'web', 'api', 'import', 'webhook', 'migration')
    --   record_id: string — identifier in the source system (for re-sync and deduplication)
    --   actor:     string — ID of the user or service that created/updated this record
    provenance      TEXT NOT NULL,

    -- Audit timestamps (ISO 8601 format in UTC)
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),

    -- Constraints
    FOREIGN KEY (tenant_id) REFERENCES spine_tenants(id) ON DELETE CASCADE,
    UNIQUE(tenant_id, canonical_id),                      -- Canonical ID is unique within a tenant scope
    CHECK(status IN ('active', 'suspended', 'pending', 'archived')),
    CHECK(tier   IN ('free', 'basic', 'premium', 'enterprise'))
);

-- Indexes for efficient querying
-- Standard spine lookup: retrieve a tenant by its stable business identifier within a scope
CREATE INDEX IF NOT EXISTS idx_spine_tenants_tenant_canonical
    ON spine_tenants(tenant_id, canonical_id);

-- Versioned queries: filter or sort by version within a tenant (e.g., optimistic locking checks)
CREATE INDEX IF NOT EXISTS idx_spine_tenants_tenant_version
    ON spine_tenants(tenant_id, version);

-- Workspace routing: lookup tenant by slug (used in URL-based routing, API authentication)
CREATE INDEX IF NOT EXISTS idx_spine_tenants_slug
    ON spine_tenants(slug);

-- Status filtering: list active tenants, bulk operations on suspended tenants, etc.
CREATE INDEX IF NOT EXISTS idx_spine_tenants_status
    ON spine_tenants(status);
