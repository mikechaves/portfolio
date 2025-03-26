"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", label: "All Projects" },
    { id: "design", label: "UX/UI Design" },
    { id: "ar-vr", label: "AR/VR" },
    { id: "web", label: "Web Development" },
    { id: "research", label: "Research" },
  ]

  const projects = [
    {
      id: "geovoice",
      title: "GeoVoice",
      category: "web",
      description:
        "A platform created to streamline geospatial data analysis and stakeholder feedback, primarily for large-scale infrastructure and environmental planning projects. The result is a more transparent and efficient way to collaborate.",
      image: "/projects/geovoice/main-image.png",
      technologies: ["Geospatial Mapping", "UX/UI Design", "Data Visualization"],
    },
    {
      id: "transcribe",
      title: "Transcribe",
      category: "design",
      description:
        "Improved communication in Starbucks stores with real-time speech-to-text transcription, enhancing inclusivity and operational efficiency.",
      image: "/projects/transcribe/main-image.png",
      technologies: ["React.js", "UX/UI Design", "Speech-to-Text API"],
    },
    {
      id: "gaia",
      title: "Gaia",
      category: "design",
      description:
        "Transformed data analytics into practical, experiential contexts through spatial computing for Starbucks, enhancing store operations and training.",
      image: "/projects/gaia/main-image.png",
      technologies: ["UX Design", "AR/VR", "Unity3D"],
    },
    {
      id: "apt-plus",
      title: "APT+",
      category: "design",
      description:
        "Streamlined manufacturing workflows for Ford by improving time studies, saving approximately $1M per plant annually.",
      image: "/projects/apt-plus/main-image.png",
      technologies: ["UX/UI Design", "Data Visualization", "Process Optimization"],
    },
    {
      id: "speakeasy",
      title: "SpeakEasy",
      category: "research",
      description:
        "Reimagining XR for a more inclusive future with voice-driven AI interfaces for users with physical challenges.",
      image: "/projects/speakeasy/main-image.png",
      technologies: ["Voice-Driven AI", "XR Accessibility", "Inclusive Design"],
    },
    {
      id: "sound-escape-vr",
      title: "Sound Escape VR",
      category: "ar-vr",
      description:
        "An immersive VR music creation and visualization experience with a retro 80s synthwave aesthetic, allowing users to compose music and see the environment transform in response.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["Unity3D", "C#", "VR Development", "Audio Visualization"],
    },
    {
      id: "material-explorer",
      title: "Material Explorer",
      category: "web",
      description:
        "An interactive web application for creating, customizing, and visualizing 3D materials in real-time using Three.js and React Three Fiber.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["TypeScript", "React", "Three.js", "WebGL"],
    },
    {
      id: "snap",
      title: "Snap Inc's Spectacles",
      category: "ar-vr",
      description: "Leading a team in the Spectacles Accelerator Program to create innovative AR experiences.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["AR", "Team Leadership", "Product Design"],
    },
    {
      id: "ai-energy-consumption",
      title: "AI Energy Consumption",
      category: "web",
      description:
        "An interactive 3D data visualization showcasing the global impact of AI's energy consumption and CO2 emissions across different countries and regions.",
      image: "/placeholder.svg?height=400&width=600",
      technologies: ["A-Frame", "D3.js", "3D Visualization", "Data Storytelling"],
    },
  ]

  const filteredProjects =
    activeCategory === "all" ? projects : projects.filter((project) => project.category === activeCategory)

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
          <p
            style={{
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
              lineHeight: "1.5",
              margin: "0",
              marginBottom: ".25rem",
            }}
          >
            <span className="text-primary">$</span> Displaying projects directory. Select category to filter results.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              activeCategory === category.id ? "bg-primary text-black" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  )
}

interface ProjectCardProps {
  id: string
  title: string
  category: string
  description: string
  image: string
  technologies: string[]
}

function ProjectCard({ id, title, category, description, image, technologies }: ProjectCardProps) {
  return (
    <Link href={`/projects/${id}`} className="block group">
      <div className="border border-zinc-800 rounded-md overflow-hidden bg-black h-full transition-all group-hover:border-primary">
        <div className="relative h-48 bg-gradient-to-b from-zinc-700 to-zinc-900">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover opacity-70 mix-blend-overlay"
          />
          <div className="absolute inset-0 flex items-end p-4">
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{description}</p>
          <div className="flex flex-wrap gap-2">
            {technologies.slice(0, 3).map((tech) => (
              <span key={tech} className="text-xs px-2 py-1 bg-zinc-800 text-zinc-300 rounded">
                {tech}
              </span>
            ))}
            {technologies.length > 3 && (
              <span className="text-xs px-2 py-1 bg-zinc-800 text-zinc-300 rounded">+{technologies.length - 3}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

