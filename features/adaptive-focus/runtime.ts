import { HybridAdaptiveFocusEngine } from "./adapters/hybrid-engine"
import { composeLocalBrief } from "./adapters/local-engine"
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
