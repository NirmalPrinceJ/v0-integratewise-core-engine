-- ============================================================================
-- Entity:  Meeting
-- Layer:   Canonical Spine (Immutable Business Truth)
-- Purpose: A synchronous interaction between people. Represents real-world
--          meetings (QBRs, check-ins, onboarding calls, support calls, etc.)
--          sourced from calendar systems, CRM records, or manual entry.
-- Source:  SPINE_DOMAIN.md §3.4, SPINE_INTELLIGENCE_AGENT.md §10.2
-- ============================================================================

CREATE TABLE IF NOT EXISTS spine_meetings (
    id                  TEXT PRIMARY KEY,                          -- UUID assigned by the pipeline
    tenant_id           TEXT NOT NULL,
    canonical_id        TEXT NOT NULL,                           -- stable identity; survives merges
    version             INTEGER NOT NULL DEFAULT 1,              -- append-only versioning

    -- Immutable business truth: Meeting attributes
    title               TEXT NOT NULL,
    description         TEXT,
    meeting_type        TEXT,                                    -- e.g., qbr, check_in, onboarding, support, sales, escalation
    status              TEXT NOT NULL DEFAULT 'scheduled',       -- scheduled, completed, cancelled, no_show, rescheduled

    -- Timing
    start_time          INTEGER,                                 -- Unix timestamp (seconds)
    end_time            INTEGER,                                 -- Unix timestamp (seconds)
    timezone            TEXT,                                    -- IANA timezone identifier (e.g., "America/New_York")

    -- Location / Virtual
    location            TEXT,                                    -- physical location or room name
    meeting_url         TEXT,                                    -- video conference URL (Zoom, Teams, Meet, etc.)
    calendar_provider   TEXT,                                    -- google, outlook, exchange, apple, other
    calendar_event_id   TEXT,                                    -- external calendar event ID

    -- Lifecycle timestamps
    scheduled_at        INTEGER,                                 -- when the meeting was scheduled (Unix timestamp)
    completed_at        INTEGER,                                 -- when the meeting was marked complete (Unix timestamp)
    cancelled_at        INTEGER,                                 -- when the meeting was cancelled (Unix timestamp)
    cancellation_reason TEXT,

    -- Content & outcomes
    outcome             TEXT,                                    -- brief outcome summary
    notes               TEXT,                                    -- meeting notes / body
    next_steps          TEXT,                                    -- follow-up actions agreed upon

    -- Recording
    is_recorded         INTEGER NOT NULL DEFAULT 0,            -- 0 = false, 1 = true
    recording_url       TEXT,
    transcript_status   TEXT,                                    -- available, pending, processing, none, error

    -- System
    provenance          JSON NOT NULL DEFAULT '{}',             -- { source: "salesforce|google_calendar|outlook|manual", record_id: "...", ... }
    created_at          INTEGER,                                 -- Unix timestamp
    updated_at          INTEGER                                  -- Unix timestamp
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_spine_meetings_tenant_canonical
    ON spine_meetings(tenant_id, canonical_id);

CREATE INDEX IF NOT EXISTS idx_spine_meetings_tenant_version
    ON spine_meetings(tenant_id, canonical_id, version);

CREATE INDEX IF NOT EXISTS idx_spine_meetings_start_time
    ON spine_meetings(start_time);

CREATE INDEX IF NOT EXISTS idx_spine_meetings_status
    ON spine_meetings(status);
