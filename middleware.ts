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

  const response = NextResponse.next()
  if (shouldSendNoIndexHeader(host)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow")
  }
  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon/).*)"],
}
