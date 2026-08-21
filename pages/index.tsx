import Head from "next/head"
import { Footer } from "@/components/footer"
import { HomepageContent } from "@/components/homepage-content"
import { JsonLd } from "@/components/json-ld"
import { SiteNav } from "@/components/site-nav"
import {
  StaticRouteAnalytics,
  staticAnalyticsPreferencesEnabled,
} from "@/components/static-route-analytics"
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_SOCIAL_IMAGE,
  getAbsoluteUrl,
  isProductionIndexingEnabled,
  SITE_NAME,
  SITE_ORIGIN,
  SITE_TITLE,
} from "@/lib/seo/site"
import { getSiteStructuredData } from "@/lib/seo/structured-data"

const indexingEnabled = isProductionIndexingEnabled()
const socialImage = getAbsoluteUrl(DEFAULT_SOCIAL_IMAGE)

export const config = {
  unstable_runtimeJS: false,
}

export default function HomePage() {
  const robotsContent = indexingEnabled
    ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    : "noindex, nofollow"

  return (
    <>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={DEFAULT_DESCRIPTION} />
        <meta name="application-name" content={`${SITE_NAME} Portfolio`} />
        <meta name="author" content={SITE_NAME} />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="robots" content={robotsContent} />
        <meta name="googlebot" content={robotsContent} />
        <link rel="canonical" href={SITE_ORIGIN} />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="icon" href="/favicon/favicon.ico" />
        <link rel="shortcut icon" href="/favicon/favicon-96x96.png" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <link
          rel="preload"
          as="image"
          href="/visuals/black-sun-signal-grid-static.webp"
          fetchPriority="high"
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:url" content={SITE_ORIGIN} />
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:description" content={DEFAULT_DESCRIPTION} />
        <meta property="og:image" content={socialImage} />
        <meta property="og:image:alt" content={`${SITE_NAME} — AI-Native Design Engineer`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SITE_TITLE} />
        <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
        <meta name="twitter:image" content={socialImage} />
        <meta name="twitter:image:alt" content={`${SITE_NAME} — AI-Native Design Engineer`} />
        {process.env.GOOGLE_SITE_VERIFICATION ? (
          <meta name="google-site-verification" content={process.env.GOOGLE_SITE_VERIFICATION} />
        ) : null}
      </Head>

      <JsonLd id="site-structured-data" data={getSiteStructuredData()} />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div
        className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0"
        aria-hidden="true"
      />

      <SiteNav />
      <main id="main-content" tabIndex={-1} className="site-main flex-1 relative z-10">
        <HomepageContent />
      </main>
      <Footer analyticsPreferencesEnabled={staticAnalyticsPreferencesEnabled} />
      <StaticRouteAnalytics pathname="/" />
      <script src="/scripts/homepage.js" defer data-homepage-script />
      <script src="/scripts/portfolio-events.js" defer />
      <script src="/scripts/site-nav.js" defer />
    </>
  )
}
