"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode, useTransition } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXTwitter } from "@fortawesome/free-brands-svg-icons"
import { Activity, ArrowRight, Cpu, Download, Github, Linkedin, Mail, Network, RefreshCw, type LucideIcon } from "lucide-react"
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
    text: "My work sits between product design, front-end engineering, AI workflow design, and operational tooling. I have built and shipped systems across AI-powered creator platforms, enterprise internal tools, spatial interfaces, and AI-native product prototypes.",
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
    text: "Built Wizzo, an AI mentor product system using Next.js, TypeScript, OpenAI, Google APIs, Postgres, Drizzle ORM, Neon, and Vercel.",
  },
  {
    id: "speakeasy-accessibility",
    text: "Designed SpeakEasy, a voice-controlled mixed reality accessibility system for users with low muscle tone.",
  },
  {
    id: "enterprise-systems",
    text: "Built enterprise internal tools, spatial operations prototypes, and WebGL systems for Starbucks, Ford, and POWER Engineers.",
  },
]

const narrativeThreadItems = [
  {
    id: "thesis",
    label: "01 / Thesis",
    text: "The homepage frames the core position: AI-native product systems for messy workflows where automation and judgment meet.",
  },
  {
    id: "operating-model",
    label: "02 / Operating Model",
    text: "This page explains the working model: define workflows, design interfaces, build prototypes, calibrate loops, and ship usable systems.",
  },
  {
    id: "proof",
    label: "03 / Proof",
    text: "Project pages show the artifacts behind that model across AI QA, creator tools, automation, accessibility, and immersive systems.",
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

type HeroTerminalMode = "profile" | "systems" | "impact"

type HeroTerminalModeConfig = {
  label: string
  icon: LucideIcon
  lines: string[]
}

const heroTerminalModes: Record<HeroTerminalMode, HeroTerminalModeConfig> = {
  profile: {
    label: "Profile",
    icon: Activity,
    lines: [
      "$ boot --profile mike_chaves",
      "[ok] Initializing personal profile",
      "[ok] Access granted",
      "[ok] Loading bio data",
      "",
      "Welcome...",
      "",
      "I am an AI-native design engineer focused on product systems,",
      "human-in-the-loop AI, and operational UX.",
      "",
      "> current vector: creator workflows, QA calibration, enterprise AI tools",
      "> operating loop: prototype -> instrument -> ship -> calibrate",
    ],
  },
  systems: {
    label: "Systems",
    icon: Cpu,
    lines: [
      "$ inspect --systems",
      "[online] product systems",
      "[online] human-in-the-loop AI",
      "[online] operational UX",
      "[online] UGC review pipelines",
      "[ready] forward-deployed product execution",
      "",
      "> stack preference: fast prototypes with production discipline",
      "> signal: interfaces that make complex systems usable",
    ],
  },
  impact: {
    label: "Impact",
    icon: Network,
    lines: [
      "$ trace --impact",
      "Astrocade_AI .... QA calibration + creator review loops",
      "Wizzo_Labs_Inc . AI platform architecture + evaluation harnesses",
      "Ford_Motor ..... global time-study tooling + operational savings",
      "POWER_Engineers spatial storytelling + WebGL prototypes",
      "",
      "[ready] connect product ambiguity to shipped systems",
    ],
  },
}

const heroTerminalModeEntries = Object.entries(heroTerminalModes) as Array<[
  HeroTerminalMode,
  HeroTerminalModeConfig,
]>

function AboutHeroTerminal({ onComplete }: { onComplete: () => void }) {
  const [activeMode, setActiveMode] = useState<HeroTerminalMode>("profile")
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [sequenceNonce, setSequenceNonce] = useState(0)
  const hasUnlockedPage = useRef(false)

  const activeConfig = heroTerminalModes[activeMode]
  const activeText = activeConfig.lines.join("\n")
  const progress = activeText.length === 0
    ? 100
    : Math.min(100, Math.round((displayedText.length / activeText.length) * 100))

  useEffect(() => {
    let currentIndex = 0
    let timer: ReturnType<typeof setTimeout> | undefined

    setDisplayedText("")
    setIsTyping(true)

    const typeNextCharacter = () => {
      if (currentIndex < activeText.length) {
        setDisplayedText(activeText.slice(0, currentIndex + 1))
        const typedCharacter = activeText[currentIndex]
        currentIndex += 1
        timer = setTimeout(
          typeNextCharacter,
          typedCharacter === "\n" ? 180 : activeMode === "profile" ? 20 : 12,
        )
        return
      }

      setIsTyping(false)
      if (!hasUnlockedPage.current) {
        hasUnlockedPage.current = true
        onComplete()
      }
    }

    timer = setTimeout(typeNextCharacter, 180)

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [activeMode, activeText, onComplete, sequenceNonce])

  const renderedLines = displayedText.split("\n")

  return (
    <div className="terminal-window relative mx-auto max-w-3xl overflow-hidden shadow-[0_0_44px_rgba(0,255,140,0.16)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,255,140,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-primary/80" />

      <div className="terminal-header relative z-10">
        <div className="terminal-button terminal-button-red"></div>
        <div className="terminal-button terminal-button-yellow"></div>
        <div className="terminal-button terminal-button-green"></div>
        <div className="terminal-title">mike_chaves.{activeMode}</div>
        <div className="ml-auto hidden items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-primary/70 sm:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          {isTyping ? "streaming" : "ready"}
        </div>
      </div>

      <div className="terminal-content relative z-10 space-y-4">
        <div className="grid grid-cols-3 gap-2 text-[0.7rem] uppercase tracking-[0.14em] text-zinc-400">
          <div className="rounded border border-primary/20 bg-black/35 p-2">
            <span className="block text-primary">access</span>
            granted
          </div>
          <div className="rounded border border-primary/20 bg-black/35 p-2">
            <span className="block text-primary">signal</span>
            AI-native
          </div>
          <div className="rounded border border-primary/20 bg-black/35 p-2">
            <span className="block text-primary">boot</span>
            {progress}%
          </div>
        </div>

        <div className="min-h-[18rem] rounded border border-primary/20 bg-black/55 p-4 text-sm leading-7 text-zinc-100 sm:text-base">
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {activeText}
          </div>
          <div className="whitespace-pre-wrap break-words" aria-hidden="true">
            {renderedLines.map((line, index) => {
              if (line.startsWith("$")) {
                return (
                  <div key={`${line}-${index}`}>
                    <span className="text-primary">$</span>
                    {line.slice(1)}
                  </div>
                )
              }

              if (line.startsWith("[")) {
                const closingBracket = line.indexOf("]")

                return (
                  <div key={`${line}-${index}`}>
                    <span className="text-primary">
                      {closingBracket > -1 ? line.slice(0, closingBracket + 1) : line}
                    </span>
                    {closingBracket > -1 ? line.slice(closingBracket + 1) : ""}
                  </div>
                )
              }

              if (line.startsWith(">")) {
                return (
                  <div key={`${line}-${index}`} className="text-zinc-300">
                    <span className="text-primary">{">"}</span>
                    {line.slice(1)}
                  </div>
                )
              }

              return <div key={`${line}-${index}`}>{line || "\u00a0"}</div>
            })}
            {isTyping && <span className="terminal-cursor" />}
          </div>
        </div>

        <div className="h-1 overflow-hidden rounded bg-primary/10" aria-hidden="true">
          <div
            className="h-full bg-primary transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-primary/20 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Profile terminal commands">
            {heroTerminalModeEntries.map(([mode, config]) => {
              const Icon = config.icon
              const isActive = activeMode === mode

              return (
                <Button
                  key={mode}
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-pressed={isActive}
                  className={cn(
                    "h-9 border border-primary/20 bg-black/40 px-3 text-xs text-zinc-200 hover:bg-primary/10 hover:text-primary",
                    isActive && "border-primary/70 bg-primary/15 text-primary",
                  )}
                  onClick={() => {
                    setActiveMode(mode)
                    setSequenceNonce((value) => value + 1)
                  }}
                >
                  <Icon aria-hidden="true" />
                  {config.label}
                </Button>
              )
            })}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 border border-primary/20 bg-black/40 px-3 text-xs text-zinc-200 hover:bg-primary/10 hover:text-primary"
            onClick={() => setSequenceNonce((value) => value + 1)}
          >
            <RefreshCw aria-hidden="true" />
            Replay
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function AboutPage() {
  const [heroComplete, setHeroComplete] = useState(false)
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

  const handleHeroComplete = useCallback(() => {
    setHeroComplete(true)
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
        <AboutHeroTerminal onComplete={handleHeroComplete} />
      </section>

      {heroComplete && (
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
            <h2 className="text-2xl font-bold mb-6">From Positioning To Proof</h2>
            <TerminalWindow title="narrative_thread.sh" contentClassName="space-y-5">
              <div className="space-y-2">
                <p>
                  <span className="text-primary">$</span> trace portfolio_throughline
                </p>
                <p className="text-muted-foreground">
                  The throughline is simple: I turn ambiguous human/AI workflows
                  into product systems people can operate, evaluate, and improve.
                </p>
              </div>
              <ol className="grid gap-3 md:grid-cols-3">
                {narrativeThreadItems.map((item) => (
                  <li
                    key={item.id}
                    className="rounded border border-primary/20 bg-background/50 p-4"
                  >
                    <p className="mb-2 font-mono text-xs uppercase text-primary">
                      {item.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </li>
                ))}
              </ol>
              <div className="flex flex-wrap gap-3 border-t border-primary/20 pt-4">
                <Button asChild size="sm">
                  <Link
                    href={{
                      pathname: "/projects",
                      query: { focus: "human-in-the-loop AI systems" },
                    }}
                  >
                    View AI Proofs <ArrowRight size={14} />
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/projects/astrocade-qa-calibration-tool">
                    Start With Astrocade <ArrowRight size={14} />
                  </Link>
                </Button>
              </div>
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
                      rel="noopener noreferrer"
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
                      rel="noopener noreferrer"
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
                      rel="noopener noreferrer"
                    >
                      <Linkedin size={16} />
                      linkedin.com/in/mikejchaves
                    </Link>
                  </div>
                  <div>
                    <p className="mb-1 text-primary">mail0:</p>
                    <a
                      href="mailto:founder@gowizzo.io"
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <Mail size={16} />
                      founder@gowizzo.io
                    </a>
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
