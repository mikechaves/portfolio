import fs from "node:fs"
import path from "node:path"
import { getEvidenceDossierConfig } from "../app/projects/[id]/dossierConfig"
import { buildProjectMedia } from "../app/projects/[id]/projectMedia"

interface DetailItem {
  description: string
  title: string
}

interface DieAIProject {
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
) as Record<string, DieAIProject>

describe("Die, AI! evidence dossier", () => {
  it("states the preservation role and preserves remaining archive gaps", () => {
    const project = projects["die-ai"]
    expect(project).toBeDefined()
    expect(project.details.proofRole).toContain("50,392,143-byte FLA")
    expect(project.details.proofRole).toContain("3,223,681-byte SWF")
    expect(project.details.proofRole).toContain("runtime-confirmed keyboard controls")
    expect(project.details.services).toEqual([
      "Digital Preservation",
      "Legacy Runtime Migration",
      "ActionScript Game Engineering",
      "Browser Accessibility & QA",
    ])
    expect(project.technologies).toContain("Ruffle 0.2.0")
    expect(project.demoLabel).toBe("Play Preserved Game")

    const resultCopy = project.details.results
      ?.map(({ description, title }) => `${title} ${description}`)
      .join(" ")
    expect(resultCopy).toContain("A for left, D for right, and Space for fire")
    expect(resultCopy).toContain("does not yet have an automated SWF rebuild")
    expect(resultCopy).toContain("vendored Ruffle runtime")
    expect(resultCopy).toContain("external archive submission")
  })

  it("is enabled through the shared dossier configuration", () => {
    expect(getEvidenceDossierConfig("die-ai")).toEqual({
      caseFile: "AF-15",
      eyebrow: "Legacy runtime preservation / Playable artifact",
      signals: "Preserve / Emulate / Verify / Archive",
    })
  })

  it("maps gameplay, runtime, story, failure, and revival artifacts", () => {
    const project = projects["die-ai"]
    const media = buildProjectMedia({
      gallery: project.gallery,
      id: "die-ai",
      image: project.image,
      title: project.title,
    })

    expect(media).toHaveLength(7)
    expect(media.map((item) => item.label)).toEqual([
      "Preserved Sector 12 gameplay",
      "Live Ruffle start state",
      "Original Flash start screen",
      "AICorp launch narrative",
      "Compromised Buddy Bot state",
      "Preserved failure state",
      "Modern preservation identity",
    ])
    expect(media.filter((item) => item.section === "situation")).toHaveLength(1)
    expect(media.filter((item) => item.section === "task")).toHaveLength(1)
    expect(media.filter((item) => item.section === "action")).toHaveLength(2)
    expect(media.filter((item) => item.section === "result")).toHaveLength(2)
  })
})
