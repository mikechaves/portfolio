import Link from "next/link"
import { JsonLd } from "@/components/json-ld"
import { PROJECTS } from "@/data/projects"
import { getProjectCollectionStructuredData } from "@/lib/seo/structured-data"
import { EVIDENCE_DOSSIER_PROJECT_IDS } from "./[id]/dossierConfig"
import { DeferredProjectsExplorer } from "./DeferredProjectsExplorer"

const PROJECT_INTENT_PATHS = [
  {
    title: "AI products and human review",
    description:
      "Intent-to-action systems, evaluation workflows, operational interfaces, and governed automation.",
    projects: ["wizzo", "petition-ready", "vulnerability-visualizer", "creative-supply-engine"],
  },
  {
    title: "Game and creator systems",
    description:
      "Creation loops, game UX, discovery, spatial audio, and interactive play systems.",
    projects: ["x-games", "sound-escape-vr", "portals", "die-ai"],
  },
  {
    title: "Spatial and interactive tools",
    description:
      "Voice-first XR, browser-native 3D authoring, and map-based collaboration.",
    projects: ["speakeasy", "material-explorer", "geovoice"],
  },
] as const

const projectById = new Map(PROJECTS.map((project) => [project.id, project]))

export default function ProjectsPage() {
  return (
    <>
      <JsonLd
        id="project-collection-structured-data"
        data={getProjectCollectionStructuredData(PROJECTS)}
      />
      <div className="projects-index-page space-y-6 pt-6">
        <section className="project-index-hero" aria-labelledby="project-index-title">
          <div className="project-index-status" aria-hidden="true">
            <span>ARCHIVE / {PROJECTS.length.toString().padStart(2, "0")} RECORDS</span>
            <span>PROOF / REVIEWED</span>
            <span>INDEX / ONLINE</span>
          </div>

          <div className="project-index-hero-grid">
            <div>
              <p className="project-index-eyebrow">Portfolio evidence layer</p>
              <h1 id="project-index-title" className="project-index-title">
                Project Signal Index
              </h1>
              <p className="project-index-summary">
                Public proof across AI-native products, game and creator systems, immersive
                interfaces, human-AI workflows, operational tools, and design engineering.
              </p>
            </div>

            <dl className="project-index-ledger">
              <div>
                <dt>Projects indexed</dt>
                <dd>{PROJECTS.length.toString().padStart(2, "0")}</dd>
              </div>
              <div>
                <dt>Evidence dossiers</dt>
                <dd>{EVIDENCE_DOSSIER_PROJECT_IDS.size.toString().padStart(2, "0")}</dd>
              </div>
              <div>
                <dt>Default view</dt>
                <dd>All projects</dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          className="border-y border-white/10 bg-black/35 p-5 sm:p-6"
          aria-labelledby="project-intent-paths-title"
        >
          <div className="mb-5 max-w-3xl">
            <p className="project-index-eyebrow">Explore by product problem</p>
            <h2 id="project-intent-paths-title" className="mt-1 text-2xl font-semibold text-white">
              Choose an evidence path
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Start with the system closest to the work you are evaluating. Every public case
              remains available here before interactive filters are used.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {PROJECT_INTENT_PATHS.map((path) => (
              <div key={path.title} className="border-l border-white/15 pl-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.06em] text-zinc-100">
                  {path.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-zinc-500">{path.description}</p>
                <ul className="mt-3 space-y-2">
                  {path.projects.map((projectId) => {
                    const project = projectById.get(projectId)
                    if (!project) return null
                    return (
                      <li key={projectId}>
                        <Link
                          href={`/projects/${projectId}`}
                          className="inline-flex items-center gap-1 text-xs text-primary transition-colors hover:text-white"
                        >
                          {project.title} <span aria-hidden="true">→</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <DeferredProjectsExplorer />
      </div>
    </>
  )
}
