import type { Metadata } from "next"
import { ArticleSummaryPage } from "@/components/article-summary-page"
import { posts } from "@/lib/posts"
import { createPageMetadata } from "@/lib/seo/site"
import { notFound } from "next/navigation"

const post = posts.find((p) => p.id === "extended-pausabilities")

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

export default function ExtendedPausabilitiesPage() {
  if (!post) {
    notFound()
  }
  return (
    <ArticleSummaryPage
      post={post}
      gradientClassName="bg-gradient-to-r from-green-900 via-teal-900 to-cyan-900"
      summary={[
        "XR expands interaction beyond a flat screen, but it can also multiply barriers across movement, perception, attention, and control. This summary considers inclusive spatial experiences for people with varied physical, sensory, and cognitive access needs.",
        "The original article covers practical XR accessibility guidance and multisensory feedback. The related SpeakEasy and Sound Escape VR cases provide concrete examples of voice, spatial audio, and embodied interaction decisions.",
      ]}
    />
  )
}
