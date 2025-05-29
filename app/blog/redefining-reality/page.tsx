import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export default function RedefiningRealityPage() {
  return (
    <div className="max-w-3xl mx-auto pt-8">
      <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
        <ArrowLeft size={16} /> Back to blog
      </Link>

      <div className="relative h-64 rounded-md overflow-hidden mb-8 bg-gradient-to-r from-orange-900 via-red-900 to-pink-900">
        <Image
          src="/placeholder.svg?height=600&width=1200"
          alt="Redefining Reality"
          fill
          className="object-cover mix-blend-overlay opacity-70"
        />
      </div>

      <div className="mb-8">
        <div className="inline-block px-3 py-1 mb-3 text-xs border border-zinc-700 rounded-full text-zinc-400">
          Bootcamp
        </div>
        <h1 className="text-3xl font-bold mb-4">Redefining Reality: The Future of Design in XR</h1>
        <div className="flex items-center gap-4 text-sm text-zinc-400">
          <div>Nov 30, 2024</div>
          <div>6 min read</div>
        </div>
      </div>

      <div className="border border-zinc-800 rounded-md overflow-hidden bg-black p-6 mb-8">
        <p className="text-zinc-400 mb-4">
          This article is available on Medium. Click the button below to read the full article.
        </p>
        <a
          href="https://medium.com/design-bootcamp/redefining-reality-the-future-of-design-in-xr-a5e053e255a8"
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
          Extended Reality (XR) is transforming how we design digital experiences by breaking free from the constraints
          of 2D screens. This article explores how spatial computing, embodied interaction, and immersive environments
          are creating new design paradigms that blend physical and digital realities.
        </p>
        <p className="text-zinc-400">
          The full article examines emerging XR design principles, the evolution of user interfaces beyond screens, and
          how designers can prepare for a future where the boundaries between physical and digital experiences continue
          to blur.
        </p>
      </div>
    </div>
  )
}
