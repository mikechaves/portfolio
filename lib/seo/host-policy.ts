import { SITE_ORIGIN } from "./site"

export const CANONICAL_HOST = new URL(SITE_ORIGIN).hostname

export const LEGACY_PUBLIC_HOSTS = Object.freeze(
  new Set([
    "mikechaves.io",
    "v0-cyberpunk-portfolio-chi.vercel.app",
    "portfolio-mikechaves-projects.vercel.app",
    "portfolio-git-main-mikechaves-projects.vercel.app",
  ])
)

export function normalizeRequestHost(hostHeader: string | null): string {
  return (hostHeader ?? "").split(":")[0].trim().toLowerCase()
}

export function getCanonicalRedirectUrl(requestUrl: URL, hostHeader: string | null): URL | null {
  const host = normalizeRequestHost(hostHeader)
  if (!LEGACY_PUBLIC_HOSTS.has(host)) return null

  const destination = new URL(`${requestUrl.pathname}${requestUrl.search}`, SITE_ORIGIN)
  destination.hash = requestUrl.hash
  return destination
}

export function shouldSendNoIndexHeader(
  hostHeader: string | null,
  vercelEnvironment = process.env.VERCEL_ENV
): boolean {
  const host = normalizeRequestHost(hostHeader)
  return (
    (Boolean(vercelEnvironment) && vercelEnvironment !== "production") ||
    (host.endsWith(".vercel.app") && !LEGACY_PUBLIC_HOSTS.has(host))
  )
}
