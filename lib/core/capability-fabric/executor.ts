/**
 * Capability Fabric Executor
 * Routes capability execution through multiple execution paths:
 * - Tool-to-Tool (connector calls with data transform)
 * - Memory Fetch (Spine KG, RAG retrieval)
 * - MCP Integration (tool/resource discovery)
 * - Agent-to-Agent (Twin delegation, specialist routing)
 * - Local/API (direct execution, provider functions)
 */

import type { CapabilityInvocation, CapabilityDefinition } from "../capability-registry/types";
import type { AssembledContext } from "../capability-context/context-builder";

export enum ExecutionPathType {
  TOOL_TO_TOOL = "tool_to_tool",
  MEMORY_FETCH = "memory_fetch",
  MCP_INTEGRATION = "mcp_integration",
  AGENT_TO_AGENT = "agent_to_agent",
  LOCAL_API = "local_api",
}

export interface ExecutionPath {
  type: ExecutionPathType;
  source: string; // source tool/system
  target: string; // target tool/system
  transform?: Record<string, string>; // field mapping
  metadata?: Record<string, any>;
}

export interface ExecutionResult {
  path: ExecutionPathType;
  source: string;
  target: string;
  success: boolean;
  data?: Record<string, any>;
  error?: string;
  duration_ms: number;
  executed_at: Date;
  traces?: string[]; // debug traces
}

/**
 * Tool-to-Tool Executor
 * Direct connector calls with data transformation
 */
class ToolToToolExecutor {
  async execute(
    path: ExecutionPath,
    context: AssembledContext,
    invocation: CapabilityInvocation
  ): Promise<ExecutionResult> {
    const startTime = Date.now();
    const traces: string[] = [];

    try {
      traces.push(`[Tool-to-Tool] Routing from ${path.source} to ${path.target}`);

      // Transform data using field mapping
      const transformedData: Record<string, any> = {};
      if (path.transform) {
        for (const [srcField, tgtField] of Object.entries(path.transform)) {
          const value = (context.entities as any)?.[srcField];
          if (value !== undefined) {
            transformedData[tgtField] = value;
            traces.push(`[Tool-to-Tool] Mapped ${srcField} -> ${tgtField}`);
          }
        }
      }

      traces.push(`[Tool-to-Tool] Executing ${path.target} with transformed data`);

      // Simulate tool execution
      const result: ExecutionResult = {
        path: ExecutionPathType.TOOL_TO_TOOL,
        source: path.source,
        target: path.target,
        success: true,
        data: {
          connector_call: `${path.target}_call`,
          input_data: transformedData,
          output: `Result from ${path.target}`,
          timestamp: new Date().toISOString(),
        },
        duration_ms: Date.now() - startTime,
        executed_at: new Date(),
        traces,
      };

      return result;
    } catch (error) {
      return {
        path: ExecutionPathType.TOOL_TO_TOOL,
        source: path.source,
        target: path.target,
        success: false,
        error: error instanceof Error ? error.message : "Tool-to-tool execution failed",
        duration_ms: Date.now() - startTime,
        executed_at: new Date(),
        traces,
      };
    }
  }
}

/**
 * Memory Fetch Executor
 * Spine KG queries and RAG retrieval
 */
class MemoryFetchExecutor {
  async execute(
    path: ExecutionPath,
    context: AssembledContext,
    invocation: CapabilityInvocation
  ): Promise<ExecutionResult> {
    const startTime = Date.now();
    const traces: string[] = [];

    try {
      traces.push(`[Memory Fetch] Querying ${path.source} for ${path.target}`);

      // Simulate Spine query
      const query = {
        entity_type: path.metadata?.entity_type || "Account",
        entity_id: path.metadata?.entity_id || context.execution_id,
        fields: path.metadata?.fields || ["*"],
      };

      traces.push(`[Memory Fetch] Executing Spine query: ${JSON.stringify(query)}`);

      // Simulated memory retrieval
      const result: ExecutionResult = {
        path: ExecutionPathType.MEMORY_FETCH,
        source: path.source,
        target: path.target,
        success: true,
        data: {
          query,
          retrieved_entities: context.entities,
          related_history: context.history.past_executions.slice(0, 2),
          signals: Object.entries(context.signals).map(([type, signal]) => ({
            type,
            score: signal.score,
            trend: signal.trend,
          })),
        },
        duration_ms: Date.now() - startTime,
        executed_at: new Date(),
        traces,
      };

      return result;
    } catch (error) {
      return {
        path: ExecutionPathType.MEMORY_FETCH,
        source: path.source,
        target: path.target,
        success: false,
        error: error instanceof Error ? error.message : "Memory fetch failed",
        duration_ms: Date.now() - startTime,
        executed_at: new Date(),
        traces,
      };
    }
  }
}

/**
 * MCP Integration Executor
 * Tool/resource discovery and prompt injection
 */
class MCPIntegrationExecutor {
  async execute(
    path: ExecutionPath,
    context: AssembledContext,
    invocation: CapabilityInvocation
  ): Promise<ExecutionResult> {
    const startTime = Date.now();
    const traces: string[] = [];

    try {
      traces.push(`[MCP Integration] Discovering tools in ${path.source}`);

      // Simulate MCP tool discovery
      const tools = [
        { name: "get_entity", description: "Fetch entity from Spine" },
        { name: "update_entity", description: "Update entity in Spine" },
        { name: "search_entities", description: "Search for entities" },
      ];

      traces.push(`[MCP Integration] Discovered ${tools.length} tools`);

      // Inject context into MCP prompt
      const injectedPrompt = `Context: ${context.ai_context.summary}\nAvailable Tools: ${tools.map((t) => t.name).join(", ")}`;

      const result: ExecutionResult = {
        path: ExecutionPathType.MCP_INTEGRATION,
        source: path.source,
        target: path.target,
        success: true,
        data: {
          tools_discovered: tools,
          injected_prompt: injectedPrompt,
          tool_context: context.ai_context,
          available_resources: ["entity_schemas", "relationship_maps", "signal_definitions"],
        },
        duration_ms: Date.now() - startTime,
        executed_at: new Date(),
        traces,
      };

      return result;
    } catch (error) {
      return {
        path: ExecutionPathType.MCP_INTEGRATION,
        source: path.source,
        target: path.target,
        success: false,
        error: error instanceof Error ? error.message : "MCP integration failed",
        duration_ms: Date.now() - startTime,
        executed_at: new Date(),
        traces,
      };
    }
  }
}

/**
 * Agent-to-Agent Executor
 * Twin delegation and specialist routing
 */
class AgentToAgentExecutor {
  async execute(
    path: ExecutionPath,
    context: AssembledContext,
    invocation: CapabilityInvocation
  ): Promise<ExecutionResult> {
    const startTime = Date.now();
    const traces: string[] = [];

    try {
      traces.push(`[Agent-to-Agent] Delegating to ${path.target} specialist`);

      // Route to specialist twin
      const specialist = {
        type: path.target,
        expertise: path.metadata?.expertise || "domain",
        tools: path.metadata?.tools || [],
      };

      traces.push(`[Agent-to-Agent] Routing to ${specialist.type} with expertise: ${specialist.expertise}`);

      // Simulate agent handoff
      const result: ExecutionResult = {
        path: ExecutionPathType.AGENT_TO_AGENT,
        source: path.source,
        target: path.target,
        success: true,
        data: {
          delegated_to: specialist,
          delegation_context: {
            summary: context.ai_context.summary,
            required_tools: specialist.tools,
            authority_level: path.metadata?.authority_level || "approved",
          },
          specialist_response: `Specialist ${specialist.type} is processing the task`,
        },
        duration_ms: Date.now() - startTime,
        executed_at: new Date(),
        traces,
      };

      return result;
    } catch (error) {
      return {
        path: ExecutionPathType.AGENT_TO_AGENT,
        source: path.source,
        target: path.target,
        success: false,
        error: error instanceof Error ? error.message : "Agent delegation failed",
        duration_ms: Date.now() - startTime,
        executed_at: new Date(),
        traces,
      };
    }
  }
}

/**
 * Capability Fabric Executor
 * Routes execution through appropriate fabric paths
 */
export class CapabilityFabricExecutor {
  private toolToToolExecutor = new ToolToToolExecutor();
  private memoryFetchExecutor = new MemoryFetchExecutor();
  private mcpIntegrationExecutor = new MCPIntegrationExecutor();
  private agentToAgentExecutor = new AgentToAgentExecutor();

  /**
   * Execute through appropriate fabric path
   */
  async execute(
    path: ExecutionPath,
    context: AssembledContext,
    invocation: CapabilityInvocation
  ): Promise<ExecutionResult> {
    switch (path.type) {
      case ExecutionPathType.TOOL_TO_TOOL:
        return this.toolToToolExecutor.execute(path, context, invocation);

      case ExecutionPathType.MEMORY_FETCH:
        return this.memoryFetchExecutor.execute(path, context, invocation);

      case ExecutionPathType.MCP_INTEGRATION:
        return this.mcpIntegrationExecutor.execute(path, context, invocation);

      case ExecutionPathType.AGENT_TO_AGENT:
        return this.agentToAgentExecutor.execute(path, context, invocation);

      case ExecutionPathType.LOCAL_API:
        return this.executeLocalAPI(path, context, invocation);

      default:
        return {
          path: path.type,
          source: path.source,
          target: path.target,
          success: false,
          error: `Unknown execution path type: ${path.type}`,
          duration_ms: 0,
          executed_at: new Date(),
        };
    }
  }

  /**
   * Execute local API call
   */
  private async executeLocalAPI(
    path: ExecutionPath,
    context: AssembledContext,
    invocation: CapabilityInvocation
  ): Promise<ExecutionResult> {
    const startTime = Date.now();

    try {
      // Simulate local API execution
      const result: ExecutionResult = {
        path: ExecutionPathType.LOCAL_API,
        source: path.source,
        target: path.target,
        success: true,
        data: {
          api_endpoint: path.target,
          payload: context.entities,
          response: { status: "success", id: `local_${Date.now()}` },
        },
        duration_ms: Date.now() - startTime,
        executed_at: new Date(),
      };

      return result;
    } catch (error) {
      return {
        path: ExecutionPathType.LOCAL_API,
        source: path.source,
        target: path.target,
        success: false,
        error: error instanceof Error ? error.message : "Local API execution failed",
        duration_ms: Date.now() - startTime,
        executed_at: new Date(),
      };
    }
  }

  /**
   * Build execution plan for a capability
   */
  buildExecutionPlan(capability: CapabilityDefinition): ExecutionPath[] {
    const paths: ExecutionPath[] = [];

    // Add memory fetch for context assembly
    paths.push({
      type: ExecutionPathType.MEMORY_FETCH,
      source: "capability_engine",
      target: "spine",
      metadata: { entity_type: "Account" },
    });

    // Add MCP integration for tool discovery
    paths.push({
      type: ExecutionPathType.MCP_INTEGRATION,
      source: "capability_engine",
      target: "mcp_connector",
      metadata: { expertise: capability.domain },
    });

    // Add tool-to-tool paths based on capability produces
    if (capability.produces.destinations.length > 0) {
      paths.push({
        type: ExecutionPathType.TOOL_TO_TOOL,
        source: "capability_engine",
        target: capability.produces.destinations[0],
        transform: { id: "entity_id", name: "entity_name" },
      });
    }

    return paths;
  }

  /**
   * Get execution statistics
   */
  getExecutionStats(executions: ExecutionResult[]): Record<string, any> {
    const successful = executions.filter((e) => e.success);
    const failed = executions.filter((e) => !e.success);

    return {
      total: executions.length,
      successful: successful.length,
      failed: failed.length,
      success_rate: successful.length / executions.length || 0,
      avg_duration_ms:
        successful.length > 0
          ? successful.reduce((sum, e) => sum + e.duration_ms, 0) / successful.length
          : 0,
      by_path: Object.values(ExecutionPathType).map((pathType) => ({
        path: pathType,
        count: executions.filter((e) => e.path === pathType).length,
        success_rate: executions.filter((e) => e.path === pathType && e.success).length /
          (executions.filter((e) => e.path === pathType).length || 1),
      })),
    };
  }
}

export default CapabilityFabricExecutor;
