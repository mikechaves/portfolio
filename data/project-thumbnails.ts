import type { ProjectThumbnailFocalPoint } from "@/types/project"

const PROJECT_THUMBNAIL_FOCAL_POINTS: Partial<
  Record<string, ProjectThumbnailFocalPoint>
> = {}

export function getProjectThumbnailFocalPoint(
  projectId: string,
): ProjectThumbnailFocalPoint {
  return PROJECT_THUMBNAIL_FOCAL_POINTS[projectId] ?? "center"
}
