(() => {
  const browserEventName = "portfolio:analytics-event"
  const consentStorageKey = "portfolio.analytics-consent.v1"
  const debugSessionKey = "portfolio:analytics:debug-events:v1"
  const config = document.querySelector("[data-portfolio-analytics]")
  if (!(config instanceof HTMLElement)) return

  let allowedProperties = {}
  try {
    const parsedAllowlist = JSON.parse(config.dataset.propertyAllowlist || "{}")
    if (parsedAllowlist && typeof parsedAllowlist === "object") {
      allowedProperties = parsedAllowlist
    }
  } catch {
    // A missing or invalid allowlist fails closed for custom event properties.
  }

  const debugMode = config.dataset.debugMode === "true"
  const productionTransportEnabled =
    config.dataset.productionTransportEnabled === "true"
  const gaMeasurementId = /^G-[A-Z0-9]+$/u.test(config.dataset.gaMeasurementId || "")
    ? config.dataset.gaMeasurementId
    : null
  const canonicalOrigin = config.dataset.canonicalOrigin || window.location.origin
  const pagePath = config.dataset.pagePath || "/"
  const pageGroup = config.dataset.pageGroup || "utility"
  const preferencesPanel = document.querySelector("[data-analytics-preferences-panel]")
  const privacyControls = document.querySelector("[data-analytics-privacy-controls]")
  const standardControls = document.querySelector("[data-analytics-standard-controls]")
  const privacySignal =
    navigator.globalPrivacyControl === true || navigator.doNotTrack === "1"
  let consent = "unknown"
  let gaReady = false
  let pageViewSent = false

  const readDebugEvents = () => {
    try {
      const navigation = performance.getEntriesByType("navigation")[0]
      if (navigation?.type === "reload") {
        window.sessionStorage.removeItem(debugSessionKey)
        return []
      }

      const stored = window.sessionStorage.getItem(debugSessionKey)
      if (!stored) return []
      const parsed = JSON.parse(stored)
      if (!Array.isArray(parsed)) return []
      return parsed.filter(
        (event) =>
          event &&
          typeof event === "object" &&
          typeof event.name === "string" &&
          event.parameters &&
          typeof event.parameters === "object"
      )
    } catch {
      return []
    }
  }

  const persistDebugEvents = () => {
    try {
      window.sessionStorage.setItem(
        debugSessionKey,
        JSON.stringify(window.__portfolioAnalyticsDebugEvents || [])
      )
    } catch {
      // The in-memory debug buffer remains available when storage is unavailable.
    }
  }

  const sanitizeProperties = (name, properties) => {
    const allowedKeys = allowedProperties[name]
    if (!Array.isArray(allowedKeys) || !properties || typeof properties !== "object") return null

    const safe = {}
    for (const key of allowedKeys) {
      const value = properties[key]
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        value === null
      ) {
        safe[key] = value
      }
    }
    return safe
  }

  const mapToGa4 = (name, properties) => {
    switch (name) {
      case "project_evidence_opened":
        return {
          name: "select_content",
          parameters: {
            content_type: "project_evidence",
            item_id: String(properties.project_id),
            match_level: String(properties.match_level),
            source: String(properties.source),
          },
        }
      case "article_original_opened":
        return {
          name: "select_content",
          parameters: {
            content_type: "original_article",
            item_id: String(properties.article_id),
            source: String(properties.source),
          },
        }
      case "public_practice_item_opened":
        return {
          name: "select_content",
          parameters: {
            content_type: String(properties.item_type),
            item_id: String(properties.item_id),
            source: String(properties.source),
          },
        }
      case "homepage_path_selected":
        return {
          name: "select_content",
          parameters: {
            content_type: "homepage_path",
            item_id: String(properties.path),
            source: String(properties.source),
          },
        }
      case "adaptive_focus_more_lenses_expanded":
        return {
          name: "view_item_list",
          parameters: {
            item_list_id: "adaptive_focus_more_lenses",
            source: String(properties.entry_point),
          },
        }
      case "metaverse_entered":
        return {
          name: "select_content",
          parameters: {
            content_type: "optional_metaverse",
            item_id: "metaverse",
            source: String(properties.source),
          },
        }
      case "project_shared":
        return {
          name: "share",
          parameters: {
            content_type: "project_case_study",
            item_id: String(properties.project_id),
            method: String(properties.method),
            source: String(properties.source),
          },
        }
      case "portfolio_conversion_clicked":
        return {
          name: "select_content",
          parameters: {
            content_type: "portfolio_conversion",
            item_id: String(properties.destination),
            source: String(properties.source),
            ...(properties.project_id
              ? { project_id: String(properties.project_id) }
              : {}),
          },
        }
      case "portfolio_contact_submitted":
        return {
          name: "generate_lead",
          parameters: { method: "contact_form", source: String(properties.source) },
        }
      case "portfolio_contact_failed":
        return {
          name: "contact_form_error",
          parameters: {
            failure_type: String(properties.failure_type),
            source: String(properties.source),
          },
        }
      default:
        return { name, parameters: properties }
    }
  }

  const emitGa4 = (event) => {
    if (debugMode) {
      window.__portfolioAnalyticsDebugEvents ??= []
      window.__portfolioAnalyticsDebugEvents.push(event)
      persistDebugEvents()
      return
    }

    if (productionTransportEnabled && window.gtag) {
      window.gtag("event", event.name, event.parameters)
    }
  }

  const emitPageView = () => {
    if (!gaReady || pageViewSent) return
    pageViewSent = true
    emitGa4({
      name: "page_view",
      parameters: {
        page_group: pageGroup,
        page_location: new URL(pagePath, canonicalOrigin).toString(),
        page_path: pagePath,
        page_title: document.title,
      },
    })
  }

  const initializeGa = () => {
    if (consent !== "granted") return
    if (debugMode) {
      gaReady = true
      emitPageView()
      return
    }
    if (!productionTransportEnabled || !gaMeasurementId) return

    window.dataLayer ??= []
    window.gtag ??= (...args) => window.dataLayer.push(args)
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

    if (!document.querySelector('script[data-portfolio-ga4]')) {
      const script = document.createElement("script")
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
        gaMeasurementId
      )}`
      script.async = true
      script.dataset.portfolioGa4 = "true"
      document.head.appendChild(script)
    }
    gaReady = true
    emitPageView()
  }

  const initializeVercelAnalytics = () => {
    if (!productionTransportEnabled) return
    window.vam = "production"
    window.va ??= (...args) => {
      window.vaq = window.vaq || []
      window.vaq.push(args)
    }
    if (document.querySelector('script[src*="/_vercel/insights/script.js"]')) return

    const script = document.createElement("script")
    script.src = "/_vercel/insights/script.js"
    script.defer = true
    script.dataset.sdkn = "@vercel/analytics/next"
    script.dataset.sdkv = "1.6.1"
    document.head.appendChild(script)
  }

  const removeGaCookies = () => {
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

  const showPreferences = () => {
    if (!(preferencesPanel instanceof HTMLElement)) return
    if (privacyControls instanceof HTMLElement) privacyControls.hidden = !privacySignal
    if (standardControls instanceof HTMLElement) standardControls.hidden = privacySignal
    preferencesPanel.hidden = false
  }

  const hidePreferences = () => {
    if (preferencesPanel instanceof HTMLElement) preferencesPanel.hidden = true
  }

  const chooseConsent = (nextConsent) => {
    consent = nextConsent
    hidePreferences()
    try {
      window.localStorage.setItem(consentStorageKey, nextConsent)
    } catch {
      // The in-memory choice remains effective when storage is unavailable.
    }

    if (nextConsent === "granted") {
      initializeGa()
      return
    }

    gaReady = false
    pageViewSent = false
    window.gtag?.("consent", "update", { analytics_storage: "denied" })
    removeGaCookies()
  }

  if (debugMode) window.__portfolioAnalyticsDebugEvents = readDebugEvents()
  initializeVercelAnalytics()

  window.addEventListener(browserEventName, (event) => {
    const detail = event.detail
    if (!detail || typeof detail.name !== "string") return
    const properties = sanitizeProperties(detail.name, detail.properties)
    if (!properties) return

    if (productionTransportEnabled && window.va) {
      try {
        window.va("event", { name: detail.name, data: properties })
      } catch {
        // Provider failures must not interrupt portfolio actions.
      }
    }
    if (consent === "granted" && gaReady) {
      emitGa4(mapToGa4(detail.name, properties))
    }
  })

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return
    if (event.target.closest("[data-analytics-preferences-open]")) {
      showPreferences()
      return
    }
    if (event.target.closest("[data-analytics-allow]")) {
      chooseConsent("granted")
      return
    }
    if (event.target.closest("[data-analytics-deny]")) {
      chooseConsent("denied")
      return
    }
    if (event.target.closest("[data-analytics-close]")) hidePreferences()
  })

  if (privacySignal) {
    consent = "denied"
    standardControls?.remove()
    hidePreferences()
    removeGaCookies()
  } else {
    try {
      const storedConsent = window.localStorage.getItem(consentStorageKey)
      consent = storedConsent === "granted" || storedConsent === "denied"
        ? storedConsent
        : "unknown"
    } catch {
      consent = "unknown"
    }

    if (consent === "unknown") showPreferences()
    else hidePreferences()
    if (consent === "granted") initializeGa()
    else if (consent === "denied") removeGaCookies()
  }
})()
