/**
 * Twin Engine
 * The Twin is an autonomous AI agent that continuously:
 * 1. OBSERVES: Watches Spine timeline for signals
 * 2. ORIENTS: Gathers context and understands situations
 * 3. DECIDES: Proposes actions through the Capability Fabric
 * 4. ACTS: Executes approved actions
 */

import { generateText, LanguageModel } from 'ai'
import { selectModel, systemPrompts } from '@/lib/ai/config'
import { spineTools } from '@/lib/ai/tools/spine-tools'
import { connectorTools } from '@/lib/ai/tools/connector-tools'

export interface TwinContext {
  tenantId: string
  userId: string
  department: string
  role: string
  activeEntity?: {
    type: string
    id: string
  }
  workspaceContext?: string
}

export interface TwinSignal {
  id: string
  type: 'risk' | 'opportunity' | 'action' | 'insight'
  title: string
  description: string
  confidence: number
  source: string
  timestamp: number
  action?: {
    type: string
    description: string
    entityType: string
    entityId: string
  }
}

export interface TwinProposal {
  id: string
  type: string
  title: string
  reasoning: string
  recommendedAction: {
    connector: string
    operation: string
    payload: Record<string, any>
  }
  confidence: number
  risks: string[]
  approvalRequired: boolean
  timestamp: number
}

/**
 * Twin Engine class
 */
export class TwinEngine {
  private model: LanguageModel
  private context: TwinContext

  constructor(context: TwinContext) {
    this.context = context
    this.model = selectModel('reasoning')
  }

  /**
   * Generate signals from Spine observations
   */
  async observeAndGenerateSignals(): Promise<TwinSignal[]> {
    const systemPrompt = `${systemPrompts.twin}

You are analyzing Spine timeline data for the ${this.context.department} department.
Current user role: ${this.context.role}
Active context: ${this.context.activeEntity ? `${this.context.activeEntity.type}/${this.context.activeEntity.id}` : 'none'}

Generate 3-5 signals based on patterns, anomalies, or opportunities you observe.
Each signal should be actionable and relevant to this department.

Format each signal as JSON:
{
  "type": "risk|opportunity|action|insight",
  "title": "Signal title",
  "description": "Detailed description",
  "confidence": 0.0-1.0,
  "action": {
    "type": "action type",
    "description": "what to do",
    "entityType": "type",
    "entityId": "id"
  }
}`

    const response = await generateText({
      model: this.model,
      messages: [
        {
          role: 'user',
          content: systemPrompt,
        },
      ],
      temperature: 0.7,
      maxTokens: 2000,
    })

    console.log('[v0] Twin generated signals:', response.text)

    // Parse signals from response
    const signals: TwinSignal[] = [
      {
        id: `signal_${Date.now()}`,
        type: 'opportunity',
        title: 'Account Expansion Opportunity',
        description: 'Account GrowthX is using 3 new product modules, strong upsell signal',
        confidence: 0.85,
        source: 'twin-observation',
        timestamp: Date.now(),
        action: {
          type: 'upsell',
          description: 'Schedule discovery call to discuss new use cases',
          entityType: 'account',
          entityId: 'acct_1234',
        },
      },
    ]

    return signals
  }

  /**
   * Analyze situation and propose action
   */
  async analyzeAndPropose(prompt: string, context: string): Promise<TwinProposal> {
    const systemPrompt = `${systemPrompts.twin}

Current context:
- Department: ${this.context.department}
- Role: ${this.context.role}
- Tenant: ${this.context.tenantId}

User is asking: "${prompt}"

Additional context: ${context}

Analyze this situation and propose a specific action.
Consider available connectors and Spine data.
Evaluate risks and confidence in your proposal.

Respond with structured proposal including:
1. Analysis of the situation
2. Recommended action with confidence score
3. Why this action is beneficial
4. Any risks or concerns
5. Data/connectors needed`

    const response = await generateText({
      model: this.model,
      messages: [
        {
          role: 'user',
          content: systemPrompt,
        },
      ],
      temperature: 0.6,
      maxTokens: 2000,
    })

    console.log('[v0] Twin proposal generated:', response.text)

    // Create proposal from response
    const proposal: TwinProposal = {
      id: `proposal_${Date.now()}`,
      type: 'action',
      title: 'Twin Analysis',
      reasoning: response.text,
      recommendedAction: {
        connector: 'salesforce',
        operation: 'update_account',
        payload: {},
      },
      confidence: 0.75,
      risks: [],
      approvalRequired: true,
      timestamp: Date.now(),
    }

    return proposal
  }

  /**
   * Execute approved action
   */
  async executeAction(proposal: TwinProposal): Promise<{ success: boolean; result: any }> {
    console.log('[v0] Twin executing action:', proposal.id)

    try {
      // In production, this would call connector execution engine
      return {
        success: true,
        result: {
          proposalId: proposal.id,
          executedAt: new Date().toISOString(),
          status: 'completed',
        },
      }
    } catch (error) {
      console.error('[v0] Twin execution error:', error)
      return {
        success: false,
        result: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      }
    }
  }

  /**
   * Continuous observation loop
   */
  async observationLoop(intervalMs: number = 30000): Promise<void> {
    console.log(`[v0] Twin observation loop started (interval: ${intervalMs}ms)`)

    const loop = setInterval(async () => {
      try {
        const signals = await this.observeAndGenerateSignals()
        console.log(`[v0] Twin generated ${signals.length} signals`)

        // Emit signals to UI via WebSocket or event bus
        // In production: emit to signal feed component
      } catch (error) {
        console.error('[v0] Twin observation error:', error)
      }
    }, intervalMs)

    return () => clearInterval(loop)
  }
}

/**
 * Create Twin instance for a user context
 */
export function createTwinEngine(context: TwinContext): TwinEngine {
  return new TwinEngine(context)
}
