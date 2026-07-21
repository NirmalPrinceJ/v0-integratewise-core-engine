-- =============================================================================
-- SPINE PROJECTS
-- =============================================================================
--
-- File         : spine_projects.sql
-- Domain       : platform
-- Schema       : canonical
-- Target       : Cloudflare D1 (SQLite-compatible)
-- Generated    : 2026-07-06T02:24:18+0530
--
-- Description:
--   Represents a structured unit of work within the IntegrateWise platform.
--   Projects are the primary container for organizing activities, tracking
--   progress, and managing lifecycle state across the platform. They are
--   intentionally generic to support integration initiatives, data migrations,
--   workflow configurations, and other platform-level workstreams.
--
--   Projects inherit from the platform's root concept hierarchy and follow
--   the strict Canonical Spine pattern: all business truth is expressed as
--   typed columns; relationships are stored in spine_relationships; provenance
--   is mandatory JSON.
--
-- Pattern:
--   id, tenant_id, canonical_id, version, [business truth], provenance,
--   created_at, updated_at
--
-- Invariants:
--   - All rows are tenant-scoped (tenant_id is NOT NULL).
--   - canonical_id is unique per tenant (one canonical project per tenant).
--   - version is monotonically incremented for each canonical record update.
--   - provenance must be valid JSON containing at minimum:
--     { source, record_id, actor }.
--   - No JSONB columns for business data. All business truth is typed.
-- =============================================================================

CREATE TABLE IF NOT EXISTS spine_projects (
    -- Core identity & versioning
    id              TEXT PRIMARY KEY,
    tenant_id       TEXT NOT NULL,
    canonical_id    TEXT NOT NULL,
    version         INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),

    -- Business truth: intrinsic properties of a project
    name            TEXT NOT NULL,
    description     TEXT,
    status          TEXT NOT NULL,
    priority        TEXT,
    project_type    TEXT,
    phase           TEXT,
    project_code    TEXT,
    start_date      TEXT,
    target_end_date TEXT,
    actual_end_date TEXT,
    health_status   TEXT,
    percent_complete INTEGER CHECK (percent_complete >= 0 AND percent_complete <= 100),

    -- Provenance: required JSON with { source, record_id, actor }
    provenance      TEXT NOT NULL CHECK (json_valid(provenance)),

    -- Audit timestamps (ISO 8601)
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),

    -- Constraints
    UNIQUE (tenant_id, canonical_id),
    CHECK (status IN ('draft', 'active', 'on_hold', 'completed', 'cancelled', 'archived')),
    CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    CHECK (health_status IN ('on_track', 'at_risk', 'off_track', 'blocked', 'not_applicable'))
);

-- =============================================================================
-- Indexes
-- =============================================================================

-- Primary lookup: canonical record by tenant
CREATE INDEX IF NOT EXISTS idx_spine_projects_tenant_canonical
    ON spine_projects(tenant_id, canonical_id);

-- Version history access
CREATE INDEX IF NOT EXISTS idx_spine_projects_tenant_version
    ON spine_projects(tenant_id, version);

-- Common filter: projects by status within a tenant
CREATE INDEX IF NOT EXISTS idx_spine_projects_tenant_status
    ON spine_projects(tenant_id, status);

-- Temporal ordering and recent-project queries
CREATE INDEX IF NOT EXISTS idx_spine_projects_created_at
    ON spine_projects(created_at);

-- =============================================================================
-- Triggers
-- =============================================================================

-- Auto-update updated_at on row modification
CREATE TRIGGER IF NOT EXISTS trg_spine_projects_updated_at
AFTER UPDATE ON spine_projects
FOR EACH ROW
BEGIN
    UPDATE spine_projects
    SET updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
    WHERE id = NEW.id;
END;
