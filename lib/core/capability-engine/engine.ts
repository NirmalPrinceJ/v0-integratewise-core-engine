/**
 * Capability Engine
 * Runtime execution of capability workflows
 * State machine: pending → ai_processing → human_review → execution → completed
 */

import type {
  CapabilityDefinition,
  CapabilityInvocation,
  CapabilityState,
  CapabilityStep,
  HandlerType,
} from "../capability-registry/types";
import { CapabilityState, HandlerType } from "../capability-registry/types";
import type { AssembledContext } from "../capability-context/context-builder";

export interface StepExecutionResult {
  step_id: string;
  status: "completed" | "failed" | "pending_review";
  result?: Record<string, any>;
  error?: string;
  duration_ms: number;
  executed_at: Date;
  requires_approval?: boolean;
  approved_at?: Date;
  approved_by?: string;
}

export interface CapabilityEngineConfig {
  ai_model: string;
  ai_endpoint: string;
  enable_human_review: boolean;
  ai_confidence_threshold: number;
  retry_attempts: number;
  timeout_ms: number;
}

/**
 * Mock AI execution - in production integrates with LLM
 */
async function executeAIStep(
  step: CapabilityStep,
  context: AssembledContext
): Promise<StepExecutionResult> {
  const startTime = Date.now();

  // Simulate AI processing
  const result: StepExecutionResult = {
    step_id: step.id,
    status: "completed",
    result: {
      ai_model: step.ai_model || "gpt-4",
      recommendation: `AI recommendation for: ${step.name}`,
      confidence: 0.87,
      reasoning: `Based on context: ${context.ai_context.summary}`,
    },
    duration_ms: Date.now() - startTime,
    executed_at: new Date(),
    requires_approval: step.requires_approval,
  };

  return result;
}

/**
 * Capability Engine - executes workflows
 */
export class CapabilityEngine {
  private config: CapabilityEngineConfig;
  private invocations: Map<string, CapabilityInvocation> = new Map();

  constructor(config: CapabilityEngineConfig) {
    this.config = config;
  }

  /**
   * Execute a capability from start to finish
   */
  async execute(
    invocation: CapabilityInvocation,
    capability: CapabilityDefinition,
    context: AssembledContext
  ): Promise<CapabilityInvocation> {
    this.invocations.set(invocation.id, invocation);

    try {
      // Execute each step in sequence
      for (const step of capability.steps) {
        invocation.current_step = step.id;
        invocation.state = this.getStateForHandler(step.handler);

        const result = await this.executeStep(step, context, invocation);
        invocation.step_results[step.id] = result;

        // Check if step requires approval and if we should wait
        if (result.requires_approval && this.config.enable_human_review) {
          invocation.state = "human_review" as CapabilityState;
          // In production, this would route to human and wait for approval
          // For demo, auto-approve
          result.approved_at = new Date();
          result.approved_by = "system_auto_approved";
        }

        if (result.status === "failed") {
          invocation.state = "failed" as CapabilityState;
          invocation.error = result.error;
          break;
        }
      }

      // Mark as completed if not failed
      if (invocation.state !== "failed") {
        invocation.state = "completed" as CapabilityState;
      }

      invocation.completed_at = new Date();
      invocation.duration_ms = invocation.completed_at.getTime() - invocation.invoked_at.getTime();

      this.invocations.set(invocation.id, invocation);
      return invocation;
    } catch (error) {
      invocation.state = "failed" as CapabilityState;
      invocation.error = error instanceof Error ? error.message : "Unknown error";
      invocation.completed_at = new Date();
      this.invocations.set(invocation.id, invocation);
      return invocation;
    }
  }

  /**
   * Execute a single step
   */
  private async executeStep(
    step: CapabilityStep,
    context: AssembledContext,
    invocation: CapabilityInvocation
  ): Promise<StepExecutionResult> {
    const startTime = Date.now();

    try {
      let result: StepExecutionResult;

      switch (step.handler) {
        case HandlerType.AI:
          result = await executeAIStep(step, context);
          break;

        case HandlerType.HUMAN:
          result = {
            step_id: step.id,
            status: "pending_review",
            duration_ms: Date.now() - startTime,
            executed_at: new Date(),
            requires_approval: true,
          };
          break;

        case HandlerType.SYSTEM:
          result = {
            step_id: step.id,
            status: "completed",
            result: {
              action: `Executed system step: ${step.name}`,
              timestamp: new Date().toISOString(),
            },
            duration_ms: Date.now() - startTime,
            executed_at: new Date(),
          };
          break;

        case HandlerType.HYBRID:
          // AI then human
          const aiResult = await executeAIStep(step, context);
          result = {
            ...aiResult,
            requires_approval: true,
            status: "pending_review",
          };
          break;

        default:
          result = {
            step_id: step.id,
            status: "failed",
            error: `Unknown handler type: ${step.handler}`,
            duration_ms: Date.now() - startTime,
            executed_at: new Date(),
          };
      }

      return result;
    } catch (error) {
      return {
        step_id: step.id,
        status: "failed",
        error: error instanceof Error ? error.message : "Step execution failed",
        duration_ms: Date.now() - startTime,
        executed_at: new Date(),
      };
    }
  }

  /**
   * Get capability state based on handler type
   */
  private getStateForHandler(handler: HandlerType): CapabilityState {
    switch (handler) {
      case HandlerType.AI:
        return "ai_processing" as CapabilityState;
      case HandlerType.HUMAN:
      case HandlerType.HYBRID:
        return "human_review" as CapabilityState;
      case HandlerType.SYSTEM:
        return "execution" as CapabilityState;
      default:
        return "pending" as CapabilityState;
    }
  }

  /**
   * Get invocation by ID
   */
  getInvocation(id: string): CapabilityInvocation | undefined {
    return this.invocations.get(id);
  }

  /**
   * List all invocations
   */
  listInvocations(): CapabilityInvocation[] {
    return Array.from(this.invocations.values());
  }

  /**
   * Get invocations for a user
   */
  getInvocationsFor(userId: string): CapabilityInvocation[] {
    return Array.from(this.invocations.values()).filter((inv) => inv.invoked_by === userId);
  }

  /**
   * Approve a pending human review step
   */
  approvePendingStep(invocationId: string, stepId: string, approvedBy: string): boolean {
    const invocation = this.invocations.get(invocationId);
    if (!invocation) return false;

    const result = invocation.step_results[stepId];
    if (!result || result.status !== "pending_review") return false;

    result.approved_at = new Date();
    result.approved_by = approvedBy;
    result.status = "completed";

    return true;
  }

  /**
   * Get metrics for a capability
   */
  getMetrics(capabilityId: string) {
    const invocations = Array.from(this.invocations.values()).filter(
      (inv) => inv.capability_id === capabilityId
    );

    const completed = invocations.filter((inv) => inv.state === "completed");
    const failed = invocations.filter((inv) => inv.state === "failed");

    return {
      total: invocations.length,
      completed: completed.length,
      failed: failed.length,
      success_rate: completed.length / invocations.length || 0,
      avg_duration_ms:
        completed.length > 0
          ? completed.reduce((sum, inv) => sum + (inv.duration_ms || 0), 0) / completed.length
          : 0,
    };
  }
}

export default CapabilityEngine;
