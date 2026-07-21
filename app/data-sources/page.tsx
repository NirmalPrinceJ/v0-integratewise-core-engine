import { AppShell } from "@/components/app-shell"

export const dynamic = "force-dynamic"
import { DataSourcesView } from "@/components/views/data-sources-view"

export default function DataSourcesPage() {
  return (
    <AppShell>
      <DataSourcesView />
    </AppShell>
  )
}
