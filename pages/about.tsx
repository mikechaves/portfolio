import Head from "next/head"
import { AboutContent } from "@/components/about-content"
import { Footer } from "@/components/footer"
import { JsonLd } from "@/components/json-ld"
import { SiteNav } from "@/components/site-nav"
import {
  StaticRouteAnalytics,
  staticAnalyticsPreferencesEnabled,
} from "@/components/static-route-analytics"
import {
  DEFAULT_SOCIAL_IMAGE,
  getAbsoluteUrl,
  getCanonicalUrl,
  isProductionIndexingEnabled,
  SITE_NAME,
} from "@/lib/seo/site"
import {
  getProfilePageStructuredData,
  getSiteStructuredData,
} from "@/lib/seo/structured-data"

const title = "AI-Native Design Engineer: Approach & Experience | Mike Chaves"
const description =
  "How Mike Chaves frames workflows, builds AI-native product systems, instruments human review, and turns reviewed evidence into operational product decisions."
const canonical = getCanonicalUrl("/about")
const socialImage = getAbsoluteUrl(DEFAULT_SOCIAL_IMAGE)
const imageAlt = "Mike Chaves operating model and professional experience"
const indexingEnabled = isProductionIndexingEnabled()

export const config = {
  unstable_runtimeJS: false,
}

export default function AboutPage() {
  const robotsContent = indexingEnabled
    ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    : "noindex, nofollow"

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={description} />
        <meta name="application-name" content={`${SITE_NAME} Portfolio`} />
        <meta name="author" content={SITE_NAME} />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="robots" content={robotsContent} />
        <meta name="googlebot" content={robotsContent} />
        <link rel="canonical" href={canonical} />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="icon" href="/favicon/favicon.ico" />
        <link rel="shortcut icon" href="/favicon/favicon-96x96.png" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={socialImage} />
        <meta property="og:image:alt" content={imageAlt} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={socialImage} />
        <meta name="twitter:image:alt" content={imageAlt} />
        {process.env.GOOGLE_SITE_VERIFICATION ? (
          <meta name="google-site-verification" content={process.env.GOOGLE_SITE_VERIFICATION} />
        ) : null}
      </Head>

      <JsonLd id="site-structured-data" data={getSiteStructuredData()} />
      <JsonLd id="profile-page-structured-data" data={getProfilePageStructuredData()} />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div
        className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0"
        aria-hidden="true"
      />

      <SiteNav />
      <main id="main-content" tabIndex={-1} className="site-main flex-1 relative z-10">
        <AboutContent />
      </main>
      <Footer analyticsPreferencesEnabled={staticAnalyticsPreferencesEnabled} />
      <StaticRouteAnalytics pathname="/about" />
      <script src="/scripts/about.js" defer data-about-script />
      <script src="/scripts/portfolio-events.js" defer />
      <script src="/scripts/site-nav.js" defer />
    </>
  )
}
