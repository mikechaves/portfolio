"use client"

import { useId, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ADAPTIVE_FOCUS_PRESETS, runAdaptiveFocus } from "@/features/adaptive-focus"
import {
  ADAPTIVE_FOCUS_INPUT_MAX_LENGTH,
  encodeAdaptiveFocusBriefHandoff,
} from "@/features/adaptive-focus/handoff"
import { useAdaptiveFocusHandoff } from "@/features/adaptive-focus/handoff-context"

export function AdaptiveFocusEntry() {
  const router = useRouter()
  const inputId = useId()
  const { preparePendingInput } = useAdaptiveFocusHandoff()
  const [input, setInput] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      preparePendingInput(input)
      const result = await runAdaptiveFocus({ mode: "custom", input: input.trim() })
      const briefToken = encodeAdaptiveFocusBriefHandoff(result)
      router.push(`/projects?focusBrief=${briefToken}&focusSession=1`)
    } catch {
      setError(
        "Adaptive Focus could not prepare this brief. Try again or open Projects and use a preset lens."
      )
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">Adaptive Focus</h2>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Build a Role Fit Brief that maps role requirements to reviewed portfolio evidence.
        </p>
      </div>

      <div className="grid gap-px overflow-hidden rounded-md border border-primary/20 bg-primary/20 sm:grid-cols-2 lg:grid-cols-5">
        {ADAPTIVE_FOCUS_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => router.push(`/projects?focusPreset=${preset.id}`)}
            className="min-h-24 bg-background/95 p-3 text-left transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
          >
            <span className="block text-sm font-semibold text-foreground">{preset.label}</span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
              {preset.description}
            </span>
          </button>
        ))}
      </div>

      <form className="space-y-3 border-t border-primary/20 pt-4" onSubmit={handleSubmit}>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <label htmlFor={inputId} className="text-sm font-medium">
            Paste a role or job description
          </label>
          <span className="text-xs text-muted-foreground">
            {input.length.toLocaleString()} / {ADAPTIVE_FOCUS_INPUT_MAX_LENGTH.toLocaleString()}
          </span>
        </div>
        <Textarea
          id={inputId}
          value={input}
          maxLength={ADAPTIVE_FOCUS_INPUT_MAX_LENGTH}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Senior design engineer building AI-assisted creative workflows and internal tools..."
          className="min-h-28 resize-y bg-black/25"
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl text-xs leading-5 text-muted-foreground">
            Custom role text is processed through the OpenAI API to identify role requirements. It is not stored by this website. Avoid submitting confidential or personally identifying information.
          </p>
          <Button type="submit" disabled={!input.trim() || isLoading} className="shrink-0">
            {isLoading ? <LoaderCircle className="animate-spin" size={16} aria-hidden="true" /> : null}
            {isLoading ? "Mapping evidence..." : "Build Role Fit Brief"}
            {!isLoading ? <ArrowRight size={16} aria-hidden="true" /> : null}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          GPT interprets custom role text. Reviewed portfolio evidence determines every match and explanation. Preset lenses do not make a model request.
        </p>
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </form>
    </div>
  )
}
