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

  it("publishes the hiring-first statement and three requested hero actions", () => {
    expect(homeSource).toContain("AI-Native Design Engineer")
    expect(homeSource).toContain(
      "I build AI product systems, playable experiences, and immersive tools."
    )
    expect(homeSource).toContain("Founder of Wizzo Labs")
    expect(homeSource).toContain("View selected work")
    expect(homeSource).toContain("Match me to a role")
    expect(homeSource).toContain("Download resume")
  })

  it("keeps the primary journey in the required source order", () => {
    const ids = [
      'id="selected-work"',
      'id="professional-experience"',
      'id="capabilities-title"',
      'id="writing"',
      'id="contact"',
    ]
    const positions = ids.map((id) => homeSource.indexOf(id))
    expect(positions.every((position) => position >= 0)).toBe(true)
    expect([...positions].sort((left, right) => left - right)).toEqual(positions)
  })

  it("preserves the flagship and full public project order", () => {
    expect(HOMEPAGE_FEATURED_PROJECT_IDS).toEqual(["wizzo", "x-games", "speakeasy"])
    expect(PUBLIC_PROJECT_ORDER).toHaveLength(11)
    expect(homeSource).toContain('actionLabel: "View Playfold"')
    expect(homeSource).toContain("<FeaturedProjectCard")
    expect(homeSource).not.toContain("<ProjectCard")
    expect(homeSource).not.toContain('href="/projects/playfold"')
  })

  it("renders all professional records as non-linked image-free homepage summaries", () => {
    expect(PROFESSIONAL_EXPERIENCE_RECORDS.map((record) => record.id)).toEqual([
      "employment-astrocade",
      "employment-snorkel",
      "employment-ford",
      "employment-starbucks",
    ])
    expect(homeSource).toContain('variant="homepage"')
    expect(homeSource).toContain("Public summaries only")
  })

  it("shows four role lenses before a native More lenses disclosure", () => {
    expect(focusSource).toContain('id: "ai-product-systems"')
    expect(focusSource).toContain('id: "game-ux-creator-systems"')
    expect(focusSource).toContain('id: "hitl-evaluation"')
    expect(focusSource).toContain('id: "design-engineering"')
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
