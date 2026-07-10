import fs from "node:fs"
import path from "node:path"
import { buildProjectMedia } from "../app/projects/[id]/projectMedia"

interface DetailItem {
  description: string
  title: string
}

interface AstrocadeProject {
  description: string
  gallery?: string[]
  image: string
  title: string
  details: {
    actions: DetailItem[]
    proofRole?: string
    results: DetailItem[]
    situation: DetailItem[]
    task: DetailItem[]
  }
}

const projects = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "public", "data", "projects.json"), "utf8"),
) as Record<string, AstrocadeProject>

function getAstrocadeProject() {
  const project = projects["astrocade-qa-calibration-tool"]
  expect(project).toBeDefined()

  if (!project) {
    throw new Error("Astrocade case study is missing from projects.json")
  }

  return project
}

describe("Astrocade case study", () => {
  it("makes the human-in-the-loop operating loop explicit", () => {
    const project = getAstrocadeProject()
    const copy = [
      project.description,
      project.details.proofRole || "",
      ...project.details.situation.flatMap(({ description, title }) => [title, description]),
      ...project.details.task.flatMap(({ description, title }) => [title, description]),
      ...project.details.actions.flatMap(({ description, title }) => [title, description]),
      ...project.details.results.flatMap(({ description, title }) => [title, description]),
    ]
      .join(" ")
      .toLowerCase()

    expect(project.details.proofRole).toContain("human-in-the-loop AI")
    expect(copy).toContain("ground truth")
    expect(copy).toContain("calibration")
    expect(copy).toContain("final review")
    expect(copy).toContain("creator feedback")
    expect(copy).toContain("operational guardrails")
  })

  it("states observable product value without fabricating a metric", () => {
    const project = getAstrocadeProject()
    const resultCopy = project.details.results.map(({ description, title }) => `${title} ${description}`).join(" ").toLowerCase()

    expect(resultCopy).toContain("qa incorrect decisions")
    expect(resultCopy).toContain("false rejections")
    expect(resultCopy).toContain("qa-final agreement")
    expect(resultCopy).toContain("feedback actionability")
    expect(resultCopy).not.toMatch(/\d+%|\d+x|\d+\s*(days?|hours?|minutes?)/)
  })

  it("uses real calibration screens as section-linked evidence", () => {
    const project = getAstrocadeProject()
    const media = buildProjectMedia({
      gallery: project.gallery,
      id: "astrocade-qa-calibration-tool",
      image: project.image,
      title: project.title,
    })

    expect(media).toHaveLength(7)
    expect(media.map((item) => item.label)).toEqual(
      expect.arrayContaining([
        "Calibration metrics dashboard",
        "Side-by-side calibration session",
        "Explicit ground truth",
        "Structured QA failure modes",
        "Creator feedback quality",
        "Final-review failure modes",
      ]),
    )
    expect(media.some((item) => item.section === "task")).toBe(true)
    expect(media.filter((item) => item.section === "action")).toHaveLength(4)
    expect(media.some((item) => item.section === "result")).toBe(true)
  })
})
