import type {
  AdaptiveFocusEngine,
  AdaptiveFocusRequest,
  AdaptiveFocusRunOptions,
  AdaptiveFocusV2Result,
} from "../types"

export class RemoteAdaptiveFocusEngine implements AdaptiveFocusEngine {
  async run(
    request: AdaptiveFocusRequest,
    options?: AdaptiveFocusRunOptions
  ): Promise<AdaptiveFocusV2Result> {
    if (request.mode !== "custom") {
      throw new Error("The remote Adaptive Focus engine accepts custom role input only.")
    }

    const response = await fetch("/api/adaptive-focus/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: request.input }),
      cache: "no-store",
      signal: options?.signal,
    })

    if (!response.ok) {
      throw new Error("Advanced role analysis is unavailable.")
    }

    const result = (await response.json()) as AdaptiveFocusV2Result
    if (result.schemaVersion !== "af.v2") {
      throw new Error("Adaptive Focus returned an unsupported response.")
    }
    return result
  }
}
