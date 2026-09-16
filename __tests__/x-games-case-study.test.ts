import fs from "node:fs"
import path from "node:path"
import { getEvidenceDossierConfig } from "../app/projects/[id]/dossierConfig"
import { buildProjectMedia } from "../app/projects/[id]/projectMedia"
import type { ProjectDetail } from "../types/project-detail"

const projects = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "public", "data", "projects.json"), "utf8"),
) as Record<string, ProjectDetail>
const project = projects["x-games"]
const story = project.designStory!

describe("Playfold product-design case study", () => {
  it("preserves the public product identity and stable route while leading with design ownership", () => {
    expect(project.title).toBe("Playfold")
    expect(project.demo).toBe("https://playfold.wizzolabs.net/")
    expect(project.details.client).toBe("Wizzo Labs")
    expect(project.details.proofRole).toContain("Founder and product designer")
    expect(project.details.services).toContain("Interaction Design")
    expect(project.details.services).toContain("Design Systems")
    expect(project.description.length).toBeGreaterThanOrEqual(70)
    expect(project.description.length).toBeLessThanOrEqual(160)
    expect(getEvidenceDossierConfig("x-games")).toEqual({
      caseFile: "AF-03",
      eyebrow: "Product design / Discovery to play",
      signals: "Source / Discover / Play / Return",
    })
    expect(JSON.stringify(project)).not.toContain('"X Games"')
    expect(story.quote).toBeUndefined()
    expect(story.attribution).toBeUndefined()
  })

  it("leads with the existing principal product surfaces", () => {
    expect(project.image).toBe("/images/projects/x-games/design/homepage.webp")
    expect(story.sections.slice(0, 6).map((section) => section.id)).toEqual([
      "product-introduction", "public-discovery", "public-play", "mobile-product", "game-rankings", "product-navigation",
    ])
    expect(story.sections.find((section) => section.id === "public-discovery")?.body).toContain("/games")
    expect(story.sections.find((section) => section.id === "game-rankings")?.body).toContain("total verified score")
    expect(story.sections.find((section) => section.id === "game-rankings")?.decisions?.[0].description).toContain("resets All time to Season")
    expect(story.downloads.map((file) => file.pages)).toEqual([24, 10, 14])
  })

  it("distinguishes the disabled baseline, simulated result and unapproved refinement", () => {
    const creation = story.sections.find((section) => section.id === "private-creation")!
    expect(creation.body).toContain("Create and save privately")
    expect(creation.body).toContain("Ready — saved privately")
    expect(creation.body).toContain("private saving does not publish")
    expect(creation.note).toContain("New creation is disabled")
    expect(creation.note).toContain("simulates")
    expect(creation.note).toContain("owner-only")

    const exploration = story.sections.find((section) => section.id === "result-exploration")!
    expect(exploration.decisions?.map((decision) => decision.title)).toEqual(expect.arrayContaining([
      "A / Inline outcome receipt", "B / Dedicated result page",
    ]))
    expect(exploration.note).toContain("for design review")
    expect(exploration.note).toContain("not implemented or evaluated")
    expect(exploration.note).toContain("Play saved game is proposed navigation")
  })

  it("keeps one illustrative source and game across creator and player content", () => {
    const source = story.sections.find((section) => section.id === "source-and-intent")!
    const player = story.sections.find((section) => section.id === "responsive-play")!
    expect(source.body).toContain("Alex Rivera")
    expect(source.body).toContain("Signal Range")
    expect(source.body).toContain("Sam Chen")
    expect(source.decisions?.some((decision) => decision.description.includes("permission to redistribute"))).toBe(true)
    expect(player.body).toContain("Signal Range")
    expect(player.body).toContain("Clear the signal targets")
    expect(player.body).toContain("three targets and a maximum of three hits")
    expect(player.note).toContain("not an existing public catalog listing")
    expect(player.note).toContain("does not run the game engine")
    expect(player.decisions?.some((decision) => decision.description.includes("no Tune, Refold"))).toBe(true)
  })

  it("registers every story figure with descriptive media and a stable accessible label", () => {
    const media = buildProjectMedia({ gallery: project.gallery, id: "x-games", image: project.image, title: project.title })
    const sources = new Set(media.map((item) => item.src))
    expect(media).toHaveLength(13)
    for (const section of story.sections) {
      for (const src of section.images ?? []) expect(sources.has(src)).toBe(true)
    }
    expect(media.every((item) => item.caption.length > 60 && item.alt.startsWith("Playfold: "))).toBe(true)
    expect(media.every((item) => item.src.startsWith("/images/projects/x-games/design/"))).toBe(true)
    expect(media.find((item) => item.src.endsWith("exploration-lowfi.webp"))?.caption).toContain("for design review")
    expect(media.find((item) => item.src.endsWith("player-mobile-scrolled.webp"))?.label).toContain("scrolled to movement, Fire and Restart")
  })

  it("delivers small gallery previews while retaining full originals for inspection", () => {
    const media = buildProjectMedia({ gallery: project.gallery, id: "x-games", image: project.image, title: project.title })
    for (const item of media.slice(1)) {
      expect(item.thumbnailSrc).toMatch(/-thumbnail\.webp$/u)
      expect(item.src).not.toContain("-thumbnail")
      const original = fs.statSync(path.join(__dirname, "..", "public", item.src)).size
      const preview = fs.statSync(path.join(__dirname, "..", "public", item.thumbnailSrc!)).size
      expect(preview).toBeLessThan(original * 0.3)
    }
  })

  it("links distinct prototype entries and public documents without private workspace records", () => {
    const sectionLinks = story.sections.flatMap((section) => section.link ? [section.link.url] : [])
    const prototypes = sectionLinks.filter((url) => url.startsWith("https://www.figma.com/proto/"))
    expect(new Set(prototypes).size).toBe(10)
    for (const link of prototypes) {
      const url = new URL(link)
      expect(url.pathname).toContain("Fvg2ULLsIr6kLNEIYcD6Ic")
      expect(url.searchParams.get("starting-point-node-id")).toBeTruthy()
    }
    expect(story.downloads.map((file) => path.basename(file.url))).toEqual([
      "Playfold-Product-Design-Case-Study.pdf", "Playfold_Brand_Guide.pdf", "Playfold_Design_System.pdf",
    ])
    expect(story.downloads.every((file) => file.url.startsWith("/projects/x-games/"))).toBe(true)
    expect(JSON.stringify(project)).not.toMatch(/notion\.so|app\.notion\.com|\/Users\//u)
  })
})
