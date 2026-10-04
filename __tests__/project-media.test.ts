import fs from "node:fs"
import path from "node:path"
import { runInNewContext } from "node:vm"
import { createElement, type ComponentType } from "react"
import * as jsxRuntime from "react/jsx-runtime"
import { renderToStaticMarkup } from "react-dom/server"
import ts from "typescript"
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

  test.each([false, true])("the viewer prioritizes only its opening image when priority is %s", (priority) => {
    const source = fs.readFileSync(
      path.join(__dirname, "..", "app", "projects", "[id]", "ProjectMediaShowcase.tsx"),
      "utf8",
    )

    const compiled = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    }).outputText
    const componentModule = { exports: {} as { ProjectMediaShowcase: ComponentType<{ media: ReturnType<typeof buildProjectMedia>; onOpen: () => void; priority: boolean }> } }
    runInNewContext(compiled, {
      module: componentModule,
      exports: componentModule.exports,
      require: (name: string) => {
        if (name === "react/jsx-runtime") return jsxRuntime
        if (name === "lucide-react") return { Maximize2: () => null }
        throw new Error(`Unexpected media dependency: ${name}`)
      },
    })
    const html = renderToStaticMarkup(createElement(componentModule.exports.ProjectMediaShowcase, {
      media: buildProjectMedia({ ...projects.wizzo, id: "wizzo" }), onOpen: () => {}, priority,
    }))
    const images = html.match(/<img\b[^>]*>/gu)!
    expect(images.length).toBeGreaterThan(1)
    expect(images[0]).toContain(`loading="${priority ? "eager" : "lazy"}"`)
    expect(images[0]).toContain(`fetchPriority="${priority ? "high" : "low"}"`)
    for (const image of images.slice(1)) {
      expect(image).toContain('loading="lazy"')
      expect(image).toContain('fetchPriority="low"')
    }
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
