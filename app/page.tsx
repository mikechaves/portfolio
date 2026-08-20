import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  AudioLines,
  BrainCircuit,
  Code2,
  Download,
  Gamepad2,
  Linkedin,
} from "lucide-react"
import { AdaptiveFocusEntry } from "@/components/adaptive-focus-entry"
import { HomeJourneyLink } from "@/components/home-journey-link"
import { ProfessionalExperienceProof } from "@/components/professional-experience-proof"
import { ProgressiveHeroBackground } from "@/components/progressive-hero-background"
import { ProjectCard } from "@/components/project-card"
import { TrackedPortfolioLink } from "@/components/tracked-portfolio-link"
import { HOMEPAGE_FEATURED_PROJECT_IDS } from "@/data/portfolio-curation"
import { PROJECTS } from "@/data/projects"
import { PROFESSIONAL_EXPERIENCE_RECORDS } from "@/features/adaptive-focus/evidence/professional-experience"
import type { Project } from "@/types/project"

const featuredProjectPresentation = {
  wizzo: {
    eyebrow: "AI product system",
    summary:
      "An AI mentor system that turns conversation, connected context, and goals into actionable quests.",
    actionLabel: "View Wizzo",
  },
  "x-games": {
    eyebrow: "Game + creator platform",
    summary:
      "An AI-first social game platform that turns posts into playable browser games and persistent creator content.",
    actionLabel: "View Playfold",
  },
  speakeasy: {
    eyebrow: "Voice-first XR accessibility",
    summary:
      "A Quest 3 voice-first interaction system that reduces reliance on handheld controllers through multimodal feedback.",
    actionLabel: "View SpeakEasy",
  },
} as const

const featuredProjects = HOMEPAGE_FEATURED_PROJECT_IDS.map((id) => {
  const project = PROJECTS.find((candidate) => candidate.id === id)
  return project ? { project, presentation: featuredProjectPresentation[id] } : null
}).filter(
  (entry): entry is { project: Project; presentation: (typeof featuredProjectPresentation)[keyof typeof featuredProjectPresentation] } =>
    Boolean(entry)
)

const capabilities = [
  {
    icon: BrainCircuit,
    title: "AI product systems",
    description: "Human-in-loop workflows, model evaluation, trust controls, and operational AI.",
  },
  {
    icon: Gamepad2,
    title: "Game and creator systems",
    description: "Game UX, playable systems, creator workflows, and AI-assisted creation.",
  },
  {
    icon: Code2,
    title: "Design engineering",
    description: "Frontend architecture, prototyping, design systems, and production implementation.",
  },
  {
    icon: AudioLines,
    title: "Immersive interaction",
    description: "XR, voice, accessibility, motion, and spatial interfaces.",
  },
] as const

const publicPracticeItems = [
  {
    id: "futuressummit-2025",
    itemType: "panel" as const,
    label: "Panel",
    title: "The Rise of Synthetic AI Companions: Promise or Peril",
    meta: "Futures Summit 2025 / September 2025",
  },
  {
    id: "gatherverse-xrevolve-2025",
    itemType: "panel" as const,
    label: "Panel",
    title: "AR & AI: The Intersection of the Future",
    meta: "GatherVerse XREvolve / June 2025",
  },
] as const

export default function Home() {
  return (
    <div className="home-immersive-page relative isolate">
      <ProgressiveHeroBackground />

      <div className="home-content-layer relative z-10">
        <section className="home-journey-hero" aria-labelledby="home-title">
          <Image
            src="/visuals/black-sun-signal-grid-static.webp"
            alt=""
            decoding="sync"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="home-journey-visual"
          />
          <div className="home-journey-copy">
            <p className="home-section-kicker">AI-Native Design Engineer</p>
            <h1 id="home-title">
              I build AI product systems, playable experiences, and immersive tools.
            </h1>
            <p className="home-journey-lede">
              Founder of Wizzo Labs. I design trustworthy AI products, creator workflows, and
              human-in-the-loop multimodal experiences.
            </p>
            <div className="home-journey-actions" aria-label="Homepage paths">
              <HomeJourneyLink
                path="selected_work"
                targetId="selected-work"
                className="home-primary-action"
              >
                View selected work <ArrowRight size={16} aria-hidden="true" />
              </HomeJourneyLink>
              <HomeJourneyLink
                path="role_match"
                targetId="adaptive-focus"
                focusTargetId="adaptive-focus-role-input"
                className="home-secondary-action"
              >
                Match me to a role
              </HomeJourneyLink>
              <TrackedPortfolioLink
                href="/Michael_Chaves_Resume_min.pdf"
                download
                prefetch={false}
                eventName="portfolio_conversion_clicked"
                eventProperties={{ destination: "resume", source: "home_hero" }}
                className="home-text-action"
              >
                Download resume <Download size={15} aria-hidden="true" />
              </TrackedPortfolioLink>
            </div>
          </div>
          <p className="home-journey-signature">
            Mike Chaves<span aria-hidden="true">_</span>
          </p>
        </section>

        <AdaptiveFocusEntry />

        <section
          id="selected-work"
          className="home-evidence-section scroll-mt-24"
          aria-labelledby="selected-work-title"
        >
          <div className="home-section-heading">
            <div>
              <p className="home-section-kicker">Three flagship proofs</p>
              <h2 id="selected-work-title">Selected work</h2>
            </div>
            <Link href="/projects" prefetch={false}>
              View all projects <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="home-featured-grid">
            {featuredProjects.map(({ project, presentation }) => (
              <ProjectCard
                key={project.id}
                {...project}
                {...presentation}
                analyticsContext="home_featured"
                variant="featured"
              />
            ))}
          </div>
        </section>

        <section
          id="professional-experience"
          className="home-evidence-section scroll-mt-24"
          aria-labelledby="professional-experience-title"
        >
          <div className="home-section-heading home-section-heading-wide">
            <div>
              <p className="home-section-kicker">Production and experimental systems</p>
              <h2 id="professional-experience-title">Professional systems experience</h2>
            </div>
            <p>
              Public summaries only. Images, internal interfaces, data, methods, and case materials
              remain private where required.
            </p>
          </div>
          <div className="home-experience-list">
            {PROFESSIONAL_EXPERIENCE_RECORDS.map((record) => (
              <ProfessionalExperienceProof key={record.id} record={record} variant="homepage" />
            ))}
          </div>
        </section>

        <section className="home-evidence-section" aria-labelledby="capabilities-title">
          <div className="home-section-heading">
            <div>
              <p className="home-section-kicker">How the work connects</p>
              <h2 id="capabilities-title">Capabilities</h2>
            </div>
          </div>
          <div className="home-capability-grid">
            {capabilities.map(({ icon: Icon, title, description }) => (
              <article key={title}>
                <Icon size={24} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="writing"
          className="home-evidence-section scroll-mt-24"
          aria-labelledby="public-practice-title"
        >
          <div className="home-section-heading">
            <div>
              <p className="home-section-kicker">Ideas in the open</p>
              <h2 id="public-practice-title">Writing and public practice</h2>
            </div>
            <Link href="/blog" prefetch={false}>
              View all writing <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="home-practice-grid">
            <TrackedPortfolioLink
              href="/blog/voice-first-xr"
              prefetch={false}
              eventName="public_practice_item_opened"
              eventProperties={{
                item_id: "voice-first-xr",
                item_type: "writing",
                source: "home_public_practice",
              }}
              className="home-featured-writing"
            >
              <p>Featured article</p>
              <h3>Voice-First XR: Five Lessons from the Front Lines of Inclusive Design</h3>
              <span>
                Practical lessons for accessible voice interfaces in spatial computing.
              </span>
              <time dateTime="2025-06-18">June 18, 2025 / 5 min read</time>
              <strong>Read article <ArrowRight size={15} aria-hidden="true" /></strong>
            </TrackedPortfolioLink>
            <div className="home-practice-list">
              {publicPracticeItems.map((item) => (
                <TrackedPortfolioLink
                  key={item.id}
                  href="/about#public-practice-title"
                  prefetch={false}
                  eventName="public_practice_item_opened"
                  eventProperties={{
                    item_id: item.id,
                    item_type: item.itemType,
                    source: "home_public_practice",
                  }}
                >
                  <span>{item.label}</span>
                  <h3>{item.title}</h3>
                  <p>{item.meta}</p>
                  <strong>View public practice <ArrowRight size={14} aria-hidden="true" /></strong>
                </TrackedPortfolioLink>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="home-contact-section scroll-mt-24" aria-labelledby="home-contact-title">
          <p className="home-section-kicker">Direct conversion</p>
          <h2 id="home-contact-title">Build the next system with me.</h2>
          <p>
            I work where AI products, playable systems, design engineering, and immersive
            interaction meet.
          </p>
          <div className="home-contact-actions">
            <TrackedPortfolioLink
              href="/about#contact"
              prefetch={false}
              eventName="portfolio_conversion_clicked"
              eventProperties={{ destination: "contact", source: "home_contact" }}
              className="home-primary-action"
            >
              Contact Mike <ArrowRight size={16} aria-hidden="true" />
            </TrackedPortfolioLink>
            <TrackedPortfolioLink
              href="/Michael_Chaves_Resume_min.pdf"
              download
              prefetch={false}
              eventName="portfolio_conversion_clicked"
              eventProperties={{ destination: "resume", source: "home_contact" }}
              className="home-secondary-action"
            >
              Download resume <Download size={15} aria-hidden="true" />
            </TrackedPortfolioLink>
            <TrackedPortfolioLink
              href="https://www.linkedin.com/in/mikejchaves"
              target="_blank"
              rel="noopener noreferrer"
              eventName="portfolio_conversion_clicked"
              eventProperties={{ destination: "linkedin", source: "home_contact" }}
              className="home-text-action"
            >
              LinkedIn <Linkedin size={15} aria-hidden="true" />
            </TrackedPortfolioLink>
          </div>
          <small>
            Contact opens the site&apos;s protected form. No email address or message content is exposed
            to analytics.
          </small>
        </section>
      </div>
    </div>
  )
}
