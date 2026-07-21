"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, 
  Code2, 
  Zap, 
  Database, 
  Network, 
  Layers,
  ExternalLink,
  Copy,
  CheckCircle2
} from "lucide-react"

const PLATFORM_DOCS = {
  onboarding: {
    title: "Onboarding Flow",
    description: "6-phase user onboarding process",
    icon: <Zap className="w-5 h-5" />,
    phases: 6,
    endpoints: 13,
    file: "ONBOARDING_FLOW.md"
  },
  api: {
    title: "Platform API",
    description: "Complete REST API reference",
    icon: <Code2 className="w-5 h-5" />,
    endpoints: 45,
    categories: 10,
    file: "PLATFORM_API.md"
  },
  topology: {
    title: "Service Topology",
    description: "Gateway + 12 microservices",
    icon: <Network className="w-5 h-5" />,
    services: 12,
    bindings: 12,
    file: "SERVICE_TOPOLOGY.md"
  },
  design: {
    title: "UI Design System",
    description: "Components & design tokens",
    icon: <Layers className="w-5 h-5" />,
    components: 10,
    tokens: 18,
    file: "UI_DESIGN.md"
  },
  database: {
    title: "Spine Architecture",
    description: "Adaptive entity graph",
    icon: <Database className="w-5 h-5" />,
    tables: 5,
    entityTypes: 13,
    file: "grand-build.md"
  }
}

const CONNECTORS = [
  { name: "Salesforce", category: "CRM", icon: "salesforce" },
  { name: "HubSpot", category: "CRM", icon: "hubspot" },
  { name: "Slack", category: "Communication", icon: "slack" },
  { name: "GitHub", category: "Development", icon: "github" },
  { name: "Notion", category: "Productivity", icon: "notion" },
  { name: "Stripe", category: "Finance", icon: "stripe" },
  { name: "Jira", category: "Project Mgmt", icon: "jira" },
  { name: "Google Sheets", category: "Productivity", icon: "google" },
]

const API_ENDPOINTS = {
  workspace: [
    { method: "GET", path: "/api/v1/workspace/projection/:department", description: "Get workbench data" },
    { method: "GET", path: "/api/v1/workspace/entities", description: "List entities" },
    { method: "GET", path: "/api/v1/workspace/readiness", description: "Department readiness" },
  ],
  connectors: [
    { method: "GET", path: "/api/v1/workspace/connectors", description: "List connectors" },
    { method: "POST", path: "/api/v1/workspace/register-connector", description: "Register connector" },
    { method: "POST", path: "/api/v1/integrations/:provider/authorize", description: "Start OAuth" },
  ],
  capabilities: [
    { method: "POST", path: "/api/v1/capabilities/resolve", description: "Execute capability" },
    { method: "GET", path: "/api/v1/workbench/capabilities", description: "List capabilities" },
  ]
}

export function PlatformExplorer() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Platform Architecture</h1>
        <p className="text-lg text-muted-foreground">
          Complete documentation and API reference for IntegrateWise
        </p>
      </div>

      {/* Documentation Overview */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="connectors">Connectors</TabsTrigger>
          <TabsTrigger value="flow">Onboarding</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(PLATFORM_DOCS).map(([key, doc]: [string, any]) => (
              <Card key={key} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-primary">{doc.icon}</div>
                  <Badge variant="outline">Documentation</Badge>
                </div>
                <h3 className="text-lg font-semibold mb-2">{doc.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{doc.description}</p>
                
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  {doc.phases && <div>Phases: <span className="font-semibold">{doc.phases}</span></div>}
                  {doc.endpoints && <div>Endpoints: <span className="font-semibold">{doc.endpoints}</span></div>}
                  {doc.services && <div>Services: <span className="font-semibold">{doc.services}</span></div>}
                  {doc.components && <div>Components: <span className="font-semibold">{doc.components}</span></div>}
                  {doc.tables && <div>Tables: <span className="font-semibold">{doc.tables}</span></div>}
                  {doc.entityTypes && <div>Entity Types: <span className="font-semibold">{doc.entityTypes}</span></div>}
                </div>

                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={`/docs/${doc.file}`} target="_blank">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read Docs
                  </a>
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* API Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card className="p-6 bg-muted/50">
            <div className="space-y-2 mb-4">
              <h3 className="font-semibold">Gateway Base URL</h3>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-background p-3 rounded border text-sm">
                  https://gateway.dev.integratewise.ai
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard("https://gateway.dev.integratewise.ai")}
                >
                  {copied === "https://gateway.dev.integratewise.ai" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {Object.entries(API_ENDPOINTS).map(([category, endpoints]: [string, any[]]) => (
            <Card key={category} className="p-6">
              <h3 className="font-semibold mb-4 capitalize">{category} Endpoints</h3>
              <div className="space-y-3">
                {endpoints.map((ep, idx) => (
                  <div key={idx} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <Badge variant="secondary" className="mt-1 min-w-fit">
                      {ep.method}
                    </Badge>
                    <div className="flex-1">
                      <code className="text-sm text-muted-foreground">{ep.path}</code>
                      <p className="text-xs text-muted-foreground mt-1">{ep.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`${ep.method} ${ep.path}`)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Connectors Tab */}
        <TabsContent value="connectors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONNECTORS.map((connector) => (
              <Card key={connector.name} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{connector.name}</h4>
                    <p className="text-xs text-muted-foreground">{connector.category}</p>
                  </div>
                  <img 
                    src={`https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/${connector.icon}.svg`}
                    alt={connector.name}
                    className="w-8 h-8"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect fill='%23f0f0f0' width='32' height='32'/%3E%3C/svg%3E`
                    }}
                  />
                </div>
                <Badge variant="outline" className="w-full text-center justify-center">
                  Available
                </Badge>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Onboarding Tab */}
        <TabsContent value="flow" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">6-Phase Onboarding Flow</h3>
            <div className="space-y-3">
              {[
                { phase: 1, name: "Welcome", desc: "Use case selection" },
                { phase: 2, name: "Profile", desc: "Industry & department" },
                { phase: 3, name: "Workspace", desc: "Workspace setup" },
                { phase: 4, name: "Connectors", desc: "Data source selection" },
                { phase: 5, name: "Activation", desc: "Initialize & sync" },
                { phase: 6, name: "Complete", desc: "Redirect to workspace" },
              ].map((step) => (
                <div key={step.phase} className="flex items-center gap-4 pb-3 border-b last:border-0">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                    {step.phase}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{step.name}</p>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/docs" target="_blank">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Documentation
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="https://github.com/NirmalPrinceJ/integratewise-live" target="_blank">
                    <Code2 className="w-4 h-4 mr-2" />
                    GitHub Repository
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Authentication</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium mb-1">API Token</p>
                  <code className="text-xs bg-muted p-2 rounded block">INTEGRATEWISE_API_TOKEN</code>
                </div>
                <div>
                  <p className="font-medium mb-1">Tenant ID</p>
                  <code className="text-xs bg-muted p-2 rounded block">INTEGRATEWISE_TENANT_ID</code>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
