"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, ArrowRight, Code2, Zap } from "lucide-react"

const PHASES = [
  {
    phase: 1,
    name: "Welcome",
    description: "Use case selection",
    details: "User selects whether they're setting up for personal, work, or business use.",
    endpoint: "GET /api/v1/workspace/onboarding-state",
    request: {},
    response: {
      status: "in_progress",
      currentStep: "welcome",
      completedSteps: []
    }
  },
  {
    phase: 2,
    name: "Profile",
    description: "Industry & department",
    details: "Capture user's industry, department, and company size for domain resolution.",
    endpoint: "POST /api/v1/workspace/initialize-profile",
    request: {
      industry: "technology",
      department: "Sales",
      companySize: "1-10"
    },
    response: {
      status: "in_progress",
      currentStep: "profile",
      domain: "SALES"
    }
  },
  {
    phase: 3,
    name: "Workspace",
    description: "Workspace setup",
    details: "User configures workspace name, goals, and initial settings.",
    endpoint: "POST /api/v1/workspace/create",
    request: {
      name: "Sales Team",
      goals: "Track deals and close revenue"
    },
    response: {
      workspaceId: "ws_abc123",
      status: "created"
    }
  },
  {
    phase: 4,
    name: "Connectors",
    description: "Data source selection",
    details: "User selects which tools to connect (Salesforce, HubSpot, etc.)",
    endpoint: "GET /api/v1/workspace/connectors/catalog",
    request: {},
    response: {
      connectors: [
        { id: "salesforce", name: "Salesforce", status: "available" },
        { id: "hubspot", name: "HubSpot", status: "available" }
      ],
      total: 45
    }
  },
  {
    phase: 5,
    name: "Activation",
    description: "Initialize & sync",
    details: "System initializes Spine schema and starts syncing data from connected sources.",
    endpoint: "POST /api/v1/workspace/initialize-spine",
    request: {
      domain: "SALES",
      connectors: [
        { provider: "salesforce", flowType: "A" }
      ]
    },
    response: {
      tenantConfig: { id: "tenant_123", domain: "SALES" },
      syncJobs: [
        { jobId: "job_001", connector: "salesforce", status: "running" }
      ]
    }
  },
  {
    phase: 6,
    name: "Complete",
    description: "Redirect to workspace",
    details: "Onboarding complete - user is redirected to their active workspace.",
    endpoint: "POST /api/v1/workspace/complete-onboarding",
    request: {},
    response: {
      success: true,
      redirectUrl: "/app/work/dashboard"
    }
  }
]

const DOMAIN_RESOLUTION = [
  { useCase: "personal", department: "*", domain: "PERSONAL" },
  { useCase: "work", department: "SALES", domain: "SALES" },
  { useCase: "work", department: "MARKETING", domain: "MARKETING" },
  { useCase: "work", department: "REVOPS", domain: "REVOPS" },
  { useCase: "work", department: "CUSTOMER_SUCCESS", domain: "CUSTOMER_SUCCESS" },
  { useCase: "work", department: "ENGINEERING", domain: "PRODUCT_ENGINEERING" },
  { useCase: "work", department: "PRODUCT", domain: "PRODUCT_ENGINEERING" },
  { useCase: "work", department: "FINANCE", domain: "FINANCE" },
]

export function OnboardingDemo() {
  const [selectedPhase, setSelectedPhase] = useState(0)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Onboarding Flow</h2>
        <p className="text-muted-foreground">
          6-phase user onboarding from signup to active workspace
        </p>
      </div>

      {/* Phase Selector */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Phases</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {PHASES.map((p, idx) => (
            <button
              key={p.phase}
              onClick={() => setSelectedPhase(idx)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedPhase === idx
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-primary">{p.phase}</div>
                <div className="text-xs font-medium">{p.name}</div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Phase Details */}
      <Card className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Phase {PHASES[selectedPhase].phase}</p>
            <h3 className="text-2xl font-bold">{PHASES[selectedPhase].name}</h3>
            <p className="text-muted-foreground mt-2">{PHASES[selectedPhase].details}</p>
          </div>
          <Badge variant="secondary">{PHASES[selectedPhase].description}</Badge>
        </div>

        {/* Endpoint & Code */}
        <Tabs defaultValue="endpoint" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="endpoint" className="gap-2">
              <Code2 className="w-4 h-4" />
              <span className="hidden sm:inline">API</span>
            </TabsTrigger>
            <TabsTrigger value="flow" className="gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Flow</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="endpoint" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-mono bg-muted px-3 py-2 rounded">
                  {PHASES[selectedPhase].endpoint}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Request</p>
                  <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                    {JSON.stringify(PHASES[selectedPhase].request, null, 2)}
                  </pre>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Response</p>
                  <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                    {JSON.stringify(PHASES[selectedPhase].response, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="flow" className="space-y-4 mt-4">
            <div className="space-y-3">
              {selectedPhase === 0 && (
                <p className="text-sm text-muted-foreground">
                  User selects use case: Personal, Work, or Business. This determines initial domain context.
                </p>
              )}
              {selectedPhase === 1 && (
                <p className="text-sm text-muted-foreground">
                  Collect industry, department, and company size to resolve the correct domain (SALES, MARKETING, etc.)
                </p>
              )}
              {selectedPhase === 2 && (
                <p className="text-sm text-muted-foreground">
                  User names their workspace and defines goals. Workspace record created in Spine.
                </p>
              )}
              {selectedPhase === 3 && (
                <p className="text-sm text-muted-foreground">
                  User selects which tools to connect. Connector catalog shows 45+ available integrations.
                </p>
              )}
              {selectedPhase === 4 && (
                <p className="text-sm text-muted-foreground">
                  Spine schema initialized with domain. Sync jobs begin for each selected connector. Data flows through Pipeline into Spine.
                </p>
              )}
              {selectedPhase === 5 && (
                <p className="text-sm text-muted-foreground">
                  Onboarding marked complete. User redirected to workspace dashboard with real data from Spine.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Domain Resolution Table */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Domain Resolution Matrix</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">Use Case</th>
                <th className="text-left py-2 px-3">Department</th>
                <th className="text-left py-2 px-3">Domain</th>
              </tr>
            </thead>
            <tbody>
              {DOMAIN_RESOLUTION.map((row, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/50">
                  <td className="py-2 px-3">{row.useCase}</td>
                  <td className="py-2 px-3 font-mono text-xs">{row.department}</td>
                  <td className="py-2 px-3">
                    <Badge variant="outline">{row.domain}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Flow Diagram */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Onboarding State Flow</h3>
        <div className="flex items-center justify-between text-xs">
          {PHASES.map((phase, idx) => (
            <div key={phase.phase} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                  {phase.phase}
                </div>
                <span className="text-xs mt-1 text-center max-w-12">{phase.name}</span>
              </div>
              {idx < PHASES.length - 1 && (
                <div className="flex-1 h-0.5 bg-border mx-2" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Implementation Example */}
      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-3">Implementation Example</h3>
        <pre className="text-xs bg-background p-4 rounded overflow-auto">
{`// Check onboarding state
const { onboarding } = await getOnboardingState();

// Initialize Spine (Phase 5)
const { tenantConfig, syncJobs } = await initializeSpine({
  domain: "SALES",
  industry: "technology",
  connectors: [
    { provider: "salesforce", flowType: "A" }
  ]
});

// Subscribe to progress updates
subscribeToProgress(
  (jobs) => {
    jobs.forEach(job => {
      console.log(\`\${job.connector}: \${job.progress.percentage}%\`);
    });
  }
);

// Complete onboarding
const { redirectUrl } = await completeOnboarding({
  preferences: { theme: "light" }
});

window.location.href = redirectUrl;`}
        </pre>
      </Card>
    </div>
  )
}
