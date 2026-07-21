/**
 * Platform API — reference operational data.
 *
 * This is IntegrateWise's own live-shaped operating data ("Customer Zero").
 * It is the single source of truth the Platform API surfaces read from, so
 * no view hardcodes business numbers — they project this instead.
 *
 * In production these records are served by the real Platform API; here they
 * seed the same surface shapes so the frontend proves the contract end to end.
 */

import type {
  AgentWorker,
  Approval,
  Capability,
  Connector,
  Department,
  EvidenceStat,
  KnowledgeArea,
  Metric,
  Notification,
  Organization,
  SpineEntity,
} from "./types"

const now = Date.now()
const minutesAgo = (m: number) => new Date(now - m * 60_000).toISOString()
const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString()

export const organization: Organization = {
  id: "org_integratewise",
  name: "IntegrateWise",
  tagline: "Customer Zero — Internal Operations",
  foundedYear: 2023,
  employees: 24,
  healthScore: 86,
}

export const departments: Department[] = [
  { id: "founder", name: "Founder", headcount: 2, surfaces: ["spine", "analytics", "agent-runtime", "notifications"] },
  { id: "sales", name: "Sales", headcount: 5, surfaces: ["spine", "integrations", "capabilities"] },
  { id: "marketing", name: "Marketing", headcount: 4, surfaces: ["spine", "knowledge", "capabilities"] },
  { id: "operations", name: "Operations", headcount: 3, surfaces: ["spine", "capabilities", "notifications"] },
  { id: "technology", name: "Technology", headcount: 6, surfaces: ["integrations", "capabilities", "notifications"] },
  { id: "customer-success", name: "Customer Success", headcount: 3, surfaces: ["spine", "capabilities", "agent-runtime"] },
  { id: "finance", name: "Finance", headcount: 1, surfaces: ["spine", "analytics", "integrations"] },
  { id: "administration", name: "Administration", headcount: 0, surfaces: ["identity", "integrations", "notifications"] },
]

export const connectors: Connector[] = [
  { id: "github", name: "GitHub", category: "Engineering", status: "healthy", lastSync: minutesAgo(4), syncsToday: 128, ownerDepartment: "technology" },
  { id: "slack", name: "Slack", category: "Communication", status: "healthy", lastSync: minutesAgo(1), syncsToday: 642, ownerDepartment: "operations" },
  { id: "google-workspace", name: "Google Workspace", category: "Productivity", status: "healthy", lastSync: minutesAgo(6), syncsToday: 311, ownerDepartment: "administration" },
  { id: "hubspot", name: "HubSpot", category: "CRM", status: "degraded", lastSync: minutesAgo(38), syncsToday: 74, ownerDepartment: "sales" },
  { id: "stripe", name: "Stripe", category: "Billing", status: "healthy", lastSync: minutesAgo(9), syncsToday: 52, ownerDepartment: "finance" },
  { id: "linear", name: "Linear", category: "Engineering", status: "healthy", lastSync: minutesAgo(3), syncsToday: 96, ownerDepartment: "technology" },
  { id: "linkedin", name: "LinkedIn", category: "Marketing", status: "healthy", lastSync: minutesAgo(22), syncsToday: 41, ownerDepartment: "marketing" },
]

export const spineEntities: SpineEntity[] = [
  { id: "accounts", name: "Accounts", records: 312, updatedToday: 18 },
  { id: "opportunities", name: "Opportunities", records: 47, updatedToday: 11 },
  { id: "contacts", name: "Contacts", records: 1840, updatedToday: 63 },
  { id: "tickets", name: "Support Tickets", records: 208, updatedToday: 29 },
  { id: "invoices", name: "Invoices", records: 156, updatedToday: 7 },
  { id: "content", name: "Content Assets", records: 94, updatedToday: 5 },
  { id: "deployments", name: "Deployments", records: 431, updatedToday: 12 },
]

export const capabilities: Capability[] = [
  { id: "lead-scoring", name: "Lead Scoring", surface: "capabilities", executionsToday: 142, avgLatencyMs: 380, successRate: 98 },
  { id: "ticket-classification", name: "Ticket Classification", surface: "capabilities", executionsToday: 208, avgLatencyMs: 210, successRate: 97 },
  { id: "content-generation", name: "Content Generation", surface: "capabilities", executionsToday: 36, avgLatencyMs: 4200, successRate: 95 },
  { id: "deploy-health-check", name: "Deploy Health Check", surface: "capabilities", executionsToday: 431, avgLatencyMs: 640, successRate: 99 },
  { id: "invoice-reconciliation", name: "Invoice Reconciliation", surface: "capabilities", executionsToday: 52, avgLatencyMs: 900, successRate: 96 },
  { id: "churn-prediction", name: "Churn Prediction", surface: "capabilities", executionsToday: 61, avgLatencyMs: 720, successRate: 94 },
  { id: "competitor-watch", name: "Competitor Watch", surface: "capabilities", executionsToday: 18, avgLatencyMs: 5100, successRate: 92 },
]

export const agents: AgentWorker[] = [
  {
    id: "lead-qualification",
    name: "Lead Qualification",
    department: "sales",
    status: "running",
    executionsToday: 42,
    itemsProcessed: 42,
    itemsLabel: "Leads processed",
    avgExecutionSeconds: 6.2,
    confidence: 94,
    capabilities: ["lead-scoring"],
    lastRun: minutesAgo(2),
  },
  {
    id: "support-triage",
    name: "Support Triage",
    department: "customer-success",
    status: "running",
    executionsToday: 208,
    itemsProcessed: 208,
    itemsLabel: "Tickets triaged",
    avgExecutionSeconds: 3.1,
    confidence: 97,
    capabilities: ["ticket-classification"],
    lastRun: minutesAgo(1),
  },
  {
    id: "content-strategist",
    name: "Content Strategist",
    department: "marketing",
    status: "running",
    executionsToday: 36,
    itemsProcessed: 12,
    itemsLabel: "Drafts published",
    avgExecutionSeconds: 41.0,
    confidence: 91,
    capabilities: ["content-generation"],
    lastRun: minutesAgo(18),
  },
  {
    id: "devops-monitor",
    name: "DevOps Monitor",
    department: "technology",
    status: "running",
    executionsToday: 431,
    itemsProcessed: 12,
    itemsLabel: "Deployments verified",
    avgExecutionSeconds: 0.9,
    confidence: 99,
    capabilities: ["deploy-health-check"],
    lastRun: minutesAgo(3),
  },
  {
    id: "billing-manager",
    name: "Billing Manager",
    department: "finance",
    status: "idle",
    executionsToday: 52,
    itemsProcessed: 52,
    itemsLabel: "Invoices reconciled",
    avgExecutionSeconds: 5.4,
    confidence: 96,
    capabilities: ["invoice-reconciliation"],
    lastRun: hoursAgo(2),
  },
  {
    id: "customer-health",
    name: "Customer Health",
    department: "customer-success",
    status: "running",
    executionsToday: 61,
    itemsProcessed: 61,
    itemsLabel: "Accounts scored",
    avgExecutionSeconds: 7.8,
    confidence: 93,
    capabilities: ["churn-prediction"],
    lastRun: minutesAgo(11),
  },
  {
    id: "competitive-intelligence",
    name: "Competitive Intelligence",
    department: "marketing",
    status: "running",
    executionsToday: 18,
    itemsProcessed: 18,
    itemsLabel: "Signals captured",
    avgExecutionSeconds: 52.0,
    confidence: 89,
    capabilities: ["competitor-watch"],
    lastRun: minutesAgo(27),
  },
]

export const knowledgeAreas: KnowledgeArea[] = [
  { id: "sales", name: "Sales & Growth", documents: 48, updatedToday: 3 },
  { id: "marketing", name: "Marketing & Brand", documents: 61, updatedToday: 4 },
  { id: "product-docs", name: "Product Docs & Runbooks", documents: 92, updatedToday: 6 },
  { id: "customer-support", name: "Customer & Support", documents: 74, updatedToday: 5 },
  { id: "finance", name: "Finance & Billing", documents: 33, updatedToday: 1 },
  { id: "team-culture", name: "Team & Culture", documents: 27, updatedToday: 0 },
]

export const analyticsMetrics: Metric[] = [
  { id: "mrr", label: "MRR", value: "₹26.4L", raw: 2640000, trend: "up", changePct: 8, unit: "currency" },
  { id: "pipeline", label: "Pipeline", value: "₹45.1L", raw: 4510000, trend: "up", changePct: 4, unit: "currency" },
  { id: "revenue", label: "Revenue (MTD)", value: "₹12.8L", raw: 1280000, trend: "up", changePct: 6, unit: "currency" },
  { id: "nrr", label: "Net Revenue Retention", value: "112%", raw: 112, trend: "up", changePct: 3, unit: "percent" },
  { id: "open-opps", label: "Open Opportunities", value: "47", raw: 47, trend: "up", changePct: 5 },
  { id: "qualified-leads", label: "Qualified Leads", value: "128", raw: 128, trend: "up", changePct: 12 },
  { id: "support-queue", label: "Support Queue", value: "14", raw: 14, trend: "down", changePct: -9 },
  { id: "avg-health", label: "Avg Customer Health", value: "82", raw: 82, trend: "up", changePct: 2 },
]

export const evidenceStats: EvidenceStat[] = [
  { id: "capabilities-executed", label: "Capabilities Executed", value: "949", detail: "across 7 platform capabilities" },
  { id: "agent-runs", label: "Agent Runs", value: "438", detail: "7 production workers active" },
  { id: "hours-saved", label: "Hours Saved", value: "31.5", detail: "manual work automated today" },
  { id: "revenue-influenced", label: "Revenue Influenced", value: "₹8.2L", detail: "agent-assisted opportunities" },
  { id: "health-changes", label: "Customer Health Changes", value: "9", detail: "6 improved · 3 flagged" },
  { id: "content-published", label: "Content Published", value: "12", detail: "drafts approved & shipped" },
  { id: "incidents-resolved", label: "Incidents Resolved", value: "4", detail: "auto-triaged by DevOps Monitor" },
]

export const approvals: Approval[] = [
  { id: "ap1", title: "Publish Q3 competitive teardown", requestedBy: "Content Strategist", department: "marketing", createdAt: minutesAgo(24) },
  { id: "ap2", title: "Apply discount to HealthPlus renewal", requestedBy: "Billing Manager", department: "finance", createdAt: hoursAgo(1) },
  { id: "ap3", title: "Escalate 3 at-risk accounts to CSM", requestedBy: "Customer Health", department: "customer-success", createdAt: hoursAgo(3) },
]

export const notifications: Notification[] = [
  { id: "n1", title: "HubSpot connector latency elevated", surface: "integrations", severity: "warning", createdAt: minutesAgo(38) },
  { id: "n2", title: "Deploy #431 verified healthy", surface: "capabilities", severity: "info", createdAt: minutesAgo(3) },
  { id: "n3", title: "Churn risk detected on 3 accounts", surface: "agent-runtime", severity: "critical", createdAt: hoursAgo(3) },
  { id: "n4", title: "New qualified lead batch scored", surface: "capabilities", severity: "info", createdAt: minutesAgo(9) },
]

export const connectedSystems = ["GitHub", "Slack", "Google Workspace", "HubSpot", "Stripe", "Linear", "LinkedIn"]
