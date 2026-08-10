import rawProjects from "@/public/data/projects.json"
import type { ProjectDetail } from "@/types/project-detail"

type RawProjectDetail = Omit<ProjectDetail, "id">

const projectDetails = rawProjects as Record<string, RawProjectDetail>

export const PROJECT_DETAIL_IDS = Object.freeze(Object.keys(projectDetails))

export function getProjectDetail(id: string): ProjectDetail | undefined {
  const project = Object.hasOwn(projectDetails, id) ? projectDetails[id] : undefined
  return project ? { id, ...project } : undefined
}

export function getAllProjectDetails(): ProjectDetail[] {
  return PROJECT_DETAIL_IDS.map((id) => getProjectDetail(id)).filter(
    (project): project is ProjectDetail => Boolean(project)
  )
}
