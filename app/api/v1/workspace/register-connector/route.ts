import { NextRequest, NextResponse } from 'next/server'
import { gateway } from '@/lib/integratewise-gateway'

/**
 * POST /api/v1/workspace/register-connector
 * Register a new connector
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.connectorId || !body.name || !body.category) {
      return NextResponse.json(
        { error: 'connectorId, name, and category are required' },
        { status: 400 }
      )
    }

    const response = await gateway.registerConnector(body)

    if (!response.success) {
      return NextResponse.json(
        { error: response.error },
        { status: response.status }
      )
    }

    return NextResponse.json(response.data, { status: 201 })
  } catch (error) {
    console.error('[register-connector] Error:', error)
    return NextResponse.json(
      { error: 'Failed to register connector' },
      { status: 500 }
    )
  }
}
