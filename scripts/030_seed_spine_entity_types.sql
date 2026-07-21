-- Seed Core Entity Types for Adaptive Spine
-- These 13+ types form the canonical entity set for IntegrateWise

INSERT INTO entity_types (name, plural_name, description, icon_name, color_hex, category, required_fields)
VALUES
  -- CRM Entities
  ('Account', 'Accounts', 'Customer organization with billing, product usage, renewal data', 'building-2', '#3b82f6', 'crm', '{"name", "status"}'),
  ('Contact', 'Contacts', 'Individual person at an account with role, engagement history', 'user-check', '#8b5cf6', 'crm', '{"name", "email"}'),
  ('Opportunity', 'Opportunities', 'Sales deal with stage, value, probability, close date', 'trending-up', '#10b981', 'crm', '{"name", "account_id", "stage"}'),
  ('Lead', 'Leads', 'Prospect with source, qualification status, scoring', 'zap', '#f59e0b', 'crm', '{"name", "email"}'),

  -- Operations Entities
  ('Task', 'Tasks', 'Action item with owner, due date, completion status, context', 'check-circle-2', '#ec4899', 'ops', '{"name", "owner_id"}'),
  ('Project', 'Projects', 'Initiative with scope, timeline, team, deliverables', 'briefcase', '#6366f1', 'ops', '{"name", "status"}'),
  ('Activity', 'Activities', 'Timestamped interaction: call, email, meeting, note', 'activity', '#14b8a6', 'ops', '{"type", "entity_id"}'),
  ('Decision', 'Decisions', 'Recorded business decision with context, participants, rationale', 'brain', '#f97316', 'ops', '{"name", "entity_id"}'),

  -- Product Entities
  ('Feature', 'Features', 'Product capability with description, status, usage metrics', 'lightbulb', '#06b6d4', 'product', '{"name", "status"}'),
  ('Bug', 'Bugs', 'Defect with severity, reproduction steps, status', 'alert-circle', '#ef4444', 'product', '{"name", "severity"}'),
  ('Request', 'Requests', 'Customer request, feature idea, enhancement', 'message-square', '#a78bfa', 'product', '{"name", "requester_id"}'),

  -- Engagement Entities
  ('Campaign', 'Campaigns', 'Marketing/engagement campaign with reach, conversion, sentiment', 'megaphone', '#fbbf24', 'engagement', '{"name", "type"}'),
  ('Artifact', 'Artifacts', 'Document, file, template, evidence stored and versioned', 'file-text', '#94a3b8', 'engagement', '{"name", "type"}'),

  -- Core Operational Entities
  ('WorkSession', 'WorkSessions', 'Container for work, context, Twin interaction, decisions', 'clock', '#64748b', 'core', '{"user_id", "created_at"}'),
  ('Proposal', 'Proposals', 'Twin suggestion with reasoning, confidence, approval status', 'lightbulb-on', '#f472b6', 'core', '{"twin_id", "entity_id"}'),
  ('Evidence', 'Evidence', 'Supporting data, artifact, context for a decision or signal', 'shield-check', '#22d3ee', 'core', '{"entity_id", "type"}');

-- Insert entity fields for Account type
INSERT INTO entity_fields (entity_type_id, name, display_name, field_type, required, indexed, searchable, position)
SELECT id, 'name', 'Account Name', 'text', true, true, true, 1 FROM entity_types WHERE name = 'Account' UNION ALL
SELECT id, 'status', 'Status', 'select', true, true, false, 2 FROM entity_types WHERE name = 'Account' UNION ALL
SELECT id, 'industry', 'Industry', 'select', false, false, true, 3 FROM entity_types WHERE name = 'Account' UNION ALL
SELECT id, 'arr', 'Annual Recurring Revenue', 'number', false, true, false, 4 FROM entity_types WHERE name = 'Account' UNION ALL
SELECT id, 'renewal_date', 'Renewal Date', 'date', false, true, false, 5 FROM entity_types WHERE name = 'Account' UNION ALL
SELECT id, 'health_score', 'Health Score', 'number', false, true, false, 6 FROM entity_types WHERE name = 'Account' UNION ALL
SELECT id, 'nps', 'Net Promoter Score', 'number', false, false, false, 7 FROM entity_types WHERE name = 'Account';

-- Insert entity fields for Contact type
INSERT INTO entity_fields (entity_type_id, name, display_name, field_type, required, indexed, searchable, position)
SELECT id, 'name', 'Name', 'text', true, true, true, 1 FROM entity_types WHERE name = 'Contact' UNION ALL
SELECT id, 'email', 'Email', 'email', true, true, true, 2 FROM entity_types WHERE name = 'Contact' UNION ALL
SELECT id, 'phone', 'Phone', 'text', false, false, false, 3 FROM entity_types WHERE name = 'Contact' UNION ALL
SELECT id, 'title', 'Job Title', 'text', false, false, true, 4 FROM entity_types WHERE name = 'Contact' UNION ALL
SELECT id, 'account_id', 'Account', 'reference', false, true, false, 5 FROM entity_types WHERE name = 'Contact' UNION ALL
SELECT id, 'role', 'Role at Account', 'select', false, false, false, 6 FROM entity_types WHERE name = 'Contact' UNION ALL
SELECT id, 'engagement_level', 'Engagement Level', 'select', false, false, false, 7 FROM entity_types WHERE name = 'Contact';

-- Insert entity fields for Opportunity type
INSERT INTO entity_fields (entity_type_id, name, display_name, field_type, required, indexed, searchable, position)
SELECT id, 'name', 'Opportunity Name', 'text', true, true, true, 1 FROM entity_types WHERE name = 'Opportunity' UNION ALL
SELECT id, 'account_id', 'Account', 'reference', true, true, false, 2 FROM entity_types WHERE name = 'Opportunity' UNION ALL
SELECT id, 'stage', 'Stage', 'select', true, true, false, 3 FROM entity_types WHERE name = 'Opportunity' UNION ALL
SELECT id, 'value', 'Value ($)', 'number', false, true, false, 4 FROM entity_types WHERE name = 'Opportunity' UNION ALL
SELECT id, 'probability', 'Probability (%)', 'number', false, false, false, 5 FROM entity_types WHERE name = 'Opportunity' UNION ALL
SELECT id, 'close_date', 'Expected Close Date', 'date', false, true, false, 6 FROM entity_types WHERE name = 'Opportunity' UNION ALL
SELECT id, 'owner_id', 'Opportunity Owner', 'reference', false, true, false, 7 FROM entity_types WHERE name = 'Opportunity';

-- Insert entity fields for Task type
INSERT INTO entity_fields (entity_type_id, name, display_name, field_type, required, indexed, searchable, position)
SELECT id, 'name', 'Task Title', 'text', true, true, true, 1 FROM entity_types WHERE name = 'Task' UNION ALL
SELECT id, 'description', 'Description', 'text', false, false, true, 2 FROM entity_types WHERE name = 'Task' UNION ALL
SELECT id, 'owner_id', 'Assigned To', 'reference', true, true, false, 3 FROM entity_types WHERE name = 'Task' UNION ALL
SELECT id, 'due_date', 'Due Date', 'date', false, true, false, 4 FROM entity_types WHERE name = 'Task' UNION ALL
SELECT id, 'status', 'Status', 'select', true, true, false, 5 FROM entity_types WHERE name = 'Task' UNION ALL
SELECT id, 'priority', 'Priority', 'select', false, false, false, 6 FROM entity_types WHERE name = 'Task' UNION ALL
SELECT id, 'entity_id', 'Related To', 'reference', false, true, false, 7 FROM entity_types WHERE name = 'Task';

-- Insert entity fields for Activity type
INSERT INTO entity_fields (entity_type_id, name, display_name, field_type, required, indexed, searchable, position)
SELECT id, 'type', 'Activity Type', 'select', true, true, false, 1 FROM entity_types WHERE name = 'Activity' UNION ALL
SELECT id, 'entity_id', 'Related Entity', 'reference', true, true, false, 2 FROM entity_types WHERE name = 'Activity' UNION ALL
SELECT id, 'description', 'Description', 'text', true, false, true, 3 FROM entity_types WHERE name = 'Activity' UNION ALL
SELECT id, 'participants', 'Participants', 'json', false, false, false, 4 FROM entity_types WHERE name = 'Activity' UNION ALL
SELECT id, 'duration_minutes', 'Duration (minutes)', 'number', false, false, false, 5 FROM entity_types WHERE name = 'Activity' UNION ALL
SELECT id, 'outcome', 'Outcome', 'text', false, false, true, 6 FROM entity_types WHERE name = 'Activity';

-- Insert relationship types
INSERT INTO relationship_types (name, description, direction)
VALUES
  ('owns', 'Entity A owns Entity B (parent-child ownership)', 'one-way'),
  ('related_to', 'Bidirectional relationship between entities', 'two-way'),
  ('member_of', 'Person is member of a group/organization', 'one-way'),
  ('linked_to', 'Soft link between related entities', 'two-way'),
  ('parent', 'Hierarchical parent relationship', 'one-way'),
  ('child', 'Hierarchical child relationship', 'one-way'),
  ('associated_with', 'General association', 'two-way');

COMMIT;
