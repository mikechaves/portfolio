import fs from "node:fs"
import path from "node:path"
import { getEvidenceDossierConfig } from "../app/projects/[id]/dossierConfig"
import { buildProjectMedia } from "../app/projects/[id]/projectMedia"

interface DetailItem {
  description: string
  title: string
}

interface PetitionReadyProject {
  gallery?: string[]
  image: string
  title: string
  details: {
    actions?: DetailItem[]
    proofRole?: string
    results?: DetailItem[]
    services?: string[]
    situation?: DetailItem[]
  }
}

const projects = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "public", "data", "projects.json"), "utf8"),
) as Record<string, PetitionReadyProject>

describe("PetitionReady evidence dossier", () => {
  it("states the implemented legal-operations role without overstating prototype scope", () => {
    const project = projects["petition-ready"]
    expect(project).toBeDefined()
    expect(project.details.proofRole).toContain("AI-assisted legal-operations workflow")
    expect(project.details.proofRole).toContain("paralegal-to-attorney review boundaries")
    expect(project.details.services).toEqual([
      "Legal Operations UX",
      "AI Product Systems",
      "Full-Stack Engineering",
      "Human Review Design",
    ])

    const caseCopy = [
      ...(project.details.situation || []),
      ...(project.details.actions || []),
      ...(project.details.results || []),
    ]
      .map(({ description, title }) => `${title} ${description}`)
      .join(" ")

    expect(caseCopy).toContain("instead of automated filing, legal advice")
    expect(caseCopy).toContain("OpenAI Responses API")
    expect(caseCopy).toContain("deterministic fallback")
    expect(caseCopy).toContain("Authentication, persistence, audit logs")
  })

  it("is enabled through the shared dossier configuration", () => {
    expect(getEvidenceDossierConfig("petition-ready")).toEqual({
      caseFile: "AF-09",
      eyebrow: "AI legal operations / Human review boundary",
      signals: "Intake / Triage / Evidence / Review",
    })
  })

  it("maps the operating console, review states, and Copilot evidence", () => {
    const project = projects["petition-ready"]
    const media = buildProjectMedia({
      gallery: project.gallery,
      id: "petition-ready",
      image: project.image,
      title: project.title,
    })

    expect(media).toHaveLength(5)
    expect(media.map((item) => item.label)).toEqual([
      "Matter readiness operating console",
      "Exception and notification queue",
      "Selected-matter readiness review",
      "Blocker-to-next-action inspector",
      "Case-grounded Copilot evidence",
    ])
    expect(media.filter((item) => item.section === "task")).toHaveLength(1)
    expect(media.filter((item) => item.section === "action")).toHaveLength(2)
    expect(media.filter((item) => item.section === "result")).toHaveLength(1)
  })
})
