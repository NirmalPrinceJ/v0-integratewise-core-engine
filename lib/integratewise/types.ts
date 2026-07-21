/**
 * IntegrateWise Spine Types
 * Canonical data structures for the platform
 */

export type EntityType = 
  | 'account' 
  | 'person' 
  | 'deal' 
  | 'task' 
  | 'signal' 
  | 'event' 
  | 'document' 
  | 'campaign' 
  | 'invoice' 
  | 'ticket' 
  | 'project' 
  | 'incident' 
  | 'vendor' 
  | 'contract' 
  | 'engagement' 
  | 'note';

export type Department = 
  | 'SALES' 
  | 'CUSTOMER_SUCCESS' 
  | 'MARKETING' 
  | 'PRODUCT_ENGINEERING' 
  | 'FINANCE' 
  | 'SERVICE' 
  | 'PROCUREMENT' 
  | 'BIZOPS' 
  | 'PERSONAL' 
  | 'REVOPS';

export type FlowType = 'A' | 'B' | 'C';

export interface SpineEntity {
  id: string;
  entity_type: EntityType;
  name: string;
  status: string;
  metadata: Record<string, any>;
  source_tool: string;
  source_id?: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
  provenance?: {
    source_tool_id: string;
    source_tool_name: string;
    raw_id: string;
    synced_at: string;
    confidence: number;
  };
}

export interface SpineRelationship {
  source: string;
  target: string;
  type: string;
  metadata?: Record<string, any>;
}

export interface SpineSignal {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description?: string;
  timestamp: string;
  entity_id?: string;
}

export interface ReadinessBucket {
  capability: string;
  state: 'live' | 'seeded' | 'empty';
  score: number;
  coverage: number;
}

export interface Readiness {
  overall_score: number;
  overall_state: 'live' | 'seeded' | 'empty';
  buckets: ReadinessBucket[];
}

export interface SharedWorkbench {
  workspace_id: string;
  tenant_id: string;
  department: Department;
  domain: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
  entities: Partial<Record<EntityType, SpineEntity[]>>;
  relationships: SpineRelationship[];
  timeline: Array<{
    id: string;
    type: string;
    title: string;
    timestamp: string;
  }>;
  memory?: Array<{
    id: string;
    type: string;
    content: Record<string, any>;
    tags: string[];
  }>;
  knowledge?: {
    topic_summaries: any[];
    learnings: any[];
    conversations: any[];
  };
  signals: SpineSignal[];
  capabilities: Array<{
    name: string;
    status: 'active' | 'inactive' | 'error';
    last_sync: string;
  }>;
  governance: Array<{
    id: string;
    decision: 'approved' | 'rejected' | 'pending';
    capability: string;
  }>;
  readiness: Readiness;
  actions?: any[];
  twinContext?: Record<string, any>;
  provenance: {
    source: string;
    confidence: number;
    last_sync: string;
  };
  composed_at: string;
  composed_by: string;
  projection_version: string;
}

export interface Connector {
  id: string;
  name: string;
  category: string;
  flowType: FlowType;
  connectionMethod: 'nango' | 'api_wrapper' | 'ai_provider';
  status: 'available' | 'connected' | 'error';
  capabilities: {
    auth: boolean;
    webhook?: boolean;
    mcp?: string[];
  };
  departments: Department[];
  industries: string[];
  mcpTools?: string[];
  supportedEntities: EntityType[];
  authType: 'oauth' | 'api_key' | 'none';
}

export interface IntegrationConnection {
  id: string;
  provider: string;
  status: 'active' | 'inactive' | 'error';
  last_sync: string;
  entities_synced: number;
  health: 'healthy' | 'degraded' | 'critical';
}

export interface Capability {
  name: string;
  description: string;
  min_tier: 'free' | 'pro' | 'enterprise';
  channel: 'sync' | 'async' | 'webhook';
}

export interface OnboardingState {
  status: 'not_started' | 'in_progress' | 'completed';
  currentStep: string;
  completedSteps: string[];
  connectorsConfig?: Array<{
    provider: string;
    flowType: FlowType;
  }>;
  creamyJobId?: string;
  normalizerJobId?: string;
  createdAt?: string;
  completedAt?: string;
}

export interface SyncJob {
  jobId: string;
  connector: string;
  phase: 'creamy' | 'needed' | 'delta';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: {
    total?: number;
    processed?: number;
    percentage?: number;
    stage?: string;
  };
}

export interface TenantConfig {
  id: string;
  domain: Department;
  connectors: Record<string, { flowType: FlowType }>;
}

export interface ApiResponse<T = any> {
  status?: 'success' | 'error';
  data?: T;
  error?: string;
  code?: string;
  details?: Record<string, any>;
}
