import { ArrowRight, ChevronDown, RotateCcw, LoaderCircle } from "lucide-react"
import { ADAPTIVE_FOCUS_PRESETS } from "@/features/adaptive-focus/config/presets"
import { composeLocalBrief } from "@/features/adaptive-focus/adapters/local-engine"
import { ADAPTIVE_FOCUS_INPUT_MAX_LENGTH } from "@/features/adaptive-focus/handoff"
import { PROJECTS } from "@/data/projects"
import { PROFESSIONAL_EXPERIENCE_RECORDS } from "@/features/adaptive-focus/evidence/professional-experience"

const primary = ["creative-direction", "game-ux-creator-systems", "xr-accessibility", "design-engineering"]
const compact: Record<string, string> = { "creative-direction": "Creative direction", "game-ux-creator-systems": "Game UX", "xr-accessibility": "Immersive + accessible", "design-engineering": "Design + delivery" }
const evidenceNames = new Map<string, string>([...PROJECTS.map((p) => [p.id, p.title] as const), ...PROFESSIONAL_EXPERIENCE_RECORDS.map((p) => [p.id, p.company] as const)])
const presentations = ADAPTIVE_FOCUS_PRESETS.map((preset) => {
  const result = composeLocalBrief(preset.interpretation, "preset")
  const names = [...result.groups.primary, ...result.groups.supporting].map((match) => evidenceNames.get(match.entityId)).filter(Boolean)
  return { ...preset, compact: compact[preset.id] ?? preset.label, projectOrder: [...result.groups.primary, ...result.groups.supporting, ...result.groups.adjacent].map(match => match.entityId).join(","), evidenceNames: [...new Set(names)].slice(0, 3).join(" · ") }
})

export function AdaptiveFocusEntry() {
  const presetButton = (id: string, index: number) => {
    const preset = presentations.find((item) => item.id === id)!
    return <button key={id} type="button" className="home-focus-preset" aria-pressed="false" aria-label={`${preset.label}: ${preset.description}`} data-adaptive-focus-preset={id} data-focus-title={preset.compact} data-focus-description={preset.description} data-focus-evidence={preset.evidenceNames} data-focus-order={preset.projectOrder}>
      <span className="focus-selector" aria-hidden="true" /><span className="focus-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><strong>{preset.compact}</strong><span className="focus-description">{preset.description}</span>
    </button>
  }
  return (
    <section id="adaptive-focus" className="home-focus-panel" aria-labelledby="adaptive-focus-title">
      <div className="home-focus-intro">
        <p className="home-section-kicker">For the curious</p>
        <h2 id="adaptive-focus-title">Adaptive Focus</h2>
        <p>Explore by interest or role.</p>
      </div>
      <div className="home-focus-interaction">
        <div className="home-focus-presets" aria-label="Suggested role lenses">{primary.map(presetButton)}</div>
        <div className="home-focus-lens-tools">
          <details className="home-focus-more" data-adaptive-focus-more><summary>More lenses <ChevronDown size={16} /></summary><div className="home-focus-more-grid">{presentations.filter((p) => !primary.includes(p.id)).map((p, i) => presetButton(p.id, i + primary.length))}</div></details>
          <button type="button" className="focus-reset" data-focus-reset>Reset focus <RotateCcw size={15} /></button>
        </div>
        <div className="focus-preview" aria-live="polite" aria-atomic="true">
          <p className="home-section-kicker" data-focus-preview-label>Showing</p><h3 data-focus-preview-title>All work</h3>
          <p data-focus-preview-description>Choose an interest above, or explore everything.</p>
          <p className="focus-evidence" data-focus-preview-evidence />
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- static homepage avoids loading React for navigation */}
          <a href="/projects" className="home-primary-action" data-focus-explore>Explore the work <ArrowRight size={20} /></a>
        </div>
        <details className="focus-custom" data-focus-custom><summary>Have a specific role in mind? <ChevronDown size={18} /></summary>
          <form className="home-focus-form" data-adaptive-focus-form>
            <label htmlFor="adaptive-focus-role-input">Role or job description</label>
            <textarea id="adaptive-focus-role-input" name="role" maxLength={ADAPTIVE_FOCUS_INPUT_MAX_LENGTH} placeholder="Paste a role or job description" aria-describedby="adaptive-focus-role-input-privacy" className="home-focus-input" required />
            <span className="home-focus-count" aria-live="polite" data-adaptive-focus-count hidden />
            <div className="home-focus-footer">
              <button type="submit" disabled className="home-secondary-action" data-adaptive-focus-submit><span data-adaptive-focus-loader hidden><LoaderCircle size={16} className="animate-spin" /></span><span data-adaptive-focus-submit-label>Analyze role</span><ArrowRight size={17} /></button>
              <p id="adaptive-focus-role-input-privacy" className="home-focus-privacy">Custom role text is processed by OpenAI and not stored. Do not submit confidential information. Preset lenses stay local and do not call the model.</p>
            </div>
            <p role="alert" className="home-focus-error" data-adaptive-focus-error hidden />
          </form>
        </details>
      </div>
    </section>
  )
}
