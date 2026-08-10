import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { JsonLd } from "@/components/json-ld"
import { getProjectDetail, PROJECT_DETAIL_IDS } from "@/data/project-details"
import { createPageMetadata } from "@/lib/seo/site"
import { getProjectStructuredData } from "@/lib/seo/structured-data"
import ProjectPageClient from "./ProjectPageClient"
import { getDossierExitPath } from "./dossierExitPathData"
import { RETIRED_PROJECT_REDIRECTS } from "./retiredProjectRedirects"

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return [...PROJECT_DETAIL_IDS, ...Object.keys(RETIRED_PROJECT_REDIRECTS)].map((id) => ({ id }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params
  const project = getProjectDetail(id)

  if (!project) {
    return createPageMetadata({
      title: "Project Not Found",
      description: "The requested project evidence is not available.",
      path: `/projects/${id}`,
      noIndex: true,
      follow: false,
    })
  }

  return createPageMetadata({
    title: `${project.title} Case Study`,
    description: project.description,
    path: `/projects/${project.id}`,
    image: project.image,
    imageAlt: `${project.title} project evidence`,
    type: "article",
  })
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const retiredDestination = RETIRED_PROJECT_REDIRECTS[id]
  if (retiredDestination) permanentRedirect(retiredDestination)

  const project = getProjectDetail(id)
  if (!project) notFound()

  return (
    <>
      <JsonLd id="project-structured-data" data={getProjectStructuredData(project)} />
      <ProjectPageClient dossierExitPath={getDossierExitPath(id)} project={project} />
    </>
  )
}
