-- =============================================================================
-- spine_policies.sql
-- IntegrateWise Platform :: Canonical Spine
--
-- Entity: spine_policies
-- Description: Platform-level governance and operational rules that constrain
--   or control behavior across all business domains. Policies define what
--   actions are permitted, required, or prohibited on entities within the Spine,
--   and are evaluated at runtime against Spine records. This is a universal
--   root concept / operational primitive, not a domain-specific type.
--
-- Pattern: id, tenant_id, canonical_id, version, business truth, provenance,
--   created_at, updated_at
-- Relationships: Stored in spine_relationships (typed edge table), never JSON.
-- Target: Cloudflare D1 (SQLite-compatible)
-- =============================================================================

CREATE TABLE IF NOT EXISTS spine_policies (
    -- Core Identity (strict universal Spine pattern)
    id              TEXT PRIMARY KEY,
    tenant_id       TEXT NOT NULL,
    canonical_id    TEXT NOT NULL,
    version         INTEGER NOT NULL,

    -- Business Truth: Policy-specific typed columns
    -- No JSONB, no data JSON, no scope JSON. All business truth is typed.
    name            TEXT NOT NULL,
    type            TEXT NOT NULL,
    description     TEXT,
    status          TEXT NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft', 'active', 'inactive', 'deprecated')),
    priority        INTEGER NOT NULL DEFAULT 0,
    effect          TEXT
                        CHECK (effect IN ('allow', 'deny', 'warn', 'require', 'permit', 'block')),
    condition       TEXT,
    target_kind     TEXT,

    -- Provenance: { source, record_id, actor }
    -- The ONLY JSON column allowed in the Spine pattern.
    provenance      JSON NOT NULL,

    -- Audit Timestamps
    created_at      INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at      INTEGER NOT NULL DEFAULT (unixepoch()),

    -- Constraints
    UNIQUE (tenant_id, canonical_id, version)
);

-- =============================================================================
-- Indexes
-- =============================================================================

-- Tenant-scoped entity lookup by canonical identity
CREATE INDEX IF NOT EXISTS idx_spine_policies_tenant_canonical
    ON spine_policies (tenant_id, canonical_id);

-- Tenant-scoped version queries
CREATE INDEX IF NOT EXISTS idx_spine_policies_tenant_version
    ON spine_policies (tenant_id, version);

-- Tenant-scoped policy type filtering by status (active policy lookups)
CREATE INDEX IF NOT EXISTS idx_spine_policies_tenant_type_status
    ON spine_policies (tenant_id, type, status);

-- Tenant-scoped ordered policy evaluation (priority ordering)
CREATE INDEX IF NOT EXISTS idx_spine_policies_tenant_priority
    ON spine_policies (tenant_id, priority);
