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
      id: "starbucks",
      title: "Starbucks Technology",
      description: "Work with Starbucks Technology Emerging Technology division on innovative digital experiences.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["UX Design", "Emerging Tech", "Innovation"],
    },
    {
      id: "ford",
      title: "Ford Digital Experience",
      description: "Digital experience design for Ford's customer-facing applications and interfaces.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["UX/UI", "Digital Design", "Automotive"],
    },
    {
      id: "snap",
      title: "Snap Inc's Spectacles",
      description: "Leading a team in the Spectacles Accelerator Program to create innovative AR experiences.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["AR", "Team Leadership", "Product Design"],
    },
  ]

  const latestPosts = [
    {
      id: "future-of-ai",
      title: "The Future of AI Development",
      excerpt: "Exploring the ethical implications and technological advancements in artificial intelligence.",
      date: "2023-05-15",
      readingTime: "5 min read",
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

