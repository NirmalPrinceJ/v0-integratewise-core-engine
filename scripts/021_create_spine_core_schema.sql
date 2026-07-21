-- 021_create_spine_core_schema.sql
-- Adaptive Spine: Core Entity Graph Schema + Timeline
-- Single source of truth for all business entities across the platform
-- With tenant isolation and immutable audit trail

-- 1. Entity Types Registry (Platform-wide, non-tenant)
CREATE TABLE IF NOT EXISTS spine_entity_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  plural VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  color VARCHAR(20) DEFAULT '#3B82F6',
  category VARCHAR(100) NOT NULL, -- CRM, Operations, Communication, Knowledge, Finance, Organization
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Field Definitions (Schema enforcement per entity type)
CREATE TABLE IF NOT EXISTS spine_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type_id UUID NOT NULL REFERENCES spine_entity_types(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  field_type VARCHAR(50) NOT NULL, -- text, number, email, date, boolean, json, reference, uuid
  required BOOLEAN DEFAULT FALSE,
  indexed BOOLEAN DEFAULT FALSE,
  searchable BOOLEAN DEFAULT FALSE,
  display_order INTEGER,
  validation_rules JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(entity_type_id, name)
);

-- 3. Core Entities (Tenant-scoped, polymorphic storage)
CREATE TABLE IF NOT EXISTS spine_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL, -- Clerk tenant ID
  type_id UUID NOT NULL REFERENCES spine_entity_types(id) ON DELETE RESTRICT,
  data JSONB NOT NULL DEFAULT '{}'::JSONB, -- Entity fields from schema
  metadata JSONB DEFAULT '{}'::JSONB, -- Connector-specific data, source info
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT NOT NULL, -- Clerk user ID
  updated_by TEXT NOT NULL,
  UNIQUE(tenant_id, type_id, id)
);

-- 4. Entity Relationships (Bidirectional graph, tenant-scoped)
CREATE TABLE IF NOT EXISTS spine_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  source_entity_id UUID NOT NULL REFERENCES spine_entities(id) ON DELETE CASCADE,
  target_entity_id UUID NOT NULL REFERENCES spine_entities(id) ON DELETE CASCADE,
  relationship_type VARCHAR(100) NOT NULL, -- has_many, belongs_to, many_to_many, etc.
  relationship_name TEXT NOT NULL, -- "account has_many contacts"
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source_entity_id, target_entity_id, relationship_type)
);

-- 5. Timeline: Immutable event log for all mutations (Audit trail)
CREATE TABLE IF NOT EXISTS spine_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  entity_id UUID NOT NULL REFERENCES spine_entities(id) ON DELETE CASCADE,
  entity_type_id UUID NOT NULL REFERENCES spine_entity_types(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL, -- create, update, delete, relate, unrelate
  field_name VARCHAR(255), -- For update actions: which field changed
  old_value JSONB, -- Previous value (for updates)
  new_value JSONB, -- New value (for updates)
  source VARCHAR(100) NOT NULL, -- api, ui, connector, twin, import
  source_id TEXT, -- Connector ID, Twin ID, import batch ID
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::JSONB -- Twin reasoning, proposal_id, confidence_score
);

-- Create indexes for performance (tenant-first queries)
CREATE INDEX idx_spine_entities_tenant ON spine_entities(tenant_id);
CREATE INDEX idx_spine_entities_type ON spine_entities(type_id);
CREATE INDEX idx_spine_entities_created ON spine_entities(created_at DESC);
CREATE INDEX idx_spine_entities_tenant_type ON spine_entities(tenant_id, type_id);

CREATE INDEX idx_spine_relationships_source ON spine_relationships(source_entity_id);
CREATE INDEX idx_spine_relationships_target ON spine_relationships(target_entity_id);
CREATE INDEX idx_spine_relationships_tenant ON spine_relationships(tenant_id);

CREATE INDEX idx_spine_timeline_entity ON spine_timeline(entity_id);
CREATE INDEX idx_spine_timeline_tenant ON spine_timeline(tenant_id);
CREATE INDEX idx_spine_timeline_created ON spine_timeline(created_at DESC);
CREATE INDEX idx_spine_timeline_source ON spine_timeline(source);

CREATE INDEX idx_spine_fields_entity_type ON spine_fields(entity_type_id);

-- Enable RLS for multi-tenant security
ALTER TABLE spine_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE spine_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE spine_timeline ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access entities from their tenant
CREATE POLICY tenant_isolation_entities ON spine_entities
  USING (tenant_id = current_setting('app.current_tenant_id', TRUE)::TEXT)
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', TRUE)::TEXT);

CREATE POLICY tenant_isolation_relationships ON spine_relationships
  USING (tenant_id = current_setting('app.current_tenant_id', TRUE)::TEXT)
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', TRUE)::TEXT);

CREATE POLICY tenant_isolation_timeline ON spine_timeline
  USING (tenant_id = current_setting('app.current_tenant_id', TRUE)::TEXT);

