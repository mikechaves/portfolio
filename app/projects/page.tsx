"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ADAPTIVE_FOCUS_EXAMPLES, runAdaptiveFocus } from "@/features/adaptive-focus"
import { PROJECTS } from "@/data/projects"
import type { Project } from "@/types/project"

const MOBILE_BREAKPOINT_PX = 767
const PROJECTS_LIMIT_MOBILE = 3
const PROJECTS_LIMIT_DESKTOP = 6

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
  const didHydrateFocusRef = useRef(false)

  const handleAdaptiveFocus = useCallback((value?: string) => {
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

    const result = runAdaptiveFocus({ query: input, projects: PROJECTS })
    setQuery(input)
    setDisplay(result.ranked.map((entry) => entry.project))
    setAdaptiveEnabled(true)
    setAdaptiveSummary(result.summary)
    setShowAll(false)
  }, [activeFilter, query])


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
    if (didHydrateFocusRef.current) return
    if (typeof window === "undefined") return
    const focus = new URLSearchParams(window.location.search).get("focus")
    if (!focus) return
    didHydrateFocusRef.current = true
    setQuery(focus)
    handleAdaptiveFocus(focus)
  }, [handleAdaptiveFocus])

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
