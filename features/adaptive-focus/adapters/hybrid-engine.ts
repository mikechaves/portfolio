import type {
  AdaptiveFocusEngine,
  AdaptiveFocusRequest,
  AdaptiveFocusRunOptions,
  AdaptiveFocusV2Result,
} from "../types"
import { LocalAdaptiveFocusEngine } from "./local-engine"
import { RemoteAdaptiveFocusEngine } from "./remote-engine"

export class HybridAdaptiveFocusEngine implements AdaptiveFocusEngine {
  constructor(
    private readonly local = new LocalAdaptiveFocusEngine(),
    private readonly remote = new RemoteAdaptiveFocusEngine()
  ) {}

  async run(
    request: AdaptiveFocusRequest,
    options?: AdaptiveFocusRunOptions
  ): Promise<AdaptiveFocusV2Result> {
    if (request.mode !== "custom") return this.local.run(request, options)

    try {
      return await this.remote.run(request, options)
    } catch (error) {
      if (options?.signal?.aborted || (error instanceof DOMException && error.name === "AbortError")) {
        throw error
      }
      return this.local.run(request, options)
    }
  }
}
