import type { Project } from "@/types/project"
import { interpretAdaptiveIntent } from "./intent"
import { rankProjectsForIntent } from "./rank"
import { buildAdaptiveSummary } from "./summary"
import type { AdaptiveFocusResult } from "./types"

// TODO(private-extract): move this orchestration and metadata to a private package/service when sensitive weighting logic evolves.
export function runAdaptiveFocus(input: string, projects: Project[]): AdaptiveFocusResult {
  const intent = interpretAdaptiveIntent(input)
  const ranked = rankProjectsForIntent(projects, intent)
  const summary = buildAdaptiveSummary(intent)
  return { intent, ranked, summary }
}

export type { AdaptiveFocusResult } from "./types"
