'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Zap, Database, Users, TrendingUp, Clock } from 'lucide-react';

interface TemplateAnalysis {
  summary: {
    totalTemplates: number;
    domains: string[];
    domainCount: number;
  };
  domains: DomainGroup[];
  operationalMatrix: Record<string, string[]>;
  integrationMap: Record<string, string[]>;
  dataFlows: DataFlow[];
  criticalPaths: string[];
  capabilities: string[];
}

interface DomainGroup {
  domain: string;
  templateCount: number;
  templates: TemplateInfo[];
  operationalNeeds: string[];
}

interface TemplateInfo {
  name: string;
  purpose: string;
  operationalNeeds: string[];
  integrationPoints: string[];
  frequency: string;
}

interface DataFlow {
  from: string;
  to: string;
  frequency: string;
  dataType: string;
  criticalPath: boolean;
}

export function TemplateAnalysisDashboard() {
  const [analysis, setAnalysis] = useState<TemplateAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        '/api/integrations/coda/templates/analysis?include=all'
      );
      if (!response.ok) throw new Error('Failed to fetch analysis');

      const data = await response.json();
      setAnalysis(data);
      if (data.domains.length > 0) {
        setSelectedDomain(data.domains[0].domain);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('[v0] Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Analyzing Coda templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Error Loading Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            onClick={fetchAnalysis}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return null;
  }

  const currentDomain = analysis.domains.find(d => d.domain === selectedDomain);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analysis.summary.totalTemplates}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {analysis.summary.domainCount} domains
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Operational Needs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(analysis.operationalMatrix).flat().length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              across all templates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical Data Flows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analysis.criticalPaths?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              high-priority paths
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analysis.capabilities?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              enabled by templates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="domains" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="domains">By Domain</TabsTrigger>
          <TabsTrigger value="dataflows">Data Flows</TabsTrigger>
          <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
        </TabsList>

        {/* Domains Tab */}
        <TabsContent value="domains" className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {analysis.domains.map(domain => (
              <button
                key={domain.domain}
                onClick={() => setSelectedDomain(domain.domain)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedDomain === domain.domain
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {domain.domain}
                <span className="ml-2 text-xs opacity-70">
                  ({domain.templateCount})
                </span>
              </button>
            ))}
          </div>

          {currentDomain && (
            <div className="space-y-4 mt-6">
              {currentDomain.templates.map(template => (
                <Card key={template.name}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription className="mt-2">
                          {template.purpose}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{template.frequency}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Operational Needs */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Operational Needs
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {template.operationalNeeds.map(need => (
                          <Badge key={need} variant="secondary">
                            {need}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Integration Points */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Integration Points
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {template.integrationPoints.map(point => (
                          <Badge key={point} variant="outline">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Data Flows Tab */}
        <TabsContent value="dataflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Critical Data Flows</CardTitle>
              <CardDescription>
                Essential data movement between systems for business operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.dataFlows?.map((flow, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-semibold">{flow.from}</div>
                      <div className="text-xs text-muted-foreground">
                        Data Type: {flow.dataType}
                      </div>
                    </div>
                    <div className="text-2xl text-muted-foreground">→</div>
                    <div className="flex-1">
                      <div className="font-semibold">{flow.to}</div>
                      <div className="text-xs text-muted-foreground">
                        Frequency: {flow.frequency}
                      </div>
                    </div>
                    {flow.criticalPath && (
                      <Badge variant="destructive" className="ml-2">
                        Critical
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Capabilities Tab */}
        <TabsContent value="capabilities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enabled Capabilities</CardTitle>
              <CardDescription>
                Twin capabilities unlocked by template data and workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.capabilities?.map(capability => (
                  <div key={capability} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="font-medium">{capability}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
