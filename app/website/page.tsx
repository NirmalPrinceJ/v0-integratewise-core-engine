import { AppShell } from "@/components/app-shell"

export const dynamic = "force-dynamic"
import { WebsiteManagerView } from "@/components/views/website-manager-view"

export default function WebsitePage() {
  return (
    <AppShell>
      <WebsiteManagerView />
    </AppShell>
  )
}
