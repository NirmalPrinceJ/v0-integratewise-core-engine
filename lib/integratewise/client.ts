/**
 * IntegrateWise Gateway API Client
 * Handles all communication with the platform backend
 */

import type {
  SharedWorkbench,
  Department,
  Connector,
  IntegrationConnection,
  OnboardingState,
  SyncJob,
  ApiResponse,
  SpineEntity,
  Capability,
  TenantConfig,
} from './types'

export class IntegrateWiseClient {
  private baseUrl: string
  private token: string
  private tenantId: string
  private userId?: string

  constructor(config: {
    baseUrl?: string
    token: string
    tenantId: string
    userId?: string
  }) {
    this.baseUrl = config.baseUrl || 'https://gateway.dev.integratewise.ai'
    this.token = config.token
    this.tenantId = config.tenantId
    this.userId = config.userId
  }

  private async request<T = any>(
    method: string,
    path: string,
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.token}`,
      'x-tenant-id': this.tenantId,
      'Content-Type': 'application/json',
    }

    if (this.userId) {
      headers['x-user-id'] = this.userId
    }

    const response = await fetch(url, {
      method,
      headers,
      ...(body && { body: JSON.stringify(body) }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(
        error.error || `API Error: ${response.status}`
      )
    }

    return response.json()
  }

  // Workspace & Projection
  async getWorkbench(department: Department): Promise<SharedWorkbench> {
    return this.request(
      'GET',
      `/api/v1/workspace/projection/${department}`
    )
  }

  async getEntities(type?: string, limit: number = 50): Promise<{ entities: SpineEntity[] }> {
    const params = new URLSearchParams()
    if (type) params.append('type', type)
    params.append('limit', limit.toString())

    return this.request(
      'GET',
      `/api/v1/workspace/entities?${params.toString()}`
    )
  }

  async getReadiness(): Promise<{ readiness: any }> {
    return this.request('GET', '/api/v1/workspace/readiness')
  }

  // Connectors
  async getConnectors(): Promise<{ connectors: IntegrationConnection[] }> {
    return this.request('GET', '/api/v1/workspace/connectors')
  }

  async getConnectorCatalog(): Promise<{ connectors: Connector[]; total: number }> {
    return this.request('GET', '/api/v1/workspace/connectors/catalog')
  }

  async registerConnector(
    provider: string,
    flowType: 'A' | 'B' | 'C'
  ): Promise<{ success: boolean; connector_id: string }> {
    return this.request('POST', '/api/v1/workspace/register-connector', {
      provider,
      flowType,
    })
  }

  async startConnectorAuth(provider: string): Promise<{ auth_url: string; state: string }> {
    return this.request(
      'POST',
      `/api/v1/integrations/${provider}/authorize`
    )
  }

  async disconnectConnector(connectorId: string): Promise<{ success: boolean }> {
    return this.request(
      'POST',
      `/api/v1/workspace/connectors/${connectorId}/disconnect`
    )
  }

  // Integrations
  async getIntegrations(): Promise<IntegrationConnection[]> {
    return this.request('GET', '/api/v1/integrations')
  }

  async getIntegration(provider: string): Promise<IntegrationConnection> {
    return this.request('GET', `/api/v1/integrations/${provider}`)
  }

  async disconnectIntegration(provider: string): Promise<{ success: boolean }> {
    return this.request('DELETE', `/api/v1/integrations/${provider}`)
  }

  // Capabilities
  async getCapabilities(): Promise<{ capabilities: Capability[] }> {
    return this.request('GET', '/api/v1/workbench/capabilities')
  }

  async executeCapability(
    capability: string,
    params: Record<string, any>
  ): Promise<{ resolved: boolean; result: any; governance: any }> {
    return this.request('POST', '/api/v1/capabilities/resolve', {
      capability,
      params,
    })
  }

  // Onboarding
  async getOnboardingState(): Promise<{ onboarding: OnboardingState }> {
    return this.request('GET', '/api/v1/workspace/onboarding-state')
  }

  async initializeSpine(config: {
    domain: string
    industry: string
    department: string
    connectors: Array<{ provider: string; flowType: 'A' | 'B' | 'C' }>
  }): Promise<{ tenantConfig: TenantConfig; syncJobs: SyncJob[] }> {
    return this.request('POST', '/api/v1/workspace/initialize-spine', config)
  }

  async completeOnboarding(preferences?: any): Promise<{ success: boolean; redirectUrl: string }> {
    return this.request('POST', '/api/v1/workspace/complete-onboarding', { preferences })
  }

  async getProgress(): Promise<{ type: string; jobs: SyncJob[] }> {
    return this.request('GET', '/api/v1/workspace/progress')
  }

  async getExtractionProgress(jobId: string): Promise<{
    jobId: string
    status: string
    progress: { total: number; processed: number; percentage: number }
    extractedCount: number
  }> {
    return this.request('GET', `/api/v1/loader/creamy/${jobId}`)
  }

  // Health
  async health(): Promise<{ status: string; service: string; ts: number }> {
    return this.request('GET', '/health')
  }

  async readiness(): Promise<{
    status: string
    services: Array<{ name: string; healthy: boolean; latency_ms: number }>
  }> {
    return this.request('GET', '/health/ready')
  }
}

// Singleton instance
let clientInstance: IntegrateWiseClient | null = null

export function createClient(config: {
  baseUrl?: string
  token: string
  tenantId: string
  userId?: string
}): IntegrateWiseClient {
  clientInstance = new IntegrateWiseClient(config)
  return clientInstance
}

export function getClient(): IntegrateWiseClient {
  if (!clientInstance) {
    throw new Error('Client not initialized. Call createClient() first.')
  }
  return clientInstance
}
