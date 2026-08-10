import type { MetadataRoute } from "next"
import { PROJECT_DETAIL_IDS } from "@/data/project-details"
import { posts } from "@/lib/posts"
import { getCanonicalUrl, isProductionIndexingEnabled } from "@/lib/seo/site"

const STATIC_INDEXABLE_ROUTES = ["/", "/about", "/projects", "/blog"] as const

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isProductionIndexingEnabled()) return []

  const routes = [
    ...STATIC_INDEXABLE_ROUTES,
    ...PROJECT_DETAIL_IDS.map((id) => `/projects/${id}`),
    ...posts.map((post) => `/blog/${post.id}`),
  ]

  return routes.map((route) => ({ url: getCanonicalUrl(route) }))
}
