import robots from "@/app/robots"
import sitemap from "@/app/sitemap"
import { PROJECT_DETAIL_IDS } from "@/data/project-details"
import { posts } from "@/lib/posts"

describe("SEO route outputs", () => {
  const originalVercelEnvironment = process.env.VERCEL_ENV

  afterEach(() => {
    if (originalVercelEnvironment === undefined) delete process.env.VERCEL_ENV
    else process.env.VERCEL_ENV = originalVercelEnvironment
  })

  it("publishes only the curated indexable routes in production", () => {
    process.env.VERCEL_ENV = "production"
    const urls = sitemap().map((entry) => entry.url)
    const expected = [
      "https://www.mikechaves.io/",
      "https://www.mikechaves.io/about",
      "https://www.mikechaves.io/projects",
      "https://www.mikechaves.io/blog",
      ...PROJECT_DETAIL_IDS.map((id) => `https://www.mikechaves.io/projects/${id}`),
      ...posts.map((post) => `https://www.mikechaves.io/blog/${post.id}`),
    ]

    expect(urls).toEqual(expected)
    expect(new Set(urls).size).toBe(urls.length)
    expect(urls).not.toEqual(expect.arrayContaining([expect.stringMatching(/archive|error|\?/u)]))
  })

  it("suppresses sitemap entries and crawling in preview", () => {
    process.env.VERCEL_ENV = "preview"
    expect(sitemap()).toEqual([])
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } })
  })

  it("allows public production pages without blocking rendering assets", () => {
    process.env.VERCEL_ENV = "production"
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/error"],
      },
      host: "https://www.mikechaves.io",
      sitemap: "https://www.mikechaves.io/sitemap.xml",
    })
  })
})
