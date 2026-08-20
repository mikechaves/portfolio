import fs from "node:fs"
import path from "node:path"

const readSource = (relativePath: string) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8")

describe("server-first homepage interactions", () => {
  const pageSource = readSource("app/page.tsx")
  const bridgeSource = readSource("components/homepage-client-bridge.tsx")
  const eventLinkSource = readSource("components/portfolio-event-link.tsx")
  const journeyLinkSource = readSource("components/home-journey-link.tsx")
  const featuredCardSource = readSource("components/featured-project-card.tsx")

  it("hydrates one homepage bridge instead of per-link handlers", () => {
    expect(pageSource.match(/<HomepageClientBridge \/>/gu)).toHaveLength(1)
    expect(pageSource).not.toContain("TrackedPortfolioLink")
    expect(pageSource).not.toContain("HeroVisualCanvas")
    expect(pageSource).toContain('<canvas className="home-journey-visual"')
  })

  it("keeps event and journey links server-renderable", () => {
    expect(eventLinkSource).not.toMatch(/^\s*["']use client["']/u)
    expect(eventLinkSource).toContain("data-portfolio-event")
    expect(eventLinkSource).toContain("data-portfolio-properties")
    expect(journeyLinkSource).not.toMatch(/^\s*["']use client["']/u)
    expect(journeyLinkSource).toContain("PortfolioEventLink")
    expect(journeyLinkSource).not.toContain("onClick")
    expect(featuredCardSource).toContain("PortfolioEventLink")
  })

  it("bounds delegated homepage analytics and preserves journey behavior", () => {
    for (const eventName of [
      "homepage_path_selected",
      "portfolio_conversion_clicked",
      "project_evidence_opened",
      "public_practice_item_opened",
    ]) {
      expect(bridgeSource).toContain(`case "${eventName}"`)
    }
    expect(bridgeSource).toContain('document.addEventListener("click", handleClick)')
    expect(bridgeSource).toContain("prefers-reduced-motion: reduce")
    expect(bridgeSource).toContain("focus({ preventScroll: true })")
  })
})
