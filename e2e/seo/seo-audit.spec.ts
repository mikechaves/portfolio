import { expect, test, type APIRequestContext, type Page } from "@playwright/test"
import projectData from "../../public/data/projects.json"
import { posts } from "../../lib/posts"

const CANONICAL_ORIGIN = "https://www.mikechaves.io"
const projectIds = Object.keys(projectData)
const indexableRoutes = [
  "/",
  "/about",
  "/projects",
  "/blog",
  ...projectIds.map((id) => `/projects/${id}`),
  ...posts.map((post) => `/blog/${post.id}`),
]

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/gu, "&")
    .replace(/&quot;/gu, '"')
    .replace(/&#x27;|&#39;/gu, "'")
    .replace(/&lt;/gu, "<")
    .replace(/&gt;/gu, ">")
}

function attribute(tag: string, name: string): string {
  const match = tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "iu"))
  return decodeHtml(match?.[1] ?? "")
}

function meta(html: string, key: "name" | "property", value: string): string {
  const tag = [...html.matchAll(/<meta\b[^>]*>/giu)]
    .map((match) => match[0])
    .find((candidate) => attribute(candidate, key).toLowerCase() === value.toLowerCase())
  return tag ? attribute(tag, "content") : ""
}

function canonical(html: string): string {
  const tag = [...html.matchAll(/<link\b[^>]*>/giu)]
    .map((match) => match[0])
    .find((candidate) => attribute(candidate, "rel").split(/\s+/u).includes("canonical"))
  return tag ? attribute(tag, "href") : ""
}

function title(html: string): string {
  return decodeHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/iu)?.[1] ?? "")
    .replace(/\s+/gu, " ")
    .trim()
}

function stripMarkup(value: string): string {
  return decodeHtml(
    value
      .replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/giu, " ")
      .replace(/<[^>]+>/gu, " ")
  )
    .replace(/\s+/gu, " ")
    .trim()
}

function initialBodyText(html: string): string {
  return stripMarkup(html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/iu)?.[1] ?? "")
}

function h1Text(html: string): string[] {
  return [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/giu)]
    .map((match) => stripMarkup(match[1]))
    .filter(Boolean)
}

function jsonLdBlocks(html: string): Record<string, unknown>[] {
  return [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/giu)].map(
    (match) => JSON.parse(decodeHtml(match[1])) as Record<string, unknown>
  )
}

function structuredDataTypes(blocks: Record<string, unknown>[]): Set<string> {
  const types = new Set<string>()
  for (const block of blocks) {
    const items = Array.isArray(block["@graph"]) ? block["@graph"] : [block]
    for (const item of items) {
      if (!item || typeof item !== "object") continue
      const type = (item as Record<string, unknown>)["@type"]
      if (typeof type === "string") types.add(type)
    }
  }
  return types
}

function internalAnchors(html: string): string[] {
  const withoutScripts = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, "")
  return [...withoutScripts.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/giu)]
    .map((match) => decodeHtml(match[1]))
    .filter((href) => href.startsWith("/") && !href.startsWith("//"))
}

function expectedCanonical(route: string): string {
  return route === "/" ? CANONICAL_ORIGIN : new URL(route, CANONICAL_ORIGIN).toString()
}

function expectedSitemapUrl(route: string): string {
  return new URL(route, CANONICAL_ORIGIN).toString()
}

async function expectHealthyInternalLink(request: APIRequestContext, href: string) {
  const url = new URL(href, "http://audit.local")
  const response = await request.get(`${url.pathname}${url.search}`, { maxRedirects: 5 })
  expect(response.status(), `${href} should resolve without a broken response`).toBeLessThan(400)
}

test("initial HTML, metadata, sitemap, structured data, and links form one canonical crawl", async ({
  request,
}) => {
  const sitemapResponse = await request.get("/sitemap.xml")
  expect(sitemapResponse.status()).toBe(200)
  expect(sitemapResponse.headers()["content-type"]).toContain("xml")
  const sitemapXml = await sitemapResponse.text()
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/gu)].map((match) =>
    decodeHtml(match[1])
  )
  expect(sitemapUrls).toEqual(indexableRoutes.map(expectedSitemapUrl))
  expect(new Set(sitemapUrls).size).toBe(sitemapUrls.length)

  const robotsResponse = await request.get("/robots.txt")
  expect(robotsResponse.status()).toBe(200)
  const robotsText = await robotsResponse.text()
  expect(robotsText).toContain("Allow: /")
  expect(robotsText).toContain("Disallow: /api/")
  expect(robotsText).toContain(`Sitemap: ${CANONICAL_ORIGIN}/sitemap.xml`)
  expect(robotsText).not.toContain("Disallow: /_next")

  const titles = new Set<string>()
  const descriptions = new Set<string>()
  const canonicals = new Set<string>()
  const internalLinks = new Set<string>()
  const inboundRoutes = new Map<string, Set<string>>()
  const socialImages = new Set<string>()

  for (const route of indexableRoutes) {
    const response = await request.get(route)
    expect(response.status(), `${route} should return 200`).toBe(200)
    const html = await response.text()
    const routeTitle = title(html)
    const description = meta(html, "name", "description")
    const routeCanonical = canonical(html)
    const robots = meta(html, "name", "robots")
    const headings = h1Text(html)
    const bodyText = initialBodyText(html)

    expect(routeTitle, `${route} needs a descriptive title`).not.toBe("")
    expect(description.length, `${route} needs a substantive description`).toBeGreaterThanOrEqual(70)
    expect(description.length, `${route} description should fit a search snippet`).toBeLessThanOrEqual(160)
    expect(routeCanonical).toBe(expectedCanonical(route))
    expect(routeCanonical).not.toMatch(/localhost|\.vercel\.app/iu)
    expect(robots).not.toContain("noindex")
    expect(headings, `${route} must expose one initial-HTML H1`).toHaveLength(1)
    expect(bodyText.length, `${route} must not be a client-only empty shell`).toBeGreaterThan(400)

    expect(meta(html, "property", "og:title")).toBe(routeTitle)
    expect(meta(html, "property", "og:description")).toBe(description)
    expect(meta(html, "property", "og:url")).toBe(routeCanonical)
    expect(meta(html, "property", "og:image")).toMatch(/^https:\/\/www\.mikechaves\.io\//u)
    expect(meta(html, "name", "twitter:card")).toBe("summary_large_image")
    expect(meta(html, "name", "twitter:title")).toBe(routeTitle)
    expect(meta(html, "name", "twitter:description")).toBe(description)
    expect(meta(html, "name", "twitter:image")).toMatch(/^https:\/\/www\.mikechaves\.io\//u)

    const jsonLd = jsonLdBlocks(html)
    expect(jsonLd.length, `${route} needs parseable JSON-LD`).toBeGreaterThan(0)
    for (const block of jsonLd) expect(block["@context"]).toBe("https://schema.org")
    const types = structuredDataTypes(jsonLd)
    expect(types.has("Person")).toBe(true)
    expect(types.has("WebSite")).toBe(true)
    if (route === "/about") expect(types.has("ProfilePage")).toBe(true)
    if (route === "/projects") expect(types.has("CollectionPage")).toBe(true)
    if (route.startsWith("/projects/")) {
      expect(types.has("CreativeWork")).toBe(true)
      expect(types.has("BreadcrumbList")).toBe(true)
      expect(html).toContain('aria-label="Breadcrumb"')
      expect(bodyText).toContain("Share case study")
    }
    if (route === "/blog") expect(types.has("CollectionPage")).toBe(true)
    if (route.startsWith("/blog/")) {
      expect(types.has("Article")).toBe(true)
      expect(html).toContain('aria-label="Breadcrumb"')
      expect(bodyText).toContain("Read original article")
      expect(bodyText).toContain("Related project case studies")
    }

    expect(titles.has(routeTitle), `${routeTitle} is duplicated`).toBe(false)
    expect(descriptions.has(description), `${description} is duplicated`).toBe(false)
    expect(canonicals.has(routeCanonical), `${routeCanonical} is duplicated`).toBe(false)
    titles.add(routeTitle)
    descriptions.add(description)
    canonicals.add(routeCanonical)
    socialImages.add(meta(html, "property", "og:image"))
    for (const href of internalAnchors(html)) {
      internalLinks.add(href)
      const target = new URL(href, CANONICAL_ORIGIN).pathname.replace(/\/$/u, "") || "/"
      if (indexableRoutes.includes(target) && target !== route) {
        const inbound = inboundRoutes.get(target) ?? new Set<string>()
        inbound.add(route)
        inboundRoutes.set(target, inbound)
      }
    }

    const imagesWithoutAlt = [...html.matchAll(/<img\b[^>]*>/giu)]
      .map((match) => match[0])
      .filter((tag) => !/\balt=["'][^"']*["']/iu.test(tag))
    expect(imagesWithoutAlt, `${route} has images without alt attributes`).toEqual([])
  }

  for (const route of indexableRoutes.filter((candidate) => candidate !== "/")) {
    expect(
      inboundRoutes.get(route)?.size ?? 0,
      `${route} needs a crawlable link from another indexable page`
    ).toBeGreaterThan(0)
  }

  for (const href of internalLinks) await expectHealthyInternalLink(request, href)
  for (const image of socialImages) {
    const url = new URL(image)
    const response = await request.get(`${url.pathname}${url.search}`)
    expect(response.status(), `${image} should be loadable`).toBe(200)
    expect(response.headers()["content-type"]).toMatch(/^image\//u)
  }
})

test("noncanonical, preview, error, query, and API routes obey their controls", async ({ request }) => {
  for (const [route, target] of [
    ["/?metaverse=true", "/"],
    ["/projects?focusPreset=game-ux-creator-systems", "/projects"],
    ["/blog?focus=voice", "/blog"],
    ["/about?focus=ai", "/about"],
  ] as const) {
    const response = await request.get(route)
    expect(response.status()).toBe(200)
    expect(canonical(await response.text())).toBe(expectedCanonical(target))
  }

  for (const route of ["/archive", "/error"] as const) {
    const response = await request.get(route)
    expect(response.status()).toBe(200)
    expect(meta(await response.text(), "name", "robots")).toContain("noindex")
  }

  expect((await request.get("/projects/does-not-exist", { maxRedirects: 0 })).status()).toBe(404)

  const apiResponse = await request.get("/api/placeholder?width=120&height=63&text=SEO")
  expect(apiResponse.status()).toBe(200)
  expect(apiResponse.headers()["x-robots-tag"]).toBe("noindex, nofollow")

  const aliasResponse = await request.get("/projects/x-games?source=alias", {
    headers: { host: "mikechaves.io" },
    maxRedirects: 0,
  })
  expect(aliasResponse.status()).toBe(308)
  expect(aliasResponse.headers().location).toBe(
    `${CANONICAL_ORIGIN}/projects/x-games?source=alias`
  )

  const previewResponse = await request.get("/", {
    headers: { host: "portfolio-git-feature-mikechaves-projects.vercel.app" },
  })
  expect(previewResponse.status()).toBe(200)
  expect(previewResponse.headers()["x-robots-tag"]).toBe("noindex, nofollow")
})

async function verifyRenderedRoute(page: Page, route: string) {
  const pageErrors: string[] = []
  const consoleErrors: string[] = []
  const onPageError = (error: Error) => pageErrors.push(error.message)
  const onConsole = (message: { type(): string; text(): string }) => {
    if (message.type() === "error") consoleErrors.push(message.text())
  }
  page.on("pageerror", onPageError)
  page.on("console", onConsole)

  const response = await page.goto(route, { waitUntil: "domcontentloaded" })
  expect(response?.status(), `${route} should render successfully`).toBe(200)
  await expect(page.locator("h1")).toHaveCount(1)
  await expect(page.locator("h1")).toBeVisible()
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    expectedCanonical(route)
  )
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /^https:\/\/www\.mikechaves\.io\//u
  )
  expect(await page.locator("body").innerText()).not.toMatch(/Internal Server Error/iu)
  expect(await page.locator("img:not([alt])").count()).toBe(0)
  const width = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }))
  expect(width.scroll, `${route} should not overflow horizontally`).toBeLessThanOrEqual(
    width.client + 1
  )
  expect(pageErrors, `${route} should not raise page errors`).toEqual([])
  expect(consoleErrors, `${route} should not log console errors`).toEqual([])

  page.off("pageerror", onPageError)
  page.off("console", onConsole)
}

test("rendered desktop pages preserve the crawlable contract after hydration", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" })
  await page.setViewportSize({ width: 1440, height: 1000 })
  for (const route of indexableRoutes) await verifyRenderedRoute(page, route)
})

test("representative mobile acquisition pages remain usable and stable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" })
  await page.setViewportSize({ width: 390, height: 844 })
  for (const route of [
    "/",
    "/about",
    "/projects",
    "/projects/x-games",
    "/blog/voice-first-xr",
  ]) {
    await verifyRenderedRoute(page, route)
  }
})
