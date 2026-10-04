import { ArrowUpRight } from "lucide-react"
import { PortfolioEventLink } from "@/components/portfolio-event-link"
import type { Project } from "@/types/project"

interface FeaturedProjectCardProps { actionLabel: string; eyebrow: string; project: Project; summary: string }
const images: Record<string, { src: string; alt: string; width: number; height: number }> = {
  wizzo: { src: "/projects/wizzo/celestial-identity.webp", alt: "Wizzo’s celestial identity: Wisp above a moonlit observatory", width: 1730, height: 909 },
  "x-games": { src: "/projects/x-games/generated-game-detail.webp", alt: "Playfold’s live catalog of characters, worlds, and playable stories", width: 1600, height: 900 },
  speakeasy: { src: "/projects/speakeasy/thesis-defense.webp", alt: "Mike presenting the SpeakEasy voice-driven inclusive XR thesis", width: 4032, height: 3024 },
}

export function FeaturedProjectCard({ actionLabel, eyebrow, project, summary }: FeaturedProjectCardProps) {
  const art = images[project.id]
  if (!art) throw new Error(`Missing featured artwork: ${project.id}`)
  return (
    <PortfolioEventLink href={`/projects/${project.id}`} eventName="project_evidence_opened" eventProperties={{ project_id: project.id, source: "home_featured", match_level: "unranked" }} data-featured-project={project.id} className={`home-featured-card cinematic-feature cinematic-feature--${project.id}`}>
      <article data-reveal>
        <div className="cinematic-feature-media" data-art-plane>
          {/* eslint-disable-next-line @next/next/no-img-element -- actual pre-compressed project artwork */}
          <img {...art} alt={art.alt}
            srcSet={`/visuals/night-frequency/${project.id === "x-games" ? "playfold" : project.id}-mobile.webp ${project.id === "wizzo" ? 800 : 480}w, /visuals/night-frequency/${project.id === "x-games" ? "playfold" : project.id}.webp ${project.id === "wizzo" ? 1200 : 760}w, ${art.src} ${art.width}w`}
            sizes="(max-width: 700px) calc(100vw - 40px), (min-width: 1000px) 80vw, 100vw"
            decoding="async" loading="lazy" data-project-art />
          <span className="art-fallback" aria-hidden="true">{project.title}</span>
        </div>
        <div className="home-featured-copy">
          <p>{eyebrow}</p><h3>{project.title}</h3><span>{summary}</span>
          <strong>{actionLabel}<ArrowUpRight size={21} aria-hidden="true" /></strong>
        </div>
      </article>
    </PortfolioEventLink>
  )
}
