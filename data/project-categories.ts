import { GAME_INTERACTIVE_PROJECT_ID_SET } from "@/data/portfolio-curation"
import { PROJECTS } from "@/data/projects"
import { AI_PROJECT_IDS } from "@/features/adaptive-focus/evidence/catalog"
import type { Project } from "@/types/project"

export const PROJECT_CATEGORIES = [
  { id: "all", name: "All Projects" },
  { id: "ai", name: "AI" },
  { id: "games", name: "Games & Interactive" },
  { id: "ar-vr", name: "XR & Spatial" },
  { id: "web", name: "Web Development" },
  { id: "design", name: "UX/UI Design" },
  { id: "research", name: "Research" },
] as const

export function getProjectsForCategory(category: string): Project[] {
  if (category === "all") return PROJECTS
  if (category === "ai") return PROJECTS.filter((project) => AI_PROJECT_IDS.has(project.id))
  if (category === "games") {
    return PROJECTS.filter((project) => GAME_INTERACTIVE_PROJECT_ID_SET.has(project.id))
  }
  return PROJECTS.filter((project) => project.category === category)
}
