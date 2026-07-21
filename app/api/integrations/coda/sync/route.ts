import { NextRequest, NextResponse } from 'next/server';
import { createCodaConnector, STRATEGIC_DOC_CATEGORIES } from '@/lib/connectors/coda-connector';

/**
 * POST /api/integrations/coda/sync
 * Syncs IntegrateWise strategic documentation from Coda into Spine
 */
export async function POST(request: NextRequest) {
  try {
    const codaToken = process.env.CODA_API_TOKEN;

    if (!codaToken) {
      return NextResponse.json(
        { error: 'CODA_API_TOKEN not configured' },
        { status: 400 }
      );
    }

    const connector = createCodaConnector(codaToken);

    // Fetch strategic docs
    const docs = await connector.listDocs();
    const metadata = await connector.syncStrategicDocs();

    // Map to Spine entities
    const spineSync = {
      timestamp: new Date().toISOString(),
      docsProcessed: docs.length,
      strategicDocsSynced: metadata.size,
      categories: Array.from(metadata.entries()).map(([key, meta]) => ({
        category: key,
        docName: meta.docName,
        docId: meta.docId,
        sections: meta.sections,
        tables: meta.tables,
        lastSync: meta.lastSync,
      })),
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Coda documentation synced to Spine',
        data: spineSync,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Coda Sync] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to sync Coda documentation',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/integrations/coda/sync?category=technical-architecture
 * Fetch specific strategic doc by category
 */
export async function GET(request: NextRequest) {
  try {
    const codaToken = process.env.CODA_API_TOKEN;
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (!codaToken) {
      return NextResponse.json(
        { error: 'CODA_API_TOKEN not configured' },
        { status: 400 }
      );
    }

    const connector = createCodaConnector(codaToken);

    if (category) {
      // Fetch specific doc by category
      const docs = await connector.listDocs();
      const categoryMap = {
        'technical-architecture': 'Technical Architecture',
        'spine-schema': 'Spine Schema',
        'commercial-bible': 'IntegrateWise Commercial Bible',
        'launch-checklist': 'Launch checklist',
        crm: 'CRM',
        'product-roadmap': 'Product roadmap',
        'sales-hub': 'Sales team hub',
      };

      const docName = categoryMap[category as keyof typeof categoryMap];
      const doc = docs.find((d) => d.name.includes(docName));

      if (!doc) {
        return NextResponse.json(
          { error: `Doc category '${category}' not found` },
          { status: 404 }
        );
      }

      const content = await connector.fetchDocContent(doc.id);

      return NextResponse.json(
        {
          success: true,
          category,
          doc: {
            id: doc.id,
            name: doc.name,
            content,
            updatedAt: doc.updatedAt,
          },
        },
        { status: 200 }
      );
    }

    // List all available categories
    const allDocs = await connector.listDocs();

    return NextResponse.json(
      {
        success: true,
        totalDocs: allDocs.length,
        availableCategories: Object.keys(STRATEGIC_DOC_CATEGORIES),
        docs: allDocs.map((d) => ({
          id: d.id,
          name: d.name,
          published: d.published,
          updatedAt: d.updatedAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Coda Fetch] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch Coda documentation',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
