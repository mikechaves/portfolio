import type { Metadata } from "next"

export const SITE_NAME = "Mike Chaves"
export const SITE_TITLE = "Mike Chaves | AI-Native Design Engineer"
export const DEFAULT_SITE_ORIGIN = "https://www.mikechaves.io"
export const DEFAULT_DESCRIPTION =
  "Mike Chaves designs and builds AI-native product systems, human-in-the-loop workflows, game and creator tools, and immersive interfaces."
export const DEFAULT_SOCIAL_IMAGE = "/social-card"

export const SITE_SOCIAL_PROFILES = [
  "https://github.com/mikechaves",
  "https://www.linkedin.com/in/mikejchaves",
  "https://x.com/mikechaves_io",
] as const

const FORBIDDEN_CANONICAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0"])

export function resolveCanonicalOrigin(candidate?: string): string {
  if (!candidate?.trim()) return DEFAULT_SITE_ORIGIN

  try {
    const url = new URL(candidate)
    const hostname = url.hostname.toLowerCase()
    const isForbidden =
      url.protocol !== "https:" ||
      FORBIDDEN_CANONICAL_HOSTS.has(hostname) ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".vercel.app")

    if (isForbidden) return DEFAULT_SITE_ORIGIN
    return url.origin
  } catch {
    return DEFAULT_SITE_ORIGIN
  }
}

export const SITE_ORIGIN = resolveCanonicalOrigin(process.env.NEXT_PUBLIC_SITE_URL)
export const SITE_URL = new URL(SITE_ORIGIN)

export function getCanonicalUrl(pathname = "/"): string {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`
  const url = new URL(normalizedPath, SITE_ORIGIN)
  url.search = ""
  url.hash = ""
  return url.toString()
}

export function getAbsoluteUrl(pathOrUrl: string): string {
  return new URL(pathOrUrl, SITE_ORIGIN).toString()
}

export function truncateMetaDescription(value: string, maxLength = 158): string {
  const normalized = value.replace(/\s+/g, " ").trim()
  if (normalized.length <= maxLength) return normalized

  const truncated = normalized.slice(0, maxLength + 1)
  const lastSpace = truncated.lastIndexOf(" ")
  const boundary = lastSpace >= Math.floor(maxLength * 0.7) ? lastSpace : maxLength
  return `${truncated.slice(0, boundary).replace(/[\s,;:.!?-]+$/u, "")}…`
}

export function isProductionIndexingEnabled(
  environment: NodeJS.ProcessEnv = process.env
): boolean {
  const vercelEnvironment = environment.VERCEL_ENV ?? environment.NEXT_PUBLIC_VERCEL_ENV
  if (vercelEnvironment) return vercelEnvironment === "production"
  return environment.NODE_ENV === "production"
}

function pageTitle(title: string): string {
  return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
}

export function createRobotsMetadata({
  follow = true,
  noIndex = false,
}: {
  follow?: boolean
  noIndex?: boolean
} = {}): Metadata["robots"] {
  const productionIndexing = isProductionIndexingEnabled()
  const index = productionIndexing && !noIndex
  const canFollow = productionIndexing ? follow : false

  return {
    index,
    follow: canFollow,
    googleBot: {
      index,
      follow: canFollow,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  }
}

interface PageMetadataOptions {
  title: string
  description: string
  path: string
  image?: string
  imageAlt?: string
  noIndex?: boolean
  follow?: boolean
  type?: "website" | "article"
}

export function createPageMetadata({
  title,
  description,
  path,
  image = DEFAULT_SOCIAL_IMAGE,
  imageAlt = `${title} — ${SITE_NAME}`,
  noIndex = false,
  follow = true,
  type = "website",
}: PageMetadataOptions): Metadata {
  const canonical = getCanonicalUrl(path)
  const socialImage = getAbsoluteUrl(image)
  const fullTitle = pageTitle(title)
  const normalizedDescription = truncateMetaDescription(description)

  return {
    title: { absolute: fullTitle },
    description: normalizedDescription,
    alternates: { canonical },
    robots: createRobotsMetadata({ noIndex, follow }),
    openGraph: {
      type,
      locale: "en_US",
      siteName: SITE_NAME,
      url: canonical,
      title: fullTitle,
      description: normalizedDescription,
      images: [{ url: socialImage, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: normalizedDescription,
      images: [{ url: socialImage, alt: imageAlt }],
    },
  }
}
