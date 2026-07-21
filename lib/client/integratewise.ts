/**
 * IntegrateWise Frontend Client
 * Calls the local proxy endpoints which forward to the gateway
 */

export interface ConnectorCatalogItem {
  id: string
  name: string
  category: string
  flowType: 'A' | 'B' | 'C'
  connectionMethod: 'nango' | 'api_wrapper' | 'ai_provider'
  status: 'available' | 'connected'
  capabilities: string[]
  departments: string[]
  industries: string[]
  mcpTools: string[]
  supportedEntities: string[]
  authType: 'oauth' | 'api_key' | 'none'
}

export interface ConnectorInstance {
  id: string
  name: string
  category: string
  status: 'connected' | 'disconnected'
  connectedAt?: string
  lastSyncAt?: string
}

class IntegrateWiseClient {
  private baseUrl = '/api/v1'

  /**
   * List installed connectors
   */
  async listConnectors(): Promise<ConnectorInstance[]> {
    const response = await fetch(`${this.baseUrl}/workspace/connectors`)
    if (!response.ok) {
      throw new Error(`Failed to list connectors: ${response.statusText}`)
    }
    return response.json()
  }

  /**
   * Get full connector catalog
   */
  async getCatalog(): Promise<ConnectorCatalogItem[]> {
    const response = await fetch(`${this.baseUrl}/workspace/connectors/catalog`)
    if (!response.ok) {
      throw new Error(`Failed to fetch catalog: ${response.statusText}`)
    }
    return response.json()
  }

  /**
   * Create Nango session for connector auth
   */
  async createNangoSession(connectorId: string, payload?: Record<string, unknown>) {
    const response = await fetch(`${this.baseUrl}/workspace/connectors/nango-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        connectorId,
        ...payload,
      }),
    })
    if (!response.ok) {
      throw new Error(`Failed to create Nango session: ${response.statusText}`)
    }
    return response.json()
  }

  /**
   * Disconnect a connector
   */
  async disconnectConnector(connectorId: string) {
    const response = await fetch(
      `${this.baseUrl}/workspace/connectors/${connectorId}/disconnect`,
      { method: 'POST' }
    )
    if (!response.ok) {
      throw new Error(`Failed to disconnect connector: ${response.statusText}`)
    }
    return response.json()
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
    const response = await fetch(`${this.baseUrl}/workspace/register-connector`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      throw new Error(`Failed to register connector: ${response.statusText}`)
    }
    return response.json()
  }

  /**
   * Health check
   */
  async health() {
    const response = await fetch(`${this.baseUrl}/health`)
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`)
    }
    return response.json()
  }
}

export const integrateWiseClient = new IntegrateWiseClient()
export default IntegrateWiseClient
