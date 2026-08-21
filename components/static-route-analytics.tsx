import { ShieldCheck } from "lucide-react"
import { normalizeGa4MeasurementId, getAnalyticsPageGroup } from "@/lib/analytics/config"
import {
  PORTFOLIO_ANALYTICS_PROPERTY_ALLOWLIST,
} from "@/lib/portfolio-analytics"
import { SITE_ORIGIN } from "@/lib/seo/site"

const isVercelProduction = process.env.VERCEL_ENV === "production"
const analyticsDebugMode =
  process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "1" && !isVercelProduction
const gaMeasurementId = normalizeGa4MeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)

export const staticAnalyticsPreferencesEnabled =
  analyticsDebugMode || Boolean(gaMeasurementId)

const analyticsRuntimeEnabled =
  staticAnalyticsPreferencesEnabled || isVercelProduction

export function StaticRouteAnalytics({ pathname }: { pathname: string }) {
  if (!analyticsRuntimeEnabled) return null

  return (
    <>
      <div
        hidden
        data-portfolio-analytics
        data-debug-mode={String(analyticsDebugMode)}
        data-production-transport-enabled={String(isVercelProduction)}
        data-ga-measurement-id={gaMeasurementId ?? ""}
        data-canonical-origin={SITE_ORIGIN}
        data-page-path={pathname}
        data-page-group={getAnalyticsPageGroup(pathname)}
        data-property-allowlist={JSON.stringify(PORTFOLIO_ANALYTICS_PROPERTY_ALLOWLIST)}
      />
      {staticAnalyticsPreferencesEnabled ? (
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
      <script src="/scripts/analytics-lite.js" defer data-static-route-analytics-script />
    </>
  )
}
