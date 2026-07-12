import fs from "node:fs"
import path from "node:path"
import { getEvidenceDossierConfig } from "../app/projects/[id]/dossierConfig"
import { buildProjectMedia } from "../app/projects/[id]/projectMedia"

interface DetailItem {
  description: string
  title: string
}

interface PortalsProject {
  demoLabel?: string
  gallery?: string[]
  image: string
  technologies?: string[]
  title: string
  details: {
    client?: string
    date?: string
    proofRole?: string
    results?: DetailItem[]
    services?: string[]
  }
}

const projects = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "public", "data", "projects.json"), "utf8"),
) as Record<string, PortalsProject>

describe("Portals evidence dossier", () => {
  it("states the implemented voice-first AR role and preserves hackathon scope", () => {
    const project = projects.portals
    expect(project).toBeDefined()
    expect(project.details.client).toBe("Stanford Immerse the Bay 2024 / Four-person team")
    expect(project.details.date).toBe("November 2024")
    expect(project.details.proofRole).toContain("VoiceML portal activation")
    expect(project.details.proofRole).toContain("hand-tracked pinch scaling")
    expect(project.details.services).toEqual([
      "SnapAR Prototyping",
      "Voice Interaction Design",
      "Spatial Experience Design",
      "Hackathon Product Leadership",
    ])
    expect(project.technologies).toContain("VoiceML")
    expect(project.demoLabel).toBe("Open Devpost Showcase")

    const resultCopy = project.details.results
      ?.map(({ description, title }) => `${title} ${description}`)
      .join(" ")
    expect(resultCopy).toContain("India, Samoa, and America")
    expect(resultCopy).toContain("not a completed cultural platform")
    expect(resultCopy).toContain("Computer-vision recognition")
    expect(resultCopy).toContain("remain concept or future work")
  })

  it("is enabled through the shared dossier configuration", () => {
    expect(getEvidenceDossierConfig("portals")).toEqual({
      caseFile: "AF-14",
      eyebrow: "Voice-first AR systems / Cultural portal navigation",
      signals: "Speak / Route / Scale / Return",
    })
  })

  it("maps the Spectacles scene, voice, hand, and team artifacts", () => {
    const project = projects.portals
    const media = buildProjectMedia({
      gallery: project.gallery,
      id: "portals",
      image: project.image,
      title: project.title,
    })

    expect(media).toHaveLength(5)
    expect(media.map((item) => item.label)).toEqual([
      "Three-destination Spectacles scene",
      "Guarded VoiceML portal lifecycle",
      "Phrase-routed destination states",
      "Hand-tracked pinch scaling",
      "Four-person hackathon showcase",
    ])
    expect(media.filter((item) => item.section === "situation")).toHaveLength(1)
    expect(media.filter((item) => item.section === "action")).toHaveLength(2)
    expect(media.filter((item) => item.section === "result")).toHaveLength(1)
  })
})
