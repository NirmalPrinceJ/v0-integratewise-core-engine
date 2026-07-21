-- Adaptive Spine Core Schema
-- Foundation for unified entity and relationship graph
-- Enables all projections, Twin intelligence, and workbench operations

-- Entity Types (canonical core types for IntegrateWise)
CREATE TABLE IF NOT EXISTS entity_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  plural_name text NOT NULL,
  description text,
  icon_name text,
  color_hex text,
  category text NOT NULL, -- 'core', 'crm', 'ops', 'product', 'engagement'
  required_fields text[] DEFAULT '{}', -- field names that must be present
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Entity Fields (schema definition for each entity type)
CREATE TABLE IF NOT EXISTS entity_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type_id uuid NOT NULL REFERENCES entity_types(id) ON DELETE CASCADE,
  name text NOT NULL,
  display_name text NOT NULL,
  field_type text NOT NULL, -- 'text', 'number', 'email', 'date', 'boolean', 'select', 'reference', 'json'
  required boolean DEFAULT false,
  indexed boolean DEFAULT false,
  searchable boolean DEFAULT false,
  validation_rules jsonb, -- { pattern, min, max, allowed_values, etc. }
  position integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(entity_type_id, name)
);

-- Core Entities (the spine of the operating system)
CREATE TABLE IF NOT EXISTS spine_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type_id uuid NOT NULL REFERENCES entity_types(id),
  data jsonb NOT NULL DEFAULT '{}', -- all field values stored here
  name text NOT NULL,
  description text,
  status text, -- 'active', 'inactive', 'archived'
  tenant_id uuid NOT NULL,
  created_by_user_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT entity_type_check CHECK (data IS NOT NULL)
);

CREATE INDEX idx_spine_entities_entity_type_id ON spine_entities(entity_type_id);
CREATE INDEX idx_spine_entities_tenant_id ON spine_entities(tenant_id);
CREATE INDEX idx_spine_entities_name ON spine_entities(name);
CREATE INDEX idx_spine_entities_status ON spine_entities(status);
CREATE INDEX idx_spine_entities_created_at ON spine_entities(created_at DESC);

-- Relationships (edges in the entity graph)
CREATE TABLE IF NOT EXISTS spine_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_entity_id uuid NOT NULL REFERENCES spine_entities(id) ON DELETE CASCADE,
  target_entity_id uuid NOT NULL REFERENCES spine_entities(id) ON DELETE CASCADE,
  relationship_type text NOT NULL, -- 'parent', 'child', 'owner', 'member', 'related', 'linked'
  metadata jsonb DEFAULT '{}', -- role, context, strength, etc.
  created_at timestamp with time zone DEFAULT now(),
  created_by_user_id uuid,
  CONSTRAINT different_entities CHECK (source_entity_id != target_entity_id)
);

CREATE INDEX idx_spine_relationships_source ON spine_relationships(source_entity_id);
CREATE INDEX idx_spine_relationships_target ON spine_relationships(target_entity_id);
CREATE INDEX idx_spine_relationships_type ON spine_relationships(relationship_type);

-- Timeline (immutable audit log of all mutations - source of truth for Twin learning)
CREATE TABLE IF NOT EXISTS spine_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES spine_entities(id) ON DELETE CASCADE,
  operation text NOT NULL, -- 'create', 'update', 'delete'
  field_name text,
  old_value jsonb,
  new_value jsonb,
  source text NOT NULL DEFAULT 'user', -- 'user', 'twin', 'capability', 'api', 'import'
  source_id uuid, -- user_id, twin_id, capability_id
  reason text, -- why the change was made
  metadata jsonb DEFAULT '{}', -- twin_proposal_id, confidence_score, reasoning, etc.
  created_at timestamp with time zone DEFAULT now(),
  created_by_user_id uuid
);

CREATE INDEX idx_spine_timeline_entity ON spine_timeline(entity_id);
CREATE INDEX idx_spine_timeline_created_at ON spine_timeline(created_at DESC);
CREATE INDEX idx_spine_timeline_source ON spine_timeline(source);
CREATE INDEX idx_spine_timeline_operation ON spine_timeline(operation);

-- Relationship Types (enum-like reference)
CREATE TABLE IF NOT EXISTS relationship_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  direction text, -- 'one-way', 'two-way'
  source_entity_type_id uuid REFERENCES entity_types(id),
  target_entity_type_id uuid REFERENCES entity_types(id),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE entity_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE spine_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE spine_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE spine_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationship_types ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "entities_read_own_tenant" ON spine_entities
  FOR SELECT USING (tenant_id = auth.uid()::uuid OR tenant_id IN (
    SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
  ));

CREATE POLICY "entities_insert_own_tenant" ON spine_entities
  FOR INSERT WITH CHECK (tenant_id IN (
    SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
  ));

CREATE POLICY "entities_update_own_tenant" ON spine_entities
  FOR UPDATE USING (tenant_id IN (
    SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
  ));

-- Timeline immutable (no delete, no update)
CREATE POLICY "timeline_read_own_tenant" ON spine_timeline
  FOR SELECT USING (
    entity_id IN (SELECT id FROM spine_entities WHERE tenant_id IN (
      SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ))
  );

CREATE POLICY "timeline_insert_own_tenant" ON spine_timeline
  FOR INSERT WITH CHECK (
    entity_id IN (SELECT id FROM spine_entities WHERE tenant_id IN (
      SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ))
  );

-- Metadata tracking functions
CREATE OR REPLACE FUNCTION update_spine_entity_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_spine_entity_timestamp
  BEFORE UPDATE ON spine_entities
  FOR EACH ROW
  EXECUTE FUNCTION update_spine_entity_timestamp();

-- Audit function: on entity update, create timeline entry
CREATE OR REPLACE FUNCTION create_entity_timeline_entry()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO spine_timeline (
      entity_id, operation, source, created_by_user_id, reason
    ) VALUES (
      NEW.id, 'create', 'user', auth.uid(), 'Entity created'
    );
  ELSIF TG_OP = 'UPDATE' THEN
    -- For each changed field, create timeline entry
    INSERT INTO spine_timeline (
      entity_id, operation, field_name, old_value, new_value,
      source, created_by_user_id
    ) VALUES (
      NEW.id, 'update', 'data', OLD.data, NEW.data,
      'user', auth.uid()
    );
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO spine_timeline (
      entity_id, operation, source, created_by_user_id, reason
    ) VALUES (
      OLD.id, 'delete', 'user', auth.uid(), 'Entity deleted'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_entity_timeline
  AFTER INSERT OR UPDATE OR DELETE ON spine_entities
  FOR EACH ROW
  EXECUTE FUNCTION create_entity_timeline_entry();
