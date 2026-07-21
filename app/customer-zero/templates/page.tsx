import { TemplateAnalysisDashboard } from '@/components/coda/template-analysis-dashboard';

export const metadata = {
  title: 'Template Analysis | Customer Zero',
  description: 'Analyze how Coda templates serve company operational needs',
};

export default function TemplateAnalysisPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Template Analysis
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            How IntegrateWise Coda templates enable company operations across every domain
          </p>
        </div>

        <TemplateAnalysisDashboard />

        <div className="bg-muted/50 border border-muted-foreground/20 rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-lg">Understanding the Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Operational Needs</h3>
              <p className="text-muted-foreground">
                Each template solves specific company operational challenges like pipeline forecasting, revenue recognition, and compliance tracking.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Integration Points</h3>
              <p className="text-muted-foreground">
                Templates connect to Twin capabilities that automate decisions, enabling department-specific workbenches powered by AI and human approval.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Data Flows</h3>
              <p className="text-muted-foreground">
                Critical data paths connect templates into a unified information system where decisions flow from one domain to enable autonomous execution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
