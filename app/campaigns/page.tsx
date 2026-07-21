import { AppShell } from "@/components/app-shell"
import { CampaignsView } from "@/components/views/campaigns-view"

export const dynamic = "force-dynamic"

export default function CampaignsPage() {
  return (
    <AppShell>
      <CampaignsView />
    </AppShell>
  )
}
