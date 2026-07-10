import { HybridAdaptiveFocusEngine } from "./adapters/hybrid-engine"
import { composeLocalBrief } from "./adapters/local-engine"
import { ADAPTIVE_FOCUS_PRESETS } from "./config/presets"
import type {
  AdaptiveFocusAnalysisSource,
  AdaptiveFocusEngine,
  AdaptiveFocusRequest,
  AdaptiveFocusRunOptions,
  AdaptiveFocusV2Result,
  RoleInterpretation,
} from "./types"

let engine: AdaptiveFocusEngine | null = null

export function createAdaptiveFocusEngine(): AdaptiveFocusEngine {
  return new HybridAdaptiveFocusEngine()
}

export function runAdaptiveFocus(
  request: AdaptiveFocusRequest,
  options?: AdaptiveFocusRunOptions
): Promise<AdaptiveFocusV2Result> {
  engine ??= createAdaptiveFocusEngine()
  return engine.run(request, options)
}

export function rebuildAdaptiveFocusBrief(
  interpretation: RoleInterpretation,
  analysisSource: AdaptiveFocusAnalysisSource
): AdaptiveFocusV2Result {
  return composeLocalBrief(interpretation, analysisSource)
}

export { ADAPTIVE_FOCUS_PRESETS }
export { AI_PROJECT_IDS, PROJECT_EVIDENCE } from "./evidence/catalog"
export { CAPABILITY_LABELS } from "../../packages/adaptive-focus-core/src"
export type {
  AdaptiveCapability,
  AdaptiveFocusAnalysisSource,
  AdaptiveFocusEngine,
  AdaptiveFocusRequest,
  AdaptiveFocusRunOptions,
  AdaptiveFocusV2Result,
  ProjectMatch,
  RequirementCoverage,
  RoleInterpretation,
} from "./types"
