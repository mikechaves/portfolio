import Link from "next/link"
import type { ComponentProps } from "react"
import type {
  PortfolioAnalyticsEventMap,
  PortfolioAnalyticsEventName,
} from "@/lib/portfolio-analytics"

type PortfolioEventLinkProps<Name extends PortfolioAnalyticsEventName> = Omit<
  ComponentProps<typeof Link>,
  "onClick"
> & {
  eventName: Name
  eventProperties: PortfolioAnalyticsEventMap[Name]
  homeFocusTargetId?: string
  homeTargetId?: string
}

export function PortfolioEventLink<Name extends PortfolioAnalyticsEventName>({
  eventName,
  eventProperties,
  homeFocusTargetId,
  homeTargetId,
  ...linkProps
}: PortfolioEventLinkProps<Name>) {
  return (
    <Link
      {...linkProps}
      data-portfolio-event={eventName}
      data-portfolio-properties={JSON.stringify(eventProperties)}
      data-home-focus-target-id={homeFocusTargetId}
      data-home-target-id={homeTargetId}
    />
  )
}
