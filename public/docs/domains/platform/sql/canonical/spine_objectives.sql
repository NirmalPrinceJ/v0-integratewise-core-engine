-- spine_objectives: Platform-level Objective Entity
--
-- Represents goal-setting constructs that define measurable targets and desired outcomes
-- across all business domains. Objectives provide the foundational structure for strategic
-- goals, operational targets, and performance milestones. They are universal, time-bound,
-- measurable entities that track progress toward defined outcomes.
--
-- Business Truth:
--   title            : Human-readable objective statement
--   description      : Detailed explanation and context
--   status           : Lifecycle state (draft, active, paused, completed, cancelled, archived)
--   priority         : Relative importance (critical, high, medium, low)
--   objective_type   : Classification tier (strategic, operational, tactical, personal)
--   start_date       : Objective kickoff date
--   end_date         : Objective target completion date
--   progress_percent : Achievement indicator (0-100)
--
-- Provenance Schema (JSON): { source, record_id, actor }
--
-- Inheritance: spine_objectives inherits from the platform root concept hierarchy.
-- Relationships (parent/child, owner, alignment) are stored in spine_relationships.

CREATE TABLE IF NOT EXISTS spine_objectives (
    id            TEXT PRIMARY KEY,
    tenant_id     TEXT NOT NULL,
    canonical_id  TEXT NOT NULL,
    version       INTEGER NOT NULL DEFAULT 1 CHECK(version > 0),

    -- Business Truth Columns
    title            TEXT NOT NULL,
    description      TEXT,
    status           TEXT NOT NULL DEFAULT 'draft'
        CHECK(status IN ('draft', 'active', 'paused', 'completed', 'cancelled', 'archived')),
    priority         TEXT DEFAULT 'medium'
        CHECK(priority IN ('critical', 'high', 'medium', 'low')),
    objective_type   TEXT DEFAULT 'operational'
        CHECK(objective_type IN ('strategic', 'operational', 'tactical', 'personal')),
    start_date       DATE,
    end_date         DATE,
    progress_percent REAL DEFAULT 0
        CHECK(progress_percent >= 0 AND progress_percent <= 100),

    -- Provenance: { source, record_id, actor }
    provenance    TEXT NOT NULL,

    created_at    DATETIME NOT NULL DEFAULT (datetime('now')),
    updated_at    DATETIME NOT NULL DEFAULT (datetime('now')),

    -- Constraints
    UNIQUE(tenant_id, canonical_id, version),
    CHECK(end_date IS NULL OR start_date IS NULL OR end_date >= start_date),
    CHECK(json_valid(provenance) = 1),
    CHECK(json_type(provenance, '$.source') IS NOT NULL),
    CHECK(json_type(provenance, '$.record_id') IS NOT NULL),
    CHECK(json_type(provenance, '$.actor') IS NOT NULL)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_spine_objectives_tenant_canonical
    ON spine_objectives(tenant_id, canonical_id);

CREATE INDEX IF NOT EXISTS idx_spine_objectives_tenant_version
    ON spine_objectives(tenant_id, version);

CREATE INDEX IF NOT EXISTS idx_spine_objectives_status
    ON spine_objectives(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_spine_objectives_dates
    ON spine_objectives(tenant_id, start_date, end_date);
