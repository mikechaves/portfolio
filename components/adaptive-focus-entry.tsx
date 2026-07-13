"use client"

import { useId, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  AudioLines,
  Boxes,
  Braces,
  CircuitBoard,
  LoaderCircle,
  Workflow,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ADAPTIVE_FOCUS_PRESETS, runAdaptiveFocus } from "@/features/adaptive-focus"
import {
  ADAPTIVE_FOCUS_INPUT_MAX_LENGTH,
  encodeAdaptiveFocusBriefHandoff,
} from "@/features/adaptive-focus/handoff"
import { useAdaptiveFocusHandoff } from "@/features/adaptive-focus/handoff-context"
import { trackPortfolioEvent } from "@/lib/portfolio-analytics"

export function AdaptiveFocusEntry() {
  const router = useRouter()
  const inputId = useId()
  const { preparePendingInput } = useAdaptiveFocusHandoff()
  const [input, setInput] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const lensIcons = [CircuitBoard, Boxes, Workflow, Braces, AudioLines]

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setIsLoading(true)
    trackPortfolioEvent("adaptive_focus_started", {
      entry_point: "home",
      mode: "custom",
    })
    try {
      preparePendingInput(input)
      const result = await runAdaptiveFocus({ mode: "custom", input: input.trim() })
      trackPortfolioEvent("adaptive_focus_completed", {
        entry_point: "home",
        mode: "custom",
        analysis_source: result.analysisSource,
        clarification_needed: result.interpretation.clarificationNeeded,
        requirement_count: result.interpretation.requirements.length,
        primary_project_count: result.groups.primary.length,
      })
      const briefToken = encodeAdaptiveFocusBriefHandoff(result)
      router.push(`/projects?focusBrief=${briefToken}&focusSession=1`)
    } catch {
      trackPortfolioEvent("adaptive_focus_failed", {
        entry_point: "home",
        mode: "custom",
      })
      setError(
        "Adaptive Focus could not prepare this brief. Try again or open Projects and use a preset lens."
      )
      setIsLoading(false)
    }
  }

  return (
    <div className="signal-command-deck border border-primary/35 bg-black/90">
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b border-primary/25 px-3.5 py-2">
        <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Adaptive Focus</h2>
        <p className="text-[0.66rem] text-zinc-500">Define role. Activate lenses. Inspect evidence.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid divide-y divide-white/10 lg:grid-cols-[minmax(16rem,0.9fr)_minmax(0,1.8fr)_minmax(13rem,0.62fr)] lg:divide-x lg:divide-y-0">
          <div className="p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor={inputId} className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-primary">
                Role input
              </label>
              <span className="text-[0.58rem] text-zinc-600">
                {input.length.toLocaleString()} / {ADAPTIVE_FOCUS_INPUT_MAX_LENGTH.toLocaleString()}
              </span>
            </div>
            <div className="flex items-start gap-2 border-t border-primary/30 pt-2">
              <span className="mt-2 text-sm text-primary" aria-hidden="true">&gt;</span>
              <Textarea
                id={inputId}
                value={input}
                maxLength={ADAPTIVE_FOCUS_INPUT_MAX_LENGTH}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Senior AI/UX engineer building human-in-the-loop systems..."
                aria-describedby={`${inputId}-privacy`}
                className="min-h-12 resize-none border-0 bg-transparent px-0 py-2 text-xs italic shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <div className="p-3">
            <p className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-primary">Select a lens</p>
            <div className="grid gap-px bg-white/10 sm:grid-cols-2 xl:grid-cols-5">
              {ADAPTIVE_FOCUS_PRESETS.map((preset, index) => {
                const LensIcon = lensIcons[index] ?? CircuitBoard
                return (
                  <button
                    key={preset.id}
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                      trackPortfolioEvent("adaptive_focus_started", {
                        entry_point: "home",
                        mode: "preset",
                      })
                      router.push(`/projects?focusPreset=${preset.id}`)
                    }}
                    className="group min-h-16 bg-black px-3 py-2 text-left transition-colors hover:bg-primary/[0.07] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="flex items-center gap-2 text-xs font-semibold text-zinc-200 group-hover:text-primary">
                      <LensIcon size={15} aria-hidden="true" /> {preset.label}
                    </span>
                    <span className="mt-1.5 line-clamp-2 block text-[0.62rem] leading-4 text-zinc-500 xl:hidden 2xl:block">
                      {preset.description}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-2 p-3">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-primary">Action</p>
            <Button type="submit" disabled={!input.trim() || isLoading} className="h-10 w-full rounded-none text-xs uppercase tracking-[0.08em]">
              {isLoading ? <LoaderCircle className="animate-spin" size={16} aria-hidden="true" /> : null}
              {isLoading ? "Mapping evidence..." : "Build Role Fit Brief"}
              {!isLoading ? <ArrowRight size={16} aria-hidden="true" /> : null}
            </Button>
            <Link href="/projects" className="inline-flex min-h-9 items-center justify-center border border-white/15 text-[0.65rem] text-zinc-400 transition-colors hover:border-primary/40 hover:text-primary">
              Inspect Proof
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 px-3.5 py-1.5">
          <p id={`${inputId}-privacy`} className="line-clamp-1 text-[0.56rem] leading-4 text-zinc-600 sm:line-clamp-none">
            Custom role text is processed through the OpenAI API and is not stored by this website. Avoid confidential or personally identifying information. Preset lenses do not make a model request.
          </p>
          {error ? <p role="alert" className="mt-1 text-xs text-destructive">{error}</p> : null}
        </div>
      </form>
    </div>
  )
}
