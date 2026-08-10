import {
  DEFAULT_SITE_ORIGIN,
  getCanonicalUrl,
  isProductionIndexingEnabled,
  resolveCanonicalOrigin,
  truncateMetaDescription,
} from "@/lib/seo/site"

describe("SEO site configuration", () => {
  it("uses the canonical serving host and rejects deployment-like origins", () => {
    expect(resolveCanonicalOrigin()).toBe(DEFAULT_SITE_ORIGIN)
    expect(resolveCanonicalOrigin("https://www.mikechaves.io/path?ignored=1")).toBe(
      DEFAULT_SITE_ORIGIN
    )
    expect(resolveCanonicalOrigin("http://www.mikechaves.io")).toBe(DEFAULT_SITE_ORIGIN)
    expect(resolveCanonicalOrigin("http://localhost:3000")).toBe(DEFAULT_SITE_ORIGIN)
    expect(resolveCanonicalOrigin("https://portfolio-example.vercel.app")).toBe(
      DEFAULT_SITE_ORIGIN
    )
  })

  it("creates absolute canonicals without query or fragment leakage", () => {
    expect(getCanonicalUrl("/projects?focusPreset=game#results")).toBe(
      "https://www.mikechaves.io/projects"
    )
  })

  it("distinguishes production, preview, and local environments", () => {
    expect(isProductionIndexingEnabled({ NODE_ENV: "production" })).toBe(true)
    expect(
      isProductionIndexingEnabled({ NODE_ENV: "production", VERCEL_ENV: "preview" })
    ).toBe(false)
    expect(
      isProductionIndexingEnabled({ NODE_ENV: "production", VERCEL_ENV: "production" })
    ).toBe(true)
    expect(isProductionIndexingEnabled({ NODE_ENV: "development" })).toBe(false)
  })

  it("truncates descriptions at a readable word boundary", () => {
    const source = "Evidence-backed product design and engineering ".repeat(8)
    const description = truncateMetaDescription(source, 120)

    expect(description.length).toBeLessThanOrEqual(121)
    expect(description.endsWith("…")).toBe(true)
    expect(description).not.toMatch(/\s…$/u)
  })
})
