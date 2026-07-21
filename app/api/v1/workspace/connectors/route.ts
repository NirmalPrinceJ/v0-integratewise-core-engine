import { NextRequest, NextResponse } from 'next/server'
import { gateway } from '@/lib/integratewise-gateway'

/**
 * GET /api/v1/workspace/connectors
 * List installed connectors
 */
export async function GET(request: NextRequest) {
  try {
    const response = await gateway.listConnectors()

    if (!response.success) {
      return NextResponse.json(
        { error: response.error },
        { status: response.status }
      )
    }

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('[connectors] Error:', error)
    return NextResponse.json(
      { error: 'Failed to list connectors' },
      { status: 500 }
    )
  }
}
