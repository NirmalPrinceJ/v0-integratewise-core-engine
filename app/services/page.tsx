import { ServicesView } from "@/components/views/services-view"

export const dynamic = "force-dynamic"
import { AppShell } from "@/components/app-shell"

export default function ServicesPage() {
  return (
    <AppShell>
      <ServicesView />
    </AppShell>
  )
}
