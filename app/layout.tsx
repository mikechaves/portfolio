import type React from "react"
import type { Metadata } from "next"
import { Barlow_Condensed, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/footer"
import { JsonLd } from "@/components/json-ld"
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "@/components/ui/toaster"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core"
// Prevent Font Awesome from adding its CSS since we did it manually above
config.autoAddCss = false

// Import our Snow Crash inspired components
import dynamic from "next/dynamic"

// Dynamically import Snow Crash effects to ensure they only load on the client
const SnowCrashEffects = dynamic(
  () => import("@/components/snow-crash-effects").then((m) => m.SnowCrashEffects),
)
import { LabelsProvider } from "@/components/labels-provider"
import { RouteTransition } from "@/components/route-transition"
import { AdaptiveFocusHandoffProvider } from "@/features/adaptive-focus/handoff-context"
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

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
})

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
  preload: true,
})

const isVercelProduction = process.env.VERCEL_ENV === "production"

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
    other: [
      {
        rel: "mask-icon",
        url: "/favicon/favicon.svg",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} ${barlowCondensed.variable} font-mono bg-black text-white min-h-screen flex flex-col`}>
        <JsonLd id="site-structured-data" data={getSiteStructuredData()} />
        <div
          className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0"
          aria-hidden="true"
        ></div>

        {/* SnowCrashEffects keeps the opt-in Metaverse entry available on the homepage. */}
        <SnowCrashEffects />

        <main className="site-main flex-1 relative z-10">
          <AdaptiveFocusHandoffProvider>
            <RouteTransition>{children}</RouteTransition>
          </AdaptiveFocusHandoffProvider>
        </main>
        <Footer />


        <LabelsProvider>
          <Toaster />
        </LabelsProvider>
        {isVercelProduction ? <Analytics /> : null}
      </body>
    </html>
  );
}
