import fs from "node:fs"
import path from "node:path"
import { runInNewContext } from "node:vm"
import { createElement, type ComponentType } from "react"
import * as React from "react"
import * as jsxRuntime from "react/jsx-runtime"
import { renderToStaticMarkup } from "react-dom/server"
import ts from "typescript"
import { getEvidenceDossierConfig } from "../app/projects/[id]/dossierConfig"
import { buildProjectMedia, getSectionMedia } from "../app/projects/[id]/projectMedia"
import type { ProjectDetail, ProjectDesignStory } from "../types/project-detail"

// The repository's Node-only Jest transform preserves JSX. Compile this one
// client shell for real React rendering; unrelated child widgets remain stubs.
const source = fs.readFileSync(path.join(__dirname, "../app/projects/[id]/ProjectPageClient.tsx"), "utf8")
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText
const Empty = () => null
const modules: Record<string, unknown> = {
  react: React,
  "react/jsx-runtime": jsxRuntime,
  "next/link": "a",
  "next/dynamic": () => Empty,
  "lucide-react": { ArrowRight: Empty, Github: Empty, ExternalLink: Empty },
  "@/components/share-project-button": { ShareProjectButton: Empty },
  "./ProjectDesignStory": { ProjectDesignStory: Empty },
  "./ProjectEvidenceStrip": { ProjectEvidenceStrip: Empty },
  "./ProjectMediaShowcase": { ProjectMediaShowcase: Empty },
  "./dossierConfig": { getEvidenceDossierConfig },
  "./projectMedia": { buildProjectMedia, getSectionMedia },
}
const componentModule = { exports: {} as { default: ComponentType<{ project: ProjectDetail }> } }
runInNewContext(compiled, {
  module: componentModule,
  exports: componentModule.exports,
  require: (name: string) => {
    if (!(name in modules)) throw new Error(`Unexpected shell dependency: ${name}`)
    return modules[name]
  },
})
const ProjectPageClient = componentModule.exports.default
const projects = JSON.parse(fs.readFileSync(path.join(__dirname, "../public/data/projects.json"), "utf8")) as Record<string, ProjectDetail>
const render = (id: string, designStory = projects[id].designStory) =>
  renderToStaticMarkup(createElement(ProjectPageClient, { project: { ...projects[id], id, designStory } }))

describe("shared product-design story shell", () => {
  it("renders a Playfold story without inventing a quote or borrowing Wizzo's title", () => {
    const story: ProjectDesignStory = { sections: [], downloads: [] }
    const html = render("x-games", story)
    expect(html).toContain('id="primary-artifact-title">The Playfold experience</h2>')
    expect(html).not.toContain("The Wizzo experience")
    expect(html).not.toContain("<blockquote")
    expect(html).not.toContain("<figcaption")
  })

  it("preserves Wizzo's existing experience heading, supplied quote and attribution", () => {
    const story = projects.wizzo.designStory!
    const html = render("wizzo")
    expect(html).toContain('id="primary-artifact-title">The Wizzo experience</h2>')
    expect(html).toContain(`“${story.quote}”</blockquote>`)
    expect(html).toContain(`${story.attribution}</figcaption>`)
  })

  it("does not render an orphan attribution or an empty quotation", () => {
    const html = render("x-games", { quote: "", attribution: "Unused attribution", sections: [], downloads: [] })
    expect(html).not.toContain("<blockquote")
    expect(html).not.toContain("Unused attribution")
  })
})
