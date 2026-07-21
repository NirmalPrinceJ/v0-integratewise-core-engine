-- =============================================================================
-- spine_teams
-- =============================================================================
-- Table:         spine_teams
-- Description:   Platform-level root entity representing durable groupings of
--                 Persons within a tenant. Teams are universal organizational
--                 constructs that enable role inheritance, scoped access,
--                 and collaborative work across all business domains.
--                 Every team is tenant-scoped and provides the foundation for
--                 workspace assignment, capability delegation, and governance.
--                 Inherits from the platform root concept hierarchy.
-- Pattern:       id, tenant_id, canonical_id, version, business truth, provenance,
--                 created_at, updated_at
-- Relationships:  Stored in spine_relationships (typed edge table); no JSON edges
-- Target:        Cloudflare D1 (SQLite-compatible)
-- =============================================================================

CREATE TABLE IF NOT EXISTS spine_teams (
    -- Identity & versioning (platform standard pattern)
    id            TEXT PRIMARY KEY,                       -- UUID v4, immutable
    tenant_id     TEXT NOT NULL,                          -- Tenant scope; all teams belong to a tenant
    canonical_id  TEXT NOT NULL,                          -- Stable business identifier (e.g., team_ prefix)
    version       INTEGER NOT NULL DEFAULT 1,             -- Optimistic locking version; increments on every update

    -- Business truth columns (typed, no JSONB)
    -- These columns represent the universal, platform-level attributes of a team.
    -- Domain-specific columns (e.g., quota, pipeline, cs_score) belong in Dynamic Memory, not here.
    name            TEXT NOT NULL,                        -- Display name of the team
    slug            TEXT NOT NULL,                        -- URL-friendly unique identifier within tenant
    description     TEXT,                                 -- Human-readable description of the team's purpose
    status          TEXT NOT NULL DEFAULT 'active',       -- Lifecycle state: active, inactive, archived
    team_type       TEXT DEFAULT 'functional',            -- Classification: functional, project, cross_functional, department
    logo_url        TEXT,                                 -- Visual identifier URL for UI rendering
    timezone        TEXT DEFAULT 'UTC',                   -- Default timezone for team scheduling and operations

    -- Provenance: JSON object { source, record_id, actor }
    -- Tracks the origin of this record for audit, lineage, and sync reconciliation.
    --   source:    string — name of originating system (e.g., 'web', 'api', 'import', 'webhook', 'scim')
    --   record_id: string — identifier in the source system (for re-sync and deduplication)
    --   actor:     string — ID of the user or service that created/updated this record
    provenance      TEXT NOT NULL,

    -- Audit timestamps (ISO 8601 format in UTC)
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),

    -- Constraints
    UNIQUE(tenant_id, canonical_id),                      -- Canonical ID is unique within a tenant scope
    CHECK(status IN ('active', 'inactive', 'archived')),
    CHECK(json_valid(provenance) = 1),
    CHECK(json_type(provenance, '$.source') IS NOT NULL),
    CHECK(json_type(provenance, '$.record_id') IS NOT NULL),
    CHECK(json_type(provenance, '$.actor') IS NOT NULL)
);

-- Indexes for efficient querying
-- Standard spine lookup: retrieve a team by its stable business identifier within a tenant
CREATE INDEX IF NOT EXISTS idx_spine_teams_tenant_canonical
    ON spine_teams(tenant_id, canonical_id);

-- Versioned queries: filter or sort by version within a tenant (e.g., optimistic locking checks)
CREATE INDEX IF NOT EXISTS idx_spine_teams_tenant_version
    ON spine_teams(tenant_id, version);

-- Workspace routing: lookup team by slug (used in URL-based routing, API filtering)
CREATE INDEX IF NOT EXISTS idx_spine_teams_slug
    ON spine_teams(tenant_id, slug);

-- Status filtering: list active teams, bulk operations on archived teams
CREATE INDEX IF NOT EXISTS idx_spine_teams_status
    ON spine_teams(tenant_id, status);
