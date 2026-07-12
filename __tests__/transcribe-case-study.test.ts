import fs from "node:fs"
import path from "node:path"
import { getEvidenceDossierConfig } from "../app/projects/[id]/dossierConfig"
import { buildProjectMedia } from "../app/projects/[id]/projectMedia"

interface DetailItem {
  description: string
  title: string
}

interface TranscribeProject {
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
) as Record<string, TranscribeProject>

describe("Transcribe evidence dossier", () => {
  it("states the accessibility implementation role and attributes measured outcomes", () => {
    const project = projects.transcribe
    expect(project).toBeDefined()
    expect(project.details.proofRole).toContain("accessible voice interaction")
    expect(project.details.services).toEqual([
      "Accessibility UX",
      "Voice Interaction",
      "React Development",
      "Field Validation",
    ])
    expect(project.details.result).toBeUndefined()

    const resultCopy = project.details.results
      ?.map(({ description, title }) => `${title} ${description}`)
      .join(" ")
    expect(resultCopy).toContain("30% Transcription-Accuracy Improvement")
    expect(resultCopy).toContain("50% Less Manual Note-Taking Time")
    expect(resultCopy).toContain("case-study record reports")
  })

  it("is enabled through the shared dossier configuration", () => {
    expect(getEvidenceDossierConfig("transcribe")).toEqual({
      caseFile: "AF-06",
      eyebrow: "Voice accessibility systems / Retail operations",
      signals: "Listen / Transcribe / Test / Operate",
    })
  })

  it("maps the reviewed pilot evidence to the dossier sections", () => {
    const project = projects.transcribe
    const media = buildProjectMedia({
      gallery: project.gallery,
      id: "transcribe",
      image: project.image,
      title: project.title,
    })

    expect(media).toHaveLength(5)
    expect(media.map((item) => item.label)).toEqual([
      "Drive-through transcription system",
      "Communication roadmap and pilot plan",
      "Interface and implementation record",
      "Listening-state and in-store testing",
      "Documented pilot outcomes",
    ])
    expect(media.filter((item) => item.section === "situation")).toHaveLength(1)
    expect(media.filter((item) => item.section === "action")).toHaveLength(2)
    expect(media.filter((item) => item.section === "result")).toHaveLength(1)
  })
})
