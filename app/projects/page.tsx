"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Project } from "@/types/project"

const MOBILE_BREAKPOINT_PX = 767
const PROJECTS_LIMIT_MOBILE = 3
const PROJECTS_LIMIT_DESKTOP = 6

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [initialLimit, setInitialLimit] = useState(PROJECTS_LIMIT_DESKTOP)
  const [showAll, setShowAll] = useState(false)
  const [query, setQuery] = useState("")
  const [personalized, setPersonalized] = useState(false)
  const [display, setDisplay] = useState<Project[]>([])
  const skipFilterEffect = useRef(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT_PX}px)`
    )

    const updateLimit = () => {
      setInitialLimit(
        mediaQuery.matches ? PROJECTS_LIMIT_MOBILE : PROJECTS_LIMIT_DESKTOP
      )
    }

    updateLimit()

    mediaQuery.addEventListener("change", updateLimit)

    return () => {
      mediaQuery.removeEventListener("change", updateLimit)
    }
  }, [])

  const projects = [
    {
      id: "geovoice",
      title: "GeoVoice",
      description:
        "A platform created to streamline geospatial data analysis and stakeholder feedback, primarily for large-scale infrastructure and environmental planning projects. The result is a more transparent and efficient way to collaborate.",
      image: "/projects/geovoice/main-image.png?height=400&width=600",
      technologies: ["Geospatial Mapping", "UX/UI Design", "Data Visualization"],
      category: "web",
    },
    {
      id: "transcribe",
      title: "Transcribe",
      description:
        "Improved communication in Starbucks stores with real-time speech-to-text transcription, enhancing inclusivity and operational efficiency.",
      image: "/projects/transcribe/main-image.png?height=400&width=600",
      technologies: ["React.js", "UX/UI Design", "Speech-to-Text API"],
      category: "design",
    },
    {
      id: "gaia",
      title: "Gaia",
      description:
        "Transformed data analytics into practical, experiential contexts through spatial computing for Starbucks, enhancing store operations and training.",
      image: "/projects/gaia/main-image.png?height=400&width=600",
      technologies: ["UX Design", "AR/VR", "Unity3D"],
      category: "design",
    },
    {
      id: "apt-plus",
      title: "APT+",
      description:
        "Streamlined manufacturing workflows for Ford by improving time studies, saving approximately $1M per plant annually.",
      image: "/projects/apt-plus/main-image.png?height=400&width=600",
      technologies: ["UX/UI Design", "Data Visualization", "Process Optimization"],
      category: "design",
    },
    {
      id: "speakeasy",
      title: "SpeakEasy",
      description:
        "Reimagining XR for a more inclusive future with voice-driven AI interfaces for users with physical challenges.",
      image: "/projects/speakeasy/thesis-defense.jpg?height=400&width=600",
      technologies: ["Voice-Driven AI", "XR Accessibility", "Inclusive Design"],
      category: "research",
    },
    {
      id: "sound-escape-vr",
      title: "Sound Escape VR",
      description:
        "An immersive VR music creation and visualization experience with a retro 80s synthwave aesthetic, allowing users to compose music and see the environment transform in response.",
      image: "/projects/soundescape/main-image.jpg?height=400&width=600",
      technologies: ["Unity3D", "C#", "VR Development", "Audio Visualization"],
      category: "ar-vr",
    },
    {
      id: "material-explorer",
      title: "Material Explorer",
      description:
        "An interactive web application for creating, customizing, and visualizing 3D materials in real-time using Three.js and React Three Fiber.",
      image: "/projects/material-explorer/main-image.png?height=400&width=600",
      technologies: ["TypeScript", "React", "Three.js", "WebGL"],
      category: "web",
    },
    {
      id: "portals",
      title: "Portals",
      description:
        "An immersive AR experience for Snap Spectacles designed to bring music, culture, and climate awareness to life through interactive and accessible features.",
      image: "/projects/portals/main-image.png?height=400&width=600",
      technologies: ["AR", "Snap Spectacles", "Spatial Audio", "Voice UI", "Accessibility"],
      category: "ar-vr",
    },
    {
      id: "ai-energy-consumption",
      title: "AI Energy Consumption",
      description:
        "An interactive 3D data visualization showcasing the global impact of AI's energy consumption and CO2 emissions across different countries and regions.",
      image: "/projects/ai-energy-consumption/main-image.png?height=400&width=600",
      technologies: ["A-Frame", "D3.js", "3D Visualization", "Data Storytelling"],
      category: "web",
    },
    {
      id: "die-ai",
      title: "Die, AI!",
      description:
        "A Flash shooter demo built in Adobe Animate and ActionScript, now revived for modern browsers with Ruffle.",
      image: "/projects/die-ai/main-image.png?height=400&width=600",
      technologies: ["ActionScript", "Adobe Animate", "Ruffle"],
      category: "web",
    },
  ]

  const categories = [
    { id: "all", name: "All Projects" },
    { id: "design", name: "UX/UI Design" },
    { id: "ar-vr", name: "AR/VR" },
    { id: "web", name: "Web Development" },
    { id: "research", name: "Research" },
  ]

  const filteredProjects = useMemo(
    () =>
      activeFilter === "all"
        ? projects
        : projects.filter((project) => project.category === activeFilter),
    [activeFilter]
  )

  useEffect(() => {
    if (skipFilterEffect.current) {
      skipFilterEffect.current = false
      return
    }
    setDisplay(filteredProjects)
    setQuery("")
    setPersonalized(false)
    setShowAll(false)
  }, [activeFilter, filteredProjects])

  const handlePersonalize = () => {
    const text = query.trim().toLowerCase()
    if (activeFilter !== "all") {
      skipFilterEffect.current = true
      setActiveFilter("all")
    }

    const baseProjects = projects

    if (!text) {
      setQuery("")
      setDisplay(baseProjects)
      setPersonalized(false)
      setShowAll(false)
      return
    }

    const matches = baseProjects.filter(
      (p) =>
        (p.title || "").toLowerCase().includes(text) ||
        (p.description || "").toLowerCase().includes(text) ||
        (p.technologies || []).some((tag) => (tag || "").toLowerCase().includes(text))
    )

    if (matches.length > 0) {
      setDisplay(matches)
      setPersonalized(true)
    } else {
      setDisplay(baseProjects)
      setPersonalized(false)
    }
    setShowAll(false)
  }

  const handleReset = () => {
    setQuery("")
    setDisplay(filteredProjects)
    setPersonalized(false)
    setShowAll(false)
  }

  return (
    <div className="space-y-8 pt-8">
      <h1 className="sr-only">Projects</h1>
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

      <div className="space-y-4">
        <form
          className="flex flex-col sm:flex-row gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            handlePersonalize()
          }}
        >
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a keyword"
            className="flex-1"
          />
          <Button type="submit">Personalize</Button>
          {personalized && (
            <Button type="button" variant="secondary" onClick={handleReset}>
              Reset
            </Button>
          )}
        </form>

        {personalized ? (
          <h2 className="text-xl font-bold">
            Projects aligned with “{query.trim()}”:
          </h2>
        ) : (
          <h2 className="text-xl font-bold">
            {categories.find((c) => c.id === activeFilter)?.name}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {display
            .slice(0, showAll ? display.length : initialLimit)
            .map((project) => (
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
        {!showAll && display.length > initialLimit && (
          <div className="flex justify-center">
            <Button onClick={() => setShowAll(true)} variant="secondary">
              See More
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
