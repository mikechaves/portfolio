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
  // If URL is provided, use an anchor tag that opens in a new tab
  // Otherwise, use Next.js Link for internal navigation
  const Component = url ? "a" : Link
  const linkProps = url ? { href: url, target: "_blank", rel: "noopener noreferrer" } : { href: `/blog/${id}` }

  return (
    <Component {...linkProps} className="industrial-card">
      <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.16em] text-[#8f8678]">
        <span>{publication}</span>
        <span>{date} / {readingTime}</span>
      </div>
      <h3 className="mt-5">{title}</h3>
      <p className="line-clamp-3 text-sm">{excerpt}</p>
      <span className="industrial-text-link mt-auto">
        Read signal <ArrowRight size={14} />
      </span>
    </Component>
  )
}
