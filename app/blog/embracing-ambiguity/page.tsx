import { posts } from "@/lib/posts"
import { notFound } from "next/navigation"
import { IndustrialPostPage } from "@/components/industrial-post-page"

const post = posts.find((p) => p.id === "embracing-ambiguity")

export default function EmbracingAmbiguityPage() {
  if (!post) notFound()
  return (
    <IndustrialPostPage
      post={post}
      preview={[
        "Designers and developers often navigate ambiguity inside rapidly evolving technical systems.",
        "The full article explores how uncertainty can become a catalyst for innovation and how teams can turn complex problems into meaningful solutions.",
      ]}
    />
  )
}
