import type { Metadata } from "next"
import { ArticleSummaryPage } from "@/components/article-summary-page"
import { posts } from "@/lib/posts"
import { createPageMetadata } from "@/lib/seo/site"
import { notFound } from "next/navigation"

const post = posts.find((p) => p.id === "redefining-reality")

export const metadata: Metadata = post
  ? createPageMetadata({
      title: post.title,
      description: post.excerpt,
      path: `/blog/${post.id}`,
      image: post.image,
      imageAlt: `${post.title} article preview`,
      type: "article",
    })
  : {}

export default function RedefiningRealityPage() {
  if (!post) {
    notFound()
  }
  return (
    <ArticleSummaryPage
      post={post}
      gradientClassName="bg-gradient-to-r from-orange-900 via-red-900 to-pink-900"
      summary={[
        "Spatial computing changes the designer's canvas from a bounded screen to an environment shaped by movement, scale, attention, and physical context. This summary examines the interaction principles that emerge when digital and physical space overlap.",
        "The original article traces interface design beyond two-dimensional conventions. The linked Portals and Material Explorer cases show spatial navigation and live 3D authoring as concrete, browser-based systems.",
      ]}
    />
  )
}
