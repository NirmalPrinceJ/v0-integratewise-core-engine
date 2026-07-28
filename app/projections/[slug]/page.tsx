import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { AppShell } from "@/components/app-shell"
import { EntityProjectionView } from "@/components/projections/entity-projection-view"
import { projectionBySlug } from "@/lib/projections"

interface ProjectionPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectionPageProps): Promise<Metadata> {
  const { slug } = await params
  const destination = projectionBySlug(slug)
  return {
    title: destination ? `${destination.label} | IntegrateWise` : "Projection | IntegrateWise",
    description: destination?.description ?? "Entity projection workspace",
  }
}

export default async function ProjectionPage({ params }: ProjectionPageProps) {
  const { slug } = await params
  const destination = projectionBySlug(slug)

  if (!destination) notFound()

  return (
    <AppShell>
      <EntityProjectionView destination={destination} />
    </AppShell>
  )
}
