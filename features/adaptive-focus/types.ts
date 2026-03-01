import type { Project } from "@/types/project"
import type {
  AdaptiveFocusEngine as CoreAdaptiveFocusEngine,
  AdaptiveFocusRequest as CoreAdaptiveFocusRequest,
  AdaptiveFocusResult as CoreAdaptiveFocusResult,
  AdaptiveIntent,
  AdaptiveSignal,
  ProjectFocusMetadata as CoreProjectFocusMetadata,
  RankedProject as CoreRankedProject,
} from "../../packages/adaptive-focus-core/src/types"

export { ADAPTIVE_FOCUS_SCHEMA_VERSION } from "../../packages/adaptive-focus-core/src/types"

export type ProjectFocusMetadata = Omit<CoreProjectFocusMetadata, "id"> & {
  id: Project["id"]
}

export type RankedProject = CoreRankedProject<Project>
export type AdaptiveFocusRequest = CoreAdaptiveFocusRequest<Project>
export type AdaptiveFocusResult = CoreAdaptiveFocusResult<Project>
export type AdaptiveFocusEngine = CoreAdaptiveFocusEngine<Project>

export type { AdaptiveIntent, AdaptiveSignal }
