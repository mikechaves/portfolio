import { posts } from "@/lib/posts"
import { notFound } from "next/navigation"
import { IndustrialPostPage } from "@/components/industrial-post-page"

const post = posts.find((p) => p.id === "redefining-reality")

export default function RedefiningRealityPage() {
  if (!post) notFound()
  return (
    <IndustrialPostPage
      post={post}
      preview={[
        "Extended Reality is transforming digital experience design by moving beyond the constraints of 2D screens.",
        "The full article examines spatial computing, embodied interaction, and interface paradigms that blend physical and digital realities.",
      ]}
    />
  )
}
