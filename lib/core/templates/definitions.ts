// Operational Template Definitions
// Maps all Coda templates to working capabilities and features

import type { OperationalTemplate } from './types';

export const operationalTemplates: OperationalTemplate[] = [
  {
    id: 'deal-tracker',
    name: 'Deal Tracker',
    description: 'Track and manage sales deals through pipeline stages',
    department: 'sales',
    purpose: 'Track deals, forecast revenue, manage pipeline',
    icon: '💰',
    color: 'emerald',
    sections: [
      {
        id: 'deal-info',
        name: 'Deal Information',
        description: 'Core deal details and customer info',
        icon: '📋',
        fields: [
          { id: 'deal-name', name: 'Deal Name', type: 'text', label: 'Deal Name', required: true },
          { id: 'account', name: 'Account', type: 'select', label: 'Customer Account', required: true },
          { id: 'amount', name: 'Amount', type: 'number', label: 'Deal Value ($)', required: true },
          { id: 'stage', name: 'Stage', type: 'select', label: 'Pipeline Stage', 
            options: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
            required: true 
          },
          { id: 'close-date', name: 'Close Date', type: 'date', label: 'Expected Close Date' },
          { id: 'probability', name: 'Probability', type: 'number', label: 'Win Probability (%)', placeholder: '0-100' },
          { id: 'owner', name: 'Deal Owner', type: 'select', label: 'Sales Rep' },
        ],
        views: [
          {
            id: 'kanban-pipeline',
            name: 'Pipeline Kanban',
            type: 'kanban',
            fields: ['deal-name', 'account', 'amount', 'probability'],
            groupBy: 'stage',
            sortBy: 'amount',
          },
          {
            id: 'forecast-table',
            name: 'Revenue Forecast',
            type: 'table',
            fields: ['deal-name', 'account', 'amount', 'stage', 'close-date', 'probability'],
          },
        ],
      },
      {
        id: 'engagement',
        name: 'Engagement Tracking',
        description: 'Track interactions and touchpoints',
        icon: '📞',
        fields: [
          { id: 'last-contact', name: 'Last Contact', type: 'date', label: 'Last Contact Date' },
          { id: 'contact-count', name: 'Contact Count', type: 'number', label: 'Number of Touches' },
          { id: 'next-step', name: 'Next Step', type: 'text', label: 'Next Action' },
          { id: 'notes', name: 'Notes', type: 'text', label: 'Contact Notes' },
        ],
        views: [
          {
            id: 'engagement-timeline',
            name: 'Contact Timeline',
            type: 'timeline',
            fields: ['last-contact', 'next-step'],
          },
        ],
      },
    ],
    actions: [
      {
        id: 'mark-won',
        name: 'Mark as Won',
        description: 'Close deal as won',
        icon: '✅',
        trigger: 'button',
        capability: 'close-deal',
        confirmation: 'This will close the deal as won. Continue?',
      },
      {
        id: 'send-proposal',
        name: 'Send Proposal',
        description: 'Generate and send proposal',
        icon: '📄',
        trigger: 'button',
        connector: 'email',
      },
      {
        id: 'add-event',
        name: 'Schedule Follow-up',
        description: 'Add to calendar',
        icon: '📅',
        trigger: 'button',
        connector: 'calendar',
      },
    ],
    integrations: ['salesforce', 'hubspot', 'slack', 'calendar', 'email'],
  },

  {
    id: 'customer-health',
    name: 'Customer Health Dashboard',
    description: 'Monitor customer health scores and risks',
    department: 'csm',
    purpose: 'Track customer health, identify at-risk accounts, manage retention',
    icon: '💚',
    color: 'blue',
    sections: [
      {
        id: 'health-metrics',
        name: 'Health Metrics',
        description: 'Key health indicators',
        icon: '📊',
        fields: [
          { id: 'account', name: 'Account', type: 'select', label: 'Customer Account', required: true },
          { id: 'health-score', name: 'Health Score', type: 'number', label: 'Overall Health (0-100)', 
            formula: 'engagement * 0.3 + usage * 0.4 + support_tickets * 0.2 + nps * 0.1' 
          },
          { id: 'engagement', name: 'Engagement Score', type: 'number', label: 'Engagement (0-100)' },
          { id: 'usage', name: 'Product Usage', type: 'number', label: 'Usage Score (0-100)' },
          { id: 'nps', name: 'NPS Score', type: 'number', label: 'Net Promoter Score' },
          { id: 'risk-level', name: 'Risk Level', type: 'select', label: 'Risk Assessment',
            options: ['Healthy', 'At Risk', 'Critical'],
          },
          { id: 'csm-owner', name: 'CSM Owner', type: 'select', label: 'Account Manager' },
        ],
        views: [
          {
            id: 'health-dashboard',
            name: 'Health Dashboard',
            type: 'dashboard',
            fields: ['account', 'health-score', 'risk-level'],
          },
          {
            id: 'at-risk',
            name: 'At-Risk Accounts',
            type: 'table',
            fields: ['account', 'health-score', 'risk-level', 'csm-owner'],
            filters: [{ field: 'risk-level', operator: 'in', value: 'At Risk,Critical' }],
          },
        ],
      },
      {
        id: 'activities',
        name: 'Customer Activities',
        description: 'Track customer engagement activities',
        icon: '📈',
        fields: [
          { id: 'activity-type', name: 'Activity Type', type: 'select', label: 'Type',
            options: ['Call', 'Email', 'Meeting', 'Demo', 'Support Ticket'],
          },
          { id: 'activity-date', name: 'Activity Date', type: 'date', label: 'Date' },
          { id: 'outcome', name: 'Outcome', type: 'text', label: 'Activity Outcome' },
        ],
        views: [
          {
            id: 'activity-timeline',
            name: 'Activity Timeline',
            type: 'timeline',
            fields: ['activity-date', 'activity-type', 'outcome'],
          },
        ],
      },
    ],
    actions: [
      {
        id: 'escalate-risk',
        name: 'Escalate Risk',
        description: 'Mark account as critical',
        icon: '⚠️',
        trigger: 'button',
        confirmation: 'This account will be flagged as critical.',
      },
      {
        id: 'schedule-call',
        name: 'Schedule Check-in Call',
        description: 'Schedule customer call',
        icon: '📞',
        trigger: 'button',
        connector: 'calendar',
      },
      {
        id: 'send-health-report',
        name: 'Send Health Report',
        description: 'Email health metrics to customer',
        icon: '📧',
        trigger: 'button',
        connector: 'email',
      },
    ],
    integrations: ['salesforce', 'slack', 'calendar', 'email', 'product-analytics'],
  },

  {
    id: 'campaign-manager',
    name: 'Campaign Manager',
    description: 'Plan and execute marketing campaigns',
    department: 'marketing',
    purpose: 'Manage campaigns, track performance, coordinate across channels',
    icon: '📢',
    color: 'violet',
    sections: [
      {
        id: 'campaign-info',
        name: 'Campaign Details',
        description: 'Campaign planning and setup',
        icon: '📝',
        fields: [
          { id: 'campaign-name', name: 'Campaign Name', type: 'text', label: 'Campaign Name', required: true },
          { id: 'campaign-type', name: 'Campaign Type', type: 'select', label: 'Type',
            options: ['Email', 'Social', 'Webinar', 'Event', 'Content', 'Paid Ads', 'Multi-channel'],
            required: true,
          },
          { id: 'launch-date', name: 'Launch Date', type: 'date', label: 'Launch Date', required: true },
          { id: 'end-date', name: 'End Date', type: 'date', label: 'Campaign End Date' },
          { id: 'budget', name: 'Budget', type: 'number', label: 'Budget ($)' },
          { id: 'target-audience', name: 'Target Audience', type: 'text', label: 'Audience Description' },
          { id: 'owner', name: 'Campaign Owner', type: 'select', label: 'Owner' },
        ],
        views: [
          {
            id: 'campaigns-timeline',
            name: 'Campaign Timeline',
            type: 'timeline',
            fields: ['campaign-name', 'launch-date', 'end-date'],
          },
        ],
      },
      {
        id: 'performance',
        name: 'Performance Metrics',
        description: 'Track campaign metrics',
        icon: '📈',
        fields: [
          { id: 'impressions', name: 'Impressions', type: 'number', label: 'Total Impressions' },
          { id: 'clicks', name: 'Clicks', type: 'number', label: 'Total Clicks' },
          { id: 'ctr', name: 'CTR', type: 'calculated', label: 'Click-through Rate (%)', 
            formula: '(clicks / impressions) * 100' 
          },
          { id: 'conversions', name: 'Conversions', type: 'number', label: 'Conversions' },
          { id: 'roi', name: 'ROI', type: 'calculated', label: 'Return on Investment (%)',
            formula: '((conversions * 100 - budget) / budget) * 100',
          },
        ],
        views: [
          {
            id: 'performance-dashboard',
            name: 'Performance Dashboard',
            type: 'dashboard',
            fields: ['impressions', 'clicks', 'ctr', 'conversions', 'roi'],
          },
        ],
      },
    ],
    actions: [
      {
        id: 'launch-campaign',
        name: 'Launch Campaign',
        description: 'Activate campaign',
        icon: '🚀',
        trigger: 'button',
        confirmation: 'Launch this campaign to all channels?',
      },
      {
        id: 'send-email-blast',
        name: 'Send Email',
        description: 'Execute email send',
        icon: '📧',
        trigger: 'button',
        connector: 'email',
      },
    ],
    integrations: ['hubspot', 'mailchimp', 'slack', 'analytics', 'social-media'],
  },

  {
    id: 'revenue-operations',
    name: 'Revenue Operations Hub',
    description: 'Track ARR, MRR, and revenue metrics',
    department: 'finance',
    purpose: 'Monitor revenue streams, forecast, manage collections',
    icon: '💵',
    color: 'amber',
    sections: [
      {
        id: 'revenue-metrics',
        name: 'Revenue Metrics',
        description: 'Key revenue indicators',
        icon: '📊',
        fields: [
          { id: 'period', name: 'Period', type: 'select', label: 'Time Period',
            options: ['Current Month', 'Current Quarter', 'Current Year', 'Custom'],
            required: true,
          },
          { id: 'arr', name: 'ARR', type: 'calculated', label: 'Annual Recurring Revenue',
            formula: 'sum(mrr) * 12',
          },
          { id: 'mrr', name: 'MRR', type: 'number', label: 'Monthly Recurring Revenue ($)' },
          { id: 'arpu', name: 'ARPU', type: 'calculated', label: 'Average Revenue Per User',
            formula: 'arr / customer_count',
          },
          { id: 'churn-rate', name: 'Churn Rate', type: 'number', label: 'Churn Rate (%)' },
          { id: 'growth-rate', name: 'Growth Rate', type: 'number', label: 'MoM Growth (%)' },
        ],
        views: [
          {
            id: 'revenue-dashboard',
            name: 'Revenue Dashboard',
            type: 'dashboard',
            fields: ['arr', 'mrr', 'arpu', 'churn-rate', 'growth-rate'],
          },
        ],
      },
      {
        id: 'collections',
        name: 'Collections & AR',
        description: 'Manage accounts receivable',
        icon: '🔖',
        fields: [
          { id: 'customer-name', name: 'Customer', type: 'select', label: 'Customer Account' },
          { id: 'invoice-amount', name: 'Invoice Amount', type: 'number', label: 'Amount Due ($)' },
          { id: 'days-overdue', name: 'Days Overdue', type: 'number', label: 'Days Overdue' },
          { id: 'collection-status', name: 'Status', type: 'select', label: 'Collection Status',
            options: ['Current', '1-30 Days', '30-60 Days', '60+ Days', 'Disputed'],
          },
        ],
        views: [
          {
            id: 'ar-aging',
            name: 'AR Aging',
            type: 'table',
            fields: ['customer-name', 'invoice-amount', 'days-overdue', 'collection-status'],
            sortBy: 'days-overdue',
          },
        ],
      },
    ],
    actions: [
      {
        id: 'send-invoice',
        name: 'Send Invoice',
        description: 'Email invoice to customer',
        icon: '📄',
        trigger: 'button',
        connector: 'email',
      },
      {
        id: 'record-payment',
        name: 'Record Payment',
        description: 'Mark invoice as paid',
        icon: '✅',
        trigger: 'button',
      },
    ],
    integrations: ['stripe', 'quickbooks', 'slack', 'email'],
  },

  {
    id: 'project-tracker',
    name: 'Project Tracker',
    description: 'Manage projects and workstreams',
    department: 'ops',
    purpose: 'Plan, track, and coordinate projects',
    icon: '📌',
    color: 'slate',
    sections: [
      {
        id: 'project-info',
        name: 'Project Details',
        description: 'Project planning and overview',
        icon: '📋',
        fields: [
          { id: 'project-name', name: 'Project Name', type: 'text', label: 'Project Name', required: true },
          { id: 'status', name: 'Status', type: 'select', label: 'Project Status',
            options: ['Planning', 'In Progress', 'On Hold', 'Complete', 'Archived'],
            required: true,
          },
          { id: 'start-date', name: 'Start Date', type: 'date', label: 'Start Date' },
          { id: 'end-date', name: 'End Date', type: 'date', label: 'Target End Date' },
          { id: 'owner', name: 'Project Owner', type: 'select', label: 'Owner' },
          { id: 'priority', name: 'Priority', type: 'select', label: 'Priority',
            options: ['Critical', 'High', 'Medium', 'Low'],
          },
        ],
        views: [
          {
            id: 'project-timeline',
            name: 'Project Timeline',
            type: 'timeline',
            fields: ['project-name', 'start-date', 'end-date', 'status'],
          },
          {
            id: 'projects-kanban',
            name: 'Projects by Status',
            type: 'kanban',
            fields: ['project-name', 'priority', 'owner'],
            groupBy: 'status',
          },
        ],
      },
      {
        id: 'tasks',
        name: 'Tasks & Workstreams',
        description: 'Track individual tasks',
        icon: '✅',
        fields: [
          { id: 'task-name', name: 'Task', type: 'text', label: 'Task Name' },
          { id: 'task-status', name: 'Status', type: 'select', label: 'Status',
            options: ['Todo', 'In Progress', 'Done'],
          },
          { id: 'assignee', name: 'Assignee', type: 'select', label: 'Assigned To' },
          { id: 'due-date', name: 'Due Date', type: 'date', label: 'Due Date' },
          { id: 'task-priority', name: 'Priority', type: 'select', label: 'Priority',
            options: ['Critical', 'High', 'Medium', 'Low'],
          },
        ],
        views: [
          {
            id: 'tasks-kanban',
            name: 'Tasks Board',
            type: 'kanban',
            fields: ['task-name', 'assignee', 'due-date'],
            groupBy: 'task-status',
          },
        ],
      },
    ],
    actions: [
      {
        id: 'update-status',
        name: 'Update Status',
        description: 'Change project status',
        icon: '🔄',
        trigger: 'button',
      },
      {
        id: 'notify-team',
        name: 'Notify Team',
        description: 'Send update to team',
        icon: '📢',
        trigger: 'button',
        connector: 'slack',
      },
    ],
    integrations: ['slack', 'calendar', 'email', 'github'],
  },

  {
    id: 'product-roadmap',
    name: 'Product Roadmap',
    description: 'Plan and communicate product strategy',
    department: 'product',
    purpose: 'Manage features, releases, and roadmap',
    icon: '🗺️',
    color: 'cyan',
    sections: [
      {
        id: 'features',
        name: 'Feature Planning',
        description: 'Track product features',
        icon: '⚙️',
        fields: [
          { id: 'feature-name', name: 'Feature Name', type: 'text', label: 'Feature Name', required: true },
          { id: 'description', name: 'Description', type: 'text', label: 'Feature Description' },
          { id: 'release-quarter', name: 'Release', type: 'select', label: 'Target Release',
            options: ['Q1', 'Q2', 'Q3', 'Q4', 'TBD'],
          },
          { id: 'status', name: 'Status', type: 'select', label: 'Development Status',
            options: ['Planned', 'In Design', 'In Development', 'In QA', 'Released'],
          },
          { id: 'owner', name: 'Owner', type: 'select', label: 'Feature Owner' },
        ],
        views: [
          {
            id: 'roadmap-timeline',
            name: 'Product Roadmap',
            type: 'timeline',
            fields: ['feature-name', 'release-quarter', 'status'],
          },
        ],
      },
    ],
    actions: [
      {
        id: 'share-roadmap',
        name: 'Share Roadmap',
        description: 'Share with stakeholders',
        icon: '📤',
        trigger: 'button',
        connector: 'email',
      },
    ],
    integrations: ['github', 'slack', 'jira'],
  },
];

export function getTemplateRegistry() {
  return {
    templates: operationalTemplates,
    getTemplate(id: string) {
      return operationalTemplates.find(t => t.id === id);
    },
    getTemplatesByDepartment(department: string) {
      return operationalTemplates.filter(t => t.department === department);
    },
    searchTemplates(query: string) {
      const q = query.toLowerCase();
      return operationalTemplates.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.purpose.toLowerCase().includes(q)
      );
    },
  };
}
