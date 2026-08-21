import { ChevronDown, LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ADAPTIVE_FOCUS_PRESETS } from "@/features/adaptive-focus/config/presets"
import { ADAPTIVE_FOCUS_INPUT_MAX_LENGTH } from "@/features/adaptive-focus/handoff"

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

      <form className="home-focus-form" data-adaptive-focus-form>
        <div className="home-focus-input-row">
          <div className="home-focus-input-wrap">
            <label htmlFor={INPUT_ID} className="sr-only">
              Role or job description
            </label>
            <Textarea
              id={INPUT_ID}
              name="role"
              maxLength={ADAPTIVE_FOCUS_INPUT_MAX_LENGTH}
              placeholder="Paste a role or job description"
              aria-describedby={`${INPUT_ID}-privacy`}
              className="home-focus-input"
              required
            />
            <span
              className="home-focus-count"
              aria-live="polite"
              data-adaptive-focus-count
              hidden
            />
          </div>
          <Button
            type="submit"
            disabled
            className="home-focus-submit"
            data-adaptive-focus-submit
          >
            <span data-adaptive-focus-loader hidden>
              <LoaderCircle className="animate-spin" size={16} aria-hidden="true" />
            </span>
            <span data-adaptive-focus-submit-label>Analyze role</span>
          </Button>
        </div>

        <div className="home-focus-presets" aria-label="Suggested role lenses">
          {primaryPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="home-focus-preset"
              aria-label={`${preset.label}: ${preset.description}`}
              data-adaptive-focus-preset={preset.id}
            >
              {preset.compactLabel}
            </button>
          ))}
        </div>

        <div className="home-focus-footer">
          <details className="home-focus-more" data-adaptive-focus-more>
            <summary>
              More lenses <ChevronDown size={15} aria-hidden="true" />
            </summary>
            <div className="home-focus-more-grid">
              {secondaryPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  data-adaptive-focus-preset={preset.id}
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
        <p role="alert" className="home-focus-error" data-adaptive-focus-error hidden />
      </form>
    </section>
  )
}
