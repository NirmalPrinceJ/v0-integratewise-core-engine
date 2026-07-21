import { SalesWorkbench } from "@/components/workspace/sales-workbench"
import { OODAButtons } from "@/components/workspace/ooda-buttons"
import { TwinSignalFeed } from "@/components/workspace/twin-signal-feed"
import { AppShell } from "@/components/app-shell"

export const metadata = {
  title: "Sales Workbench | IntegrateWise",
  description: "Sales pipeline, opportunities, and deals management",
}

export default function SalesPage() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-12">
        <SalesWorkbench />
        
        <div className="border-t pt-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Actions</h2>
            <OODAButtons />
          </div>
        </div>

        <div className="border-t pt-8">
          <TwinSignalFeed />
        </div>
      </div>
    </AppShell>
  )
}
