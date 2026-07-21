/**
 * memory_timeline
 * Layer: Dynamic Memory (AI-created, ephemeral, opinionated)
 * Purpose: Projected events and milestones for Account Success entities —
 *   captures forward-looking timeline projections (renewals, go-lives, milestones,
 *   initiatives, QBRs) derived from contracts, Spine entities, and external signals.
 * TTL: 90 days (per SPINE_DOMAIN.md §4.1)
 *
 * Sources: SPINE_DOMAIN.md (three-layer model), SPINE_INTELLIGENCE_AGENT.md (pipeline)
 * Target: Cloudflare D1 — SQLite-compatible syntax only.
 */

CREATE TABLE IF NOT EXISTS memory_timeline (
    id                    TEXT PRIMARY KEY,                  -- assigned by pipeline (UUID as text)
    tenant_id             TEXT NOT NULL,

    -- Link to Canonical Spine (always)
    entity_type           TEXT NOT NULL,                    -- e.g. 'account', 'person', 'contract', 'objective', 'initiative'
    canonical_id          TEXT NOT NULL,                    -- links to spine_{entity_type}.canonical_id

    -- Memory content: projected event / milestone
    event_type            TEXT NOT NULL,                    -- 'renewal', 'milestone', 'go_live', 'contract_renewal', 'initiative', 'qbr', 'deployment', 'expansion'
    event_date            INTEGER,                          -- Unix timestamp of projected event date
    event_status          TEXT,                             -- 'upcoming', 'completed', 'delayed', 'at_risk', 'cancelled', 'overdue'
    event_description     TEXT,                             -- human-readable description of the projected event
    reasoning             TEXT,                             -- LLM-generated or heuristic explanation for the projection
    contributing_factors  JSON NOT NULL DEFAULT '[]',       -- [{ factor, weight, source, signal_type }] — what drove this projection
    source_signals        JSON NOT NULL DEFAULT '[]',       -- [{ signal_id, signal_type, timestamp, value }] — raw signals that fed into this timeline entry

    -- Memory metadata
    confidence            REAL NOT NULL DEFAULT 0.5,       -- 0.0–1.0, confidence in the projection accuracy
    generated_by          TEXT NOT NULL,                    -- agent name + model version / heuristic name (e.g. 'spine-intelligence-agent@1.0.0')
    episode_id            TEXT,                             -- link to OODA cycle that produced this memory entry
    ttl_days              INTEGER NOT NULL DEFAULT 90,      -- memory lifetime: 90 days for Timeline projections

    -- Time bounding
    valid_from            INTEGER,                          -- Unix timestamp when this memory becomes valid
    valid_until           INTEGER,                          -- NULL = current; set on refresh / supersede
    created_at            INTEGER                           -- Unix timestamp of creation
);

-- Indexes for Dynamic Memory query patterns
-- (1) Fast lookup of current memories for a given Spine entity (most common read path)
CREATE INDEX IF NOT EXISTS idx_memory_timeline_tenant_entity_current
    ON memory_timeline(tenant_id, entity_type, canonical_id)
    WHERE valid_until IS NULL;

-- (2) Fast lookup by OODA episode for audit / traceability
CREATE INDEX IF NOT EXISTS idx_memory_timeline_tenant_episode
    ON memory_timeline(tenant_id, episode_id);

-- (3) Fast lookup of timeline events by date range (e.g. "what's happening next 30 days?")
CREATE INDEX IF NOT EXISTS idx_memory_timeline_tenant_event_date
    ON memory_timeline(tenant_id, event_date)
    WHERE valid_until IS NULL;

-- (4) Fast lookup of timeline events by type and status (e.g. "all upcoming renewals")
CREATE INDEX IF NOT EXISTS idx_memory_timeline_tenant_type_status
    ON memory_timeline(tenant_id, event_type, event_status)
    WHERE valid_until IS NULL;
