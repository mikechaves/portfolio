import type { AdaptiveFocusEngine, AdaptiveFocusRequest, AdaptiveFocusResult } from "../types"

/**
 * Remote adapter stub for future private service cutover.
 * Disabled by default; no network calls in current public implementation.
 */
export class RemoteAdaptiveFocusEngineStub implements AdaptiveFocusEngine {
  run(_request: AdaptiveFocusRequest): AdaptiveFocusResult {
    throw new Error(
      "RemoteAdaptiveFocusEngineStub is not enabled. Keep local engine active until private service is ready."
    )
  }
}
