-- ============================================================================
-- Entity:        memory_usage
-- Layer:         Dynamic Memory (AI-Created, Ephemeral, Opinionated)
-- Purpose:       Stores aggregated consumption patterns and usage metrics
--                derived from telemetry, API logs, and product analytics.
--                Opinion, not immutable business truth. TTL-managed.
-- TTL:           30 days (Usage memory type — SPINE_DOMAIN.md §4.1)
-- Domain:        account_success
-- Source:        SPINE_DOMAIN.md §4.3, SPINE_INTELLIGENCE_AGENT.md §7.4
-- Target:        D1 (SQLite-compatible)
-- ============================================================================

CREATE TABLE IF NOT EXISTS memory_usage (
    -- Primary key
    id                  TEXT PRIMARY KEY,

    -- Spine linkage (every memory links to the Canonical Spine)
    tenant_id           TEXT NOT NULL,
    entity_type         TEXT NOT NULL,              -- e.g. 'account', 'deployment', 'integration'
    canonical_id        TEXT NOT NULL,              -- stable identity from the Spine entity

    -- Memory content: usage-specific columns
    metric_name         TEXT NOT NULL,              -- e.g. 'api_calls_per_day', 'active_users', 'storage_gb'
    metric_value        REAL,                       -- the measured numeric value
    unit                TEXT,                       -- e.g. 'calls', 'users', 'GB', 'milliseconds'
    target_value        REAL,                       -- expected / target value for comparison
    health_status       TEXT,                       -- 'healthy', 'at-risk', 'critical', 'unknown'
    business_impact_status TEXT,                    -- 'low', 'medium', 'high' based on usage trend
    aggregation_type    TEXT,                       -- 'sum', 'avg', 'count', 'p95', 'max', 'min', 'rate'
    period_start        INTEGER,                    -- start of measurement period (Unix timestamp)
    period_end          INTEGER,                    -- end of measurement period (Unix timestamp)
    measured_at         INTEGER,                    -- when the metric was captured (Unix timestamp)
    reasoning           TEXT,                       -- LLM-generated or heuristic explanation
    contributing_factors JSON NOT NULL DEFAULT '[]', -- [{ factor, weight, source }]

    -- Memory metadata
    confidence          REAL NOT NULL DEFAULT 0.5, -- 0.0–1.0
    generated_by        TEXT NOT NULL,              -- agent/model/heuristic name + version
    episode_id          TEXT,                       -- link to OODA cycle that produced this
    ttl_days            INTEGER NOT NULL DEFAULT 30, -- 30 days for Usage per SPINE_DOMAIN.md §4.1

    -- Time bounding (ephemeral memory lifecycle)
    valid_from          INTEGER,                    -- when this memory became valid (Unix timestamp)
    valid_until         INTEGER,                    -- NULL = current; set on refresh / archive
    created_at          INTEGER                     -- when this record was created (Unix timestamp)
);

-- Indexes

-- Primary lookup: find current usage memories for a given entity
CREATE INDEX IF NOT EXISTS idx_memory_usage_tenant_entity_current
    ON memory_usage (tenant_id, entity_type, canonical_id)
    WHERE valid_until IS NULL;

-- Episode linkage: trace back to the OODA cycle that generated this memory
CREATE INDEX IF NOT EXISTS idx_memory_usage_tenant_episode
    ON memory_usage (tenant_id, episode_id);

-- Metric filtering: look up current usage by metric name for an entity
CREATE INDEX IF NOT EXISTS idx_memory_usage_tenant_entity_metric_current
    ON memory_usage (tenant_id, entity_type, canonical_id, metric_name)
    WHERE valid_until IS NULL;

-- Health status filtering: find at-risk or critical usage across a tenant
CREATE INDEX IF NOT EXISTS idx_memory_usage_tenant_health_current
    ON memory_usage (tenant_id, health_status)
    WHERE valid_until IS NULL;
