import fs from "node:fs"
import path from "node:path"
import { getEvidenceDossierConfig } from "../app/projects/[id]/dossierConfig"
import { buildProjectMedia } from "../app/projects/[id]/projectMedia"

interface DetailItem {
  description: string
  title: string
}

interface SpeakEasyProject {
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
) as Record<string, SpeakEasyProject>

describe("SpeakEasy evidence dossier", () => {
  it("states the implemented voice-XR role and preserves measured iteration", () => {
    const project = projects.speakeasy
    expect(project).toBeDefined()
    expect(project.details.proofRole).toContain("voice-first mixed-reality accessibility system")
    expect(project.details.services).toEqual([
      "Accessibility Research",
      "Voice Interaction",
      "Unity XR Development",
      "Usability Evaluation",
    ])
    expect(project.demoLabel).toBe("Read Process Book")

    const resultCopy = project.details.results
      ?.map(({ description, title }) => `${title} ${description}`)
      .join(" ")
    expect(resultCopy).toContain("530 ms to 380 ms")
    expect(resultCopy).toContain("64% to 79%")
    expect(resultCopy).toContain("six of ten accessibility pillars as implemented")
    expect(resultCopy).toContain("remaining constraints")
  })

  it("is enabled through the shared dossier configuration", () => {
    expect(getEvidenceDossierConfig("speakeasy")).toEqual({
      caseFile: "AF-08",
      eyebrow: "Voice-first XR accessibility / Research through design",
      signals: "Research / Prototype / Measure / Exhibit",
    })
  })

  it("maps the reviewed research, implementation, and exhibition evidence", () => {
    const project = projects.speakeasy
    const media = buildProjectMedia({
      gallery: project.gallery,
      id: "speakeasy",
      image: project.image,
      title: project.title,
    })

    expect(media).toHaveLength(7)
    expect(media.map((item) => item.label)).toEqual([
      "Thesis defense",
      "Interactive thesis exhibition",
      "Ten-pillar implementation ledger",
      "Controller-access problem frame",
      "Research-to-prototype record",
      "Documented participant outcomes",
      "Exhibition plan",
    ])
    expect(media.filter((item) => item.section === "situation")).toHaveLength(1)
    expect(media.filter((item) => item.section === "task")).toHaveLength(1)
    expect(media.filter((item) => item.section === "action")).toHaveLength(1)
    expect(media.filter((item) => item.section === "result")).toHaveLength(1)
    expect(media.filter((item) => item.section === "exhibition")).toHaveLength(2)
  })
})
