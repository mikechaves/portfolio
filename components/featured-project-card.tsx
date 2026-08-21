import { FeaturedProjectImage } from "@/components/featured-project-image"
import { PortfolioEventLink } from "@/components/portfolio-event-link"
import type { Project, ProjectThumbnailFocalPoint } from "@/types/project"

interface FeaturedProjectCardProps {
  actionLabel: string
  eyebrow: string
  project: Project
  summary: string
}

const THUMBNAIL_OBJECT_POSITIONS: Record<ProjectThumbnailFocalPoint, string> = {
  center: "center",
  top: "center top",
  bottom: "center bottom",
  left: "left center",
  right: "right center",
}

const HOME_FEATURED_IMAGES = {
  wizzo: {
    src: "/projects/wizzo/app-interface-home.webp",
    width: 900,
    height: 506,
  },
  "x-games": {
    src: "/projects/x-games/generated-game-detail-home.webp",
    width: 900,
    height: 506,
  },
  speakeasy: {
    src: "/projects/speakeasy/thesis-defense-home.webp",
    width: 900,
    height: 675,
  },
} as const

export function FeaturedProjectCard({
  actionLabel,
  eyebrow,
  project,
  summary,
}: FeaturedProjectCardProps) {
  const image = HOME_FEATURED_IMAGES[project.id as keyof typeof HOME_FEATURED_IMAGES]
  if (!image) throw new Error(`Missing homepage image for featured project: ${project.id}`)

  return (
    <PortfolioEventLink
      href={`/projects/${project.id}`}
      eventName="project_evidence_opened"
      eventProperties={{
        project_id: project.id,
        source: "home_featured",
        match_level: "unranked",
      }}
      className="home-featured-card group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      <article>
        <FeaturedProjectImage
          {...image}
          alt={`${project.title} project interface`}
          objectPosition={
            THUMBNAIL_OBJECT_POSITIONS[project.thumbnailFocalPoint ?? "center"]
          }
        />
        <div className="home-featured-copy">
          <p>{eyebrow}</p>
          <h3>{project.title}</h3>
          <span>{summary}</span>
          <strong>
            {actionLabel} <span aria-hidden="true">↗</span>
          </strong>
        </div>
      </article>
    </PortfolioEventLink>
  )
}
