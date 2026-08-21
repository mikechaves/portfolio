"use client"

import Script from "next/script"
import { usePathname } from "next/navigation"
import { track as trackVercelEvent } from "@vercel/analytics"
import { Analytics } from "@vercel/analytics/next"
import { ShieldCheck } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  ANALYTICS_PREFERENCES_EVENT,
  getAnalyticsPageGroup,
  parseAnalyticsConsent,
  type AnalyticsConsent,
} from "@/lib/analytics/config"
import { mapPortfolioEventToGa4, type Ga4Event } from "@/lib/analytics/ga4"
import {
  buildPortfolioAnalyticsProperties,
  PORTFOLIO_ANALYTICS_BROWSER_EVENT,
  type PortfolioAnalyticsEventMap,
  type PortfolioAnalyticsBrowserEventDetail,
} from "@/lib/portfolio-analytics"

interface AnalyticsManagerProps {
  canonicalOrigin: string
  debugMode: boolean
  gaMeasurementId: string | null
  productionTransportEnabled: boolean
}

const ANALYTICS_DEBUG_SESSION_KEY = "portfolio:analytics:debug-events:v1"

function readDebugSessionEvents(): Ga4Event[] {
  try {
    const navigation = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined
    if (navigation?.type === "reload") {
      window.sessionStorage.removeItem(ANALYTICS_DEBUG_SESSION_KEY)
      return []
    }

    const stored = window.sessionStorage.getItem(ANALYTICS_DEBUG_SESSION_KEY)
    if (!stored) return []
    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (event): event is Ga4Event =>
        Boolean(event) &&
        typeof event === "object" &&
        typeof (event as Ga4Event).name === "string" &&
        Boolean((event as Ga4Event).parameters) &&
        typeof (event as Ga4Event).parameters === "object"
    )
  } catch {
    return []
  }
}

function browserPrivacySignalEnabled(): boolean {
  return navigator.globalPrivacyControl === true || navigator.doNotTrack === "1"
}

function removeGaCookies() {
  const hostnameParts = window.location.hostname.split(".")
  const registrableDomain = hostnameParts.slice(-2).join(".")
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim()
    if (!name?.startsWith("_ga")) continue
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${window.location.hostname}; SameSite=Lax`
    if (registrableDomain.includes(".")) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${registrableDomain}; SameSite=Lax`
    }
  }
}

export function AnalyticsManager({
  canonicalOrigin,
  debugMode,
  gaMeasurementId,
  productionTransportEnabled,
}: AnalyticsManagerProps) {
  const pathname = usePathname() ?? "/"
  const [consent, setConsent] = useState<AnalyticsConsent>("unknown")
  const [gaReady, setGaReady] = useState(false)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [privacySignal, setPrivacySignal] = useState(false)
  const initializedMeasurement = useRef<string | null>(null)
  const lastPageView = useRef<string | null>(null)
  const optionalAnalyticsAvailable = debugMode || Boolean(gaMeasurementId)

  const emitGa4 = useCallback(
    (event: Ga4Event) => {
      if (debugMode) {
        window.__portfolioAnalyticsDebugEvents ??= []
        window.__portfolioAnalyticsDebugEvents.push(event)
        try {
          window.sessionStorage.setItem(
            ANALYTICS_DEBUG_SESSION_KEY,
            JSON.stringify(window.__portfolioAnalyticsDebugEvents)
          )
        } catch {
          // Debug capture remains available in memory when session storage is unavailable.
        }
        return
      }

      if (productionTransportEnabled && window.gtag) {
        window.gtag("event", event.name, event.parameters)
      }
    },
    [debugMode, productionTransportEnabled]
  )

  useEffect(() => {
    if (debugMode) window.__portfolioAnalyticsDebugEvents = readDebugSessionEvents()
    if (!optionalAnalyticsAvailable) return

    const hasPrivacySignal = browserPrivacySignalEnabled()
    setPrivacySignal(hasPrivacySignal)
    if (hasPrivacySignal) {
      setConsent("denied")
      return
    }

    let storedConsent: AnalyticsConsent = "unknown"
    try {
      storedConsent = parseAnalyticsConsent(window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY))
    } catch {
      // Storage denial keeps optional analytics off until the visitor makes an in-session choice.
    }
    setConsent(storedConsent)
    setPreferencesOpen(storedConsent === "unknown")
  }, [debugMode, optionalAnalyticsAvailable])

  useEffect(() => {
    const openPreferences = () => setPreferencesOpen(true)
    window.addEventListener(ANALYTICS_PREFERENCES_EVENT, openPreferences)
    return () => window.removeEventListener(ANALYTICS_PREFERENCES_EVENT, openPreferences)
  }, [])

  useEffect(() => {
    if (consent !== "granted") {
      lastPageView.current = null
      setGaReady(false)
      if (window.gtag) {
        window.gtag("consent", "update", { analytics_storage: "denied" })
      }
      if (consent === "denied") removeGaCookies()
      return
    }

    if (debugMode) {
      setGaReady(true)
      return
    }

    if (!productionTransportEnabled || !gaMeasurementId) return

    window.dataLayer ??= []
    window.gtag ??= (...args: unknown[]) => {
      window.dataLayer?.push(args)
    }

    if (initializedMeasurement.current !== gaMeasurementId) {
      window.gtag("consent", "default", {
        ad_personalization: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        analytics_storage: "granted",
      })
      window.gtag("js", new Date())
      window.gtag("config", gaMeasurementId, {
        allow_ad_personalization_signals: false,
        allow_google_signals: false,
        anonymize_ip: true,
        send_page_view: false,
      })
      initializedMeasurement.current = gaMeasurementId
    } else {
      window.gtag("consent", "update", { analytics_storage: "granted" })
    }
    setGaReady(true)
  }, [consent, debugMode, gaMeasurementId, productionTransportEnabled])

  useEffect(() => {
    const handlePortfolioEvent = (event: Event) => {
      const detail = (event as CustomEvent<PortfolioAnalyticsBrowserEventDetail>).detail
      if (!detail) return
      const properties = buildPortfolioAnalyticsProperties(
        detail.name,
        detail.properties as PortfolioAnalyticsEventMap[typeof detail.name]
      )

      if (productionTransportEnabled) {
        try {
          trackVercelEvent(detail.name, properties)
        } catch {
          // Provider failures must not interrupt portfolio actions.
        }
      }

      if (consent === "granted" && gaReady) {
        emitGa4(mapPortfolioEventToGa4(detail.name, properties))
      }
    }

    window.addEventListener(PORTFOLIO_ANALYTICS_BROWSER_EVENT, handlePortfolioEvent)
    return () => window.removeEventListener(PORTFOLIO_ANALYTICS_BROWSER_EVENT, handlePortfolioEvent)
  }, [consent, emitGa4, gaReady, productionTransportEnabled])

  useEffect(() => {
    if (consent !== "granted" || !gaReady) return
    const normalizedPath = pathname.replace(/\/$/u, "") || "/"
    if (lastPageView.current === normalizedPath) return
    lastPageView.current = normalizedPath

    emitGa4({
      name: "page_view",
      parameters: {
        page_group: getAnalyticsPageGroup(normalizedPath),
        page_location: new URL(normalizedPath, canonicalOrigin).toString(),
        page_path: normalizedPath,
        page_title: document.title,
      },
    })
  }, [canonicalOrigin, consent, emitGa4, gaReady, pathname])

  const chooseConsent = (nextConsent: Exclude<AnalyticsConsent, "unknown">) => {
    setConsent(nextConsent)
    setPreferencesOpen(false)
    try {
      window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, nextConsent)
    } catch {
      // The in-memory choice remains effective for this page when storage is unavailable.
    }
  }

  return (
    <>
      {productionTransportEnabled ? <Analytics /> : null}
      {productionTransportEnabled && gaMeasurementId && consent === "granted" ? (
        <Script
          id="portfolio-ga4"
          src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
          strategy="afterInteractive"
        />
      ) : null}

      {optionalAnalyticsAvailable && preferencesOpen ? (
        <section
          role="region"
          aria-label="Optional analytics preferences"
          className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-3xl border border-primary/45 bg-black/95 p-4 shadow-2xl shadow-black sm:p-5"
        >
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 shrink-0 text-primary" size={20} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-white">Optional analytics</h2>
                {debugMode ? (
                  <span className="border border-amber-400/40 px-1.5 py-0.5 text-[0.58rem] uppercase tracking-[0.08em] text-amber-300">
                    Local debug / network blocked
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-xs leading-5 text-zinc-400">
                Google Analytics helps measure which portfolio paths lead to useful evidence and contact. It loads only after permission and never receives role text, contact fields, article content, prompts, or private material. Cookieless Vercel traffic analytics remains production-only.
              </p>
              {privacySignal ? (
                <p className="mt-3 text-xs leading-5 text-zinc-300">
                  Your browser is sending Global Privacy Control or Do Not Track, so optional Google Analytics remains off.
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                {privacySignal ? (
                  <button
                    type="button"
                    onClick={() => setPreferencesOpen(false)}
                    className="min-h-10 border border-white/20 px-4 text-xs uppercase tracking-[0.08em] text-zinc-200 hover:border-primary/60 hover:text-primary"
                  >
                    Close
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => chooseConsent("granted")}
                      className="min-h-10 bg-primary px-4 text-xs font-semibold uppercase tracking-[0.08em] text-black hover:bg-primary/90"
                    >
                      Allow optional analytics
                    </button>
                    <button
                      type="button"
                      onClick={() => chooseConsent("denied")}
                      className="min-h-10 border border-white/20 px-4 text-xs uppercase tracking-[0.08em] text-zinc-200 hover:border-primary/60 hover:text-primary"
                    >
                      Keep optional analytics off
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
