"use client"

import { useCallback, useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react"
import { LoaderCircle } from "lucide-react"
import { NeonSeparator } from "@/components/neon-separator"
import { ProjectCard } from "@/components/project-card"
import { RoleFitBrief } from "@/components/role-fit-brief"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PROJECTS } from "@/data/projects"
import {
  ADAPTIVE_FOCUS_PRESETS,
  AI_PROJECT_IDS,
  CAPABILITY_LABELS,
  rebuildAdaptiveFocusBrief,
  runAdaptiveFocus,
  type AdaptiveCapability,
  type AdaptiveFocusRequest,
  type AdaptiveFocusV2Result,
} from "@/features/adaptive-focus"
import {
  ADAPTIVE_FOCUS_INPUT_MAX_LENGTH,
  decodeAdaptiveFocusBriefHandoff,
  resolveAdaptiveFocusInitialization,
} from "@/features/adaptive-focus/handoff"
import { useAdaptiveFocusHandoff } from "@/features/adaptive-focus/handoff-context"
import type { Project } from "@/types/project"

const MOBILE_BREAKPOINT_PX = 767
const PROJECTS_LIMIT_MOBILE = 3
const PROJECTS_LIMIT_DESKTOP = 6

const CATEGORIES = [
  { id: "all", name: "All Projects" },
  { id: "ai", name: "AI" },
  { id: "design", name: "UX/UI Design" },
  { id: "ar-vr", name: "XR & Spatial" },
  { id: "web", name: "Web Development" },
  { id: "research", name: "Research" },
]

function projectsForCategory(category: string): Project[] {
  if (category === "all") return PROJECTS
  if (category === "ai") return PROJECTS.filter((project) => AI_PROJECT_IDS.has(project.id))
  return PROJECTS.filter((project) => project.category === category)
}

function projectsForBrief(brief: AdaptiveFocusV2Result): Project[] {
  const rankedIds = [
    ...brief.groups.primary,
    ...brief.groups.supporting,
    ...brief.groups.adjacent,
  ].map((match) => match.projectId)
  const orderedIds = [...new Set(rankedIds)]
  const projectsById = new Map(PROJECTS.map((project) => [project.id, project]))
  return [
    ...orderedIds.map((id) => projectsById.get(id)).filter((project): project is Project => Boolean(project)),
    ...PROJECTS.filter((project) => !orderedIds.includes(project.id)),
  ]
}

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [initialLimit, setInitialLimit] = useState(PROJECTS_LIMIT_DESKTOP)
  const [showAll, setShowAll] = useState(false)
  const [query, setQuery] = useState("")
  const [brief, setBrief] = useState<AdaptiveFocusV2Result | null>(null)
  const [display, setDisplay] = useState<Project[]>(PROJECTS)
  const [requestState, setRequestState] = useState<"idle" | "loading" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")
  const didInitialize = useRef(false)
  const abortRef = useRef<AbortController | null>(null)
  const briefHeadingRef = useRef<HTMLHeadingElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const inputId = useId()
  const { consumePendingInput } = useAdaptiveFocusHandoff()

  const activeCategoryName = useMemo(
    () => CATEGORIES.find((category) => category.id === activeFilter)?.name ?? "Projects",
    [activeFilter]
  )

  const applyBrief = useCallback((result: AdaptiveFocusV2Result) => {
    setBrief(result)
    setDisplay(result.interpretation.clarificationNeeded ? PROJECTS : projectsForBrief(result))
    setShowAll(false)
    setActiveFilter("all")
  }, [])

  const executeRequest = useCallback(
    async (request: AdaptiveFocusRequest, moveFocus = true) => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      setRequestState("loading")
      setStatusMessage("Mapping role requirements to reviewed portfolio evidence...")

      if (request.mode === "custom") setQuery(request.input)
      if (request.mode === "preset") {
        const preset = ADAPTIVE_FOCUS_PRESETS.find((item) => item.id === request.presetId)
        if (preset) setQuery(preset.label)
      }

      try {
        const result = await runAdaptiveFocus(request, { signal: controller.signal })
        if (controller.signal.aborted) return
        applyBrief(result)
        setRequestState("idle")
        setStatusMessage(
          result.interpretation.clarificationNeeded
            ? "Adaptive Focus needs more role context."
            : result.analysisSource === "local-fallback"
              ? "Advanced role analysis was unavailable. A local evidence match is ready."
              : "Role Fit Brief complete."
        )
        if (moveFocus) {
          window.requestAnimationFrame(() => briefHeadingRef.current?.focus())
        }
      } catch (error) {
        if (controller.signal.aborted || (error instanceof DOMException && error.name === "AbortError")) return
        setRequestState("error")
        setStatusMessage("Adaptive Focus could not complete this request. Try again or use a preset lens.")
      }
    },
    [applyBrief]
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`)
    const updateLimit = () => {
      setInitialLimit(mediaQuery.matches ? PROJECTS_LIMIT_MOBILE : PROJECTS_LIMIT_DESKTOP)
    }
    updateLimit()
    mediaQuery.addEventListener("change", updateLimit)
    return () => mediaQuery.removeEventListener("change", updateLimit)
  }, [])

  useEffect(() => {
    if (didInitialize.current) return
    didInitialize.current = true
    try {
      const params = new URLSearchParams(window.location.search)
      const pendingInput = params.get("focusSession") === "1" ? consumePendingInput() : null
      if (pendingInput) setQuery(pendingInput)
      const briefHandoff = params.get("focusBrief")
        ? decodeAdaptiveFocusBriefHandoff(params.get("focusBrief") ?? "")
        : null
      if (!pendingInput && briefHandoff) {
        setQuery(
          briefHandoff.interpretation.requirements
            .map((requirement) => CAPABILITY_LABELS[requirement.capability])
            .join(", ")
        )
      }
      const request = briefHandoff
        ? ({
            mode: "interpretation",
            interpretation: briefHandoff.interpretation,
            analysisSource: briefHandoff.analysisSource,
          } as const)
        : pendingInput
          ? ({ mode: "custom", input: pendingInput } as const)
          : resolveAdaptiveFocusInitialization(window.location.search, window.sessionStorage)
      if (request) {
        void executeRequest(request)
      } else if (params.get("focusSession") === "1") {
        setRequestState("error")
        setStatusMessage("The temporary role request expired. Paste the role text again to continue.")
      }
    } catch {
      setRequestState("error")
      setStatusMessage("This browser could not read the temporary Adaptive Focus request.")
    }
  }, [consumePendingInput, executeRequest])

  useEffect(() => () => abortRef.current?.abort(), [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const input = query.trim()
    if (!input) return
    void executeRequest({ mode: "custom", input })
  }

  const handleCategoryChange = (category: string) => {
    abortRef.current?.abort()
    setActiveFilter(category)
    setDisplay(projectsForCategory(category))
    setBrief(null)
    setQuery("")
    setShowAll(false)
    setRequestState("idle")
    setStatusMessage("")
  }

  const handleReset = () => {
    abortRef.current?.abort()
    setActiveFilter("all")
    setDisplay(PROJECTS)
    setBrief(null)
    setQuery("")
    setShowAll(false)
    setRequestState("idle")
    setStatusMessage("Adaptive Focus reset. Showing the full project archive.")
    window.history.replaceState({}, "", "/projects")
  }

  const handleRemoveCapability = (capability: AdaptiveCapability) => {
    if (!brief) return
    const requirements = brief.interpretation.requirements.filter(
      (requirement) => requirement.capability !== capability
    )
    const interpretation = {
      ...brief.interpretation,
      requirements,
      clarificationNeeded: requirements.length === 0,
      clarificationQuestion:
        requirements.length === 0
          ? "Add a role, capability, or workflow so Adaptive Focus can build a grounded brief."
          : null,
      confidence: requirements.length === 0 ? 0 : brief.interpretation.confidence,
    }
    applyBrief(rebuildAdaptiveFocusBrief(interpretation, brief.analysisSource))
    setStatusMessage("Role Fit Brief updated from the edited interpretation.")
  }

  return (
    <div className="space-y-8 pt-8">
      <h1 className="sr-only">Projects</h1>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {statusMessage}
      </p>

      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-button terminal-button-red"></div>
          <div className="terminal-button terminal-button-yellow"></div>
          <div className="terminal-button terminal-button-green"></div>
          <div className="terminal-title">projects.sh</div>
        </div>
        <div className="terminal-content">
          <p className="mb-2">
            <span className="text-primary">$</span> open proof_layer
          </p>
          <p className="text-sm text-muted-foreground">
            These projects are the evidence layer for AI-native product systems, human-in-the-loop workflows, and operational tools that make complex work usable.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Use a preset lens or analyze custom role text to build an evidence-grounded Role Fit Brief.
          </p>
        </div>
      </div>

      <NeonSeparator intensity="medium" />

      <section className="space-y-5" aria-labelledby="adaptive-focus-controls-heading">
        <div>
          <p className="text-xs font-semibold uppercase text-primary">Adaptive Focus</p>
          <h2 id="adaptive-focus-controls-heading" className="mt-1 text-xl font-bold">Build a Role Fit Brief</h2>
        </div>

        <div className="flex flex-wrap gap-2" aria-label="Preset role lenses">
          {ADAPTIVE_FOCUS_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => void executeRequest({ mode: "preset", presetId: preset.id })}
              disabled={requestState === "loading"}
              className="rounded-md border border-primary/25 px-3 py-2 text-left text-sm transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-wait disabled:opacity-60"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <label htmlFor={inputId} className="text-sm font-medium">Role, responsibilities, or job description</label>
            <span className="text-xs text-muted-foreground">
              {query.length.toLocaleString()} / {ADAPTIVE_FOCUS_INPUT_MAX_LENGTH.toLocaleString()}
            </span>
          </div>
          <Textarea
            ref={inputRef}
            id={inputId}
            value={query}
            maxLength={ADAPTIVE_FOCUS_INPUT_MAX_LENGTH}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Senior design engineer building AI-assisted creative workflows and internal tools..."
            className="min-h-28 resize-y bg-black/20"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-3xl text-xs leading-5 text-muted-foreground">
              Custom role text is processed through the OpenAI API to identify requirements and is not stored by this website. Avoid submitting confidential or personally identifying information.
            </p>
            <div className="flex shrink-0 gap-2">
              <Button type="submit" disabled={!query.trim() || requestState === "loading"}>
                {requestState === "loading" ? (
                  <LoaderCircle className="animate-spin" size={16} aria-hidden="true" />
                ) : null}
                {requestState === "loading" ? "Mapping evidence..." : "Build Role Fit Brief"}
              </Button>
            </div>
          </div>
        </form>

        {requestState === "error" ? (
          <p role="alert" className="border-l-2 border-destructive pl-3 text-sm text-destructive">
            {statusMessage}
          </p>
        ) : null}
      </section>

      {brief ? (
        <RoleFitBrief
          brief={brief}
          headingRef={briefHeadingRef}
          onRemoveCapability={handleRemoveCapability}
          onEdit={() => inputRef.current?.focus()}
          onReset={handleReset}
        />
      ) : null}

      <NeonSeparator intensity="low" />

      <section className="space-y-5" aria-labelledby="project-archive-heading">
        <div className="flex flex-wrap gap-2" aria-label="Project categories">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryChange(category.id)}
              aria-pressed={!brief && activeFilter === category.id}
              className={`rounded-md px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                !brief && activeFilter === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <h2 id="project-archive-heading" className="text-xl font-bold">
          {brief ? "Project archive in relevance order" : activeCategoryName}
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {display.slice(0, showAll ? display.length : initialLimit).map((project, index) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              image={project.image}
              technologies={project.technologies}
              category={project.category}
              priority={index === 0}
            />
          ))}
        </div>
        {!showAll && display.length > initialLimit ? (
          <div className="flex justify-center">
            <Button onClick={() => setShowAll(true)} variant="secondary">See More</Button>
          </div>
        ) : null}
      </section>
    </div>
  )
}
