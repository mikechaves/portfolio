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
export { AI_PROJECT_IDS, EVIDENCE_CATALOG } from "./evidence/catalog"
export {
  EVIDENCE_ENTITY_BY_ID,
  EVIDENCE_ENTITY_IDS,
  isPublicProjectEvidenceEntity,
} from "./evidence/entities"
export {
  PROFESSIONAL_EXPERIENCE_BY_ID,
  PROFESSIONAL_EXPERIENCE_RECORDS,
} from "./evidence/professional-experience"
export {
  CAPABILITY_LABELS,
  ROLE_FAMILY_LABELS,
} from "../../packages/adaptive-focus-core/src"
export type {
  AdaptiveCapability,
  AdaptiveFocusAnalysisSource,
  AdaptiveFocusEngine,
  AdaptiveFocusRequest,
  AdaptiveFocusRunOptions,
  AdaptiveFocusV2Result,
  EvidenceMatch,
  RequirementCoverage,
  RoleInterpretation,
} from "./types"
