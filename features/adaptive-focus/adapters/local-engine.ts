import { createSummary, parseIntent, rankProjects } from "../../../packages/adaptive-focus-core/src"
import {
  ADAPTIVE_FOCUS_SCHEMA_VERSION,
  type AdaptiveFocusEngine,
  type AdaptiveFocusRequest,
  type AdaptiveFocusResult,
} from "../types"
import { PROJECT_FOCUS_METADATA } from "../config/metadata"

export class LocalAdaptiveFocusEngine implements AdaptiveFocusEngine {
  run(request: AdaptiveFocusRequest): AdaptiveFocusResult {
    const intent = parseIntent(request.query)
    const ranked = rankProjects(request.projects, intent, PROJECT_FOCUS_METADATA)
    const summary = createSummary(intent)

    return {
      schemaVersion: ADAPTIVE_FOCUS_SCHEMA_VERSION,
      intent,
      ranked,
      summary,
    }
  }
}
