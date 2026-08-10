import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, MessageSquareText } from "lucide-react"
import { JsonLd } from "@/components/json-ld"
import { TrackedArticleLink } from "@/components/tracked-article-link"
import { getRelatedProjectsForArticle } from "@/lib/content-relationships"
import { getArticleStructuredData } from "@/lib/seo/structured-data"
import type { Post } from "@/types/post"

interface ArticleSummaryPageProps {
  gradientClassName: string
  post: Post
  summary: readonly [string, string]
}

export function ArticleSummaryPage({ gradientClassName, post, summary }: ArticleSummaryPageProps) {
  const relatedProjects = getRelatedProjectsForArticle(post.id)

  return (
    <article className="mx-auto max-w-3xl space-y-8 pt-8">
      <JsonLd id="article-structured-data" data={getArticleStructuredData(post)} />

      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.1em] text-zinc-500">
        <Link href="/" className="transition-colors hover:text-primary">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/blog" className="transition-colors hover:text-primary">Writing</Link>
        <span aria-hidden="true">/</span>
        <span className="text-zinc-300" aria-current="page">{post.title}</span>
      </nav>

      <div className={`relative h-64 overflow-hidden border border-white/10 ${gradientClassName}`}>
        <Image
          src={post.image}
          alt={`${post.title} article preview`}
          fill
          className="object-cover mix-blend-overlay opacity-70"
          sizes="(min-width: 1024px) 768px, 100vw"
          priority
        />
      </div>

      <header>
        <div className="mb-3 inline-block border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
          {post.publication}
        </div>
        <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">{post.title}</h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-zinc-400">
          <time dateTime={post.publishedAt}>{post.date}</time>
          <span>{post.readingTime}</span>
        </div>
      </header>

      <section className="border border-zinc-800 bg-black p-6" aria-labelledby="article-summary-title">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary">On-site summary</p>
        <h2 id="article-summary-title" className="mb-4 text-xl font-bold">What this article examines</h2>
        <div className="space-y-4 leading-7 text-zinc-400">
          {summary.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      {relatedProjects.length > 0 ? (
        <section className="border-y border-white/10 py-6" aria-labelledby="related-projects-title">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary">Evidence behind the ideas</p>
          <h2 id="related-projects-title" className="mb-4 text-xl font-bold">Related project case studies</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedProjects.map((project) => (
              <Link
                key={project.projectId}
                href={`/projects/${project.projectId}`}
                className="group border border-white/15 bg-black/50 p-4 transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <strong className="flex items-center justify-between gap-3 text-sm uppercase tracking-[0.06em] text-white group-hover:text-primary">
                  {project.title}
                  <ArrowRight size={15} aria-hidden="true" />
                </strong>
                <span className="mt-2 block text-xs leading-5 text-zinc-500">{project.reason}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="border border-zinc-800 bg-black p-6" aria-labelledby="article-next-step-title">
        <h2 id="article-next-step-title" className="text-xl font-bold">Continue from the summary</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
          Read the complete original on Medium, inspect the supporting portfolio evidence, or start a conversation about a related product problem.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <TrackedArticleLink articleId={post.id} href={post.url} />
          <Link
            href="/projects"
            className="inline-flex min-h-10 items-center gap-2 border border-white/20 px-4 text-xs uppercase tracking-[0.1em] text-zinc-200 transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Browse project evidence <ArrowRight size={14} aria-hidden="true" />
          </Link>
          <Link
            href="/about#contact-title"
            className="inline-flex min-h-10 items-center gap-2 border border-white/20 px-4 text-xs uppercase tracking-[0.1em] text-zinc-200 transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Start a conversation <MessageSquareText size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
        <ArrowLeft size={16} aria-hidden="true" /> Back to all writing
      </Link>
    </article>
  )
}
