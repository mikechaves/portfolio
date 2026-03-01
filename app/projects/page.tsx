"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { runAdaptiveFocus } from "@/features/adaptive-focus"
import type { Project } from "@/types/project"

const MOBILE_BREAKPOINT_PX = 767
const PROJECTS_LIMIT_MOBILE = 3
const PROJECTS_LIMIT_DESKTOP = 6

const ADAPTIVE_FOCUS_EXAMPLES = [
  "I'm hiring for an AI design engineer",
  "Show me your XR accessibility work",
  "What would be most relevant for Adobe?",
  "Focus on rapid prototyping and product execution",
]

const PROJECTS: Project[] = [
  {
    id: "wizzo",
    title: "Wizzo",
    description:
      "Founded Wizzo Labs, building a SaaS platform for goal tracking and personal productivity currently in beta launch. Driving product vision and technical prototyping across AI and web interfaces while leading fundraising, strategy, and early team formation.",
    image: "/projects/wizzo/main-image.png?height=400&width=600",
    technologies: ["SaaS Platform", "Productivity Tools", "AI Integration"],
    category: "web" as const,
  },
  {
    id: "speakeasy",
    title: "SpeakEasy",
    description:
      "Reimagining XR for a more inclusive future with voice-driven AI interfaces for users with physical challenges.",
    image: "/projects/speakeasy/thesis-defense.jpg?height=400&width=600",
    technologies: ["Voice-Driven AI", "XR Accessibility", "Inclusive Design"],
    category: "research" as const,
  },
  {
    id: "transcribe",
    title: "Transcribe",
    description:
      "Improved communication in Starbucks stores with real-time speech-to-text transcription, enhancing inclusivity and operational efficiency.",
    image: "/projects/transcribe/main-image.png?height=400&width=600",
    technologies: ["React.js", "UX/UI Design", "Speech-to-Text API"],
    category: "design" as const,
  },
  {
    id: "gaia",
    title: "Gaia",
    description:
      "Transformed data analytics into practical, experiential contexts through spatial computing for Starbucks, enhancing store operations and training.",
    image: "/projects/gaia/main-image.png?height=400&width=600",
    technologies: ["UX Design", "AR/VR", "Unity3D"],
    category: "ar-vr" as const,
  },
  {
    id: "apt-plus",
    title: "APT+",
    description:
      "Streamlined manufacturing workflows for Ford by improving time studies, saving approximately $1M per plant annually.",
    image: "/projects/apt-plus/main-image.png?height=400&width=600",
    technologies: ["UX/UI Design", "Data Visualization", "Process Optimization"],
    category: "design" as const,
  },
  {
    id: "geovoice",
    title: "GeoVoice",
    description:
      "A platform created to streamline geospatial data analysis and stakeholder feedback, primarily for large-scale infrastructure and environmental planning projects. The result is a more transparent and efficient way to collaborate.",
    image: "/projects/geovoice/main-image.png?height=400&width=600",
    technologies: ["Geospatial Mapping", "UX/UI Design", "Data Visualization"],
    category: "web" as const,
  },
  {
    id: "sound-escape-vr",
    title: "Sound Escape VR",
    description:
      "An immersive VR music creation and visualization experience with a retro 80s synthwave aesthetic, allowing users to compose music and see the environment transform in response.",
    image: "/projects/soundescape/main-image.jpg?height=400&width=600",
    technologies: ["Unity3D", "C#", "VR Development", "Audio Visualization"],
    category: "ar-vr" as const,
  },
  {
    id: "material-explorer",
    title: "Material Explorer",
    description:
      "An actively maintained 3D material lab with real-time PBR editing, A/B compare, autosave, and share/export workflows built with React + Three.js.",
    image: "/projects/material-explorer/main-image.png?height=400&width=600",
    technologies: ["TypeScript", "React 19", "Three.js", "React Three Fiber"],
    category: "web" as const,
  },
  {
    id: "portals",
    title: "Portals",
    description:
      "An immersive AR experience for Snap Spectacles designed to bring music, culture, and climate awareness to life through interactive and accessible features.",
    image: "/projects/portals/main-image.png?height=400&width=600",
    technologies: ["AR", "Snap Spectacles", "Spatial Audio", "Voice UI", "Accessibility"],
    category: "ar-vr" as const,
  },
  {
    id: "ai-energy-consumption",
    title: "AI Energy Consumption",
    description:
      "An interactive 3D data visualization showcasing the global impact of AI's energy consumption and CO2 emissions across different countries and regions.",
    image: "/projects/ai-energy-consumption/main-image.png?height=400&width=600",
    technologies: ["A-Frame", "D3.js", "3D Visualization", "Data Storytelling"],
    category: "web" as const,
  },
  {
    id: "die-ai",
    title: "Die, AI!",
    description:
      "A Flash shooter demo built in Adobe Animate and ActionScript, now revived for modern browsers with Ruffle.",
    image: "/projects/die-ai/main-image.png?height=400&width=600",
    technologies: ["ActionScript", "Adobe Animate", "Ruffle"],
    category: "web" as const,
  },
]

const CATEGORIES = [
  { id: "all", name: "All Projects" },
  { id: "design", name: "UX/UI Design" },
  { id: "ar-vr", name: "AR/VR" },
  { id: "web", name: "Web Development" },
  { id: "research", name: "Research" },
]

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [initialLimit, setInitialLimit] = useState(PROJECTS_LIMIT_DESKTOP)
  const [showAll, setShowAll] = useState(false)
  const [query, setQuery] = useState("")
  const [adaptiveEnabled, setAdaptiveEnabled] = useState(false)
  const [adaptiveSummary, setAdaptiveSummary] = useState("")
  const [display, setDisplay] = useState<Project[]>([])
  const skipFilterEffect = useRef(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`)

    const updateLimit = () => {
      setInitialLimit(mediaQuery.matches ? PROJECTS_LIMIT_MOBILE : PROJECTS_LIMIT_DESKTOP)
    }

    updateLimit()
    mediaQuery.addEventListener("change", updateLimit)

    return () => {
      mediaQuery.removeEventListener("change", updateLimit)
    }
  }, [])

  const filteredProjects = useMemo(
    () =>
      activeFilter === "all"
        ? PROJECTS
        : PROJECTS.filter((project) => project.category === activeFilter),
    [activeFilter]
  )

  useEffect(() => {
    if (skipFilterEffect.current) {
      skipFilterEffect.current = false
      return
    }
    setDisplay(filteredProjects)
    setQuery("")
    setAdaptiveEnabled(false)
    setAdaptiveSummary("")
    setShowAll(false)
  }, [activeFilter, filteredProjects])

  const handleAdaptiveFocus = (value?: string) => {
    const input = (value ?? query).trim()
    if (activeFilter !== "all") {
      skipFilterEffect.current = true
      setActiveFilter("all")
    }

    if (!input) {
      setQuery("")
      setDisplay(PROJECTS)
      setAdaptiveEnabled(false)
      setAdaptiveSummary("")
      setShowAll(false)
      return
    }

    const result = runAdaptiveFocus(input, PROJECTS)
    setQuery(input)
    setDisplay(result.ranked.map((entry) => entry.project))
    setAdaptiveEnabled(true)
    setAdaptiveSummary(result.summary)
    setShowAll(false)
  }

  const handleReset = () => {
    setQuery("")
    setDisplay(filteredProjects)
    setAdaptiveEnabled(false)
    setAdaptiveSummary("")
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
          <p className="mb-2">
            <span className="text-primary">$</span> Displaying projects directory. Select category to filter results.
          </p>
          <p className="text-xs text-muted-foreground">Adaptive Focus is now available for natural-language personalization.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
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
            handleAdaptiveFocus()
          }}
        >
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe what you want to evaluate (e.g. hiring for AI design engineer)"
            className="flex-1"
          />
          <Button type="submit">Adaptive Focus</Button>
          {adaptiveEnabled && (
            <Button type="button" variant="secondary" onClick={handleReset}>
              Reset
            </Button>
          )}
        </form>

        <div className="flex flex-wrap gap-2">
          {ADAPTIVE_FOCUS_EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => handleAdaptiveFocus(example)}
              className="px-3 py-1.5 text-xs rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>

        {adaptiveEnabled && (
          <div className="rounded-md border border-primary/30 bg-primary/5 px-4 py-3">
            <p className="text-sm text-foreground">{adaptiveSummary}</p>
          </div>
        )}

        {adaptiveEnabled ? (
          <h2 className="text-xl font-bold">Adaptive Focus for “{query.trim()}”</h2>
        ) : (
          <h2 className="text-xl font-bold">{CATEGORIES.find((c) => c.id === activeFilter)?.name}</h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {display.slice(0, showAll ? display.length : initialLimit).map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              image={project.image}
              technologies={project.technologies}
              category={project.category}
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
