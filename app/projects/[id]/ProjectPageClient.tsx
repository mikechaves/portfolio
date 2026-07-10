"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight, Github, ExternalLink } from "lucide-react"
import { useState, useCallback, useEffect, useMemo } from "react"
import type { ReactNode } from "react"
import { ImageModal } from "@/components/image-modal"
import type { Project as ProjectSummary } from "@/types/project"
import { ProjectEvidenceStrip } from "./ProjectEvidenceStrip"
import { ProjectMediaShowcase } from "./ProjectMediaShowcase"
import { getEvidenceDossierConfig } from "./dossierConfig"
import { buildProjectMedia, getSectionMedia, type ProjectEvidenceSection } from "./projectMedia"

interface DetailItem {
  title: string
  description: string
}

interface ProjectDetails {
  client?: string
  date?: string
  category?: string
  proofRole?: string
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
  id,
  kicker,
  title,
}: {
  children: ReactNode
  evidence?: ReactNode
  id?: string
  kicker?: string
  title: string
}) {
  return (
    <section id={id} className="case-study-section space-y-4">
      {kicker && <p className="dossier-section-kicker">{kicker}</p>}
      <h2 className="case-study-section-title">{title}</h2>
      {children}
      {evidence}
    </section>
  )
}

function DetailTextCard({ text }: { text: string }) {
  return (
    <div className="case-study-detail-card">
      <p className="case-study-detail-body">{text}</p>
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
      <p className="case-study-detail-body mt-2">{item.description}</p>
    </div>
  )
}

export default function ProjectPageClient({ project }: ProjectPageClientProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const dossierConfig = getEvidenceDossierConfig(project.id)
  const isEvidenceDossier = Boolean(dossierConfig)
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

  const projectLinkActions = projectLinks.length > 0 && (
    <div className="flex flex-wrap gap-3">
      {projectLinks.map((link) => (
        <a
          key={`${link.label}-${link.href}`}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex min-h-10 items-center gap-2 border px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
            isEvidenceDossier
              ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
              : link.style
          }`}
        >
          {link.type === "github" ? <Github size={16} /> : <ExternalLink size={16} />}
          {link.label}
        </a>
      ))}
    </div>
  )

  return (
    <div className={isEvidenceDossier ? "evidence-dossier space-y-10 pt-6" : "space-y-8 pt-8"}>
      {!isEvidenceDossier && <h1 className="sr-only">{project.title || "Project Details"}</h1>}
      <Link href="/projects" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary transition-colors hover:text-white">
        <ArrowLeft size={16} /> Back to systems
      </Link>

      {isEvidenceDossier ? (
        <>
          <section className="evidence-dossier-hero" aria-labelledby="dossier-title">
            <div className="evidence-dossier-status">
              <span>CASE FILE / {dossierConfig?.caseFile}</span>
              <span>REVIEWED EVIDENCE</span>
              <span>ACTIVE SYSTEM / {project.details.date}</span>
            </div>

            <div className="evidence-dossier-hero-grid">
              <div>
                <p className="evidence-dossier-eyebrow">{dossierConfig?.eyebrow}</p>
                <h1 id="dossier-title" className="evidence-dossier-title">{project.title}</h1>
                <p className="evidence-dossier-summary">{project.description}</p>
                <div className="mt-6">{projectLinkActions}</div>
              </div>

              <dl className="evidence-dossier-ledger">
                <div>
                  <dt>Operating proof</dt>
                  <dd>{project.details.proofRole}</dd>
                </div>
                <div>
                  <dt>Engagement</dt>
                  <dd>{project.details.client}</dd>
                </div>
                <div>
                  <dt>Evidence set</dt>
                  <dd>{media.length} reviewed artifacts</dd>
                </div>
                <div>
                  <dt>Capability coverage</dt>
                  <dd>{project.details.services?.length || 0} documented areas</dd>
                </div>
              </dl>
            </div>

            <div className="evidence-dossier-capabilities" aria-label="Documented capabilities">
              {project.details.services?.map((service) => <span key={service}>{service}</span>)}
            </div>
          </section>

          <section className="evidence-dossier-artifact" aria-labelledby="primary-artifact-title">
            <div className="signal-section-heading">
              <h2 id="primary-artifact-title">Primary artifact</h2>
              <span>01 / {String(media.length).padStart(2, "0")}</span>
            </div>
            <ProjectMediaShowcase media={media} onOpen={setSelectedIndex} />
          </section>
        </>
      ) : (
        <>
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
                <p><span className="text-primary">title:</span> {project.title}</p>
                <p><span className="text-primary">category:</span> {project.category}</p>
                <p><span className="text-primary">client:</span> {project.details.client}</p>
                <p><span className="text-primary">date:</span> {project.details.date}</p>
                <p className="case-study-stack-row">
                  <span className="text-primary">stack:</span>
                  {project.technologies.map((tech: string, index: number) => (
                    <span key={index} className="rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground">{tech}</span>
                  ))}
                </p>
                <p><span className="text-primary">proof role:</span> {project.details.proofRole || "concrete evidence for the operating model"}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
            <div className="space-y-5 lg:order-2">
              <div className="case-study-overview space-y-3">
                <h2 className="case-study-section-title">Project Overview</h2>
                <p className="case-study-detail-body">{project.description || "No description available."}</p>
                <Link href="/about" className="inline-flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80">
                  Revisit operating model <ArrowRight size={14} />
                </Link>
              </div>
              {projectLinkActions}
            </div>
            <ProjectMediaShowcase media={media} onOpen={setSelectedIndex} className="lg:order-1" />
          </div>
        </>
      )}

      <div className={isEvidenceDossier ? "evidence-dossier-body" : ""}>
        {isEvidenceDossier && (
          <aside className="evidence-dossier-index">
            <nav aria-label="Case study sections">
              <p>Case index</p>
              <a href="#situation"><span>01</span> Situation</a>
              <a href="#mandate"><span>02</span> Mandate</a>
              <a href="#build"><span>03</span> Build</a>
              <a href="#outcomes"><span>04</span> Outcomes</a>
            </nav>
            <dl>
              <div><dt>Artifacts</dt><dd>{String(media.length).padStart(2, "0")}</dd></div>
              <div><dt>Signals</dt><dd>{dossierConfig?.signals}</dd></div>
              <div><dt>Integrity</dt><dd>Repository reviewed</dd></div>
            </dl>
          </aside>
        )}

        <div className={isEvidenceDossier ? "evidence-dossier-sections" : "space-y-8"}>

      {project.details && project.details.situation && typeof project.details.situation === "string" && (
        <CaseStudySection id="situation" kicker={isEvidenceDossier ? "01 / Context" : undefined} title="Situation" evidence={renderEvidence("situation", "Situation")}>
          <DetailTextCard text={project.details.situation} />
        </CaseStudySection>
      )}

      {project.details && project.details.situation && Array.isArray(project.details.situation) && (
        <CaseStudySection id="situation" kicker={isEvidenceDossier ? "01 / Context" : undefined} title="Situation" evidence={renderEvidence("situation", "Situation")}>
          <div className="case-study-detail-grid">
            {project.details.situation.map((item: DetailItem, index: number) => (
              <DetailItemCard key={index} item={item} marker="•" />
            ))}
          </div>
        </CaseStudySection>
      )}

      {project.details && project.details.task && typeof project.details.task === "string" && (
        <CaseStudySection id="mandate" kicker={isEvidenceDossier ? "02 / Mandate" : undefined} title={isEvidenceDossier ? "Mandate" : "Task"} evidence={renderEvidence("task", "Task")}>
          <DetailTextCard text={project.details.task} />
        </CaseStudySection>
      )}

      {project.details && project.details.task && Array.isArray(project.details.task) && (
        <CaseStudySection id="mandate" kicker={isEvidenceDossier ? "02 / Mandate" : undefined} title={isEvidenceDossier ? "Mandate" : "Task"} evidence={renderEvidence("task", "Task")}>
          <div className="case-study-detail-grid">
            {project.details.task.map((item: DetailItem, index: number) => (
              <DetailItemCard key={index} item={item} marker="•" />
            ))}
          </div>
        </CaseStudySection>
      )}

      {project.details && project.details.actions && (
        <CaseStudySection id="build" kicker={isEvidenceDossier ? "03 / Build" : undefined} title={isEvidenceDossier ? "Build" : "Action"} evidence={renderEvidence("action", "Action")}>
          <div className="case-study-detail-grid">
            {project.details.actions.map((action: DetailItem, index: number) => (
              <DetailItemCard key={index} item={action} marker={`${index + 1}.`} />
            ))}
          </div>
        </CaseStudySection>
      )}

      {project.details && project.details.results && (
        <CaseStudySection id="outcomes" kicker={isEvidenceDossier ? "04 / Outcomes" : undefined} title={isEvidenceDossier ? "Outcomes" : "Result"} evidence={renderEvidence("result", "Result")}>
          <div className="case-study-detail-grid">
            {project.details.results.map((result: DetailItem, index: number) => (
              <DetailItemCard key={index} item={result} marker="•" />
            ))}
          </div>
        </CaseStudySection>
      )}

      {project.details && project.details.result && (
        <CaseStudySection id="outcomes" kicker={isEvidenceDossier ? "04 / Outcomes" : undefined} title={isEvidenceDossier ? "Outcomes" : "Result"} evidence={renderEvidence("result", "Result")}>
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
        </div>
      </div>
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
