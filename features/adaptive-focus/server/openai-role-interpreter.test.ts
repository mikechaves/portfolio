jest.mock("server-only", () => ({}))

import type OpenAI from "openai"
import { AuthenticationError, RateLimitError } from "openai"
import { resetOpenAIClientForTests } from "./openai-client"
import {
  DEFAULT_ADAPTIVE_FOCUS_MODEL,
  interpretRoleWithOpenAI,
} from "./openai-role-interpreter"

const MODEL_OUTPUT = {
  roleTitle: "Senior Design Engineer",
  roleFamily: "design-engineering" as const,
  seniority: "senior" as const,
  companyContext: "Adobe",
  requirements: [
    {
      capability: "ai-product-systems" as const,
      importance: "required" as const,
      basis: "explicit" as const,
    },
  ],
  responsibilities: ["Build AI-assisted creative workflows"],
  desiredOutcomes: ["Reduce workflow friction"],
  confidence: 0.92,
  clarificationNeeded: false,
  clarificationQuestion: null,
}

function fakeClient(parse: jest.Mock): OpenAI {
  return { responses: { parse } } as unknown as OpenAI
}

describe("OpenAI role interpreter", () => {
  afterEach(() => {
    jest.restoreAllMocks()
    resetOpenAIClientForTests()
  })

  it("uses Responses Structured Outputs with the configured safe request", async () => {
    const parse = jest.fn().mockResolvedValue({ output_parsed: MODEL_OUTPUT, output: [] })
    const result = await interpretRoleWithOpenAI(
      "Senior design engineer at Adobe building AI-assisted creative workflows",
      { client: fakeClient(parse) }
    )

    expect(result.roleFamily).toBe("design-engineering")
    expect(result.normalizedInput).toContain("senior design engineer")
    expect(parse).toHaveBeenCalledTimes(1)
    const [request] = parse.mock.calls[0]
    expect(request.model).toBe(DEFAULT_ADAPTIVE_FOCUS_MODEL)
    expect(request.store).toBe(false)
    expect(request.reasoning).toEqual({ effort: "low" })
    expect(request.tools).toBeUndefined()
    expect(request.text.format).toEqual(
      expect.objectContaining({
        type: "json_schema",
        name: "adaptive_focus_role_interpretation",
        strict: true,
      })
    )
  })

  it("honors model configuration", async () => {
    const parse = jest.fn().mockResolvedValue({ output_parsed: MODEL_OUTPUT, output: [] })
    await interpretRoleWithOpenAI("AI product role", {
      client: fakeClient(parse),
      model: "gpt-5",
    })
    expect(parse.mock.calls[0][0].model).toBe("gpt-5")
  })

  it("rejects null parsed output and refusals", async () => {
    const nullClient = fakeClient(
      jest.fn().mockResolvedValue({ output_parsed: null, output: [] })
    )
    await expect(interpretRoleWithOpenAI("AI role", { client: nullClient })).rejects.toMatchObject({
      code: "invalid-response",
    })

    const refusalClient = fakeClient(
      jest.fn().mockResolvedValue({
        output_parsed: null,
        output: [{ type: "message", content: [{ type: "refusal" }] }],
      })
    )
    await expect(
      interpretRoleWithOpenAI("AI role", { client: refusalClient })
    ).rejects.toMatchObject({ code: "refusal" })

    const invalidClient = fakeClient(
      jest.fn().mockResolvedValue({
        output_parsed: { ...MODEL_OUTPUT, confidence: 2 },
        output: [],
      })
    )
    await expect(
      interpretRoleWithOpenAI("AI role", { client: invalidClient })
    ).rejects.toMatchObject({ code: "invalid-response" })
  })

  it("sanitizes authentication and rate-limit failures", async () => {
    const headers = new Headers()
    const authClient = fakeClient(
      jest.fn().mockRejectedValue(new AuthenticationError(401, {}, "secret upstream detail", headers))
    )
    await expect(
      interpretRoleWithOpenAI("AI role", { client: authClient })
    ).rejects.toEqual(
      expect.objectContaining({ code: "authentication", message: "Advanced role analysis is unavailable." })
    )

    const rateClient = fakeClient(
      jest.fn().mockRejectedValue(new RateLimitError(429, {}, "secret upstream detail", headers))
    )
    await expect(
      interpretRoleWithOpenAI("AI role", { client: rateClient })
    ).rejects.toEqual(
      expect.objectContaining({ code: "rate-limit", message: "Advanced role analysis is temporarily busy." })
    )
  })

  it("supports timeout and abort signals", async () => {
    const waitForAbort = jest.fn(
      (_request: unknown, options?: { signal?: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          options?.signal?.addEventListener(
            "abort",
            () => reject(new DOMException("aborted", "AbortError")),
            { once: true }
          )
        })
    )
    await expect(
      interpretRoleWithOpenAI("AI role", {
        client: fakeClient(waitForAbort),
        timeoutMs: 1,
      })
    ).rejects.toMatchObject({ code: "timeout" })

    const controller = new AbortController()
    const aborted = interpretRoleWithOpenAI("AI role", {
      client: fakeClient(waitForAbort),
      signal: controller.signal,
      timeoutMs: 1000,
    })
    controller.abort()
    await expect(aborted).rejects.toMatchObject({ code: "aborted" })
  })

  it("returns a typed missing-key error without inspecting a key value", async () => {
    const previous = process.env.OPENAI_API_KEY
    delete process.env.OPENAI_API_KEY
    resetOpenAIClientForTests()
    try {
      await expect(interpretRoleWithOpenAI("AI role")).rejects.toEqual(
        expect.objectContaining({
          code: "missing-api-key",
          message: "Advanced role analysis is unavailable.",
        })
      )
    } finally {
      if (previous) process.env.OPENAI_API_KEY = previous
    }
  })
})
