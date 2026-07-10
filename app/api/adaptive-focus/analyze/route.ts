import { NextResponse } from "next/server"
import { composeLocalBrief } from "@/features/adaptive-focus/adapters/local-engine"
import { AnalyzeRoleRequestSchema } from "@/features/adaptive-focus/contracts/interpretation"
import {
  interpretRoleWithOpenAI,
  RoleInterpreterError,
} from "@/features/adaptive-focus/server/openai-role-interpreter"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const NO_STORE_HEADERS = { "Cache-Control": "no-store" }

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: NO_STORE_HEADERS })
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? ""
  if (!contentType.toLowerCase().includes("application/json")) {
    return errorResponse("Content-Type must be application/json.", 415)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse("Request body must be valid JSON.", 400)
  }

  const parsed = AnalyzeRoleRequestSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse("Provide role text between 1 and 12,000 characters.", 400)
  }

  try {
    const interpretation = await interpretRoleWithOpenAI(parsed.data.input, {
      signal: request.signal,
    })
    return NextResponse.json(composeLocalBrief(interpretation, "gpt"), {
      headers: NO_STORE_HEADERS,
    })
  } catch (error) {
    if (!(error instanceof RoleInterpreterError)) {
      return errorResponse("Advanced role analysis is unavailable.", 502)
    }

    const statusByCode: Partial<Record<RoleInterpreterError["code"], number>> = {
      "missing-api-key": 503,
      authentication: 503,
      "rate-limit": 429,
      timeout: 504,
      aborted: 499,
      refusal: 422,
      "invalid-response": 502,
      upstream: 502,
    }
    return errorResponse(error.message, statusByCode[error.code] ?? 502)
  }
}
