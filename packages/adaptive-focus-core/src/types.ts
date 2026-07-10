export const ADAPTIVE_CAPABILITIES = [
  "ai-product-systems",
  "human-in-the-loop-ai",
  "evaluation-calibration",
  "operational-ux",
  "internal-tools",
  "workflow-design",
  "design-engineering",
  "product-ownership",
  "creative-technology",
  "xr-spatial",
  "voice-interaction",
  "accessibility",
  "data-visualization",
  "prototyping",
  "moderation-qa",
  "privacy-trust",
  "people-management",
  "ml-infrastructure",
  "consumer-mobile",
] as const

export type AdaptiveCapability = (typeof ADAPTIVE_CAPABILITIES)[number]

export const ROLE_FAMILIES = [
  "ai-product",
  "design-engineering",
  "product-design",
  "product-engineering",
  "creative-technology",
  "xr-spatial",
  "operations",
  "research",
  "leadership",
  "unknown",
] as const

export type RoleFamily = (typeof ROLE_FAMILIES)[number]

export const SENIORITY_LEVELS = [
  "entry",
  "mid",
  "senior",
  "staff",
  "lead",
  "manager",
  "director",
  "executive",
  "unspecified",
] as const

export type Seniority = (typeof SENIORITY_LEVELS)[number]
export type RequirementImportance = "required" | "preferred" | "context"
export type RequirementBasis = "explicit" | "inferred"

export interface RoleRequirement {
  capability: AdaptiveCapability
  importance: RequirementImportance
  basis: RequirementBasis
}

export interface RoleInterpretation {
  normalizedInput: string
  roleTitle: string | null
  roleFamily: RoleFamily
  seniority: Seniority
  companyContext: string | null
  requirements: RoleRequirement[]
  responsibilities: string[]
  desiredOutcomes: string[]
  confidence: number
  clarificationNeeded: boolean
  clarificationQuestion: string | null
}

export type EvidenceType =
  | "shipped"
  | "measured"
  | "implemented"
  | "designed"
  | "researched"
  | "prototyped"

export type EvidenceOwnership = "led" | "built" | "designed" | "contributed"
export type EvidenceConfidence = "direct" | "supporting" | "adjacent"

export interface ProjectEvidence {
  id: string
  projectId: string
  capability: AdaptiveCapability
  statement: string
  sourcePath: string
  sourceSection?: string
  evidenceType: EvidenceType
  ownership: EvidenceOwnership
  outcome?: string
  confidence: EvidenceConfidence
}

export interface ProjectEvidenceExclusion {
  projectId: string
  reason: string
}

export interface EvidenceReference {
  evidenceId: string
  statement: string
  sourcePath: string
  sourceSection?: string
  outcome?: string
}

export type MatchLevel = "primary" | "supporting" | "adjacent"

export interface ProjectMatch {
  projectId: string
  level: MatchLevel
  matchedCapabilities: AdaptiveCapability[]
  matchedRequirements: string[]
  evidence: EvidenceReference[]
  explanation: string
}

export type RequirementCoverageLevel =
  | "strong"
  | "supporting"
  | "partial"
  | "not-demonstrated"

export interface RequirementCoverage {
  capability: AdaptiveCapability
  label: string
  importance: RequirementImportance
  coverage: RequirementCoverageLevel
  projectIds: string[]
  evidenceIds: string[]
}

export interface CoverageGap {
  capability: AdaptiveCapability
  label: string
  reason: string
}

export type AdaptiveFocusAnalysisSource = "preset" | "gpt" | "local-fallback"

export const ADAPTIVE_FOCUS_SCHEMA_VERSION = "af.v2" as const

export interface AdaptiveFocusV2Result {
  schemaVersion: typeof ADAPTIVE_FOCUS_SCHEMA_VERSION
  analysisSource: AdaptiveFocusAnalysisSource
  briefTitle: string
  interpretation: RoleInterpretation
  groups: {
    primary: ProjectMatch[]
    supporting: ProjectMatch[]
    adjacent: ProjectMatch[]
  }
  requirementCoverage: RequirementCoverage[]
  gaps: CoverageGap[]
  summary: string
}

export type AdaptiveFocusRequest =
  | { mode: "preset"; presetId: string }
  | { mode: "custom"; input: string }
  | {
      mode: "interpretation"
      interpretation: RoleInterpretation
      analysisSource: AdaptiveFocusAnalysisSource
    }

export interface AdaptiveFocusRunOptions {
  signal?: AbortSignal
}

export interface AdaptiveFocusEngine {
  run(
    request: AdaptiveFocusRequest,
    options?: AdaptiveFocusRunOptions
  ): Promise<AdaptiveFocusV2Result>
}
