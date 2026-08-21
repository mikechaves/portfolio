import { NextResponse } from "next/server"
import {
  CONTACT_FORM_MAX_BODY_BYTES,
  deliverContactEmail,
  type ContactSubmissionResult,
} from "@/lib/contact"

const RESPONSE_HEADERS = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
} as const

function responseStatus(result: ContactSubmissionResult): number {
  if (result.success) return 200
  if (result.failureType === "validation") return 400
  return 503
}

function hasAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin")
  if (!origin) return true

  try {
    return new URL(origin).host === request.headers.get("host")
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  if (!hasAllowedOrigin(request)) {
    return NextResponse.json(
      {
        success: false,
        failureType: "validation",
        message: "Unable to accept this submission.",
      },
      { status: 403, headers: RESPONSE_HEADERS }
    )
  }

  const contentLength = Number.parseInt(request.headers.get("content-length") ?? "0", 10)
  if (Number.isFinite(contentLength) && contentLength > CONTACT_FORM_MAX_BODY_BYTES) {
    return NextResponse.json(
      {
        success: false,
        failureType: "validation",
        message: "Please keep your message under 5,000 characters.",
      },
      { status: 413, headers: RESPONSE_HEADERS }
    )
  }

  try {
    const formData = await request.formData()
    const result = await deliverContactEmail(formData)
    return NextResponse.json(result, {
      status: responseStatus(result),
      headers: RESPONSE_HEADERS,
    })
  } catch {
    return NextResponse.json(
      {
        success: false,
        failureType: "validation",
        message: "Unable to read this submission. Please try again.",
      },
      { status: 400, headers: RESPONSE_HEADERS }
    )
  }
}
