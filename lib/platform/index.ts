/**
 * Platform API — modular surface entrypoint.
 *
 * Every workspace consumes IntegrateWise through these surfaces, the same ones
 * exposed to customers. Import only the surface a workspace needs:
 *
 *   import { platform } from "@/lib/platform"
 *   const agents = platform.agentRuntime.list()
 *
 * or project a whole department:
 *
 *   const ws = platform.workspace("sales")
 *
 * Gateway Integration (NEW):
 *   import { usePlatform, usePlatformClient } from "@/lib/platform"
 *   const { client } = usePlatform()
 *   const workbench = await client.getWorkspaceProjection("SALES")
 */

import {
  agents,
  analyticsMetrics,
  approvals,
  capabilities,
  connectedSystems,
  connectors,
  departments,
  evidenceStats,
  knowledgeAreas,
  notifications,
  organization,
  spineEntities,
} from "./data"
import type { DepartmentId, SurfaceId } from "./types"

// Gateway API exports
export { PlatformClient, type PlatformConfig } from "./api/client"
export { createPlatformClient } from "./api/client"
export {
  usePlatformClient,
  useWorkspaceProjection,
  useWorkspaceEntities,
  useConnectors,
  useConnectorCatalog,
  useIntegrations,
  useCapabilities,
  useBrainstorm,
  useOnboarding,
} from "./hooks/use-platform"
export { PlatformProvider, usePlatform } from "./provider"

export * from "./types"
export { connectedSystems }

/** Identity surface */
const identity = {
  organization: () => organization,
  departments: () => departments,
  department: (id: DepartmentId) => departments.find((d) => d.id === id),
  connectedSystems: () => connectedSystems,
}

/** Integrations surface */
const integrations = {
  list: () => connectors,
  byDepartment: (id: DepartmentId) => connectors.filter((c) => c.ownerDepartment === id),
  health: () => {
    const healthy = connectors.filter((c) => c.status === "healthy").length
    return { healthy, total: connectors.length, syncsToday: connectors.reduce((n, c) => n + c.syncsToday, 0) }
  },
}

/** Adaptive Spine surface */
const spine = {
  entities: () => spineEntities,
  totals: () => ({
    records: spineEntities.reduce((n, e) => n + e.records, 0),
    updatedToday: spineEntities.reduce((n, e) => n + e.updatedToday, 0),
  }),
}

/** Capabilities surface */
const capabilitySurface = {
  list: () => capabilities,
  executedToday: () => capabilities.reduce((n, c) => n + c.executionsToday, 0),
}

/** Agent Runtime surface */
const agentRuntime = {
  list: () => agents,
  byDepartment: (id: DepartmentId) => agents.filter((a) => a.department === id),
  active: () => agents.filter((a) => a.status === "running").length,
  runsToday: () => agents.reduce((n, a) => n + a.executionsToday, 0),
  get: (id: string) => agents.find((a) => a.id === id),
}

/** Knowledge surface */
const knowledge = {
  areas: () => knowledgeAreas,
  totals: () => ({
    documents: knowledgeAreas.reduce((n, k) => n + k.documents, 0),
    updatedToday: knowledgeAreas.reduce((n, k) => n + k.updatedToday, 0),
  }),
}

/** Analytics surface */
const analytics = {
  metrics: () => analyticsMetrics,
  metric: (id: string) => analyticsMetrics.find((m) => m.id === id),
  evidence: () => evidenceStats,
}

/** Notifications surface */
const notificationsSurface = {
  list: () => notifications,
  approvals: () => approvals,
  bySurface: (surface: SurfaceId) => notifications.filter((n) => n.surface === surface),
}

/**
 * Workspace projection — a department view assembled from only the surfaces
 * that department consumes. This is how "projections over the same Spine"
 * is expressed in code.
 */
function workspace(id: DepartmentId) {
  const dept = departments.find((d) => d.id === id)
  return {
    department: dept,
    surfaces: dept?.surfaces ?? [],
    connectors: integrations.byDepartment(id),
    agents: agentRuntime.byDepartment(id),
    metrics: analyticsMetrics,
  }
}

export const platform = {
  identity,
  integrations,
  spine,
  capabilities: capabilitySurface,
  agentRuntime,
  knowledge,
  analytics,
  notifications: notificationsSurface,
  workspace,
}

export type Platform = typeof platform
