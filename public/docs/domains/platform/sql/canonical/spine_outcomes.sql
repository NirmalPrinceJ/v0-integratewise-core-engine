-- ============================================================
-- spine_outcomes
-- Platform-level Canonical Spine: Outcomes
-- ============================================================
--
-- Represents the results, consequences, or effects of activities, decisions,
-- or processes within the platform. Outcomes are measurable or observable
-- end-states that are the product of intentional actions. Every concrete
-- outcome type (e.g., a resolution, a decision result, a business impact)
-- inherits from this root table. This is a universal concept across all
-- business domains.
--
-- ============================================================

CREATE TABLE IF NOT EXISTS spine_outcomes (
    -- Core identity
    id              TEXT PRIMARY KEY NOT NULL,
    tenant_id       TEXT NOT NULL,
    canonical_id    TEXT NOT NULL,
    version         INTEGER NOT NULL DEFAULT 1,

    -- Business truth columns (typed, no JSONB)
    outcome_type    TEXT,           -- classification (e.g., resolution, decision, impact)
    status          TEXT,           -- lifecycle state (pending, achieved, failed, superseded)
    category        TEXT,           -- domain-agnostic grouping
    priority        TEXT,           -- low, medium, high, critical
    title           TEXT NOT NULL,
    description     TEXT,

    -- Temporal dimensions
    effective_date  TEXT,           -- ISO 8601: when the outcome takes effect
    expiration_date TEXT,           -- ISO 8601: when the outcome ceases to be valid
    target_date     TEXT,           -- ISO 8601: intended deadline or goal date
    completed_date  TEXT,           -- ISO 8601: when the outcome was achieved/finalized

    -- Quantitative attributes
    value           TEXT,           -- measured or assigned value (numeric, currency, enum)
    value_unit      TEXT,           -- unit of measurement (USD, count, percent, etc.)
    outcome_score   REAL,           -- normalized assessment score (0.0 - 1.0)

    -- Attribution and lineage
    owner_actor     TEXT,           -- entity responsible (person, system, process)
    source_process  TEXT,           -- originating process or workflow
    source_reference TEXT,          -- external reference or link

    -- Provenance (JSON with required fields: source, record_id, actor)
    provenance      TEXT NOT NULL CHECK (json_valid(provenance)),

    -- Audit timestamps
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now')),

    -- Constraints
    UNIQUE (tenant_id, canonical_id, version)
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_spine_outcomes_tenant_canonical ON spine_outcomes(tenant_id, canonical_id);
CREATE INDEX IF NOT EXISTS idx_spine_outcomes_tenant_version   ON spine_outcomes(tenant_id, version);
CREATE INDEX IF NOT EXISTS idx_spine_outcomes_tenant_type    ON spine_outcomes(tenant_id, outcome_type);
CREATE INDEX IF NOT EXISTS idx_spine_outcomes_tenant_status  ON spine_outcomes(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_spine_outcomes_effective_date ON spine_outcomes(tenant_id, effective_date);
CREATE INDEX IF NOT EXISTS idx_spine_outcomes_created_at      ON spine_outcomes(tenant_id, created_at);
