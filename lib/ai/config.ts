/**
 * AI SDK Configuration
 * Centralizes model selection, routing, and provider configuration
 */

import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'

export type ModelProvider = 'openai' | 'anthropic' | 'google' | 'bedrock'
export type ModelSize = 'small' | 'medium' | 'large'

/**
 * Model Selection Strategy:
 * - Small (fast): gpt-4o-mini, claude-3.5-haiku
 * - Medium (balanced): gpt-4-turbo, claude-3.5-sonnet
 * - Large (powerful): gpt-4, claude-opus
 */

export const models = {
  small: {
    reasoning: openai('gpt-4o-mini'),
    fast: openai('gpt-4o-mini'),
  },
  medium: {
    reasoning: openai('gpt-4-turbo'),
    balanced: openai('gpt-4-turbo'),
    tool_use: openai('gpt-4-turbo'),
  },
  large: {
    reasoning: openai('gpt-4'),
    powerful: openai('gpt-4'),
  },
}

/**
 * Model Selection for Different Tasks
 */
export const selectModel = (task: string, size: ModelSize = 'medium') => {
  const taskLower = task.toLowerCase()

  // Fast path: Quick queries, summaries
  if (taskLower.includes('summary') || taskLower.includes('list')) {
    return models.small.fast
  }

  // Tool use: Need structured output, function calling
  if (taskLower.includes('tool') || taskLower.includes('action') || taskLower.includes('execute')) {
    return models.medium.tool_use
  }

  // Reasoning: Complex analysis, multi-step
  if (taskLower.includes('analyze') || taskLower.includes('reason') || taskLower.includes('explain')) {
    return models.medium.reasoning
  }

  // Default
  return models.medium.balanced
}

/**
 * System Prompts for Different Roles
 */
export const systemPrompts = {
  twin: `You are the IntegrateWise Twin - an AI assistant for autonomous work execution.

Your role:
1. Observe: Watch for signals in the Spine (entity changes, risks, opportunities)
2. Orient: Gather context from Spine, connectors, and workspace history
3. Decide: Reason about the best action given constraints and policies
4. Act: Execute or propose actions through the Capability Fabric

Principles:
- Truth you own (Spine is the single source of truth)
- AI you rent (use external models and services as tools)
- Approval in between (get human approval before critical actions)
- Memory: Reference Spine timeline and past decisions
- Governance: Respect role-based capabilities and approvals

Always cite data from Spine when providing recommendations.
Always propose actions with confidence scores and reasoning.
Always suggest waiting for human approval for sensitive operations.`,

  agent: `You are an IntegrateWise Agent - an autonomous executor for specific tasks.

Your capabilities:
- Read/write to Spine (entities, relationships, timeline)
- Execute connectors (call third-party APIs)
- Create proposals and signals for the Twin
- Manage workflows and approvals

Always:
1. Validate your inputs using Spine schema
2. Check role-based permissions before acting
3. Create timeline entries for all mutations
4. Return structured results with confidence and provenance
5. Explain your reasoning in natural language`,

  capability: `You are executing a user-authorized capability in the IntegrateWise platform.

Context:
- User role: {role}
- Target entity: {entityType}/{entityId}
- Authorized for: {capabilities}

Constraints:
- Must respect governance policies
- Must create audit trail in Spine timeline
- Must return confirmation before execution
- Must handle errors gracefully`,
}

/**
 * Temperature and Parameters by Task Type
 */
export const taskParams = {
  analysis: { temperature: 0.7, maxTokens: 2000 },
  planning: { temperature: 0.8, maxTokens: 3000 },
  execution: { temperature: 0.2, maxTokens: 1000 },
  reasoning: { temperature: 0.5, maxTokens: 4000 },
  creative: { temperature: 0.9, maxTokens: 2000 },
}
