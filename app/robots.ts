import type { MetadataRoute } from "next"
import { getCanonicalUrl, SITE_ORIGIN, isProductionIndexingEnabled } from "@/lib/seo/site"

export default function robots(): MetadataRoute.Robots {
  if (!isProductionIndexingEnabled()) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    }
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/error"],
    },
    host: SITE_ORIGIN,
    sitemap: getCanonicalUrl("/sitemap.xml"),
  }
}
