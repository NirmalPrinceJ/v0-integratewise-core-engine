/**
 * Capability Context Builder
 * Assembles all data and context needed for a capability execution
 * Fetches from Spine, enriches with signals, includes historical context
 */

import type { CapabilityDefinition } from "../capability-registry/types";

export interface ContextQuery {
  entity_type: string;
  entity_id: string;
  fields?: string[];
  include_related?: string[]; // related entities to fetch
}

export interface SignalContext {
  signal_type: string;
  score: number; // 0-100
  recent_events: Array<{ event: string; timestamp: Date; severity: "low" | "medium" | "high" }>;
  trend: "improving" | "stable" | "declining";
  time_window_days: number;
}

export interface HistoricalContext {
  capability_id: string;
  past_executions: Array<{
    execution_id: string;
    executed_at: Date;
    state: string;
    success: boolean;
    duration_ms: number;
    outcome: Record<string, any>;
  }>;
  success_rate: number;
  avg_duration_ms: number;
}

export interface AssembledContext {
  // Identity
  capability_id: string;
  execution_id: string;
  invoked_by: string;
  timestamp: Date;

  // Primary data
  entities: Record<string, any>; // All required entity data

  // Contextual signals
  signals: Record<string, SignalContext>; // risk, opportunity, engagement scores

  // Historical context
  history: HistoricalContext;

  // Enriched context for AI
  ai_context: {
    summary: string; // AI-friendly summary of situation
    recent_interactions: string[];
    relevant_outcomes: string[];
  };

  // User context
  user_context: {
    user_id: string;
    role: string;
    team?: string;
    permissions: string[];
  };

  // Full context as string for LLM prompts
  formatted_for_llm(): string;
}

/**
 * Mock Spine query executor for demonstration
 * In production, this would query the actual Operational Spine
 */
class MockSpineExecutor {
  query(q: ContextQuery): Promise<Record<string, any>> {
    // Simulated Spine query responses
    const mockData: Record<string, Record<string, any>> = {
      Opportunity: {
        opp_123: {
          id: "opp_123",
          name: "Acme Corp Expansion",
          arr: 500000,
          stage: "proposal",
          customer_id: "acc_456",
          created_at: new Date("2026-06-01"),
          last_activity: new Date("2026-07-04"),
        },
      },
      Account: {
        acc_456: {
          id: "acc_456",
          name: "Acme Corporation",
          industry: "Technology",
          employee_count: 5000,
          arr: 250000,
          customer_since: new Date("2023-01-01"),
        },
      },
    };

    const result = mockData[q.entity_type]?.[q.entity_id] || {};
    return Promise.resolve(result);
  }
}

/**
 * Mock Signal Engine for fetching signals
 */
class MockSignalEngine {
  getSignal(
    entity_id: string,
    signal_type: string,
    time_window_days: number
  ): Promise<SignalContext> {
    // Simulated signal responses
    const signals: Record<string, SignalContext> = {
      engagement: {
        signal_type: "engagement",
        score: 72,
        recent_events: [
          { event: "email_opened", timestamp: new Date("2026-07-04"), severity: "low" },
          { event: "call_scheduled", timestamp: new Date("2026-07-03"), severity: "medium" },
          { event: "contract_signed", timestamp: new Date("2026-07-02"), severity: "high" },
        ],
        trend: "improving",
        time_window_days,
      },
      risk: {
        signal_type: "risk",
        score: 25,
        recent_events: [
          { event: "no_usage_3days", timestamp: new Date("2026-07-04"), severity: "low" },
          { event: "support_ticket_open", timestamp: new Date("2026-07-01"), severity: "medium" },
        ],
        trend: "stable",
        time_window_days,
      },
      opportunity: {
        signal_type: "opportunity",
        score: 85,
        recent_events: [
          { event: "team_expansion_hiring", timestamp: new Date("2026-07-04"), severity: "high" },
          {
            event: "product_adoption_high",
            timestamp: new Date("2026-07-03"),
            severity: "high",
          },
          {
            event: "positive_nps_feedback",
            timestamp: new Date("2026-07-02"),
            severity: "medium",
          },
        ],
        trend: "improving",
        time_window_days,
      },
    };

    return Promise.resolve(signals[signal_type] || signals["engagement"]);
  }
}

/**
 * Context Builder - Assembles all context for capability execution
 */
export class ContextBuilder {
  private spine = new MockSpineExecutor();
  private signals = new MockSignalEngine();

  async build(
    capabilityId: string,
    executionId: string,
    userId: string,
    userRole: string,
    inputData: Record<string, any>,
    capability: CapabilityDefinition
  ): Promise<AssembledContext> {
    // 1. Fetch required entities from Spine
    const entities: Record<string, any> = {};
    for (const req of capability.requires_data) {
      const entityData = inputData[req.entity_type];
      if (entityData) {
        // Query Spine for full entity data
        const spineData = await this.spine.query({
          entity_type: req.entity_type,
          entity_id: entityData.id,
          fields: req.fields,
        });
        entities[req.entity_type] = { ...entityData, ...spineData };
      }
    }

    // 2. Fetch signals
    const signalsContext: Record<string, SignalContext> = {};
    const primaryEntity = entities[capability.requires_data[0]?.entity_type];
    if (primaryEntity && capability.requires_signals) {
      for (const signalReq of capability.requires_signals) {
        const signal = await this.signals.getSignal(
          primaryEntity.id,
          signalReq.signal_type,
          signalReq.time_window_days || 30
        );
        signalsContext[signalReq.signal_type] = signal;
      }
    }

    // 3. Build historical context (mocked)
    const history: HistoricalContext = {
      capability_id: capabilityId,
      past_executions: [
        {
          execution_id: "exec_001",
          executed_at: new Date("2026-06-15"),
          state: "completed",
          success: true,
          duration_ms: 3600000,
          outcome: { order_id: "ord_001", amount: 250000 },
        },
        {
          execution_id: "exec_002",
          executed_at: new Date("2026-06-22"),
          state: "completed",
          success: true,
          duration_ms: 3200000,
          outcome: { order_id: "ord_002", amount: 150000 },
        },
      ],
      success_rate: 0.95,
      avg_duration_ms: 3400000,
    };

    // 4. Build AI context
    const ai_context = {
      summary: `Executing ${capability.name} for ${primaryEntity?.name || "customer"}. Context: ${Object.entries(
        entities
      )
        .map(([type, data]) => `${type}: ${data.name || data.id}`)
        .join(", ")}`,
      recent_interactions: ["email_sent_3_days_ago", "call_scheduled_tomorrow", "demo_completed"],
      relevant_outcomes: [
        "High engagement score (72/100)",
        "Expansion opportunity detected",
        "Strong product adoption signals",
      ],
    };

    // 5. Assemble final context
    const user_context = {
      user_id: userId,
      role: userRole,
      permissions: capability.permissions
        .filter((p) => p.role === userRole && p.can_invoke)
        .flatMap((p) => [p.can_approve ? "approve" : null, p.can_execute ? "execute" : null])
        .filter(Boolean) as string[],
    };

    const context: AssembledContext = {
      capability_id: capabilityId,
      execution_id: executionId,
      invoked_by: userId,
      timestamp: new Date(),
      entities,
      signals: signalsContext,
      history,
      ai_context,
      user_context,
      formatted_for_llm: function () {
        return `
# Capability Execution Context

## Capability: ${capability.name}
${capability.description}

## Primary Entity: ${primaryEntity?.name || "N/A"}
${JSON.stringify(primaryEntity, null, 2)}

## Signals
${Object.entries(signalsContext)
  .map(
    ([type, signal]) =>
      `- ${type}: ${signal.score}/100 (${signal.trend}) - ${signal.recent_events.map((e) => e.event).join(", ")}`
  )
  .join("\n")}

## Historical Performance
Success Rate: ${history.success_rate * 100}%
Average Duration: ${history.avg_duration_ms}ms
Recent Outcomes: ${history.past_executions.map((e) => e.outcome).join("; ")}

## User Context
Role: ${userRole}
Permissions: ${user_context.permissions.join(", ")}

## AI Guidance
${ai_context.summary}
Recent Interactions: ${ai_context.recent_interactions.join(", ")}
Key Signals: ${ai_context.relevant_outcomes.join(", ")}
`;
      },
    };

    return context;
  }
}

export default ContextBuilder;
