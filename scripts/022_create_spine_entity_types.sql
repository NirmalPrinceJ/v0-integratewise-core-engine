-- Seed Spine Entity Types for Startup Operations
-- These are the core business entities every startup needs to track

INSERT INTO spine_entity_types (name, plural, description, icon, color) VALUES
-- CRM Entities
('account', 'accounts', 'Company account', 'building-2', '#3B82F6'),
('contact', 'contacts', 'Person contact', 'user', '#8B5CF6'),
('deal', 'deals', 'Sales opportunity', 'briefcase', '#10B981'),
('lead', 'leads', 'Prospective customer', 'zap', '#F59E0B'),
('opportunity', 'opportunities', 'Revenue opportunity', 'target', '#EF4444'),

-- Operations & Tasks
('task', 'tasks', 'Todo item', 'check-square', '#06B6D4'),
('project', 'projects', 'Project container', 'layers', '#EC4899'),
('milestone', 'milestones', 'Project milestone', 'flag', '#F97316'),
('meeting', 'meetings', 'Scheduled meeting', 'calendar', '#14B8A6'),

-- Communication
('email', 'emails', 'Email message', 'mail', '#6366F1'),
('message', 'messages', 'Chat message', 'message-square', '#8B5CF6'),
('call', 'calls', 'Phone call', 'phone', '#06B6D4'),
('note', 'notes', 'Quick note', 'sticky-note', '#FBBF24'),

-- Documents & Knowledge
('document', 'documents', 'Document artifact', 'file-text', '#6366F1'),
('template', 'templates', 'Reusable template', 'copy', '#14B8A6'),
('decision', 'decisions', 'Decision record', 'checkmark-circle', '#10B981'),

-- Finance & Billing
('invoice', 'invoices', 'Invoice record', 'receipt', '#F59E0B'),
('payment', 'payments', 'Payment transaction', 'credit-card', '#10B981'),
('subscription', 'subscriptions', 'Subscription plan', 'repeat', '#8B5CF6'),

-- Organization
('team_member', 'team_members', 'Team member', 'user-check', '#3B82F6'),
('department', 'departments', 'Org department', 'layout', '#6366F1'),
('role', 'roles', 'Job role', 'briefcase', '#8B5CF6'),

-- Product & Engineering
('feature', 'features', 'Product feature', 'star', '#FBBF24'),
('issue', 'issues', 'Engineering issue', 'alert-circle', '#EF4444'),
('bug', 'bugs', 'Software bug', 'bug', '#DC2626'),
('deployment', 'deployments', 'Code deployment', 'share-2', '#10B981');

-- Add field definitions for core entities
INSERT INTO spine_fields (entity_type, name, field_type, required, indexed) VALUES
('account', 'name', 'text', true, true),
('account', 'industry', 'text', false, false),
('account', 'size', 'text', false, false),
('account', 'arr', 'number', false, true),
('account', 'health_score', 'number', false, true),
('account', 'owner_id', 'uuid', false, true),

('contact', 'name', 'text', true, true),
('contact', 'email', 'text', false, true),
('contact', 'phone', 'text', false, false),
('contact', 'account_id', 'uuid', true, true),
('contact', 'role', 'text', false, false),

('deal', 'name', 'text', true, true),
('deal', 'account_id', 'uuid', true, true),
('deal', 'amount', 'number', false, true),
('deal', 'stage', 'text', false, true),
('deal', 'close_date', 'date', false, true),
('deal', 'probability', 'number', false, false),

('task', 'title', 'text', true, true),
('task', 'description', 'text', false, false),
('task', 'status', 'text', false, true),
('task', 'priority', 'text', false, true),
('task', 'due_date', 'date', false, true),
('task', 'assigned_to', 'uuid', false, true);

