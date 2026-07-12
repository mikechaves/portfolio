import fs from "node:fs"
import path from "node:path"
import { getEvidenceDossierConfig } from "../app/projects/[id]/dossierConfig"
import { buildProjectMedia } from "../app/projects/[id]/projectMedia"

interface DetailItem {
  description: string
  title: string
}

interface GaiaProject {
  demoLabel?: string
  gallery?: string[]
  image: string
  title: string
  details: {
    proofRole?: string
    result?: string
    results?: DetailItem[]
    services?: string[]
  }
}

const projects = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "public", "data", "projects.json"), "utf8"),
) as Record<string, GaiaProject>

describe("Gaia evidence dossier", () => {
  it("states the documented design and prototype role without unsupported impact claims", () => {
    const project = projects.gaia
    expect(project).toBeDefined()
    expect(project.details.proofRole).toContain("leading UX design and Unity prototyping")
    expect(project.details.services).toEqual([
      "Operational UX",
      "Spatial Prototyping",
      "Unity Development",
      "Usability Testing",
    ])
    expect(project.demoLabel).toBe("Watch Prototype")
    expect(project.details.result).toBeUndefined()

    const resultCopy = project.details.results
      ?.map(({ description, title }) => `${title} ${description}`)
      .join(" ")
      .toLowerCase()
    expect(resultCopy).not.toContain("enhanced operational efficiency")
    expect(resultCopy).not.toContain("new benchmarks")
  })

  it("is enabled through the shared dossier configuration", () => {
    expect(getEvidenceDossierConfig("gaia")).toEqual({
      caseFile: "AF-04",
      eyebrow: "Enterprise spatial operations / Decision context",
      signals: "Research / Prototype / Test / Spatialize",
    })
  })

  it("maps the reviewed design progression to dossier sections", () => {
    const project = projects.gaia
    const media = buildProjectMedia({
      gallery: project.gallery,
      id: "gaia",
      image: project.image,
      title: project.title,
    })

    expect(media).toHaveLength(7)
    expect(media.map((item) => item.label)).toEqual([
      "Gaia VisiPad field prototype",
      "VisiPad interaction map",
      "Store-selection environment",
      "Spatial store overview",
      "Opportunity and role framing",
      "3D wireframes",
      "Immersive usability test",
    ])
    expect(media.filter((item) => item.section === "situation")).toHaveLength(1)
    expect(media.filter((item) => item.section === "action")).toHaveLength(3)
    expect(media.filter((item) => item.section === "result")).toHaveLength(2)
  })
})
