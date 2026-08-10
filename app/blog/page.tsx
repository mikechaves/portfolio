import type { Metadata } from "next"
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
      <h1 className="sr-only">Blog</h1>
      {focus && <FocusContextBadge focus={focus} />}
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
