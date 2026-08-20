"use client"

import { useState, type FormEvent, type SyntheticEvent } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ADAPTIVE_FOCUS_PRESETS } from "@/features/adaptive-focus/config/presets"
import {
  ADAPTIVE_FOCUS_INPUT_MAX_LENGTH,
  savePendingAdaptiveFocusInput,
} from "@/features/adaptive-focus/handoff"
import { trackPortfolioEvent } from "@/lib/portfolio-analytics"

const INPUT_ID = "adaptive-focus-role-input"
const PRIMARY_PRESET_PRESENTATION = [
  { id: "ai-product-systems", label: "AI product systems" },
  { id: "game-ux-creator-systems", label: "Game UX" },
  { id: "hitl-evaluation", label: "Human-in-loop" },
  { id: "design-engineering", label: "Product + design eng" },
] as const

const primaryPresetIds = new Set(PRIMARY_PRESET_PRESENTATION.map((preset) => preset.id))
const primaryPresets = PRIMARY_PRESET_PRESENTATION.map((presentation) => ({
  ...ADAPTIVE_FOCUS_PRESETS.find((preset) => preset.id === presentation.id)!,
  compactLabel: presentation.label,
}))
const secondaryPresets = ADAPTIVE_FOCUS_PRESETS.filter(
  (preset) => !primaryPresetIds.has(preset.id as (typeof PRIMARY_PRESET_PRESENTATION)[number]["id"])
)

export function AdaptiveFocusEntry() {
  const router = useRouter()
  const [input, setInput] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const showCharacterCount = input.length >= ADAPTIVE_FOCUS_INPUT_MAX_LENGTH * 0.8

  const openPreset = (presetId: string) => {
    trackPortfolioEvent("adaptive_focus_started", {
      entry_point: "home",
      mode: "preset",
    })
    router.push(`/projects?focusPreset=${presetId}`)
  }

  const handleMoreLensesToggle = (event: SyntheticEvent<HTMLDetailsElement>) => {
    if (!event.currentTarget.open) return
    trackPortfolioEvent("adaptive_focus_more_lenses_expanded", { entry_point: "home" })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setIsLoading(true)
    trackPortfolioEvent("adaptive_focus_started", {
      entry_point: "home",
      mode: "custom",
    })

    try {
      savePendingAdaptiveFocusInput(window.sessionStorage, input)
      const [runtime, entities, handoff] = await Promise.all([
        import("@/features/adaptive-focus/runtime"),
        import("@/features/adaptive-focus/evidence/entities"),
        import("@/features/adaptive-focus/handoff"),
      ])
      const result = await runtime.runAdaptiveFocus({ mode: "custom", input: input.trim() })
      trackPortfolioEvent("adaptive_focus_completed", {
        entry_point: "home",
        mode: "custom",
        analysis_source: result.analysisSource,
        clarification_needed: result.interpretation.clarificationNeeded,
        requirement_count: result.interpretation.requirements.length,
        primary_project_count: result.groups.primary.filter((match) =>
          entities.isPublicProjectEvidenceEntity(match.entityId)
        ).length,
      })
      const briefToken = handoff.encodeAdaptiveFocusBriefHandoff(result)
      router.push(`/projects?focusBrief=${briefToken}&focusSession=1`)
    } catch {
      trackPortfolioEvent("adaptive_focus_failed", {
        entry_point: "home",
        mode: "custom",
      })
      setError(
        "Adaptive Focus could not prepare this brief. Try again or choose a preset lens."
      )
      setIsLoading(false)
    }
  }

  return (
    <section
      id="adaptive-focus"
      className="home-focus-panel scroll-mt-24"
      aria-labelledby="adaptive-focus-title"
    >
      <div className="home-focus-heading">
        <div>
          <p className="home-section-kicker">Optional role lens</p>
          <h2 id="adaptive-focus-title">Adaptive Focus</h2>
        </div>
        <p>Paste a role or choose a lens to rank the same reviewed evidence.</p>
      </div>

      <form onSubmit={handleSubmit} className="home-focus-form">
        <div className="home-focus-input-row">
          <div className="home-focus-input-wrap">
            <label htmlFor={INPUT_ID} className="sr-only">
              Role or job description
            </label>
            <Textarea
              id={INPUT_ID}
              value={input}
              maxLength={ADAPTIVE_FOCUS_INPUT_MAX_LENGTH}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Paste a role or job description"
              aria-describedby={`${INPUT_ID}-privacy`}
              className="home-focus-input"
            />
            {showCharacterCount ? (
              <span className="home-focus-count" aria-live="polite">
                {input.length.toLocaleString()} / {ADAPTIVE_FOCUS_INPUT_MAX_LENGTH.toLocaleString()}
              </span>
            ) : null}
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="home-focus-submit"
          >
            {isLoading ? <LoaderCircle className="animate-spin" size={16} aria-hidden="true" /> : null}
            {isLoading ? "Mapping evidence" : "Analyze role"}
          </Button>
        </div>

        <div className="home-focus-presets" aria-label="Suggested role lenses">
          {primaryPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              disabled={isLoading}
              onClick={() => openPreset(preset.id)}
              className="home-focus-preset"
              aria-label={`${preset.label}: ${preset.description}`}
            >
              {preset.compactLabel}
            </button>
          ))}
        </div>

        <div className="home-focus-footer">
          <details className="home-focus-more" onToggle={handleMoreLensesToggle}>
            <summary>
              More lenses <ChevronDown size={15} aria-hidden="true" />
            </summary>
            <div className="home-focus-more-grid">
              {secondaryPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  disabled={isLoading}
                  onClick={() => openPreset(preset.id)}
                >
                  <strong>{preset.label}</strong>
                  <span>{preset.description}</span>
                </button>
              ))}
            </div>
          </details>

          <p id={`${INPUT_ID}-privacy`} className="home-focus-privacy">
            Custom role text is processed by OpenAI and not stored. Do not submit confidential
            information.
            <span className="home-focus-privacy-detail">
              {" "}Preset lenses stay local and do not call the model.
            </span>
          </p>
        </div>
        {error ? <p role="alert" className="home-focus-error">{error}</p> : null}
      </form>
    </section>
  )
}
