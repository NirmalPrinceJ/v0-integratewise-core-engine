import { ContentLibraryView } from "@/components/views/content-library-view"

export const dynamic = "force-dynamic"
import { AppShell } from "@/components/app-shell"

export default function ContentPage() {
  return (
    <AppShell>
      <ContentLibraryView />
    </AppShell>
  )
}
