"use client"

import { useState } from "react"
import Link from "next/link"
import { Terminal } from "@/components/terminal"
import { ProjectCard } from "@/components/project-card"
import { BlogCard } from "@/components/blog-card"
import { ArrowRight } from "lucide-react"

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false)

  const featuredProjects = [
    {
      id: "geovoice",
      title: "GeoVoice",
      description:
        "A platform for streamlining geospatial data analysis and stakeholder feedback for large-scale infrastructure and environmental planning projects.",
      image: "/projects/geovoice/main-image.png?height=400&width=600",
      technologies: ["Geospatial Mapping", "UX/UI Design", "Data Visualization"],
    },
    {
      id: "transcribe",
      title: "Transcribe",
      description:
        "Improved communication in Starbucks stores with real-time speech-to-text transcription, enhancing inclusivity and operational efficiency.",
      image: "/projects/transcribe/main-image.png?height=400&width=600",
      technologies: ["React.js", "UX/UI Design", "Speech-to-Text API"],
    },
    {
      id: "speakeasy",
      title: "SpeakEasy",
      description:
        "Reimagining XR for a more inclusive future with voice-driven AI interfaces for users with physical challenges.",
      image: "/projects/speakeasy/main-image.png?height=400&width=600",
      technologies: ["Voice-Driven AI", "XR Accessibility", "Inclusive Design"],
    },
  ]

  const latestPosts = [
    {
      id: "embracing-ambiguity",
      title: "Embracing Ambiguity: Finding Clarity in the Chaos of Modern Technology",
      excerpt:
        "Navigating the complex landscape of emerging technologies and finding meaningful solutions amid uncertainty.",
      date: "Feb 12, 2025",
      readingTime: "6 min read",
      url: "https://medium.com/design-bootcamp/embracing-ambiguity-finding-clarity-in-the-chaos-of-modern-technology-415e5834e150",
      publication: "Bootcamp",
    },
  ]

  const skills = [
    "UX Design",
    "UI Development",
    "AR/VR",
    "User Research",
    "Prototyping",
    "Creative Direction",
    "Team Leadership",
    "Front-end Development",
  ]

  return (
    <div className="space-y-16">
      <section className="py-12">
        <Terminal
          text="Hello, World. I am MIKE_CHAVES. I design immersive, user-centered experiences that push boundaries."
          typingSpeed={40}
          className="max-w-3xl mx-auto"
          onComplete={() => setIntroComplete(true)}
        />

        {introComplete && (
          <div className="mt-8 flex justify-center">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md transition-colors border border-primary/30"
            >
              Learn more about me <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Projects</h2>
          <Link href="/projects" className="text-primary hover:underline inline-flex items-center gap-1">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Skills</h2>
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-button terminal-button-red"></div>
            <div className="terminal-button terminal-button-yellow"></div>
            <div className="terminal-button terminal-button-green"></div>
            <div className="terminal-title">system_specs.sh</div>
          </div>
          <div className="terminal-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-primary">$</span>
                  <span className="text-white">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Latest from the Blog</h2>
          <Link href="/blog" className="text-primary hover:underline inline-flex items-center gap-1">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {latestPosts.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
        </div>
      </section>
    </div>
  )
}

