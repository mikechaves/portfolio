export type AdaptiveSignal =
  | "ai"
  | "xr"
  | "accessibility"
  | "design-engineering"
  | "creative-tech"
  | "product"
  | "prototyping"
  | "data-viz"

export interface AdaptiveProjectInput {
  id: string
  title: string
  description: string
  technologies: string[]
}

export interface ProjectFocusMetadata {
  id: string
  tags: string[]
  signals: AdaptiveSignal[]
  weight?: number
}

export interface AdaptiveIntent {
  raw: string
  normalized: string
  matchedSignals: AdaptiveSignal[]
  matchedTags: string[]
  inferredAudience?: string
  confidence: number
  reasons: string[]
}

export interface RankedProject<TProject extends AdaptiveProjectInput> {
  project: TProject
  score: number
  matchedSignals: AdaptiveSignal[]
  matchedTags: string[]
  reasons: string[]
}
