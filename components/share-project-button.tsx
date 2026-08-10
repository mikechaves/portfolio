"use client"

import { Check, Share2 } from "lucide-react"
import { useState } from "react"
import { trackPortfolioEvent } from "@/lib/portfolio-analytics"
import { getCanonicalUrl } from "@/lib/seo/site"

export function ShareProjectButton({ projectId, title }: { projectId: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const shareUrl = getCanonicalUrl(`/projects/${projectId}`)

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url: shareUrl })
        trackPortfolioEvent("project_shared", {
          method: "native",
          project_id: projectId,
          source: "project_header",
        })
        return
      }

      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      trackPortfolioEvent("project_shared", {
        method: "clipboard",
        project_id: projectId,
        source: "project_header",
      })
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // A cancelled native share or unavailable clipboard should not interrupt the case study.
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleShare()}
      className="inline-flex min-h-10 items-center gap-2 border border-white/20 bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-zinc-200 transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-live="polite"
    >
      {copied ? <Check size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
      {copied ? "Link copied" : "Share case study"}
    </button>
  )
}
