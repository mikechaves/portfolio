"use client"

import { useEffect, useState, useTransition, type FormEvent } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXTwitter } from "@fortawesome/free-brands-svg-icons"
import { ArrowRight, Download, Github, Linkedin, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { sendContactEmail } from "@/app/actions/contact"
import { EVIDENCE_DOSSIER_PROJECT_IDS } from "@/app/projects/[id]/dossierConfig"
import { FocusContextBadge } from "@/components/focus-context-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PROJECTS } from "@/data/projects"
import { useToast } from "@/hooks/use-toast"
import { trackPortfolioEvent } from "@/lib/portfolio-analytics"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core"

config.autoAddCss = false

const operatingLoop = [
  {
    index: "01",
    title: "Frame the workflow",
    description: "Map the people, decisions, handoffs, constraints, and failure modes before committing to an interface.",
  },
  {
    index: "02",
    title: "Build the system",
    description: "Move between product design and implementation to turn ambiguous requirements into an operable product surface.",
  },
  {
    index: "03",
    title: "Instrument the work",
    description: "Make system behavior, human review, disagreement, and outcomes visible enough to evaluate and improve.",
  },
  {
    index: "04",
    title: "Calibrate the loop",
    description: "Use evidence from real use to refine automation, interfaces, guardrails, and the division of human and machine work.",
  },
]

const proofPoints = [
  {
    caseFile: "AF-01",
    title: "Astrocade AI QA Calibration Tool",
    label: "Human-in-the-loop AI / Evaluation",
    description: "Owned UGC review systems spanning QA annotation, calibration, final review behavior, creator feedback, and operational guardrails.",
    href: "/projects/astrocade-qa-calibration-tool",
    projectId: "astrocade-qa-calibration-tool",
  },
  {
    caseFile: "AF-02",
    title: "Wizzo",
    label: "AI product systems / Intent to action",
    description: "Designed and built an AI mentor product system connecting chat, work context, goals, and follow-up to actionable quests.",
    href: "/projects/wizzo",
    projectId: "wizzo",
  },
  {
    caseFile: "XR-01",
    title: "SpeakEasy",
    label: "Voice interaction / Accessibility",
    description: "Designed a voice-controlled mixed reality system for users with low muscle tone, grounding emerging interaction in access needs.",
    href: "/projects/speakeasy",
    projectId: "speakeasy",
  },
  {
    caseFile: "OPS-01",
    title: "Enterprise Systems",
    label: "Operational UX / Spatial tools",
    description: "Built enterprise internal tools, spatial operations prototypes, and WebGL systems for Starbucks, Ford, and POWER Engineers.",
    href: "/projects?focusPreset=operational-ux",
    projectId: null,
  },
]

const currentFocusItems = [
  "AI-assisted workflows",
  "Human-in-the-loop systems",
  "Product and design engineering",
  "Internal tools and operational UX",
  "Moderation and QA calibration",
  "Creator workflows",
  "Accessibility-focused interaction",
  "XR, voice UI, and emerging interfaces",
]

const publicSignals = [
  {
    id: "futures-summit-2025",
    event: "Futures Summit 2025",
    role: "Panelist",
    title: "The Rise of Synthetic AI Companions: Promise or Peril",
    date: "September 2025",
    image: "/events/chaves_futuressummit_2025_thumb.png",
  },
  {
    id: "gatherverse-2025",
    event: "GatherVerse XREvolve",
    role: "Panelist",
    title: "AR & AI: The Intersection of the Future",
    date: "June 2025",
    image: "/events/chaves_gatherverse_2025_thumb.png",
  },
  {
    id: "xr-access-2024",
    event: "XR Access Symposium",
    role: "Speaker",
    title: "Voice-Driven Mixed Reality for Accessibility",
    date: "July 2024",
    image: "/events/chaves_xraccess_2024_thumb.png",
  },
  {
    id: "adobe-2023",
    event: "Adobe Experiential Horizons",
    role: "Host / Presenter",
    title: "Industry Roundtable and Demo Showcase",
    date: "October 2023",
    image: "/events/chaves_adobesympo_2023_thumb.png",
  },
]

export default function AboutPage() {
  const [isPending, startTransition] = useTransition()
  const [formStatus, setFormStatus] = useState<{
    success: boolean | null
    message: string | null
  }>({ success: null, message: null })
  const [focus, setFocus] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("focus")
    if (query) setFocus(query)
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormStatus({ success: null, message: null })

    const form = event.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      try {
        const response = await sendContactEmail(formData)
        setFormStatus({ success: response.success, message: response.message })

        if (response.success) {
          trackPortfolioEvent("portfolio_contact_submitted", { source: "about_form" })
          form.reset()
          toast({ title: "Message sent", description: response.message })
        } else {
          toast({
            title: "Message not sent",
            description: response.message || "Something went wrong. Please try again.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Form submission error:", error)
        setFormStatus({ success: false, message: "An unexpected error occurred. Please try again." })
      }
    })
  }

  return (
    <div className="about-operating-page space-y-8 pt-6">
      {focus ? <FocusContextBadge focus={focus} /> : null}

      <section className="operating-profile-hero" aria-labelledby="about-title">
        <div className="operating-profile-status" aria-hidden="true">
          <span>PROFILE / VERIFIED</span>
          <span>MODE / DESIGN + ENGINEERING</span>
          <span>AVAILABILITY / BAY AREA + REMOTE</span>
        </div>

        <div className="operating-profile-grid">
          <div className="operating-profile-copy">
            <p className="operating-profile-eyebrow">AI-Native Design Engineer</p>
            <h1 id="about-title" className="operating-profile-title">Mike Chaves</h1>
            <p className="operating-profile-lede">
              I design and build product systems for workflows where software, automation, and human judgment have to work together.
            </p>
            <p className="operating-profile-summary">
              My work sits between product design, front-end engineering, AI workflow design, and operational tooling. I am strongest in ambiguous environments that require both systems thinking and hands-on execution.
            </p>
            <div className="operating-profile-actions">
              <Link href="/projects" className="operating-profile-primary-action">
                Inspect project proof <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <a
                href="/Michael_Chaves_Resume_min.pdf"
                download
                onClick={() =>
                  trackPortfolioEvent("portfolio_conversion_clicked", {
                    destination: "resume",
                    source: "about_hero",
                  })
                }
                className="operating-profile-secondary-action"
              >
                Download resume <Download size={15} aria-hidden="true" />
              </a>
            </div>
          </div>

          <figure className="operating-profile-portrait">
            <Image
              src="/events/chaves_adobesympo_2023_thumb.png"
              alt="Mike Chaves presenting at the Adobe Experiential Horizons Symposium"
              fill
              className="object-cover"
              sizes="(min-width: 900px) 38vw, 100vw"
              priority
            />
            <figcaption>
              <span>Public practice / 2023-2025</span>
              <strong>Design systems in public</strong>
            </figcaption>
          </figure>
        </div>

        <dl className="operating-profile-ledger">
          <div><dt>Projects indexed</dt><dd>{PROJECTS.length.toString().padStart(2, "0")}</dd></div>
          <div><dt>Reviewed dossiers</dt><dd>{EVIDENCE_DOSSIER_PROJECT_IDS.size.toString().padStart(2, "0")}</dd></div>
          <div><dt>Base</dt><dd>Pacifica, California</dd></div>
          <div><dt>Operating loop</dt><dd>Frame / Build / Measure / Calibrate</dd></div>
        </dl>
      </section>

      <section className="profile-section" aria-labelledby="operating-model-title">
        <div className="profile-section-heading">
          <div>
            <p className="operating-profile-eyebrow">Operating model</p>
            <h2 id="operating-model-title">How I turn ambiguity into a usable system</h2>
          </div>
          <p>One working loop across product strategy, interaction design, implementation, and evaluation.</p>
        </div>
        <ol className="operating-loop-grid">
          {operatingLoop.map((step) => (
            <li key={step.index}>
              <span>{step.index}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="profile-section" aria-labelledby="proof-path-title">
        <div className="profile-section-heading">
          <div>
            <p className="operating-profile-eyebrow">Selected evidence</p>
            <h2 id="proof-path-title">Proof across systems, operations, and access</h2>
          </div>
          <Link href="/projects">Open signal index <ArrowRight size={14} aria-hidden="true" /></Link>
        </div>
        <div className="profile-proof-grid">
          {proofPoints.map((proof) => (
            <Link
              key={proof.caseFile}
              href={proof.href}
              onClick={() => {
                if (proof.projectId) {
                  trackPortfolioEvent("project_evidence_opened", {
                    project_id: proof.projectId,
                    source: "about_proof",
                    match_level: "unranked",
                  })
                  return
                }
                trackPortfolioEvent("portfolio_conversion_clicked", {
                  destination: "role_fit",
                  source: "about_proof",
                })
              }}
              className="profile-proof-record"
            >
              <div className="profile-proof-meta">
                <span>{proof.caseFile}</span>
                <span>{proof.label}</span>
              </div>
              <h3>{proof.title}</h3>
              <p>{proof.description}</p>
              <span className="profile-proof-link">Inspect evidence <ArrowRight size={14} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="profile-section profile-focus-section" aria-labelledby="current-focus-title">
        <div className="profile-section-heading">
          <div>
            <p className="operating-profile-eyebrow">Current focus</p>
            <h2 id="current-focus-title">Where the work compounds</h2>
          </div>
          <p>The recurring system problems behind the projects, not a list of disconnected tools.</p>
        </div>
        <ul className="profile-focus-index">
          {currentFocusItems.map((item, index) => (
            <li key={item}>
              <span>{(index + 1).toString().padStart(2, "0")}</span>
              <strong>{item}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section className="profile-section" aria-labelledby="public-practice-title">
        <div className="profile-section-heading">
          <div>
            <p className="operating-profile-eyebrow">Public practice</p>
            <h2 id="public-practice-title">Research, accessibility, and emerging systems</h2>
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

      <section className="profile-contact-section" aria-labelledby="contact-title">
        <div className="profile-contact-intro">
          <p className="operating-profile-eyebrow">Location and availability</p>
          <h2 id="contact-title" className="scroll-mt-24">Start with the system you need to make usable</h2>
          <p>
            Based in Pacifica, California. Focused on Bay Area and remote product, design engineering, and AI systems roles.
          </p>
          <a
            href="/Michael_Chaves_Resume_min.pdf"
            download
            onClick={() =>
              trackPortfolioEvent("portfolio_conversion_clicked", {
                destination: "resume",
                source: "about_contact",
              })
            }
            className="operating-profile-secondary-action"
          >
            Download resume <Download size={15} aria-hidden="true" />
          </a>

          <div className="profile-network-links" aria-label="Professional network links">
            <a href="https://github.com/mikechaves" target="_blank" rel="noopener noreferrer"><Github size={17} aria-hidden="true" /> GitHub</a>
            <a href="https://x.com/mikechaves_io" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faXTwitter} className="h-4 w-4" aria-hidden="true" /> X</a>
            <a href="https://www.linkedin.com/in/mikejchaves" target="_blank" rel="noopener noreferrer"><Linkedin size={17} aria-hidden="true" /> LinkedIn</a>
            <a href="mailto:founder@gowizzo.io"><Mail size={17} aria-hidden="true" /> Email</a>
          </div>
        </div>

        <form className="profile-contact-form" onSubmit={handleSubmit}>
          <div className="profile-contact-form-heading">
            <span>DIRECT CHANNEL / EMAIL</span>
            <strong>{isPending ? "SENDING" : "READY"}</strong>
          </div>
          <div>
            <label htmlFor="name">Name</label>
            <Input id="name" name="name" placeholder="Enter your name" required disabled={isPending} />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <Input id="email" name="email" type="email" placeholder="Enter your email" required disabled={isPending} />
          </div>
          <div>
            <label htmlFor="message">Message</label>
            <Textarea id="message" name="message" placeholder="What are you building or hiring for?" rows={5} required disabled={isPending} />
          </div>
          <Button type="submit" disabled={isPending}>{isPending ? "Sending..." : "Send Message"}</Button>
          {formStatus.message ? (
            <p className={formStatus.success ? "profile-form-success" : "profile-form-error"} role="status">
              {formStatus.message}
            </p>
          ) : null}
        </form>
      </section>
    </div>
  )
}
