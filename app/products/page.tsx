import { AppShell } from "@/components/app-shell"

export const dynamic = "force-dynamic"
import { ProductsView } from "@/components/views/products-view"

export default function ProductsPage() {
  return (
    <AppShell>
      <ProductsView />
    </AppShell>
  )
}
