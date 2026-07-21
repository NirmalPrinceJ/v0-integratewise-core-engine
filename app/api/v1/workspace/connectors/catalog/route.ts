import { NextRequest, NextResponse } from 'next/server'
import { gateway } from '@/lib/integratewise-gateway'

/**
 * GET /api/v1/workspace/connectors/catalog
 * Full catalog (100+)
 * Returns: id, name, category, flowType, connectionMethod, status, capabilities, departments, industries, mcpTools, supportedEntities, authType
 */
export async function GET(request: NextRequest) {
  try {
    const response = await gateway.getCatalog()

    if (!response.success) {
      return NextResponse.json(
        { error: response.error },
        { status: response.status }
      )
    }

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('[catalog] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch catalog' },
      { status: 500 }
    )
  }
}
