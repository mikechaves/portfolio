import fs from "node:fs"
import path from "node:path"
import { getEvidenceDossierConfig } from "../app/projects/[id]/dossierConfig"
import { buildProjectMedia } from "../app/projects/[id]/projectMedia"

interface DetailItem {
  description: string
  title: string
}

interface AptPlusProject {
  demoLabel?: string
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
) as Record<string, AptPlusProject>

describe("APT+ evidence dossier", () => {
  it("preserves the documented production role and measured outcome", () => {
    const project = projects["apt-plus"]
    expect(project).toBeDefined()
    expect(project.details.proofRole).toContain("Direct production evidence")
    expect(project.details.services).toEqual([
      "Operational UX",
      "Workflow Automation",
      "Data Visualization",
      "Production Delivery",
    ])
    expect(project.demoLabel).toBe("Watch Workflow")

    const resultCopy = project.details.results
      ?.map(({ description, title }) => `${title} ${description}`)
      .join(" ")
    expect(resultCopy).toContain("Approximately $1M Annual Savings per Plant")
    expect(resultCopy).toContain("project record attributes the savings")
  })

  it("is enabled through the shared dossier configuration", () => {
    expect(getEvidenceDossierConfig("apt-plus")).toEqual({
      caseFile: "AF-05",
      eyebrow: "Manufacturing workflow systems / Measured operations",
      signals: "Observe / Capture / Analyze / Scale",
    })
  })

  it("uses the production interface as primary evidence and maps the full workflow", () => {
    const project = projects["apt-plus"]
    const media = buildProjectMedia({
      gallery: project.gallery,
      id: "apt-plus",
      image: project.image,
      title: project.title,
    })

    expect(media).toHaveLength(7)
    expect(media[0]).toMatchObject({
      label: "Production work-balance interface",
      src: "/projects/apt-plus/aptplus-interface.png",
    })
    expect(media.filter((item) => item.section === "situation")).toHaveLength(1)
    expect(media.filter((item) => item.section === "task")).toHaveLength(1)
    expect(media.filter((item) => item.section === "action")).toHaveLength(2)
    expect(media.filter((item) => item.section === "result")).toHaveLength(2)
  })
})
