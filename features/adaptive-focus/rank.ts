import { rankProjects } from "../../packages/adaptive-focus-core/src"
import { PROJECT_FOCUS_METADATA } from "./config/metadata"
import type { Project } from "@/types/project"
import type { AdaptiveIntent, RankedProject } from "./types"

export function rankProjectsForIntent(projects: Project[], intent: AdaptiveIntent): RankedProject[] {
  return rankProjects(projects, intent, PROJECT_FOCUS_METADATA)
}
