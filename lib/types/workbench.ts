/**
 * Enterprise-grade TypeScript types for the Canonical Workbench
 * Ensures type safety across the entire application
 */

/**
 * Account health status indicator
 */
export type AccountHealth = 'at-risk' | 'healthy'

/**
 * Risk level classification
 */
export type RiskLevel = 'High' | 'None'

/**
 * Alert severity type
 */
export type AlertType = 'warning' | 'info' | 'error'

/**
 * Twin proposal approval status
 */
export type ProposalStatus = 'pending' | 'approved' | 'rejected'

/**
 * OODA action type
 */
export type OODAAction = 'store' | 'ask' | 'assign' | 'approve'

/**
 * Alert object structure
 */
export interface Alert {
  id: string
  type: AlertType
  message: string
  timestamp?: Date
  actionable?: boolean
}

/**
 * Twin proposal structure
 */
export interface TwinProposal {
  id: string
  action: string
  status: ProposalStatus
  createdAt?: Date
  context?: Record<string, unknown>
}

/**
 * Account information
 */
export interface Account {
  id: string
  name: string
  health: AccountHealth
  arr: string
  renewal: string
  owner: string
  lastTouch: string
  risk: RiskLevel
  metadata?: Record<string, unknown>
}

/**
 * Command Center shell state
 */
export interface CommandCenterState {
  activeModal: OODAAction | null
  isLoading: boolean
  alerts: Alert[]
  proposals: TwinProposal[]
  accounts: Account[]
}

/**
 * Platform API Gateway response wrapper
 */
export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
  meta?: {
    timestamp: string
    requestId: string
  }
}

/**
 * Workspace projection from Platform API
 */
export interface WorkspaceProjection {
  departmentId: string
  departmentName: string
  alerts: Alert[]
  proposals: TwinProposal[]
  accounts: Account[]
  permissions: string[]
}

/**
 * Modal props interface
 */
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: unknown) => Promise<void>
  isLoading?: boolean
}
