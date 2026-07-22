import rawProjects from "@/public/data/projects.json"
import {
  PUBLIC_PROJECT_ORDER,
  validatePublicProjectCuration,
} from "@/data/portfolio-curation"
import { getProjectThumbnailFocalPoint } from "@/data/project-thumbnails"
import type { Project } from "@/types/project"

type RawProjectRecord = {
  title: string
  description: string
  image: string
  technologies: string[]
  category: Project["category"]
}

const rawProjectRecords = rawProjects as Record<string, RawProjectRecord>
const curationIssues = validatePublicProjectCuration(Object.keys(rawProjectRecords))

if (curationIssues.length) {
  throw new Error(
    `Invalid public project curation: ${curationIssues
      .map((issue) => `${issue.type}:${issue.value}`)
      .join(", ")}`
  )
}

const parsedProjects = PUBLIC_PROJECT_ORDER.map((id) => {
  const project = rawProjectRecords[id]
  if (!project) throw new Error(`Missing curated public project: ${id}`)

  return {
    id,
    title: project.title,
    description: project.description,
    image: `${project.image}?height=400&width=600`,
    technologies: project.technologies,
    category: project.category,
    thumbnailFocalPoint: getProjectThumbnailFocalPoint(id),
  }
})

export const PROJECTS: Project[] = parsedProjects

export function getProjects(): Project[] {
  return PROJECTS
}
