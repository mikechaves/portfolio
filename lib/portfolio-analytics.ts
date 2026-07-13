import { track } from "@vercel/analytics"

export type AdaptiveFocusEntryPoint = "home" | "projects" | "handoff"
export type AdaptiveFocusMode = "preset" | "custom"
export type ProjectEvidenceSource =
  | "home_featured"
  | "project_archive"
  | "role_fit_primary"
  | "role_fit_supporting"
  | "role_fit_adjacent"
  | "role_fit_archive"
  | "dossier_related"
  | "about_proof"
export type ProjectMatchLevel = "primary" | "supporting" | "adjacent" | "unranked"
export type PortfolioConversionSource =
  | "about_hero"
  | "about_contact"
  | "about_proof"
  | "dossier_exit"

export interface PortfolioAnalyticsEventMap {
  adaptive_focus_started: {
    entry_point: AdaptiveFocusEntryPoint
    mode: AdaptiveFocusMode
  }
  adaptive_focus_completed: {
    entry_point: AdaptiveFocusEntryPoint
    mode: AdaptiveFocusMode
    analysis_source: "preset" | "gpt" | "local-fallback"
    clarification_needed: boolean
    requirement_count: number
    primary_project_count: number
  }
  adaptive_focus_failed: {
    entry_point: AdaptiveFocusEntryPoint
    mode: AdaptiveFocusMode
  }
  project_evidence_opened: {
    project_id: string
    source: ProjectEvidenceSource
    match_level: ProjectMatchLevel
  }
  portfolio_conversion_clicked: {
    destination: "role_fit" | "contact" | "resume"
    source: PortfolioConversionSource
    project_id?: string
  }
  portfolio_contact_submitted: {
    source: "about_form"
  }
}

export type PortfolioAnalyticsEventName = keyof PortfolioAnalyticsEventMap
type AllowedPropertyValue = string | number | boolean | null | undefined

export const PORTFOLIO_ANALYTICS_PROPERTY_ALLOWLIST = {
  adaptive_focus_started: ["entry_point", "mode"],
  adaptive_focus_completed: [
    "entry_point",
    "mode",
    "analysis_source",
    "clarification_needed",
    "requirement_count",
    "primary_project_count",
  ],
  adaptive_focus_failed: ["entry_point", "mode"],
  project_evidence_opened: ["project_id", "source", "match_level"],
  portfolio_conversion_clicked: ["destination", "source", "project_id"],
  portfolio_contact_submitted: ["source"],
} as const satisfies {
  [Name in PortfolioAnalyticsEventName]: readonly (keyof PortfolioAnalyticsEventMap[Name])[]
}

export function buildPortfolioAnalyticsProperties<Name extends PortfolioAnalyticsEventName>(
  name: Name,
  properties: PortfolioAnalyticsEventMap[Name]
): Record<string, AllowedPropertyValue> {
  const allowedKeys = PORTFOLIO_ANALYTICS_PROPERTY_ALLOWLIST[name]
  const source = properties as Record<string, AllowedPropertyValue>
  const safeProperties: Record<string, AllowedPropertyValue> = {}

  for (const key of allowedKeys) {
    const value = source[key]
    if (value !== undefined) safeProperties[key] = value
  }

  return safeProperties
}

export function trackPortfolioEvent<Name extends PortfolioAnalyticsEventName>(
  name: Name,
  properties: PortfolioAnalyticsEventMap[Name]
): void {
  try {
    track(name, buildPortfolioAnalyticsProperties(name, properties))
  } catch {
    // Analytics must never interrupt portfolio navigation or conversion flows.
  }
}
