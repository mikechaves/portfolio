"use client";

import { useEffect, useState, type FormEvent, type ReactNode, useTransition } from "react"
import { Terminal } from "@/components/terminal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXTwitter } from "@fortawesome/free-brands-svg-icons"
import { Download, Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core"
// Prevent Font Awesome from adding its CSS since we did it manually above
config.autoAddCss = false

import { sendContactEmail } from "@/app/actions/contact"
import { useToast } from "@/hooks/use-toast"
import { FocusContextBadge } from "@/components/focus-context-badge"
import { NeonSeparator } from "@/components/neon-separator"
import { cn } from "@/lib/utils"

const introParagraphs = [
  {
    id: "workflow-judgment",
    text: "I design and build product systems for workflows where software, automation, and human judgment have to work together.",
  },
  {
    id: "cross-functional-systems",
    text: "My work sits between product design, front-end engineering, AI workflow design, and operational tooling. I have built and shipped systems across AI-powered creator platforms, enterprise internal tools, spatial interfaces, and founder-led product development.",
  },
  {
    id: "ugc-review-systems",
    text: "Most recently, I owned UGC review systems for an AI-powered game creation platform, including auto-review logic, QA annotation workflows, calibration processes, final review behavior, creator feedback loops, and operational guardrails.",
  },
  {
    id: "ambiguous-execution",
    text: "I am strongest in ambiguous product environments where the work requires both systems thinking and hands-on execution: defining workflows, designing interfaces, building prototypes, improving review loops, documenting process, and turning messy human/AI interactions into usable product systems.",
  },
]

const currentFocusItems = [
  { id: "ai-assisted-workflows", text: "AI-assisted workflows" },
  { id: "human-in-the-loop", text: "Human-in-the-loop systems" },
  { id: "product-design-engineering", text: "Product and design engineering" },
  { id: "operational-ux", text: "Internal tools and operational UX" },
  { id: "moderation-calibration", text: "Moderation and QA calibration systems" },
  { id: "creator-workflows", text: "Creator workflows" },
  { id: "accessible-interaction", text: "Accessibility-focused interaction design" },
  { id: "emerging-interfaces", text: "XR, voice UI, and emerging interface systems" },
]

const selectedProofPoints = [
  {
    id: "astrocade-ugc-review",
    text: "Owned UGC review systems at Astrocade, spanning QA annotation workflows, calibration, final review behavior, creator feedback loops, and operational guardrails.",
  },
  {
    id: "wizzo-product",
    text: "Built Wizzo, an AI-driven social productivity platform using Next.js, TypeScript, Postgres, Drizzle ORM, Neon, and Vercel.",
  },
  {
    id: "speakeasy-accessibility",
    text: "Designed SpeakEasy, a voice-controlled mixed reality accessibility system for users with low muscle tone.",
  },
  {
    id: "enterprise-systems",
    text: "Built enterprise internal tools and immersive systems for Starbucks, Ford, and POWER Engineers.",
  },
]

type TerminalWindowProps = {
  children: ReactNode
  title: string
  className?: string
  contentClassName?: string
}

function TerminalWindow({
  children,
  title,
  className,
  contentClassName,
}: TerminalWindowProps) {
  return (
    <div className={cn("terminal-window", className)}>
      <div className="terminal-header">
        <div className="terminal-button terminal-button-red"></div>
        <div className="terminal-button terminal-button-yellow"></div>
        <div className="terminal-button terminal-button-green"></div>
        <div className="terminal-title">{title}</div>
      </div>
      <div className={cn("terminal-content", contentClassName)}>{children}</div>
    </div>
  )
}

export default function AboutPage() {
  const [introComplete, setIntroComplete] = useState(false)
  const [bioComplete, setBioComplete] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [formStatus, setFormStatus] = useState<{
    success: boolean | null
    message: string | null
  }>({
    success: null,
    message: null,
  })
  const { toast } = useToast()
  const [focus, setFocus] = useState("")

  useEffect(() => {
    if (typeof window === "undefined") return
    const query = new URLSearchParams(window.location.search).get("focus")
    if (query) setFocus(query)
  }, [])

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Reset form status
    setFormStatus({
      success: null,
      message: null,
    })

    const form = e.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      try {
        const response = await sendContactEmail(formData)

        setFormStatus({
          success: response.success,
          message: response.message,
        })

        if (response.success) {
          form.reset()
          toast({
            title: "Success!",
            description: response.message,
          })
        } else {
          toast({
            title: "Error",
            description: response.message || "Something went wrong. Please try again.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Form submission error:", error)
        setFormStatus({
          success: false,
          message: "An unexpected error occurred. Please try again.",
        })
      }
    })
  }

  return (
    <div className="space-y-16 pt-8">
      <h1 className="sr-only">About Mike Chaves</h1>
      {focus && <FocusContextBadge focus={focus} />}
      <section>
        <Terminal
          text="Initializing personal profile... Access granted. Loading bio data..."
          typingSpeed={30}
          className="max-w-3xl mx-auto"
          onComplete={() => setIntroComplete(true)}
        />

        {introComplete && (
          <Terminal
            text="AI-native design engineer focused on product systems, human-in-the-loop AI, and operational UX."
            typingSpeed={20}
            className="max-w-3xl mx-auto mt-4"
            showPrompt={false}
            onComplete={() => setBioComplete(true)}
          />
        )}
      </section>

      {bioComplete && (
        <>
          <NeonSeparator intensity="high" />
          <section>
            <h2 className="text-2xl font-bold mb-6">Product Systems for Human Judgment</h2>
            <TerminalWindow title="positioning.sh" contentClassName="space-y-4">
              <p>
                <span className="text-primary">$</span> cat professional_identity.txt
              </p>
              {introParagraphs.map((paragraph) => (
                <p key={paragraph.id} className="text-muted-foreground">
                  {paragraph.text}
                </p>
              ))}
            </TerminalWindow>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Current Focus</h2>
            <TerminalWindow title="current_focus.sh">
              <p className="mb-4">
                <span className="text-primary">$</span> cat focus_areas.txt
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentFocusItems.map((item) => (
                  <li key={item.id} className="flex items-start gap-2">
                    <span className="text-primary">-</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </TerminalWindow>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Selected Proof Points</h2>
            <TerminalWindow title="proof_points.sh">
              <p className="mb-4">
                <span className="text-primary">$</span> cat selected_work.txt
              </p>
              <ul className="space-y-3">
                {selectedProofPoints.map((proofPoint) => (
                  <li key={proofPoint.id} className="flex items-start gap-2">
                    <span className="text-primary">$</span>
                    <span>{proofPoint.text}</span>
                  </li>
                ))}
              </ul>
            </TerminalWindow>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Location & Availability</h2>
            <div className="grid md:grid-cols-[1fr_auto] gap-6 items-stretch">
              <TerminalWindow title="availability.sh">
                <p className="mb-4">
                  <span className="text-primary">$</span> cat availability.txt
                </p>
                <p>
                  Based in Pacifica, California. Focused on Bay Area and remote product, design engineering, and AI systems roles.
                </p>
              </TerminalWindow>
              <TerminalWindow
                title="resume.sh"
                className="flex flex-col"
                contentClassName="flex h-full flex-col justify-between"
              >
                <p className="mb-4">
                  <span className="text-primary">$</span> open resume.pdf
                </p>
                <Button asChild className="mt-auto">
                  <a href="/Michael_Chaves_Resume_min.pdf" download>
                    <Download size={16} />
                    Download Resume
                  </a>
                </Button>
              </TerminalWindow>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Contact</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <TerminalWindow title="contact_form.sh">
                <p className="mb-4">
                  <span className="text-primary">$</span> ./send_message.sh
                </p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="name" className="block text-sm mb-1">
                      <span className="text-primary">name:</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      className="bg-background border-border"
                      required
                      disabled={isPending}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm mb-1">
                      <span className="text-primary">email:</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="bg-background border-border"
                      required
                      disabled={isPending}
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm mb-1">
                      <span className="text-primary">message:</span>
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Enter your message"
                      rows={4}
                      className="bg-background border-border"
                      required
                      disabled={isPending}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Sending..." : "Send Message"}
                  </Button>

                  {formStatus.message && (
                    <div
                      className={`mt-2 p-2 text-sm rounded ${
                        formStatus.success
                          ? "bg-green-900/20 text-green-500 border border-green-900"
                          : formStatus.success === false
                            ? "bg-red-900/20 text-red-500 border border-red-900"
                            : ""
                      }`}
                    >
                      {formStatus.message}
                    </div>
                  )}
                </form>
              </TerminalWindow>

              <TerminalWindow title="network_connections.sh">
                <p className="mb-4">
                  <span className="text-primary">$</span> ifconfig
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="mb-1 text-primary">github0:</p>

                    <Link
                      href="https://github.com/mikechaves"
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                      target="_blank"
                    >
                      <Github size={16} />
                      github.com/mikechaves
                    </Link>
                  </div>
                  <div>
                    <p className="mb-1 text-primary">x0:</p>
                    <Link
                      href="https://x.com/mikechaves_io"
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                      target="_blank"
                      //rel="noopener noreferrer"
                    >
                      <span className="w-4 h-4 flex items-center justify-center">
                        <FontAwesomeIcon icon={faXTwitter} className="w-3 h-3" />
                      </span>
                      x.com/mikechaves_io
                    </Link>
                  </div>
                  <div>
                    <p className="mb-1 text-primary">linkedin0:</p>
                    <Link
                      href="https://www.linkedin.com/in/mikejchaves"
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                      target="_blank"
                    >
                      <Linkedin size={16} />
                      linkedin.com/in/mikejchaves
                    </Link>
                  </div>
                  <div>
                    <p className="mb-1 text-primary">mail0:</p>
                    {/* Use regular anchor tag for mailto link */}
                    <Link
                      href="mailto:founder@gowizzo.io"
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <Mail size={16} />
                      founder@gowizzo.io
                    </Link>
                  </div>
                </div>
              </TerminalWindow>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
