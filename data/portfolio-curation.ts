export const PUBLIC_PROJECT_ORDER = [
  "wizzo",
  "x-games",
  "speakeasy",
  "sound-escape-vr",
  "material-explorer",
  "geovoice",
  "vulnerability-visualizer",
  "petition-ready",
  "creative-supply-engine",
  "portals",
  "die-ai",
] as const

export type PublicProjectId = (typeof PUBLIC_PROJECT_ORDER)[number]

export const HOMEPAGE_FEATURED_PROJECT_IDS = [
  "wizzo",
  "x-games",
  "speakeasy",
] as const satisfies readonly PublicProjectId[]

export const GAME_INTERACTIVE_PROJECT_IDS = [
  "x-games",
  "sound-escape-vr",
  "portals",
  "die-ai",
] as const satisfies readonly PublicProjectId[]

export const IMMERSIVE_NAV_PROJECT_IDS = [
  "wizzo",
  "x-games",
  "speakeasy",
  "sound-escape-vr",
  "material-explorer",
  "portals",
] as const satisfies readonly PublicProjectId[]

export const PUBLIC_PROJECT_ID_SET = new Set<string>(PUBLIC_PROJECT_ORDER)
export const GAME_INTERACTIVE_PROJECT_ID_SET = new Set<string>(GAME_INTERACTIVE_PROJECT_IDS)

export interface PublicCurationIssue {
  type: "missing-curated-project" | "uncurated-public-project" | "non-public-id"
  value: string
}

export function validatePublicProjectCuration(publicProjectIds: readonly string[]): PublicCurationIssue[] {
  const available = new Set(publicProjectIds)
  const issues: PublicCurationIssue[] = []

  for (const id of PUBLIC_PROJECT_ORDER) {
    if (!available.has(id)) issues.push({ type: "missing-curated-project", value: id })
    if (id.startsWith("employment-")) issues.push({ type: "non-public-id", value: id })
  }

  for (const id of available) {
    if (!PUBLIC_PROJECT_ID_SET.has(id)) {
      issues.push({ type: "uncurated-public-project", value: id })
    }
  }

  return issues
}
