import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export default function EmbracingAmbiguityPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
        <ArrowLeft size={16} /> Back to blog
      </Link>

      <div className="relative h-64 rounded-md overflow-hidden mb-8 bg-gradient-to-r from-purple-900 via-pink-700 to-blue-900">
        <Image
          src="/placeholder.svg?height=600&width=1200"
          alt="Embracing Ambiguity"
          fill
          className="object-cover mix-blend-overlay opacity-70"
        />
      </div>

      <div className="mb-8">
        <div className="inline-block px-3 py-1 mb-3 text-xs border border-zinc-700 rounded-full text-zinc-400">
          Bootcamp
        </div>
        <h1 className="text-3xl font-bold mb-4">
          Embracing Ambiguity: Finding Clarity in the Chaos of Modern Technology
        </h1>
        <div className="flex items-center gap-4 text-sm text-zinc-400">
          <div>Feb 12, 2025</div>
          <div>6 min read</div>
        </div>
      </div>

      <div className="border border-zinc-800 rounded-md overflow-hidden bg-black p-6 mb-8">
        <p className="text-zinc-400 mb-4">
          This article is available on Medium. Click the button below to read the full article.
        </p>
        <a
          href="https://medium.com/design-bootcamp/embracing-ambiguity-finding-clarity-in-the-chaos-of-modern-technology-415e5834e150"
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
          In today's rapidly evolving technological landscape, designers and developers often find themselves navigating
          through ambiguity. This article explores strategies for finding clarity amid the chaos of modern technology,
          embracing uncertainty as a catalyst for innovation, and developing frameworks that help transform complex
          problems into meaningful solutions.
        </p>
        <p className="text-zinc-400">
          The full article discusses approaches to design thinking, technological adaptation, and maintaining a
          human-centered focus in an increasingly digital world.
        </p>
      </div>
    </div>
  )
}

