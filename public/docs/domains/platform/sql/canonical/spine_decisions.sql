-- =============================================
-- Canonical Spine: Decisions
-- =============================================
-- spine_decisions represents a cross-domain platform-level determination,
-- resolution, or adjudication made by a user, system, or automated process
-- about a subject entity within the tenant boundary. It provides a universal
-- decision audit trail that spans all business domains, enabling workflow
-- orchestration, compliance, and governance across the platform.
--
-- All decisions are tenant-scoped, versioned, and traceable through their
-- provenance. The decision lifecycle captures the type, subject, outcome,
-- rationale, and temporal validity, supporting both point-in-time and
-- future-effective determinations.
-- =============================================

CREATE TABLE IF NOT EXISTS spine_decisions (
    -- Identity and Versioning
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    canonical_id TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,

    -- Business Truth (typed columns only — no JSONB for business data)
    decision_type TEXT NOT NULL,          -- Classification: approval, routing, escalation, policy, etc.
    decision_status TEXT NOT NULL,        -- Lifecycle: pending, approved, rejected, deferred, overridden
    subject_type TEXT NOT NULL,           -- Entity type the decision is about (e.g., contract, account, ticket)
    subject_id TEXT NOT NULL,             -- Canonical ID of the subject entity
    decision_maker TEXT,                  -- Actor who made/owns the decision (user ID, system, role)
    outcome TEXT,                         -- The actual decision result/outcome
    rationale TEXT,                       -- Reasoning, justification, or context
    decided_at INTEGER,                   -- UTC epoch seconds when decision was finalized
    effective_at INTEGER,                 -- UTC epoch seconds when decision takes effect
    expires_at INTEGER,                   -- UTC epoch seconds when decision becomes invalid

    -- Provenance (required JSON: { source, record_id, actor })
    provenance TEXT NOT NULL CHECK(json_valid(provenance)),

    -- System
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch()),

    -- Constraints
    UNIQUE(tenant_id, canonical_id)
);

-- Core Indexes

-- Primary lookup: stable canonical identity per tenant
CREATE INDEX IF NOT EXISTS idx_spine_decisions_tenant_canonical
    ON spine_decisions(tenant_id, canonical_id);

-- Optimistic locking and version history queries
CREATE INDEX IF NOT EXISTS idx_spine_decisions_tenant_version
    ON spine_decisions(tenant_id, version);

-- Subject lookup: find all decisions affecting a given entity
CREATE INDEX IF NOT EXISTS idx_spine_decisions_subject
    ON spine_decisions(subject_type, subject_id, tenant_id);

-- Status queries: filter decisions by lifecycle state within a tenant
CREATE INDEX IF NOT EXISTS idx_spine_decisions_status
    ON spine_decisions(tenant_id, decision_status);

-- Temporal queries: find currently effective or expiring decisions
CREATE INDEX IF NOT EXISTS idx_spine_decisions_temporal
    ON spine_decisions(tenant_id, effective_at, expires_at);
