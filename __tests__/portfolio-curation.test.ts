import rawProjects from "@/public/data/projects.json"
import {
  GAME_INTERACTIVE_PROJECT_IDS,
  HOMEPAGE_FEATURED_PROJECT_IDS,
  IMMERSIVE_NAV_PROJECT_IDS,
  PUBLIC_PROJECT_ORDER,
  validatePublicProjectCuration,
} from "@/data/portfolio-curation"
import { getProjectsForCategory, PROJECT_CATEGORIES } from "@/data/project-categories"
import { PROJECTS } from "@/data/projects"
import { PROFESSIONAL_EXPERIENCE_IDS } from "@/features/adaptive-focus/evidence/professional-experience"

const RETIRED_PUBLIC_IDS = [
  "astrocade-qa-calibration-tool",
  "apt-plus",
  "gaia",
  "transcribe",
]

describe("public portfolio curation", () => {
  it("uses the explicit canonical public order exactly once", () => {
    expect(PROJECTS.map((project) => project.id)).toEqual(PUBLIC_PROJECT_ORDER)
    expect(new Set(PUBLIC_PROJECT_ORDER).size).toBe(PUBLIC_PROJECT_ORDER.length)
    expect(validatePublicProjectCuration(Object.keys(rawProjects))).toEqual([])
  })

  it("uses the approved homepage and immersive selections", () => {
    expect(HOMEPAGE_FEATURED_PROJECT_IDS).toEqual(["wizzo", "x-games", "speakeasy"])
    expect(IMMERSIVE_NAV_PROJECT_IDS).toEqual([
      "wizzo",
      "x-games",
      "speakeasy",
      "sound-escape-vr",
      "material-explorer",
      "portals",
    ])
  })

  it("removes proprietary case studies from public project data", () => {
    for (const id of RETIRED_PUBLIC_IDS) {
      expect(PROJECTS.some((project) => project.id === id)).toBe(false)
      expect(Object.hasOwn(rawProjects, id)).toBe(false)
    }
  })

  it("keeps professional experience out of every public project set", () => {
    const allPublicIds = new Set<string>([
      ...PUBLIC_PROJECT_ORDER,
      ...HOMEPAGE_FEATURED_PROJECT_IDS,
      ...GAME_INTERACTIVE_PROJECT_IDS,
      ...IMMERSIVE_NAV_PROJECT_IDS,
    ])
    for (const id of PROFESSIONAL_EXPERIENCE_IDS) {
      expect(allPublicIds.has(id)).toBe(false)
      expect(PROJECTS.some((project) => project.id === id)).toBe(false)
    }
  })

  it("provides the Games & Interactive virtual category without changing project types", () => {
    expect(PROJECT_CATEGORIES.map((category) => category.name)).toEqual([
      "All Projects",
      "AI",
      "Games & Interactive",
      "XR & Spatial",
      "Web Development",
      "UX/UI Design",
      "Research",
    ])
    expect(getProjectsForCategory("games").map((project) => project.id)).toEqual(
      GAME_INTERACTIVE_PROJECT_IDS
    )
    expect(getProjectsForCategory("all")).toHaveLength(PUBLIC_PROJECT_ORDER.length)
  })
})
