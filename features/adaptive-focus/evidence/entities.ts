import { PROJECTS } from "@/data/projects"
import {
  PROFESSIONAL_EXPERIENCE_BY_ID,
  PROFESSIONAL_EXPERIENCE_IDS,
} from "./professional-experience"

export type EvidenceEntityKind = "public-project" | "professional-experience"

export interface EvidenceEntityRecord {
  id: string
  displayName: string
  kind: EvidenceEntityKind
}

export const PUBLIC_PROJECT_EVIDENCE_ENTITIES: EvidenceEntityRecord[] = PROJECTS.map(
  (project) => ({ id: project.id, displayName: project.title, kind: "public-project" })
)

export const PROFESSIONAL_EXPERIENCE_EVIDENCE_ENTITIES: EvidenceEntityRecord[] =
  PROFESSIONAL_EXPERIENCE_IDS.map((id) => {
    const record = PROFESSIONAL_EXPERIENCE_BY_ID.get(id)
    if (!record) throw new Error(`Missing professional experience record: ${id}`)
    return { id, displayName: record.company, kind: "professional-experience" }
  })

export const EVIDENCE_ENTITIES: EvidenceEntityRecord[] = [
  ...PUBLIC_PROJECT_EVIDENCE_ENTITIES,
  ...PROFESSIONAL_EXPERIENCE_EVIDENCE_ENTITIES,
]

export const EVIDENCE_ENTITY_BY_ID = new Map(
  EVIDENCE_ENTITIES.map((entity) => [entity.id, entity])
)

export const EVIDENCE_ENTITY_IDS = EVIDENCE_ENTITIES.map((entity) => entity.id)

export function isPublicProjectEvidenceEntity(id: string): boolean {
  return EVIDENCE_ENTITY_BY_ID.get(id)?.kind === "public-project"
}
