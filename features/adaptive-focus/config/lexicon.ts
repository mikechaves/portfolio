import type { AdaptiveSignal } from "../types"

export const SIGNAL_PHRASES: Array<{ signal: AdaptiveSignal; terms: string[] }> = [
  { signal: "ai", terms: ["ai", "machine learning", "ml", "llm", "intelligent", "assistant"] },
  { signal: "xr", terms: ["xr", "ar", "vr", "spatial", "immersive", "mixed reality"] },
  { signal: "accessibility", terms: ["accessibility", "inclusive", "a11y", "voice", "assistive"] },
  { signal: "design-engineering", terms: ["design engineer", "design engineering", "frontend", "ux engineering"] },
  { signal: "creative-tech", terms: ["creative technology", "creative tech", "interactive", "three.js", "webgl"] },
  { signal: "product", terms: ["product", "shipping", "execution", "impact", "roadmap"] },
  { signal: "prototyping", terms: ["prototype", "rapid", "iteration", "mvp", "proof of concept"] },
  { signal: "data-viz", terms: ["data", "visualization", "analytics", "dashboard", "insights"] },
]

export const AUDIENCE_HINTS = ["adobe", "hiring", "recruiter", "manager", "founder", "team"]
