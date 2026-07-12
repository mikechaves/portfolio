import fs from "node:fs"
import path from "node:path"
import { getEvidenceDossierConfig } from "../app/projects/[id]/dossierConfig"
import { buildProjectMedia } from "../app/projects/[id]/projectMedia"

interface DetailItem {
  description: string
  title: string
}

interface SoundEscapeProject {
  demoLabel?: string
  gallery?: string[]
  image: string
  technologies?: string[]
  title: string
  details: {
    proofRole?: string
    results?: DetailItem[]
    services?: string[]
  }
}

const projects = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "public", "data", "projects.json"), "utf8"),
) as Record<string, SoundEscapeProject>

describe("Sound Escape VR evidence dossier", () => {
  it("states the implemented spatial-audio role and preserves prototype scope", () => {
    const project = projects["sound-escape-vr"]
    expect(project).toBeDefined()
    expect(project.details.proofRole).toContain("four-channel 16-step sequencer")
    expect(project.details.proofRole).toContain("eight-band FFT analysis")
    expect(project.details.proofRole).toContain("Quest 3 input adaptation")
    expect(project.details.services).toEqual([
      "Spatial Interaction Design",
      "Audio Systems Engineering",
      "Generative Visualization",
      "Quest 3 Adaptation",
    ])
    expect(project.technologies).toContain("Unity 2022 LTS")
    expect(project.demoLabel).toBe("Watch Prototype Demo")

    const resultCopy = project.details.results
      ?.map(({ description, title }) => `${title} ${description}`)
      .join(" ")
    expect(resultCopy).toContain("functional core sequencer")
    expect(resultCopy).toContain("not a released consumer product")
    expect(resultCopy).toContain("voice controls")
    expect(resultCopy).toContain("remain planned or in refinement")
  })

  it("is enabled through the shared dossier configuration", () => {
    expect(getEvidenceDossierConfig("sound-escape-vr")).toEqual({
      caseFile: "AF-13",
      eyebrow: "Spatial music systems / Audio-reactive interaction",
      signals: "Compose / Sequence / Visualize / Adapt",
    })
  })

  it("maps sequencer, FFT, environment, and identity artifacts", () => {
    const project = projects["sound-escape-vr"]
    const media = buildProjectMedia({
      gallery: project.gallery,
      id: "sound-escape-vr",
      image: project.image,
      title: project.title,
    })

    expect(media).toHaveLength(4)
    expect(media.map((item) => item.label)).toEqual([
      "Four-channel spatial sequencer",
      "Eight-band audio-reactive geometry",
      "Spatial performance environment",
      "Original Sound Escape identity",
    ])
    expect(media.filter((item) => item.section === "situation")).toHaveLength(1)
    expect(media.filter((item) => item.section === "action")).toHaveLength(1)
    expect(media.filter((item) => item.section === "result")).toHaveLength(1)
  })
})
