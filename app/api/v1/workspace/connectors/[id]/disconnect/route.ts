import { NextRequest, NextResponse } from 'next/server'
import { gateway } from '@/lib/integratewise-gateway'

/**
 * POST /api/v1/workspace/connectors/:id/disconnect
 * Disconnect a connector
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Connector ID is required' },
        { status: 400 }
      )
    }

    const response = await gateway.disconnectConnector(id)

    if (!response.success) {
      return NextResponse.json(
        { error: response.error },
        { status: response.status }
      )
    }

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('[disconnect] Error:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect connector' },
      { status: 500 }
    )
  }
}
