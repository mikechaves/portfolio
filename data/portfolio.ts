import { PROJECTS } from "@/data/projects"
import { posts } from "@/lib/posts"

export type PortfolioProject = {
  id: string
  title: string
  shortDescription: string
  category: string
  technologies: string[]
  image: string
  href: string
}

export type PortfolioCapability = {
  id: string
  label: string
  summary: string
}

export type PortfolioWriting = {
  id: string
  title: string
  excerpt: string
  date: string
  href: string
}

export type SceneSection = {
  id: "hero" | "work" | "systems" | "contact"
  index: string
  title: string
  range: [number, number]
}

export const portfolioProjects: PortfolioProject[] = PROJECTS.map((project) => ({
  id: project.id,
  title: project.title,
  shortDescription: project.description,
  category: project.category,
  technologies: project.technologies,
  image: project.image,
  href: `/projects/${project.id}`,
}))

export const featuredPortfolioProjects = portfolioProjects.filter((project) =>
  [
    "astrocade-qa-calibration-tool",
    "wizzo",
    "gaia",
    "material-explorer",
  ].includes(project.id),
)

export const portfolioCapabilities: PortfolioCapability[] = [
  {
    id: "product-strategy",
    label: "Product Strategy",
    summary: "Define ambiguous opportunities, align teams, and translate pressure into measurable product direction.",
  },
  {
    id: "ai-prototyping",
    label: "AI Prototyping",
    summary: "Build AI-native workflows, eval loops, and model-backed interfaces that survive contact with users.",
  },
  {
    id: "spatial-ux",
    label: "Spatial UX",
    summary: "Design immersive interfaces where physical, voice, and screen interaction patterns meet.",
  },
  {
    id: "production-hardening",
    label: "Production Hardening",
    summary: "Ship reliable systems with observability, graceful fallbacks, and operational discipline.",
  },
]

export const portfolioWriting: PortfolioWriting[] = posts.map((post) => ({
  id: post.id,
  title: post.title,
  excerpt: post.excerpt,
  date: post.date,
  href: post.url || `/blog/${post.id}`,
}))

export const sceneSections: SceneSection[] = [
  { id: "hero", index: "01", title: "Mike Chaves", range: [0, 0.24] },
  { id: "work", index: "02", title: "Selected Work", range: [0.24, 0.52] },
  { id: "systems", index: "03", title: "Systems I Build", range: [0.52, 0.78] },
  { id: "contact", index: "04", title: "Writing / Contact", range: [0.78, 1] },
]
