'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { gatewayClient, type WorkspaceProjection, type ConnectorStatus } from '@/lib/platform/gateway-client'

export function useWorkspaceProjection(department: string) {
  const { data, error, isLoading, mutate } = useSWR(
    department ? `/gateway/workspace/${department}` : null,
    async () => gatewayClient.getWorkspaceProjection(department),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  )

  return {
    projection: data as WorkspaceProjection | undefined,
    isLoading,
    error,
    refresh: mutate,
  }
}

export function useConnectors() {
  const { data, error, isLoading, mutate } = useSWR(
    '/gateway/connectors',
    async () => gatewayClient.getConnectorsCatalog(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  return {
    connectors: (data as ConnectorStatus[]) || [],
    isLoading,
    error,
    refresh: mutate,
  }
}

export function useSpineTimeline(limit: number = 50) {
  const { data, error, isLoading, mutate } = useSWR(
    `/gateway/spine/timeline?limit=${limit}`,
    async () => gatewayClient.getSpineTimeline(limit),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  )

  return {
    timeline: data || [],
    isLoading,
    error,
    refresh: mutate,
  }
}

export function useTwin() {
  const [asking, setAsking] = useState(false)
  const [assigning, setAssigning] = useState(false)

  return {
    askTwin: async (query: string, context: Record<string, any>) => {
      setAsking(true)
      try {
        return await gatewayClient.askTwin(query, context)
      } finally {
        setAsking(false)
      }
    },
    assignTwin: async (objective: string, context: Record<string, any>, constraints?: string[]) => {
      setAssigning(true)
      try {
        return await gatewayClient.assignTwin({ objective, constraints, context })
      } finally {
        setAssigning(false)
      }
    },
    approveTwinProposal: async (proposalId: string, approved: boolean) => {
      return await gatewayClient.approveTwinProposal(proposalId, approved)
    },
    asking,
    assigning,
  }
}

export function useCapabilities(department: string) {
  const { data, error, isLoading } = useSWR(
    department ? `/gateway/capabilities/${department}` : null,
    async () => gatewayClient.getCapabilities(department),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  return {
    capabilities: data || [],
    isLoading,
    error,
  }
}

export function useSpineStore() {
  const [storing, setStoring] = useState(false)

  return {
    recordObservation: async (data: {
      entityType: string
      entityId: string
      category: 'observation' | 'decision' | 'insight' | 'evidence' | 'note'
      title: string
      description: string
    }) => {
      setStoring(true)
      try {
        return await gatewayClient.recordObservation(data)
      } finally {
        setStoring(false)
      }
    },
    storing,
  }
}
