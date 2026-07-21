/**
 * Connector & Integration Types
 * Defines structure for MCP connectors and tool-to-tool execution
 */

export enum ConnectorStatus {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  ERROR = "error",
  RATE_LIMITED = "rate_limited",
}

export enum ConnectorType {
  CRM = "crm",
  SUPPORT = "support",
  COMMUNICATION = "communication",
  ANALYTICS = "analytics",
  FINANCIAL = "financial",
  PROJECT_MANAGEMENT = "project_management",
  WORKFLOW = "workflow",
  STORAGE = "storage",
  AI = "ai",
  CUSTOM = "custom",
}

export interface ConnectorCredentials {
  type: "oauth" | "api_key" | "basic_auth" | "custom";
  value: Record<string, string>;
  expires_at?: Date;
  refresh_token?: string;
}

export interface ConnectorConfig {
  api_endpoint?: string;
  timeout_ms?: number;
  retry_attempts?: number;
  rate_limit?: { requests: number; window_ms: number };
  webhook_enabled?: boolean;
  webhook_url?: string;
  polling_interval_ms?: number;
}

export interface Connector {
  id: string;
  name: string;
  type: ConnectorType;
  provider: string; // "salesforce", "slack", "hubspot", etc.
  display_name: string;
  icon_url?: string;
  description?: string;
  status: ConnectorStatus;
  
  // Connection details
  credentials: ConnectorCredentials;
  config: ConnectorConfig;
  
  // Organization & scoping
  organization_id: string;
  scope?: string[]; // Permissions/scopes
  
  // Metadata
  created_at: Date;
  updated_at: Date;
  last_health_check?: Date;
  health_check_status?: "healthy" | "degraded" | "unhealthy";
  health_check_message?: string;
}

export interface MCPTool {
  id: string;
  connector_id: string;
  name: string;
  description: string;
  input_schema: Record<string, any>; // JSON Schema
  output_schema?: Record<string, any>;
  handler: string; // Function name in connector
  requires_approval?: boolean;
  rate_limited?: boolean;
  timeout_ms?: number;
}

export interface MCPResource {
  id: string;
  connector_id: string;
  name: string;
  description: string;
  uri: string;
  mime_type: string;
  readable?: boolean;
  writable?: boolean;
}

export interface ToolCall {
  id: string;
  tool_id: string;
  connector_id: string;
  arguments: Record<string, any>;
  timestamp: Date;
  status: "pending" | "executing" | "completed" | "failed";
  result?: Record<string, any>;
  error?: string;
  duration_ms?: number;
}

export interface ConnectorMapping {
  source_connector: string;
  target_connector: string;
  entity_mapping: Record<string, string>;
  field_mapping: Record<string, string>;
  transform_rules?: Record<string, any>;
  sync_direction: "one_way" | "two_way";
  frequency?: "realtime" | "hourly" | "daily";
}

export interface ConnectorRegistry {
  getConnector(id: string): Promise<Connector | undefined>;
  listConnectors(status?: ConnectorStatus): Promise<Connector[]>;
  listConnectorsByType(type: ConnectorType): Promise<Connector[]>;
  listConnectorsByProvider(provider: string): Promise<Connector[]>;
}

export interface ToolRegistry {
  getTool(id: string): Promise<MCPTool | undefined>;
  listTools(connectorId: string): Promise<MCPTool[]>;
  findTools(query: string): Promise<MCPTool[]>;
}

export interface ResourceRegistry {
  getResource(id: string): Promise<MCPResource | undefined>;
  listResources(connectorId: string): Promise<MCPResource[]>;
  findResources(query: string): Promise<MCPResource[]>;
}
