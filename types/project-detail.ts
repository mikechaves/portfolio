import type { Project } from "./project"

export interface ProjectDetailItem {
  title: string
  description: string
}

export interface ProjectDetails {
  client?: string
  date?: string
  category?: string
  proofRole?: string
  services?: string[]
  situation?: string | ProjectDetailItem[]
  task?: string | ProjectDetailItem[]
  actions?: ProjectDetailItem[]
  results?: ProjectDetailItem[]
  result?: string
  exhibition?: ProjectDetailItem[]
}

export interface ProjectDetailLink {
  label: string
  url: string
}

export interface ProjectDetail {
  id: string
  title: string
  image: string
  gallery?: string[]
  category: Project["category"]
  description: string
  technologies: string[]
  github?: string
  demo?: string
  demoLabel?: string
  links?: ProjectDetailLink[]
  details: ProjectDetails
}
