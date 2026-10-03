import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface BlogCardProps {
  id: string
  title: string
  excerpt: string
  date: string
  readingTime: string
  url?: string
  publication?: string
}

export function BlogCard({ id, title, excerpt, date, readingTime, url, publication }: BlogCardProps) {
  return (
    <Link href={`/blog/${id}`} className="cinematic-blog-card group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
      <div>
        <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6rem] uppercase tracking-[0.1em] text-zinc-600">
          {publication ? <span className="text-primary">{publication}</span> : null}
          <span>{date}</span>
          <span>{readingTime}</span>
        </div>
        <h3 className="text-sm font-semibold leading-5 text-zinc-100 transition-colors group-hover:text-primary">{title}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">{excerpt}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.1em] text-primary">
          {url ? "Read summary and original" : "Read summary"} <ArrowRight size={12} aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
