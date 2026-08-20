import {
  buildPortfolioAnalyticsProperties,
  PORTFOLIO_ANALYTICS_PROPERTY_ALLOWLIST,
  trackPortfolioEvent,
  type PortfolioAnalyticsEventMap,
} from "@/lib/portfolio-analytics"

describe("portfolio analytics", () => {
  const dispatchEvent = jest.fn()

  beforeEach(() => {
    dispatchEvent.mockReset()
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { dispatchEvent },
    })
  })

  afterEach(() => {
    Reflect.deleteProperty(globalThis, "window")
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

    const event = dispatchEvent.mock.calls[0]?.[0] as CustomEvent
    expect(event.detail).toEqual({
      name: "adaptive_focus_completed",
      properties: {
        entry_point: "projects",
        mode: "custom",
        analysis_source: "gpt",
        clarification_needed: false,
        requirement_count: 4,
        primary_project_count: 3,
      },
    })
  })

  it("keeps analytics failures out of user workflows", () => {
    dispatchEvent.mockImplementationOnce(() => {
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

  it("tracks only a bounded project share result", () => {
    trackPortfolioEvent("project_shared", {
      method: "clipboard",
      project_id: "x-games",
      source: "project_header",
    })

    const event = dispatchEvent.mock.calls[0]?.[0] as CustomEvent
    expect(event.detail).toEqual({
      name: "project_shared",
      properties: {
        method: "clipboard",
        project_id: "x-games",
        source: "project_header",
      },
    })
  })

  it("tracks homepage paths and disclosure without role or contact text", () => {
    trackPortfolioEvent("homepage_path_selected", {
      path: "role_match",
      source: "home_hero",
    })
    trackPortfolioEvent("adaptive_focus_more_lenses_expanded", {
      entry_point: "home",
    })
    trackPortfolioEvent("public_practice_item_opened", {
      item_id: "futuressummit-2025",
      item_type: "panel",
      source: "home_public_practice",
    })

    expect(dispatchEvent.mock.calls.map(([event]) => (event as CustomEvent).detail)).toEqual([
      {
        name: "homepage_path_selected",
        properties: { path: "role_match", source: "home_hero" },
      },
      {
        name: "adaptive_focus_more_lenses_expanded",
        properties: { entry_point: "home" },
      },
      {
        name: "public_practice_item_opened",
        properties: {
          item_id: "futuressummit-2025",
          item_type: "panel",
          source: "home_public_practice",
        },
      },
    ])
  })

  it("does not allow raw visitor-data fields in any event contract", () => {
    const forbiddenProperty = /input|query|text|description|message|email|company|role_title/i
    const propertyNames = Object.values(PORTFOLIO_ANALYTICS_PROPERTY_ALLOWLIST).flat()

    expect(propertyNames).not.toEqual(expect.arrayContaining([expect.stringMatching(forbiddenProperty)]))
  })
})
