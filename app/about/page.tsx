"use client";

import { useEffect, useState, type FormEvent, useTransition } from "react"
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

const introParagraphs = [
  "I design and build product systems for workflows where software, automation, and human judgment have to work together.",
  "My work sits between product design, front-end engineering, AI workflow design, and operational tooling. I have built and shipped systems across AI-powered creator platforms, enterprise internal tools, spatial interfaces, and founder-led product development.",
  "Most recently, I owned UGC review systems for an AI-powered game creation platform, including auto-review logic, QA annotation workflows, calibration processes, final review behavior, creator feedback loops, and operational guardrails.",
  "I am strongest in ambiguous product environments where the work requires both systems thinking and hands-on execution: defining workflows, designing interfaces, building prototypes, improving review loops, documenting process, and turning messy human/AI interactions into usable product systems.",
]

const currentFocusItems = [
  "AI-assisted workflows",
  "Human-in-the-loop systems",
  "Product and design engineering",
  "Internal tools and operational UX",
  "Moderation and QA calibration systems",
  "Creator workflows",
  "Accessibility-focused interaction design",
  "XR, voice UI, and emerging interface systems",
]

const selectedProofPoints = [
  "Owned UGC review systems at Astrocade, spanning QA annotation workflows, calibration, final review behavior, creator feedback loops, and operational guardrails.",
  "Built Wizzo, an AI-driven social productivity platform using Next.js, TypeScript, Postgres, Drizzle ORM, Neon, and Vercel.",
  "Designed SpeakEasy, a voice-controlled mixed reality accessibility system for users with low muscle tone.",
  "Built enterprise internal tools and immersive systems for Starbucks, Ford, and POWER Engineers.",
]

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
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-button terminal-button-red"></div>
                <div className="terminal-button terminal-button-yellow"></div>
                <div className="terminal-button terminal-button-green"></div>
                <div className="terminal-title">positioning.sh</div>
              </div>
              <div className="terminal-content space-y-4">
                <p>
                  <span className="text-primary">$</span> cat professional_identity.txt
                </p>
                {introParagraphs.map((paragraph) => (
                  <p key={paragraph} className="text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Current Focus</h2>
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-button terminal-button-red"></div>
                <div className="terminal-button terminal-button-yellow"></div>
                <div className="terminal-button terminal-button-green"></div>
                <div className="terminal-title">current_focus.sh</div>
              </div>
              <div className="terminal-content">
                <p className="mb-4">
                  <span className="text-primary">$</span> cat focus_areas.txt
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentFocusItems.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-primary">-</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Selected Proof Points</h2>
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-button terminal-button-red"></div>
                <div className="terminal-button terminal-button-yellow"></div>
                <div className="terminal-button terminal-button-green"></div>
                <div className="terminal-title">proof_points.sh</div>
              </div>
              <div className="terminal-content">
                <p className="mb-4">
                  <span className="text-primary">$</span> cat selected_work.txt
                </p>
                <ul className="space-y-3">
                  {selectedProofPoints.map((proofPoint) => (
                    <li key={proofPoint} className="flex items-start gap-2">
                      <span className="text-primary">$</span>
                      <span>{proofPoint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Location & Availability</h2>
            <div className="grid md:grid-cols-[1fr_auto] gap-6 items-stretch">
              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="terminal-button terminal-button-red"></div>
                  <div className="terminal-button terminal-button-yellow"></div>
                  <div className="terminal-button terminal-button-green"></div>
                  <div className="terminal-title">availability.sh</div>
                </div>
                <div className="terminal-content">
                  <p className="mb-4">
                    <span className="text-primary">$</span> cat availability.txt
                  </p>
                  <p>
                    Based in Pacifica, California. Focused on Bay Area and remote product, design engineering, and AI systems roles.
                  </p>
                </div>
              </div>
              <div className="terminal-window flex flex-col justify-between">
                <div>
                  <div className="terminal-header">
                    <div className="terminal-button terminal-button-red"></div>
                    <div className="terminal-button terminal-button-yellow"></div>
                    <div className="terminal-button terminal-button-green"></div>
                    <div className="terminal-title">resume.sh</div>
                  </div>
                  <div className="terminal-content">
                    <p className="mb-4">
                      <span className="text-primary">$</span> open resume.pdf
                    </p>
                  </div>
                </div>
                <Button asChild>
                  <a href="/Michael_Chaves_Resume_min.pdf" download>
                    <Download size={16} />
                    Download Resume
                  </a>
                </Button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Contact</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="terminal-button terminal-button-red"></div>
                  <div className="terminal-button terminal-button-yellow"></div>
                  <div className="terminal-button terminal-button-green"></div>
                  <div className="terminal-title">contact_form.sh</div>
                </div>
                <div className="terminal-content">
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
                </div>
              </div>

              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="terminal-button terminal-button-red"></div>
                  <div className="terminal-button terminal-button-yellow"></div>
                  <div className="terminal-button terminal-button-green"></div>
                  <div className="terminal-title">network_connections.sh</div>
                </div>
                <div className="terminal-content">
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
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
