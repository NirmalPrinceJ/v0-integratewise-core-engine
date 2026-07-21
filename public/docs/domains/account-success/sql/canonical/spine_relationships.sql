-- spine_relationships
-- Layer: Canonical Spine (Typed Edge Graph)
-- Purpose: Stores all typed relationships between entities in the Canonical Spine
--          and between Spine entities and Dynamic Memory nodes.
--          This is the ONE graph table. No other table stores relationships.
-- Source: SPINE_DOMAIN.md §3.4, SPINE_INTELLIGENCE_AGENT.md §10.2
-- Target: D1 (SQLite-compatible)
-- Note: Every relationship is a directed edge with optional time-bounding.
--       Soft-delete via valid_until (NULL = current).
--       Metadata is strictly structured — no free-form JSONB.

CREATE TABLE IF NOT EXISTS spine_relationships (
    id              TEXT PRIMARY KEY,           -- UUID assigned by pipeline
    tenant_id       TEXT NOT NULL,

    -- Edge endpoints
    from_canonical_id   TEXT NOT NULL,         -- UUID of the source entity
    from_type           TEXT NOT NULL,         -- 'account', 'person', 'contract', etc.
    relation_type       TEXT NOT NULL,         -- 'owns', 'renews', 'uses', 'assigned_to', 'works_for', 'produces', 'affects', 'triggers', 'has_state', 'based_on', 'generates', 'has_assessment', 'participates_in', 'reports_to', 'depends_on', 'parent_of', 'child_of', 'linked_to', 'influences', 'causes'
    to_canonical_id     TEXT NOT NULL,         -- UUID of the target entity
    to_type             TEXT NOT NULL,         -- 'account', 'person', 'health', 'risk', etc.

    -- Edge metadata (structured, not free-form)
    metadata            JSON NOT NULL DEFAULT '{}',
    -- metadata structure: { start_date, end_date, weight: 0.0-1.0, confidence: 0.0-1.0, source: 'extracted' | 'inferred' | 'manual', label }

    -- Time-bounding for temporal relationships
    valid_from          INTEGER,               -- Unix timestamp; relationship becomes valid
    valid_until         INTEGER,               -- Unix timestamp; NULL = current / not expired

    -- System
    created_at          INTEGER,               -- Unix timestamp
    created_by          TEXT                   -- agent or user that created this edge
);

-- Index: Traverse from a source entity (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_spine_rel_from
    ON spine_relationships(tenant_id, from_type, from_canonical_id)
    WHERE valid_until IS NULL;

-- Index: Traverse to a target entity (reverse lookups)
CREATE INDEX IF NOT EXISTS idx_spine_rel_to
    ON spine_relationships(tenant_id, to_type, to_canonical_id)
    WHERE valid_until IS NULL;

-- Index: Find edges by relation type (e.g., "all 'owns' relationships")
CREATE INDEX IF NOT EXISTS idx_spine_rel_type
    ON spine_relationships(tenant_id, relation_type)
    WHERE valid_until IS NULL;

-- Index: Find all edges for a tenant (graph traversal, admin queries)
CREATE INDEX IF NOT EXISTS idx_spine_rel_tenant
    ON spine_relationships(tenant_id)
    WHERE valid_until IS NULL;

-- Index: Find edges by source + relation type (e.g., "all contracts this account owns")
CREATE INDEX IF NOT EXISTS idx_spine_rel_from_type
    ON spine_relationships(tenant_id, from_canonical_id, relation_type)
    WHERE valid_until IS NULL;
