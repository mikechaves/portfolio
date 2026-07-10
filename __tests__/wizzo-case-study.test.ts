import fs from "node:fs"
import path from "node:path"
import { getEvidenceDossierConfig } from "../app/projects/[id]/dossierConfig"
import { buildProjectMedia } from "../app/projects/[id]/projectMedia"

interface WizzoProject {
  gallery?: string[]
  image: string
  title: string
  details: {
    proofRole?: string
    services?: string[]
  }
}

const projects = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "public", "data", "projects.json"), "utf8"),
) as Record<string, WizzoProject>

describe("Wizzo evidence dossier", () => {
  it("uses explicit AI product-system proof instead of fallback copy", () => {
    const project = projects.wizzo
    expect(project).toBeDefined()
    expect(project.details.proofRole).toContain("AI product systems")
    expect(project.details.proofRole).toContain("accountable follow-through")
    expect(project.details.services).toContain("Privacy Controls")
  })

  it("is enabled through typed dossier configuration", () => {
    expect(getEvidenceDossierConfig("wizzo")).toEqual({
      caseFile: "AF-02",
      eyebrow: "AI product systems / Intent to action",
      signals: "Chat / Context / Quests",
    })
    expect(getEvidenceDossierConfig("speak-easy")).toBeUndefined()
  })

  it("uses reviewed labels and captions for real product screens", () => {
    const project = projects.wizzo
    const media = buildProjectMedia({
      gallery: project.gallery,
      id: "wizzo",
      image: project.image,
      title: project.title,
    })

    expect(media.map((item) => item.label)).toEqual([
      "AI mentor product cockpit",
      "Quest progress system",
    ])
    expect(media.some((item) => item.section === "result")).toBe(true)
  })
})
