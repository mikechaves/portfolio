import "server-only"

import type OpenAI from "openai"
import {
  APIConnectionTimeoutError,
  APIUserAbortError,
  AuthenticationError,
  RateLimitError,
} from "openai"
import { zodTextFormat } from "openai/helpers/zod"
import { ZodError } from "zod"
import { normalizeRoleInput } from "../../../packages/adaptive-focus-core/src"
import type { RoleInterpretation } from "../../../packages/adaptive-focus-core/src"
import {
  ModelRoleInterpretationSchema,
  type ModelRoleInterpretation,
} from "../contracts/interpretation"
import { getOpenAIClient } from "./openai-client"
import {
  ADAPTIVE_FOCUS_ROLE_PROMPT_VERSION,
  ROLE_INTERPRETER_INSTRUCTIONS,
} from "./role-interpreter-prompt"

export const DEFAULT_ADAPTIVE_FOCUS_MODEL = "gpt-5-mini"
const DEFAULT_TIMEOUT_MS = 12_000

export type RoleInterpreterErrorCode =
  | "missing-api-key"
  | "refusal"
  | "invalid-response"
  | "timeout"
  | "aborted"
  | "authentication"
  | "rate-limit"
  | "upstream"

export class RoleInterpreterError extends Error {
  constructor(
    public readonly code: RoleInterpreterErrorCode,
    message: string
  ) {
    super(message)
    this.name = "RoleInterpreterError"
  }
}

export interface InterpretRoleOptions {
  signal?: AbortSignal
  timeoutMs?: number
  model?: string
  client?: OpenAI
}

function responseHasRefusal(response: { output?: Array<{ type: string; content?: Array<{ type: string }> }> }): boolean {
  return Boolean(
    response.output?.some(
      (item) => item.type === "message" && item.content?.some((content) => content.type === "refusal")
    )
  )
}

export async function interpretRoleWithOpenAI(
  input: string,
  options: InterpretRoleOptions = {}
): Promise<RoleInterpretation> {
  const client = options.client ?? getOpenAIClient()
  if (!client) {
    throw new RoleInterpreterError("missing-api-key", "Advanced role analysis is unavailable.")
  }

  const controller = new AbortController()
  let timedOut = false
  const timeout = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, options.timeoutMs ?? DEFAULT_TIMEOUT_MS)
  const abortFromParent = () => controller.abort(options.signal?.reason)
  options.signal?.addEventListener("abort", abortFromParent, { once: true })

  try {
    const response = await client.responses.parse(
      {
        model: options.model ?? process.env.OPENAI_ADAPTIVE_FOCUS_MODEL ?? DEFAULT_ADAPTIVE_FOCUS_MODEL,
        instructions: ROLE_INTERPRETER_INSTRUCTIONS,
        input,
        reasoning: { effort: "low" },
        max_output_tokens: 1200,
        store: false,
        text: {
          format: zodTextFormat(
            ModelRoleInterpretationSchema,
            "adaptive_focus_role_interpretation"
          ),
        },
        metadata: {
          prompt_version: ADAPTIVE_FOCUS_ROLE_PROMPT_VERSION,
        },
      },
      { signal: controller.signal }
    )

    if (responseHasRefusal(response)) {
      throw new RoleInterpreterError("refusal", "The role description could not be interpreted.")
    }
    if (!response.output_parsed) {
      throw new RoleInterpreterError("invalid-response", "The role interpreter returned no structured result.")
    }

    const parsed: ModelRoleInterpretation = ModelRoleInterpretationSchema.parse(
      response.output_parsed
    )
    return {
      normalizedInput: normalizeRoleInput(input),
      ...parsed,
    }
  } catch (error) {
    if (error instanceof RoleInterpreterError) throw error
    if (timedOut || error instanceof APIConnectionTimeoutError) {
      throw new RoleInterpreterError("timeout", "Advanced role analysis timed out.")
    }
    if (options.signal?.aborted || error instanceof APIUserAbortError) {
      throw new RoleInterpreterError("aborted", "Advanced role analysis was canceled.")
    }
    if (error instanceof AuthenticationError) {
      throw new RoleInterpreterError("authentication", "Advanced role analysis is unavailable.")
    }
    if (error instanceof RateLimitError) {
      throw new RoleInterpreterError("rate-limit", "Advanced role analysis is temporarily busy.")
    }
    if (error instanceof ZodError) {
      throw new RoleInterpreterError("invalid-response", "The role interpreter returned an invalid result.")
    }
    throw new RoleInterpreterError("upstream", "Advanced role analysis is unavailable.")
  } finally {
    clearTimeout(timeout)
    options.signal?.removeEventListener("abort", abortFromParent)
  }
}
