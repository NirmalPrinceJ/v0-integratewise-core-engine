-- =============================================================================
-- spine_workspaces
-- =============================================================================
-- File         : spine_workspaces.sql
-- Domain       : platform
-- Schema       : canonical
-- Target       : Cloudflare D1 (SQLite-compatible)
--
-- Description:
--   Represents the Workspace operational primitive within the IntegrateWise
--   platform. A workspace is the primary container for user context, module
--   configuration, and Twin continuity within a tenant. It defines the unit
--   of work as Personal, Work, or Business, and serves as the mount point for
--   Workbench projections and the Continuity Bridge context bundle.
--
--   Workspaces are operational primitives (one of the 7 platform operational
--   primitives), not domain-specific business types. All business entities
--   (CRMAccount, Ticket, Contract, etc.) are ultimately scoped to a workspace
--   within a tenant. Workspace-specific dynamic state (persona, modules, layout
--   references) belongs in Dynamic Memory and the spine_relationships typed
--   edge table, not in typed Spine columns.
--
-- Pattern:
--   id, tenant_id, canonical_id, version, [business truth], provenance,
--   created_at, updated_at
--
-- Invariants:
--   - All rows are tenant-scoped (tenant_id is NOT NULL).
--   - canonical_id is unique per tenant (one canonical workspace per tenant).
--   - version is monotonically incremented for each canonical record update.
--   - provenance must be valid JSON containing at minimum:
--     { source, record_id, actor }.
--   - No JSONB columns for business data. All business truth is typed.
--   - Relationships (parent workspace, layout, owner) are stored in
--     spine_relationships; never as JSON columns.
-- =============================================================================

CREATE TABLE IF NOT EXISTS spine_workspaces (
    -- Core identity & versioning (strict universal Spine pattern)
    id              TEXT PRIMARY KEY,                       -- UUID v4, immutable
    tenant_id       TEXT NOT NULL,                          -- Owning tenant scope; all queries are tenant-isolated
    canonical_id    TEXT NOT NULL,                          -- Stable business identifier (e.g., 'wsp_sales', 'wsp_acme')
    version         INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),
                                                            -- Optimistic locking version; increments on every update

    -- Business truth: intrinsic, platform-level properties of a workspace
    -- No JSONB, no data JSON, no scope JSON. All business truth is typed.
    -- Domain-specific columns (persona, modules, layout) belong in Dynamic Memory.
    name            TEXT NOT NULL,                          -- Display name of the workspace
    slug            TEXT NOT NULL,                          -- URL-friendly unique identifier within tenant
    description     TEXT,                                   -- Optional human-readable description
    type            TEXT NOT NULL,                          -- Workspace classification: personal, work, business
    status          TEXT NOT NULL DEFAULT 'bootstrapping',  -- Lifecycle state: init, bootstrapping, active, suspended, archived
    archived_at     TEXT,                                   -- ISO 8601 timestamp when workspace entered archived status

    -- Provenance: required JSON with { source, record_id, actor }
    -- The ONLY JSON column permitted in the Spine pattern.
    --   source:    string — name of originating system (e.g., 'web', 'api', 'onboarding', 'migration')
    --   record_id: string — identifier in the source system (for re-sync and deduplication)
    --   actor:     string — ID of the user or service that created/updated this record
    provenance      TEXT NOT NULL CHECK (json_valid(provenance)),

    -- Audit timestamps (ISO 8601 in UTC)
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),

    -- Constraints
    UNIQUE (tenant_id, canonical_id),                       -- Canonical ID is unique within a tenant scope
    CHECK (type IN ('personal', 'work', 'business')),
    CHECK (status IN ('init', 'bootstrapping', 'active', 'suspended', 'archived'))
);

-- =============================================================================
-- Indexes
-- =============================================================================

-- Primary lookup: canonical record by tenant
CREATE INDEX IF NOT EXISTS idx_spine_workspaces_tenant_canonical
    ON spine_workspaces(tenant_id, canonical_id);

-- Version history access (required by platform pattern)
CREATE INDEX IF NOT EXISTS idx_spine_workspaces_tenant_version
    ON spine_workspaces(tenant_id, version);

-- Operational filtering: list active workspaces, bulk archive suspended workspaces
CREATE INDEX IF NOT EXISTS idx_spine_workspaces_tenant_status
    ON spine_workspaces(tenant_id, status);

-- Type-based routing: filter workspaces by classification within a tenant
CREATE INDEX IF NOT EXISTS idx_spine_workspaces_tenant_type
    ON spine_workspaces(tenant_id, type);

-- URL routing: lookup workspace by slug for API and web routing
CREATE INDEX IF NOT EXISTS idx_spine_workspaces_tenant_slug
    ON spine_workspaces(tenant_id, slug);

-- Temporal ordering: recent workspace queries, onboarding audit
CREATE INDEX IF NOT EXISTS idx_spine_workspaces_created_at
    ON spine_workspaces(created_at);

-- =============================================================================
-- Triggers
-- =============================================================================

-- Auto-update updated_at on row modification
CREATE TRIGGER IF NOT EXISTS trg_spine_workspaces_updated_at
AFTER UPDATE ON spine_workspaces
FOR EACH ROW
BEGIN
    UPDATE spine_workspaces
    SET updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
    WHERE id = NEW.id;
END;
