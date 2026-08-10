import { JsonLd } from "@/components/json-ld"
import { PROJECTS } from "@/data/projects"
import { getProjectCollectionStructuredData } from "@/lib/seo/structured-data"
import { ProjectsPageClient } from "./ProjectsPageClient"

export default function ProjectsPage() {
  return (
    <>
      <JsonLd
        id="project-collection-structured-data"
        data={getProjectCollectionStructuredData(PROJECTS)}
      />
      <ProjectsPageClient />
    </>
  )
}
