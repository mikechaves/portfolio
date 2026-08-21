import Head from "next/head"
import { ShieldCheck } from "lucide-react"
import { Footer } from "@/components/footer"
import { HomepageContent } from "@/components/homepage-content"
import { JsonLd } from "@/components/json-ld"
import { SiteNav } from "@/components/site-nav"
import { normalizeGa4MeasurementId } from "@/lib/analytics/config"
import { PORTFOLIO_ANALYTICS_PROPERTY_ALLOWLIST } from "@/lib/portfolio-analytics"
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

const isVercelProduction = process.env.VERCEL_ENV === "production"
const analyticsDebugMode =
  process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "1" && !isVercelProduction
const gaMeasurementId = normalizeGa4MeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)
const analyticsPreferencesEnabled = analyticsDebugMode || Boolean(gaMeasurementId)
const analyticsRuntimeEnabled = analyticsPreferencesEnabled || isVercelProduction
const indexingEnabled = isProductionIndexingEnabled()
const socialImage = getAbsoluteUrl(DEFAULT_SOCIAL_IMAGE)

export const config = {
  unstable_runtimeJS: false,
}

function HomepageAnalytics() {
  if (!analyticsRuntimeEnabled) return null

  return (
    <>
      <div
        hidden
        data-home-analytics
        data-debug-mode={String(analyticsDebugMode)}
        data-production-transport-enabled={String(isVercelProduction)}
        data-ga-measurement-id={gaMeasurementId ?? ""}
        data-canonical-origin={SITE_ORIGIN}
        data-property-allowlist={JSON.stringify(PORTFOLIO_ANALYTICS_PROPERTY_ALLOWLIST)}
      />
      {analyticsPreferencesEnabled ? (
        <section
          hidden
          role="region"
          aria-label="Optional analytics preferences"
          className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-3xl border border-primary/45 bg-black/95 p-4 shadow-2xl shadow-black sm:p-5"
          data-analytics-preferences-panel
        >
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 shrink-0 text-primary" size={20} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-white">
                  Optional analytics
                </h2>
                {analyticsDebugMode ? (
                  <span className="border border-amber-400/40 px-1.5 py-0.5 text-[0.58rem] uppercase tracking-[0.08em] text-amber-300">
                    Local debug / network blocked
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-xs leading-5 text-zinc-400">
                Google Analytics helps measure which portfolio paths lead to useful evidence and
                contact. It loads only after permission and never receives role text, contact
                fields, article content, prompts, or private material. Cookieless Vercel traffic
                analytics remains production-only.
              </p>
              <div hidden data-analytics-privacy-controls>
                <p className="mt-3 text-xs leading-5 text-zinc-300">
                  Your browser is sending Global Privacy Control or Do Not Track, so optional
                  Google Analytics remains off.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="min-h-10 border border-white/20 px-4 text-xs uppercase tracking-[0.08em] text-zinc-200 hover:border-primary/60 hover:text-primary"
                    data-analytics-close
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2" data-analytics-standard-controls>
                <button
                  type="button"
                  className="min-h-10 bg-primary px-4 text-xs font-semibold uppercase tracking-[0.08em] text-black hover:bg-primary/90"
                  data-analytics-allow
                >
                  Allow optional analytics
                </button>
                <button
                  type="button"
                  className="min-h-10 border border-white/20 px-4 text-xs uppercase tracking-[0.08em] text-zinc-200 hover:border-primary/60 hover:text-primary"
                  data-analytics-deny
                >
                  Keep optional analytics off
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : null}
      <script src="/scripts/analytics-lite.js" defer data-home-analytics-script />
    </>
  )
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
      <Footer analyticsPreferencesEnabled={analyticsPreferencesEnabled} />
      <HomepageAnalytics />
      <script src="/scripts/homepage.js" defer data-homepage-script />
      <script src="/scripts/portfolio-events.js" defer />
      <script src="/scripts/site-nav.js" defer />
    </>
  )
}
