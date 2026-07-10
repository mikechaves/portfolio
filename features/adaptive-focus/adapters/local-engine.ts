import {
  buildRoleFitBrief,
  interpretLocalRole,
} from "../../../packages/adaptive-focus-core/src"
import { PROJECTS } from "@/data/projects"
import { ADAPTIVE_FOCUS_PRESETS_BY_ID } from "../config/presets"
import { PROJECT_EVIDENCE } from "../evidence/catalog"
import type {
  AdaptiveFocusAnalysisSource,
  AdaptiveFocusEngine,
  AdaptiveFocusRequest,
  AdaptiveFocusRunOptions,
  AdaptiveFocusV2Result,
  RoleInterpretation,
} from "../types"

const PROJECT_IDS = PROJECTS.map((project) => project.id)

export function composeLocalBrief(
  interpretation: RoleInterpretation,
  analysisSource: AdaptiveFocusAnalysisSource
): AdaptiveFocusV2Result {
  return buildRoleFitBrief(interpretation, PROJECT_EVIDENCE, PROJECT_IDS, analysisSource)
}

export class LocalAdaptiveFocusEngine implements AdaptiveFocusEngine {
  async run(
    request: AdaptiveFocusRequest,
    options?: AdaptiveFocusRunOptions
  ): Promise<AdaptiveFocusV2Result> {
    if (options?.signal?.aborted) {
      throw new DOMException("Adaptive Focus request was canceled.", "AbortError")
    }

    if (request.mode === "preset") {
      const preset = ADAPTIVE_FOCUS_PRESETS_BY_ID.get(request.presetId)
      if (!preset) throw new Error(`Unknown Adaptive Focus preset: ${request.presetId}`)
      return composeLocalBrief(
        { ...preset.interpretation, normalizedInput: preset.label },
        "preset"
      )
    }

    if (request.mode === "interpretation") {
      return composeLocalBrief(request.interpretation, request.analysisSource)
    }

    return composeLocalBrief(interpretLocalRole(request.input), "local-fallback")
  }
}
