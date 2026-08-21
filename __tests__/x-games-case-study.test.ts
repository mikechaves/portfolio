import fs from "node:fs"
import path from "node:path"
import { getEvidenceDossierConfig } from "../app/projects/[id]/dossierConfig"
import { buildProjectMedia } from "../app/projects/[id]/projectMedia"

interface DetailItem {
  description: string
  title: string
}

interface XGamesProject {
  demo?: string
  gallery?: string[]
  image: string
  title: string
  details: {
    actions: DetailItem[]
    client?: string
    proofRole?: string
    results: DetailItem[]
    services?: string[]
    situation?: DetailItem[]
  }
}

const projects = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "public", "data", "projects.json"), "utf8"),
) as Record<string, XGamesProject>

describe("Playfold evidence dossier", () => {
  it("uses the current public product identity while preserving the stable route ID", () => {
    const project = projects["x-games"]

    expect(project.title).toBe("Playfold")
    expect(project.demo).toBe("https://playfold.wizzolabs.net/")
    expect(project.details.client).toBe("Wizzo Labs")
    expect(project.details.situation?.[0]?.description).toContain("Playfold is")
    expect(JSON.stringify(project)).not.toContain('"X Games"')
  })

  it("states direct product-system proof instead of portfolio-value fallback copy", () => {
    const project = projects["x-games"]
    expect(project).toBeDefined()
    expect(project.details.proofRole).toContain("source-grounded AI generation")
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
      "Adaptive discovery catalog",
      "Source-to-game product story",
      "Verified seasonal leaderboard",
    ])
    expect(media.map((item) => item.section)).toEqual(["action", "situation", "result"])
    expect(media.every((item) => item.caption.length > 60)).toBe(true)
  })
})
