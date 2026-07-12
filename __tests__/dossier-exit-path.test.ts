import { PROJECTS } from "../data/projects"
import {
  buildProjectFocusHref,
  getDossierExitPath,
  getProjectCapabilities,
  getRelatedEvidenceRoutes,
} from "../app/projects/[id]/dossierExitPathData"
import { decodeAdaptiveFocusBriefHandoff } from "../features/adaptive-focus/handoff"

describe("evidence dossier exit path", () => {
  it.each(PROJECTS.map((project) => project.id))(
    "%s receives two deterministic related evidence routes",
    (projectId) => {
      const first = getRelatedEvidenceRoutes(projectId)
      const second = getRelatedEvidenceRoutes(projectId)

      expect(first).toEqual(second)
      expect(first).toHaveLength(2)
      expect(first.every((project) => project.projectId !== projectId)).toBe(true)
      expect(first.every((project) => project.sharedCapabilities.length > 0)).toBe(true)
    }
  )

  it("routes Astrocade through reviewed human-in-the-loop evidence", () => {
    const exitPath = getDossierExitPath("astrocade-qa-calibration-tool")

    expect(exitPath.capabilities).toEqual(
      expect.arrayContaining(["human-in-the-loop-ai", "evaluation-calibration", "moderation-qa"])
    )
    expect(exitPath.relatedProjects.map((project) => project.projectId)).toContain("petition-ready")
  })

  it("encodes capabilities as a versioned Adaptive Focus handoff", () => {
    const capabilities = getProjectCapabilities("speakeasy").slice(0, 4)
    const href = buildProjectFocusHref(capabilities)
    const url = new URL(href, "https://mikechaves.io")
    const token = url.searchParams.get("focusBrief")
    const decoded = token ? decodeAdaptiveFocusBriefHandoff(token) : null

    expect(url.pathname).toBe("/projects")
    expect(url.hash).toBe("#adaptive-focus-controls-heading")
    expect(decoded?.analysisSource).toBe("preset")
    expect(decoded?.interpretation.requirements.map((requirement) => requirement.capability)).toEqual(
      capabilities
    )
  })
})
