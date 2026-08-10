"use client"

import Link from "next/link"
import type { ComponentProps } from "react"
import {
  trackPortfolioEvent,
  type PortfolioAnalyticsEventMap,
  type PortfolioAnalyticsEventName,
} from "@/lib/portfolio-analytics"

type TrackedPortfolioLinkProps<Name extends PortfolioAnalyticsEventName> = Omit<
  ComponentProps<typeof Link>,
  "onClick"
> & {
  eventName: Name
  eventProperties: PortfolioAnalyticsEventMap[Name]
}

export function TrackedPortfolioLink<Name extends PortfolioAnalyticsEventName>({
  eventName,
  eventProperties,
  ...linkProps
}: TrackedPortfolioLinkProps<Name>) {
  return (
    <Link
      {...linkProps}
      onClick={() => trackPortfolioEvent(eventName, eventProperties)}
    />
  )
}
