import fs from "node:fs"
import path from "node:path"

const readSource = (relativePath: string) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8")

describe("server-first project index", () => {
  const pageSource = readSource("app/projects/page.tsx")
  const explorerSource = readSource("app/projects/DeferredProjectsExplorer.tsx")
  const clientSource = readSource("app/projects/ProjectsPageClient.tsx")
  const cardSource = readSource("components/project-card.tsx")

  it("keeps the index heading and all public evidence paths in the server page", () => {
    expect(pageSource).toContain("Project Signal Index")
    expect(pageSource).toContain("Choose an evidence path")
    for (const projectId of [
      "wizzo",
      "petition-ready",
      "vulnerability-visualizer",
      "creative-supply-engine",
      "x-games",
      "sound-escape-vr",
      "portals",
      "die-ai",
      "speakeasy",
      "material-explorer",
      "geovoice",
    ]) {
      expect(pageSource).toContain(`"${projectId}"`)
    }
  })

  it("defers only the interactive explorer while prioritizing role handoffs", () => {
    expect(pageSource).toContain("<DeferredProjectsExplorer />")
    expect(explorerSource).toContain('"focusPreset"')
    expect(explorerSource).toContain('"focusBrief"')
    expect(explorerSource).toContain('"focusSession"')
    expect(explorerSource).toContain("IntersectionObserver")
    expect(clientSource).not.toContain("project-index-hero")
    expect(clientSource).not.toContain("PROJECT_INTENT_PATHS")
  })

  it("keeps project cards server-renderable with a small tracked-link boundary", () => {
    expect(cardSource).not.toMatch(/^\s*["']use client["']/u)
    expect(cardSource).toContain("TrackedPortfolioLink")
    expect(cardSource).not.toContain("trackPortfolioEvent(")
  })
})
