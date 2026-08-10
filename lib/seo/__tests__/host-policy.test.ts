import {
  getCanonicalRedirectUrl,
  normalizeRequestHost,
  shouldSendNoIndexHeader,
} from "@/lib/seo/host-policy"

describe("canonical host policy", () => {
  it("normalizes host headers with ports", () => {
    expect(normalizeRequestHost("WWW.MIKECHAVES.IO:443")).toBe("www.mikechaves.io")
  })

  it("redirects known public aliases while preserving path and query", () => {
    const request = new URL("https://mikechaves.io/projects/x-games?source=legacy")
    expect(getCanonicalRedirectUrl(request, "mikechaves.io")?.toString()).toBe(
      "https://www.mikechaves.io/projects/x-games?source=legacy"
    )
  })

  it("does not redirect canonical or branch-preview hosts", () => {
    const request = new URL("https://www.mikechaves.io/projects")
    expect(getCanonicalRedirectUrl(request, "www.mikechaves.io")).toBeNull()
    expect(getCanonicalRedirectUrl(request, "portfolio-git-feature.example.vercel.app")).toBeNull()
  })

  it("marks previews and unknown Vercel hosts noindex", () => {
    expect(shouldSendNoIndexHeader("www.mikechaves.io", "production")).toBe(false)
    expect(shouldSendNoIndexHeader("www.mikechaves.io", "preview")).toBe(true)
    expect(
      shouldSendNoIndexHeader("portfolio-git-feature.example.vercel.app", "production")
    ).toBe(true)
  })
})
