/** Coda Connector Service
 * Fetches IntegrateWise strategic documentation from Coda workspace
 * Syncs docs, tables, and sections into Spine knowledge base
 */

export interface CodaDoc {
  id: string;
  type: string;
  href: string;
  name: string;
  owner: {
    type: string;
    id: string;
    name?: string;
  };
  createdAt: string;
  updatedAt: string;
  published: boolean;
  workspace: {
    id: string;
    type: string;
    name?: string;
  };
}

export interface CodaDocContent {
  docId: string;
  docName: string;
  sections: CodaSection[];
  tables: CodaTable[];
}

export interface CodaSection {
  id: string;
  name: string;
  level: number;
  parent?: string;
  children: string[];
}

export interface CodaTable {
  id: string;
  name: string;
  columns: CodaColumn[];
  rows: Record<string, any>[];
}

export interface CodaColumn {
  id: string;
  name: string;
  type: string;
}

export interface CodaDocMetadata {
  docId: string;
  docName: string;
  category: string;
  lastSync: string;
  sections: number;
  tables: number;
}

/**
 * CodaConnector - Fetch and sync IntegrateWise documentation
 * Maps key docs: Technical Architecture, Spine Schema, Commercial Bible, etc.
 */
export class CodaConnector {
  private apiToken: string;
  private baseUrl = 'https://coda.io/apis/v1';
  private docMappings: Record<string, string> = {
    'technical-architecture': 'Technical Architecture',
    'spine-schema': 'Spine Schema',
    'commercial-bible': 'IntegrateWise Commercial Bible',
    'launch-checklist': 'Launch checklist',
    'crm': 'CRM',
    'product-roadmap': 'Product roadmap',
    'sales-hub': 'Sales team hub',
    'ai-pack': 'IntegrateWise Canonical AI Pack',
    'atlas-memory': 'IW ATLAS MEMORY',
    'decision-log': 'Decision log',
  };

  constructor(apiToken: string) {
    this.apiToken = apiToken;
  }

  /**
   * List all available docs in the workspace
   */
  async listDocs(workspaceId?: string): Promise<CodaDoc[]> {
    try {
      const params = new URLSearchParams();
      if (workspaceId) params.append('workspaceId', workspaceId);
      params.append('limit', '100');

      const response = await fetch(
        `${this.baseUrl}/docs?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Coda API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('[Coda] Failed to list docs:', error);
      throw error;
    }
  }

  /**
   * Fetch single document content with sections and tables
   */
  async fetchDocContent(docId: string): Promise<CodaDocContent> {
    try {
      // Fetch document metadata
      const docResponse = await fetch(`${this.baseUrl}/docs/${docId}`, {
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
          Accept: 'application/json',
        },
      });

      if (!docResponse.ok) {
        throw new Error(
          `Failed to fetch doc ${docId}: ${docResponse.statusText}`
        );
      }

      const docData = await docResponse.json();

      // Fetch tables within the document
      const tablesResponse = await fetch(
        `${this.baseUrl}/docs/${docId}/tables`,
        {
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            Accept: 'application/json',
          },
        }
      );

      const tables: CodaTable[] = [];
      if (tablesResponse.ok) {
        const tablesData = await tablesResponse.json();
        for (const table of tablesData.items || []) {
          const tableContent = await this.fetchTableContent(docId, table.id);
          tables.push(tableContent);
        }
      }

      return {
        docId,
        docName: docData.name,
        sections: [], // Sections would be parsed from content
        tables,
      };
    } catch (error) {
      console.error(`[Coda] Failed to fetch doc content for ${docId}:`, error);
      throw error;
    }
  }

  /**
   * Fetch table rows
   */
  async fetchTableContent(
    docId: string,
    tableId: string
  ): Promise<CodaTable> {
    try {
      const response = await fetch(
        `${this.baseUrl}/docs/${docId}/tables/${tableId}/rows`,
        {
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch table ${tableId}: ${response.statusText}`);
      }

      const data = await response.json();
      const tableMetadata = await fetch(
        `${this.baseUrl}/docs/${docId}/tables/${tableId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            Accept: 'application/json',
          },
        }
      );

      const metaData = await tableMetadata.json();

      return {
        id: tableId,
        name: metaData.name,
        columns: metaData.columns || [],
        rows: data.items || [],
      };
    } catch (error) {
      console.error(
        `[Coda] Failed to fetch table ${tableId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Search for docs by category keyword
   */
  async searchDocs(query: string): Promise<CodaDoc[]> {
    try {
      const params = new URLSearchParams();
      params.append('query', query);
      params.append('limit', '50');

      const response = await fetch(
        `${this.baseUrl}/docs?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('[Coda] Search failed:', error);
      throw error;
    }
  }

  /**
   * Fetch all strategic docs and prepare for Spine integration
   */
  async syncStrategicDocs(): Promise<Map<string, CodaDocMetadata>> {
    const metadata = new Map<string, CodaDocMetadata>();

    try {
      // Fetch all docs
      const allDocs = await this.listDocs();

      // Filter and sync strategic docs
      for (const [key, docName] of Object.entries(this.docMappings)) {
        const doc = allDocs.find(
          (d) =>
            d.name.toLowerCase().includes(docName.toLowerCase()) ||
            d.name === docName
        );

        if (doc) {
          const content = await this.fetchDocContent(doc.id);
          metadata.set(key, {
            docId: doc.id,
            docName: doc.name,
            category: key,
            lastSync: new Date().toISOString(),
            sections: content.sections.length,
            tables: content.tables.length,
          });
        }
      }

      return metadata;
    } catch (error) {
      console.error('[Coda] Strategic sync failed:', error);
      throw error;
    }
  }

  /**
   * Watch doc changes via Coda webhooks
   * Returns webhook config for real-time sync
   */
  createWebhookConfig(docId: string, targetUrl: string) {
    return {
      event: 'document.updated',
      documentId: docId,
      targetUrl,
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
    };
  }
}

/**
 * Create Coda connector instance
 */
export function createCodaConnector(apiToken: string): CodaConnector {
  if (!apiToken) {
    throw new Error(
      'CODA_API_TOKEN environment variable is required'
    );
  }
  return new CodaConnector(apiToken);
}

/**
 * Default strategic doc categories
 */
export const STRATEGIC_DOC_CATEGORIES = {
  TECHNICAL: 'technical-architecture',
  SPINE: 'spine-schema',
  COMMERCIAL: 'commercial-bible',
  OPERATIONS: 'launch-checklist',
  CRM: 'crm',
  ROADMAP: 'product-roadmap',
  SALES: 'sales-hub',
  AI: 'ai-pack',
  MEMORY: 'atlas-memory',
  DECISIONS: 'decision-log',
} as const;
