import Link from "next/link"
import { ArrowRight, AudioWaveform } from "lucide-react"

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
  // If URL is provided, use an anchor tag that opens in a new tab
  // Otherwise, use Next.js Link for internal navigation
  const Component = url ? "a" : Link
  const linkProps = url ? { href: url, target: "_blank", rel: "noopener noreferrer" } : { href: `/blog/${id}` }

  return (
    <Component {...linkProps} className="group grid h-full grid-cols-[3.25rem_1fr] gap-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
      <div className="flex h-12 items-center justify-center border border-[#ff2bd6]/35 text-[#ff2bd6]" aria-hidden="true">
        <AudioWaveform size={28} />
      </div>
      <div>
        <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6rem] uppercase tracking-[0.1em] text-zinc-600">
          {publication ? <span className="text-[#ff2bd6]">{publication}</span> : null}
          <span>{date}</span>
          <span>{readingTime}</span>
        </div>
        <h3 className="text-sm font-semibold leading-5 text-zinc-100 transition-colors group-hover:text-primary">{title}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">{excerpt}</p>
        {url ? (
          <span className="mt-2 inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.1em] text-primary">
            Read on Medium <ArrowRight size={12} aria-hidden="true" />
          </span>
        ) : null}
      </div>
    </Component>
  )
}
