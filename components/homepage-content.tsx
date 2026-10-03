import {
  ArrowRight,
  AudioLines,
  Palette,
  Code2,
  Download,
  Gamepad2,
  Linkedin,
} from "lucide-react"
import { AdaptiveFocusEntry } from "@/components/adaptive-focus-entry"
import { FeaturedProjectCard } from "@/components/featured-project-card"
import { HomeJourneyLink } from "@/components/home-journey-link"
import { PortfolioEventLink } from "@/components/portfolio-event-link"
import { ProfessionalExperienceProof } from "@/components/professional-experience-proof"
import { HOMEPAGE_FEATURED_PROJECT_IDS } from "@/data/portfolio-curation"
import { PROJECTS } from "@/data/projects"
import { PROFESSIONAL_EXPERIENCE_RECORDS } from "@/features/adaptive-focus/evidence/professional-experience"
import type { Project } from "@/types/project"

const featuredProjectPresentation = {
  wizzo: {
    eyebrow: "Brand + product direction",
    summary:
      "Creative direction and product design for Wizzo Labs’ AI mentor, giving progress a visual identity and a clear next move.",
    actionLabel: "View Wizzo",
  },
  "x-games": {
    eyebrow: "Interactive storytelling",
    summary:
      "Visual and interaction direction for Playfold, Wizzo Labs’ product that turns social posts into characters, worlds, and playable stories.",
    actionLabel: "View Playfold",
  },
  speakeasy: {
    eyebrow: "Voice-first XR accessibility",
    summary:
      "A voice-first mixed reality thesis: research, visual feedback, and hands-free interaction for people with low muscle tone.",
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
    icon: Palette,
    title: "Creative direction + brand",
    description: "Concepts, visual identity, campaigns, and live-event visuals with a coherent point of view.",
  },
  {
    icon: Gamepad2,
    title: "Storytelling + interactive media",
    description: "Characters, worlds, game UX, motion, and experiences people can take part in.",
  },
  {
    icon: Code2,
    title: "Design + hands-on delivery",
    description: "Visual and interaction design, high-fidelity prototypes, design systems, and production code.",
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

export function HomepageContent() {
  return (
    <div className="home-immersive-page relative isolate">
      <div className="home-content-layer relative z-10">
        <section className="home-journey-hero" aria-labelledby="home-title">
          {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimized local art avoids runtime image billing */}
          <img
            src="/visuals/black-sun-signal-grid-static.webp"
            alt=""
            width={1200}
            height={475}
            decoding="async"
            fetchPriority="high"
            className="home-journey-visual"
            aria-hidden="true"
          />
          <div className="home-journey-copy">
            <p className="home-section-kicker">Creative Director & Creative Technologist</p>
            <h1 id="home-title">
              I shape brands, tell stories, and make ideas playable.
            </h1>
            <p className="home-journey-lede">
              <a
                href="https://wizzolabs.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline decoration-white/30 underline-offset-4 transition-colors hover:text-primary"
              >
                Founder of Wizzo Labs
              </a>
              . Creative director, designer, and hands-on founder working across brand, entertainment, and interactive experiences. I use AI and code to carry an idea from concept to something you can experience.
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
              <PortfolioEventLink
                href="/Michael_Chaves_Resume.pdf"
                download
                eventName="portfolio_conversion_clicked"
                eventProperties={{ destination: "resume", source: "home_hero" }}
                className="home-text-action"
              >
                Download résumé (PDF) <Download size={15} aria-hidden="true" />
              </PortfolioEventLink>
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
              <p className="home-section-kicker">Selected creative work</p>
              <h2 id="selected-work-title">Selected work</h2>
            </div>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- keeps the homepage server-first */}
            <a href="/projects">
              View all projects <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
          <div className="home-featured-grid">
            {featuredProjects.map(({ project, presentation }) => (
              <FeaturedProjectCard
                key={project.id}
                project={project}
                {...presentation}
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
              <p className="home-section-kicker">Brand, entertainment, and experience design</p>
              <h2 id="professional-experience-title">Creative roots. Hands-on range.</h2>
            </div>
            <p>
              From directing creative work across all Knitting Factory venues and subsidiaries to designing spatial and interactive experiences.
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
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- keeps the homepage server-first */}
            <a href="/blog">
              View all writing <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
          <div className="home-practice-grid">
            <PortfolioEventLink
              href="/blog/voice-first-xr"
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
            </PortfolioEventLink>
            <div className="home-practice-list">
              {publicPracticeItems.map((item) => (
                <PortfolioEventLink
                  key={item.id}
                  href="/about#public-practice-title"
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
                </PortfolioEventLink>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="home-contact-section scroll-mt-24" aria-labelledby="home-contact-title">
          <p className="home-section-kicker">Let’s make something memorable</p>
          <h2 id="home-contact-title">Give your next idea a point of view.</h2>
          <p>
            Let’s talk creative direction, art direction, brand, or an interactive experience that needs both imagination and hands-on craft.
          </p>
          <div className="home-contact-actions">
            <PortfolioEventLink
              href="/about#contact"
              eventName="portfolio_conversion_clicked"
              eventProperties={{ destination: "contact", source: "home_contact" }}
              className="home-primary-action"
            >
              Contact Mike <ArrowRight size={16} aria-hidden="true" />
            </PortfolioEventLink>
            <PortfolioEventLink
              href="/Michael_Chaves_Resume.pdf"
              download
              eventName="portfolio_conversion_clicked"
              eventProperties={{ destination: "resume", source: "home_contact" }}
              className="home-secondary-action"
            >
              Download résumé (PDF) <Download size={15} aria-hidden="true" />
            </PortfolioEventLink>
            <PortfolioEventLink
              href="https://www.linkedin.com/in/mikejchaves"
              target="_blank"
              rel="noopener noreferrer"
              eventName="portfolio_conversion_clicked"
              eventProperties={{ destination: "linkedin", source: "home_contact" }}
              className="home-text-action"
            >
              LinkedIn <Linkedin size={15} aria-hidden="true" />
            </PortfolioEventLink>
          </div>
          <small>
            Based in Los Angeles, California. Open to creative direction and art direction conversations.
          </small>
        </section>
      </div>
    </div>
  )
}
