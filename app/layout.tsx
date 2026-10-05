import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Footer } from "@/components/footer"
import { AnalyticsManager } from "@/components/analytics-manager"
import { JsonLd } from "@/components/json-ld"
import { SiteNav } from "@/components/site-nav"
import {
  createRobotsMetadata,
  DEFAULT_DESCRIPTION,
  DEFAULT_SOCIAL_IMAGE,
  DEFAULT_SOCIAL_IMAGE_ALT,
  DEFAULT_SOCIAL_IMAGE_PROPERTIES,
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
const analyticsRuntimeEnabled = analyticsPreferencesEnabled || isVercelProduction

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
        alt: DEFAULT_SOCIAL_IMAGE_ALT,
        ...DEFAULT_SOCIAL_IMAGE_PROPERTIES,
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
        alt: DEFAULT_SOCIAL_IMAGE_ALT,
      },
    ],
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  manifest: "/favicon/site.webmanifest?v=chaves-key",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico?v=chaves-key", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/favicon/favicon.svg?v=chaves-key", sizes: "any", type: "image/svg+xml" },
    ],
    shortcut: "/favicon/favicon-32x32.png?v=chaves-key",
    apple: "/favicon/apple-touch-icon.png?v=chaves-key",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/instrument-serif.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="cinematic-site min-h-screen flex flex-col">
        <JsonLd id="site-structured-data" data={getSiteStructuredData()} />
        <a href="#main-content" className="skip-link">Skip to main content</a>


        <SiteNav />

        <main id="main-content" tabIndex={-1} className="site-main flex-1 relative z-10">
          {children}
        </main>
        <Footer analyticsPreferencesEnabled={analyticsPreferencesEnabled} />
        <script src="/scripts/portfolio-events.js" defer />
        <script src="/scripts/site-nav.js" defer />
        <script src="/scripts/cinematic.js" defer />
        {analyticsRuntimeEnabled ? (
          <AnalyticsManager
            canonicalOrigin={SITE_ORIGIN}
            debugMode={analyticsDebugMode}
            gaMeasurementId={gaMeasurementId}
            productionTransportEnabled={isVercelProduction}
          />
        ) : null}
      </body>
    </html>
  );
}
