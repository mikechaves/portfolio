"use client"

import Image from "next/image"
import Link from "next/link"
import {
  trackPortfolioEvent,
  type ProjectEvidenceSource,
  type ProjectMatchLevel,
} from "@/lib/portfolio-analytics"
import type { Project, ProjectThumbnailFocalPoint } from "@/types/project"

type ProjectCardProps = Project & {
  actionLabel?: string
  analyticsContext?: ProjectEvidenceSource
  analyticsMatchLevel?: ProjectMatchLevel
  eyebrow?: string
  priority?: boolean
  summary?: string
  variant?: "default" | "featured"
}

const THUMBNAIL_OBJECT_POSITIONS: Record<ProjectThumbnailFocalPoint, string> = {
  center: "center",
  top: "center top",
  bottom: "center bottom",
  left: "left center",
  right: "right center",
}

export function ProjectCard({
  actionLabel = "Inspect evidence",
  id,
  title,
  description,
  eyebrow,
  image,
  technologies,
  thumbnailFocalPoint = "center",
  analyticsContext,
  analyticsMatchLevel = "unranked",
  priority,
  summary,
  variant = "default",
}: ProjectCardProps) {
  if (variant === "featured") {
    return (
      <Link
        href={`/projects/${id}`}
        onClick={
          analyticsContext
            ? () =>
                trackPortfolioEvent("project_evidence_opened", {
                  project_id: id,
                  source: analyticsContext,
                  match_level: analyticsMatchLevel,
                })
            : undefined
        }
        className="home-featured-card group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        <article>
          <div className="home-featured-image">
            <Image
              src={image || `/api/placeholder?width=600&height=400&text=${encodeURIComponent(title)}`}
              alt={`${title} project interface`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              style={{ objectPosition: THUMBNAIL_OBJECT_POSITIONS[thumbnailFocalPoint] }}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              priority={priority}
            />
          </div>
          <div className="home-featured-copy">
            {eyebrow ? <p>{eyebrow}</p> : null}
            <h3>{title}</h3>
            <span>{summary ?? description}</span>
            <strong>{actionLabel} <span aria-hidden="true">↗</span></strong>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link
      href={`/projects/${id}`}
      onClick={
        analyticsContext
          ? () =>
              trackPortfolioEvent("project_evidence_opened", {
                project_id: id,
                source: analyticsContext,
                match_level: analyticsMatchLevel,
              })
          : undefined
      }
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <article className="signal-project-card h-full overflow-hidden border border-white/15 bg-black/80 transition-colors group-hover:border-primary/60">
        <div className="relative aspect-[16/9] min-h-44 overflow-hidden border-b border-white/10 bg-zinc-950">
          <Image
            src={
              image ||
              `/api/placeholder?width=600&height=400&text=${encodeURIComponent(title)}`
            }
            alt={title}
            fill
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
    </Link>
  );
}
