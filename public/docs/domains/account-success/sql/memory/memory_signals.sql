-- ============================================================================
-- Entity:        memory_signals
-- Layer:         Dynamic Memory (AI-Created, Ephemeral, Opinionated)
-- TTL:           1 day
-- Purpose:       Detected changes or anomalies derived from telemetry,
--                 webhook events, and delta detection. Signals are ephemeral,
--                 high-frequency observations that inform the OODA loop.
-- Source:         SPINE_DOMAIN.md §4.1, §4.3
--                 SPINE_INTELLIGENCE_AGENT.md §7.1, §10.2
-- Target:         Cloudflare D1 (SQLite-compatible)
-- ============================================================================

CREATE TABLE IF NOT EXISTS memory_signals (
    -- Core identity
    id              TEXT PRIMARY KEY,
    tenant_id       TEXT NOT NULL,

    -- Link to Canonical Spine (every memory belongs to a Spine entity)
    entity_type     TEXT NOT NULL,              -- 'account', 'person', 'integration', 'deployment', etc.
    canonical_id    TEXT NOT NULL,              -- stable identity from the Spine

    -- Memory content: Signal-specific attributes
    signal_type     TEXT NOT NULL,              -- e.g., 'usage_drop', 'integration_failure', 'contract_renewal',
                                                -- 'stakeholder_change', 'incident', 'threshold_breach', 'anomaly'
    severity        TEXT NOT NULL,              -- 'critical', 'high', 'medium', 'low', 'info'
    title           TEXT NOT NULL,              -- Human-readable signal title
    description     TEXT,                       -- Detailed reasoning / explanation

    source_system   TEXT NOT NULL,              -- 'telemetry', 'webhook', 'salesforce', 'api_gateway', 'billing', 'support'
    source_event_id TEXT,                       -- Reference ID in the source system
    source_payload  JSON,                       -- Raw triggering payload (for audit / debug / re-processing)

    delta_value     REAL,                       -- Computed change amount (if applicable)
    previous_value  REAL,                       -- Previous measurement before the change
    current_value   REAL,                       -- Current measurement after the change
    threshold_value REAL,                       -- Threshold that was crossed (if applicable)

    status          TEXT NOT NULL DEFAULT 'open', -- 'open', 'acknowledged', 'resolved', 'dismissed'
    detected_at     INTEGER NOT NULL,           -- Unix timestamp when the signal was detected

    -- Memory metadata
    confidence      REAL NOT NULL DEFAULT 0.5,  -- 0.0–1.0; how certain the AI is about this signal
    generated_by    TEXT NOT NULL,              -- agent name + model version + heuristic name (e.g., 'signal-detector@v1.2.0')
    episode_id      TEXT,                       -- Link to the OODA cycle / Think episode that produced this signal
    ttl_days        INTEGER NOT NULL DEFAULT 1, -- Signal TTL: 1 day (per SPINE_DOMAIN.md §4.1)

    -- Time bounding (validity window)
    valid_from      INTEGER,                    -- Unix timestamp when this memory became valid
    valid_until     INTEGER,                    -- Unix timestamp when this memory was refreshed / superseded; NULL = current
    created_at      INTEGER                     -- Unix timestamp when this record was created
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

-- Primary lookup: current (unexpired) memories for a given Spine entity
CREATE INDEX IF NOT EXISTS idx_memory_signals_tenant_entity
    ON memory_signals(tenant_id, entity_type, canonical_id)
    WHERE valid_until IS NULL;

-- Episode lookup: trace back to the OODA cycle that generated this signal
CREATE INDEX IF NOT EXISTS idx_memory_signals_tenant_episode
    ON memory_signals(tenant_id, episode_id);

-- Status lookup: find open/acknowledged signals for a tenant (workflow queues)
CREATE INDEX IF NOT EXISTS idx_memory_signals_tenant_status
    ON memory_signals(tenant_id, status)
    WHERE valid_until IS NULL;

-- Time-range lookup: recent signals for anomaly detection windows
CREATE INDEX IF NOT EXISTS idx_memory_signals_tenant_detected
    ON memory_signals(tenant_id, detected_at);

-- Signal type lookup: filter by category of signal
CREATE INDEX IF NOT EXISTS idx_memory_signals_tenant_type
    ON memory_signals(tenant_id, signal_type)
    WHERE valid_until IS NULL;
