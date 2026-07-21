-- ============================================================================
-- Memory Type: memory_technical_debt
-- Layer: Dynamic Memory (AI-created, ephemeral, opinionated)
-- TTL: 30 days
-- Purpose: Stores known technical liabilities discovered from support tickets,
--          incident post-mortems, architecture reviews, and deployment telemetry.
--          This is opinion, not immutable truth. It is derived, assessed, and
--          continuously refreshed by the Intelligence Agent pipeline.
-- Source: SPINE_DOMAIN.md §4.1, §4.3 | SPINE_INTELLIGENCE_AGENT.md §7, §10
-- Target: D1 (SQLite-compatible) — TEXT for UUIDs, INTEGER for timestamps,
--         REAL for decimals, JSON for JSON (no JSONB, no TIMESTAMPTZ, no gen_random_uuid())
-- ============================================================================

CREATE TABLE IF NOT EXISTS memory_technical_debt (
    id              TEXT PRIMARY KEY,               -- UUID assigned by the pipeline (not generated)
    tenant_id       TEXT NOT NULL,                   -- tenant isolation
    entity_type     TEXT NOT NULL,                   -- links to Spine entity type (e.g., 'account', 'deployment', 'integration')
    canonical_id    TEXT NOT NULL,                   -- links to Spine canonical_id

    -- Memory content: technical debt assessment
    severity_score  REAL,                            -- 0.00–1.00 (higher = more severe)
    severity_label  TEXT,                            -- 'critical', 'high', 'medium', 'low'
    category        TEXT,                            -- 'integration', 'architecture', 'data', 'security', 'performance', 'infrastructure', 'configuration'
    description     TEXT,                            -- what the debt is
    reasoning       TEXT,                            -- how/why it was identified (LLM or heuristic explanation)
    impact_areas    JSON NOT NULL DEFAULT '[]',     -- [{ area, severity, description }] — affected systems, modules, or capabilities
    contributing_factors JSON NOT NULL DEFAULT '[]', -- [{ factor, weight, source }] — signals that contributed to this assessment
    recommended_actions JSON NOT NULL DEFAULT '[]', -- [{ action, priority, effort_estimate, rationale }] — suggested remediation steps
    estimated_effort TEXT,                          -- rough estimate to fix (e.g., '1 sprint', '1 quarter', 'ongoing')
    sources         JSON NOT NULL DEFAULT '[]',      -- [{ source_type, source_id, source_url, discovered_at }] — where the debt was discovered
    discovered_at   INTEGER,                        -- Unix timestamp when the debt was first identified
    last_reviewed_at INTEGER,                       -- Unix timestamp of last human or AI review

    -- Memory metadata
    confidence      REAL NOT NULL DEFAULT 0.5,      -- 0.0–1.0; confidence in this assessment
    generated_by    TEXT NOT NULL,                   -- agent/model/heuristic name + version (e.g., 'spine-intelligence-agent@1.0.0')
    episode_id      TEXT,                            -- link to OODA cycle that produced this memory
    ttl_days        INTEGER NOT NULL DEFAULT 30,     -- memory lifecycle: 30 days for technical debt (SPINE_DOMAIN.md §4.1)

    -- Time bounding
    valid_from      INTEGER,                        -- Unix timestamp; when this memory became valid
    valid_until     INTEGER,                        -- Unix timestamp; NULL = current; set on refresh/expiration
    created_at      INTEGER                         -- Unix timestamp; when this record was created
);

-- Core index: locate current technical debt for a given Spine entity
CREATE INDEX IF NOT EXISTS idx_memory_technical_debt_tenant_entity
    ON memory_technical_debt(tenant_id, entity_type, canonical_id)
    WHERE valid_until IS NULL;

-- Score index: filter and sort by severity for current records
CREATE INDEX IF NOT EXISTS idx_memory_technical_debt_score
    ON memory_technical_debt(tenant_id, severity_score)
    WHERE valid_until IS NULL;

-- Category index: filter by debt category for current records
CREATE INDEX IF NOT EXISTS idx_memory_technical_debt_category
    ON memory_technical_debt(tenant_id, category)
    WHERE valid_until IS NULL;

-- Episode index: trace back to the OODA cycle that generated this memory
CREATE INDEX IF NOT EXISTS idx_memory_technical_debt_episode
    ON memory_technical_debt(tenant_id, episode_id);
