/**
 * IntegrateWise Gateway Client
 * Intelligent proxy to gateway.dev.integratewise.ai
 * Handles auth, error handling, and response normalization
 */

export interface GatewayRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: Record<string, unknown>
  headers?: Record<string, string>
}

export interface GatewayResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  status: number
}

class IntegrateWiseGateway {
  private baseUrl: string
  private apiToken: string
  private tenantId: string

  constructor(
    baseUrl: string = process.env.INTEGRATEWISE_GATEWAY_URL || 'https://gateway.dev.integratewise.ai',
    apiToken: string = process.env.INTEGRATEWISE_API_TOKEN || '',
    tenantId: string = process.env.INTEGRATEWISE_TENANT_ID || ''
  ) {
    this.baseUrl = baseUrl
    this.apiToken = apiToken
    this.tenantId = tenantId

    if (!this.apiToken) {
      console.warn('[IntegrateWise] INTEGRATEWISE_API_TOKEN not configured')
    }
    if (!this.tenantId) {
      console.warn('[IntegrateWise] INTEGRATEWISE_TENANT_ID not configured')
    }
  }

  private getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.apiToken}`,
      'x-tenant-id': this.tenantId,
      'Content-Type': 'application/json',
    }
  }

  async request<T = unknown>(
    endpoint: string,
    options: GatewayRequestOptions = {}
  ): Promise<GatewayResponse<T>> {
    const {
      method = 'GET',
      body,
      headers = {},
    } = options

    const url = `${this.baseUrl}${endpoint}`
    const mergedHeaders = {
      ...this.getAuthHeaders(),
      ...headers,
    }

    try {
      const response = await fetch(url, {
        method,
        headers: mergedHeaders,
        body: body ? JSON.stringify(body) : undefined,
      })

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type')
      let data: unknown

      if (contentType?.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      if (!response.ok) {
        return {
          success: false,
          error: typeof data === 'object' && data !== null && 'message' in data
            ? (data as { message: string }).message
            : `Gateway error: ${response.status}`,
          status: response.status,
        }
      }

      return {
        success: true,
        data: data as T,
        status: response.status,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('[IntegrateWise] Request failed:', errorMessage)
      return {
        success: false,
        error: `Failed to reach gateway: ${errorMessage}`,
        status: 500,
      }
    }
  }

  /**
   * List installed connectors for the workspace
   */
  async listConnectors() {
    return this.request('/api/v1/workspace/connectors')
  }

  /**
   * Get full connector catalog (100+)
   */
  async getCatalog() {
    return this.request('/api/v1/workspace/connectors/catalog')
  }

  /**
   * Create a Nango sync session for connector auth
   */
  async createNangoSession(payload: { connectorId: string; [key: string]: unknown }) {
    return this.request('/api/v1/workspace/connectors/nango-session', {
      method: 'POST',
      body: payload,
    })
  }

  /**
   * Disconnect a connector
   */
  async disconnectConnector(connectorId: string) {
    return this.request(`/api/v1/workspace/connectors/${connectorId}/disconnect`, {
      method: 'POST',
    })
  }

  /**
   * Register a new connector
   */
  async registerConnector(payload: {
    connectorId: string
    name: string
    category: string
    [key: string]: unknown
  }) {
    return this.request('/api/v1/workspace/register-connector', {
      method: 'POST',
      body: payload,
    })
  }

  /**
   * Health check
   */
  async health() {
    return this.request('/health')
  }
}

// Export singleton instance
export const gateway = new IntegrateWiseGateway()

// Export class for testing/custom instances
export default IntegrateWiseGateway
