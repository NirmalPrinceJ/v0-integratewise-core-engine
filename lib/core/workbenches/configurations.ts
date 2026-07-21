/**
 * Department Workbench Configurations
 * Pre-built workbench layouts for each department
 */

import type { DepartmentWorkbench } from "./types";
import { Department } from "./types";

/**
 * Sales Workbench
 */
export const SALES_WORKBENCH: DepartmentWorkbench = {
  id: "workbench_sales",
  department: Department.SALES,
  title: "Sales Workbench",
  description: "Pipeline management, deal tracking, and revenue forecasting",
  icon: "trending-up",
  color: "#3b82f6",
  
  default_view: "pipeline_view",
  views: [
    {
      id: "pipeline_view",
      name: "Pipeline Overview",
      description: "Current sales pipeline by stage",
      widgets: [
        {
          id: "widget_pipeline_chart",
          type: "chart",
          title: "Pipeline by Stage",
          data_source: "salesforce_pipeline",
          refresh_interval_seconds: 300,
        },
        {
          id: "widget_deal_list",
          type: "table",
          title: "Active Deals",
          data_source: "salesforce_deals",
          refresh_interval_seconds: 300,
        },
        {
          id: "widget_forecast",
          type: "metric",
          title: "Monthly Forecast",
          data_source: "forecast_engine",
          refresh_interval_seconds: 600,
        },
      ],
      default_time_range: "month",
      is_default: true,
    },
    {
      id: "territory_view",
      name: "Territory Performance",
      description: "Sales by territory and rep",
      widgets: [
        {
          id: "widget_territory_chart",
          type: "chart",
          title: "Territory Performance",
          data_source: "salesforce_territories",
        },
        {
          id: "widget_rep_rankings",
          type: "table",
          title: "Rep Rankings",
          data_source: "salesforce_reps",
        },
      ],
    },
  ],
  available_actions: [
    {
      id: "action_sell_deal",
      label: "Sell Deal",
      capability_id: "sell-deal",
      role_required: "sales-rep",
      context_required: ["Opportunity"],
    },
    {
      id: "action_update_forecast",
      label: "Update Forecast",
      capability_id: "update-forecast",
      role_required: "sales-manager",
    },
    {
      id: "action_create_opportunity",
      label: "Create Opportunity",
      capability_id: "create-opportunity",
      role_required: "sales-rep",
    },
  ],
  default_capabilities: ["sell-deal", "monitor-health", "create-opportunity"],
  roles: ["sales-rep", "sales-manager", "cro"],
  permissions: {
    "sales-rep": ["view_own_pipeline", "edit_own_deals"],
    "sales-manager": ["view_team_pipeline", "edit_team_deals", "manage_forecast"],
    "cro": ["view_all_pipeline", "edit_all_deals"],
  },
  created_at: new Date("2026-01-01"),
  updated_at: new Date("2026-07-01"),
  version: "1.0.0",
};

/**
 * Customer Success Workbench
 */
export const CSM_WORKBENCH: DepartmentWorkbench = {
  id: "workbench_csm",
  department: Department.CSM,
  title: "Customer Success Workbench",
  description: "Account health monitoring, expansion opportunities, and customer management",
  icon: "users",
  color: "#10b981",

  default_view: "health_dashboard",
  views: [
    {
      id: "health_dashboard",
      name: "Health Dashboard",
      description: "Customer health scores and at-risk accounts",
      widgets: [
        {
          id: "widget_health_scores",
          type: "metric",
          title: "Average Health Score",
          data_source: "health_engine",
          refresh_interval_seconds: 600,
        },
        {
          id: "widget_at_risk_accounts",
          type: "table",
          title: "At-Risk Accounts",
          data_source: "health_engine_risk",
          refresh_interval_seconds: 300,
        },
        {
          id: "widget_expansion_opps",
          type: "table",
          title: "Expansion Opportunities",
          data_source: "expansion_engine",
          refresh_interval_seconds: 600,
        },
      ],
      default_time_range: "month",
      is_default: true,
    },
    {
      id: "engagement_view",
      name: "Engagement Tracking",
      description: "Customer engagement metrics and activity",
      widgets: [
        {
          id: "widget_engagement_chart",
          type: "chart",
          title: "Engagement Over Time",
          data_source: "engagement_metrics",
        },
        {
          id: "widget_usage_metrics",
          type: "metric",
          title: "Product Usage",
          data_source: "product_usage",
        },
      ],
    },
  ],
  available_actions: [
    {
      id: "action_monitor_health",
      label: "Monitor Health",
      capability_id: "monitor-health",
      role_required: "csm",
    },
    {
      id: "action_create_expansion",
      label: "Create Expansion Plan",
      capability_id: "create-expansion",
      role_required: "csm",
    },
    {
      id: "action_send_communication",
      label: "Send Communication",
      capability_id: "send-communication",
      role_required: "csm",
    },
  ],
  default_capabilities: ["monitor-health", "send-communication", "create-expansion"],
  roles: ["csm", "csm-manager", "vp-csm"],
  permissions: {
    csm: ["view_own_accounts", "edit_own_accounts"],
    "csm-manager": ["view_team_accounts", "edit_team_accounts"],
    "vp-csm": ["view_all_accounts", "edit_all_accounts"],
  },
  created_at: new Date("2026-01-01"),
  updated_at: new Date("2026-07-01"),
  version: "1.0.0",
};

/**
 * Marketing Workbench
 */
export const MARKETING_WORKBENCH: DepartmentWorkbench = {
  id: "workbench_marketing",
  department: Department.MARKETING,
  title: "Marketing Workbench",
  description: "Campaign management, lead generation, and content publishing",
  icon: "megaphone",
  color: "#f59e0b",

  default_view: "campaigns",
  views: [
    {
      id: "campaigns",
      name: "Active Campaigns",
      description: "Current marketing campaigns and performance",
      widgets: [
        {
          id: "widget_campaigns_list",
          type: "table",
          title: "Active Campaigns",
          data_source: "campaigns_db",
          refresh_interval_seconds: 600,
        },
        {
          id: "widget_campaign_performance",
          type: "chart",
          title: "Campaign Performance",
          data_source: "campaign_metrics",
          refresh_interval_seconds: 300,
        },
      ],
      default_time_range: "month",
      is_default: true,
    },
    {
      id: "content_calendar",
      name: "Content Calendar",
      description: "Editorial calendar and content publishing",
      widgets: [
        {
          id: "widget_content_calendar",
          type: "timeline",
          title: "Content Timeline",
          data_source: "content_calendar",
        },
        {
          id: "widget_content_queue",
          type: "table",
          title: "Publishing Queue",
          data_source: "content_queue",
        },
      ],
    },
  ],
  available_actions: [
    {
      id: "action_create_campaign",
      label: "Create Campaign",
      capability_id: "create-campaign",
      role_required: "marketing-manager",
    },
    {
      id: "action_publish_content",
      label: "Publish Content",
      capability_id: "publish-content",
      role_required: "marketing-coordinator",
    },
  ],
  default_capabilities: ["create-campaign", "publish-content"],
  roles: ["marketing-coordinator", "marketing-manager"],
  created_at: new Date("2026-01-01"),
  updated_at: new Date("2026-07-01"),
  version: "1.0.0",
};

/**
 * Finance Workbench
 */
export const FINANCE_WORKBENCH: DepartmentWorkbench = {
  id: "workbench_finance",
  department: Department.FINANCE,
  title: "Finance Workbench",
  description: "AR management, collections, and financial reporting",
  icon: "dollar-sign",
  color: "#8b5cf6",

  default_view: "ar_dashboard",
  views: [
    {
      id: "ar_dashboard",
      name: "AR Dashboard",
      description: "Accounts receivable and collection status",
      widgets: [
        {
          id: "widget_ar_aging",
          type: "chart",
          title: "AR Aging",
          data_source: "ar_aging",
          refresh_interval_seconds: 600,
        },
        {
          id: "widget_outstanding_invoices",
          type: "table",
          title: "Outstanding Invoices",
          data_source: "outstanding_invoices",
          refresh_interval_seconds: 300,
        },
        {
          id: "widget_collection_status",
          type: "metric",
          title: "Collection Rate",
          data_source: "collection_metrics",
        },
      ],
      default_time_range: "month",
      is_default: true,
    },
  ],
  available_actions: [
    {
      id: "action_collect_payment",
      label: "Collect Payment",
      capability_id: "collect-payment",
      role_required: "finance-analyst",
    },
    {
      id: "action_generate_report",
      label: "Generate Report",
      capability_id: "generate-report",
      role_required: "finance-manager",
    },
  ],
  default_capabilities: ["collect-payment"],
  roles: ["finance-analyst", "finance-manager", "cfo"],
  created_at: new Date("2026-01-01"),
  updated_at: new Date("2026-07-01"),
  version: "1.0.0",
};

/**
 * Operations Workbench
 */
export const OPERATIONS_WORKBENCH: DepartmentWorkbench = {
  id: "workbench_operations",
  department: Department.OPERATIONS,
  title: "Operations Workbench",
  description: "System monitoring, data sync, and operational metrics",
  icon: "settings",
  color: "#ef4444",

  default_view: "system_health",
  views: [
    {
      id: "system_health",
      name: "System Health",
      description: "System uptime and integration health",
      widgets: [
        {
          id: "widget_uptime",
          type: "metric",
          title: "System Uptime",
          data_source: "system_metrics",
          refresh_interval_seconds: 60,
        },
        {
          id: "widget_integrations",
          type: "table",
          title: "Integration Status",
          data_source: "integration_health",
          refresh_interval_seconds: 300,
        },
        {
          id: "widget_sync_status",
          type: "chart",
          title: "Data Sync Status",
          data_source: "sync_metrics",
          refresh_interval_seconds: 300,
        },
      ],
      default_time_range: "week",
      is_default: true,
    },
  ],
  available_actions: [
    {
      id: "action_check_system",
      label: "Check System Health",
      capability_id: "check-system-health",
      role_required: "ops-engineer",
    },
    {
      id: "action_restart_sync",
      label: "Restart Data Sync",
      capability_id: "restart-sync",
      role_required: "ops-engineer",
    },
  ],
  default_capabilities: ["check-system-health"],
  roles: ["ops-engineer", "ops-manager"],
  created_at: new Date("2026-01-01"),
  updated_at: new Date("2026-07-01"),
  version: "1.0.0",
};

/**
 * All workbenches
 */
export const ALL_WORKBENCHES: DepartmentWorkbench[] = [
  SALES_WORKBENCH,
  CSM_WORKBENCH,
  MARKETING_WORKBENCH,
  FINANCE_WORKBENCH,
  OPERATIONS_WORKBENCH,
];

/**
 * Get workbench by department
 */
export function getWorkbenchForDepartment(department: Department): DepartmentWorkbench | undefined {
  return ALL_WORKBENCHES.find((w) => w.department === department);
}

/**
 * Get all workbenches accessible to role
 */
export function getWorkbenchesForRole(role: string): DepartmentWorkbench[] {
  return ALL_WORKBENCHES.filter((w) => w.roles.includes(role));
}
