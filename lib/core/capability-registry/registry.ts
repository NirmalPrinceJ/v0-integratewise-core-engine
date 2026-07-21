/**
 * Capability Registry Implementation
 * Central registry for all organizational capabilities
 * Provides discovery, permission checking, and capability loading
 */

import type {
  CapabilityDefinition,
  CapabilityRegistry,
} from "./types";
import {
  CapabilityDomain,
  HandlerType,
} from "./types";

export class CapabilityRegistryImpl implements CapabilityRegistry {
  capabilities: Map<string, CapabilityDefinition> = new Map();

  /**
   * Load capabilities from array
   */
  load(capabilitiesData: CapabilityDefinition[]): void {
    capabilitiesData.forEach((cap) => {
      this.capabilities.set(cap.id, cap);
    });
  }

  /**
   * Get a specific capability by ID
   */
  getCapability(id: string): CapabilityDefinition | undefined {
    return this.capabilities.get(id);
  }

  /**
   * List all capabilities in a domain
   */
  listByDomain(domain: CapabilityDomain): CapabilityDefinition[] {
    return Array.from(this.capabilities.values()).filter((cap) => cap.domain === domain);
  }

  /**
   * List capabilities available to a user role
   */
  listAvailableFor(role: string): CapabilityDefinition[] {
    return Array.from(this.capabilities.values()).filter((cap) => {
      const perm = cap.permissions.find((p) => p.role === role);
      return perm?.can_invoke === true;
    });
  }

  /**
   * Search capabilities by name or description
   */
  search(query: string): CapabilityDefinition[] {
    const lower = query.toLowerCase();
    return Array.from(this.capabilities.values()).filter(
      (cap) =>
        cap.name.toLowerCase().includes(lower) ||
        cap.description.toLowerCase().includes(lower) ||
        cap.id.toLowerCase().includes(lower)
    );
  }

  /**
   * Check if user can invoke a capability
   */
  canInvoke(capabilityId: string, userId: string, role: string): boolean {
    const cap = this.getCapability(capabilityId);
    if (!cap) return false;

    const perm = cap.permissions.find((p) => p.role === role);
    return perm?.can_invoke === true;
  }

  /**
   * Check if user can approve a capability
   */
  canApprove(capabilityId: string, userId: string, role: string): boolean {
    const cap = this.getCapability(capabilityId);
    if (!cap) return false;

    const perm = cap.permissions.find((p) => p.role === role);
    return perm?.can_approve === true;
  }

  /**
   * Check if user can execute a capability
   */
  canExecute(capabilityId: string, userId: string, role: string): boolean {
    const cap = this.getCapability(capabilityId);
    if (!cap) return false;

    const perm = cap.permissions.find((p) => p.role === role);
    return perm?.can_execute === true;
  }

  /**
   * Validate that input data meets capability requirements
   */
  validateInput(capabilityId: string, data: Record<string, any>): string[] | null {
    const cap = this.getCapability(capabilityId);
    if (!cap) return ["Capability not found"];

    const errors: string[] = [];

    // Check required data entities
    cap.requires_data.forEach((req) => {
      if (!data[req.entity_type]) {
        if (req.must_exist) {
          errors.push(`Missing required entity: ${req.entity_type}`);
        }
      } else {
        // Check required fields
        req.fields.forEach((field) => {
          if (!data[req.entity_type][field]) {
            errors.push(`Missing required field: ${req.entity_type}.${field}`);
          }
        });
      }
    });

    return errors.length > 0 ? errors : null;
  }

  /**
   * Get all capabilities
   */
  getAll(): CapabilityDefinition[] {
    return Array.from(this.capabilities.values());
  }

  /**
   * Get capabilities count
   */
  count(): number {
    return this.capabilities.size;
  }
}

/**
 * Create default registry with example capabilities
 */
export function createDefaultRegistry(): CapabilityRegistry {
  const registry = new CapabilityRegistryImpl();

  registry.load([
    // Revenue Domain: Sell Deal
    {
      id: "sell-deal",
      name: "Sell Deal",
      description: "Close a sales opportunity and create order",
      domain: CapabilityDomain.REVENUE,
      steps: [
        {
          id: "assess-fit",
          name: "Assess Deal Fit",
          description: "AI assesses if deal meets product fit criteria",
          handler: HandlerType.AI,
          ai_model: "gpt-4",
          ai_prompt:
            "Assess if this opportunity meets our product fit and value alignment criteria.",
        },
        {
          id: "pricing-analysis",
          name: "Pricing Analysis",
          description: "Calculate optimal pricing for deal",
          handler: HandlerType.AI,
          ai_model: "gpt-4",
          requires_approval: true,
        },
        {
          id: "close-approval",
          name: "Close Approval",
          description: "Sales leader approves deal close",
          handler: HandlerType.HUMAN,
          requires_approval: true,
        },
        {
          id: "create-order",
          name: "Create Order",
          description: "System creates order in ERP",
          handler: HandlerType.SYSTEM,
        },
      ],
      parallel_allowed: false,
      requires_handoff: ["onboard-customer"],
      requires_data: [
        {
          entity_type: "Opportunity",
          fields: ["name", "arr", "stage", "customer_id"],
          must_exist: true,
        },
        {
          entity_type: "Account",
          fields: ["name", "industry", "employee_count"],
          must_exist: true,
        },
      ],
      requires_signals: [
        {
          signal_type: "engagement",
          time_window_days: 30,
          threshold: 5,
        },
      ],
      permissions: [
        { role: "sales-rep", can_invoke: true, can_approve: false },
        {
          role: "sales-manager",
          can_invoke: true,
          can_approve: true,
          can_execute: true,
        },
        { role: "cro", can_invoke: true, can_approve: true, can_execute: true },
      ],
      requires_audit: true,
      produces: {
        type: "order",
        fields: { order_id: "string", amount: "number", term_months: "number" },
        destinations: ["salesforce", "erp", "timeline"],
      },
      typical_duration_ms: 3600000,
      success_rate_target: 0.95,
      human_approval_rate_target: 0.1,
      ai_confidence_threshold: 0.85,
      ai_override_allowed: true,
      version: "1.0.0",
      created_at: new Date("2026-01-01"),
      updated_at: new Date("2026-07-01"),
    },

    // CSM Domain: Monitor Health
    {
      id: "monitor-health",
      name: "Monitor Customer Health",
      description: "Assess customer health and identify risks or opportunities",
      domain: CapabilityDomain.CSM,
      steps: [
        {
          id: "gather-signals",
          name: "Gather Signals",
          description: "Collect engagement, usage, support signals",
          handler: HandlerType.SYSTEM,
        },
        {
          id: "analyze-health",
          name: "Analyze Health",
          description: "AI analyzes customer health indicators",
          handler: HandlerType.AI,
          ai_model: "gpt-4",
          ai_prompt:
            "Analyze customer engagement, usage, and support signals to assess overall health. Identify risks and opportunities.",
        },
        {
          id: "csm-review",
          name: "CSM Review",
          description: "CSM reviews AI recommendations",
          handler: HandlerType.HUMAN,
          requires_approval: true,
        },
        {
          id: "create-action-plan",
          name: "Create Action Plan",
          description: "Generate action items for CSM",
          handler: HandlerType.SYSTEM,
        },
      ],
      parallel_allowed: false,
      requires_data: [
        {
          entity_type: "Account",
          fields: ["name", "arr", "customer_since"],
          must_exist: true,
        },
      ],
      requires_signals: [
        { signal_type: "engagement" },
        { signal_type: "usage" },
        { signal_type: "support" },
      ],
      permissions: [
        { role: "csm", can_invoke: true, can_approve: false },
        {
          role: "csm-manager",
          can_invoke: true,
          can_approve: true,
          can_execute: true,
        },
        { role: "vp-csm", can_invoke: true, can_approve: true, can_execute: true },
      ],
      requires_audit: false,
      produces: {
        type: "health_report",
        fields: { health_score: "number", risks: "string[]", opportunities: "string[]" },
        destinations: ["timeline", "csm_dashboard"],
      },
      typical_duration_ms: 600000,
      success_rate_target: 0.99,
      ai_confidence_threshold: 0.8,
      ai_override_allowed: true,
      version: "1.0.0",
      created_at: new Date("2026-01-01"),
      updated_at: new Date("2026-07-01"),
    },
  ]);

  return registry;
}

export default CapabilityRegistryImpl;
