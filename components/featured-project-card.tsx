import { DeferredFeaturedProjectImage } from "@/components/deferred-featured-project-image"
import { TrackedPortfolioLink } from "@/components/tracked-portfolio-link"
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

export function FeaturedProjectCard({
  actionLabel,
  eyebrow,
  project,
  summary,
}: FeaturedProjectCardProps) {
  return (
    <TrackedPortfolioLink
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
        <DeferredFeaturedProjectImage
          src={project.image}
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
    </TrackedPortfolioLink>
  )
}
