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
  test("all project media uses direct, pre-compressed delivery", () => {
    const nextConfigSource = fs.readFileSync(
      path.join(__dirname, "..", "next.config.js"),
      "utf8",
    )

    expect(nextConfigSource).toMatch(/images:\s*\{[\s\S]*?unoptimized:\s*true/u)

    for (const project of Object.values(projects)) {
      expect(project.image.split("?")[0]).toMatch(/\.webp$/u)
      expect((project.gallery || []).every((src) => src.split("?")[0].endsWith(".webp"))).toBe(true)
    }

    const componentPaths = [
      path.join(__dirname, "..", "app", "projects", "[id]", "ProjectMediaShowcase.tsx"),
      path.join(__dirname, "..", "app", "projects", "[id]", "ProjectEvidenceStrip.tsx"),
      path.join(__dirname, "..", "components", "about-content.tsx"),
      path.join(__dirname, "..", "components", "article-summary-page.tsx"),
      path.join(__dirname, "..", "components", "image-modal.tsx"),
      path.join(__dirname, "..", "components", "project-card.tsx"),
    ]

    for (const componentPath of componentPaths) {
      const source = fs.readFileSync(componentPath, "utf8")
      expect(source).not.toContain("isSelfOptimizedImage")
      expect(source).not.toMatch(/\bunoptimized=/u)
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
