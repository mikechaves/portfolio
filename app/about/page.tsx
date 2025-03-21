"use client"

import { useState } from "react"
import { Terminal } from "@/components/terminal"
import { Github, Linkedin, Mail } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXTwitter } from "@fortawesome/free-brands-svg-icons"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core"
// Prevent Font Awesome from adding its CSS since we did it manually above
config.autoAddCss = false

export default function AboutPage() {
  const [introComplete, setIntroComplete] = useState(false)
  const [bioComplete, setBioComplete] = useState(false)

  // Update the experiences array with the professional experience from the resume
  const experiences = [
    {
      title: "Lead UX/UI Designer III (Design Engineering Focus)",
      company: "Starbucks Corporation",
      period: "April 2022 - December 2022",
      description:
        "Designed VR/mobile interfaces with design thinking. Made them intuitive and user tested. Solved complex UX challenges and enhanced interaction and visual appeal. Collaborated with ML engineers to integrate AI capabilities into mobile and VR interfaces.",
    },
    {
      title: "UX/UI Design Engineer – Unity & Frontend",
      company: "Ford Motor Company",
      period: "October 2021 - March 2022",
      description:
        "Built Unity3D time study tool with integrated machine learning components, saving $1M annually. Created reinforcement learning environments to optimize manufacturing scenarios. Implemented MLOps practices to ensure consistent model performance across global deployments.",
    },
    {
      title: "UX/UI Design Engineer – Frontend & Immersive Technologies",
      company: "POWER Engineers",
      period: "June 2020 - October 2021",
      description:
        "Led GeoVoice design, a web/VR app. Boosted stakeholder engagement. Developed interactive tools using Python, JavaScript, C#, and Unity3D.",
    },
    {
      title: "Lead, Spectacles Accelerator Program",
      company: "Snap Inc.",
      period: "January 2025 - Present",
      description: "Developing voice-first AR prototypes leveraging transformer-based speech models for accessibility.",
    },
  ]

  // Update the skills array with the skills from the resume
  const skills = [
    {
      category: "AI & Machine Learning",
      items: [
        "LLM Fine-tuning",
        "Transformer Models",
        "Reinforcement Learning",
        "Neural Networks",
        "Natural Language Processing",
        "Open-Source LLMs (Llama, Gemma, QWN, DeepSeek RI)",
      ],
    },
    {
      category: "MLOps",
      items: ["Model Versioning", "Automated Testing", "Performance Benchmarking", "Deployment Pipelines"],
    },
    {
      category: "Programming",
      items: ["Python (PyTorch, TensorFlow, Hugging Face)", "JavaScript", "C#"],
    },
    {
      category: "Design & Integration",
      items: [
        "User-Centered Design",
        "AI-Enhanced Interfaces",
        "Multimodal Systems",
        "AR/VR prototyping",
        "XR accessibility",
      ],
    },
    {
      category: "Data Science",
      items: ["Dataset Curation", "Statistical Analysis", "Performance Evaluation", "A/B Testing"],
    },
    {
      category: "Tools",
      items: [
        "Unity3D",
        "Git",
        "Jupyter",
        "Figma",
        "Docker",
        "Vercel",
        "Hugging Face Transformers",
        "LangChain",
        "GitHub Copilot",
        "Claude Code",
        "Cursor",
      ],
    },
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
                      <span className="text-primary">degree:</span> Master of Design in Experience Design, Exp. May 2025
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
                      <p className="mb-1 text-primary">x0:</p>
                      <Link
                        href="https://x.com"
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                        target="_blank"
                      >
                        <span className="w-4 h-4 flex items-center justify-center">
                          <FontAwesomeIcon icon={faXTwitter} className="w-3 h-3" />
                        </span>
                        x.com/cyberdev
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
                        href="mailto:mike@digitalhous.com"
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <Mail size={16} />
                        mike@digitalhous.com
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

