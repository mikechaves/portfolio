import { createBriefSummary } from "./summary"
import { formatLabelForSentence } from "./copy"
import type {
  AdaptiveCapability,
  AdaptiveFocusAnalysisSource,
  AdaptiveFocusV2Result,
  EvidenceConfidence,
  ProjectEvidence,
  ProjectMatch,
  RequirementCoverage,
  RequirementCoverageLevel,
  RoleInterpretation,
  RoleRequirement,
} from "./types"
import { ADAPTIVE_FOCUS_SCHEMA_VERSION } from "./types"

export const CAPABILITY_LABELS: Record<AdaptiveCapability, string> = {
  "ai-product-systems": "AI product systems",
  "human-in-the-loop-ai": "Human-in-the-loop AI",
  "evaluation-calibration": "Evaluation and calibration",
  "operational-ux": "Operational UX",
  "internal-tools": "Internal tools",
  "workflow-design": "Workflow design",
  "design-engineering": "Design engineering",
  "product-ownership": "Product ownership",
  "creative-technology": "Creative technology",
  "xr-spatial": "XR and spatial computing",
  "voice-interaction": "Voice interaction",
  accessibility: "Accessibility",
  "data-visualization": "Data visualization",
  prototyping: "Prototyping",
  "moderation-qa": "Moderation and QA",
  "privacy-trust": "Privacy and trust",
  "people-management": "People management",
  "ml-infrastructure": "Production ML infrastructure",
  "consumer-mobile": "Consumer mobile design",
}

const REQUIREMENT_WEIGHTS = { required: 5, preferred: 3, context: 1 } as const
const BASIS_WEIGHTS = { explicit: 1, inferred: 0.65 } as const
const REQUIREMENT_IMPORTANCE_RANK = { required: 3, preferred: 2, context: 1 } as const
const REQUIREMENT_BASIS_RANK = { explicit: 2, inferred: 1 } as const
const EVIDENCE_WEIGHTS: Record<EvidenceConfidence, number> = {
  direct: 4,
  supporting: 2.2,
  adjacent: 1,
}

function mergeRequirements(requirements: RoleRequirement[]): RoleRequirement[] {
  const merged = new Map<AdaptiveCapability, RoleRequirement>()

  for (const requirement of requirements) {
    const current = merged.get(requirement.capability)
    if (!current) {
      merged.set(requirement.capability, requirement)
      continue
    }

    merged.set(requirement.capability, {
      capability: requirement.capability,
      importance:
        REQUIREMENT_IMPORTANCE_RANK[requirement.importance] >
        REQUIREMENT_IMPORTANCE_RANK[current.importance]
          ? requirement.importance
          : current.importance,
      basis:
        REQUIREMENT_BASIS_RANK[requirement.basis] > REQUIREMENT_BASIS_RANK[current.basis]
          ? requirement.basis
          : current.basis,
    })
  }

  return [...merged.values()]
}

function evidenceStrength(evidence: ProjectEvidence, requirement: RoleRequirement): number {
  const outcomeBonus = evidence.outcome ? 0.3 : 0
  const ownershipBonus = evidence.ownership === "led" || evidence.ownership === "built" ? 0.4 : 0
  const deliveryBonus = evidence.evidenceType === "measured" || evidence.evidenceType === "shipped" ? 0.5 : 0
  return (
    REQUIREMENT_WEIGHTS[requirement.importance] *
      BASIS_WEIGHTS[requirement.basis] *
      EVIDENCE_WEIGHTS[evidence.confidence] +
    outcomeBonus +
    ownershipBonus +
    deliveryBonus
  )
}

function coverageForEvidence(evidence: ProjectEvidence[]): RequirementCoverageLevel {
  if (evidence.some((item) => item.confidence === "direct")) return "strong"
  if (evidence.some((item) => item.confidence === "supporting")) return "supporting"
  if (evidence.length) return "partial"
  return "not-demonstrated"
}

function confidenceRank(confidence: EvidenceConfidence): number {
  return confidence === "direct" ? 3 : confidence === "supporting" ? 2 : 1
}

export function buildRoleFitBrief(
  interpretation: RoleInterpretation,
  evidenceCatalog: ProjectEvidence[],
  canonicalProjectIds: string[],
  analysisSource: AdaptiveFocusAnalysisSource
): AdaptiveFocusV2Result {
  const mergedRequirements = mergeRequirements(interpretation.requirements)
  const normalizedInterpretation = {
    ...interpretation,
    requirements: mergedRequirements,
  }

  if (normalizedInterpretation.clarificationNeeded || mergedRequirements.length === 0) {
    return {
      schemaVersion: ADAPTIVE_FOCUS_SCHEMA_VERSION,
      analysisSource,
      briefTitle: "Role Fit Brief",
      interpretation: normalizedInterpretation,
      groups: { primary: [], supporting: [], adjacent: [] },
      requirementCoverage: [],
      gaps: [],
      summary: "I could not confidently interpret that request. Add a role, capability, or workflow.",
    }
  }

  const canonicalIndex = new Map(canonicalProjectIds.map((projectId, index) => [projectId, index]))
  const requirementsByCapability = new Map(
    mergedRequirements.map((requirement) => [requirement.capability, requirement])
  )
  const relevantEvidence = evidenceCatalog.filter((evidence) =>
    requirementsByCapability.has(evidence.capability)
  )
  const projectEvidence = new Map<string, ProjectEvidence[]>()

  for (const evidence of relevantEvidence) {
    const current = projectEvidence.get(evidence.projectId) ?? []
    current.push(evidence)
    projectEvidence.set(evidence.projectId, current)
  }

  const ranked = [...projectEvidence.entries()]
    .map(([projectId, evidence]) => {
      const bestByCapability = new Map<AdaptiveCapability, ProjectEvidence>()
      for (const item of evidence) {
        const current = bestByCapability.get(item.capability)
        if (!current || confidenceRank(item.confidence) > confidenceRank(current.confidence)) {
          bestByCapability.set(item.capability, item)
        }
      }
      const score = [...bestByCapability.values()].reduce((sum, item) => {
        const requirement = requirementsByCapability.get(item.capability)
        return requirement ? sum + evidenceStrength(item, requirement) : sum
      }, 0)
      const strongestConfidence = [...bestByCapability.values()].sort(
        (a, b) => confidenceRank(b.confidence) - confidenceRank(a.confidence)
      )[0]?.confidence
      const matchedCapabilities = [...bestByCapability.keys()]
      const selectedEvidence = [...bestByCapability.values()]
        .sort((a, b) => confidenceRank(b.confidence) - confidenceRank(a.confidence))
        .slice(0, 3)
      const level = strongestConfidence === "direct" ? "primary" : strongestConfidence === "supporting" ? "supporting" : "adjacent"
      const levelCopy = level === "primary" ? "Primary proof" : level === "supporting" ? "Strong supporting proof" : "Adjacent experience"
      const capabilityCopy = matchedCapabilities
        .map((capability) => formatLabelForSentence(CAPABILITY_LABELS[capability]))
        .join(", ")
      const firstEvidence = selectedEvidence[0]

      return {
        projectId,
        score,
        canonicalIndex: canonicalIndex.get(projectId) ?? Number.MAX_SAFE_INTEGER,
        match: {
          projectId,
          level,
          matchedCapabilities,
          matchedRequirements: matchedCapabilities.map((capability) => CAPABILITY_LABELS[capability]),
          evidence: selectedEvidence.map((item) => ({
            evidenceId: item.id,
            statement: item.statement,
            sourcePath: item.sourcePath,
            sourceSection: item.sourceSection,
            outcome: item.outcome,
          })),
          explanation: `${levelCopy} for ${capabilityCopy}. ${firstEvidence.statement}`,
        } satisfies ProjectMatch,
      }
    })
    .sort((a, b) => (b.score !== a.score ? b.score - a.score : a.canonicalIndex - b.canonicalIndex))

  const primaryCandidates = ranked.filter((item) => item.match.level === "primary")
  const primary = primaryCandidates.slice(0, 3).map((item) => item.match)
  const overflowPrimary = primaryCandidates.slice(3).map((item) => ({
    ...item.match,
    level: "supporting" as const,
    explanation: item.match.explanation.replace(/^Primary proof/u, "Strong supporting proof"),
  }))
  const supporting = [
    ...overflowPrimary,
    ...ranked.filter((item) => item.match.level === "supporting").map((item) => item.match),
  ]
  const adjacent = ranked.filter((item) => item.match.level === "adjacent").map((item) => item.match)

  const requirementCoverage: RequirementCoverage[] = mergedRequirements.map((requirement) => {
    const matchingEvidence = evidenceCatalog.filter((item) => item.capability === requirement.capability)
    const projectIds = [...new Set(matchingEvidence.map((item) => item.projectId))].sort(
      (a, b) => (canonicalIndex.get(a) ?? 999) - (canonicalIndex.get(b) ?? 999)
    )
    return {
      capability: requirement.capability,
      label: CAPABILITY_LABELS[requirement.capability],
      importance: requirement.importance,
      coverage: coverageForEvidence(matchingEvidence),
      projectIds: projectIds.slice(0, 4),
      evidenceIds: matchingEvidence.map((item) => item.id),
    }
  })
  const gaps = requirementCoverage
    .filter((item) => item.coverage === "not-demonstrated")
    .map((item) => ({
      capability: item.capability,
      label: item.label,
      reason: `No direct portfolio evidence is documented for ${formatLabelForSentence(item.label)}.`,
    }))

  return {
    schemaVersion: ADAPTIVE_FOCUS_SCHEMA_VERSION,
    analysisSource,
    briefTitle: "Role Fit Brief",
    interpretation: normalizedInterpretation,
    groups: { primary, supporting, adjacent },
    requirementCoverage,
    gaps,
    summary: createBriefSummary(primary, requirementCoverage, gaps),
  }
}
