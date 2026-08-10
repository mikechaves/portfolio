export const ANALYTICS_CONSENT_STORAGE_KEY = "portfolio.analytics-consent.v1"
export const ANALYTICS_PREFERENCES_EVENT = "portfolio:open-analytics-preferences"

export type AnalyticsConsent = "granted" | "denied" | "unknown"

export function normalizeGa4MeasurementId(value: string | undefined): string | null {
  const candidate = value?.trim().toUpperCase() ?? ""
  return /^G-[A-Z0-9]+$/u.test(candidate) ? candidate : null
}

export function parseAnalyticsConsent(value: string | null): AnalyticsConsent {
  return value === "granted" || value === "denied" ? value : "unknown"
}

export function getAnalyticsPageGroup(pathname: string): string {
  if (pathname === "/") return "portfolio_overview"
  if (pathname === "/about") return "operator_and_contact"
  if (pathname === "/projects") return "project_hub"
  if (pathname.startsWith("/projects/")) return "project_detail"
  if (pathname === "/blog") return "writing_hub"
  if (pathname.startsWith("/blog/")) return "article_summary"
  return "utility"
}
