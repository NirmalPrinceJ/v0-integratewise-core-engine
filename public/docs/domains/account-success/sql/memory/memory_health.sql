/*
 * ============================================================================
 * Memory Type: Health
 * Layer: Dynamic Memory
 * TTL: 7 days (see SPINE_DOMAIN.md §4.1)
 * Purpose: Account health score + reasoning, computed from usage data, support
 *          tickets, engagement frequency, and NPS. AI-created, ephemeral, and
 *          opinionated. Not immutable business truth.
 *
 * Sources:
 *   - SPINE_DOMAIN.md §4.3 (Dynamic Memory Schema pattern)
 *   - SPINE_INTELLIGENCE_AGENT.md §7 (Memory Classification), §10 (Code Generation)
 *
 * Rules:
 *   - D1 / SQLite syntax only. TEXT for UUIDs, INTEGER for timestamps, REAL for
 *     decimals, JSON for JSON. No PostgreSQL-specific types.
 *   - No `data JSONB`, no `scope JSONB`, no `relationships JSONB`.
 *   - Relationships are stored in `spine_relationships` (typed edge table).
 *   - Memory is opinion, not truth. Every record carries a `confidence` score and
 *     a `generated_by` field.
 *   - Append-only versioning: on refresh, a new row is inserted; the old row is
 *     soft-archived by setting `valid_until`.
 * ============================================================================
 */

CREATE TABLE IF NOT EXISTS memory_health (
    id              TEXT PRIMARY KEY,               -- UUID assigned by pipeline; NOT auto-generated
    tenant_id       TEXT NOT NULL,

    -- Link to Canonical Spine (always)
    entity_type     TEXT NOT NULL,                  -- e.g. 'account', 'person', 'integration'
    canonical_id    TEXT NOT NULL,                  -- stable identity from the Spine entity

    -- Memory content (specific to Health)
    score           REAL,                           -- 0.00–1.00
    score_label     TEXT,                           -- 'healthy', 'at-risk', 'critical', 'champion'
    reasoning       TEXT,                           -- LLM-generated or heuristic explanation
    contributing_factors
                    JSON NOT NULL DEFAULT '[]',     -- [{ factor, weight, source }]

    -- Memory metadata
    confidence      REAL NOT NULL DEFAULT 0.5,     -- 0.0–1.0
    generated_by    TEXT NOT NULL,                  -- agent name + model version / heuristic name
    episode_id      TEXT,                           -- link to OODA cycle that produced this memory

    -- Time bounding & lifecycle
    ttl_days        INTEGER NOT NULL DEFAULT 7,     -- TTL per SPINE_DOMAIN.md §4.1
    valid_from      INTEGER,                        -- Unix timestamp (seconds since epoch)
    valid_until     INTEGER,                        -- NULL = current; set on refresh (soft-archive)
    created_at      INTEGER                         -- Unix timestamp (seconds since epoch)
);

-- Index: active memory lookup by tenant + entity + canonical_id
-- (filtered to current records only, where valid_until IS NULL)
CREATE INDEX IF NOT EXISTS idx_memory_health_tenant_entity
    ON memory_health(tenant_id, entity_type, canonical_id)
    WHERE valid_until IS NULL;

-- Index: active memory lookup by score range
CREATE INDEX IF NOT EXISTS idx_memory_health_score
    ON memory_health(tenant_id, score)
    WHERE valid_until IS NULL;

-- Index: memory lookup by episode (OODA cycle linkage)
CREATE INDEX IF NOT EXISTS idx_memory_health_episode
    ON memory_health(tenant_id, episode_id);
