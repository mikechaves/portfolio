import type { Ga4Event } from "@/lib/analytics/ga4"

declare global {
  interface Navigator {
    globalPrivacyControl?: boolean
  }

  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    __portfolioAnalyticsDebugEvents?: Ga4Event[]
  }
}

export {}
