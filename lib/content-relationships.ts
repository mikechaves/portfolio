import { PUBLIC_PROJECT_ID_SET } from "@/data/portfolio-curation"
import { PROJECTS } from "@/data/projects"
import { posts } from "@/lib/posts"

export interface RelatedProjectContentLink {
  projectId: string
  title: string
  reason: string
}

export interface RelatedArticleContentLink {
  articleId: string
  title: string
  reason: string
}

const ARTICLE_PROJECT_RELATIONSHIPS: Record<string, readonly Omit<RelatedProjectContentLink, "title">[]> = {
  "voice-first-xr": [
    {
      projectId: "speakeasy",
      reason: "Voice-controlled mixed reality research grounded in access needs.",
    },
    {
      projectId: "portals",
      reason: "A spatial interface using voice routing and multimodal feedback.",
    },
  ],
  "embracing-ambiguity": [
    {
      projectId: "wizzo",
      reason: "An ambiguous AI workflow turned into a reviewable product system.",
    },
    {
      projectId: "creative-supply-engine",
      reason: "A governed creative-operations workflow built from structured constraints.",
    },
  ],
  "ai-becomes-user": [
    {
      projectId: "wizzo",
      reason: "An AI-native product where intent, context, and follow-up shape the interface.",
    },
    {
      projectId: "x-games",
      reason: "Playfold connects AI-assisted creation to discovery, ranking, and direct play.",
    },
  ],
  "extended-pausabilities": [
    {
      projectId: "speakeasy",
      reason: "An accessibility-led mixed reality case study with voice interaction.",
    },
    {
      projectId: "sound-escape-vr",
      reason: "An immersive game system built around spatial audio and embodied navigation.",
    },
  ],
  "redefining-reality": [
    {
      projectId: "portals",
      reason: "A spatial interface exploring how embodied navigation changes interaction design.",
    },
    {
      projectId: "material-explorer",
      reason: "A browser-native 3D authoring tool with live visual comparison.",
    },
  ],
}

const projectTitleById = new Map(PROJECTS.map((project) => [project.id, project.title]))
const postById = new Map(posts.map((post) => [post.id, post]))

export function getRelatedProjectsForArticle(articleId: string): RelatedProjectContentLink[] {
  return (ARTICLE_PROJECT_RELATIONSHIPS[articleId] ?? []).flatMap((relationship) => {
    const title = projectTitleById.get(relationship.projectId)
    if (!title) return []
    return [{ ...relationship, title }]
  })
}

export function getRelatedArticlesForProject(projectId: string): RelatedArticleContentLink[] {
  if (!PUBLIC_PROJECT_ID_SET.has(projectId)) return []

  return Object.entries(ARTICLE_PROJECT_RELATIONSHIPS).flatMap(([articleId, relationships]) => {
    const relationship = relationships.find((candidate) => candidate.projectId === projectId)
    const post = postById.get(articleId)
    if (!relationship || !post) return []
    return [{ articleId, title: post.title, reason: relationship.reason }]
  })
}

export function getContentRelationshipIssues(): string[] {
  const issues: string[] = []

  for (const [articleId, relationships] of Object.entries(ARTICLE_PROJECT_RELATIONSHIPS)) {
    if (!postById.has(articleId)) issues.push(`unknown article:${articleId}`)
    for (const relationship of relationships) {
      if (!PUBLIC_PROJECT_ID_SET.has(relationship.projectId)) {
        issues.push(`unknown project:${relationship.projectId}`)
      }
    }
  }

  return issues
}
