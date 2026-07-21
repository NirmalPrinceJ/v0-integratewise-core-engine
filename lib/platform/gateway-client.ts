import { createClient as createSupabaseClient } from '@/lib/supabase/client'

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://gateway.dev.integratewise.ai'

export interface WorkspaceProjection {
  id: string
  department: string
  entities: Record<string, any>
  signals: Array<{ type: string; message: string; severity: 'info' | 'warning' | 'error' }>
  capabilities: Array<{ id: string; name: string; icon: string }>
  governance: { approvals: Array<any>; policies: Array<any> }
}

export interface ConnectorStatus {
  provider: string
  name: string
  status: 'connected' | 'disconnected' | 'error'
  lastSync?: string
  entities: number
}

export interface CapabilityResult {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  result?: Record<string, any>
  error?: string
}

class PlatformGatewayClient {
  private baseUrl: string
  private token?: string

  constructor() {
    this.baseUrl = GATEWAY_URL
  }

  setToken(token: string) {
    this.token = token
  }

  async request<T>(
    path: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
      body?: any
      headers?: Record<string, string>
    } = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

    if (!response.ok) {
      throw new Error(`Gateway error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Fetch workspace projection (all data for a department)
  async getWorkspaceProjection(department: string): Promise<WorkspaceProjection> {
    return this.request(`/api/v1/workspace/projection/${department}`)
  }

  // Fetch connected integrations
  async getConnectorsCatalog(): Promise<ConnectorStatus[]> {
    return this.request('/api/v1/workspace/connectors/catalog')
  }

  // Fetch available capabilities for authorization
  async getCapabilities(department: string): Promise<Array<{ id: string; name: string }>> {
    return this.request(`/api/v1/capabilities?department=${department}`)
  }

  // Resolve and execute a capability
  async resolveCapability(
    capabilityId: string,
    context: {
      department: string
      entity: Record<string, any>
      action: string
      data?: Record<string, any>
    }
  ): Promise<CapabilityResult> {
    return this.request('/api/v1/capabilities/resolve', {
      method: 'POST',
      body: { capabilityId, context },
    })
  }

  // Authorize an integration (OAuth flow)
  async authorizeIntegration(
    provider: string,
    scopes: string[]
  ): Promise<{ authUrl: string; state: string }> {
    return this.request(`/api/v1/integrations/${provider}/authorize`, {
      method: 'POST',
      body: { scopes },
    })
  }

  // Fetch Spine timeline (operational continuity)
  async getSpineTimeline(limit: number = 50): Promise<
    Array<{
      id: string
      timestamp: string
      entityType: string
      action: string
      actor: string
      data: Record<string, any>
    }>
  > {
    return this.request(`/api/v1/spine/timeline?limit=${limit}`)
  }

  // Record observation to Spine
  async recordObservation(data: {
    entityType: string
    entityId: string
    category: 'observation' | 'decision' | 'insight' | 'evidence' | 'note'
    title: string
    description: string
  }): Promise<{ id: string }> {
    return this.request('/api/v1/spine/timeline', {
      method: 'POST',
      body: data,
    })
  }

  // Query Twin for insights
  async askTwin(query: string, context: Record<string, any>): Promise<{
    response: string
    confidence: number
    citations: string[]
  }> {
    return this.request('/api/v1/twin/ask', {
      method: 'POST',
      body: { query, context },
    })
  }

  // Assign task to Twin
  async assignTwin(task: {
    objective: string
    constraints?: string[]
    deadline?: string
    context: Record<string, any>
  }): Promise<{
    proposalId: string
    status: 'pending' | 'working'
    estimatedCompletion?: string
  }> {
    return this.request('/api/v1/twin/assign', {
      method: 'POST',
      body: task,
    })
  }

  // Approve a Twin proposal (governance)
  async approveTwinProposal(proposalId: string, approved: boolean): Promise<{
    status: 'executing' | 'rejected'
  }> {
    return this.request(`/api/v1/twin/proposals/${proposalId}/approve`, {
      method: 'POST',
      body: { approved },
    })
  }
}

export const gatewayClient = new PlatformGatewayClient()
