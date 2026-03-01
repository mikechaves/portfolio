import rawProjects from "@/public/data/projects.json"
import type { Project } from "@/types/project"

type RawProjectRecord = {
  title: string
  description: string
  image: string
  technologies: string[]
  category: Project["category"]
}

const parsedProjects = Object.entries(rawProjects as Record<string, RawProjectRecord>).map(
  ([id, project]) => ({
    id,
    title: project.title,
    description: project.description,
    image: `${project.image}?height=400&width=600`,
    technologies: project.technologies,
    category: project.category,
  })
)

export const PROJECTS: Project[] = parsedProjects

export function getProjects(): Project[] {
  return PROJECTS
}
