import Link from "next/link"
import { Archive, ExternalLink } from "lucide-react"

const technologies = ["A-Frame", "D3.js", "JavaScript", "3D Visualization", "Data Provenance"]
const statuses = ["Archived", "Academic Prototype", "Synthetic Data Disclosed"]

export const metadata = {
  title: "Archive | Mike Chaves",
  description: "Legacy academic prototypes and retired experiments preserved with their original context and limitations.",
}

export default function ArchivePage() {
  return (
    <div className="site-shell space-y-8 pb-16 pt-8">
      <header className="archive-page-header">
        <p className="project-index-eyebrow">Legacy work / Lower prominence</p>
        <h1>Archive</h1>
        <p>
          Retired experiments preserved for historical context. Current portfolio work remains in the{" "}
          <Link href="/projects">Project Signal Index</Link>.
        </p>
      </header>

      <article id="ai-energy-context-explorer" className="legacy-project-card">
        <div className="legacy-project-card__status">
          <Archive size={16} aria-hidden="true" />
          <span>Archived graduate academic prototype</span>
        </div>
        <div className="legacy-project-card__body">
          <p className="project-index-eyebrow">Graduate project, 2023; data-provenance revision, 2026</p>
          <h2>AI Energy Context Explorer</h2>
          <p>
            An A-Frame and D3 experiment in 3D geospatial interaction. The original country-level dataset was synthetic and was used to prototype filtering, spatial encoding, tooltips, and data navigation, not to make empirical claims about AI energy use or emissions. A later revision replaced the synthetic runtime with live Great Britain grid-carbon data and added explicit provenance and limitations. Neither version estimates AI-attributed emissions by country.
          </p>
          <div className="legacy-project-card__labels" aria-label="Project status">
            {statuses.map((status) => <span key={status}>{status}</span>)}
          </div>
          <div className="legacy-project-card__labels legacy-project-card__labels--tech" aria-label="Technologies">
            {technologies.map((technology) => <span key={technology}>{technology}</span>)}
          </div>
          <Link
            href="https://github.com/mikechaves/ai-energy-consumption"
            target="_blank"
            rel="noopener noreferrer"
            className="legacy-project-card__link"
          >
            Archived repository <ExternalLink size={14} aria-hidden="true" />
          </Link>
        </div>
      </article>
    </div>
  )
}
