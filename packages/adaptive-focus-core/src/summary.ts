import type { AdaptiveIntent } from "./types"

const SIGNAL_COPY: Record<string, string> = {
  ai: "AI-assisted interaction",
  xr: "immersive and spatial interface work",
  accessibility: "inclusive and accessible design",
  "design-engineering": "design engineering execution",
  "creative-tech": "creative technology implementation",
  product: "product thinking and shipping focus",
  prototyping: "rapid prototyping",
  "data-viz": "data-informed storytelling",
}

export function createSummary(intent: AdaptiveIntent): string {
  if (!intent.matchedSignals.length) {
    return "Showing a balanced project mix while we learn the focus. Try a prompt with role, domain, or capability."
  }
  const themes = [...new Set(intent.matchedSignals.map((signal) => SIGNAL_COPY[signal]).filter(Boolean))]
  const topThemes = themes.slice(0, 3)
  const audienceSegment = intent.inferredAudience ? ` for ${intent.inferredAudience}` : ""
  return `These projects are prioritized${audienceSegment} to highlight ${topThemes.join(", ")}.`
}
