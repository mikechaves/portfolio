"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getProjectsForCategory, PROJECT_CATEGORIES } from "@/data/project-categories"
import { PROJECTS } from "@/data/projects"
import { ADAPTIVE_FOCUS_PRESETS } from "@/features/adaptive-focus/config/presets"
import { isPublicProjectEvidenceEntity } from "@/features/adaptive-focus/evidence/entities"
import type {
  AdaptiveCapability,
  AdaptiveFocusRequest,
  AdaptiveFocusV2Result,
} from "@/features/adaptive-focus/types"
import {
  ADAPTIVE_FOCUS_INPUT_MAX_LENGTH,
  consumePendingAdaptiveFocusInput,
  decodeAdaptiveFocusBriefHandoff,
  resolveAdaptiveFocusInitialization,
} from "@/features/adaptive-focus/handoff"
import {
  trackPortfolioEvent,
  type AdaptiveFocusEntryPoint,
  type ProjectMatchLevel,
} from "@/lib/portfolio-analytics"
import type { Project } from "@/types/project"
import { CAPABILITY_LABELS } from "@/packages/adaptive-focus-core/src"


const RoleFitBrief = dynamic(
  () => import("@/components/role-fit-brief").then((module) => module.RoleFitBrief),
  { ssr: false }
)

const MOBILE_BREAKPOINT_PX = 767
const PROJECTS_LIMIT_MOBILE = 3
const PROJECTS_LIMIT_DESKTOP = 6

function projectsForBrief(brief: AdaptiveFocusV2Result): Project[] {
  const rankedIds = [
    ...brief.groups.primary,
    ...brief.groups.supporting,
    ...brief.groups.adjacent,
  ].map((match) => match.entityId)
  const orderedIds = [...new Set(rankedIds)]
  const projectsById = new Map(PROJECTS.map((project) => [project.id, project]))
  return [
    ...orderedIds.map((id) => projectsById.get(id)).filter((project): project is Project => Boolean(project)),
    ...PROJECTS.filter((project) => !orderedIds.includes(project.id)),
  ]
}

export function ProjectsPageClient() {
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState("all")
  const [initialLimit, setInitialLimit] = useState(PROJECTS_LIMIT_MOBILE)
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

  const activeCategoryName = useMemo(
    () => PROJECT_CATEGORIES.find((category) => category.id === activeFilter)?.name ?? "Projects",
    [activeFilter]
  )

  const categoryCounts = useMemo(
    () => new Map(
      PROJECT_CATEGORIES.map((category) => [
        category.id,
        getProjectsForCategory(category.id).length,
      ])
    ),
    []
  )

  const visibleProjects = display.slice(0, showAll ? display.length : initialLimit)
  const briefMatchLevels = useMemo(() => {
    const levels = new Map<string, ProjectMatchLevel>()
    if (!brief) return levels
    for (const group of [brief.groups.primary, brief.groups.supporting, brief.groups.adjacent]) {
      for (const match of group) {
        if (isPublicProjectEvidenceEntity(match.entityId)) {
          levels.set(match.entityId, match.level)
        }
      }
    }
    return levels
  }, [brief])

  const applyBrief = useCallback((result: AdaptiveFocusV2Result) => {
    setBrief(result)
    setDisplay(result.interpretation.clarificationNeeded ? PROJECTS : projectsForBrief(result))
    setShowAll(false)
    setActiveFilter("all")
  }, [])

  const executeRequest = useCallback(
    async (
      request: AdaptiveFocusRequest,
      entryPoint: AdaptiveFocusEntryPoint = "projects"
    ) => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      setActivePreset(request.mode === "preset" ? request.presetId : null)
      setRequestState("loading")
      setStatusMessage("Mapping role requirements to reviewed portfolio evidence...")

      const analyticsMode = request.mode === "interpretation" ? null : request.mode
      if (analyticsMode && entryPoint === "projects") {
        trackPortfolioEvent("adaptive_focus_started", {
          entry_point: entryPoint,
          mode: analyticsMode,
        })
      }

      if (request.mode === "custom") setQuery(request.input)
      if (request.mode === "preset") {
        const preset = ADAPTIVE_FOCUS_PRESETS.find((item) => item.id === request.presetId)
        if (preset) setQuery(preset.label)
      }

      try {
        const { runAdaptiveFocus } = await import("@/features/adaptive-focus/runtime")
        const result = await runAdaptiveFocus(request, { signal: controller.signal })
        if (controller.signal.aborted) return
        if (analyticsMode) {
          trackPortfolioEvent("adaptive_focus_completed", {
            entry_point: entryPoint,
            mode: analyticsMode,
            analysis_source: result.analysisSource,
            clarification_needed: result.interpretation.clarificationNeeded,
            requirement_count: result.interpretation.requirements.length,
            primary_project_count: result.groups.primary.filter((match) =>
              isPublicProjectEvidenceEntity(match.entityId)
            ).length,
          })
        }
        applyBrief(result)
        setRequestState("idle")
        setStatusMessage(
          result.interpretation.clarificationNeeded
            ? "Adaptive Focus needs more role context."
            : result.analysisSource === "local-fallback"
              ? "Advanced role analysis was unavailable. A local evidence match is ready."
              : "Role Fit Brief complete."
        )
      } catch (error) {
        if (controller.signal.aborted || (error instanceof DOMException && error.name === "AbortError")) return
        if (analyticsMode) {
          trackPortfolioEvent("adaptive_focus_failed", {
            entry_point: entryPoint,
            mode: analyticsMode,
          })
        }
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
      const pendingInput =
        params.get("focusSession") === "1"
          ? consumePendingAdaptiveFocusInput(window.sessionStorage)
          : null
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
        void executeRequest(request, "handoff")
      } else if (params.get("focusSession") === "1") {
        setRequestState("error")
        setStatusMessage("The temporary role request expired. Paste the role text again to continue.")
      }
    } catch {
      setRequestState("error")
      setStatusMessage("This browser could not read the temporary Adaptive Focus request.")
    }
  }, [executeRequest])

  useEffect(() => () => abortRef.current?.abort(), [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const input = query.trim()
    if (!input) return
    void executeRequest({ mode: "custom", input })
  }

  const handleCategoryChange = (category: string) => {
    setActivePreset(null)
    abortRef.current?.abort()
    setActiveFilter(category)
    setDisplay(getProjectsForCategory(category))
    setBrief(null)
    setQuery("")
    setShowAll(false)
    setRequestState("idle")
    setStatusMessage("")
  }

  const handleReset = () => {
    setActivePreset(null)
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

  const handleRemoveCapability = async (capability: AdaptiveCapability) => {
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
    const { rebuildAdaptiveFocusBrief } = await import("@/features/adaptive-focus/runtime")
    applyBrief(rebuildAdaptiveFocusBrief(interpretation, brief.analysisSource))
    setStatusMessage("Role Fit Brief updated from the edited interpretation.")
  }

  return (
    <div className="space-y-6">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {statusMessage}
      </p>

      <details className="archive-focus-deck" open={Boolean(brief) || requestState === "loading"}>
        <summary className="archive-focus-heading">
          <div>
            <p className="project-index-eyebrow">For the inquirer</p>
            <h2 id="adaptive-focus-controls-heading">Adaptive Focus</h2>
          </div>
          <p>Explore by role or interest <span aria-hidden="true">＋</span></p>
        </summary>

        <div className="archive-focus-presets" aria-label="Preset role lenses">
          {ADAPTIVE_FOCUS_PRESETS.map((preset, index) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => void executeRequest({ mode: "preset", presetId: preset.id })}
              disabled={requestState === "loading"}
              className="archive-focus-preset"
              aria-pressed={activePreset === preset.id}
            >
              <span aria-hidden="true">{(index + 1).toString().padStart(2, "0")}</span>
              <strong>{preset.label}</strong>
              <span aria-hidden="true">→</span>
            </button>
          ))}
        </div>

        <details className="archive-custom-role"><summary>Have a specific role in mind?</summary>
        <form className="archive-focus-form" onSubmit={handleSubmit}>
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
            placeholder="Paste a role or job description"
            className="min-h-24 resize-y rounded-none border-white/15 bg-black/45 focus-visible:ring-primary"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-3xl text-xs leading-5 text-muted-foreground">
              Custom role text is processed through the OpenAI API to identify requirements and is not stored by this website. Avoid submitting confidential or personally identifying information.
            </p>
            <div className="flex shrink-0 gap-2">
              <Button type="submit" disabled={!query.trim() || requestState === "loading"}>
                {requestState === "loading" ? (
                  <span className="h-4 w-4 animate-spin rounded-full border border-current border-r-transparent" aria-hidden="true" />
                ) : null}
                {requestState === "loading" ? "Mapping evidence..." : "Analyze role"}
              </Button>
            </div>
          </div>
        </form>
        </details>

        {requestState === "error" ? (
          <p role="alert" className="border-l-2 border-destructive pl-3 text-sm text-destructive">
            {statusMessage}
          </p>
        ) : null}
      </details>

      {brief ? (
        <RoleFitBrief
          brief={brief}
          headingRef={briefHeadingRef}
          onRemoveCapability={handleRemoveCapability}
          onEdit={() => { const details = inputRef.current?.closest("details"); if (details) details.open = true; inputRef.current?.focus() }}
          onReset={handleReset}
        />
      ) : null}


      <section className="project-archive-section" aria-labelledby="project-archive-heading">
        <div className="project-archive-heading">
          <div>
            <p className="project-index-eyebrow">The collection</p>
            <h2 id="project-archive-heading">
              {brief ? "Projects for this focus" : activeCategoryName}
            </h2>
          </div>
          <p aria-live="polite">
            Showing {visibleProjects.length.toString().padStart(2, "0")} of {display.length.toString().padStart(2, "0")}
          </p>
        </div>

        <div className="project-category-index" aria-label="Project categories">
          {PROJECT_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryChange(category.id)}
              aria-pressed={!brief && activeFilter === category.id}
              className={`project-category-control ${
                !brief && activeFilter === category.id
                  ? "project-category-control-active"
                  : ""
              }`}
            >
              <span>{category.name}</span>
              <strong>{(categoryCounts.get(category.id) ?? 0).toString().padStart(2, "0")}</strong>
            </button>
          ))}
        </div>

        <div className="project-archive-grid">
          {visibleProjects.map((project, index) => (
            <div key={project.id} className="project-archive-record">
              <ProjectCard
                priority={!brief && index === 0}
                id={project.id}
                title={project.title}
                description={project.description}
                image={project.image}
                technologies={project.technologies}
                category={project.category}
                thumbnailFocalPoint={project.thumbnailFocalPoint}
                analyticsContext={brief ? "role_fit_archive" : "project_archive"}
                analyticsMatchLevel={briefMatchLevels.get(project.id) ?? "unranked"}
              />
            </div>
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
