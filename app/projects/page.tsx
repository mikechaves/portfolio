"use client"

import { useState } from "react"
import { ProjectCard } from "@/components/project-card"

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all")

  const projects = [
    {
      id: "starbucks",
      title: "Starbucks Technology",
      description: "Work with Starbucks Technology Emerging Technology division on innovative digital experiences.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["UX Design", "Emerging Tech", "Innovation"],
      category: "design",
    },
    {
      id: "ford",
      title: "Ford Digital Experience",
      description: "Digital experience design for Ford's customer-facing applications and interfaces.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["UX/UI", "Digital Design", "Automotive"],
      category: "design",
    },
    {
      id: "snap",
      title: "Snap Inc's Spectacles",
      description: "Leading a team in the Spectacles Accelerator Program to create innovative AR experiences.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["AR", "Team Leadership", "Product Design"],
      category: "ar",
    },
    {
      id: "sjsu",
      title: "Master of Design Project",
      description: "Academic research and design project for Master of Design in Experience Design at SJSU.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["Research", "Experience Design", "Academic"],
      category: "research",
    },
    {
      id: "portfolio",
      title: "Personal Portfolio",
      description: "Design and development of personal portfolio website showcasing UX/UI work.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["Next.js", "React", "UI Design"],
      category: "web",
    },
    {
      id: "ar-experiments",
      title: "AR Experiments",
      description: "Collection of experimental augmented reality prototypes and concepts.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["AR", "Prototyping", "3D Design"],
      category: "ar",
    },
  ]

  const categories = [
    { id: "all", name: "All Projects" },
    { id: "design", name: "UX/UI Design" },
    { id: "ar", name: "AR/VR" },
    { id: "web", name: "Web Development" },
    { id: "research", name: "Research" },
  ]

  const filteredProjects =
    activeFilter === "all" ? projects : projects.filter((project) => project.category === activeFilter)

  return (
    <div className="space-y-8">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-button terminal-button-red"></div>
          <div className="terminal-button terminal-button-yellow"></div>
          <div className="terminal-button terminal-button-green"></div>
          <div className="terminal-title">projects.sh</div>
        </div>
        <div className="terminal-content">
          <p className="mb-4">
            <span className="text-primary">$</span> Displaying projects directory. Select category to filter results.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveFilter(category.id)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              activeFilter === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.title}
            description={project.description}
            image={project.image}
            technologies={project.technologies}
          />
        ))}
      </div>
    </div>
  )
}

