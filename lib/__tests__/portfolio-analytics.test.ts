import { track } from "@vercel/analytics"
import {
  buildPortfolioAnalyticsProperties,
  PORTFOLIO_ANALYTICS_PROPERTY_ALLOWLIST,
  trackPortfolioEvent,
  type PortfolioAnalyticsEventMap,
} from "@/lib/portfolio-analytics"

jest.mock("@vercel/analytics", () => ({
  track: jest.fn(),
}))

const mockedTrack = jest.mocked(track)

describe("portfolio analytics", () => {
  beforeEach(() => {
    mockedTrack.mockReset()
  })

  it("sends only the properties allowed for an event", () => {
    const properties = {
      entry_point: "home",
      mode: "custom",
      input: "confidential role text",
      email: "visitor@example.com",
    } as PortfolioAnalyticsEventMap["adaptive_focus_started"]

    expect(buildPortfolioAnalyticsProperties("adaptive_focus_started", properties)).toEqual({
      entry_point: "home",
      mode: "custom",
    })
  })

  it("tracks a bounded completion summary without visitor text", () => {
    trackPortfolioEvent("adaptive_focus_completed", {
      entry_point: "projects",
      mode: "custom",
      analysis_source: "gpt",
      clarification_needed: false,
      requirement_count: 4,
      primary_project_count: 3,
    })

    expect(mockedTrack).toHaveBeenCalledWith("adaptive_focus_completed", {
      entry_point: "projects",
      mode: "custom",
      analysis_source: "gpt",
      clarification_needed: false,
      requirement_count: 4,
      primary_project_count: 3,
    })
  })

  it("keeps analytics failures out of user workflows", () => {
    mockedTrack.mockImplementationOnce(() => {
      throw new Error("analytics unavailable")
    })

    expect(() =>
      trackPortfolioEvent("portfolio_conversion_clicked", {
        destination: "contact",
        source: "dossier_exit",
        project_id: "x-games",
      })
    ).not.toThrow()
  })

  it("does not allow raw visitor-data fields in any event contract", () => {
    const forbiddenProperty = /input|query|text|description|message|email|company|role_title/i
    const propertyNames = Object.values(PORTFOLIO_ANALYTICS_PROPERTY_ALLOWLIST).flat()

    expect(propertyNames).not.toEqual(expect.arrayContaining([expect.stringMatching(forbiddenProperty)]))
  })
})
