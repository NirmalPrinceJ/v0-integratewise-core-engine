/**
 * Platform API — shared types.
 *
 * Customer Zero consumes IntegrateWise through the same modular Platform API
 * surfaces exposed to customers. Every workspace in this application is a
 * projection over these surfaces — never over hardcoded business data.
 *
 * Surfaces:
 *   Identity · Integrations · Adaptive Spine · Knowledge ·
 *   Capabilities · Agent Runtime · Analytics · Notifications
 */

export type SurfaceId =
  | "identity"
  | "integrations"
  | "spine"
  | "knowledge"
  | "capabilities"
  | "agent-runtime"
  | "analytics"
  | "notifications"

export type HealthStatus = "healthy" | "degraded" | "down"
export type RunStatus = "running" | "idle" | "paused" | "error"
export type Trend = "up" | "down" | "flat"

/** Identity surface */
export interface Organization {
  id: string
  name: string
  tagline: string
  foundedYear: number
  employees: number
  healthScore: number // 0-100
}

export interface Department {
  id: DepartmentId
  name: string
  headcount: number
  /** Platform surfaces this department's workspace consumes. */
  surfaces: SurfaceId[]
}

export type DepartmentId =
  | "founder"
  | "sales"
  | "marketing"
  | "operations"
  | "technology"
  | "customer-success"
  | "finance"
  | "administration"

/** Integrations surface */
export interface Connector {
  id: string
  name: string
  category: string
  status: HealthStatus
  lastSync: string // ISO
  syncsToday: number
  ownerDepartment: DepartmentId
}

/** Adaptive Spine surface */
export interface SpineEntity {
  id: string
  name: string
  records: number
  updatedToday: number
}

/** Capabilities surface */
export interface Capability {
  id: string
  name: string
  surface: SurfaceId
  executionsToday: number
  avgLatencyMs: number
  successRate: number // 0-100
}

/** Agent Runtime surface — every agent is a production worker. */
export interface AgentWorker {
  id: string
  name: string
  department: DepartmentId
  status: RunStatus
  executionsToday: number
  itemsProcessed: number
  itemsLabel: string
  avgExecutionSeconds: number
  confidence: number // 0-100
  capabilities: string[]
  lastRun: string // ISO
}

/** Knowledge surface */
export interface KnowledgeArea {
  id: string
  name: string
  documents: number
  updatedToday: number
}

/** Analytics surface */
export interface Metric {
  id: string
  label: string
  value: string
  raw: number
  trend: Trend
  changePct: number
  unit?: string
}

export interface EvidenceStat {
  id: string
  label: string
  value: string
  detail: string
}

/** Notifications surface */
export interface Approval {
  id: string
  title: string
  requestedBy: string
  department: DepartmentId
  createdAt: string
}

export interface Notification {
  id: string
  title: string
  surface: SurfaceId
  severity: "info" | "warning" | "critical"
  createdAt: string
}
