-- =============================================================================
-- Entity:      Objective
-- Layer:       Canonical Spine (Immutable Business Truth)
-- Purpose:     Stated goals (OKR, MBO, KPI, strategic initiatives, etc.) that
--              represent real-world organizational targets. These are sourced
--              from OKR tools, project management systems, or manual entry.
--              They exist independently of the platform and change only when
--              the real-world goal changes.
-- Domain:      account_success
-- Source:      SPINE_DOMAIN.md §3.1, §3.4
--              SPINE_INTELLIGENCE_AGENT.md §10.2 (Code Generation)
-- Generated:   spine-intelligence-agent
-- =============================================================================

CREATE TABLE IF NOT EXISTS spine_objectives (
    -- Core identity (append-only versioning)
    id              TEXT PRIMARY KEY,                -- UUID assigned by the pipeline
    tenant_id       TEXT NOT NULL,                     -- multi-tenant isolation
    canonical_id    TEXT NOT NULL,                     -- stable identity; survives merges
    version         INTEGER NOT NULL DEFAULT 1,        -- append-only version number

    -- Immutable business truth
    title           TEXT NOT NULL,                     -- objective name / headline
    description     TEXT,                             -- detailed explanation
    objective_type  TEXT,                             -- 'OKR', 'MBO', 'KPI', 'strategic', etc.
    status          TEXT NOT NULL DEFAULT 'draft',    -- 'draft', 'active', 'completed', 'cancelled', 'archived'
    priority        TEXT,                             -- 'high', 'medium', 'low'
    start_date      INTEGER,                          -- Unix timestamp (when objective begins)
    target_date     INTEGER,                          -- Unix timestamp (deadline / target end)
    completed_date  INTEGER,                          -- Unix timestamp (when marked complete)
    progress        REAL,                             -- 0.0 to 1.0 (raw progress from source system)
    source_system   TEXT,                             -- e.g., 'notion', 'asana', 'jira', 'manual'
    external_id     TEXT,                             -- ID in the external source system

    -- System / provenance
    provenance      JSON NOT NULL DEFAULT '{}',       -- { source: '...', record_id: '...', sync_at: ... }
    created_at      INTEGER,                          -- Unix timestamp (when this version was written)
    updated_at      INTEGER                           -- Unix timestamp (when this version was written)
);

-- NOTE: no `data JSONB`, no `scope JSONB`, no `relationships JSONB`
-- Relationships are stored in spine_relationships (typed edge table)
-- See SPINE_DOMAIN.md §3.4

-- Indexes for tenant-scoped lookups and versioned history
CREATE INDEX IF NOT EXISTS idx_spine_objectives_tenant_canonical
    ON spine_objectives(tenant_id, canonical_id);

CREATE INDEX IF NOT EXISTS idx_spine_objectives_tenant_version
    ON spine_objectives(tenant_id, canonical_id, version);
