import { RecurringEventDomain, RecurringEvent } from './types';

/**
 * Recurring Events Scheduler
 * Manages 15 domain recurring events (Daily briefs, weekly reviews, monthly closes, etc.)
 */

export const RECURRING_DOMAINS: Record<string, RecurringEventDomain> = {
  'founder': {
    id: 'founder',
    name: 'Founder Rhythm',
    cadences: {
      daily: ['morning-briefing', 'evening-wrap-up'],
      weekly: ['leadership-review', 'product-review', 'sales-review', 'marketing-review', 'engineering-review', 'customer-review', 'finance-review'],
      monthly: ['company-review', 'kpi-review', 'financial-review', 'hiring-review', 'customer-health-review'],
      quarterly: ['okr-review', 'strategy-review', 'product-roadmap-review', 'gtm-review', 'board-preparation'],
    },
    connectedTools: ['slack', 'email', 'calendar', 'analytics', 'coda'],
    recipients: ['founder', 'exec-team'],
  },
  'marketing': {
    id: 'marketing',
    name: 'Marketing',
    cadences: {
      daily: ['content-publishing', 'social-posting', 'campaign-monitoring', 'website-monitoring', 'seo-monitoring'],
      weekly: ['content-planning', 'editorial-meeting', 'campaign-review', 'competitor-review', 'analytics-review'],
      monthly: ['content-audit', 'seo-audit', 'brand-audit', 'newsletter-planning'],
      quarterly: ['gtm-review', 'positioning-review', 'messaging-refresh'],
    },
    connectedTools: ['hubspot', 'slack', 'analytics', 'hootsuite', 'figma'],
    recipients: ['marketing-team', 'exec-team'],
  },
  'sales': {
    id: 'sales',
    name: 'Sales',
    cadences: {
      daily: ['lead-review', 'follow-up-reminders', 'demo-preparation', 'proposal-review'],
      weekly: ['pipeline-review', 'forecast-review', 'win-loss-review', 'enterprise-review'],
      monthly: ['territory-review', 'sales-performance', 'compensation-review'],
    },
    connectedTools: ['salesforce', 'hubspot', 'slack', 'email', 'calendar'],
    recipients: ['sales-team', 'exec-team'],
  },
  'customer-success': {
    id: 'customer-success',
    name: 'Customer Success',
    cadences: {
      daily: ['health-score-review', 'escalation-review', 'renewal-watch'],
      weekly: ['customer-business-reviews', 'adoption-review', 'expansion-opportunities'],
      monthly: ['nps-review', 'churn-analysis', 'success-metrics'],
    },
    connectedTools: ['salesforce', 'hubspot', 'slack', 'email', 'calendar'],
    recipients: ['cs-team', 'exec-team'],
  },
  'product': {
    id: 'product',
    name: 'Product',
    cadences: {
      daily: ['feature-requests', 'customer-feedback', 'roadmap-updates'],
      weekly: ['sprint-planning', 'sprint-review', 'backlog-grooming', 'product-review'],
      monthly: ['roadmap-review', 'discovery-review'],
    },
    connectedTools: ['jira', 'figma', 'slack', 'github', 'asana'],
    recipients: ['product-team', 'exec-team'],
  },
  'engineering': {
    id: 'engineering',
    name: 'Engineering',
    cadences: {
      daily: ['build-health', 'deployment-review', 'incident-review', 'security-alerts'],
      weekly: ['sprint-planning', 'architecture-review', 'technical-debt-review', 'release-planning'],
      monthly: ['infrastructure-audit', 'dependency-review', 'cost-review'],
    },
    connectedTools: ['github', 'jira', 'slack', 'datadog', 'discord'],
    recipients: ['engineering-team', 'exec-team'],
  },
  'ai': {
    id: 'ai',
    name: 'AI / Twin',
    cadences: {
      daily: ['memory-synchronization', 'knowledge-ingestion', 'model-evaluation', 'capability-health', 'governance-review'],
      weekly: ['prompt-review', 'capability-review', 'twin-quality-review'],
      monthly: ['ai-performance-review', 'hallucination-audit', 'cost-optimization'],
    },
    connectedTools: ['openai', 'anthropic', 'slack'],
    recipients: ['ai-team', 'exec-team'],
  },
  'knowledge': {
    id: 'knowledge',
    name: 'Knowledge',
    cadences: {
      daily: ['knowledge-capture', 'decision-capture'],
      weekly: ['documentation-review', 'wiki-updates'],
      monthly: ['knowledge-audit', 'archive-stale-documents'],
    },
    connectedTools: ['notion', 'coda', 'slack'],
    recipients: ['all-teams'],
  },
  'security': {
    id: 'security',
    name: 'Security',
    cadences: {
      daily: ['security-alerts', 'access-changes'],
      weekly: ['permission-review', 'audit-logs'],
      monthly: ['security-audit', 'compliance-review'],
    },
    connectedTools: ['slack', 'email'],
    recipients: ['security-team', 'exec-team'],
  },
  'finance': {
    id: 'finance',
    name: 'Finance',
    cadences: {
      daily: ['cash-balance', 'payment-failures'],
      weekly: ['revenue-review', 'expense-review'],
      monthly: ['month-end-close', 'budget-review', 'forecast'],
    },
    connectedTools: ['quickbooks', 'stripe', 'slack', 'email'],
    recipients: ['finance-team', 'exec-team'],
  },
  'hr': {
    id: 'hr',
    name: 'HR',
    cadences: {
      daily: ['candidate-updates', 'onboarding-status'],
      weekly: ['hiring-pipeline', 'interview-review'],
      monthly: ['performance-reviews', 'team-health'],
    },
    connectedTools: ['lever', 'greenhouse', 'slack', 'email', 'calendar'],
    recipients: ['hr-team', 'exec-team'],
  },
  'infrastructure': {
    id: 'infrastructure',
    name: 'Infrastructure',
    cadences: {
      daily: ['cloud-costs', 'service-health', 'storage-utilization', 'backup-verification'],
      weekly: ['infrastructure-optimization', 'capacity-review'],
      monthly: ['disaster-recovery-drill', 'infrastructure-audit'],
    },
    connectedTools: ['datadog', 'slack'],
    recipients: ['infrastructure-team', 'exec-team'],
  },
  'governance': {
    id: 'governance',
    name: 'Governance',
    cadences: {
      daily: ['pending-approvals', 'policy-violations'],
      weekly: ['governance-review', 'compliance-review'],
      monthly: ['audit-review', 'policy-updates'],
    },
    connectedTools: ['slack', 'notion', 'email'],
    recipients: ['legal-team', 'exec-team'],
  },
  'operations': {
    id: 'operations',
    name: 'Company Operations',
    cadences: {
      daily: ['company-health-dashboard', 'cross-functional-blockers', 'executive-notifications'],
      weekly: ['leadership-meeting', 'cross-functional-planning', 'risk-review'],
      monthly: ['business-review', 'operational-metrics', 'strategic-initiatives'],
    },
    connectedTools: ['slack', 'email', 'coda', 'analytics'],
    recipients: ['exec-team'],
  },
  'content-production': {
    id: 'content-production',
    name: 'Content Production Cadence',
    cadences: {
      daily: ['daily-content-tasks'],
    },
    connectedTools: ['slack', 'figma', 'notion', 'email'],
    recipients: ['content-team'],
  },
};

export class RecurringEventScheduler {
  private scheduledEvents: Map<string, RecurringEvent[]> = new Map();
  private nextRun: Map<string, Date> = new Map();

  constructor() {
    this.initializeSchedules();
  }

  private initializeSchedules() {
    Object.values(RECURRING_DOMAINS).forEach(domain => {
      this.scheduledEvents.set(domain.id, []);
      
      // Schedule all recurring events
      Object.entries(domain.cadences).forEach(([cadence, events]) => {
        events.forEach(event => {
          const nextRunTime = this.calculateNextRun(cadence as any);
          this.nextRun.set(`${domain.id}-${event}`, nextRunTime);
        });
      });
    });
  }

  /**
   * Get all recurring events for a domain
   */
  getDomainEvents(domainId: string): string[] {
    const domain = RECURRING_DOMAINS[domainId];
    if (!domain) return [];

    const events: string[] = [];
    Object.values(domain.cadences).forEach(cadenceEvents => {
      events.push(...(cadenceEvents || []));
    });
    return events;
  }

  /**
   * Get events due now or soon
   */
  getDueEvents(domainId?: string): { domain: string; events: string[]; dueAt: Date }[] {
    const due: { domain: string; events: string[]; dueAt: Date }[] = [];
    const now = new Date();

    Object.entries(RECURRING_DOMAINS).forEach(([domainKey, domain]) => {
      if (domainId && domainKey !== domainId) return;

      const dueEvents: string[] = [];
      Object.values(domain.cadences).forEach(cadenceEvents => {
        cadenceEvents?.forEach(event => {
          const key = `${domainKey}-${event}`;
          const nextRun = this.nextRun.get(key);
          if (nextRun && nextRun <= new Date(now.getTime() + 60 * 60 * 1000)) { // within 1 hour
            dueEvents.push(event);
          }
        });
      });

      if (dueEvents.length > 0) {
        due.push({
          domain: domainKey,
          events: dueEvents,
          dueAt: new Date(Math.min(...dueEvents.map(e => this.nextRun.get(`${domainKey}-${e}`)?.getTime() || 0))),
        });
      }
    });

    return due;
  }

  /**
   * Get tools connected to a recurring event
   */
  getConnectedTools(domainId: string): string[] {
    return RECURRING_DOMAINS[domainId]?.connectedTools || [];
  }

  /**
   * Get recipients for a recurring event
   */
  getRecipients(domainId: string): string[] {
    return RECURRING_DOMAINS[domainId]?.recipients || [];
  }

  /**
   * Calculate next run time based on cadence
   */
  private calculateNextRun(cadence: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'): Date {
    const now = new Date();
    const next = new Date(now);

    switch (cadence) {
      case 'daily':
        next.setDate(next.getDate() + 1);
        next.setHours(6, 0, 0, 0);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        next.setHours(6, 0, 0, 0);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        next.setDate(1);
        next.setHours(6, 0, 0, 0);
        break;
      case 'quarterly':
        next.setMonth(next.getMonth() + 3);
        next.setDate(1);
        next.setHours(6, 0, 0, 0);
        break;
      case 'yearly':
        next.setFullYear(next.getFullYear() + 1);
        next.setHours(6, 0, 0, 0);
        break;
    }

    return next;
  }
}

export const recurringScheduler = new RecurringEventScheduler();
