import { ADAPTIVE_FOCUS_EXAMPLES } from "./config/prompts"
import { LocalAdaptiveFocusEngine } from "./adapters/local-engine"
import { RemoteAdaptiveFocusEngineStub } from "./adapters/remote-engine"
import type { AdaptiveFocusEngine, AdaptiveFocusRequest, AdaptiveFocusResult } from "./types"

function resolveEngineMode(): "local" | "remote" {
  const mode = process.env.NEXT_PUBLIC_ADAPTIVE_FOCUS_ENGINE
  return mode === "remote" ? "remote" : "local"
}

export function createAdaptiveFocusEngine(): AdaptiveFocusEngine {
  // TODO(private-extract): replace remote stub with private package/service adapter.
  const mode = resolveEngineMode()
  if (mode === "remote") return new RemoteAdaptiveFocusEngineStub()
  return new LocalAdaptiveFocusEngine()
}

export function runAdaptiveFocus(request: AdaptiveFocusRequest): AdaptiveFocusResult {
  return createAdaptiveFocusEngine().run(request)
}

export { ADAPTIVE_FOCUS_EXAMPLES }
export type {
  AdaptiveFocusEngine,
  AdaptiveFocusRequest,
  AdaptiveFocusResult,
} from "./types"
