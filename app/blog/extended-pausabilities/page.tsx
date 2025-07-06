import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { posts } from "@/lib/posts"
import { notFound } from "next/navigation"

const post = posts.find((p) => p.id === "extended-pausabilities")

export default function ExtendedPausabilitiesPage() {
  if (!post) {
    notFound()
  }
  return (
    <div className="max-w-3xl mx-auto pt-8">
      <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
        <ArrowLeft size={16} /> Back to blog
      </Link>

      <div className="relative h-64 rounded-md overflow-hidden mb-8 bg-gradient-to-r from-green-900 via-teal-900 to-cyan-900">
        <Image
          src={post.image.replace(/width=\d+/, "width=1200").replace(/height=\d+/, "height=600")}
          alt={post.title}
          fill
          className="object-cover mix-blend-overlay opacity-70"
        />
      </div>

      <div className="mb-8">
        <div className="inline-block px-3 py-1 mb-3 text-xs border border-zinc-700 rounded-full text-zinc-400">
          {post.publication}
        </div>
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-zinc-400">
          <div>{post.date}</div>
          <div>{post.readingTime}</div>
        </div>
      </div>

      <div className="border border-zinc-800 rounded-md overflow-hidden bg-black p-6 mb-8">
        <p className="text-zinc-400 mb-4">
          This article is available on Medium. Click the button below to read the full article.
        </p>
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Read on Medium
        </a>
      </div>

      <div className="border border-zinc-800 rounded-md overflow-hidden bg-black p-6">
        <h2 className="text-xl font-bold mb-4">Article Preview</h2>
        <p className="text-zinc-400 mb-4">
          Extended Reality (XR) technologies offer immense potential, but also present unique accessibility challenges.
          This article explores how designers and developers can create inclusive XR experiences that accommodate users
          with diverse abilities, sensory processing differences, and cognitive needs.
        </p>
        <p className="text-zinc-400">
          The full article covers practical accessibility guidelines for XR, innovative approaches to multi-sensory
          feedback, and case studies of inclusive XR applications that demonstrate how accessibility can enhance
          experiences for all users.
        </p>
      </div>
    </div>
  )
}
