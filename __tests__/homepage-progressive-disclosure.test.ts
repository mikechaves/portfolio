import fs from "node:fs"
import path from "node:path"
import { HOMEPAGE_FEATURED_PROJECT_IDS, PUBLIC_PROJECT_ORDER } from "@/data/portfolio-curation"
import { PROFESSIONAL_EXPERIENCE_RECORDS } from "@/features/adaptive-focus/evidence/professional-experience"

const readSource = (relativePath: string) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8")

describe("homepage progressive disclosure", () => {
  const homeSource = readSource("components/homepage-content.tsx")
  const pageSource = readSource("pages/index.tsx")
  const focusSource = readSource("components/adaptive-focus-entry.tsx")
  const bridgeSource = readSource("public/scripts/homepage.js")

  it("opens with identity and real work while keeping professional detail available", () => {
    expect(homeSource).toContain("Creative Director & Creative Technologist")
    expect(homeSource).toContain('id="home-title"')
    expect(homeSource).toContain("<ProjectTheater />")
    expect(homeSource).toContain("Résumé (PDF)")
    expect(homeSource).not.toContain("Give your next idea a point of view")
  })

  it("keeps the creative platform in the requested order", () => {
    const positions = ["<ProjectTheater />", "<AdaptiveFocusEntry />", 'id="work"', 'id="writing"', 'id="appearances"', 'id="music"', 'id="contact"'].map(id => homeSource.indexOf(id))
    expect(positions.every(position => position >= 0)).toBe(true)
    expect([...positions].sort((a,b) => a-b)).toEqual(positions)
  })

  it("preserves the flagship and full public project order", () => {
    expect(HOMEPAGE_FEATURED_PROJECT_IDS).toEqual(["wizzo", "x-games", "speakeasy"])
    expect(PUBLIC_PROJECT_ORDER).toHaveLength(11)
    expect(homeSource).toContain('actionLabel: "View Playfold"')
    expect(homeSource).toContain("<FeaturedProjectCard")
    expect(homeSource).not.toContain("<ProjectCard")
    expect(homeSource).not.toContain('href="/projects/playfold"')
  })

  it("preserves professional records on the About page for inquirers", () => {
    expect(PROFESSIONAL_EXPERIENCE_RECORDS.map((record) => record.id)).toEqual([
      "employment-knitting-factory",
      "employment-power",
      "employment-astrocade",
      "employment-snorkel",
      "employment-ford",
      "employment-starbucks",
    ])
    expect(readSource("components/about-content.tsx")).toContain("PROFESSIONAL_EXPERIENCE_RECORDS.map")
    expect(homeSource).toContain('href="/about"')
  })

  it("shows four role lenses before a native More lenses disclosure", () => {
    expect(focusSource).toContain('"creative-direction"')
    expect(focusSource).toContain('"game-ux-creator-systems"')
    expect(focusSource).toContain('"xr-accessibility"')
    expect(focusSource).toContain('"design-engineering"')
    expect(focusSource).toContain("<details")
    expect(focusSource).toContain("More lenses")
    expect(focusSource).toContain("Custom role text is processed by OpenAI and not stored")
    expect(focusSource).toContain("Do not submit confidential")
    expect(focusSource).not.toContain("Build Role Fit Brief")
  })

  it("adds a skip link and keeps new contact paths on the protected form", () => {
    expect(pageSource).toContain('href="#main-content"')
    expect(pageSource).toContain('id="main-content"')
    expect(pageSource).not.toContain("AdaptiveFocusHandoffProvider")
    expect(bridgeSource).toContain('const pendingKey = "adaptive-focus:pending:v2"')
    expect(bridgeSource).toContain("window.sessionStorage.setItem(pendingKey, payload)")
    expect(homeSource).toContain('href="/about#contact"')
    expect(homeSource).not.toMatch(/mailto:/u)
  })
})
