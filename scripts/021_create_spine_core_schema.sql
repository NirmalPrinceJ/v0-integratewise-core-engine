-- Adaptive Spine: Core Entity Graph Schema
-- This is the single source of truth for all business entities across the platform

-- 1. Entity Types Registry
CREATE TABLE IF NOT EXISTS spine_entity_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL UNIQUE,
  plural varchar(255) NOT NULL,
  description text,
  icon varchar(100),
  color varchar(20),
  fields jsonb DEFAULT '[]'::jsonb,
  relationships jsonb DEFAULT '[]'::jsonb,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- 2. Core Entities (polymorphic storage)
CREATE TABLE IF NOT EXISTS spine_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type varchar(255) NOT NULL REFERENCES spine_entity_types(name) ON DELETE RESTRICT,
  external_id varchar(255),
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  created_by uuid,
  updated_by uuid,
  UNIQUE(type, external_id)
);

-- 3. Entity Relationships (bidirectional graph)
CREATE TABLE IF NOT EXISTS spine_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid NOT NULL REFERENCES spine_entities(id) ON DELETE CASCADE,
  source_type varchar(255) NOT NULL,
  target_id uuid NOT NULL REFERENCES spine_entities(id) ON DELETE CASCADE,
  target_type varchar(255) NOT NULL,
  relationship_type varchar(255) NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp DEFAULT now(),
  UNIQUE(source_id, target_id, relationship_type)
);

-- 4. Timeline: Immutable event log for all mutations
CREATE TABLE IF NOT EXISTS spine_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES spine_entities(id) ON DELETE CASCADE,
  entity_type varchar(255) NOT NULL,
  action varchar(50) NOT NULL,
  old_value jsonb,
  new_value jsonb,
  timestamp timestamp DEFAULT now(),
  user_id uuid,
  source varchar(100),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- 5. Field Definitions (schema enforcement)
CREATE TABLE IF NOT EXISTS spine_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type varchar(255) NOT NULL REFERENCES spine_entity_types(name),
  name varchar(255) NOT NULL,
  field_type varchar(50) NOT NULL,
  required boolean DEFAULT false,
  indexed boolean DEFAULT false,
  unique_constraint boolean DEFAULT false,
  validation_rules jsonb,
  created_at timestamp DEFAULT now(),
  UNIQUE(entity_type, name)
);

-- Indexes for performance
CREATE INDEX idx_spine_entities_type ON spine_entities(type);
CREATE INDEX idx_spine_entities_created ON spine_entities(created_at DESC);
CREATE INDEX idx_spine_relationships_source ON spine_relationships(source_id);
CREATE INDEX idx_spine_relationships_target ON spine_relationships(target_id);
CREATE INDEX idx_spine_timeline_entity ON spine_timeline(entity_id);
CREATE INDEX idx_spine_timeline_timestamp ON spine_timeline(timestamp DESC);

