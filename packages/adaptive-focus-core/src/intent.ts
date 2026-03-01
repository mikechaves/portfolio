import { AUDIENCE_HINTS, SIGNAL_PHRASES } from "./lexicon"
import { COMPANY_SIGNAL_MAP } from "./company-mapping"
import type { AdaptiveIntent, AdaptiveSignal } from "./types"

export function normalizeIntentInput(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim()
}

export function parseIntent(rawInput: string): AdaptiveIntent {
  const normalized = normalizeIntentInput(rawInput)
  const matchedSignals = new Set<AdaptiveSignal>()
  const matchedTags = new Set<string>()
  const reasons: string[] = []

  for (const entry of SIGNAL_PHRASES) {
    const matchedTerms = entry.terms.filter((term) => normalized.includes(term))
    if (!matchedTerms.length) continue
    matchedSignals.add(entry.signal)
    matchedTerms.forEach((term) => matchedTags.add(term))
    reasons.push(`${entry.signal} via ${matchedTerms.join(", ")}`)
  }

  const audience = AUDIENCE_HINTS.find((hint) => normalized.includes(hint))
  if (audience) reasons.push(`audience hint: ${audience}`)

  for (const [company, mapping] of Object.entries(COMPANY_SIGNAL_MAP)) {
    if (!normalized.includes(company)) continue
    mapping.signals.forEach((signal) => matchedSignals.add(signal))
    mapping.tags.forEach((tag) => matchedTags.add(tag))
    reasons.push(`company mapping: ${company}`)
  }

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
