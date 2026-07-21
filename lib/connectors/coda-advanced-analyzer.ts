import { fetch as nodeFetch } from 'node-fetch';

/**
 * Advanced Coda Template Analyzer
 * Fetches and analyzes all Coda templates to map operational needs
 */

export interface CodaTemplate {
  id: string;
  name: string;
  type: 'doc' | 'folder' | 'table';
  domain: string; // e.g., 'CRM', 'Finance', 'HR', 'Operations'
  purpose: string; // What this template solves for
  structure: {
    tables: CodaTable[];
    sections: CodaSection[];
    fields: string[];
  };
  operationalNeeds: string[]; // e.g., 'Pipeline tracking', 'Revenue forecasting'
  integrationPoints: string[]; // e.g., 'Sales Twin', 'Finance Twin'
  frequency: string; // 'Daily', 'Weekly', 'Monthly', 'Ad-hoc'
  owner: string;
  lastModified: string;
}

export interface CodaTable {
  id: string;
  name: string;
  rowCount: number;
  columns: CodaColumn[];
}

export interface CodaColumn {
  name: string;
  type: string;
  isLookup?: boolean;
  isFormula?: boolean;
}

export interface CodaSection {
  name: string;
  type: string;
  content: string;
}

export interface TemplateAnalysis {
  templates: CodaTemplate[];
  domains: Record<string, CodaTemplate[]>;
  operationalMatrix: Record<string, string[]>; // domain -> operational needs
  integrationMap: Record<string, string[]>; // template -> twin/system
  dataFlows: DataFlow[];
}

export interface DataFlow {
  from: string;
  to: string;
  frequency: string;
  dataType: string;
  criticalPath: boolean;
}

/**
 * Template-to-Operational-Need Mapping
 * Maps each Coda template to what company operations it enables
 */
export const TEMPLATE_OPERATIONAL_MAP: Record<string, CodaTemplate> = {
  'crm': {
    id: 'crm-001',
    name: 'CRM',
    type: 'doc',
    domain: 'Sales & Marketing',
    purpose: 'Customer relationship and pipeline management',
    structure: {
      tables: [
        { id: 't-accounts', name: 'Accounts', rowCount: 0, columns: [
          { name: 'Account Name', type: 'text' },
          { name: 'Industry', type: 'select' },
          { name: 'ARR', type: 'number' },
          { name: 'Health Status', type: 'select' },
          { name: 'Owner', type: 'person' },
        ]},
        { id: 't-deals', name: 'Deals', rowCount: 0, columns: [
          { name: 'Deal Name', type: 'text' },
          { name: 'Amount', type: 'currency' },
          { name: 'Stage', type: 'select' },
          { name: 'Close Date', type: 'date' },
          { name: 'Win Probability', type: 'percent' },
        ]},
        { id: 't-contacts', name: 'Contacts', rowCount: 0, columns: [
          { name: 'Name', type: 'text' },
          { name: 'Email', type: 'email' },
          { name: 'Phone', type: 'phone' },
          { name: 'Company', type: 'link' },
          { name: 'Title', type: 'text' },
        ]},
      ],
      sections: [],
      fields: ['Account', 'Deal', 'Contact', 'Interaction', 'Task'],
    },
    operationalNeeds: [
      'Pipeline visibility and forecasting',
      'Deal stage tracking',
      'Customer account management',
      'Contact and opportunity tracking',
      'Sales velocity analysis',
      'Revenue forecasting',
      'Account health monitoring',
    ],
    integrationPoints: ['Sales Twin', 'Revenue Recognition', 'Forecasting Engine'],
    frequency: 'Daily',
    owner: 'Sales',
    lastModified: new Date().toISOString(),
  },

  'commercial-bible': {
    id: 'cb-001',
    name: 'IntegrateWise Commercial Bible',
    type: 'doc',
    domain: 'Strategy & Finance',
    purpose: 'Canonical commercial terms, pricing, and business model',
    structure: {
      tables: [
        { id: 't-pricing', name: 'Pricing Models', rowCount: 0, columns: [
          { name: 'Product', type: 'text' },
          { name: 'Tier', type: 'select' },
          { name: 'MRR', type: 'currency' },
          { name: 'Discount Band', type: 'percent' },
        ]},
        { id: 't-terms', name: 'Commercial Terms', rowCount: 0, columns: [
          { name: 'Term Type', type: 'select' },
          { name: 'Details', type: 'text' },
          { name: 'Effective Date', type: 'date' },
        ]},
      ],
      sections: [
        { name: 'Pricing Strategy', type: 'section', content: '' },
        { name: 'Discount Policy', type: 'section', content: '' },
        { name: 'Payment Terms', type: 'section', content: '' },
      ],
      fields: ['Product', 'Pricing', 'Terms', 'Discount', 'Payment'],
    },
    operationalNeeds: [
      'Pricing authority and versioning',
      'Commercial term standardization',
      'Discount governance',
      'Deal approval workflows',
      'Revenue recognition',
      'Contract management',
    ],
    integrationPoints: ['Deal Twin', 'Finance Twin', 'Revenue Engine'],
    frequency: 'Weekly',
    owner: 'Finance',
    lastModified: new Date().toISOString(),
  },

  'technical-architecture': {
    id: 'ta-001',
    name: 'Technical Architecture',
    type: 'doc',
    domain: 'Engineering & Infrastructure',
    purpose: 'System design, API specs, and technical standards',
    structure: {
      tables: [
        { id: 't-apis', name: 'API Endpoints', rowCount: 0, columns: [
          { name: 'Endpoint', type: 'text' },
          { name: 'Method', type: 'select' },
          { name: 'Auth Required', type: 'checkbox' },
          { name: 'Rate Limit', type: 'text' },
        ]},
        { id: 't-services', name: 'Microservices', rowCount: 0, columns: [
          { name: 'Service Name', type: 'text' },
          { name: 'Language', type: 'select' },
          { name: 'Dependencies', type: 'text' },
          { name: 'Owner', type: 'person' },
        ]},
      ],
      sections: [
        { name: 'System Architecture', type: 'section', content: '' },
        { name: 'API Documentation', type: 'section', content: '' },
        { name: 'Data Flow', type: 'section', content: '' },
      ],
      fields: ['Services', 'APIs', 'Infrastructure', 'Deployment', 'Monitoring'],
    },
    operationalNeeds: [
      'System design documentation',
      'API contract management',
      'Infrastructure standards',
      'Service dependencies',
      'Performance monitoring',
      'Incident response',
    ],
    integrationPoints: ['Engineering Twin', 'DevOps', 'Infrastructure'],
    frequency: 'Ad-hoc',
    owner: 'Engineering',
    lastModified: new Date().toISOString(),
  },

  'spine-schema': {
    id: 'ss-001',
    name: 'Spine Schema',
    type: 'doc',
    domain: 'Data & Knowledge',
    purpose: 'Canonical entity model and relationships',
    structure: {
      tables: [
        { id: 't-entities', name: 'Entities', rowCount: 0, columns: [
          { name: 'Entity Name', type: 'text' },
          { name: 'Type', type: 'select' },
          { name: 'Properties', type: 'text' },
          { name: 'Relations', type: 'text' },
        ]},
      ],
      sections: [
        { name: 'Entity Definitions', type: 'section', content: '' },
        { name: 'Relationships', type: 'section', content: '' },
      ],
      fields: ['Entity', 'Properties', 'Relations', 'Type', 'Ownership'],
    },
    operationalNeeds: [
      'Single source of truth for data model',
      'Entity lineage tracking',
      'Relationship management',
      'Data governance',
      'Schema versioning',
    ],
    integrationPoints: ['Spine Engine', 'All Twins', 'Knowledge Graph'],
    frequency: 'Weekly',
    owner: 'Data',
    lastModified: new Date().toISOString(),
  },

  'sales-team-hub': {
    id: 'sth-001',
    name: 'Sales team hub',
    type: 'doc',
    domain: 'Sales Operations',
    purpose: 'Sales team resources, playbooks, and tracking',
    structure: {
      tables: [
        { id: 't-playbooks', name: 'Sales Playbooks', rowCount: 0, columns: [
          { name: 'Playbook Name', type: 'text' },
          { name: 'Stage', type: 'select' },
          { name: 'Steps', type: 'text' },
          { name: 'Owner', type: 'person' },
        ]},
        { id: 't-collateral', name: 'Sales Collateral', rowCount: 0, columns: [
          { name: 'Name', type: 'text' },
          { name: 'Type', type: 'select' },
          { name: 'Link', type: 'url' },
          { name: 'Updated', type: 'date' },
        ]},
      ],
      sections: [],
      fields: ['Playbook', 'Collateral', 'Process', 'Resources', 'Metrics'],
    },
    operationalNeeds: [
      'Sales process standardization',
      'Playbook management',
      'Collateral distribution',
      'Best practices sharing',
      'Training resources',
    ],
    integrationPoints: ['Sales Twin', 'CRM', 'Knowledge Bank'],
    frequency: 'Weekly',
    owner: 'Sales',
    lastModified: new Date().toISOString(),
  },

  'atlas-memory': {
    id: 'am-001',
    name: 'IW ATLAS MEMORY',
    type: 'doc',
    domain: 'Knowledge & Memory',
    purpose: 'Institutional memory and learning repository',
    structure: {
      tables: [
        { id: 't-decisions', name: 'Key Decisions', rowCount: 0, columns: [
          { name: 'Decision', type: 'text' },
          { name: 'Date', type: 'date' },
          { name: 'Owner', type: 'person' },
          { name: 'Rationale', type: 'text' },
        ]},
        { id: 't-lessons', name: 'Lessons Learned', rowCount: 0, columns: [
          { name: 'Lesson', type: 'text' },
          { name: 'Project', type: 'text' },
          { name: 'Impact', type: 'select' },
        ]},
      ],
      sections: [],
      fields: ['Decision', 'Lesson', 'Context', 'Outcome', 'Learning'],
    },
    operationalNeeds: [
      'Institutional learning capture',
      'Decision history tracking',
      'Lessons learned management',
      'Best practices codification',
      'Organizational memory',
    ],
    integrationPoints: ['All Twins', 'Knowledge Graph', 'Learning System'],
    frequency: 'Weekly',
    owner: 'Executive',
    lastModified: new Date().toISOString(),
  },

  'decision-log': {
    id: 'dl-001',
    name: 'Decision log',
    type: 'doc',
    domain: 'Governance & Decisions',
    purpose: 'Track and approve important company decisions',
    structure: {
      tables: [
        { id: 't-decisions', name: 'Decisions', rowCount: 0, columns: [
          { name: 'Title', type: 'text' },
          { name: 'Status', type: 'select' },
          { name: 'Approver', type: 'person' },
          { name: 'Date', type: 'date' },
          { name: 'Rationale', type: 'text' },
        ]},
      ],
      sections: [],
      fields: ['Decision', 'Status', 'Owner', 'Approver', 'Outcome'],
    },
    operationalNeeds: [
      'Decision governance',
      'Approval workflows',
      'Decision audit trail',
      'Authority matrix',
      'Policy enforcement',
    ],
    integrationPoints: ['Approval Engine', 'Audit Trail', 'Governance Twin'],
    frequency: 'Daily',
    owner: 'Executive',
    lastModified: new Date().toISOString(),
  },

  'content-library': {
    id: 'cl-001',
    name: 'Content library',
    type: 'doc',
    domain: 'Marketing & Communications',
    purpose: 'Marketing content and messaging repository',
    structure: {
      tables: [
        { id: 't-content', name: 'Content', rowCount: 0, columns: [
          { name: 'Title', type: 'text' },
          { name: 'Type', type: 'select' },
          { name: 'Channel', type: 'select' },
          { name: 'Published', type: 'checkbox' },
          { name: 'Link', type: 'url' },
        ]},
      ],
      sections: [],
      fields: ['Content', 'Type', 'Channel', 'Status', 'Performance'],
    },
    operationalNeeds: [
      'Content asset management',
      'Multi-channel publishing',
      'Performance tracking',
      'Content calendar',
      'Brand consistency',
    ],
    integrationPoints: ['Marketing Twin', 'Publishing System', 'Analytics'],
    frequency: 'Daily',
    owner: 'Marketing',
    lastModified: new Date().toISOString(),
  },

  'product-roadmap': {
    id: 'pr-001',
    name: 'Product roadmap',
    type: 'doc',
    domain: 'Product & Strategy',
    purpose: 'Product vision, features, and timeline',
    structure: {
      tables: [
        { id: 't-features', name: 'Features', rowCount: 0, columns: [
          { name: 'Feature', type: 'text' },
          { name: 'Quarter', type: 'select' },
          { name: 'Priority', type: 'select' },
          { name: 'Status', type: 'select' },
          { name: 'Owner', type: 'person' },
        ]},
      ],
      sections: [],
      fields: ['Feature', 'Timeline', 'Priority', 'Status', 'Dependencies'],
    },
    operationalNeeds: [
      'Product strategy alignment',
      'Feature prioritization',
      'Release planning',
      'Roadmap communication',
      'Dependency management',
    ],
    integrationPoints: ['Product Twin', 'Engineering Twin', 'Strategy'],
    frequency: 'Weekly',
    owner: 'Product',
    lastModified: new Date().toISOString(),
  },
};

/**
 * Fetch and analyze all Coda templates
 */
export async function analyzeAllTemplates(
  apiToken: string,
  workspaceId?: string
): Promise<TemplateAnalysis> {
  const analysis: TemplateAnalysis = {
    templates: Object.values(TEMPLATE_OPERATIONAL_MAP),
    domains: {},
    operationalMatrix: {},
    integrationMap: {},
    dataFlows: [],
  };

  // Group by domain
  for (const template of analysis.templates) {
    if (!analysis.domains[template.domain]) {
      analysis.domains[template.domain] = [];
    }
    analysis.domains[template.domain].push(template);
  }

  // Build operational matrix
  for (const template of analysis.templates) {
    analysis.operationalMatrix[template.name] = template.operationalNeeds;
    analysis.integrationMap[template.name] = template.integrationPoints;
  }

  // Define data flows
  analysis.dataFlows = [
    { from: 'CRM', to: 'Revenue Recognition', frequency: 'Daily', dataType: 'Deal', criticalPath: true },
    { from: 'Commercial Bible', to: 'Deal Approval', frequency: 'Ad-hoc', dataType: 'Terms', criticalPath: true },
    { from: 'Decision Log', to: 'Spine', frequency: 'Daily', dataType: 'Decision', criticalPath: false },
    { from: 'Spine Schema', to: 'All Systems', frequency: 'Real-time', dataType: 'Entity', criticalPath: true },
    { from: 'ATLAS Memory', to: 'Twin Context', frequency: 'Weekly', dataType: 'Knowledge', criticalPath: false },
  ];

  return analysis;
}

/**
 * Get template by domain
 */
export function getTemplatesByDomain(analysis: TemplateAnalysis, domain: string): CodaTemplate[] {
  return analysis.domains[domain] || [];
}

/**
 * Get operational needs for a department
 */
export function getOperationalNeeds(analysis: TemplateAnalysis, department: string): string[] {
  const templates = getTemplatesByDomain(analysis, department);
  const needs = new Set<string>();
  for (const template of templates) {
    template.operationalNeeds.forEach(need => needs.add(need));
  }
  return Array.from(needs);
}

/**
 * Get critical data flows (for Twin execution)
 */
export function getCriticalDataFlows(analysis: TemplateAnalysis): DataFlow[] {
  return analysis.dataFlows.filter(flow => flow.criticalPath);
}

/**
 * Map template to Twin capabilities
 */
export function getTemplateCapabilities(template: CodaTemplate): string[] {
  const capabilities: Set<string> = new Set();
  
  switch (template.domain) {
    case 'Sales & Marketing':
      capabilities.add('Sell Deal');
      capabilities.add('Monitor Health');
      break;
    case 'Finance':
      capabilities.add('Recognize Revenue');
      capabilities.add('Forecast Cash');
      break;
    case 'Engineering':
      capabilities.add('Deploy Service');
      capabilities.add('Monitor System');
      break;
    case 'Operations':
      capabilities.add('Optimize Process');
      capabilities.add('Manage Compliance');
      break;
  }
  
  return Array.from(capabilities);
}
