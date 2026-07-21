import { Suspense } from "react"

export const dynamic = "force-dynamic"
import { AppShell } from "@/components/app-shell"
import { IntegrationsView } from "@/components/views/integrations-view"

export default function IntegrationsPage() {
  return (
    <AppShell>
      <Suspense fallback={null}>
        <IntegrationsView />
      </Suspense>
    </AppShell>
  )
}
