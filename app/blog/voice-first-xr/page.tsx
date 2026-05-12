import { posts } from "@/lib/posts"
import { notFound } from "next/navigation"
import { IndustrialPostPage } from "@/components/industrial-post-page"

const post = posts.find((p) => p.id === "voice-first-xr")

export default function VoiceFirstXRPage() {
  if (!post) notFound()
  return (
    <IndustrialPostPage
      post={post}
      preview={[
        "Designing for voice-first interactions in XR creates unique accessibility and interaction challenges.",
        "The full article explores practical approaches to inclusive voice commands, spatial computing, and real-world deployment lessons.",
      ]}
    />
  )
}
