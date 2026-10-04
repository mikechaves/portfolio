import fs from "node:fs"
import path from "node:path"

const readSource = (relativePath: string) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8")

describe("server-first project index", () => {
  const pageSource = readSource("app/projects/page.tsx")
  const clientSource = readSource("app/projects/ProjectsPageClient.tsx")
  const cardSource = readSource("components/project-card.tsx")

  it("keeps the index heading and all public evidence paths in the server page", () => {
    expect(pageSource).toContain('className="project-index-title">Work.</h1>')
    expect(pageSource).toContain('aria-label="All project pages"')
    expect(pageSource).toContain("PROJECTS.map")
    expect(pageSource).toContain('href={`/projects/${project.id}`}')
  })

  it("renders the collection immediately and defers the role engine until requested", () => {
    expect(pageSource).toContain("<ProjectsPageClient />")
    expect(clientSource).toContain('import("@/features/adaptive-focus/runtime")')
    expect(clientSource).toContain('params.get("focusSession")')
    expect(clientSource).toContain('params.get("focusBrief")')
    expect(clientSource).not.toContain("project-index-hero")
  })

  it("keeps project cards server-renderable with a small tracked-link boundary", () => {
    expect(cardSource).not.toMatch(/^\s*["']use client["']/u)
    expect(cardSource).toContain("TrackedPortfolioLink")
    expect(cardSource).not.toContain("trackPortfolioEvent(")
  })
})
