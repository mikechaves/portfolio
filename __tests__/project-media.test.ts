import fs from "node:fs"
import path from "node:path"
import { buildProjectMedia } from "../app/projects/[id]/projectMedia"

type ProjectRecord = {
  title: string
  image: string
  gallery?: string[]
}

const projects = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "public", "data", "projects.json"), "utf8"),
) as Record<string, ProjectRecord>

const HIGH_SIGNAL_PROJECT_IDS = [
  "astrocade-qa-calibration-tool",
  "wizzo",
  "x-games",
  "creative-supply-engine",
  "vulnerability-visualizer",
  "speakeasy",
  "transcribe",
  "petition-ready",
]

describe("high-signal project media", () => {
  test.each(HIGH_SIGNAL_PROJECT_IDS)("%s has explicit media copy", (id) => {
    const project = projects[id]
    expect(project).toBeDefined()
    if (!project) return

    const media = buildProjectMedia({
      gallery: project.gallery,
      id,
      image: project.image,
      title: project.title,
    })

    expect(media.length).toBeGreaterThan(0)
    expect(media.every((item) => item.label !== "Primary artifact")).toBe(true)
    expect(media.every((item) => !item.caption.includes("Primary project image"))).toBe(true)

    if ((project.gallery || []).length > 0) {
      expect(media.some((item) => item.section)).toBe(true)
    }
  })
})
