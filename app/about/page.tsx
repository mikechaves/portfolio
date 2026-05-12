"use client"

import { useEffect, useState, type FormEvent, useTransition } from "react"
import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXTwitter } from "@fortawesome/free-brands-svg-icons"
import { sendContactEmail } from "@/app/actions/contact"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FocusContextBadge } from "@/components/focus-context-badge"
import { experiences, skills, talksRecognition, volunteerExperiences } from "./data"
import { portfolioCapabilities } from "@/data/portfolio"

const fellowshipsAndRecognition = [...volunteerExperiences, ...talksRecognition]

export default function AboutPage() {
  const [isPending, startTransition] = useTransition()
  const [focus, setFocus] = useState("")
  const [formStatus, setFormStatus] = useState<{
    success: boolean | null
    message: string | null
  }>({ success: null, message: null })
  const { toast } = useToast()

  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("focus")
    if (query) setFocus(query)
  }, [])

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormStatus({ success: null, message: null })
    const form = e.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      try {
        const response = await sendContactEmail(formData)
        setFormStatus({ success: response.success, message: response.message })
        if (response.success) {
          form.reset()
          toast({ title: "Message sent", description: response.message })
        } else {
          toast({
            title: "Message failed",
            description: response.message || "Something went wrong. Please try again.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Contact form submission failed:", error)
        setFormStatus({ success: false, message: "An unexpected error occurred. Please try again." })
      }
    })
  }

  return (
    <div className="industrial-page industrial-page-wide">
      {focus && <FocusContextBadge focus={focus} />}
      <p className="industrial-page-kicker">Systems</p>
      <h1 className="industrial-page-title">Operator profile</h1>
      <p className="industrial-page-intro">
        AI-native product and experience engineer focused on forward-deployed execution inside complex organizations.
        I work across product, design, and engineering to move ambiguous ideas from prototype to production.
      </p>

      <div className="industrial-rule" />

      <section className="industrial-grid md:grid-cols-4">
        {portfolioCapabilities.map((capability) => (
          <div key={capability.id} className="industrial-card">
            <h3>{capability.label}</h3>
            <p>{capability.summary}</p>
          </div>
        ))}
      </section>

      <section className="mt-20 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="industrial-page-kicker">Experience</p>
          <h2 className="mt-3 text-4xl font-black uppercase leading-none text-[#f1ede3] md:text-6xl">
            Built under pressure
          </h2>
        </div>
        <div className="grid gap-4">
          {experiences.map((experience) => (
            <article key={`${experience.company}-${experience.title}`} className="industrial-card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3>{experience.title}</h3>
                  <p className="!mt-2 text-sm uppercase tracking-[0.14em] text-[#8f8678]">{experience.company}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.14em] text-[#8f8678]">{experience.period}</span>
              </div>
              <p>{experience.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-6 lg:grid-cols-2">
        <div className="industrial-card">
          <h2 className="text-3xl font-black uppercase text-[#f1ede3]">Fellowships & Recognition</h2>
          <div className="mt-6 grid gap-5">
            {fellowshipsAndRecognition.map((item) => (
              <div key={`${item.title}-${item.period}`} className="border-t border-[#e8e1d2]/10 pt-4">
                <h3 className="!text-xl">{item.title}</h3>
                <p className="!mt-1 text-sm uppercase tracking-[0.14em] text-[#8f8678]">{item.period}</p>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="industrial-card">
          <h2 className="text-3xl font-black uppercase text-[#f1ede3]">System Specs</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {skills.map((skillGroup) => (
              <div key={skillGroup.category}>
                <h3 className="!text-xl">{skillGroup.category}</h3>
                <ul className="mt-3 grid gap-2 text-sm text-[#b9b0a2]">
                  {skillGroup.items.map((skill) => (
                    <li key={skill}>— {skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mt-20 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="industrial-page-kicker">Contact</p>
          <h2 className="mt-3 text-4xl font-black uppercase leading-none text-[#f1ede3] md:text-6xl">
            Let&apos;s build something real.
          </h2>
          <p className="industrial-page-intro">
            Send a signal for AI product systems, spatial UX, prototyping, or production hardening work.
          </p>
          <div className="mt-8 grid gap-4 text-[#b9b0a2]">
            <Link href="https://github.com/mikechaves" target="_blank" className="inline-flex items-center gap-3 hover:text-[#eee7d8]">
              <Github size={18} /> github.com/mikechaves
            </Link>
            <Link href="https://x.com/mikechaves_io" target="_blank" className="inline-flex items-center gap-3 hover:text-[#eee7d8]">
              <FontAwesomeIcon icon={faXTwitter} className="h-4 w-4" /> x.com/mikechaves_io
            </Link>
            <Link href="https://www.linkedin.com/in/mikejchaves" target="_blank" className="inline-flex items-center gap-3 hover:text-[#eee7d8]">
              <Linkedin size={18} /> linkedin.com/in/mikejchaves
            </Link>
            <Link href="mailto:founder@gowizzo.io" className="inline-flex items-center gap-3 hover:text-[#eee7d8]">
              <Mail size={18} /> founder@gowizzo.io
            </Link>
          </div>
        </div>

        <form className="industrial-card grid gap-4" onSubmit={handleSubmit}>
          <div className="industrial-form-field">
            <label htmlFor="name">Name</label>
            <Input id="name" name="name" required disabled={isPending} className="border-[#e8e1d2]/20 bg-black/60" />
          </div>
          <div className="industrial-form-field">
            <label htmlFor="email">Email</label>
            <Input id="email" name="email" type="email" required disabled={isPending} className="border-[#e8e1d2]/20 bg-black/60" />
          </div>
          <div className="industrial-form-field">
            <label htmlFor="message">Message</label>
            <Textarea id="message" name="message" rows={5} required disabled={isPending} className="border-[#e8e1d2]/20 bg-black/60" />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Sending..." : "Start a conversation"}
          </Button>
          {formStatus.message && (
            <p className={formStatus.success ? "text-sm text-green-400" : "text-sm text-red-400"}>
              {formStatus.message}
            </p>
          )}
        </form>
      </section>
    </div>
  )
}
