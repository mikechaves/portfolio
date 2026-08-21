import { mapPortfolioEventToGa4 } from "@/lib/analytics/ga4"

describe("GA4 event mapping", () => {
  it("uses recommended events when they match the real action", () => {
    expect(
      mapPortfolioEventToGa4("portfolio_contact_submitted", { source: "about_form" })
    ).toEqual({
      name: "generate_lead",
      parameters: { method: "contact_form", source: "about_form" },
    })

    expect(
      mapPortfolioEventToGa4("project_shared", {
        method: "native",
        project_id: "x-games",
        source: "project_header",
      })
    ).toEqual({
      name: "share",
      parameters: {
        content_type: "project_case_study",
        item_id: "x-games",
        method: "native",
        source: "project_header",
      },
    })
  })

  it("keeps product-specific funnel and failure names", () => {
    expect(
      mapPortfolioEventToGa4("adaptive_focus_completed", {
        analysis_source: "gpt",
        clarification_needed: false,
        entry_point: "home",
        mode: "custom",
        primary_project_count: 3,
        requirement_count: 4,
      })
    ).toEqual({
      name: "adaptive_focus_completed",
      parameters: {
        analysis_source: "gpt",
        clarification_needed: false,
        entry_point: "home",
        mode: "custom",
        primary_project_count: 3,
        requirement_count: 4,
      },
    })

    expect(
      mapPortfolioEventToGa4("portfolio_contact_failed", {
        failure_type: "delivery",
        source: "about_form",
      })
    ).toEqual({
      name: "contact_form_error",
      parameters: { failure_type: "delivery", source: "about_form" },
    })
  })

  it("drops undefined values before provider delivery", () => {
    expect(
      mapPortfolioEventToGa4("portfolio_conversion_clicked", {
        destination: "contact",
        project_id: undefined,
        source: "dossier_exit",
      })
    ).toEqual({
      name: "select_content",
      parameters: {
        content_type: "portfolio_conversion",
        item_id: "contact",
        source: "dossier_exit",
      },
    })
  })

  it("maps bounded homepage journey events to content interactions", () => {
    expect(
      mapPortfolioEventToGa4("homepage_path_selected", {
        path: "selected_work",
        source: "home_hero",
      })
    ).toEqual({
      name: "select_content",
      parameters: {
        content_type: "homepage_path",
        item_id: "selected_work",
        source: "home_hero",
      },
    })

    expect(
      mapPortfolioEventToGa4("metaverse_entered", { source: "desktop_nav" })
    ).toEqual({
      name: "select_content",
      parameters: {
        content_type: "optional_metaverse",
        item_id: "metaverse",
        source: "desktop_nav",
      },
    })
  })
})
