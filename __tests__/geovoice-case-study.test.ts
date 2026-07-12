import fs from "node:fs"
import path from "node:path"
import { getEvidenceDossierConfig } from "../app/projects/[id]/dossierConfig"
import { buildProjectMedia } from "../app/projects/[id]/projectMedia"

interface DetailItem {
  description: string
  title: string
}

interface GeoVoiceProject {
  gallery?: string[]
  image: string
  title: string
  details: {
    proofRole?: string
    results?: DetailItem[]
    services?: string[]
  }
}

const projects = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "public", "data", "projects.json"), "utf8"),
) as Record<string, GeoVoiceProject>

describe("GeoVoice evidence dossier", () => {
  it("states the documented geospatial workflow role and attributes the planning-cycle claim", () => {
    const project = projects.geovoice
    expect(project).toBeDefined()
    expect(project.details.proofRole).toContain("geospatial stakeholder-feedback workflow")
    expect(project.details.services).toEqual([
      "Stakeholder UX",
      "Workflow Design",
      "Geospatial Data",
      "Interactive Prototyping",
    ])

    const resultCopy = project.details.results
      ?.map(({ description, title }) => `${title} ${description}`)
      .join(" ")
    expect(resultCopy).toContain("cut weeks from traditional planning cycles")
    expect(resultCopy).toContain("attributed project claim")
  })

  it("is enabled through the shared dossier configuration", () => {
    expect(getEvidenceDossierConfig("geovoice")).toEqual({
      caseFile: "AF-07",
      eyebrow: "Geospatial collaboration systems / Public input",
      signals: "Locate / Comment / Layer / Review",
    })
  })

  it("uses the working map as primary evidence and maps the stakeholder workflow", () => {
    const project = projects.geovoice
    const media = buildProjectMedia({
      gallery: project.gallery,
      id: "geovoice",
      image: project.image,
      title: project.title,
    })

    expect(media).toHaveLength(8)
    expect(media.map((item) => item.label)).toEqual([
      "Infrastructure feedback map",
      "Location-selection prototype",
      "Structured comment workflow",
      "Regional project deployment",
      "Location-feedback concept",
      "Stakeholder workflow brief",
      "Research and build record",
      "Documented workflow outcomes",
    ])
    expect(media.filter((item) => item.section === "situation")).toHaveLength(1)
    expect(media.filter((item) => item.section === "task")).toHaveLength(1)
    expect(media.filter((item) => item.section === "action")).toHaveLength(2)
    expect(media.filter((item) => item.section === "result")).toHaveLength(2)
  })
})
