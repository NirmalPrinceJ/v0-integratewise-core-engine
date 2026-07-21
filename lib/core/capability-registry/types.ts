/**
 * Capability System - Type Definitions
 * Core types for IntegrateWise capability execution model
 */

export enum CapabilityDomain {
  REVENUE = "revenue",
  CSM = "csm",
  FINANCE = "finance",
  MARKETING = "marketing",
  OPERATIONS = "operations",
  SUPPORT = "support",
  PRODUCT = "product",
  ENGINEERING = "engineering",
}

export enum HandlerType {
  AI = "ai",
  HUMAN = "human",
  SYSTEM = "system",
  HYBRID = "hybrid", // AI then human
}

export enum CapabilityState {
  PENDING = "pending",
  AI_PROCESSING = "ai_processing",
  HUMAN_REVIEW = "human_review",
  EXECUTION = "execution",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export interface CapabilityStep {
  id: string;
  name: string;
  description: string;
  handler: HandlerType;
  ai_model?: string;
  ai_prompt?: string;
  requires_approval?: boolean;
  timeout_ms?: number;
}

export interface DataRequirement {
  entity_type: string;
  fields: string[];
  must_exist?: boolean;
}

export interface SignalRequirement {
  signal_type: string;
  time_window_days?: number;
  threshold?: number;
}

export interface RolePermission {
  role: string;
  can_invoke: boolean;
  can_approve?: boolean;
  can_execute?: boolean;
  data_access_level?: "own" | "team" | "org";
}

export interface CapabilityProduces {
  type: string;
  fields: Record<string, string>;
  destinations: string[];
}

export interface CapabilityDefinition {
  id: string;
  name: string;
  description: string;
  domain: CapabilityDomain;
  steps: CapabilityStep[];
  parallel_allowed?: boolean;
  requires_handoff?: string[]; // other capabilities to chain
  requires_data: DataRequirement[];
  requires_signals?: SignalRequirement[];
  permissions: RolePermission[];
  requires_audit: boolean;
  produces: CapabilityProduces;
  typical_duration_ms: number;
  success_rate_target: number;
  ai_confidence_threshold?: number;
  ai_override_allowed?: boolean;
  human_approval_rate_target?: number;
  version: string;
  created_at: Date;
  updated_at: Date;
}

export interface CapabilityInvocation {
  id: string;
  capability_id: string;
  invoked_by: string;
  invoked_at: Date;
  completed_at?: Date;
  duration_ms?: number;
  state: CapabilityState;
  current_step?: string;
  step_results: Record<string, any>;
  error?: string;
}

export interface CapabilityRegistry {
  getCapability(id: string): CapabilityDefinition | undefined;
  listByDomain(domain: CapabilityDomain): CapabilityDefinition[];
  listAvailableFor(role: string): CapabilityDefinition[];
  search(query: string): CapabilityDefinition[];
  canInvoke(capabilityId: string, userId: string, role: string): boolean;
  validateInput(capabilityId: string, data: Record<string, any>): string[] | null;
}
