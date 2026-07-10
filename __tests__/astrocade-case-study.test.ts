import fs from "node:fs"
import path from "node:path"

interface DetailItem {
  description: string
  title: string
}

interface AstrocadeProject {
  description: string
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
    expect(copy).toContain("qa annotation")
    expect(copy).toContain("calibration")
    expect(copy).toContain("final review")
    expect(copy).toContain("creator feedback")
    expect(copy).toContain("operational guardrails")
  })

  it("states observable product value without fabricating a metric", () => {
    const project = getAstrocadeProject()
    const resultCopy = project.details.results.map(({ description, title }) => `${title} ${description}`).join(" ").toLowerCase()

    expect(resultCopy).toContain("reviewer-model alignment")
    expect(resultCopy).toContain("repeat or reversed rejections")
    expect(resultCopy).toContain("turnaround")
    expect(resultCopy).not.toMatch(/\d+%|\d+x|\d+\s*(days?|hours?|minutes?)/)
  })
})
