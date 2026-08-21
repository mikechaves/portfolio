import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import {
  getCanonicalRedirectUrl,
  shouldSendNoIndexHeader,
} from "@/lib/seo/host-policy"

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")
  const canonicalRedirect = getCanonicalRedirectUrl(request.nextUrl, host)

  if (canonicalRedirect) {
    return NextResponse.redirect(canonicalRedirect, 308)
  }

  const metaverseEntry =
    request.nextUrl.pathname === "/" &&
    request.nextUrl.searchParams.get("metaverse") === "true"
  const response = metaverseEntry
    ? NextResponse.rewrite(
        new URL(`/metaverse${request.nextUrl.search}`, request.url)
      )
    : NextResponse.next()
  if (shouldSendNoIndexHeader(host)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow")
  }
  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon/).*)"],
}
