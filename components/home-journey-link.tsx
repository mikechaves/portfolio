"use client"

import Link from "next/link"
import type { ComponentProps, MouseEvent, ReactNode } from "react"
import { trackPortfolioEvent } from "@/lib/portfolio-analytics"

interface HomeJourneyLinkProps
  extends Omit<ComponentProps<typeof Link>, "href" | "onClick"> {
  children: ReactNode
  focusTargetId?: string
  path: "selected_work" | "role_match"
  targetId: string
}

export function HomeJourneyLink({
  children,
  focusTargetId,
  path,
  targetId,
  ...linkProps
}: HomeJourneyLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(targetId)
    if (!target) return

    event.preventDefault()
    trackPortfolioEvent("homepage_path_selected", {
      path,
      source: "home_hero",
    })

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" })
    window.history.replaceState(null, "", `#${targetId}`)

    if (focusTargetId) {
      window.setTimeout(() => {
        document.getElementById(focusTargetId)?.focus({ preventScroll: true })
      }, reducedMotion ? 0 : 260)
    }
  }

  return (
    <Link {...linkProps} href={`#${targetId}`} onClick={handleClick}>
      {children}
    </Link>
  )
}
