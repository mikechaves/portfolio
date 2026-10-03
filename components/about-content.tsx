import { ArrowRight, Download, Github, Linkedin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AboutContactForm } from "@/components/about-contact-form"
import { PortfolioEventLink } from "@/components/portfolio-event-link"
import { ProfessionalExperienceProof } from "@/components/professional-experience-proof"
import { XIcon } from "@/components/x-icon"
import { EVIDENCE_CATALOG } from "@/features/adaptive-focus/evidence/catalog"
import { PROFESSIONAL_EXPERIENCE_RECORDS } from "@/features/adaptive-focus/evidence/professional-experience"

const professionalExperienceCapabilities = new Map(
  PROFESSIONAL_EXPERIENCE_RECORDS.map((record) => [
    record.id,
    [...new Set(
      EVIDENCE_CATALOG.filter((evidence) => evidence.entityId === record.id).map(
        (evidence) => evidence.capability
      )
    )],
  ])
)

const publicSignals = [
  {
    id: "futures-summit-2025",
    event: "Futures Summit 2025",
    role: "Panelist",
    title: "The Rise of Synthetic AI Companions: Promise or Peril",
    date: "September 2025",
    image: "/events/chaves_futuressummit_2025_thumb.webp",
  },
  {
    id: "gatherverse-2025",
    event: "GatherVerse XREvolve",
    role: "Panelist",
    title: "AR & AI: The Intersection of the Future",
    date: "June 2025",
    image: "/events/chaves_gatherverse_2025_thumb.webp",
  },
  {
    id: "xr-access-2024",
    event: "XR Access Symposium",
    role: "Speaker",
    title: "Voice-Driven Mixed Reality for Accessibility",
    date: "July 2024",
    image: "/events/chaves_xraccess_2024_thumb.webp",
  },
  {
    id: "adobe-2023",
    event: "Adobe Experiential Horizons",
    role: "Host / Presenter",
    title: "Industry Roundtable and Demo Showcase",
    date: "October 2023",
    image: "/events/chaves_adobesympo_2023_thumb.webp",
  },
]

export function AboutContent() {
  return (
    <div className="about-operating-page space-y-8 pt-6">
      <div
        hidden
        className="rounded-md border border-primary/30 bg-primary/5 px-4 py-3"
        data-focus-context
      >
        <p className="mb-1 text-xs text-muted-foreground">Current focus</p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm" data-focus-context-value />
          <Link
            href="/projects"
            className="-my-3 inline-flex min-h-11 items-center text-sm text-primary hover:underline"
          >
            View project archive
          </Link>
        </div>
      </div>

      <section className="operating-profile-hero" aria-labelledby="about-title">

        <div className="operating-profile-grid">
          <div className="operating-profile-copy">
            <p className="operating-profile-eyebrow">Creative Director & Creative Technologist</p>
            <h1 id="about-title" className="operating-profile-title">Mike Chaves</h1>
            <p className="operating-profile-lede">
              I’m a creative director, designer, and storyteller who likes to make the idea real.
            </p>
            <p className="operating-profile-summary">
              My foundation is brand and entertainment: I directed digital creative work across all Knitting Factory venues and subsidiaries, connecting identity, campaigns, and live-event experiences. Today I lead <a href="https://wizzolabs.net" target="_blank" rel="noopener noreferrer" className="text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary">Wizzo Labs</a>, the parent company behind Wizzo, an AI mentor product, and Playfold, an interactive-experiences product. I move from concept and visual direction through prototyping and implementation, using AI, code, and real-time 3D as part of the creative toolkit.
            </p>
            <div className="operating-profile-actions">
              <Link href="/projects" prefetch={false} className="operating-profile-primary-action">
                Explore selected work <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <PortfolioEventLink
                href="/Michael_Chaves_Resume.pdf"
                download
                eventName="portfolio_conversion_clicked"
                eventProperties={{ destination: "resume", source: "about_hero" }}
                className="operating-profile-secondary-action"
              >
                Download résumé (PDF) <Download size={15} aria-hidden="true" />
              </PortfolioEventLink>
            </div>
          </div>

          <figure className="operating-profile-portrait">
            <Image
              src="/portrait/mike-chaves.webp"
              alt="Mike Chaves"
              fill
              className="object-cover"
              sizes="(min-width: 900px) 38vw, 100vw"
              priority
            />
            <figcaption>
              <span>Los Angeles, California</span>
              <strong>Mike Chaves</strong>
            </figcaption>
          </figure>
        </div>

        <p className="profile-personal-note">Horror and thrillers. Metal and industrial music. Modern art, brutalist forms, and stories you can step into.</p>
      </section>

      <section
        id="professional-experience"
        className="profile-section scroll-mt-24"
        aria-labelledby="professional-experience-title"
      >
        <div className="profile-section-heading">
          <div>
            <p className="operating-profile-eyebrow">Experience</p>
            <h2 id="professional-experience-title">Selected professional experience</h2>
          </div>
          <p>
            Brand and entertainment leadership sits alongside product, immersive, and technical work. These summaries describe my roles and scope; confidential employer materials remain private.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {PROFESSIONAL_EXPERIENCE_RECORDS.map((record) => (
            <ProfessionalExperienceProof
              key={record.id}
              record={record}
              matchedCapabilities={professionalExperienceCapabilities.get(record.id) ?? []}
              variant="summary"
              context="about"
            />
          ))}
        </div>
      </section>

      <section className="profile-section" aria-labelledby="education-title">
        <div className="profile-section-heading">
          <div><p className="operating-profile-eyebrow">Education</p><h2 id="education-title">Education</h2></div>
        </div>
        <div className="profile-proof-grid">
          <article className="profile-proof-record"><h3>Master of Design, Experience Design</h3><p>San José State University / May 2025</p></article>
          <article className="profile-proof-record"><h3>Bachelor of Science, Games, Interactive Media &amp; Mobile Technology</h3><p>Boise State University / May 2020</p></article>
        </div>
      </section>

      <section className="profile-section" aria-labelledby="public-practice-title">
        <div className="profile-section-heading">
          <div>
            <p className="operating-profile-eyebrow">Public practice</p>
            <h2 id="public-practice-title">Talks & panels</h2>
          </div>
          <p>Selected talks and panels extending project work into shared industry conversations.</p>
        </div>
        <div className="public-signal-grid">
          {publicSignals.map((signal) => (
            <article key={signal.id} className="public-signal-card">
              <div className="public-signal-image">
                <Image src={signal.image} alt="" fill className="object-cover" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
              </div>
              <div className="public-signal-body">
                <div><span>{signal.role}</span><time>{signal.date}</time></div>
                <h3>{signal.event}</h3>
                <p>{signal.title}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="profile-contact-section scroll-mt-24" aria-labelledby="contact-title">
        <div className="profile-contact-intro">
          <p className="operating-profile-eyebrow">Contact</p>
          <h2 id="contact-title" className="scroll-mt-24">Say hello.</h2>
          <p>
            Los Angeles, California.
          </p>
          <PortfolioEventLink
            href="/Michael_Chaves_Resume.pdf"
            download
            eventName="portfolio_conversion_clicked"
            eventProperties={{ destination: "resume", source: "about_contact" }}
            className="operating-profile-secondary-action"
          >
            Download résumé (PDF) <Download size={15} aria-hidden="true" />
          </PortfolioEventLink>

          <div className="profile-network-links" aria-label="Professional network links">
            <a href="https://github.com/mikechaves" target="_blank" rel="noopener noreferrer"><Github size={17} aria-hidden="true" /> GitHub</a>
            <a href="https://x.com/mikechaves_io" target="_blank" rel="noopener noreferrer"><XIcon className="h-4 w-4" /> X</a>
            <a href="https://www.linkedin.com/in/mikejchaves" target="_blank" rel="noopener noreferrer"><Linkedin size={17} aria-hidden="true" /> LinkedIn</a>
          </div>
        </div>

        <AboutContactForm />
      </section>
    </div>
  )
}
