import {
  ADAPTIVE_CAPABILITIES,
  ROLE_FAMILIES,
  SENIORITY_LEVELS,
  type AdaptiveFocusAnalysisSource,
  type AdaptiveFocusRequest,
  type AdaptiveFocusV2Result,
  type RoleInterpretation,
} from "./types"

export const ADAPTIVE_FOCUS_PENDING_KEY = "adaptive-focus:pending:v2"
export const ADAPTIVE_FOCUS_INPUT_MAX_LENGTH = 12_000
export const ADAPTIVE_FOCUS_LEGACY_MAX_LENGTH = 500
export const ADAPTIVE_FOCUS_PENDING_TTL_MS = 10 * 60 * 1000

interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

interface PendingPayload {
  version: 2
  input: string
  createdAt: number
}

export function savePendingAdaptiveFocusInput(
  storage: StorageLike,
  input: string,
  now = Date.now()
): void {
  const trimmed = input.trim()
  if (!trimmed || trimmed.length > ADAPTIVE_FOCUS_INPUT_MAX_LENGTH) {
    throw new Error("Role text must be between 1 and 12,000 characters.")
  }
  const payload: PendingPayload = { version: 2, input: trimmed, createdAt: now }
  const serialized = JSON.stringify(payload)
  storage.setItem(ADAPTIVE_FOCUS_PENDING_KEY, serialized)
  if (storage.getItem(ADAPTIVE_FOCUS_PENDING_KEY) !== serialized) {
    throw new Error("Temporary role storage is unavailable.")
  }
}

export function consumePendingAdaptiveFocusInput(
  storage: StorageLike,
  now = Date.now()
): string | null {
  const raw = storage.getItem(ADAPTIVE_FOCUS_PENDING_KEY)
  storage.removeItem(ADAPTIVE_FOCUS_PENDING_KEY)
  if (!raw) return null

  try {
    const payload = JSON.parse(raw) as Partial<PendingPayload>
    if (
      payload.version !== 2 ||
      typeof payload.input !== "string" ||
      typeof payload.createdAt !== "number" ||
      now - payload.createdAt > ADAPTIVE_FOCUS_PENDING_TTL_MS ||
      payload.input.length > ADAPTIVE_FOCUS_INPUT_MAX_LENGTH
    ) {
      return null
    }
    return payload.input.trim() || null
  } catch {
    return null
  }
}

interface BriefHandoffPayload {
  v: 2
  source: AdaptiveFocusAnalysisSource
  family: RoleInterpretation["roleFamily"]
  seniority: RoleInterpretation["seniority"]
  requirements: Array<[
    RoleInterpretation["requirements"][number]["capability"],
    RoleInterpretation["requirements"][number]["importance"],
    RoleInterpretation["requirements"][number]["basis"],
  ]>
  confidence: number
  clarification: boolean
}

const ANALYSIS_SOURCES = new Set<AdaptiveFocusAnalysisSource>([
  "preset",
  "gpt",
  "local-fallback",
])
const CAPABILITIES = new Set<string>(ADAPTIVE_CAPABILITIES)
const FAMILIES = new Set<string>(ROLE_FAMILIES)
const SENIORITIES = new Set<string>(SENIORITY_LEVELS)
const IMPORTANCE = new Set(["required", "preferred", "context"])
const BASIS = new Set(["explicit", "inferred"])

export function encodeAdaptiveFocusBriefHandoff(result: AdaptiveFocusV2Result): string {
  const payload: BriefHandoffPayload = {
    v: 2,
    source: result.analysisSource,
    family: result.interpretation.roleFamily,
    seniority: result.interpretation.seniority,
    requirements: result.interpretation.requirements.map((requirement) => [
      requirement.capability,
      requirement.importance,
      requirement.basis,
    ]),
    confidence: result.interpretation.confidence,
    clarification: result.interpretation.clarificationNeeded,
  }
  return btoa(JSON.stringify(payload)).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "")
}

export function decodeAdaptiveFocusBriefHandoff(token: string): {
  interpretation: RoleInterpretation
  analysisSource: AdaptiveFocusAnalysisSource
} | null {
  if (!token || token.length > 4_000) return null
  try {
    const padded = token.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(token.length / 4) * 4, "=")
    const payload = JSON.parse(atob(padded)) as Partial<BriefHandoffPayload>
    if (
      payload.v !== 2 ||
      !payload.source ||
      !ANALYSIS_SOURCES.has(payload.source) ||
      !payload.family ||
      !FAMILIES.has(payload.family) ||
      !payload.seniority ||
      !SENIORITIES.has(payload.seniority) ||
      !Array.isArray(payload.requirements) ||
      payload.requirements.length > 12 ||
      typeof payload.confidence !== "number" ||
      payload.confidence < 0 ||
      payload.confidence > 1 ||
      typeof payload.clarification !== "boolean"
    ) {
      return null
    }
    const requirements = payload.requirements.map(([capability, importance, basis]) => {
      if (!CAPABILITIES.has(capability) || !IMPORTANCE.has(importance) || !BASIS.has(basis)) {
        throw new Error("Invalid handoff requirement")
      }
      return { capability, importance, basis }
    }) as RoleInterpretation["requirements"]
    return {
      analysisSource: payload.source,
      interpretation: {
        normalizedInput: "Custom role request",
        roleTitle: null,
        roleFamily: payload.family as RoleInterpretation["roleFamily"],
        seniority: payload.seniority as RoleInterpretation["seniority"],
        companyContext: null,
        requirements,
        responsibilities: [],
        desiredOutcomes: [],
        confidence: payload.confidence,
        clarificationNeeded: payload.clarification,
        clarificationQuestion: payload.clarification
          ? "Add a role, capability, or workflow so Adaptive Focus can build a grounded brief."
          : null,
      },
    }
  } catch {
    return null
  }
}

export function resolveAdaptiveFocusInitialization(
  search: string,
  storage: StorageLike,
  now = Date.now()
): AdaptiveFocusRequest | null {
  const params = new URLSearchParams(search)
  const presetId = params.get("focusPreset")?.trim()
  if (presetId) return { mode: "preset", presetId }

  if (params.get("focusSession") === "1") {
    const pending = consumePendingAdaptiveFocusInput(storage, now)
    return pending ? { mode: "custom", input: pending } : null
  }

  const legacy = params.get("focus")?.trim().slice(0, ADAPTIVE_FOCUS_LEGACY_MAX_LENGTH)
  return legacy ? { mode: "custom", input: legacy } : null
}
