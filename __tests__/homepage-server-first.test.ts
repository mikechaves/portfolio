import fs from "node:fs"
import path from "node:path"

const readSource = (relativePath: string) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8")

describe("server-first homepage interactions", () => {
  const pageSource = readSource("pages/index.tsx")
  const contentSource = readSource("components/homepage-content.tsx")
  const analyticsSource = readSource("public/scripts/analytics-lite.js")
  const bridgeSource = readSource("public/scripts/homepage.js")
  const eventRuntimeSource = readSource("public/scripts/portfolio-events.js")
  const eventLinkSource = readSource("components/portfolio-event-link.tsx")
  const journeyLinkSource = readSource("components/home-journey-link.tsx")
  const focusSource = readSource("components/adaptive-focus-entry.tsx")
  const featuredCardSource = readSource("components/featured-project-card.tsx")
  const featuredImageSource = readSource("components/featured-project-image.tsx")

  it("enhances server-owned homepage markup without shipping the Next runtime", () => {
    expect(pageSource).toContain("unstable_runtimeJS: false")
    expect(pageSource).toContain('<script src="/scripts/homepage.js" defer data-homepage-script />')
    expect(pageSource).toContain('<script src="/scripts/portfolio-events.js" defer />')
    expect(pageSource).toContain('<script src="/scripts/site-nav.js" defer />')
    expect(contentSource).not.toContain("HomepageClientBridge")
    expect(contentSource).not.toContain("TrackedPortfolioLink")
    expect(contentSource).not.toContain("HeroVisualCanvas")
    expect(contentSource).not.toContain("ProgressiveHeroBackground")
    expect(contentSource).not.toContain('from "next/link"')
    expect(contentSource).toContain('className="home-journey-visual"')
    expect(contentSource).toContain('src="/visuals/black-sun-signal-grid-static.webp"')
  })

  it("keeps event and journey links server-renderable", () => {
    expect(eventLinkSource).not.toMatch(/^\s*["']use client["']/u)
    expect(eventLinkSource).toContain("data-portfolio-event")
    expect(eventLinkSource).toContain("data-portfolio-properties")
    expect(eventLinkSource).not.toContain('from "next/link"')
    expect(journeyLinkSource).not.toMatch(/^\s*["']use client["']/u)
    expect(journeyLinkSource).toContain("PortfolioEventLink")
    expect(journeyLinkSource).not.toContain("onClick")
    expect(featuredCardSource).toContain("PortfolioEventLink")
    expect(focusSource).not.toMatch(/^\s*["']use client["']/u)
    expect(focusSource).not.toContain("onSubmit")
    expect(focusSource).not.toContain("onClick")
    expect(focusSource).toContain("data-adaptive-focus-form")
    expect(featuredImageSource).not.toMatch(/^\s*["']use client["']/u)
    expect(featuredImageSource).toContain("data-home-featured-src")
  })

  it("bounds delegated homepage analytics and preserves journey behavior", () => {
    const trackedMarkupSources = [contentSource, journeyLinkSource, featuredCardSource].join("\n")
    for (const eventName of [
      "homepage_path_selected",
      "portfolio_conversion_clicked",
      "project_evidence_opened",
      "public_practice_item_opened",
    ]) {
      expect(trackedMarkupSources).toContain(`eventName="${eventName}"`)
    }
    expect(eventRuntimeSource).toContain('a[data-portfolio-event]')
    expect(eventRuntimeSource).toContain('new CustomEvent(browserEventName')
    expect(bridgeSource).toContain('document.addEventListener("click"')
    expect(bridgeSource).toContain('focusForm?.addEventListener("submit"')
    expect(bridgeSource).toContain("data-adaptive-focus-preset")
    expect(bridgeSource).toContain("IntersectionObserver")
    expect(bridgeSource).toContain("prefers-reduced-motion: reduce")
    expect(bridgeSource).toContain("focus({ preventScroll: true })")
    expect(bridgeSource).not.toContain("HeroBackground")
  })

  it("keeps the lightweight analytics bridge consent-gated and allowlisted", () => {
    expect(analyticsSource).toContain('const consentStorageKey = "portfolio.analytics-consent.v1"')
    expect(analyticsSource).toContain('const debugSessionKey = "portfolio:analytics:debug-events:v1"')
    expect(pageSource).toContain("PORTFOLIO_ANALYTICS_PROPERTY_ALLOWLIST")
    expect(pageSource).toContain("data-property-allowlist=")
    expect(analyticsSource).toContain("JSON.parse(config.dataset.propertyAllowlist")
    expect(analyticsSource).toContain('navigator.globalPrivacyControl === true')
    expect(analyticsSource).toContain('navigator.doNotTrack === "1"')
    expect(analyticsSource).toContain('window.va("event", { name: detail.name, data: properties })')
    expect(analyticsSource).toContain('window.gtag("event", event.name, event.parameters)')
    expect(analyticsSource).not.toContain("focusInput.value")
  })
})
