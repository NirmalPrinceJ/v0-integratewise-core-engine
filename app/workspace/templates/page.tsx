import { TemplateLibrary } from "@/components/workspace/template-library"
import { AppShell } from "@/components/app-shell"

export const metadata = {
  title: "Template Library | IntegrateWise",
  description: "Pre-built workflows for startup operations",
}

export default function TemplatesPage() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-8 py-8">
        <TemplateLibrary />
      </div>
    </AppShell>
  )
}
