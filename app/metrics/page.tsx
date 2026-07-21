import { AppShell } from "@/components/app-shell"

export const dynamic = "force-dynamic"
import { MetricsView } from "@/components/views/metrics-view"

export default function MetricsPage() {
  return (
    <AppShell>
      <MetricsView />
    </AppShell>
  )
}
