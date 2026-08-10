import {
  getAnalyticsPageGroup,
  normalizeGa4MeasurementId,
  parseAnalyticsConsent,
} from "@/lib/analytics/config"

describe("analytics configuration", () => {
  it("accepts GA4 measurement IDs but rejects origins and legacy IDs", () => {
    expect(normalizeGa4MeasurementId(" g-abc123def4 ")).toBe("G-ABC123DEF4")
    expect(normalizeGa4MeasurementId("UA-12345-1")).toBeNull()
    expect(normalizeGa4MeasurementId("https://www.google-analytics.com")).toBeNull()
    expect(normalizeGa4MeasurementId(undefined)).toBeNull()
  })

  it("fails closed for unknown stored consent", () => {
    expect(parseAnalyticsConsent("granted")).toBe("granted")
    expect(parseAnalyticsConsent("denied")).toBe("denied")
    expect(parseAnalyticsConsent("yes")).toBe("unknown")
    expect(parseAnalyticsConsent(null)).toBe("unknown")
  })

  it("assigns stable, query-free acquisition page groups", () => {
    expect(getAnalyticsPageGroup("/")).toBe("portfolio_overview")
    expect(getAnalyticsPageGroup("/projects/x-games")).toBe("project_detail")
    expect(getAnalyticsPageGroup("/blog/voice-first-xr")).toBe("article_summary")
    expect(getAnalyticsPageGroup("/error")).toBe("utility")
  })
})
