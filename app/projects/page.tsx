"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ADAPTIVE_FOCUS_EXAMPLES, runAdaptiveFocus } from "@/features/adaptive-focus"
import { PROJECTS } from "@/data/projects"
import type { Project } from "@/types/project"

const MOBILE_BREAKPOINT_PX = 767
const PROJECTS_LIMIT_MOBILE = 4
const PROJECTS_LIMIT_DESKTOP = 9

const CATEGORIES = [
  { id: "all", name: "All Work" },
  { id: "development", name: "AI / Systems" },
  { id: "ar-vr", name: "Spatial" },
  { id: "web", name: "Web" },
  { id: "design", name: "Product Design" },
  { id: "research", name: "Research" },
]

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [initialLimit, setInitialLimit] = useState(PROJECTS_LIMIT_DESKTOP)
  const [showAll, setShowAll] = useState(false)
  const [query, setQuery] = useState("")
  const [adaptiveEnabled, setAdaptiveEnabled] = useState(false)
  const [adaptiveSummary, setAdaptiveSummary] = useState("")
  const [display, setDisplay] = useState<Project[]>(PROJECTS)
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
    const updateLimit = () => setInitialLimit(mediaQuery.matches ? PROJECTS_LIMIT_MOBILE : PROJECTS_LIMIT_DESKTOP)
    updateLimit()
    mediaQuery.addEventListener("change", updateLimit)
    return () => mediaQuery.removeEventListener("change", updateLimit)
  }, [])

  const filteredProjects = useMemo(
    () =>
      activeFilter === "all"
        ? PROJECTS
        : PROJECTS.filter((project) => project.category === activeFilter),
    [activeFilter],
  )

  useEffect(() => {
    if (didHydrateFocusRef.current) return
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
    <div className="industrial-page industrial-page-wide">
      <p className="industrial-page-kicker">Work Index</p>
      <h1 className="industrial-page-title">Selected Work</h1>
      <p className="industrial-page-intro">
        Case studies across AI systems, spatial interfaces, product design, and production execution.
      </p>

      <div className="industrial-rule" />

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveFilter(category.id)}
            className={`industrial-button ${activeFilter === category.id ? "industrial-button-primary" : "industrial-button-ghost"}`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <form
        className="mt-8 grid gap-3 md:grid-cols-[1fr_auto_auto]"
        onSubmit={(e) => {
          e.preventDefault()
          handleAdaptiveFocus()
        }}
      >
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe what you want to evaluate"
          className="border-[#e8e1d2]/20 bg-black/50"
        />
        <Button type="submit">Adaptive Focus</Button>
        {adaptiveEnabled && (
          <Button type="button" variant="secondary" onClick={handleReset}>
            Reset
          </Button>
        )}
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {ADAPTIVE_FOCUS_EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => handleAdaptiveFocus(example)}
            className="border border-[#e8e1d2]/15 px-3 py-1.5 text-left text-xs uppercase tracking-[0.12em] text-[#b9b0a2] transition-colors hover:border-[#b51218]/70 hover:text-[#eee7d8]"
          >
            {example}
          </button>
        ))}
      </div>

      {adaptiveEnabled && (
        <div className="industrial-card mt-6">
          <p>{adaptiveSummary}</p>
        </div>
      )}

      <div className="industrial-grid">
        {display.slice(0, showAll ? display.length : initialLimit).map((project, index) => (
          <ProjectCard key={project.id} {...project} priority={index < 3} />
        ))}
      </div>

      {!showAll && display.length > initialLimit && (
        <div className="mt-10 flex justify-center">
          <button className="industrial-button industrial-button-ghost" onClick={() => setShowAll(true)}>
            Show More Work
          </button>
        </div>
      )}
    </div>
  )
}
