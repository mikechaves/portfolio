import { ADAPTIVE_FOCUS_EXAMPLES } from "./config/prompts"
import { LocalAdaptiveFocusEngine } from "./adapters/local-engine"
import type { AdaptiveFocusEngine, AdaptiveFocusRequest, AdaptiveFocusResult } from "./types"

export function createAdaptiveFocusEngine(): AdaptiveFocusEngine {
  // TODO(private-extract): swap LocalAdaptiveFocusEngine with a private package/service adapter.
  return new LocalAdaptiveFocusEngine()
}

export function runAdaptiveFocus(request: AdaptiveFocusRequest): AdaptiveFocusResult {
  return createAdaptiveFocusEngine().run(request)
}

export { ADAPTIVE_FOCUS_EXAMPLES }
export type { AdaptiveFocusEngine, AdaptiveFocusRequest, AdaptiveFocusResult } from "./types"
