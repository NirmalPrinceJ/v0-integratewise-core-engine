'use client'

import { useCallback, useState } from 'react'
import useSWR from 'swr'
import type { TwinProposal, TwinSignal } from '@/lib/ai/twin/engine'

/**
 * Hook to analyze a situation with the Twin
 */
export function useTwinAnalysis() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyze = useCallback(async (prompt: string, context: string): Promise<TwinProposal | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/twin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze',
          prompt,
          context,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze with Twin')
      }

      const data = await response.json()
      return data.proposal
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { analyze, isLoading, error }
}

/**
 * Hook to execute a Twin proposal
 */
export function useTwinExecute() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (proposal: TwinProposal): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/twin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'execute',
          proposal,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to execute Twin proposal')
      }

      const data = await response.json()
      return data.success
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { execute, isLoading, error }
}

/**
 * Hook to get Twin signals
 */
export function useTwinSignals() {
  const { data: signals = [], isLoading, error, mutate } = useSWR<TwinSignal[]>(
    '/api/twin?action=signals',
    async (url) => {
      const response = await fetch('/api/twin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signals' }),
      })

      if (!response.ok) throw new Error('Failed to fetch signals')

      const data = await response.json()
      return data.signals || []
    },
    { revalidateOnFocus: false, refreshInterval: 30000 }
  )

  return { signals, isLoading, error, refresh: mutate }
}
