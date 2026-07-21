'use client'

import { useState, useCallback } from 'react'
import { CapabilityEngine, ContextBuilder, CapabilityFabricExecutor, createDefaultRegistry } from '@/lib/core'
import type { CapabilityDefinition, CapabilityInvocation, ExecutionPath } from '@/lib/core'

/**
 * Hook for OODA button handlers
 * Manages capability invocation, context assembly, and execution
 */
export function useOODAHandlers(
  userId: string,
  userRole: string,
  capabilityId?: string
) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastInvocation, setLastInvocation] = useState<CapabilityInvocation | null>(null)

  // Initialize core systems
  const registry = createDefaultRegistry()
  const engine = new CapabilityEngine({
    ai_model: 'gpt-4',
    ai_endpoint: 'https://api.openai.com/v1',
    enable_human_review: true,
    ai_confidence_threshold: 0.85,
    retry_attempts: 3,
    timeout_ms: 30000,
  })
  const contextBuilder = new ContextBuilder()
  const fabricExecutor = new CapabilityFabricExecutor()

  /**
   * Handler: Store in Spine (Observe)
   */
  const handleStoreInSpine = useCallback(
    async (data: { type: string; title: string; content: string; tags?: string[] }) => {
      setIsLoading(true)
      setError(null)

      try {
        console.log('[OODA] Observe: Storing in Spine', data)

        // Simulate storing to Spine
        const spineEntry = {
          id: `spine_${Date.now()}`,
          entity_type: 'MemoryEntry',
          data: {
            type: data.type,
            title: data.title,
            content: data.content,
            tags: data.tags || [],
            created_at: new Date().toISOString(),
            created_by: userId,
          },
        }

        console.log('[OODA] Spine entry created:', spineEntry)

        // Trigger success notification
        if (typeof window !== 'undefined') {
          const event = new CustomEvent('ooda-action', {
            detail: { action: 'store_in_spine', success: true, data: spineEntry },
          })
          window.dispatchEvent(event)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to store in Spine'
        setError(message)
        console.error('[OODA] Error storing in Spine:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [userId]
  )

  /**
   * Handler: Ask Your Twin (Orient)
   */
  const handleAskTwin = useCallback(
    async (question: string): Promise<string> => {
      setIsLoading(true)
      setError(null)

      try {
        console.log('[OODA] Orient: Asking Twin', question)

        // Get current capability for context
        const capability = capabilityId ? registry.getCapability(capabilityId) : null

        if (!capability) {
          throw new Error('Capability not found')
        }

        // Assemble context
        const context = await contextBuilder.build(
          capability.id,
          `exec_${Date.now()}`,
          userId,
          userRole,
          {},
          capability
        )

        console.log('[OODA] Context assembled:', context.ai_context.summary)

        // Simulate Twin response
        const response = `Based on your question "${question}" and the current context, here's my analysis:\n\n` +
          `Current Entity: ${Object.keys(context.entities)[0] || 'primary entity'}\n` +
          `Engagement Signal: ${context.signals.engagement?.score || 0}/100\n` +
          `Historical Success Rate: ${(context.history.success_rate * 100).toFixed(0)}%\n\n` +
          `Recommendation: Based on available signals and historical performance, I suggest proceeding with caution while monitoring engagement metrics.`

        console.log('[OODA] Twin response generated')

        // Trigger success notification
        if (typeof window !== 'undefined') {
          const event = new CustomEvent('ooda-action', {
            detail: { action: 'ask_twin', success: true, response },
          })
          window.dispatchEvent(event)
        }

        return response
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to get Twin response'
        setError(message)
        console.error('[OODA] Error asking Twin:', err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [userId, userRole, capabilityId, registry, contextBuilder]
  )

  /**
   * Handler: Assign Your Twin (Decide)
   */
  const handleAssignTwin = useCallback(
    async (objective: string) => {
      setIsLoading(true)
      setError(null)

      try {
        console.log('[OODA] Decide: Assigning Twin', objective)

        // Get capability
        const capability = capabilityId ? registry.getCapability(capabilityId) : null

        if (!capability) {
          throw new Error('Capability not found')
        }

        // Validate user can invoke
        if (!registry.canInvoke(capability.id, userId, userRole)) {
          throw new Error('You do not have permission to invoke this capability')
        }

        // Assemble context
        const context = await contextBuilder.build(
          capability.id,
          `exec_${Date.now()}`,
          userId,
          userRole,
          {},
          capability
        )

        // Create invocation
        const invocation: CapabilityInvocation = {
          id: `inv_${Date.now()}`,
          capability_id: capability.id,
          invoked_by: userId,
          invoked_at: new Date(),
          state: 'pending' as any,
          step_results: {},
        }

        console.log('[OODA] Invocation created:', invocation.id)

        // Build execution plan
        const executionPlan = fabricExecutor.buildExecutionPlan(capability)
        console.log('[OODA] Execution plan built with', executionPlan.length, 'paths')

        // Execute capability
        const result = await engine.execute(invocation, capability, context)

        setLastInvocation(result)
        console.log('[OODA] Capability execution completed:', result.state)

        // Trigger success notification
        if (typeof window !== 'undefined') {
          const event = new CustomEvent('ooda-action', {
            detail: {
              action: 'assign_twin',
              success: result.state === 'completed',
              invocation: result,
            },
          })
          window.dispatchEvent(event)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to assign Twin'
        setError(message)
        console.error('[OODA] Error assigning Twin:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [userId, userRole, capabilityId, registry, contextBuilder, engine, fabricExecutor]
  )

  /**
   * Handler: Approve Action (Act)
   */
  const handleApproveAction = useCallback(
    async (actionId: string, approved: boolean) => {
      setIsLoading(true)
      setError(null)

      try {
        console.log('[OODA] Act: Approving action', actionId, 'approved:', approved)

        if (!lastInvocation) {
          throw new Error('No pending invocation')
        }

        if (approved) {
          // Approve the pending step
          const stepId = lastInvocation.current_step
          if (stepId) {
            engine.approvePendingStep(lastInvocation.id, stepId, userId)
            console.log('[OODA] Step approved:', stepId)
          }
        }

        // Trigger success notification
        if (typeof window !== 'undefined') {
          const event = new CustomEvent('ooda-action', {
            detail: {
              action: 'approve_action',
              success: true,
              approved,
              actionId,
            },
          })
          window.dispatchEvent(event)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to approve action'
        setError(message)
        console.error('[OODA] Error approving action:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [userId, lastInvocation, engine]
  )

  return {
    isLoading,
    error,
    lastInvocation,
    handlers: {
      onStoreInSpine: handleStoreInSpine,
      onAskTwin: handleAskTwin,
      onAssignTwin: handleAssignTwin,
      onApproveAction: handleApproveAction,
    },
  }
}

export default useOODAHandlers
