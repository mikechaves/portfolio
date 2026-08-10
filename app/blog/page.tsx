import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BlogCard } from "@/components/blog-card"
import { JsonLd } from "@/components/json-ld"
import { FocusContextBadge } from "@/components/focus-context-badge"
import { posts } from "@/lib/posts"
import { createPageMetadata } from "@/lib/seo/site"
import { getBlogCollectionStructuredData } from "@/lib/seo/structured-data"

export const metadata: Metadata = createPageMetadata({
  title: "Writing on AI Product Design, XR & Interactive Systems",
  description:
    "Read Mike Chaves on AI-native UX, designing for AI as a user, emerging-technology ambiguity, voice-first XR, and accessible spatial interaction.",
  path: "/blog",
  imageAlt: "Writing by Mike Chaves on AI product design and XR accessibility",
})

interface BlogPageProps {
  searchParams?: Promise<{ focus?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {}
  const focus = resolvedSearchParams.focus?.trim() ?? ""

  return (
    <div className="space-y-8 pt-8">
      <JsonLd id="blog-collection-structured-data" data={getBlogCollectionStructuredData(posts)} />
      {focus && <FocusContextBadge focus={focus} />}
      <section className="border-y border-white/15 bg-black/45 px-5 py-8 sm:px-8" aria-labelledby="writing-title">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Writing / Field notes</p>
        <h1 id="writing-title" className="mt-2 max-w-4xl font-display text-4xl font-semibold uppercase leading-none text-white sm:text-5xl">
          AI product design, XR, accessibility, and emerging interfaces
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400">
          On-site summaries connect each original article to the project evidence behind it, so readers can move from an idea to a working system without losing context.
        </p>
        <div className="mt-5 flex flex-wrap gap-4 text-xs uppercase tracking-[0.09em]">
          <Link href="/projects" className="inline-flex items-center gap-1 text-primary hover:text-white">
            Inspect project evidence <ArrowRight size={13} aria-hidden="true" />
          </Link>
          <Link href="/about#operating-model-title" className="inline-flex items-center gap-1 text-zinc-300 hover:text-primary">
            See the operating model <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-button terminal-button-red"></div>
          <div className="terminal-button terminal-button-yellow"></div>
          <div className="terminal-button terminal-button-green"></div>
          <div className="terminal-title">blog_posts.sh</div>
        </div>
        <div className="terminal-content">
          <p className="mb-4">
            <span className="text-primary">$</span> ls -la /articles
          </p>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-6">All Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
        </div>
      </section>
    </div>
  );
}
