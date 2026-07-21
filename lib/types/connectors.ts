/**
 * Tenant-Level Connector Architecture
 * Connectors are stored at the tenant level and shared across all frontends
 * (Customer Zero, Marketplace, Admin, Twin)
 */

export type AuthType = 
  | 'api_key' 
  | 'oauth2' 
  | 'basic_auth' 
  | 'bearer_token' 
  | 'mtls' 
  | 'none'

export type IntegrationType = 
  | 'REST' 
  | 'GraphQL' 
  | 'Webhook' 
  | 'EventStream' 
  | 'Database' 
  | 'FileTransfer'

export type ConnectorStatus = 
  | 'active' 
  | 'beta' 
  | 'deprecated' 
  | 'planned' 
  | 'sunset' 
  | 'retired'

export type ConnectorHealthStatus = 
  | 'healthy' 
  | 'warning' 
  | 'error' 
  | 'unknown'

export interface TenantConnector {
  // Identification
  id: string
  tenantId: string
  canonicalId: string
  version: number

  // Business metadata
  name: string
  description?: string
  provider: string
  product?: string
  vendor?: string

  // Technical config
  integrationType: IntegrationType
  protocol?: string
  baseUrl?: string
  authType: AuthType
  apiVersion?: string
  status: ConnectorStatus

  // Authentication credentials (encrypted)
  credentials: ConnectorCredentials

  // Schema and documentation
  schemaFormat?: string
  schemaUrl?: string
  documentationUrl?: string

  // Health and monitoring
  healthCheckUrl?: string
  lastTestedAt?: number
  testStatus?: 'pass' | 'fail' | 'pending' | 'unknown'
  lastSyncAt?: number
  syncStatus?: ConnectorHealthStatus

  // Rate limiting and configuration
  rateLimitRpm?: number
  timeoutSeconds?: number
  retryPolicy?: 'exponential_backoff' | 'linear' | 'none' | 'custom'

  // Compliance and security
  dataClassification?: 'public' | 'internal' | 'confidential' | 'restricted'
  complianceTags?: string[]

  // Owner and permissions
  ownerTeam?: string
  ownerUserId?: string
  createdBy?: string
  permissions?: ConnectorPermissions

  // System metadata
  provenance?: Record<string, unknown>
  createdAt: number
  updatedAt: number
}

export interface ConnectorCredentials {
  // Depends on authType
  apiKey?: string
  token?: string
  refreshToken?: string
  username?: string
  password?: string
  clientId?: string
  clientSecret?: string
  oauthTokens?: {
    accessToken: string
    refreshToken?: string
    expiresAt?: number
    scope?: string[]
  }
  mtlsCert?: string
  mtlsKey?: string
  customHeaders?: Record<string, string>
}

export interface ConnectorPermissions {
  canEdit: boolean
  canDelete: boolean
  canShare: boolean
  canViewLogs: boolean
  canManageWebhooks: boolean
}

export interface ConnectorCatalogEntry {
  id: string
  provider: string
  label: string
  category: string
  roleRelevance?: string[]
  industryRelevance?: string[]
  connected?: boolean
  logoUrl?: string
  description?: string
}

export interface ProjectedConnector extends ConnectorCatalogEntry {
  relevanceScore: number
}

export interface ConnectorInstance {
  id: string
  system: string
  tenantId: string
  status: ConnectorHealthStatus
  lastSyncAt: number
  provider: string
  name: string
}

export interface ConnectorWebhook {
  id: string
  tenantId: string
  connectorId: string
  event: string
  targetUrl: string
  headers?: Record<string, string>
  active: boolean
  createdAt: number
  updatedAt: number
}

export interface ConnectorSync {
  id: string
  tenantId: string
  connectorId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  cursor?: string
  lastSyncAt?: number
  nextSyncAt?: number
  metadata?: Record<string, unknown>
}
