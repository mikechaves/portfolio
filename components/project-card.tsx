import Image from "next/image"
import type { Project } from "@/types/project"
import { IndustrialCard } from "@/components/industrial-card"

type ProjectCardProps = Project & {
  priority?: boolean
}

export function ProjectCard({ id, title, description, image, technologies, priority }: ProjectCardProps) {
  return (
    <IndustrialCard href={`/projects/${id}`}>
      <div className="industrial-card-media">
        <Image
          src={
            image ||
            `/api/placeholder?width=600&height=400&text=${encodeURIComponent(title)}`
          }
          alt={title}
          fill
          className="industrial-project-image object-cover grayscale"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          priority={priority}
        />
      </div>
      <div className="flex flex-1 flex-col">
        <h3>{title}</h3>
        <p className="flex-1 text-sm">{description}</p>
        <div className="industrial-meta">
          {technologies.slice(0, 4).map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </div>
    </IndustrialCard>
  )
}
