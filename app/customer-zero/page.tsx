"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlatformExplorer } from "@/components/customer-zero/platform-explorer"
import { DocumentationBrowser } from "@/components/customer-zero/documentation-browser"
import { OnboardingDemo } from "@/components/customer-zero/onboarding-demo"
import { ServiceTopologyDiagram } from "@/components/customer-zero/service-topology-diagram"
import { 
  BookOpen,
  Zap,
  Network,
  Compass
} from "lucide-react"

export default function CustomerZeroPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">iW</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">IntegrateWise</h1>
              <p className="text-xs text-muted-foreground">Customer Zero Platform</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Tabs defaultValue="platform" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:gap-4 lg:bg-transparent lg:p-0 lg:h-auto">
            <TabsTrigger value="platform" className="lg:bg-muted/50 lg:px-4 lg:py-2 lg:rounded">
              <Compass className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Platform</span>
            </TabsTrigger>
            <TabsTrigger value="docs" className="lg:bg-muted/50 lg:px-4 lg:py-2 lg:rounded">
              <BookOpen className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Docs</span>
            </TabsTrigger>
            <TabsTrigger value="topology" className="lg:bg-muted/50 lg:px-4 lg:py-2 lg:rounded">
              <Network className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Architecture</span>
            </TabsTrigger>
            <TabsTrigger value="onboarding" className="lg:bg-muted/50 lg:px-4 lg:py-2 lg:rounded">
              <Zap className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Flow</span>
            </TabsTrigger>
          </TabsList>

          {/* Platform Explorer Tab */}
          <TabsContent value="platform" className="space-y-6">
            <PlatformExplorer />
          </TabsContent>

          {/* Documentation Browser Tab */}
          <TabsContent value="docs" className="space-y-6">
            <DocumentationBrowser />
          </TabsContent>

          {/* Service Topology Tab */}
          <TabsContent value="topology" className="space-y-6">
            <ServiceTopologyDiagram />
          </TabsContent>

          {/* Onboarding Flow Tab */}
          <TabsContent value="onboarding" className="space-y-6">
            <OnboardingDemo />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
