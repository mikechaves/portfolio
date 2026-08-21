import type { ComponentProps, ReactNode } from "react"
import { PortfolioEventLink } from "@/components/portfolio-event-link"

interface HomeJourneyLinkProps
  extends Omit<ComponentProps<typeof PortfolioEventLink>, "eventName" | "eventProperties" | "href"> {
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
  return (
    <PortfolioEventLink
      {...linkProps}
      href={`#${targetId}`}
      eventName="homepage_path_selected"
      eventProperties={{ path, source: "home_hero" }}
      homeFocusTargetId={focusTargetId}
      homeTargetId={targetId}
    >
      {children}
    </PortfolioEventLink>
  )
}
