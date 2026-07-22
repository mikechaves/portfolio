import type {
  EvidenceEntityExclusion,
  EvidenceRecord,
} from "../../../packages/adaptive-focus-core/src"

export interface EvidenceIntegrityIssue {
  type:
    | "missing-entity"
    | "unknown-evidence-entity"
    | "unknown-exclusion-entity"
    | "duplicate-evidence-id"
    | "empty-evidence-statement"
    | "invalid-source-path"
  value: string
}

function expectedSourcePath(entityId: string): string {
  return entityId.startsWith("employment-")
    ? "/about#professional-experience"
    : `/projects/${entityId}`
}

export function validateEvidenceIntegrity(
  entityIds: readonly string[],
  evidence: EvidenceRecord[],
  exclusions: EvidenceEntityExclusion[]
): EvidenceIntegrityIssue[] {
  const knownEntities = new Set(entityIds)
  const coveredEntities = new Set(evidence.map((item) => item.entityId))
  const excludedEntities = new Set(exclusions.map((item) => item.entityId))
  const seenEvidenceIds = new Set<string>()
  const issues: EvidenceIntegrityIssue[] = []

  for (const item of evidence) {
    if (!knownEntities.has(item.entityId)) {
      issues.push({ type: "unknown-evidence-entity", value: item.entityId })
    }
    if (seenEvidenceIds.has(item.id)) {
      issues.push({ type: "duplicate-evidence-id", value: item.id })
    }
    if (!item.statement.trim()) {
      issues.push({ type: "empty-evidence-statement", value: item.id })
    }
    if (item.sourcePath !== expectedSourcePath(item.entityId)) {
      issues.push({ type: "invalid-source-path", value: item.id })
    }
    seenEvidenceIds.add(item.id)
  }

  for (const exclusion of exclusions) {
    if (!knownEntities.has(exclusion.entityId)) {
      issues.push({ type: "unknown-exclusion-entity", value: exclusion.entityId })
    }
  }

  for (const entityId of entityIds) {
    if (!coveredEntities.has(entityId) && !excludedEntities.has(entityId)) {
      issues.push({ type: "missing-entity", value: entityId })
    }
  }

  return issues
}
