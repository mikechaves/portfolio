"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Github } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { ImageModal } from "@/components/image-modal"

interface DetailItem {
  title: string
  description: string
}

interface ProjectDetails {
  client?: string
  date?: string
  category?: string
  services?: string[]
  situation?: string | DetailItem[]
  task?: string | DetailItem[]
  actions?: DetailItem[]
  results?: DetailItem[]
  result?: string
  exhibition?: DetailItem[]
}

interface Project {
  id: string
  title: string
  image: string
  gallery?: string[]
  category: string
  description: string
  technologies: string[]
  github?: string
  demo?: string
  details: ProjectDetails
}

interface ProjectPageClientProps {
  project: Project
}

function DetailSection({
  title,
  content,
  ordered = false,
}: {
  title: string
  content?: string | DetailItem[]
  ordered?: boolean
}) {
  if (!content) return null

  return (
    <section>
      <h2 className="mb-5 text-3xl font-black uppercase text-[#f1ede3]">{title}</h2>
      {typeof content === "string" ? (
        <div className="industrial-card">
          <p>{content}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {content.map((item, index) => (
            <article key={`${title}-${item.title}`} className="industrial-card">
              <span className="text-xs uppercase tracking-[0.16em] text-[#8f8678]">
                {ordered ? String(index + 1).padStart(2, "0") : "Signal"}
              </span>
              <h3 className="mt-3">{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default function ProjectPageClient({ project }: ProjectPageClientProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const images = [project.image, ...(project.gallery || [])].filter(Boolean)

  const closeModal = useCallback(() => setSelectedIndex(null), [])

  const handlePrev = useCallback(() => {
    setSelectedIndex((i) => {
      if (i === null) return null
      return (i - 1 + images.length) % images.length
    })
  }, [images.length])

  const handleNext = useCallback(() => {
    setSelectedIndex((i) => {
      if (i === null) return null
      return (i + 1) % images.length
    })
  }, [images.length])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext()
      if (e.key === "ArrowLeft") handlePrev()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [handleNext, handlePrev])

  return (
    <div className="industrial-page">
      <Link href="/projects" className="industrial-text-link !mt-0">
        <ArrowLeft size={14} /> Back to work
      </Link>

      <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="industrial-page-kicker">{project.details.category || project.category}</p>
          <h1 className="industrial-page-title">{project.title}</h1>
          <p className="industrial-page-intro">{project.description}</p>
          <div className="industrial-meta">
            {project.technologies.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="industrial-card-media m-0 min-h-[22rem] w-full"
          onClick={() => setSelectedIndex(0)}
          aria-label={`Open ${project.title} image`}
        >
          <Image
            src={project.image || `/api/placeholder?width=1200&height=700&text=${encodeURIComponent(project.title)}`}
            alt={project.title}
            fill
            className="object-cover grayscale"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        </button>
      </div>

      <div className="industrial-rule" />

      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Client", project.details.client],
          ["Date", project.details.date],
          ["Category", project.details.category || project.category],
          ["Services", project.details.services?.join(" / ")],
        ].map(([label, value]) => (
          <div key={label} className="industrial-card">
            <span className="text-xs uppercase tracking-[0.16em] text-[#8f8678]">{label}</span>
            <p className="!mt-3 text-[#eee7d8]">{value || "Selected work"}</p>
          </div>
        ))}
      </section>

      {project.gallery && project.gallery.length > 0 && (
        <section className="mt-16 grid gap-4 md:grid-cols-3">
          {project.gallery.map((img, index) => (
            <button
              key={img}
              type="button"
              className="industrial-card-media m-0 min-h-[14rem]"
              onClick={() => setSelectedIndex(index + 1)}
              aria-label={`Open gallery image ${index + 1}`}
            >
              <Image src={img} alt={`${project.title} gallery image ${index + 1}`} fill className="object-cover grayscale" sizes="33vw" />
            </button>
          ))}
        </section>
      )}

      <section className="mt-10 flex flex-wrap gap-3">
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="industrial-button industrial-button-ghost">
            <Github size={16} /> GitHub
          </a>
        )}
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noopener noreferrer" className="industrial-button industrial-button-primary">
            <ExternalLink size={16} /> Live / Reference
          </a>
        )}
      </section>

      <div className="mt-16 grid gap-16">
        <DetailSection title="Situation" content={project.details.situation} />
        <DetailSection title="Task" content={project.details.task} />
        <DetailSection title="Action" content={project.details.actions} ordered />
        <DetailSection title="Result" content={project.details.results || project.details.result} />
        <DetailSection title="Exhibition & Future Directions" content={project.details.exhibition} />
      </div>

      <ImageModal
        open={selectedIndex !== null}
        onOpenChange={(o) => !o && closeModal()}
        src={selectedIndex !== null ? images[selectedIndex] : ""}
        alt={project.title}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  )
}
