import { getProjectDetail } from "@/data/project-details"
import { posts } from "@/lib/posts"
import {
  getArticleStructuredData,
  getProfilePageStructuredData,
  getProjectStructuredData,
  getSiteStructuredData,
} from "@/lib/seo/structured-data"

describe("structured data", () => {
  it("describes the visible site and operator without invented claims", () => {
    const data = getSiteStructuredData()
    expect(data["@context"]).toBe("https://schema.org")
    expect(data["@graph"].map((item) => item["@type"])).toEqual(["Person", "WebSite"])
    expect(JSON.stringify(data)).not.toMatch(/rating|review|award|price|customer/i)
  })

  it("builds a ProfilePage whose main entity is Mike Chaves", () => {
    const data = getProfilePageStructuredData()
    expect(data["@type"]).toBe("ProfilePage")
    expect(data.mainEntity).toMatchObject({ "@type": "Person", name: "Mike Chaves" })
    expect(data.url).toBe("https://www.mikechaves.io/about")
  })

  it("builds project CreativeWork and breadcrumb fields from public data", () => {
    const project = getProjectDetail("x-games")
    expect(project).toBeDefined()
    const data = getProjectStructuredData(project!)
    const creativeWork = data["@graph"].find((item) => item["@type"] === "CreativeWork")
    const breadcrumbs = data["@graph"].find((item) => item["@type"] === "BreadcrumbList")

    expect(creativeWork).toMatchObject({
      name: "Playfold case study",
      url: "https://www.mikechaves.io/projects/x-games",
    })
    expect(breadcrumbs?.itemListElement).toHaveLength(3)
  })

  it("builds Article fields from the visible post record", () => {
    const post = posts.find((item) => item.id === "voice-first-xr")!
    expect(getArticleStructuredData(post)).toMatchObject({
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      datePublished: "2025-06-18",
      sameAs: post.url,
    })
  })
})
