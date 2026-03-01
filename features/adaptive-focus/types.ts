import type { Project } from "@/types/project"

export type AdaptiveSignal =
  | "ai"
  | "xr"
  | "accessibility"
  | "design-engineering"
  | "creative-tech"
  | "product"
  | "prototyping"
  | "data-viz"

export interface AdaptiveFocusRequest {
  query: string
  projects: Project[]
}

export interface ProjectFocusMetadata {
  id: Project["id"]
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

export interface RankedProject {
  project: Project
  score: number
  matchedSignals: AdaptiveSignal[]
  matchedTags: string[]
  reasons: string[]
}

export const ADAPTIVE_FOCUS_SCHEMA_VERSION = "af.v1" as const

export interface AdaptiveFocusResult {
  schemaVersion: typeof ADAPTIVE_FOCUS_SCHEMA_VERSION
  intent: AdaptiveIntent
  ranked: RankedProject[]
  summary: string
}

export interface AdaptiveFocusEngine {
  run(request: AdaptiveFocusRequest): AdaptiveFocusResult
}
