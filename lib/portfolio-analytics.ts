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
  | "home_hero"
  | "home_contact"
  | "site_nav"
export type ProjectShareSource = "project_header"
export type ContactFailureType = "configuration" | "validation" | "delivery" | "unexpected"

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
  homepage_path_selected: {
    path: "selected_work" | "role_match"
    source: "home_hero"
  }
  adaptive_focus_more_lenses_expanded: {
    entry_point: "home"
  }
  project_evidence_opened: {
    project_id: string
    source: ProjectEvidenceSource
    match_level: ProjectMatchLevel
  }
  project_shared: {
    method: "native" | "clipboard"
    project_id: string
    source: ProjectShareSource
  }
  article_original_opened: {
    article_id: string
    source: "article_summary"
  }
  public_practice_item_opened: {
    item_id: string
    item_type: "writing" | "talk" | "panel"
    source: "home_public_practice"
  }
  metaverse_entered: {
    source: "desktop_nav" | "mobile_nav"
  }
  portfolio_conversion_clicked: {
    destination: "role_fit" | "contact" | "resume" | "linkedin"
    source: PortfolioConversionSource
    project_id?: string
  }
  portfolio_contact_submitted: {
    source: "about_form"
  }
  portfolio_contact_failed: {
    failure_type: ContactFailureType
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
  homepage_path_selected: ["path", "source"],
  adaptive_focus_more_lenses_expanded: ["entry_point"],
  project_evidence_opened: ["project_id", "source", "match_level"],
  project_shared: ["method", "project_id", "source"],
  article_original_opened: ["article_id", "source"],
  public_practice_item_opened: ["item_id", "item_type", "source"],
  metaverse_entered: ["source"],
  portfolio_conversion_clicked: ["destination", "source", "project_id"],
  portfolio_contact_submitted: ["source"],
  portfolio_contact_failed: ["failure_type", "source"],
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
    if (typeof window === "undefined") return

    window.dispatchEvent(
      new CustomEvent(PORTFOLIO_ANALYTICS_BROWSER_EVENT, {
        detail: {
          name,
          properties: buildPortfolioAnalyticsProperties(name, properties),
        } satisfies PortfolioAnalyticsBrowserEventDetail,
      })
    )
  } catch {
    // Analytics must never interrupt portfolio navigation or conversion flows.
  }
}

export const PORTFOLIO_ANALYTICS_BROWSER_EVENT = "portfolio:analytics-event"

export interface PortfolioAnalyticsBrowserEventDetail {
  name: PortfolioAnalyticsEventName
  properties: Record<string, AllowedPropertyValue>
}
