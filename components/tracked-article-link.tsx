"use client"

import { ExternalLink } from "lucide-react"
import { trackPortfolioEvent } from "@/lib/portfolio-analytics"

export function TrackedArticleLink({ articleId, href }: { articleId: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackPortfolioEvent("article_original_opened", {
          article_id: articleId,
          source: "article_summary",
        })
      }
      className="inline-flex min-h-10 items-center gap-2 bg-primary px-4 text-xs font-semibold uppercase tracking-[0.1em] text-black transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      Read original article <ExternalLink size={14} aria-hidden="true" />
    </a>
  )
}
