"use client"

import { useState, type FormEvent, useTransition } from "react"
import { Terminal } from "@/components/terminal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXTwitter } from "@fortawesome/free-brands-svg-icons"
import { Github, Linkedin, Mail } from "lucide-react"
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
import { experiences, volunteerExperiences, skills } from "./data"

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

  // Data arrays are imported from ./data to keep them outside the component

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
      <section>
        <Terminal
          text="Initializing personal profile... Access granted. Loading bio data..."
          typingSpeed={30}
          className="max-w-3xl mx-auto"
          onComplete={() => setIntroComplete(true)}
        />

        {introComplete && (
          <Terminal
            text="Hello, I'm MIKE_CHAVES. I blend technical expertise with creative innovation to deliver accessible, immersive digital experiences. I graduated with my Master of Design in Experience Design from San Jose State University in May 2025, and I lead my team in Snap Inc's Spectacles Accelerator Program."
            typingSpeed={20}
            className="max-w-3xl mx-auto mt-4"
            showPrompt={false}
            onComplete={() => setBioComplete(true)}
          />
        )}
      </section>

      {bioComplete && (
        <>
          <section>
            <h2 className="text-2xl font-bold mb-6">Professional Experience</h2>
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div key={index} className="terminal-window">
                  <div className="terminal-header">
                    <div className="terminal-button terminal-button-red"></div>
                    <div className="terminal-button terminal-button-yellow"></div>
                    <div className="terminal-button terminal-button-green"></div>
                    <div className="terminal-title">{exp.company}.sh</div>
                  </div>
                  <div className="terminal-content">
                    <p className="mb-1">
                      <span className="text-primary">$</span> cat job_details.txt
                    </p>
                    <div className="mb-2">
                      <p>
                        <span className="text-primary">title:</span> {exp.title}
                      </p>
                      <p>
                        <span className="text-primary">period:</span> {exp.period}
                      </p>
                      <p>
                        <span className="text-primary">description:</span> {exp.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Fellowships & Leadership</h2>
            <div className="space-y-6">
              {volunteerExperiences.map((exp, index) => (
                <div key={index} className="terminal-window">
                  <div className="terminal-header">
                    <div className="terminal-button terminal-button-red"></div>
                    <div className="terminal-button terminal-button-yellow"></div>
                    <div className="terminal-button terminal-button-green"></div>
                    <div className="terminal-title">{exp.company}.sh</div>
                  </div>
                  <div className="terminal-content">
                    <p className="mb-1">
                      <span className="text-primary">$</span> cat volunteer_details.txt
                    </p>
                    <div className="mb-2">
                      <p>
                        <span className="text-primary">title:</span> {exp.title}
                      </p>
                      <p>
                        <span className="text-primary">period:</span> {exp.period}
                      </p>
                      <p>
                        <span className="text-primary">description:</span> {exp.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Education</h2>
            <div className="space-y-6">
              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="terminal-button terminal-button-red"></div>
                  <div className="terminal-button terminal-button-yellow"></div>
                  <div className="terminal-button terminal-button-green"></div>
                  <div className="terminal-title">education.sh</div>
                </div>
                <div className="terminal-content">
                  <p className="mb-1">
                    <span className="text-primary">$</span> cat education.txt
                  </p>
                  <div className="mb-4">
                    <p className="mb-2">
                      <span className="text-primary">degree:</span> Master of Design in Experience Design, May 2025
                    </p>
                    <p className="mb-2">
                      <span className="text-primary">institution:</span> San Jose State University, San Jose, CA
                    </p>
                    <p className="mb-2">
                      <span className="text-primary">thesis:</span> Voice-driven AI interfaces for XR environments using
                      transformer models.
                    </p>
                  </div>
                  <div>
                    <p className="mb-2">
                      <span className="text-primary">degree:</span> Bachelor of Science in Games, Interactive Media, and
                      Mobile Technology, May 2020
                    </p>
                    <p className="mb-2">
                      <span className="text-primary">institution:</span> Boise State University, Boise, ID
                    </p>
                    <p className="mb-2">
                      <span className="text-primary">honors:</span> Dean's List with Highest Honors, 2019 & 2020.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">System Specs</h2>
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-button terminal-button-red"></div>
                <div className="terminal-button terminal-button-yellow"></div>
                <div className="terminal-button terminal-button-green"></div>
                <div className="terminal-title">skills.sh</div>
              </div>
              <div className="terminal-content">
                <p className="mb-4">
                  <span className="text-primary">$</span> cat /proc/skills
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {skills.map((skillGroup, index) => (
                    <div key={index} className="space-y-2">
                      <h3 className="text-primary font-bold">{skillGroup.category}</h3>
                      <ul className="space-y-1">
                        {skillGroup.items.map((skill, skillIndex) => (
                          <li key={skillIndex} className="flex items-center gap-2">
                            <span className="text-primary">-</span>
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
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
  )
}
