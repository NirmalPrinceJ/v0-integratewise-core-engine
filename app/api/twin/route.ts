/**
 * Twin API Route
 * POST /api/twin/analyze - Get Twin analysis on a situation
 * POST /api/twin/propose - Get Twin proposal for an action
 * POST /api/twin/execute - Execute approved proposal
 */

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createTwinEngine } from '@/lib/ai/twin/engine'
import type { TwinContext } from '@/lib/ai/twin/engine'

async function getTwinContext(userId: string): Promise<TwinContext> {
  // In production, fetch from Supabase
  return {
    tenantId: `tenant_${userId}`,
    userId,
    department: 'sales',
    role: 'account_executive',
    workspaceContext: 'Q4 planning',
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, prompt, context, proposal } = await request.json()

    const twinContext = await getTwinContext(userId)
    const twin = createTwinEngine(twinContext)

    if (action === 'analyze') {
      const analysis = await twin.analyzeAndPropose(prompt, context)
      return NextResponse.json({
        success: true,
        proposal: analysis,
      })
    }

    if (action === 'execute') {
      const result = await twin.executeAction(proposal)
      return NextResponse.json({
        success: result.success,
        result: result.result,
      })
    }

    if (action === 'signals') {
      const signals = await twin.observeAndGenerateSignals()
      return NextResponse.json({
        success: true,
        signals,
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('[v0] Twin API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
