import { posts } from "@/lib/posts"
import { notFound } from "next/navigation"
import { IndustrialPostPage } from "@/components/industrial-post-page"

const post = posts.find((p) => p.id === "extended-pausabilities")

export default function ExtendedPausabilitiesPage() {
  if (!post) notFound()
  return (
    <IndustrialPostPage
      post={post}
      preview={[
        "Extended Reality technologies offer immense potential, but also present unique accessibility challenges.",
        "The full article covers practical XR accessibility guidelines, multi-sensory feedback, and inclusive applications that improve experiences for all users.",
      ]}
    />
  )
}
