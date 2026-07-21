/**
 * Connector Manager
 * Manages MCP connectors and tool-to-tool execution
 */

import type { Connector, MCPTool, ToolCall, ConnectorMapping, ConnectorStatus, ConnectorType } from "./types";
import { ConnectorStatus } from "./types";

export class ConnectorManager {
  private connectors: Map<string, Connector> = new Map();
  private tools: Map<string, MCPTool> = new Map();
  private toolCalls: Map<string, ToolCall> = new Map();
  private mappings: Map<string, ConnectorMapping> = new Map();

  /**
   * Register a connector
   */
  async registerConnector(connector: Connector): Promise<void> {
    this.connectors.set(connector.id, connector);
  }

  /**
   * Get connector by ID
   */
  async getConnector(id: string): Promise<Connector | undefined> {
    return this.connectors.get(id);
  }

  /**
   * List all connectors
   */
  async listConnectors(status?: ConnectorStatus): Promise<Connector[]> {
    const connectors = Array.from(this.connectors.values());
    return status ? connectors.filter((c) => c.status === status) : connectors;
  }

  /**
   * Update connector status
   */
  async updateConnectorStatus(id: string, status: ConnectorStatus, message?: string): Promise<boolean> {
    const connector = this.connectors.get(id);
    if (!connector) return false;

    connector.status = status;
    connector.last_health_check = new Date();
    if (message) connector.health_check_message = message;

    this.connectors.set(id, connector);
    return true;
  }

  /**
   * Register a tool
   */
  async registerTool(tool: MCPTool): Promise<void> {
    this.tools.set(tool.id, tool);
  }

  /**
   * Get tool by ID
   */
  async getTool(id: string): Promise<MCPTool | undefined> {
    return this.tools.get(id);
  }

  /**
   * List tools for a connector
   */
  async listTools(connectorId: string): Promise<MCPTool[]> {
    const tools = Array.from(this.tools.values());
    return tools.filter((t) => t.connector_id === connectorId);
  }

  /**
   * Execute tool
   */
  async executeTool(toolId: string, arguments_: Record<string, any>): Promise<ToolCall> {
    const tool = this.tools.get(toolId);
    if (!tool) throw new Error("Tool not found");

    const connector = this.connectors.get(tool.connector_id);
    if (!connector) throw new Error("Connector not found");

    if (connector.status !== ConnectorStatus.CONNECTED) {
      throw new Error(`Connector is not connected: ${connector.status}`);
    }

    const toolCall: ToolCall = {
      id: `call_${Date.now()}_${Math.random()}`,
      tool_id: toolId,
      connector_id: tool.connector_id,
      arguments: arguments_,
      timestamp: new Date(),
      status: "pending",
    };

    this.toolCalls.set(toolCall.id, toolCall);

    try {
      // Simulate tool execution
      const startTime = Date.now();
      toolCall.status = "executing";

      // In production, this would call the actual tool via MCP
      const result = await this.simulateToolExecution(tool, arguments_);

      toolCall.status = "completed";
      toolCall.result = result;
      toolCall.duration_ms = Date.now() - startTime;
    } catch (error) {
      toolCall.status = "failed";
      toolCall.error = error instanceof Error ? error.message : "Unknown error";
    }

    this.toolCalls.set(toolCall.id, toolCall);
    return toolCall;
  }

  /**
   * Simulate tool execution (placeholder for production MCP calls)
   */
  private async simulateToolExecution(
    tool: MCPTool,
    arguments_: Record<string, any>
  ): Promise<Record<string, any>> {
    // Simulate execution delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      tool_id: tool.id,
      tool_name: tool.name,
      executed_at: new Date().toISOString(),
      arguments: arguments_,
      result: "Success",
    };
  }

  /**
   * Get tool call by ID
   */
  async getToolCall(id: string): Promise<ToolCall | undefined> {
    return this.toolCalls.get(id);
  }

  /**
   * List tool calls for a connector
   */
  async listToolCalls(connectorId: string, limit: number = 50): Promise<ToolCall[]> {
    const calls = Array.from(this.toolCalls.values());
    return calls
      .filter((c) => c.connector_id === connectorId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Register connector mapping
   */
  async registerMapping(mapping: ConnectorMapping): Promise<void> {
    const key = `${mapping.source_connector}_${mapping.target_connector}`;
    this.mappings.set(key, mapping);
  }

  /**
   * Get connector mapping
   */
  async getMapping(sourceConnectorId: string, targetConnectorId: string): Promise<ConnectorMapping | undefined> {
    const key = `${sourceConnectorId}_${targetConnectorId}`;
    return this.mappings.get(key);
  }

  /**
   * Sync data between connectors
   */
  async syncConnectors(
    sourceConnectorId: string,
    targetConnectorId: string,
    data: Record<string, any>
  ): Promise<Record<string, any>> {
    const mapping = await this.getMapping(sourceConnectorId, targetConnectorId);
    if (!mapping) throw new Error("No mapping found between connectors");

    // Transform data using field mapping
    const transformedData: Record<string, any> = {};
    for (const [sourceField, targetField] of Object.entries(mapping.field_mapping)) {
      if (data[sourceField] !== undefined) {
        transformedData[targetField] = data[sourceField];
      }
    }

    // Push to target connector
    const targetConnector = this.connectors.get(targetConnectorId);
    if (!targetConnector) throw new Error("Target connector not found");

    return {
      source: sourceConnectorId,
      target: targetConnectorId,
      records_synced: Object.keys(transformedData).length,
      timestamp: new Date().toISOString(),
      status: "success",
    };
  }

  /**
   * Get connector statistics
   */
  async getStatistics() {
    const connectors = Array.from(this.connectors.values());
    const tools = Array.from(this.tools.values());
    const toolCalls = Array.from(this.toolCalls.values());

    const byStatus: Record<string, number> = {};
    connectors.forEach((c) => {
      byStatus[c.status] = (byStatus[c.status] || 0) + 1;
    });

    const callsByStatus: Record<string, number> = {};
    toolCalls.forEach((c) => {
      callsByStatus[c.status] = (callsByStatus[c.status] || 0) + 1;
    });

    return {
      total_connectors: connectors.length,
      connectors_by_status: byStatus,
      total_tools: tools.length,
      total_tool_calls: toolCalls.length,
      tool_calls_by_status: callsByStatus,
      avg_tool_execution_ms:
        toolCalls.length > 0
          ? toolCalls.reduce((sum, c) => sum + (c.duration_ms || 0), 0) / toolCalls.length
          : 0,
    };
  }
}

export default ConnectorManager;
