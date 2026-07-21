-- =============================================================================
-- TABLE: spine_processes
-- =============================================================================
-- Platform-level Canonical Spine entity representing a business process,
-- workflow, or automation definition. Processes are universal constructs that
-- describe how work flows through the platform across all domains.
--
-- A process defines a repeatable sequence of steps, decisions, or actions
-- that can be executed manually or automatically. Examples include approval
-- workflows, data transformation pipelines, automation rules, scheduled tasks,
-- and business process orchestrations.
--
-- This table stores every version of a process as an immutable row. The
-- latest version for a given canonical_id is the current definition.
--
-- CRITICAL RULES:
--   - All columns are typed. No JSONB columns for business data.
--   - Domain-specific attributes (e.g., cs_score, churn_risk) belong in Dynamic Memory.
--   - Relationships are stored in spine_relationships, not in this table.
--   - Provenance must contain: { source, record_id, actor }
-- =============================================================================

CREATE TABLE IF NOT EXISTS spine_processes (
    -- Core Identity
    id              TEXT PRIMARY KEY,                           -- UUIDv4 row identifier
    tenant_id       TEXT NOT NULL,                             -- Multi-tenant scope

    -- Canonical Versioning
    canonical_id    TEXT NOT NULL,                             -- Stable canonical identifier (same across versions)
    version         INTEGER NOT NULL DEFAULT 1,               -- Monotonically increasing version number

    -- Business Truth Columns (typed, no JSONB)
    name            TEXT NOT NULL,                             -- Human-readable process name
    process_key     TEXT NOT NULL,                             -- Machine-friendly unique key within tenant (API name)
    type            TEXT NOT NULL,                             -- Process type: workflow, approval, automation, pipeline, orchestration
    status          TEXT NOT NULL,                             -- Lifecycle status: draft, active, paused, archived, deprecated
    description     TEXT,                                      -- Human-readable description of the process
    category        TEXT,                                      -- Logical grouping/category (e.g., 'sales', 'support', 'ops')
    owner_id        TEXT,                                      -- Reference to owning entity (user, team, or role)
    priority        INTEGER,                                   -- Priority level (1=highest, 5=lowest)
    is_template     INTEGER DEFAULT 0,                         -- Whether this is a reusable template (0=no, 1=yes)
    effective_date  INTEGER,                                   -- Unix timestamp when process becomes effective
    expiration_date INTEGER,                                   -- Unix timestamp when process expires

    -- Provenance (JSON with required fields: source, record_id, actor)
    provenance      TEXT NOT NULL,                             -- JSON: { source, record_id, actor }

    -- Audit Timestamps
    created_at      INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at      INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),

    -- Constraints
    UNIQUE (tenant_id, canonical_id, version),
    CHECK (is_template IN (0, 1)),
    CHECK (priority BETWEEN 1 AND 5 OR priority IS NULL),
    CHECK (effective_date IS NULL OR expiration_date IS NULL OR effective_date <= expiration_date),
    CHECK (json_valid(provenance))
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Lookup by canonical entity (all versions) - required
CREATE INDEX IF NOT EXISTS idx_spine_processes_tenant_canonical
    ON spine_processes (tenant_id, canonical_id);

-- Version-scoped queries - required
CREATE INDEX IF NOT EXISTS idx_spine_processes_tenant_version
    ON spine_processes (tenant_id, version);

-- Business key lookup
CREATE INDEX IF NOT EXISTS idx_spine_processes_tenant_process_key
    ON spine_processes (tenant_id, process_key);

-- Status-based filtering
CREATE INDEX IF NOT EXISTS idx_spine_processes_tenant_status
    ON spine_processes (tenant_id, status);

-- Type-based filtering
CREATE INDEX IF NOT EXISTS idx_spine_processes_tenant_type
    ON spine_processes (tenant_id, type);

-- Temporal ordering
CREATE INDEX IF NOT EXISTS idx_spine_processes_created_at
    ON spine_processes (created_at);

-- =============================================================================
-- TRIGGER
-- =============================================================================
-- Auto-update the updated_at timestamp on any row modification.
CREATE TRIGGER IF NOT EXISTS trg_spine_processes_updated_at
AFTER UPDATE ON spine_processes
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE spine_processes
    SET updated_at = (strftime('%s', 'now'))
    WHERE id = NEW.id;
END;
