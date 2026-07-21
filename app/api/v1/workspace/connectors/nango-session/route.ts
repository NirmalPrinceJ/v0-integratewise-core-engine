import { NextRequest, NextResponse } from 'next/server'
import { gateway } from '@/lib/integratewise-gateway'

/**
 * POST /api/v1/workspace/connectors/nango-session
 * Create sync session for connector authentication
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.connectorId) {
      return NextResponse.json(
        { error: 'connectorId is required' },
        { status: 400 }
      )
    }

    const response = await gateway.createNangoSession(body)

    if (!response.success) {
      return NextResponse.json(
        { error: response.error },
        { status: response.status }
      )
    }

    return NextResponse.json(response.data, { status: 201 })
  } catch (error) {
    console.error('[nango-session] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create Nango session' },
      { status: 500 }
    )
  }
}
