import { posts } from "@/lib/posts"
import { notFound } from "next/navigation"
import { IndustrialPostPage } from "@/components/industrial-post-page"

const post = posts.find((p) => p.id === "ai-becomes-user")

export default function AIBecomesUserPage() {
  if (!post) notFound()
  return (
    <IndustrialPostPage
      post={post}
      preview={[
        "As AI systems increasingly interact with our digital interfaces, we need to rethink fundamental UX/UI principles.",
        "The full article discusses AI agency in interface design, new metrics for AI user experiences, and practical approaches for designers working at this frontier.",
      ]}
    />
  )
}
