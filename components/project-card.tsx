import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { TrackedPortfolioLink } from "@/components/tracked-portfolio-link"
import { isSelfOptimizedImage } from "@/lib/image-delivery"
import type { ProjectEvidenceSource, ProjectMatchLevel } from "@/lib/portfolio-analytics"
import type { Project, ProjectThumbnailFocalPoint } from "@/types/project"

type ProjectCardProps = Project & {
  analyticsContext?: ProjectEvidenceSource
  analyticsMatchLevel?: ProjectMatchLevel
  priority?: boolean
}

const THUMBNAIL_OBJECT_POSITIONS: Record<ProjectThumbnailFocalPoint, string> = {
  center: "center",
  top: "center top",
  bottom: "center bottom",
  left: "left center",
  right: "right center",
}

interface ProjectCardLinkProps {
  analyticsContext?: ProjectEvidenceSource
  analyticsMatchLevel: ProjectMatchLevel
  children: ReactNode
  className: string
  projectId: string
}

function ProjectCardLink({
  analyticsContext,
  analyticsMatchLevel,
  children,
  className,
  projectId,
}: ProjectCardLinkProps) {
  const href = `/projects/${projectId}`

  if (analyticsContext) {
    return (
      <TrackedPortfolioLink
        href={href}
        eventName="project_evidence_opened"
        eventProperties={{
          project_id: projectId,
          source: analyticsContext,
          match_level: analyticsMatchLevel,
        }}
        className={className}
      >
        {children}
      </TrackedPortfolioLink>
    )
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

export function ProjectCard({
  id,
  title,
  description,
  image,
  technologies,
  thumbnailFocalPoint = "center",
  analyticsContext,
  analyticsMatchLevel = "unranked",
  priority,
}: ProjectCardProps) {
  const imageSource =
    image || `/api/placeholder?width=600&height=400&text=${encodeURIComponent(title)}`

  return (
    <ProjectCardLink
      projectId={id}
      analyticsContext={analyticsContext}
      analyticsMatchLevel={analyticsMatchLevel}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <article className="signal-project-card h-full overflow-hidden border border-white/15 bg-black/80 transition-colors group-hover:border-primary/60">
        <div className="relative aspect-[16/9] min-h-44 overflow-hidden border-b border-white/10 bg-zinc-950">
          <Image
            src={imageSource}
            alt={title}
            fill
            unoptimized={isSelfOptimizedImage(imageSource)}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
            style={{ objectPosition: THUMBNAIL_OBJECT_POSITIONS[thumbnailFocalPoint] }}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            priority={priority}
          />
        </div>
        <div className="flex flex-1 flex-col p-3.5">
          <div className="mb-2 flex items-start justify-between gap-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.04em] text-white sm:text-base">
              {title}
            </h3>
            <span className="mt-0.5 shrink-0 text-lg leading-none text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true">↗</span>
          </div>
          <p className="mb-3 line-clamp-3 flex-1 text-xs leading-5 text-zinc-400 sm:text-sm">
            {description}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-white/10 pt-2.5">
            {technologies.slice(0, 6).map((tech) => (
              <span
                key={tech}
                className="text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-primary/85"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </article>
    </ProjectCardLink>
  )
}
