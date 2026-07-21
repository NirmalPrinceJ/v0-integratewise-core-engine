/**
 * Lifecycle Event System
 * 27 lifecycle categories that drive all operations
 */

export type LifecycleCategory =
  | 'strategy'
  | 'product'
  | 'architecture'
  | 'engineering'
  | 'content'
  | 'design'
  | 'website'
  | 'campaign'
  | 'social-media'
  | 'seo'
  | 'sales'
  | 'customer-success'
  | 'support'
  | 'marketing'
  | 'partnership'
  | 'hiring'
  | 'employee'
  | 'finance'
  | 'legal'
  | 'connector'
  | 'ai'
  | 'knowledge'
  | 'decision'
  | 'risk'
  | 'release'
  | 'operational-automation'
  | 'governance';

export interface LifecycleEvent {
  id: string;
  category: LifecycleCategory;
  eventType: string;
  timestamp: Date;
  entityId: string;
  entityType: string;
  context: Record<string, any>;
  triggers: string[]; // which workflows this triggers
  connectedTools: string[]; // which tools handle this event
}

export interface LifecycleStage {
  category: LifecycleCategory;
  stages: string[];
  universalStages: boolean; // if true, follows universal lifecycle
}

export interface RecurringEventDomain {
  id: string;
  name: string;
  cadences: {
    daily?: string[];
    weekly?: string[];
    monthly?: string[];
    quarterly?: string[];
    yearly?: string[];
  };
  connectedTools: string[];
  recipients: string[];
}

export interface RecurringEvent {
  id: string;
  domainId: string;
  eventName: string;
  cadence: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  trigger: string;
  inputs: string[];
  workflow: string[];
  outputs: string[];
  recipients: string[];
  sla: string;
  successCriteria: string;
  knowledgeCapture: boolean;
}

export const UNIVERSAL_LIFECYCLE = [
  'detect',
  'capture',
  'classify',
  'prioritize',
  'plan',
  'create',
  'review',
  'approve',
  'execute',
  'monitor',
  'measure',
  'learn',
  'capture-knowledge',
  'improve',
  'archive',
  'repeat',
];

export const LIFECYCLE_CATEGORIES: Record<LifecycleCategory, string[]> = {
  'strategy': [
    'idea-created', 'research-started', 'research-completed', 'problem-identified',
    'opportunity-identified', 'proposal-created', 'proposal-reviewed', 'proposal-approved',
    'proposal-rejected', 'initiative-created', 'objective-created', 'kr-defined',
    'roadmap-updated', 'priority-changed', 'decision-recorded', 'strategy-published', 'strategy-archived'
  ],
  'product': [
    'feature-requested', 'customer-request-linked', 'discovery-started', 'research-completed',
    'requirements-created', 'spec-approved', 'ux-started', 'ux-approved', 'engineering-started',
    'development-complete', 'qa-started', 'qa-passed', 'release-candidate', 'released',
    'feature-enabled', 'feature-deprecated', 'feature-removed', 'documentation-updated'
  ],
  'architecture': [
    'architecture-proposal', 'adr-created', 'adr-approved', 'adr-superseded', 'pattern-added',
    'pattern-deprecated', 'capability-created', 'capability-modified', 'capability-retired',
    'schema-updated', 'connector-added', 'connector-removed', 'governance-updated'
  ],
  'engineering': [
    'issue-created', 'issue-assigned', 'development-started', 'pr-opened', 'pr-reviewed',
    'changes-requested', 'pr-approved', 'merged', 'build-started', 'build-failed', 'build-passed',
    'deployment-started', 'deployment-completed', 'rollback', 'incident-opened', 'incident-resolved',
    'postmortem-created'
  ],
  'content': [
    'idea-captured', 'research-started', 'outline-created', 'writing-started', 'draft-completed',
    'internal-review', 'ai-review', 'legal-review', 'brand-review', 'approved', 'design-requested',
    'design-completed', 'scheduled', 'published', 'republished', 'repurposed', 'archived',
    'performance-reviewed', 'knowledge-captured'
  ],
  'design': [
    'request-created', 'brief-approved', 'wireframe', 'concept', 'first-draft', 'review',
    'revision-requested', 'revision-completed', 'final-approved', 'export-generated',
    'asset-delivered', 'asset-archived'
  ],
  'website': [
    'page-requested', 'content-ready', 'design-ready', 'development-started', 'seo-completed',
    'qa-completed', 'published', 'ab-test-started', 'analytics-review', 'optimization-started', 'archived'
  ],
  'campaign': [
    'campaign-proposed', 'budget-approved', 'audience-defined', 'landing-page-ready', 'assets-ready',
    'emails-ready', 'social-ready', 'launch-approved', 'campaign-launched', 'campaign-paused',
    'campaign-optimized', 'campaign-closed', 'lessons-captured'
  ],
  'social-media': [
    'post-idea', 'copy-draft', 'creative-ready', 'review', 'scheduled', 'published',
    'performance-measured', 'repurposed', 'archived'
  ],
  'seo': [
    'keyword-added', 'content-planned', 'optimization-started', 'optimization-completed',
    'indexed', 'ranking-improved', 'ranking-dropped', 'backlink-added', 'audit-completed'
  ],
  'sales': [
    'lead-created', 'lead-qualified', 'discovery-booked', 'demo-scheduled', 'demo-completed',
    'proposal-sent', 'negotiation-started', 'procurement', 'legal-review', 'won', 'lost',
    'expansion-opportunity', 'renewal-due', 'renewed', 'churned'
  ],
  'customer-success': [
    'customer-created', 'onboarding-started', 'onboarding-complete', 'health-updated',
    'risk-identified', 'executive-review', 'renewal-started', 'expansion-opportunity',
    'renewed', 'churned', 'case-study-created'
  ],
  'support': [
    'ticket-opened', 'assigned', 'investigating', 'escalated', 'bug-created', 'waiting-customer',
    'resolved', 'closed', 'satisfaction-received', 'knowledge-article-created'
  ],
  'marketing': [
    'idea', 'research', 'plan', 'create', 'design', 'review', 'approve', 'schedule',
    'publish', 'promote', 'track', 'optimize', 'repurpose', 'archive'
  ],
  'partnership': [
    'partner-identified', 'contacted', 'meeting-scheduled', 'evaluation', 'agreement-drafted',
    'signed', 'integration-started', 'launch', 'review', 'renewed', 'ended'
  ],
  'hiring': [
    'role-created', 'published', 'application-received', 'screening', 'interview', 'assessment',
    'offer', 'accepted', 'rejected', 'onboarding', 'completed'
  ],
  'employee': [
    'joined', 'provisioned', 'training', 'performance-review', 'promotion', 'role-changed',
    'offboarding', 'access-revoked', 'knowledge-transfer'
  ],
  'finance': [
    'budget-created', 'budget-approved', 'invoice-received', 'invoice-paid', 'expense-submitted',
    'expense-approved', 'payroll', 'forecast-updated', 'month-closed', 'quarter-closed'
  ],
  'legal': [
    'contract-requested', 'drafted', 'internal-review', 'external-review', 'signed',
    'renewal-reminder', 'expired', 'archived'
  ],
  'connector': [
    'connector-requested', 'connector-registered', 'authentication', 'permissions-granted',
    'initial-sync', 'validation', 'production-enabled', 'error', 'disabled', 'retired'
  ],
  'ai': [
    'prompt-created', 'knowledge-updated', 'model-changed', 'twin-updated', 'capability-added',
    'capability-tested', 'human-approved', 'production-enabled', 'performance-reviewed', 'retired'
  ],
  'knowledge': [
    'knowledge-captured', 'reviewed', 'approved', 'published', 'referenced', 'updated',
    'deprecated', 'archived'
  ],
  'decision': [
    'decision-proposed', 'discussion-started', 'evidence-added', 'approved', 'implemented',
    'reviewed', 'reversed', 'archived'
  ],
  'risk': [
    'risk-identified', 'impact-assessed', 'owner-assigned', 'mitigation-planned', 'mitigation-started',
    'resolved', 'accepted', 'closed'
  ],
  'release': [
    'planned', 'scope-locked', 'development', 'testing', 'go-no-go', 'released',
    'monitoring', 'hotfix', 'stable', 'retrospective'
  ],
  'operational-automation': [
    'trigger-fired', 'workflow-started', 'task-created', 'notification-sent', 'approval-requested',
    'approval-received', 'automation-completed', 'automation-failed', 'retry', 'escalation', 'audit-logged'
  ],
  'governance': [
    'policy-created', 'policy-updated', 'approval-requested', 'approved', 'violation-detected',
    'exception-requested', 'exception-approved', 'audit-completed'
  ],
};
