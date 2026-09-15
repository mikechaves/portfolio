import fs from "node:fs"
import path from "node:path"
import { getEvidenceDossierConfig } from "../app/projects/[id]/dossierConfig"
import { buildProjectMedia } from "../app/projects/[id]/projectMedia"
import type { ProjectDesignStory } from "../types/project-detail"

interface WizzoProject {
  gallery?: string[]
  image: string
  title: string
  designStory: ProjectDesignStory
  details: {
    proofRole?: string
    services?: string[]
  }
}

const projects = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "public", "data", "projects.json"), "utf8"),
) as Record<string, WizzoProject>

describe("Wizzo evidence dossier", () => {
  it("leads with product-design ownership and the founder's assessment", () => {
    const project = projects.wizzo
    expect(project).toBeDefined()
    expect(project.details.proofRole).toContain("Founder and product designer")
    expect(project.details.services).toContain("Design Systems")
    expect(project.designStory.quote).toBe("The original Wizzo was functional, but it felt too generic to me. It did not express the identity or sense of direction I wanted the product to have.")
  })

  it("is enabled through typed dossier configuration", () => {
    expect(getEvidenceDossierConfig("wizzo")).toEqual({
      caseFile: "AF-02",
      eyebrow: "Product design / A clear next move",
      signals: "Hierarchy / Control / Identity",
    })
    expect(getEvidenceDossierConfig("speak-easy")).toBeUndefined()
  })

  it("uses reviewed labels and captions for real product screens", () => {
    const project = projects.wizzo
    const media = buildProjectMedia({
      gallery: project.gallery,
      id: "wizzo",
      image: project.image,
      title: project.title,
    })

    expect(media[0].label).toBe("Home: recommendation hierarchy")
    const mediaPaths = new Set(media.map((item) => item.src))
    for (const section of project.designStory.sections) {
      for (const src of section.images ?? []) expect(mediaPaths.has(src)).toBe(true)
    }
    expect(media.find((item) => item.src.includes("home-inline"))?.caption).toContain("pending review")
    expect(media.find((item) => item.src.includes("wisp-direction"))?.caption).toContain("accepted")
  })

  it("publishes only the three public PDFs as real downloadable files", () => {
    const downloads = projects.wizzo.designStory.downloads
    expect(downloads.map((file) => file.pages)).toEqual([30, 10, 12])
    expect(downloads.map((file) => path.basename(file.url))).toEqual([
      "Wizzo-Product-Design-Case-Study.pdf", "Wizzo_Brand_Guide.pdf", "Wizzo_Design_System.pdf",
    ])
    for (const file of downloads) {
      const bytes = fs.readFileSync(path.join(__dirname, "..", "public", file.url))
      expect(bytes.subarray(0, 5).toString()).toBe("%PDF-")
      expect(bytes.length).toBeGreaterThan(100_000)
    }
    const files = fs.readdirSync(path.join(__dirname, "..", "public", "projects", "wizzo"))
    expect(files.some((name) => /Interview|Role-Evidence|Cheat-Sheet/.test(name))).toBe(false)
  })
})
