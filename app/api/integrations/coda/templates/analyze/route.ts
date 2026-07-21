import { NextRequest, NextResponse } from 'next/server';
import { CodaTemplateAnalyzer } from '@/lib/connectors/coda-template-analyzer';

/**
 * API Route: Analyze all Coda templates
 * GET /api/integrations/coda/templates/analyze
 * 
 * Returns comprehensive analysis of all templates in the workspace
 * showing how each template aligns with company operations and capabilities
 */

export async function GET(request: NextRequest) {
  try {
    const apiToken = process.env.CODA_API_TOKEN;
    const workspaceId = process.env.CODA_WORKSPACE_ID;

    if (!apiToken || !workspaceId) {
      return NextResponse.json(
        {
          error: 'Missing Coda credentials. Set CODA_API_TOKEN and CODA_WORKSPACE_ID in environment variables.',
        },
        { status: 400 }
      );
    }

    const analyzer = new CodaTemplateAnalyzer(apiToken, workspaceId);

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const reportType = searchParams.get('report') || 'comprehensive';

    if (reportType === 'comprehensive') {
      const report = await analyzer.generateComprehensiveReport();
      return NextResponse.json(report);
    }

    if (reportType === 'all-templates') {
      const analyses = await analyzer.analyzeAllTemplates();
      return NextResponse.json({
        totalTemplates: analyses.length,
        templates: analyses,
      });
    }

    if (reportType === 'departments') {
      const report = await analyzer.generateComprehensiveReport();
      return NextResponse.json({
        totalTemplates: report.totalTemplates,
        departmentCoverage: report.departmentCoverage,
        templatesByDepartment: report.templatesByDepartment,
      });
    }

    if (reportType === 'automation') {
      const report = await analyzer.generateComprehensiveReport();
      return NextResponse.json({
        automationOpportunities: report.automationOpportunities,
        priorityForIntegration: report.integrationPriority,
      });
    }

    return NextResponse.json(
      { error: 'Invalid report type. Use: comprehensive, all-templates, departments, or automation' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[v0] Template analysis error:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze templates',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
