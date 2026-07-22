import { PROJECTS } from "@/data/projects"
import { EVIDENCE_CATALOG } from "@/features/adaptive-focus/evidence/catalog"
import { encodeAdaptiveFocusInterpretationHandoff } from "@/features/adaptive-focus/handoff"
import type { EvidenceRecord } from "@/features/adaptive-focus/types"
import { CAPABILITY_LABELS, type AdaptiveCapability } from "@/packages/adaptive-focus-core/src"

const CONFIDENCE_WEIGHT: Record<EvidenceRecord["confidence"], number> = {
  direct: 3,
  supporting: 2,
  adjacent: 1,
}

const MAX_FOCUS_CAPABILITIES = 4
const MAX_RELATED_PROJECTS = 2

export interface RelatedEvidenceRoute {
  projectId: string
  title: string
  description: string
  sharedCapabilities: AdaptiveCapability[]
  sharedCapabilityLabels: string[]
}

export interface DossierExitPath {
  capabilities: AdaptiveCapability[]
  capabilityLabels: string[]
  focusHref: string
  relatedProjects: RelatedEvidenceRoute[]
}

function capabilityWeights(projectId: string, evidence: EvidenceRecord[]) {
  const weights = new Map<AdaptiveCapability, number>()

  evidence.forEach((item) => {
    if (item.entityId !== projectId) return
    weights.set(
      item.capability,
      Math.max(weights.get(item.capability) ?? 0, CONFIDENCE_WEIGHT[item.confidence])
    )
  })

  return weights
}

export function getProjectCapabilities(
  projectId: string,
  evidence: EvidenceRecord[] = EVIDENCE_CATALOG
): AdaptiveCapability[] {
  const weights = capabilityWeights(projectId, evidence)
  return [...weights.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([capability]) => capability)
}

export function getRelatedEvidenceRoutes(
  projectId: string,
  evidence: EvidenceRecord[] = EVIDENCE_CATALOG
): RelatedEvidenceRoute[] {
  const sourceWeights = capabilityWeights(projectId, evidence)
  const canonicalIndex = new Map(PROJECTS.map((project, index) => [project.id, index]))

  return PROJECTS.filter((project) => project.id !== projectId)
    .map((project) => {
      const candidateWeights = capabilityWeights(project.id, evidence)
      const sharedCapabilities = [...sourceWeights.keys()].filter((capability) =>
        candidateWeights.has(capability)
      )
      const score = sharedCapabilities.reduce(
        (total, capability) =>
          total + Math.min(sourceWeights.get(capability) ?? 0, candidateWeights.get(capability) ?? 0),
        0
      )

      return {
        ...project,
        score,
        sharedCapabilities,
      }
    })
    .sort(
      (left, right) =>
        right.score - left.score ||
        (canonicalIndex.get(left.id) ?? Number.MAX_SAFE_INTEGER) -
          (canonicalIndex.get(right.id) ?? Number.MAX_SAFE_INTEGER)
    )
    .slice(0, MAX_RELATED_PROJECTS)
    .map((project) => ({
      projectId: project.id,
      title: project.title,
      description: project.description,
      sharedCapabilities: project.sharedCapabilities,
      sharedCapabilityLabels: project.sharedCapabilities.map(
        (capability) => CAPABILITY_LABELS[capability]
      ),
    }))
}

export function buildProjectFocusHref(capabilities: AdaptiveCapability[]): string {
  const selectedCapabilities = capabilities.slice(0, MAX_FOCUS_CAPABILITIES)
  const interpretation = {
    normalizedInput: selectedCapabilities.map((capability) => CAPABILITY_LABELS[capability]).join(", "),
    roleTitle: null,
    roleFamily: "unknown" as const,
    seniority: "unspecified" as const,
    companyContext: null,
    requirements: selectedCapabilities.map((capability) => ({
      capability,
      importance: "preferred" as const,
      basis: "explicit" as const,
    })),
    responsibilities: [],
    desiredOutcomes: [],
    confidence: selectedCapabilities.length > 0 ? 1 : 0,
    clarificationNeeded: selectedCapabilities.length === 0,
    clarificationQuestion:
      selectedCapabilities.length === 0
        ? "Add a role, capability, or workflow so Adaptive Focus can build a grounded brief."
        : null,
  }
  const token = encodeAdaptiveFocusInterpretationHandoff(interpretation, "preset")
  return `/projects?focusBrief=${encodeURIComponent(token)}#adaptive-focus-controls-heading`
}

export function getDossierExitPath(projectId: string): DossierExitPath {
  const capabilities = getProjectCapabilities(projectId).slice(0, MAX_FOCUS_CAPABILITIES)
  return {
    capabilities,
    capabilityLabels: capabilities.map((capability) => CAPABILITY_LABELS[capability]),
    focusHref: buildProjectFocusHref(capabilities),
    relatedProjects: getRelatedEvidenceRoutes(projectId),
  }
}
