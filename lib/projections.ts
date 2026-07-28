import type { LucideIcon } from "lucide-react"
import {
  Activity,
  AppWindow,
  Archive,
  Bell,
  BookOpen,
  Bot,
  Boxes,
  Brain,
  Building2,
  CalendarDays,
  CheckCheck,
  CircleDollarSign,
  Clock3,
  CloudCog,
  FileKey,
  FileText,
  GitBranch,
  Heart,
  Home,
  Inbox,
  KeyRound,
  LayoutDashboard,
  Library,
  ListChecks,
  Mail,
  MessageSquare,
  Network,
  NotebookPen,
  Phone,
  Plug,
  RadioTower,
  ReceiptText,
  Rocket,
  SearchCode,
  Shield,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
  Workflow,
  Wrench,
} from "lucide-react"

export type ProjectionKind = "table" | "board" | "calendar" | "dashboard" | "canvas" | "feed"
export type AccessCapability = "work:read" | "work:approve" | "knowledge:read" | "platform:read" | "admin:read"

export interface ProjectionDestination {
  label: string
  href: string
  icon: LucideIcon
  entity: string
  projection: ProjectionKind
  capability: AccessCapability
  description?: string
  roles?: string[]
  department?: string
  children?: ProjectionDestination[]
}

export interface ProjectionGroup {
  label: string
  items: ProjectionDestination[]
}

export interface ProjectionViewer {
  role: string
  department: string
  capabilities: AccessCapability[]
}

const shell = (
  slug: string,
  label: string,
  icon: LucideIcon,
  entity: string,
  projection: ProjectionKind,
  capability: AccessCapability,
  description?: string,
): ProjectionDestination => ({
  label,
  href: `/projections/${slug}`,
  icon,
  entity,
  projection,
  capability,
  description,
})

export const CURRENT_VIEWER: ProjectionViewer = {
  role: "founder",
  department: "operations",
  capabilities: ["work:read", "work:approve", "knowledge:read", "platform:read", "admin:read"],
}

export const PROJECTION_GROUPS: ProjectionGroup[] = [
  {
    label: "Workspace",
    items: [{ label: "Home", href: "/workbench", icon: Home, entity: "workspace", projection: "dashboard", capability: "work:read" }],
  },
  {
    label: "My work",
    items: [
      shell("inbox", "Inbox", Inbox, "work_item", "feed", "work:read", "Signals and requests triaged for you"),
      shell("tasks", "Tasks", ListChecks, "task", "table", "work:read"),
      shell("my-queue", "My Queue", Archive, "work_item", "board", "work:read"),
      shell("approvals", "Approvals", CheckCheck, "approval", "table", "work:approve"),
      shell("notifications", "Notifications", Bell, "notification", "feed", "work:read"),
      shell("recent-work", "Recent Work", Clock3, "activity", "feed", "work:read"),
      shell("favorites", "Favorites", Heart, "saved_entity", "table", "work:read"),
    ],
  },
  {
    label: "Communications",
    items: [
      shell("activity-feed", "Activity Feed", Activity, "activity", "feed", "work:read"),
      shell("email", "Email", Mail, "message", "table", "work:read"),
      shell("calendar", "Calendar", CalendarDays, "event", "calendar", "work:read"),
      shell("meetings", "Meetings", Users, "meeting", "table", "work:read"),
      shell("chat", "Chat", MessageSquare, "conversation", "feed", "work:read"),
      shell("calls", "Calls", Phone, "call", "table", "work:read"),
      shell("shared-documents", "Documents Shared", FileText, "document", "table", "work:read"),
    ],
  },
  {
    label: "Personal",
    items: [
      shell("notes", "Notes", NotebookPen, "note", "canvas", "knowledge:read"),
      shell("company-wiki", "Knowledge Base", BookOpen, "page", "canvas", "knowledge:read", "Company knowledge projected as connected pages"),
      { label: "Brainstorming", href: "/brainstorming", icon: Brain, entity: "hypothesis", projection: "canvas", capability: "knowledge:read" },
      shell("my-activity", "Activity", RadioTower, "activity", "feed", "work:read"),
      shell("finance-manager", "Finance Manager", CircleDollarSign, "financial_record", "dashboard", "work:read"),
    ],
  },
  {
    label: "Work · Operations",
    items: [
      { label: "Operations Overview", href: "/operations", icon: LayoutDashboard, entity: "operation", projection: "dashboard", capability: "work:read", department: "operations" },
      { label: "Projects", href: "/projects", icon: Workflow, entity: "project", projection: "table", capability: "work:read", department: "operations" },
      { label: "Sales", href: "/sales", icon: AppWindow, entity: "opportunity", projection: "dashboard", capability: "work:read" },
      { label: "Customer Success", href: "/customer-success", icon: Users, entity: "account", projection: "dashboard", capability: "work:read" },
      { label: "Strategy", href: "/strategy", icon: Sparkles, entity: "initiative", projection: "canvas", capability: "work:read", roles: ["founder", "executive"] },
    ],
  },
  {
    label: "Platform",
    items: [
      { label: "Integration Manager", href: "/integrations", icon: Plug, entity: "integration", projection: "table", capability: "platform:read" },
      shell("connector-marketplace", "Connector Marketplace", Store, "connector", "table", "platform:read"),
      shell("activation-hub", "Activation Hub", Rocket, "activation", "dashboard", "platform:read"),
      { label: "Capability Manager", href: "/agents", icon: Boxes, entity: "capability", projection: "table", capability: "platform:read" },
      shell("mcp-pool", "MCP Pool", Network, "mcp_server", "table", "platform:read"),
      shell("ai-models", "AI Models", Bot, "model", "table", "platform:read"),
      { label: "Knowledge", href: "/knowledge", icon: Library, entity: "knowledge_object", projection: "canvas", capability: "platform:read" },
      shell("memory", "Memory & Continuity", Brain, "memory", "table", "platform:read"),
      shell("automation", "Automation", Wrench, "automation", "board", "platform:read"),
      { label: "Pipelines", href: "/data-flow", icon: GitBranch, entity: "pipeline", projection: "board", capability: "platform:read" },
      shell("governance", "Governance", ShieldCheck, "policy", "table", "platform:read"),
      shell("observability", "Observability", SearchCode, "telemetry", "dashboard", "platform:read"),
    ],
  },
  {
    label: "Administration",
    items: [
      shell("organizations", "Organizations", Building2, "organization", "table", "admin:read"),
      shell("users", "Users", Users, "user", "table", "admin:read"),
      shell("roles", "Roles", Shield, "role", "table", "admin:read"),
      shell("permissions", "Permissions", KeyRound, "permission", "table", "admin:read"),
      shell("audit", "Audit", ReceiptText, "audit_event", "table", "admin:read"),
      shell("billing", "Billing", CircleDollarSign, "invoice", "table", "admin:read"),
      shell("deployments", "Deployments", CloudCog, "deployment", "table", "admin:read"),
      shell("api-keys", "API Keys", FileKey, "api_key", "table", "admin:read"),
      { label: "Security", href: "/settings", icon: ShieldCheck, entity: "security_setting", projection: "canvas", capability: "admin:read" },
    ],
  },
]

export function visibleProjectionGroups(viewer: ProjectionViewer = CURRENT_VIEWER) {
  return PROJECTION_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => {
      const canAccess = viewer.capabilities.includes(item.capability)
      const matchesRole = !item.roles || item.roles.includes(viewer.role)
      const matchesDepartment = !item.department || item.department === viewer.department
      return canAccess && matchesRole && matchesDepartment
    }),
  })).filter((group) => group.items.length > 0)
}

export function projectionBySlug(slug: string) {
  return PROJECTION_GROUPS.flatMap((group) => group.items).find((item) => item.href === `/projections/${slug}`)
}
