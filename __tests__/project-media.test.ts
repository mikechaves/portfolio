import fs from "node:fs"
import path from "node:path"
import { buildProjectMedia } from "../app/projects/[id]/projectMedia"
import { isSelfOptimizedImage } from "../lib/image-delivery"

type ProjectRecord = {
  title: string
  image: string
  gallery?: string[]
}

const projects = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "public", "data", "projects.json"), "utf8"),
) as Record<string, ProjectRecord>

const HIGH_SIGNAL_PROJECT_IDS = [
  "wizzo",
  "x-games",
  "creative-supply-engine",
  "vulnerability-visualizer",
  "speakeasy",
  "petition-ready",
  "sound-escape-vr",
  "material-explorer",
]

describe("high-signal project media", () => {
  test("self-optimized media bypasses the image transformer", () => {
    expect(isSelfOptimizedImage("/projects/wizzo/app-interface.webp")).toBe(true)
    expect(isSelfOptimizedImage("/projects/wizzo/app-interface.webp?height=400&width=600")).toBe(true)
    expect(isSelfOptimizedImage("/projects/wizzo/app-interface.png")).toBe(false)

    const componentPaths = [
      path.join(__dirname, "..", "app", "projects", "[id]", "ProjectMediaShowcase.tsx"),
      path.join(__dirname, "..", "app", "projects", "[id]", "ProjectEvidenceStrip.tsx"),
      path.join(__dirname, "..", "components", "image-modal.tsx"),
    ]

    for (const componentPath of componentPaths) {
      const source = fs.readFileSync(componentPath, "utf8")
      const imageCount = source.match(/<Image\b/gu)?.length ?? 0
      const unoptimizedCount = source.match(/\bunoptimized\b/gu)?.length ?? 0

      expect(unoptimizedCount).toBe(imageCount)
    }
  })

  test("the shared viewer defers below-fold project media", () => {
    const source = fs.readFileSync(
      path.join(__dirname, "..", "app", "projects", "[id]", "ProjectMediaShowcase.tsx"),
      "utf8",
    )

    expect(source.match(/loading="lazy"/gu)).toHaveLength(2)
    expect(source).not.toContain('loading="eager"')
  })

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
