/**
 * IntegrateWise Platform API Client
 * Single entry point for all platform API calls
 * Gateway: https://gateway.dev.integratewise.ai/api/v1
 */

export interface PlatformConfig {
  baseUrl?: string;
  token: string;
  tenantId: string;
  userId?: string;
  userRole?: 'owner' | 'admin' | 'manager' | 'member' | 'viewer';
}

export class PlatformClient {
  private baseUrl: string;
  private config: PlatformConfig;

  constructor(config: PlatformConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://gateway.dev.integratewise.ai/api/v1';
  }

  private getHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.config.token}`,
      'x-tenant-id': this.config.tenantId,
      ...(this.config.userId && { 'x-user-id': this.config.userId }),
      ...(this.config.userRole && { 'x-user-role': this.config.userRole }),
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    method: string,
    path: string,
    body?: any,
    options?: { params?: Record<string, any> }
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const response = await fetch(url.toString(), {
      method,
      headers: this.getHeaders(),
      ...(body && { body: JSON.stringify(body) }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `API Error: ${response.status}`);
    }

    return response.json();
  }

  // === Workspace & Projection ===

  async getWorkspaceProjection(department: string) {
    return this.request(`/workspace/projection/${department}`);
  }

  async getWorkspaceEntities(type?: string, limit?: number) {
    return this.request(`/workspace/entities`, undefined, {
      params: { ...(type && { type }), ...(limit && { limit }) },
    });
  }

  async getWorkspaceReadiness() {
    return this.request(`/workspace/readiness`);
  }

  async getWorkspaceMetadata() {
    return this.request(`/workspace/metadata`);
  }

  // === Connectors ===

  async listConnectors() {
    return this.request(`/workspace/connectors`);
  }

  async getConnectorCatalog(department?: string) {
    return this.request(`/workspace/connectors/catalog`, undefined, {
      params: { ...(department && { department }) },
    });
  }

  async registerConnector(provider: string, flowType: 'A' | 'B' | 'C') {
    return this.request('POST', `/workspace/register-connector`, {
      provider,
      flowType,
    });
  }

  async disconnectConnector(connectorId: string) {
    return this.request('POST', `/workspace/connectors/${connectorId}/disconnect`);
  }

  async createNangoSession() {
    return this.request('POST', `/workspace/connectors/nango-session`);
  }

  // === Integrations ===

  async listIntegrations() {
    return this.request('GET', `/integrations`);
  }

  async getIntegration(provider: string) {
    return this.request('GET', `/integrations/${provider}`);
  }

  async authorizeIntegration(provider: string) {
    return this.request('POST', `/integrations/${provider}/authorize`);
  }

  async disconnectIntegration(provider: string) {
    return this.request('DELETE', `/integrations/${provider}`);
  }

  // === Capabilities ===

  async listCapabilities() {
    return this.request('GET', `/capabilities`);
  }

  async resolveCapability(capability: string, params?: any) {
    return this.request('POST', `/capabilities/resolve`, {
      capability,
      params: params || {},
    });
  }

  async getWorkbenchCapabilities() {
    return this.request('GET', `/workbench/capabilities`);
  }

  async executeCapabilityPlan(planId: string, params?: any) {
    return this.request('POST', `/workbench/capability-plans/${planId}/execute`, {
      params: params || {},
    });
  }

  // === Intelligence & Cognitive ===

  async brainstorm(query: string, context?: any) {
    return this.request('POST', `/brainstorm`, {
      query,
      context: context || {},
    });
  }

  async twinReasoning(query: string, context?: any) {
    return this.request('POST', `/cognitive/twin`, {
      query,
      context: context || {},
    });
  }

  async getInsights() {
    return this.request('GET', `/cognitive/insights`);
  }

  // === Twin & Proposals ===

  async handoffToHuman(proposal: any, context?: any) {
    return this.request('POST', `/twin/handoff`, {
      proposal,
      context: context || {},
    });
  }

  async approveTwinHandoff(handoffId: string, reason?: string) {
    return this.request('POST', `/twin/handoff/${handoffId}/approve`, {
      reason: reason || 'Approved',
    });
  }

  async rejectTwinHandoff(handoffId: string, reason?: string) {
    return this.request('POST', `/twin/handoff/${handoffId}/reject`, {
      reason: reason || 'Rejected',
    });
  }

  // === Onboarding ===

  async getOnboardingState() {
    return this.request('GET', `/workspace/onboarding-state`);
  }

  async initializeSpine(domain: string, industry: string, department: string, connectors: any[]) {
    return this.request('POST', `/workspace/initialize-spine`, {
      domain,
      industry,
      department,
      connectors,
    });
  }

  async completeOnboarding(preferences?: any) {
    return this.request('POST', `/workspace/complete-onboarding`, {
      preferences: preferences || {},
    });
  }

  async getOnboardingProgress() {
    return this.request('GET', `/workspace/progress`);
  }

  async getLoaderProgress(jobId: string) {
    return this.request('GET', `/loader/creamy/${jobId}`);
  }

  // === Metrics ===

  async getSignalMetrics() {
    return this.request('GET', `/metrics/signals`);
  }

  // === Pipeline ===

  async getDashboardEntities(limit?: number) {
    return this.request('GET', `/pipeline/entities`, undefined, {
      params: { ...(limit && { limit }) },
    });
  }

  // === Health ===

  async getHealth() {
    return fetch(`https://gateway.dev.integratewise.ai/health`).then(r => r.json());
  }

  async getReadiness() {
    return fetch(`https://gateway.dev.integratewise.ai/health/ready`).then(r => r.json());
  }
}

export function createPlatformClient(config: PlatformConfig): PlatformClient {
  return new PlatformClient(config);
}
