-- =============================================================================
-- Entity:        Timeline
-- Layer:         Canonical Spine (Immutable Business Truth)
-- Purpose:       Operational primitive (1 of 7) capturing significant events,
--                 milestones, and state transitions across all business domains.
--                 Each row represents an immutable timeline event. Updates append
--                 new versions (version column increments). Relationships to other
--                 entities are stored in spine_relationships (typed edge table).
-- Source:        SPINE_DOMAIN.md §3.4, SPINE_INTELLIGENCE_AGENT.md §10.2
-- Domain:        platform
-- Target:        D1 (SQLite-compatible)
-- =============================================================================
-- Rules:
--   • id TEXT PRIMARY KEY — UUID assigned by the pipeline, not generated in DB
--   • tenant_id, canonical_id TEXT NOT NULL
--   • version INTEGER NOT NULL DEFAULT 1 (append-only versioning)
--   • Typed columns only — no data JSON, no scope JSON, no relationships JSON
--   • Relationships stored in spine_relationships (typed edge table)
--   • provenance JSON NOT NULL DEFAULT '{}' — { source: '...', record_id: '...', actor: '...' }
--   • Timestamps are INTEGER (Unix epoch seconds)
-- =============================================================================

CREATE TABLE IF NOT EXISTS spine_timelines (
    -- ── Core identity ─────────────────────────────────────────────────────────
    id              TEXT PRIMARY KEY,                 -- UUID as text (assigned by pipeline)
    tenant_id       TEXT NOT NULL,                    -- tenant scoping (cross-tenant impossible by construction)
    canonical_id    TEXT NOT NULL,                    -- stable identity; survives merges and deduplication
    version         INTEGER NOT NULL DEFAULT 1,       -- append-only versioning; time-travel and audit support

    -- ── Immutable business truth ────────────────────────────────────────────
    event_type      TEXT NOT NULL,                    -- specific event type (e.g., 'contract_signed', 'milestone_reached', 'deployment_completed', 'status_changed', 'communication_logged')
    event_title     TEXT NOT NULL,                    -- human-readable title of the event
    event_description TEXT,                             -- detailed description / context of the event
    event_date      INTEGER NOT NULL,                 -- Unix timestamp (seconds) when the event occurred
    event_category  TEXT,                             -- broad grouping: 'milestone', 'activity', 'status_change', 'communication', 'decision', 'external', 'system'
    event_status    TEXT,                             -- 'scheduled', 'pending', 'in_progress', 'completed', 'cancelled', 'deferred'
    event_outcome   TEXT,                             -- result or consequence of the event (e.g., 'successful', 'blocked', 'rolled_back')
    importance      TEXT,                             -- significance: 'low', 'medium', 'high', 'critical'
    source_system   TEXT,                             -- origin system: 'salesforce', 'hubspot', 'jira', 'zendesk', 'slack', 'calendar', 'manual', 'pipeline', 'api'

    -- ── System / provenance ───────────────────────────────────────────────────
    provenance      JSON NOT NULL DEFAULT '{}',       -- { source: "...", record_id: "...", actor: "..." }
    created_at      INTEGER,                          -- Unix timestamp (seconds since epoch)
    updated_at      INTEGER                           -- Unix timestamp (seconds since epoch)
);

-- ── Indexes ──────────────────────────────────────────────────────────────────
-- Fast lookup of the current (latest) version of a timeline event by canonical identity
CREATE INDEX IF NOT EXISTS idx_spine_timelines_tenant_canonical
    ON spine_timelines(tenant_id, canonical_id);

-- Fast lookup of a specific version (enables time-travel and audit)
CREATE INDEX IF NOT EXISTS idx_spine_timelines_tenant_version
    ON spine_timelines(tenant_id, canonical_id, version);

-- Fast filtering by event date (most common timeline query: "what happened in this period?")
CREATE INDEX IF NOT EXISTS idx_spine_timelines_tenant_event_date
    ON spine_timelines(tenant_id, event_date);

-- Fast filtering by event type (e.g., "all contract_sign events across the tenant")
CREATE INDEX IF NOT EXISTS idx_spine_timelines_tenant_event_type
    ON spine_timelines(tenant_id, event_type);

-- Fast filtering by event category and status (e.g., "all completed milestones")
CREATE INDEX IF NOT EXISTS idx_spine_timelines_tenant_category_status
    ON spine_timelines(tenant_id, event_category, event_status);
