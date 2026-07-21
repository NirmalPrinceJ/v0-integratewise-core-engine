/**
 * Coda Template Analyzer
 * Fetches and analyzes all templates in your Coda workspace
 * Maps templates to company operations, departments, and capabilities
 * Note: This module uses native fetch available in Node.js 18+
 */

interface CodaDoc {
  id: string;
  name: string;
  href: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface CodaTable {
  id: string;
  name: string;
  parentId: string;
  href: string;
}

interface CodaRow {
  id: string;
  name: string;
  values: Record<string, unknown>;
}

interface TemplateAnalysis {
  docId: string;
  docName: string;
  purpose: string;
  departments: string[];
  capabilities: string[];
  tables: TemplateTable[];
  workbenchAlignment: string[];
  requiredData: string[];
  outputMetrics: string[];
  automationPotential: 'high' | 'medium' | 'low';
  keyInsights: string[];
}

interface TemplateTable {
  id: string;
  name: string;
  columnCount: number;
  estimatedRowCount: number;
  dataTypes: string[];
  keyColumns: string[];
}

class CodaTemplateAnalyzer {
  private apiToken: string;
  private workspaceId: string;
  private baseUrl = 'https://coda.io/apis/v1';

  constructor(apiToken: string, workspaceId: string) {
    this.apiToken = apiToken;
    this.workspaceId = workspaceId;
  }

  /**
   * Fetch all documents from workspace
   */
  async fetchAllDocuments(): Promise<CodaDoc[]> {
    try {
      const response = await fetch(`${this.baseUrl}/docs`, {
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Coda API error: ${response.statusText}`);
      }

      const data = await response.json() as { items: CodaDoc[] };
      return data.items || [];
    } catch (error) {
      console.error('[v0] Error fetching Coda documents:', error);
      throw error;
    }
  }

  /**
   * Fetch tables from a specific document
   */
  async fetchDocumentTables(docId: string): Promise<CodaTable[]> {
    try {
      const response = await fetch(`${this.baseUrl}/docs/${docId}/tables`, {
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Coda API error: ${response.statusText}`);
      }

      const data = await response.json() as { items: CodaTable[] };
      return data.items || [];
    } catch (error) {
      console.error('[v0] Error fetching tables for doc:', docId, error);
      return [];
    }
  }

  /**
   * Fetch rows from a specific table with metadata
   */
  async fetchTableRows(docId: string, tableId: string, limit = 10): Promise<{ rows: CodaRow[]; totalCount: number }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/docs/${docId}/tables/${tableId}/rows?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Coda API error: ${response.statusText}`);
      }

      const data = await response.json() as { items: CodaRow[]; totalCount: number };
      return {
        rows: data.items || [],
        totalCount: data.totalCount || 0,
      };
    } catch (error) {
      console.error('[v0] Error fetching table rows:', error);
      return { rows: [], totalCount: 0 };
    }
  }

  /**
   * Analyze a template document
   */
  async analyzeTemplate(docId: string, docName: string): Promise<TemplateAnalysis> {
    const tables = await this.fetchDocumentTables(docId);

    const templateTables: TemplateTable[] = [];
    for (const table of tables) {
      const { rows, totalCount } = await this.fetchTableRows(docId, table.id);
      const columns = rows.length > 0 ? Object.keys(rows[0].values) : [];

      templateTables.push({
        id: table.id,
        name: table.name,
        columnCount: columns.length,
        estimatedRowCount: totalCount,
        dataTypes: this.inferDataTypes(rows),
        keyColumns: columns.slice(0, 5),
      });
    }

    return {
      docId,
      docName,
      purpose: this.inferTemplatePurpose(docName, tables),
      departments: this.mapToDepartments(docName, tables),
      capabilities: this.mapToCapabilities(docName, tables),
      tables: templateTables,
      workbenchAlignment: this.alignToWorkbenches(docName, tables),
      requiredData: this.identifyRequiredData(tables),
      outputMetrics: this.identifyMetrics(docName, tables),
      automationPotential: this.assessAutomationPotential(docName, tables),
      keyInsights: this.extractKeyInsights(docName, tables),
    };
  }

  /**
   * Infer data types from rows
   */
  private inferDataTypes(rows: CodaRow[]): string[] {
    const types = new Set<string>();

    rows.forEach((row) => {
      Object.values(row.values).forEach((value) => {
        if (typeof value === 'string') types.add('text');
        else if (typeof value === 'number') types.add('number');
        else if (typeof value === 'boolean') types.add('boolean');
        else if (Array.isArray(value)) types.add('array');
        else if (value && typeof value === 'object') types.add('object');
      });
    });

    return Array.from(types);
  }

  /**
   * Infer template purpose from name and structure
   */
  private inferTemplatePurpose(docName: string, tables: CodaTable[]): string {
    const lowerName = docName.toLowerCase();

    if (lowerName.includes('deal') || lowerName.includes('pipeline'))
      return 'Sales pipeline and deal tracking';
    if (lowerName.includes('customer') || lowerName.includes('account'))
      return 'Customer/account management and health tracking';
    if (lowerName.includes('project') || lowerName.includes('task'))
      return 'Project and task management';
    if (lowerName.includes('marketing') || lowerName.includes('campaign'))
      return 'Marketing campaign management';
    if (lowerName.includes('finance') || lowerName.includes('budget'))
      return 'Financial planning and budget tracking';
    if (lowerName.includes('hr') || lowerName.includes('team'))
      return 'HR and team management';
    if (lowerName.includes('inventory') || lowerName.includes('product'))
      return 'Product and inventory management';
    if (lowerName.includes('meeting') || lowerName.includes('standup'))
      return 'Meeting and team coordination';

    return `Operational template with ${tables.length} data tables`;
  }

  /**
   * Map template to departments
   */
  private mapToDepartments(docName: string, tables: CodaTable[]): string[] {
    const departments: string[] = [];
    const lowerName = docName.toLowerCase();

    if (lowerName.includes('deal') || lowerName.includes('pipeline') || lowerName.includes('sales'))
      departments.push('Sales');
    if (lowerName.includes('customer') || lowerName.includes('account') || lowerName.includes('health'))
      departments.push('Customer Success');
    if (lowerName.includes('marketing') || lowerName.includes('campaign') || lowerName.includes('content'))
      departments.push('Marketing');
    if (lowerName.includes('finance') || lowerName.includes('budget') || lowerName.includes('expense'))
      departments.push('Finance');
    if (lowerName.includes('project') || lowerName.includes('task') || lowerName.includes('engineering'))
      departments.push('Engineering');
    if (lowerName.includes('operations') || lowerName.includes('ops'))
      departments.push('Operations');
    if (lowerName.includes('hr') || lowerName.includes('team') || lowerName.includes('people'))
      departments.push('People');

    return departments.length > 0 ? departments : ['Operations'];
  }

  /**
   * Map template to capabilities
   */
  private mapToCapabilities(docName: string, tables: CodaTable[]): string[] {
    const capabilities: string[] = [];
    const lowerName = docName.toLowerCase();
    const tableNames = tables.map((t) => t.name.toLowerCase()).join(' ');

    if (lowerName.includes('deal') || tableNames.includes('deal'))
      capabilities.push('Sell Deal');
    if (lowerName.includes('health') || lowerName.includes('monitor'))
      capabilities.push('Monitor Health');
    if (lowerName.includes('forecast') || tableNames.includes('forecast'))
      capabilities.push('Forecast Revenue');
    if (lowerName.includes('campaign') || tableNames.includes('campaign'))
      capabilities.push('Launch Campaign');
    if (lowerName.includes('budget') || tableNames.includes('budget'))
      capabilities.push('Manage Budget');
    if (lowerName.includes('risk') || tableNames.includes('risk'))
      capabilities.push('Assess Risk');
    if (lowerName.includes('schedule') || tableNames.includes('schedule'))
      capabilities.push('Schedule Activity');

    return capabilities.length > 0 ? capabilities : ['Data Management'];
  }

  /**
   * Align to workbenches
   */
  private alignToWorkbenches(docName: string, tables: CodaTable[]): string[] {
    const lowerName = docName.toLowerCase();

    const alignments: string[] = [];
    if (lowerName.includes('deal') || lowerName.includes('pipeline')) alignments.push('Sales Workbench');
    if (lowerName.includes('customer') || lowerName.includes('health')) alignments.push('CSM Workbench');
    if (lowerName.includes('campaign') || lowerName.includes('marketing'))
      alignments.push('Marketing Workbench');
    if (lowerName.includes('budget') || lowerName.includes('finance')) alignments.push('Finance Workbench');
    if (lowerName.includes('operations') || lowerName.includes('ops')) alignments.push('Operations Workbench');

    return alignments.length > 0 ? alignments : [];
  }

  /**
   * Identify required input data
   */
  private identifyRequiredData(tables: CodaTable[]): string[] {
    const requiredData: string[] = [];

    tables.forEach((table) => {
      if (table.name.toLowerCase().includes('input') || table.name.toLowerCase().includes('source')) {
        requiredData.push(`${table.name} (${table.name})`);
      }
    });

    return requiredData;
  }

  /**
   * Identify output metrics
   */
  private identifyMetrics(docName: string, tables: CodaTable[]): string[] {
    const metrics: string[] = [];
    const allNames = [docName.toLowerCase(), ...tables.map((t) => t.name.toLowerCase())].join(' ');

    if (allNames.includes('revenue') || allNames.includes('arpu'))
      metrics.push('Revenue', 'ARPU', 'MRR');
    if (allNames.includes('churn') || allNames.includes('retention'))
      metrics.push('Churn Rate', 'Retention Rate', 'NRR');
    if (allNames.includes('pipeline') || allNames.includes('deal'))
      metrics.push('Pipeline Value', 'Deal Count', 'Win Rate');
    if (allNames.includes('campaign') || allNames.includes('marketing'))
      metrics.push('Campaign Performance', 'Conversion Rate', 'CAC');
    if (allNames.includes('budget') || allNames.includes('spend'))
      metrics.push('Budget Utilization', 'Variance', 'Forecast');

    return metrics;
  }

  /**
   * Assess automation potential
   */
  private assessAutomationPotential(
    docName: string,
    tables: CodaTable[]
  ): 'high' | 'medium' | 'low' {
    const lowerName = docName.toLowerCase();
    const tableCount = tables.length;

    if (
      lowerName.includes('deal') ||
      lowerName.includes('pipeline') ||
      lowerName.includes('forecast')
    ) {
      return 'high';
    }

    if (tableCount > 5) return 'high';
    if (tableCount > 2) return 'medium';
    return 'low';
  }

  /**
   * Extract key insights
   */
  private extractKeyInsights(docName: string, tables: CodaTable[]): string[] {
    const insights: string[] = [];

    if (tables.length > 1) {
      insights.push(`Multi-table template with ${tables.length} interconnected data sources`);
    }

    const totalRows = tables.reduce((sum, t) => sum + (t as any).estimatedRowCount || 0, 0);
    if (totalRows > 100) {
      insights.push(`High-volume data template (${totalRows}+ records)`);
    }

    const highAutomation = this.assessAutomationPotential(docName, tables) === 'high';
    if (highAutomation) {
      insights.push('Strong automation potential - suitable for AI Twin delegation');
    }

    insights.push(`Ready for integration with Spine knowledge base`);

    return insights;
  }

  /**
   * Analyze all templates in workspace
   */
  async analyzeAllTemplates(): Promise<TemplateAnalysis[]> {
    const docs = await this.fetchAllDocuments();
    const analyses: TemplateAnalysis[] = [];

    for (const doc of docs) {
      try {
        const analysis = await this.analyzeTemplate(doc.id, doc.name);
        analyses.push(analysis);
      } catch (error) {
        console.error(`[v0] Failed to analyze template ${doc.name}:`, error);
      }
    }

    return analyses;
  }

  /**
   * Generate comprehensive analysis report
   */
  async generateComprehensiveReport(): Promise<{
    totalTemplates: number;
    departmentCoverage: Record<string, number>;
    capabilityCoverage: Record<string, number>;
    automationOpportunities: TemplateAnalysis[];
    templatesByDepartment: Record<string, TemplateAnalysis[]>;
    integrationPriority: TemplateAnalysis[];
  }> {
    const analyses = await this.analyzeAllTemplates();

    const departmentCoverage: Record<string, number> = {};
    const capabilityCoverage: Record<string, number> = {};
    const templatesByDepartment: Record<string, TemplateAnalysis[]> = {};

    analyses.forEach((analysis) => {
      analysis.departments.forEach((dept) => {
        departmentCoverage[dept] = (departmentCoverage[dept] || 0) + 1;
        if (!templatesByDepartment[dept]) templatesByDepartment[dept] = [];
        templatesByDepartment[dept].push(analysis);
      });

      analysis.capabilities.forEach((cap) => {
        capabilityCoverage[cap] = (capabilityCoverage[cap] || 0) + 1;
      });
    });

    const automationOpportunities = analyses
      .filter((a) => a.automationPotential === 'high')
      .sort((a, b) => b.tables.length - a.tables.length);

    const integrationPriority = analyses.sort(
      (a, b) =>
        b.tables.reduce((sum, t) => sum + t.estimatedRowCount, 0) -
        a.tables.reduce((sum, t) => sum + t.estimatedRowCount, 0)
    );

    return {
      totalTemplates: analyses.length,
      departmentCoverage,
      capabilityCoverage,
      automationOpportunities,
      templatesByDepartment,
      integrationPriority: integrationPriority.slice(0, 5),
    };
  }
}

export { CodaTemplateAnalyzer, TemplateAnalysis };
