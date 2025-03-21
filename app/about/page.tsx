"use client"

import { useState } from "react"
import { Terminal } from "@/components/terminal"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function AboutPage() {
  const [introComplete, setIntroComplete] = useState(false)
  const [bioComplete, setBioComplete] = useState(false)

  const experiences = [
    {
      title: "UX Designer & Team Lead",
      company: "Snap Inc's Spectacles",
      period: "2023 - Present",
      description:
        "Leading a team in the Spectacles Accelerator Program to create innovative AR experiences and applications.",
    },
    {
      title: "Digital Experience Designer",
      company: "Ford",
      period: "2021 - 2023",
      description:
        "Designed digital experiences for Ford's customer-facing applications, focusing on user-centered design principles and accessibility.",
    },
    {
      title: "UX/UI Designer",
      company: "Starbucks Technology",
      period: "2019 - 2021",
      description:
        "Worked with the Emerging Technology division to create innovative digital experiences for Starbucks customers and employees.",
    },
  ]

  const skills = [
    { category: "Design", items: ["UX Design", "UI Design", "Interaction Design", "Prototyping"] },
    { category: "Development", items: ["Front-end Development", "React", "HTML/CSS", "JavaScript"] },
    { category: "Tools", items: ["Figma", "Adobe Creative Suite", "Sketch", "InVision"] },
    { category: "Research", items: ["User Research", "Usability Testing", "A/B Testing", "Analytics"] },
    { category: "Leadership", items: ["Team Leadership", "Project Management", "Mentoring", "Client Relations"] },
    { category: "Emerging Tech", items: ["AR/VR", "Spatial Computing", "Voice UI", "Gesture Control"] },
  ]

  return (
    <div className="space-y-16">
      <section>
        <Terminal
          text="Initializing personal profile... Access granted. Loading bio data..."
          typingSpeed={30}
          className="max-w-3xl mx-auto"
          onComplete={() => setIntroComplete(true)}
        />

        {introComplete && (
          <Terminal
            text="Hello, I'm MIKE_CHAVES. I blend technical expertise with creative innovation to deliver accessible, immersive digital experiences. I am on track to graduate with my Master of Design in Experience Design in May 2025 at San Jose State University, and I lead my team in Snap Inc's Spectacles Accelerator Program."
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
            <h2 className="text-2xl font-bold mb-6">Experience Timeline</h2>
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
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm mb-1">
                        <span className="text-primary">name:</span>
                      </label>
                      <Input id="name" placeholder="Enter your name" className="bg-background border-border" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm mb-1">
                        <span className="text-primary">email:</span>
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="bg-background border-border"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm mb-1">
                        <span className="text-primary">message:</span>
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Enter your message"
                        rows={4}
                        className="bg-background border-border"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
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
                        href="https://github.com"
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                        target="_blank"
                      >
                        <Github size={16} />
                        github.com/cyberdev
                      </Link>
                    </div>
                    <div>
                      <p className="mb-1 text-primary">twitter0:</p>
                      <Link
                        href="https://twitter.com"
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                        target="_blank"
                      >
                        <Twitter size={16} />
                        twitter.com/cyberdev
                      </Link>
                    </div>
                    <div>
                      <p className="mb-1 text-primary">linkedin0:</p>
                      <Link
                        href="https://linkedin.com"
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                        target="_blank"
                      >
                        <Linkedin size={16} />
                        linkedin.com/in/cyberdev
                      </Link>
                    </div>
                    <div>
                      <p className="mb-1 text-primary">mail0:</p>
                      <Link
                        href="mailto:hello@example.com"
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <Mail size={16} />
                        hello@example.com
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

