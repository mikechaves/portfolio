import { BlogCard } from "@/components/blog-card"
import { FocusContextBadge } from "@/components/focus-context-badge"
import { posts } from "@/lib/posts"

interface BlogPageProps {
  searchParams?: Promise<{ focus?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {}
  const focus = resolvedSearchParams.focus?.trim() ?? ""

  return (
    <div className="industrial-page">
      <p className="industrial-page-kicker">Writing</p>
      <h1 className="industrial-page-title">Signals from the edge</h1>
      <p className="industrial-page-intro">
        Notes on AI-native products, spatial interfaces, ambiguity, and execution.
      </p>
      {focus && <FocusContextBadge focus={focus} />}
      <div className="industrial-rule" />
      <section className="industrial-grid md:grid-cols-2">
        {posts.map((post) => (
          <BlogCard key={post.id} {...post} />
        ))}
      </section>
    </div>
  )
}
