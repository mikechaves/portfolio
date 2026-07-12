export type ProjectThumbnailFocalPoint = "center" | "top" | "bottom" | "left" | "right"

export interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  category: 'design' | 'web' | 'research' | 'ar-vr' | 'development'
  thumbnailFocalPoint?: ProjectThumbnailFocalPoint
}
