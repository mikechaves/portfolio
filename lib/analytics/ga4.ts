import type {
  PortfolioAnalyticsBrowserEventDetail,
  PortfolioAnalyticsEventName,
} from "@/lib/portfolio-analytics"

export interface Ga4Event {
  name: string
  parameters: Record<string, string | number | boolean>
}

function definedParameters(
  properties: PortfolioAnalyticsBrowserEventDetail["properties"]
): Record<string, string | number | boolean> {
  return Object.fromEntries(
    Object.entries(properties).filter(
      (entry): entry is [string, string | number | boolean] =>
        typeof entry[1] === "string" ||
        typeof entry[1] === "number" ||
        typeof entry[1] === "boolean"
    )
  )
}

export function mapPortfolioEventToGa4(
  name: PortfolioAnalyticsEventName,
  properties: PortfolioAnalyticsBrowserEventDetail["properties"]
): Ga4Event {
  const safe = definedParameters(properties)

  switch (name) {
    case "project_evidence_opened":
      return {
        name: "select_content",
        parameters: {
          content_type: "project_evidence",
          item_id: String(safe.project_id),
          match_level: String(safe.match_level),
          source: String(safe.source),
        },
      }
    case "article_original_opened":
      return {
        name: "select_content",
        parameters: {
          content_type: "original_article",
          item_id: String(safe.article_id),
          source: String(safe.source),
        },
      }
    case "public_practice_item_opened":
      return {
        name: "select_content",
        parameters: {
          content_type: String(safe.item_type),
          item_id: String(safe.item_id),
          source: String(safe.source),
        },
      }
    case "homepage_path_selected":
      return {
        name: "select_content",
        parameters: {
          content_type: "homepage_path",
          item_id: String(safe.path),
          source: String(safe.source),
        },
      }
    case "adaptive_focus_more_lenses_expanded":
      return {
        name: "view_item_list",
        parameters: {
          item_list_id: "adaptive_focus_more_lenses",
          source: String(safe.entry_point),
        },
      }
    case "metaverse_entered":
      return {
        name: "select_content",
        parameters: {
          content_type: "optional_metaverse",
          item_id: "metaverse",
          source: String(safe.source),
        },
      }
    case "project_shared":
      return {
        name: "share",
        parameters: {
          content_type: "project_case_study",
          item_id: String(safe.project_id),
          method: String(safe.method),
          source: String(safe.source),
        },
      }
    case "portfolio_conversion_clicked":
      return {
        name: "select_content",
        parameters: {
          content_type: "portfolio_conversion",
          item_id: String(safe.destination),
          source: String(safe.source),
          ...(safe.project_id ? { project_id: String(safe.project_id) } : {}),
        },
      }
    case "portfolio_contact_submitted":
      return {
        name: "generate_lead",
        parameters: {
          method: "contact_form",
          source: String(safe.source),
        },
      }
    case "portfolio_contact_failed":
      return {
        name: "contact_form_error",
        parameters: {
          failure_type: String(safe.failure_type),
          source: String(safe.source),
        },
      }
    default:
      return { name, parameters: safe }
  }
}
