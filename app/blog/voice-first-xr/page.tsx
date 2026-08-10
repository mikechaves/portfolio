import type { Metadata } from "next"
import { ArticleSummaryPage } from "@/components/article-summary-page"
import { posts } from "@/lib/posts"
import { createPageMetadata } from "@/lib/seo/site"
import { notFound } from "next/navigation"

const post = posts.find((p) => p.id === "voice-first-xr")

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

export default function VoiceFirstXRPage() {
  if (!post) {
    notFound()
  }
  return (
    <ArticleSummaryPage
      post={post}
      gradientClassName="bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900"
      summary={[
        "Designing voice-first interactions in XR creates a specific coordination problem: spoken intent, spatial state, system feedback, and a user's access needs all have to remain legible at once. This summary distills lessons from building inclusive voice experiences in spatial computing.",
        "The original article covers practical accessibility approaches, more intuitive command design, and observations from deployed work. The linked SpeakEasy and Portals cases show how those ideas appear in reviewable interaction systems.",
      ]}
    />
  )
}
