import { LifecycleEvent, LifecycleCategory, LIFECYCLE_CATEGORIES } from './types';

/**
 * Lifecycle Engine
 * Manages 27 lifecycle categories and triggers connected workflows
 */

export class LifecycleEngine {
  private events: Map<string, LifecycleEvent> = new Map();
  private listeners: Map<string, Set<(event: LifecycleEvent) => void>> = new Map();
  private toolMappings: Map<LifecycleCategory, string[]> = new Map();

  constructor() {
    this.initializeToolMappings();
  }

  private initializeToolMappings() {
    // Map which tools handle each lifecycle category
    this.toolMappings.set('sales', ['salesforce', 'hubspot', 'pipedrive', 'slack', 'email']);
    this.toolMappings.set('customer-success', ['salesforce', 'hubspot', 'slack', 'email', 'calendar']);
    this.toolMappings.set('marketing', ['hubspot', 'salesforce', 'slack', 'email', 'analytics']);
    this.toolMappings.set('product', ['github', 'jira', 'figma', 'slack', 'asana']);
    this.toolMappings.set('engineering', ['github', 'jira', 'slack', 'discord', 'datadog']);
    this.toolMappings.set('design', ['figma', 'slack', 'email', 'asana']);
    this.toolMappings.set('content', ['notion', 'slack', 'email', 'figma', 'coda']);
    this.toolMappings.set('campaign', ['hubspot', 'mailchimp', 'slack', 'analytics']);
    this.toolMappings.set('social-media', ['hootsuite', 'buffer', 'slack', 'analytics']);
    this.toolMappings.set('finance', ['quickbooks', 'stripe', 'slack', 'email']);
    this.toolMappings.set('legal', ['slack', 'notion', 'email']);
    this.toolMappings.set('hiring', ['lever', 'greenhouse', 'slack', 'email', 'calendar']);
    this.toolMappings.set('strategy', ['notion', 'coda', 'slack', 'email']);
    this.toolMappings.set('knowledge', ['notion', 'coda', 'slack']);
    this.toolMappings.set('ai', ['openai', 'anthropic', 'slack']);
    this.toolMappings.set('connector', ['slack', 'email']);
  }

  /**
   * Create and emit a lifecycle event
   */
  emitEvent(
    category: LifecycleCategory,
    eventType: string,
    entityId: string,
    entityType: string,
    context: Record<string, any> = {}
  ): LifecycleEvent {
    const event: LifecycleEvent = {
      id: `${category}-${eventType}-${Date.now()}`,
      category,
      eventType,
      timestamp: new Date(),
      entityId,
      entityType,
      context,
      triggers: this.getTriggers(category, eventType),
      connectedTools: this.toolMappings.get(category) || [],
    };

    this.events.set(event.id, event);
    this.notifyListeners(category, event);

    return event;
  }

  /**
   * Subscribe to events in a category
   */
  on(category: LifecycleCategory, callback: (event: LifecycleEvent) => void) {
    if (!this.listeners.has(category)) {
      this.listeners.set(category, new Set());
    }
    this.listeners.get(category)!.add(callback);
  }

  /**
   * Unsubscribe from events
   */
  off(category: LifecycleCategory, callback: (event: LifecycleEvent) => void) {
    this.listeners.get(category)?.delete(callback);
  }

  /**
   * Get all events for a category
   */
  getEvents(category: LifecycleCategory): LifecycleEvent[] {
    return Array.from(this.events.values()).filter(e => e.category === category);
  }

  /**
   * Get events for a specific entity
   */
  getEntityEvents(entityId: string): LifecycleEvent[] {
    return Array.from(this.events.values()).filter(e => e.entityId === entityId);
  }

  /**
   * Get recent events across all categories
   */
  getRecentEvents(limit: number = 50): LifecycleEvent[] {
    return Array.from(this.events.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get tools connected to a category
   */
  getConnectedTools(category: LifecycleCategory): string[] {
    return this.toolMappings.get(category) || [];
  }

  /**
   * Get all valid events for a category
   */
  getValidEvents(category: LifecycleCategory): string[] {
    return LIFECYCLE_CATEGORIES[category] || [];
  }

  /**
   * Determine which workflows should trigger for an event
   */
  private getTriggers(category: LifecycleCategory, eventType: string): string[] {
    const triggers: string[] = [];

    // Strategy events trigger strategic workflows
    if (category === 'strategy' && eventType === 'strategy-approved') {
      triggers.push('sync-to-roadmap', 'notify-stakeholders');
    }

    // Sales events trigger revenue workflows
    if (category === 'sales') {
      if (eventType === 'won') {
        triggers.push('create-customer', 'trigger-onboarding', 'notify-cs');
      }
      if (eventType === 'proposal-sent') {
        triggers.push('set-reminder', 'create-calendar-event');
      }
    }

    // Product events trigger engineering
    if (category === 'product' && eventType === 'spec-approved') {
      triggers.push('create-engineering-issue', 'start-sprint-planning');
    }

    // Engineering events trigger release
    if (category === 'engineering' && eventType === 'merged') {
      triggers.push('trigger-build', 'run-tests', 'notify-deployment');
    }

    // Content events trigger publishing
    if (category === 'content' && eventType === 'approved') {
      triggers.push('schedule-publishing', 'notify-social', 'update-seo');
    }

    // Campaign events trigger marketing automation
    if (category === 'campaign' && eventType === 'campaign-launched') {
      triggers.push('send-initial-emails', 'post-social', 'track-analytics');
    }

    // Customer Success events trigger support
    if (category === 'customer-success' && eventType === 'risk-identified') {
      triggers.push('create-remediation-plan', 'notify-exec', 'escalate-to-leadership');
    }

    // Support events trigger escalation
    if (category === 'support' && eventType === 'escalated') {
      triggers.push('notify-manager', 'create-ticket', 'set-priority');
    }

    // Hiring events trigger onboarding
    if (category === 'hiring' && eventType === 'accepted') {
      triggers.push('start-onboarding', 'provision-account', 'schedule-first-day');
    }

    // Decision events trigger action
    if (category === 'decision' && eventType === 'approved') {
      triggers.push('create-action-items', 'communicate-decision', 'track-implementation');
    }

    // Risk events trigger mitigation
    if (category === 'risk' && eventType === 'risk-identified') {
      triggers.push('assess-impact', 'create-mitigation-plan', 'assign-owner');
    }

    return triggers;
  }

  /**
   * Notify all listeners for a category
   */
  private notifyListeners(category: LifecycleCategory, event: LifecycleEvent) {
    this.listeners.get(category)?.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error(`[v0] Error in lifecycle listener for ${category}:`, error);
      }
    });
  }
}

// Singleton instance
export const lifecycleEngine = new LifecycleEngine();
