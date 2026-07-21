import { FounderDashboard } from "@/components/workspace/founder-dashboard"
import { AppShell } from "@/components/app-shell"

export const metadata = {
  title: "Founder Dashboard | IntegrateWise Workspace",
  description: "Your startup's operational hub with unified view of customers, team, and metrics",
}

export default function WorkspacePage() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-8 py-8">
        <FounderDashboard />
      </div>
    </AppShell>
  )
}
