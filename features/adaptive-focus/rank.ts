import type { Project } from "@/types/project"
import { PROJECT_FOCUS_METADATA } from "./metadata"
import type { AdaptiveIntent, RankedProject } from "./types"

function includesAny(text: string, terms: string[]): string[] {
  return terms.filter((term) => text.includes(term))
}

export function rankProjectsForIntent(projects: Project[], intent: AdaptiveIntent): RankedProject[] {
  return projects
    .map((project, index) => {
      const metadata = PROJECT_FOCUS_METADATA[project.id]
      const lowered = `${project.title} ${project.description} ${project.technologies.join(" ")}`.toLowerCase()
      const scoreParts: number[] = []
      const reasons: string[] = []

      const signalMatches = intent.matchedSignals.filter((signal) => metadata?.signals.includes(signal))
      if (signalMatches.length > 0) {
        scoreParts.push(signalMatches.length * 5)
        reasons.push(`signals: ${signalMatches.join(", ")}`)
      }

      const metadataTagMatches = intent.matchedTags.filter((tag) => metadata?.tags.includes(tag))
      if (metadataTagMatches.length > 0) {
        scoreParts.push(metadataTagMatches.length * 3)
        reasons.push(`mapped tags: ${metadataTagMatches.join(", ")}`)
      }

      const textMatches = includesAny(lowered, intent.matchedTags)
      if (textMatches.length > 0) {
        scoreParts.push(textMatches.length * 1.5)
        reasons.push(`content terms: ${textMatches.join(", ")}`)
      }

      if (metadata?.weight) scoreParts.push(metadata.weight)

      const score = Number(scoreParts.reduce((sum, part) => sum + part, 0).toFixed(2))
      return {
        project,
        score,
        reasons,
        matchedSignals: signalMatches,
        matchedTags: [...new Set([...metadataTagMatches, ...textMatches])],
        _index: index,
      }
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a._index - b._index
    })
    .map(({ _index, ...rest }) => rest)
}
