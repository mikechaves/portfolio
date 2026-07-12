import fs from "node:fs"
import path from "node:path"
import { getEvidenceDossierConfig } from "../app/projects/[id]/dossierConfig"
import { buildProjectMedia } from "../app/projects/[id]/projectMedia"

interface DetailItem {
  description: string
  title: string
}

interface XGamesProject {
  gallery?: string[]
  image: string
  title: string
  details: {
    actions: DetailItem[]
    proofRole?: string
    results: DetailItem[]
    services?: string[]
  }
}

const projects = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "public", "data", "projects.json"), "utf8"),
) as Record<string, XGamesProject>

describe("X Games evidence dossier", () => {
  it("states direct product-system proof instead of portfolio-value fallback copy", () => {
    const project = projects["x-games"]
    expect(project).toBeDefined()
    expect(project.details.proofRole).toContain("AI-native generation")
    expect(project.details.proofRole).toContain("ranked play")
    expect(project.details.services).toEqual([
      "AI Product Systems",
      "Generated Game UX",
      "Social Distribution",
      "Ranking and Replay",
    ])

    const resultCopy = project.details.results
      .map(({ description, title }) => `${title} ${description}`)
      .join(" ")
      .toLowerCase()
    expect(resultCopy).not.toContain("portfolio proof")
  })

  it("is enabled through the shared dossier configuration", () => {
    expect(getEvidenceDossierConfig("x-games")).toEqual({
      caseFile: "AF-03",
      eyebrow: "AI-native game systems / Social creation loop",
      signals: "Post / Generate / Play / Rank",
    })
  })

  it("maps reviewed live product states to the case-study sections", () => {
    const project = projects["x-games"]
    const media = buildProjectMedia({
      gallery: project.gallery,
      id: "x-games",
      image: project.image,
      title: project.title,
    })

    expect(media.map((item) => item.label)).toEqual([
      "Live game discovery platform",
      "Generated-game control surface",
      "Ranked game ecosystem",
    ])
    expect(media.map((item) => item.section)).toEqual(["situation", "action", "result"])
    expect(media.every((item) => item.caption.length > 60)).toBe(true)
  })
})
