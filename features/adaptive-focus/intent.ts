import type { AdaptiveIntent, AdaptiveSignal } from "./types"

const SIGNAL_PHRASES: Array<{ signal: AdaptiveSignal; terms: string[] }> = [
  { signal: "ai", terms: ["ai", "machine learning", "ml", "llm", "intelligent", "assistant"] },
  { signal: "xr", terms: ["xr", "ar", "vr", "spatial", "immersive", "mixed reality"] },
  { signal: "accessibility", terms: ["accessibility", "inclusive", "a11y", "voice", "assistive"] },
  { signal: "design-engineering", terms: ["design engineer", "design engineering", "frontend", "ux engineering"] },
  { signal: "creative-tech", terms: ["creative technology", "creative tech", "interactive", "three.js", "webgl"] },
  { signal: "product", terms: ["product", "shipping", "execution", "impact", "roadmap"] },
  { signal: "prototyping", terms: ["prototype", "rapid", "iteration", "mvp", "proof of concept"] },
  { signal: "data-viz", terms: ["data", "visualization", "analytics", "dashboard", "insights"] },
]

const AUDIENCE_HINTS = ["adobe", "hiring", "recruiter", "manager", "founder", "team"]

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim()
}

export function interpretAdaptiveIntent(rawInput: string): AdaptiveIntent {
  const normalized = normalize(rawInput)
  const matchedSignals = new Set<AdaptiveSignal>()
  const matchedTags = new Set<string>()
  const reasons: string[] = []

  for (const entry of SIGNAL_PHRASES) {
    const matchedTerms = entry.terms.filter((term) => normalized.includes(term))
    if (matchedTerms.length === 0) continue
    matchedSignals.add(entry.signal)
    matchedTerms.forEach((term) => matchedTags.add(term))
    reasons.push(`${entry.signal} via ${matchedTerms.join(", ")}`)
  }

  const audience = AUDIENCE_HINTS.find((hint) => normalized.includes(hint))
  if (audience) reasons.push(`audience hint: ${audience}`)

  const confidence = Math.min(1, 0.25 + matchedSignals.size * 0.2 + Math.min(matchedTags.size, 4) * 0.08)

  return {
    raw: rawInput,
    normalized,
    matchedSignals: [...matchedSignals],
    matchedTags: [...matchedTags],
    inferredAudience: audience,
    confidence: Number(confidence.toFixed(2)),
    reasons,
  }
}
