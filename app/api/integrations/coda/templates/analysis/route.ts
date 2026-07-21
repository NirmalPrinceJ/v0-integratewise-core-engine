import { NextRequest, NextResponse } from 'next/server';
import {
  analyzeAllTemplates,
  getTemplatesByDomain,
  getOperationalNeeds,
  getCriticalDataFlows,
  getTemplateCapabilities,
} from '@/lib/connectors/coda-advanced-analyzer';

/**
 * GET /api/integrations/coda/templates/analysis
 *
 * Returns comprehensive analysis of all Coda templates mapped to operational needs
 * Query params:
 *   - domain: Filter by domain (e.g., 'Sales & Marketing')
 *   - include: 'capabilities' | 'dataflows' | 'all' (default: all)
 */
export async function GET(request: NextRequest) {
  try {
    const token = process.env.CODA_API_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: 'CODA_API_TOKEN not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');
    const include = searchParams.get('include') || 'all';

    // Run full analysis
    const analysis = await analyzeAllTemplates(token);

    // Filter by domain if specified
    if (domain) {
      const templates = getTemplatesByDomain(analysis, domain);
      const operationalNeeds = getOperationalNeeds(analysis, domain);

      return NextResponse.json({
        domain,
        templateCount: templates.length,
        templates,
        operationalNeeds,
        capabilities: templates.flatMap(t => getTemplateCapabilities(t)),
        ...(include === 'dataflows' || include === 'all' ? {
          dataFlows: getCriticalDataFlows(analysis),
        } : {}),
      });
    }

    // Return full analysis
    const response: any = {
      summary: {
        totalTemplates: analysis.templates.length,
        domains: Object.keys(analysis.domains),
        domainCount: Object.keys(analysis.domains).length,
      },
      domains: Object.entries(analysis.domains).map(([domain, templates]) => ({
        domain,
        templateCount: templates.length,
        templates: templates.map(t => ({
          name: t.name,
          purpose: t.purpose,
          operationalNeeds: t.operationalNeeds,
          integrationPoints: t.integrationPoints,
          frequency: t.frequency,
        })),
        operationalNeeds: getOperationalNeeds(analysis, domain),
      })),
      operationalMatrix: analysis.operationalMatrix,
      integrationMap: analysis.integrationMap,
    };

    if (include === 'dataflows' || include === 'all') {
      response.dataFlows = getCriticalDataFlows(analysis);
      response.criticalPaths = getCriticalDataFlows(analysis).map(df => `${df.from} → ${df.to}`);
    }

    if (include === 'capabilities' || include === 'all') {
      response.capabilities = analysis.templates
        .flatMap(t => getTemplateCapabilities(t))
        .filter((v, i, a) => a.indexOf(v) === i); // unique
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('[v0] Template analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze templates' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/integrations/coda/templates/analysis
 *
 * Trigger re-analysis of all templates and store in cache
 */
export async function POST(request: NextRequest) {
  try {
    const token = process.env.CODA_API_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: 'CODA_API_TOKEN not configured' },
        { status: 500 }
      );
    }

    console.log('[v0] Starting template analysis');
    const analysis = await analyzeAllTemplates(token);

    return NextResponse.json({
      status: 'analysis_complete',
      timestamp: new Date().toISOString(),
      summary: {
        totalTemplates: analysis.templates.length,
        domainCount: Object.keys(analysis.domains).length,
        dataFlows: analysis.dataFlows.length,
        criticalFlows: analysis.dataFlows.filter(f => f.criticalPath).length,
      },
      analysis,
    });
  } catch (error) {
    console.error('[v0] Template analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to run analysis' },
      { status: 500 }
    );
  }
}
