import { JsonLd } from "@/components/json-ld"
import { PROJECTS } from "@/data/projects"
import { getProjectCollectionStructuredData } from "@/lib/seo/structured-data"
import { ProjectsPageClient } from "./ProjectsPageClient"
import Link from "next/link"

export default function ProjectsPage() {
  return <div className="projects-index-page">
    <JsonLd id="project-collection-structured-data" data={getProjectCollectionStructuredData(PROJECTS)} />
    <header className="project-index-hero" aria-labelledby="project-index-title">
      <p className="project-index-eyebrow">Projects / Products / Games</p>
      <h1 id="project-index-title" className="project-index-title">Work.</h1>
    </header>
    <ProjectsPageClient />
    <details className="project-page-directory">
      <summary>Browse by title</summary>
      <nav aria-label="All project pages"><ul>{PROJECTS.map(project => <li key={project.id}><Link href={`/projects/${project.id}`}>{project.title}</Link></li>)}</ul></nav>
    </details>
  </div>
}
