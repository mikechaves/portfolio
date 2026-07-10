import type { ProjectEvidence, ProjectEvidenceExclusion } from "../../../packages/adaptive-focus-core/src"

export interface EvidenceIntegrityIssue {
  type:
    | "missing-project"
    | "unknown-evidence-project"
    | "unknown-exclusion-project"
    | "duplicate-evidence-id"
    | "empty-evidence-statement"
    | "invalid-source-path"
  value: string
}

export function validateEvidenceIntegrity(
  projectIds: string[],
  evidence: ProjectEvidence[],
  exclusions: ProjectEvidenceExclusion[]
): EvidenceIntegrityIssue[] {
  const knownProjects = new Set(projectIds)
  const coveredProjects = new Set(evidence.map((item) => item.projectId))
  const excludedProjects = new Set(exclusions.map((item) => item.projectId))
  const seenEvidenceIds = new Set<string>()
  const issues: EvidenceIntegrityIssue[] = []

  for (const item of evidence) {
    if (!knownProjects.has(item.projectId)) {
      issues.push({ type: "unknown-evidence-project", value: item.projectId })
    }
    if (seenEvidenceIds.has(item.id)) {
      issues.push({ type: "duplicate-evidence-id", value: item.id })
    }
    if (!item.statement.trim()) {
      issues.push({ type: "empty-evidence-statement", value: item.id })
    }
    if (item.sourcePath !== `/projects/${item.projectId}`) {
      issues.push({ type: "invalid-source-path", value: item.id })
    }
    seenEvidenceIds.add(item.id)
  }

  for (const exclusion of exclusions) {
    if (!knownProjects.has(exclusion.projectId)) {
      issues.push({ type: "unknown-exclusion-project", value: exclusion.projectId })
    }
  }

  for (const projectId of projectIds) {
    if (!coveredProjects.has(projectId) && !excludedProjects.has(projectId)) {
      issues.push({ type: "missing-project", value: projectId })
    }
  }

  return issues
}
