import type { Metadata } from "next"
import { ArticleSummaryPage } from "@/components/article-summary-page"
import { posts } from "@/lib/posts"
import { createPageMetadata } from "@/lib/seo/site"
import { notFound } from "next/navigation"

const post = posts.find((p) => p.id === "embracing-ambiguity")

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

export default function EmbracingAmbiguityPage() {
  if (!post) {
    notFound()
  }
  return (
    <ArticleSummaryPage
      post={post}
      gradientClassName="bg-gradient-to-r from-purple-900 via-pink-700 to-blue-900"
      summary={[
        "Emerging-technology work rarely arrives with stable requirements, settled interaction conventions, or a clean line between strategy and implementation. This summary examines how ambiguity can be framed as a working constraint instead of treated as a reason to defer decisions.",
        "The original article discusses design-thinking practices, technological adaptation, and keeping human needs visible as a system changes. The related cases show that operating approach applied to AI product and creative-operations workflows.",
      ]}
    />
  )
}
