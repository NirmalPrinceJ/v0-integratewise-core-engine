import { AppShell } from "@/components/app-shell"
import { StrategicHubView } from "@/components/views/strategic-hub-view"

export const dynamic = "force-dynamic"

export default function StrategyPage() {
  return (
    <AppShell>
      <StrategicHubView />
    </AppShell>
  )
}
