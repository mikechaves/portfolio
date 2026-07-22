export {
  ADAPTIVE_CAPABILITIES,
  ADAPTIVE_FOCUS_SCHEMA_VERSION,
  ROLE_FAMILIES,
  SENIORITY_LEVELS,
} from "../../packages/adaptive-focus-core/src"
export type {
  AdaptiveCapability,
  AdaptiveFocusAnalysisSource,
  AdaptiveFocusEngine,
  AdaptiveFocusRequest,
  AdaptiveFocusRunOptions,
  AdaptiveFocusV2Result,
  CoverageGap,
  EvidenceReference,
  EvidenceMatch,
  EvidenceRecord,
  RequirementCoverage,
  RoleFamily,
  RoleInterpretation,
  RoleRequirement,
  Seniority,
} from "../../packages/adaptive-focus-core/src"

export interface AdaptiveFocusPreset {
  id: string
  label: string
  description: string
  interpretation: import("../../packages/adaptive-focus-core/src").RoleInterpretation
}
