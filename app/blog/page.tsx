import type { Metadata } from "next"
import { BlogCard } from "@/components/blog-card"
import { JsonLd } from "@/components/json-ld"
import { FocusContextBadge } from "@/components/focus-context-badge"
import { posts } from "@/lib/posts"
import { createPageMetadata } from "@/lib/seo/site"
import { getBlogCollectionStructuredData } from "@/lib/seo/structured-data"

export const metadata: Metadata = createPageMetadata({
  title: "Writing on Design, Storytelling & Interactive Experiences",
  description:
    "Read Mike Chaves’s ideas on experience design, creative exploration, AI-assisted interaction, accessible XR, and emerging technology.",
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
    <div className="cinematic-writing space-y-8 pt-8">
      <JsonLd id="blog-collection-structured-data" data={getBlogCollectionStructuredData(posts)} />
      {focus && <FocusContextBadge focus={focus} />}
      <section className="border-y border-white/15 bg-black/45 px-5 py-8 sm:px-8" aria-labelledby="writing-title">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Essays & notes</p>
        <h1 id="writing-title" className="mt-2 max-w-4xl font-display text-4xl font-semibold uppercase leading-none text-white sm:text-5xl">
          Writing.
        </h1>
      </section>

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
