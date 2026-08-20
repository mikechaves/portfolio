import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Footer } from "@/components/footer"
import { AnalyticsManager } from "@/components/analytics-manager"
import { JsonLd } from "@/components/json-ld"
import { Toaster } from "@/components/ui/toaster"
import { SnowCrashEffects } from "@/components/snow-crash-effects"

import { LabelsProvider } from "@/components/labels-provider"
import { RouteTransition } from "@/components/route-transition"
import {
  createRobotsMetadata,
  DEFAULT_DESCRIPTION,
  DEFAULT_SOCIAL_IMAGE,
  getAbsoluteUrl,
  getCanonicalUrl,
  SITE_NAME,
  SITE_ORIGIN,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/seo/site"
import { getSiteStructuredData } from "@/lib/seo/structured-data"
import { normalizeGa4MeasurementId } from "@/lib/analytics/config"

const isVercelProduction = process.env.VERCEL_ENV === "production"
const gaMeasurementId = normalizeGa4MeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)
const analyticsDebugMode =
  process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "1" && !isVercelProduction
const analyticsPreferencesEnabled = analyticsDebugMode || Boolean(gaMeasurementId)

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: `${SITE_NAME} Portfolio`,
  authors: [{ name: SITE_NAME, url: SITE_ORIGIN }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  referrer: "strict-origin-when-cross-origin",
  alternates: { canonical: getCanonicalUrl("/") },
  robots: createRobotsMetadata(),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    url: getCanonicalUrl("/"),
    title: SITE_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: getAbsoluteUrl(DEFAULT_SOCIAL_IMAGE),
        alt: `${SITE_NAME} — AI-Native Design Engineer`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: getAbsoluteUrl(DEFAULT_SOCIAL_IMAGE),
        alt: `${SITE_NAME} — AI-Native Design Engineer`,
      },
    ],
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  manifest: "/favicon/site.webmanifest",
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon-96x96.png",
    apple: "/favicon/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-mono bg-black text-white min-h-screen flex flex-col">
        <JsonLd id="site-structured-data" data={getSiteStructuredData()} />
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <div
          className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0"
          aria-hidden="true"
        ></div>

        {/* SnowCrashEffects keeps the opt-in Metaverse entry available on the homepage. */}
        <SnowCrashEffects />

        <main id="main-content" tabIndex={-1} className="site-main flex-1 relative z-10">
          <RouteTransition>{children}</RouteTransition>
        </main>
        <Footer analyticsPreferencesEnabled={analyticsPreferencesEnabled} />


        <LabelsProvider>
          <Toaster />
        </LabelsProvider>
        <AnalyticsManager
          canonicalOrigin={SITE_ORIGIN}
          debugMode={analyticsDebugMode}
          gaMeasurementId={gaMeasurementId}
          productionTransportEnabled={isVercelProduction}
        />
      </body>
    </html>
  );
}
