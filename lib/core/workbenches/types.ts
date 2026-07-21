/**
 * Department-Specific Workbench Types
 * Defines structure and capabilities for each department workbench
 */

export enum Department {
  SALES = "sales",
  CSM = "csm",
  MARKETING = "marketing",
  FINANCE = "finance",
  OPERATIONS = "operations",
  PRODUCT = "product",
  ENGINEERING = "engineering",
  SUPPORT = "support",
}

export interface WorkbenchWidget {
  id: string;
  type: "metric" | "chart" | "table" | "timeline" | "list" | "form";
  title: string;
  description?: string;
  data_source: string;
  config?: Record<string, any>;
  refresh_interval_seconds?: number;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

export interface WorkbenchView {
  id: string;
  name: string;
  description?: string;
  widgets: WorkbenchWidget[];
  filters?: Record<string, any>;
  default_time_range?: "today" | "week" | "month" | "quarter";
  is_default?: boolean;
}

export interface WorkbenchAction {
  id: string;
  label: string;
  description?: string;
  capability_id: string;
  shortcut?: string;
  role_required?: string;
  context_required?: string[];
}

export interface DepartmentWorkbench {
  id: string;
  department: Department;
  title: string;
  description: string;
  icon?: string;
  color?: string;
  
  // Core views
  default_view: string;
  views: WorkbenchView[];
  
  // Actions & capabilities
  available_actions: WorkbenchAction[];
  default_capabilities: string[]; // Capability IDs
  
  // Roles and access
  roles: string[];
  permissions?: Record<string, string[]>;
  
  // Metadata
  created_at: Date;
  updated_at: Date;
  version: string;
}

export interface WorkbenchContext {
  department: Department;
  user_id: string;
  user_role: string;
  view_id?: string;
  filters?: Record<string, any>;
  time_range?: "today" | "week" | "month" | "quarter";
}

export interface WorkbenchState {
  current_view: WorkbenchView;
  selected_entity?: { type: string; id: string };
  filters: Record<string, any>;
  active_actions?: string[];
  data: Record<string, any>;
  loading: boolean;
  error?: string;
}

export interface WorkbenchMetrics {
  department: Department;
  total_views: number;
  active_users: number;
  avg_session_duration_minutes: number;
  most_used_capability?: string;
  last_updated: Date;
}
