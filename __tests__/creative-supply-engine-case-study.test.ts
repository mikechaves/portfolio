import fs from "node:fs"
import path from "node:path"
import { getEvidenceDossierConfig } from "../app/projects/[id]/dossierConfig"
import { buildProjectMedia } from "../app/projects/[id]/projectMedia"

interface DetailItem {
  description: string
  title: string
}

interface CreativeSupplyEngineProject {
  demoLabel?: string
  gallery?: string[]
  image: string
  technologies?: string[]
  title: string
  details: {
    client?: string
    proofRole?: string
    results?: DetailItem[]
    services?: string[]
  }
}

const projects = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "public", "data", "projects.json"), "utf8"),
) as Record<string, CreativeSupplyEngineProject>

describe("Creative Supply Engine evidence dossier", () => {
  it("states the implemented creative-operations role and preserves prototype scope", () => {
    const project = projects["creative-supply-engine"]
    expect(project).toBeDefined()
    expect(project.details.client).toBe("Pulse Beverages (Sample Brand)")
    expect(project.details.proofRole).toContain("reuse-first creative operations pipeline")
    expect(project.details.proofRole).toContain("human review packaging")
    expect(project.details.services).toEqual([
      "Creative Operations",
      "AI Image Systems",
      "Localization Engineering",
      "Review & Compliance",
    ])
    expect(project.technologies).toContain("OpenAI Responses API")
    expect(project.demoLabel).toBe("Open Review Gallery")

    const resultCopy = project.details.results
      ?.map(({ description, title }) => `${title} ${description}`)
      .join(" ")
    expect(resultCopy).toContain("twelve final creative files")
    expect(resultCopy).toContain("Four localized sets")
    expect(resultCopy).toContain("tested local prototype")
    expect(resultCopy).toContain("rather than claiming autonomous campaign approval")
  })

  it("is enabled through the shared dossier configuration", () => {
    expect(getEvidenceDossierConfig("creative-supply-engine")).toEqual({
      caseFile: "AF-10",
      eyebrow: "AI creative operations / Deterministic control layer",
      signals: "Brief / Generate / Localize / Review",
    })
  })

  it("maps the CLI, deterministic brand source, and localized output set", () => {
    const project = projects["creative-supply-engine"]
    const media = buildProjectMedia({
      gallery: project.gallery,
      id: "creative-supply-engine",
      image: project.image,
      title: project.title,
    })

    expect(media).toHaveLength(8)
    expect(media.map((item) => item.label)).toEqual([
      "Localized 16:9 campaign output",
      "English citrus 1:1",
      "English citrus 9:16",
      "Spanish oat bar 1:1",
      "Spanish oat bar 9:16",
      "Spanish oat bar 16:9",
      "Deterministic brand source",
      "Repeatable CLI run",
    ])
    expect(media.filter((item) => item.section === "task")).toHaveLength(1)
    expect(media.filter((item) => item.section === "action")).toHaveLength(1)
    expect(media.filter((item) => item.section === "result")).toHaveLength(5)
  })
})
