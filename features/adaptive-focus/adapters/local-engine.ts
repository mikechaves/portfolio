import type { AdaptiveFocusEngine, AdaptiveFocusRequest, AdaptiveFocusResult } from "../types"
import { parseIntent } from "../core/intent"
import { rankProjects } from "../core/ranking"
import { createSummary } from "../core/summary"

export class LocalAdaptiveFocusEngine implements AdaptiveFocusEngine {
  run(request: AdaptiveFocusRequest): AdaptiveFocusResult {
    const intent = parseIntent(request.query)
    const ranked = rankProjects(request.projects, intent)
    const summary = createSummary(intent)

    return { intent, ranked, summary }
  }
}
