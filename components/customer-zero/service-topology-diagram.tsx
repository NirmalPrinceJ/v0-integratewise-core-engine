"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Server, Database, Zap, Network } from "lucide-react"

const SERVICES = [
  {
    name: "Gateway (BFF)",
    url: "gateway.dev.integratewise.ai",
    role: "Single entry point",
    features: ["JWT Validation", "Rate Limiting", "Request Routing", "CORS Policy"],
    icon: "🚪"
  },
  {
    name: "Spine (D1)",
    url: "Local database",
    role: "Canonical data layer",
    features: ["Entity Storage", "Timeline Events", "Relationships", "Metadata"],
    icon: "📊"
  },
  {
    name: "Connector Service",
    url: "integratewise-connector",
    role: "Integration management",
    features: ["OAuth Flow", "Connector Catalog", "Status Tracking", "Sync Jobs"],
    icon: "🔌"
  },
  {
    name: "Pipeline Service",
    url: "integratewise-pipeline",
    role: "Data processing",
    features: ["Extraction", "Transformation", "Loading", "Validation"],
    icon: "⚙️"
  },
  {
    name: "Intelligence Service",
    url: "integratewise-intelligence",
    role: "AI/ML operations",
    features: ["Brainstorm", "Capabilities", "Cognitive", "Reasoning"],
    icon: "🧠"
  },
  {
    name: "Agent Runtime",
    url: "iw-agent-runtime",
    role: "Agent operations",
    features: ["Twin Execution", "Proposals", "Handoff", "Learning"],
    icon: "🤖"
  },
  {
    name: "BFF Service",
    url: "integratewise-bff",
    role: "Backend for Frontend",
    features: ["Workbench", "Composition", "Projection", "Cache"],
    icon: "🎨"
  },
  {
    name: "Knowledge Service",
    url: "integratewise-knowledge",
    role: "Knowledge base",
    features: ["Semantic Search", "Memory", "Continuity", "Learning"],
    icon: "📚"
  },
  {
    name: "Webhook Ingress",
    url: "integratewise-webhook-ingress",
    role: "Event ingestion",
    features: ["Webhook Parsing", "Signature Verification", "Event Routing", "Retry"],
    icon: "🪝"
  },
  {
    name: "Admin Service",
    url: "integratewise-admin",
    role: "Administration",
    features: ["Tenant Management", "Governance", "Audit", "Configuration"],
    icon: "⚙️"
  },
  {
    name: "Billing Service",
    url: "integratewise-billing",
    role: "Billing operations",
    features: ["Pricing", "Invoicing", "Quotas", "Metering"],
    icon: "💰"
  },
  {
    name: "Tenants Service",
    url: "integratewise-tenants",
    role: "Tenant lifecycle",
    features: ["Provisioning", "Scaling", "Isolation", "Metadata"],
    icon: "🏢"
  }
]

export function ServiceTopologyDiagram() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Service Architecture</h2>
        <p className="text-muted-foreground">
          IntegrateWise uses a microservices architecture with Cloudflare Workers and D1
        </p>
      </div>

      {/* Architecture Overview */}
      <Card className="p-8 bg-gradient-to-br from-muted/50 to-muted/20">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">CLIENT</p>
            <p className="text-lg font-semibold">(Browser, Mobile, Third-party App)</p>
          </div>

          <div className="flex justify-center">
            <div className="text-muted-foreground">↓</div>
          </div>

          <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">GATEWAY</p>
            <p className="text-lg font-semibold">gateway.dev.integratewise.ai</p>
            <p className="text-xs text-muted-foreground">JWT Validation • Rate Limiting • Request Routing</p>
          </div>

          <div className="flex justify-center">
            <div className="text-muted-foreground">↓</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center space-y-2">
              <p className="text-xs text-muted-foreground">INTERNAL</p>
              <p className="font-semibold">Spine (D1)</p>
              <p className="text-xs text-muted-foreground">Entity Data</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center space-y-2">
              <p className="text-xs text-muted-foreground">SERVICE BINDING</p>
              <p className="font-semibold">Connectors</p>
              <p className="text-xs text-muted-foreground">Integrations</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center space-y-2">
              <p className="text-xs text-muted-foreground">SERVICE BINDING</p>
              <p className="font-semibold">Intelligence</p>
              <p className="text-xs text-muted-foreground">AI/ML Ops</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Services Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Microservices (12 Workers)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((service) => (
            <Card key={service.name} className="p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="text-2xl">{service.icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm">{service.name}</h4>
                  <code className="text-xs text-muted-foreground block truncate">
                    {service.url}
                  </code>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-3">{service.role}</p>

              <div className="flex flex-wrap gap-1">
                {service.features.map((feature) => (
                  <Badge key={feature} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Data Flow */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold">Data Flow</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-mono bg-muted px-2 py-1 rounded">External Systems</span>
            <span className="text-muted-foreground">→</span>
            <span className="font-mono bg-muted px-2 py-1 rounded">Connector</span>
            <span className="text-muted-foreground">→</span>
            <span className="font-mono bg-muted px-2 py-1 rounded">Loader</span>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <span className="text-muted-foreground">↓</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono bg-muted px-2 py-1 rounded">Pipeline</span>
            <span className="text-muted-foreground">→</span>
            <span className="font-mono bg-muted px-2 py-1 rounded">Spine (D1)</span>
            <span className="text-muted-foreground">→</span>
            <span className="font-mono bg-muted px-2 py-1 rounded">Projection</span>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <span className="text-muted-foreground">↓</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono bg-muted px-2 py-1 rounded">Gateway</span>
            <span className="text-muted-foreground">→</span>
            <span className="font-mono bg-muted px-2 py-1 rounded">Client</span>
          </div>
        </div>
      </Card>

      {/* Service Bindings Reference */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Service Binding Configuration</h3>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { binding: "CONNECTOR", routes: "/workspace/connectors/*" },
              { binding: "CONNECTOR_SYNC", routes: "/workspace/connectors/nango-session" },
              { binding: "PIPELINE", routes: "/pipeline/*, /loader/*" },
              { binding: "INTELLIGENCE", routes: "/capabilities/*, /brainstorm, /cognitive/*" },
              { binding: "KNOWLEDGE", routes: "/knowledge/*" },
              { binding: "BFF", routes: "/workbench/*" },
              { binding: "AGENT_RUNTIME", routes: "/agent/*, /twin/*" },
              { binding: "L2", routes: "/l2/*" },
              { binding: "WEBHOOK_INGRESS", routes: "/webhooks/*" },
              { binding: "HUB_CONTROLLER", routes: "/hub/*" },
              { binding: "ADMIN", routes: "/admin/*" },
              { binding: "BILLING", routes: "/billing/*" },
            ].map((item) => (
              <div key={item.binding} className="bg-muted/50 rounded p-3">
                <p className="font-mono font-semibold text-xs">{item.binding}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.routes}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
