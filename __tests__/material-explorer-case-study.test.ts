import fs from "node:fs"
import path from "node:path"
import { getEvidenceDossierConfig } from "../app/projects/[id]/dossierConfig"
import { buildProjectMedia } from "../app/projects/[id]/projectMedia"

interface DetailItem {
  description: string
  title: string
}

interface MaterialExplorerProject {
  demoLabel?: string
  gallery?: string[]
  image: string
  title: string
  details: {
    proofRole?: string
    results?: DetailItem[]
    services?: string[]
  }
}

const projects = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "public", "data", "projects.json"), "utf8"),
) as Record<string, MaterialExplorerProject>

describe("Material Explorer evidence dossier", () => {
  it("states the shipped browser-product role and preserves beta limitations", () => {
    const project = projects["material-explorer"]
    expect(project).toBeDefined()
    expect(project.details.proofRole).toContain("interactive 3D design tooling")
    expect(project.details.proofRole).toContain("automated quality gates")
    expect(project.details.services).toEqual([
      "3D Product Design",
      "Interactive 3D Tooling",
      "React & TypeScript Engineering",
      "Browser Quality Engineering",
    ])
    expect(project.demoLabel).toBe("Open Live Lab")

    const resultCopy = project.details.results
      ?.map(({ description, title }) => `${title} ${description}`)
      .join(" ")
    expect(resultCopy).toContain("Embedded textures can exceed browser quotas")
    expect(resultCopy).toContain("GLB output contains preview geometry")
    expect(resultCopy).toContain("active browser-material beta")
    expect(resultCopy).toContain("rather than claiming parity")
  })

  it("is enabled through the shared dossier configuration", () => {
    expect(getEvidenceDossierConfig("material-explorer")).toEqual({
      caseFile: "AF-11",
      eyebrow: "Interactive 3D tooling / Material iteration system",
      signals: "Author / Compare / Persist / Export",
    })
  })

  it("maps the deployed authoring, comparison, texture, and iteration states", () => {
    const project = projects["material-explorer"]
    const media = buildProjectMedia({
      gallery: project.gallery,
      id: "material-explorer",
      image: project.image,
      title: project.title,
    })

    expect(media).toHaveLength(5)
    expect(media.map((item) => item.label)).toEqual([
      "Material authoring workspace",
      "Live PBR material lab",
      "Dual-canvas A/B comparison",
      "Texture-map workflow",
      "Draft history and power tools",
    ])
    expect(media.filter((item) => item.section === "action")).toHaveLength(2)
    expect(media.filter((item) => item.section === "result")).toHaveLength(2)
  })
})
