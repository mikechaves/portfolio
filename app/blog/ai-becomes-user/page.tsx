import type { Metadata } from "next"
import { ArticleSummaryPage } from "@/components/article-summary-page"
import { posts } from "@/lib/posts"
import { createPageMetadata } from "@/lib/seo/site"
import { notFound } from "next/navigation"

const post = posts.find((p) => p.id === "ai-becomes-user")

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

export default function AIBecomesUserPage() {
  if (!post) {
    notFound()
  }
  return (
    <ArticleSummaryPage
      post={post}
      gradientClassName="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900"
      summary={[
        "When an AI system reads, selects, and acts through an interface, the designer has to account for machine-legible state without abandoning human understanding or control. This summary frames the shift from a purely human-operated interface to one shared with AI agents.",
        "The original article examines AI agency, evaluation, and practical interface implications. The related Wizzo and Playfold cases show how AI behavior, creator or operator intent, and visible workflow state can coexist in a product system.",
      ]}
    />
  )
}
