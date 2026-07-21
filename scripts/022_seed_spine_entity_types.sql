-- 022_seed_spine_entity_types.sql
-- Seeds core entity types and field definitions into spine_entity_types and spine_fields

-- CRM Entities
INSERT INTO spine_entity_types (name, plural, description, icon, color, category) VALUES
  ('account', 'accounts', 'Customer/Company entity', '🏢', '#3B82F6', 'CRM'),
  ('contact', 'contacts', 'Person entity', '👤', '#8B5CF6', 'CRM'),
  ('deal', 'deals', 'Sales opportunity/deal', '💼', '#10B981', 'CRM'),
  ('opportunity', 'opportunities', 'Potential business opportunity', '🎯', '#F59E0B', 'CRM'),
  ('lead', 'leads', 'Sales lead', '🔥', '#EF4444', 'CRM');

-- Operations Entities
INSERT INTO spine_entity_types (name, plural, description, icon, color, category) VALUES
  ('task', 'tasks', 'Action item or task', '✓', '#06B6D4', 'Operations'),
  ('meeting', 'meetings', 'Calendar meeting/event', '📅', '#EC4899', 'Operations'),
  ('project', 'projects', 'Project or initiative', '📊', '#6366F1', 'Operations');

-- Communication Entities
INSERT INTO spine_entity_types (name, plural, description, icon, color, category) VALUES
  ('email', 'emails', 'Email message', '📧', '#78716C', 'Communication'),
  ('message', 'messages', 'Chat/Slack message', '💬', '#0891B2', 'Communication');

-- Knowledge Entities
INSERT INTO spine_entity_types (name, plural, description, icon, color, category) VALUES
  ('document', 'documents', 'Knowledge base document', '📄', '#64748B', 'Knowledge'),
  ('note', 'notes', 'Text note or memo', '📝', '#FB923C', 'Knowledge');

-- Finance Entities
INSERT INTO spine_entity_types (name, plural, description, icon, color, category) VALUES
  ('invoice', 'invoices', 'Customer invoice', '💵', '#059669', 'Finance'),
  ('payment', 'payments', 'Payment transaction', '💳', '#7C2D12', 'Finance');

-- Organization Entities
INSERT INTO spine_entity_types (name, plural, description, icon, color, category) VALUES
  ('team_member', 'team_members', 'Employee or team member', '👨‍💼', '#1E40AF', 'Organization'),
  ('team', 'teams', 'Department or team', '👥', '#1E3A8A', 'Organization');

-- Now seed field definitions for each entity type

-- Account fields
INSERT INTO spine_fields (entity_type_id, name, field_type, required, indexed, searchable, display_order) 
SELECT id, 'name', 'text', TRUE, TRUE, TRUE, 1 FROM spine_entity_types WHERE name = 'account'
UNION ALL
SELECT id, 'industry', 'text', FALSE, TRUE, TRUE, 2 FROM spine_entity_types WHERE name = 'account'
UNION ALL
SELECT id, 'owner_id', 'uuid', FALSE, TRUE, FALSE, 3 FROM spine_entity_types WHERE name = 'account'
UNION ALL
SELECT id, 'health_score', 'number', FALSE, FALSE, FALSE, 4 FROM spine_entity_types WHERE name = 'account'
UNION ALL
SELECT id, 'arr', 'number', FALSE, TRUE, FALSE, 5 FROM spine_entity_types WHERE name = 'account'
UNION ALL
SELECT id, 'logo_url', 'text', FALSE, FALSE, FALSE, 6 FROM spine_entity_types WHERE name = 'account';

-- Contact fields
INSERT INTO spine_fields (entity_type_id, name, field_type, required, indexed, searchable, display_order)
SELECT id, 'name', 'text', TRUE, TRUE, TRUE, 1 FROM spine_entity_types WHERE name = 'contact'
UNION ALL
SELECT id, 'email', 'email', FALSE, TRUE, TRUE, 2 FROM spine_entity_types WHERE name = 'contact'
UNION ALL
SELECT id, 'phone', 'text', FALSE, FALSE, TRUE, 3 FROM spine_entity_types WHERE name = 'contact'
UNION ALL
SELECT id, 'role', 'text', FALSE, TRUE, FALSE, 4 FROM spine_entity_types WHERE name = 'contact'
UNION ALL
SELECT id, 'title', 'text', FALSE, FALSE, TRUE, 5 FROM spine_entity_types WHERE name = 'contact';

-- Deal fields
INSERT INTO spine_fields (entity_type_id, name, field_type, required, indexed, searchable, display_order)
SELECT id, 'name', 'text', TRUE, TRUE, TRUE, 1 FROM spine_entity_types WHERE name = 'deal'
UNION ALL
SELECT id, 'stage', 'text', TRUE, TRUE, FALSE, 2 FROM spine_entity_types WHERE name = 'deal'
UNION ALL
SELECT id, 'value', 'number', FALSE, TRUE, FALSE, 3 FROM spine_entity_types WHERE name = 'deal'
UNION ALL
SELECT id, 'close_date', 'date', FALSE, TRUE, FALSE, 4 FROM spine_entity_types WHERE name = 'deal'
UNION ALL
SELECT id, 'probability', 'number', FALSE, FALSE, FALSE, 5 FROM spine_entity_types WHERE name = 'deal'
UNION ALL
SELECT id, 'owner_id', 'uuid', FALSE, TRUE, FALSE, 6 FROM spine_entity_types WHERE name = 'deal';

-- Opportunity fields
INSERT INTO spine_fields (entity_type_id, name, field_type, required, indexed, searchable, display_order)
SELECT id, 'name', 'text', TRUE, TRUE, TRUE, 1 FROM spine_entity_types WHERE name = 'opportunity'
UNION ALL
SELECT id, 'value', 'number', FALSE, TRUE, FALSE, 2 FROM spine_entity_types WHERE name = 'opportunity'
UNION ALL
SELECT id, 'status', 'text', TRUE, TRUE, FALSE, 3 FROM spine_entity_types WHERE name = 'opportunity';

-- Lead fields
INSERT INTO spine_fields (entity_type_id, name, field_type, required, indexed, searchable, display_order)
SELECT id, 'name', 'text', TRUE, TRUE, TRUE, 1 FROM spine_entity_types WHERE name = 'lead'
UNION ALL
SELECT id, 'email', 'email', FALSE, TRUE, TRUE, 2 FROM spine_entity_types WHERE name = 'lead'
UNION ALL
SELECT id, 'source', 'text', FALSE, TRUE, FALSE, 3 FROM spine_entity_types WHERE name = 'lead'
UNION ALL
SELECT id, 'status', 'text', FALSE, TRUE, FALSE, 4 FROM spine_entity_types WHERE name = 'lead';

-- Task fields
INSERT INTO spine_fields (entity_type_id, name, field_type, required, indexed, searchable, display_order)
SELECT id, 'title', 'text', TRUE, TRUE, TRUE, 1 FROM spine_entity_types WHERE name = 'task'
UNION ALL
SELECT id, 'owner_id', 'uuid', FALSE, TRUE, FALSE, 2 FROM spine_entity_types WHERE name = 'task'
UNION ALL
SELECT id, 'due_date', 'date', FALSE, TRUE, FALSE, 3 FROM spine_entity_types WHERE name = 'task'
UNION ALL
SELECT id, 'priority', 'text', FALSE, FALSE, FALSE, 4 FROM spine_entity_types WHERE name = 'task'
UNION ALL
SELECT id, 'status', 'text', FALSE, TRUE, FALSE, 5 FROM spine_entity_types WHERE name = 'task';

-- Meeting fields
INSERT INTO spine_fields (entity_type_id, name, field_type, required, indexed, searchable, display_order)
SELECT id, 'title', 'text', TRUE, TRUE, TRUE, 1 FROM spine_entity_types WHERE name = 'meeting'
UNION ALL
SELECT id, 'start_time', 'date', TRUE, TRUE, FALSE, 2 FROM spine_entity_types WHERE name = 'meeting'
UNION ALL
SELECT id, 'duration', 'number', FALSE, FALSE, FALSE, 3 FROM spine_entity_types WHERE name = 'meeting'
UNION ALL
SELECT id, 'location', 'text', FALSE, FALSE, TRUE, 4 FROM spine_entity_types WHERE name = 'meeting';

-- Project fields
INSERT INTO spine_fields (entity_type_id, name, field_type, required, indexed, searchable, display_order)
SELECT id, 'name', 'text', TRUE, TRUE, TRUE, 1 FROM spine_entity_types WHERE name = 'project'
UNION ALL
SELECT id, 'owner_id', 'uuid', FALSE, TRUE, FALSE, 2 FROM spine_entity_types WHERE name = 'project'
UNION ALL
SELECT id, 'status', 'text', FALSE, TRUE, FALSE, 3 FROM spine_entity_types WHERE name = 'project'
UNION ALL
SELECT id, 'start_date', 'date', FALSE, FALSE, FALSE, 4 FROM spine_entity_types WHERE name = 'project'
UNION ALL
SELECT id, 'end_date', 'date', FALSE, FALSE, FALSE, 5 FROM spine_entity_types WHERE name = 'project';

-- Email fields
INSERT INTO spine_fields (entity_type_id, name, field_type, required, indexed, searchable, display_order)
SELECT id, 'from', 'email', TRUE, TRUE, FALSE, 1 FROM spine_entity_types WHERE name = 'email'
UNION ALL
SELECT id, 'to', 'text', TRUE, FALSE, FALSE, 2 FROM spine_entity_types WHERE name = 'email'
UNION ALL
SELECT id, 'subject', 'text', TRUE, TRUE, TRUE, 3 FROM spine_entity_types WHERE name = 'email'
UNION ALL
SELECT id, 'body', 'text', FALSE, FALSE, TRUE, 4 FROM spine_entity_types WHERE name = 'email';

-- Message fields
INSERT INTO spine_fields (entity_type_id, name, field_type, required, indexed, searchable, display_order)
SELECT id, 'channel', 'text', TRUE, TRUE, FALSE, 1 FROM spine_entity_types WHERE name = 'message'
UNION ALL
SELECT id, 'author_id', 'uuid', TRUE, TRUE, FALSE, 2 FROM spine_entity_types WHERE name = 'message'
UNION ALL
SELECT id, 'body', 'text', TRUE, FALSE, TRUE, 3 FROM spine_entity_types WHERE name = 'message';

-- Document fields
INSERT INTO spine_fields (entity_type_id, name, field_type, required, indexed, searchable, display_order)
SELECT id, 'title', 'text', TRUE, TRUE, TRUE, 1 FROM spine_entity_types WHERE name = 'document'
UNION ALL
SELECT id, 'owner_id', 'uuid', FALSE, TRUE, FALSE, 2 FROM spine_entity_types WHERE name = 'document'
UNION ALL
SELECT id, 'content', 'text', FALSE, FALSE, TRUE, 3 FROM spine_entity_types WHERE name = 'document';

-- Note fields
INSERT INTO spine_fields (entity_type_id, name, field_type, required, indexed, searchable, display_order)
SELECT id, 'title', 'text', TRUE, TRUE, TRUE, 1 FROM spine_entity_types WHERE name = 'note'
UNION ALL
SELECT id, 'content', 'text', TRUE, FALSE, TRUE, 2 FROM spine_entity_types WHERE name = 'note'
UNION ALL
SELECT id, 'owner_id', 'uuid', FALSE, TRUE, FALSE, 3 FROM spine_entity_types WHERE name = 'note';

-- Invoice fields
INSERT INTO spine_fields (entity_type_id, name, field_type, required, indexed, searchable, display_order)
SELECT id, 'number', 'text', TRUE, TRUE, TRUE, 1 FROM spine_entity_types WHERE name = 'invoice'
UNION ALL
SELECT id, 'amount', 'number', TRUE, TRUE, FALSE, 2 FROM spine_entity_types WHERE name = 'invoice'
UNION ALL
SELECT id, 'status', 'text', TRUE, TRUE, FALSE, 3 FROM spine_entity_types WHERE name = 'invoice'
UNION ALL
SELECT id, 'due_date', 'date', FALSE, TRUE, FALSE, 4 FROM spine_entity_types WHERE name = 'invoice';

-- Payment fields
INSERT INTO spine_fields (entity_type_id, name, field_type, required, indexed, searchable, display_order)
SELECT id, 'amount', 'number', TRUE, TRUE, FALSE, 1 FROM spine_entity_types WHERE name = 'payment'
UNION ALL
SELECT id, 'status', 'text', TRUE, TRUE, FALSE, 2 FROM spine_entity_types WHERE name = 'payment'
UNION ALL
SELECT id, 'date', 'date', TRUE, TRUE, FALSE, 3 FROM spine_entity_types WHERE name = 'payment';

-- Team Member fields
INSERT INTO spine_fields (entity_type_id, name, field_type, required, indexed, searchable, display_order)
SELECT id, 'name', 'text', TRUE, TRUE, TRUE, 1 FROM spine_entity_types WHERE name = 'team_member'
UNION ALL
SELECT id, 'email', 'email', FALSE, TRUE, TRUE, 2 FROM spine_entity_types WHERE name = 'team_member'
UNION ALL
SELECT id, 'department', 'text', FALSE, TRUE, FALSE, 3 FROM spine_entity_types WHERE name = 'team_member'
UNION ALL
SELECT id, 'role', 'text', FALSE, FALSE, FALSE, 4 FROM spine_entity_types WHERE name = 'team_member';

-- Team fields
INSERT INTO spine_fields (entity_type_id, name, field_type, required, indexed, searchable, display_order)
SELECT id, 'name', 'text', TRUE, TRUE, TRUE, 1 FROM spine_entity_types WHERE name = 'team'
UNION ALL
SELECT id, 'description', 'text', FALSE, FALSE, TRUE, 2 FROM spine_entity_types WHERE name = 'team'
UNION ALL
SELECT id, 'owner_id', 'uuid', FALSE, TRUE, FALSE, 3 FROM spine_entity_types WHERE name = 'team';
