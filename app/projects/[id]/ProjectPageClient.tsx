"use client"

import Link from "next/link"
import { ArrowLeft, Github, ExternalLink } from "lucide-react"
import { useState, useCallback, useEffect, useMemo } from "react"
import type { ReactNode } from "react"
import { ImageModal } from "@/components/image-modal"
import type { Project as ProjectSummary } from "@/types/project"
import { ProjectEvidenceStrip } from "./ProjectEvidenceStrip"
import { ProjectMediaShowcase } from "./ProjectMediaShowcase"
import { buildProjectMedia, getSectionMedia, type ProjectEvidenceSection } from "./projectMedia"

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

interface ProjectLink {
  label: string
  url: string
}

interface Project {
  id: string
  title: string
  image: string
  gallery?: string[]
  category: ProjectSummary["category"]
  description: string
  technologies: string[]
  github?: string
  demo?: string
  demoLabel?: string
  links?: ProjectLink[]
  details: ProjectDetails
}

interface ProjectPageClientProps {
  project: Project
}

function CaseStudySection({
  children,
  evidence,
  title,
}: {
  children: ReactNode
  evidence?: ReactNode
  title: string
}) {
  return (
    <section className="case-study-section space-y-4">
      <h2 className="case-study-section-title">{title}</h2>
      {children}
      {evidence}
    </section>
  )
}

function DetailTextCard({ text }: { text: string }) {
  return (
    <div className="case-study-detail-card">
      <p className="case-study-detail-body mt-0">{text}</p>
    </div>
  )
}

function DetailItemCard({ item, marker }: { item: DetailItem; marker: string }) {
  return (
    <div className="case-study-detail-card">
      <h3 className="case-study-detail-title">
        <span className="case-study-detail-marker">{marker}</span>
        <span>{item.title}</span>
      </h3>
      <p className="case-study-detail-body">{item.description}</p>
    </div>
  )
}

export default function ProjectPageClient({ project }: ProjectPageClientProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const projectLinks = useMemo(
    () => [
      ...(project.github
        ? [
            {
              href: project.github,
              label: "View on GitHub",
              style: "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
              type: "github" as const,
            },
          ]
        : []),
      ...(project.demo
        ? [
            {
              href: project.demo,
              label: project.demoLabel || "Live Demo",
              style: "bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30",
              type: "external" as const,
            },
          ]
        : []),
      ...(project.links || []).map((link) => ({
        href: link.url,
        label: link.label,
        style: "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
        type: "external" as const,
      })),
    ],
    [project.demo, project.demoLabel, project.github, project.links]
  )

  const media = useMemo(
    () =>
      buildProjectMedia({
        gallery: project.gallery,
        id: project.id,
        image: project.image,
        title: project.title,
      }),
    [project.gallery, project.id, project.image, project.title]
  )

  const images = useMemo(() => media.map((item) => item.src), [media])
  const selectedMedia = selectedIndex !== null ? media[selectedIndex] : undefined

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
    if (selectedIndex === null || images.length <= 1) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "ArrowLeft") {
        handlePrev()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [handleNext, handlePrev, images.length, selectedIndex])

  const renderEvidence = (section: ProjectEvidenceSection, title: string) => {
    const sectionMedia = getSectionMedia(media, section)
    return sectionMedia.length > 0 ? (
      <ProjectEvidenceStrip media={sectionMedia} onOpen={setSelectedIndex} title={title} />
    ) : null
  }

  return (
    <div className="space-y-8 pt-8">
      <h1 className="sr-only">{project.title || "Project Details"}</h1>
      <Link href="/projects" className="inline-flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft size={16} /> Back to projects
      </Link>

      <div className="terminal-window case-study-terminal">
        <div className="terminal-header">
          <div className="terminal-button terminal-button-red"></div>
          <div className="terminal-button terminal-button-yellow"></div>
          <div className="terminal-button terminal-button-green"></div>
          <div className="terminal-title">project_details.sh</div>
        </div>
        <div className="terminal-content case-study-meta">
          <p className="case-study-command">
            <span className="text-primary">$</span> cat {project.id}.json
          </p>
          <div className="case-study-meta-grid">
            <p>
              <span className="text-primary">title:</span> {project.title}
            </p>
            <p>
              <span className="text-primary">category:</span> {project.category}
            </p>
            <p>
              <span className="text-primary">client:</span> {project.details.client}
            </p>
            <p>
              <span className="text-primary">date:</span> {project.details.date}
            </p>
            <p className="case-study-stack-row">
              <span className="text-primary">stack:</span>
              {project.technologies.map((tech: string, index: number) => (
                <span key={index} className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded">
                  {tech}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="space-y-5 lg:order-2">
          <div className="case-study-overview space-y-3">
            <h2 className="case-study-section-title">Project Overview</h2>
            <p className="case-study-detail-body mt-0">{project.description || "No description available."}</p>
          </div>

          {projectLinks.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {projectLinks.map((link) => (
                <a
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${link.style}`}
                >
                  {link.type === "github" ? <Github size={16} /> : <ExternalLink size={16} />}
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>

        <ProjectMediaShowcase
          media={media}
          onOpen={setSelectedIndex}
          className="lg:order-1"
        />
      </div>

      {project.details && project.details.situation && typeof project.details.situation === "string" && (
        <CaseStudySection title="Situation" evidence={renderEvidence("situation", "Situation")}>
          <DetailTextCard text={project.details.situation} />
        </CaseStudySection>
      )}

      {project.details && project.details.situation && Array.isArray(project.details.situation) && (
        <CaseStudySection title="Situation" evidence={renderEvidence("situation", "Situation")}>
          <div className="case-study-detail-grid">
            {project.details.situation.map((item: DetailItem, index: number) => (
              <DetailItemCard key={index} item={item} marker="•" />
            ))}
          </div>
        </CaseStudySection>
      )}

      {project.details && project.details.task && typeof project.details.task === "string" && (
        <CaseStudySection title="Task" evidence={renderEvidence("task", "Task")}>
          <DetailTextCard text={project.details.task} />
        </CaseStudySection>
      )}

      {project.details && project.details.task && Array.isArray(project.details.task) && (
        <CaseStudySection title="Task" evidence={renderEvidence("task", "Task")}>
          <div className="case-study-detail-grid">
            {project.details.task.map((item: DetailItem, index: number) => (
              <DetailItemCard key={index} item={item} marker="•" />
            ))}
          </div>
        </CaseStudySection>
      )}

      {project.details && project.details.actions && (
        <CaseStudySection title="Action" evidence={renderEvidence("action", "Action")}>
          <div className="case-study-detail-grid">
            {project.details.actions.map((action: DetailItem, index: number) => (
              <DetailItemCard key={index} item={action} marker={`${index + 1}.`} />
            ))}
          </div>
        </CaseStudySection>
      )}

      {project.details && project.details.results && (
        <CaseStudySection title="Result" evidence={renderEvidence("result", "Result")}>
          <div className="case-study-detail-grid">
            {project.details.results.map((result: DetailItem, index: number) => (
              <DetailItemCard key={index} item={result} marker="•" />
            ))}
          </div>
        </CaseStudySection>
      )}

      {project.details && project.details.result && (
        <CaseStudySection title="Result" evidence={renderEvidence("result", "Result")}>
          <DetailTextCard text={project.details.result} />
        </CaseStudySection>
      )}

      {project.details && project.details.exhibition && (
        <CaseStudySection title="Exhibition & Future Directions" evidence={renderEvidence("exhibition", "Exhibition")}>
          <div className="case-study-detail-grid">
            {project.details.exhibition.map((item: DetailItem, index: number) => (
              <DetailItemCard key={index} item={item} marker="•" />
            ))}
          </div>
        </CaseStudySection>
      )}
      <ImageModal
        open={selectedIndex !== null}
        onOpenChange={(o) => !o && closeModal()}
        src={selectedMedia?.src || ""}
        alt={selectedMedia?.alt || project.title}
        caption={selectedMedia?.caption}
        onPrev={images.length > 1 ? handlePrev : undefined}
        onNext={images.length > 1 ? handleNext : undefined}
        title={selectedMedia?.label}
      />
    </div>
  )
}
