-- =============================================================================
-- Table: spine_relationships
-- =============================================================================
-- Description:
--   Platform-level typed edge table for the Canonical Spine.
--   Stores directed, typed relationships between any two tenant-scoped entities.
--   Enables graph traversal across the spine without JSONB relationship columns.
--   Every row represents a single directed edge: source -(relationship_type)-> target.
--
--   Relationships are universal across all business domains. Concrete business
--   types (CRMAccount, Ticket, Contract, etc.) inherit from root concepts, but
--   their interconnections are expressed through this single edge table. This
--   design enforces referential integrity at the platform level and eliminates
--   the need for JSONB relationship arrays in individual entity tables.
--
--   Provenance tracks the origin of each relationship as a JSON object:
--   { "source": "system|integration|user", "record_id": "...", "actor": "..." }
--
--   Target: Cloudflare D1 (SQLite-compatible)
-- =============================================================================

CREATE TABLE IF NOT EXISTS spine_relationships (
    -- Surrogate key
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- Spine identity (tenant-scoped, versioned)
    tenant_id TEXT NOT NULL,
    canonical_id TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1 CHECK(version > 0),

    -- Business truth: relationship endpoints
    source_id TEXT NOT NULL,
    source_type TEXT,
    target_id TEXT NOT NULL,
    target_type TEXT,

    -- Business truth: relationship semantics
    relationship_type TEXT NOT NULL,
    direction TEXT CHECK(direction IS NULL OR direction IN ('outbound', 'inbound', 'bidirectional')),
    cardinality TEXT CHECK(cardinality IS NULL OR cardinality IN ('one_to_one', 'one_to_many', 'many_to_one', 'many_to_many')),

    -- Business truth: temporal validity (optional, for time-bound relationships)
    valid_from TEXT,
    valid_until TEXT,

    -- Provenance: JSON object { source, record_id, actor }
    provenance TEXT NOT NULL,

    -- Audit timestamps (ISO 8601)
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),

    -- Platform constraints
    UNIQUE(tenant_id, canonical_id),
    UNIQUE(tenant_id, source_id, target_id, relationship_type),
    CHECK(valid_from IS NULL OR valid_until IS NULL OR valid_from <= valid_until)
);

-- -----------------------------------------------------------------------------
-- Indexes for common query patterns
-- -----------------------------------------------------------------------------

-- Tenant + canonical_id lookup (primary business key)
CREATE INDEX IF NOT EXISTS idx_spine_relationships_tenant_canonical
    ON spine_relationships(tenant_id, canonical_id);

-- Tenant + version for optimistic locking
CREATE INDEX IF NOT EXISTS idx_spine_relationships_tenant_version
    ON spine_relationships(tenant_id, version);

-- Outbound relationships from a source entity
CREATE INDEX IF NOT EXISTS idx_spine_relationships_source
    ON spine_relationships(tenant_id, source_id, relationship_type);

-- Inbound relationships to a target entity
CREATE INDEX IF NOT EXISTS idx_spine_relationships_target
    ON spine_relationships(tenant_id, target_id, relationship_type);

-- Relationships by type within a tenant
CREATE INDEX IF NOT EXISTS idx_spine_relationships_type
    ON spine_relationships(tenant_id, relationship_type);
