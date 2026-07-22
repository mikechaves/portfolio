jest.mock("server-only", () => ({}))

import { POST } from "./route"
import * as interpreter from "@/features/adaptive-focus/server/openai-role-interpreter"
import type { RoleInterpretation } from "@/features/adaptive-focus"

const INTERPRETATION: RoleInterpretation = {
  normalizedInput: "human in the loop ai evaluation",
  roleTitle: "AI Evaluation Designer",
  roleFamily: "ai-product",
  seniority: "senior",
  companyContext: null,
  requirements: [
    { capability: "human-in-the-loop-ai", importance: "required", basis: "explicit" },
    { capability: "evaluation-calibration", importance: "required", basis: "explicit" },
  ],
  responsibilities: ["Design evaluation workflows"],
  desiredOutcomes: ["Improve review quality"],
  confidence: 0.91,
  clarificationNeeded: false,
  clarificationQuestion: null,
}

function request(body: string, contentType = "application/json") {
  return new Request("http://localhost/api/adaptive-focus/analyze", {
    method: "POST",
    headers: { "Content-Type": contentType },
    body,
  })
}

describe("POST /api/adaptive-focus/analyze", () => {
  afterEach(() => jest.restoreAllMocks())

  it("returns an evidence-grounded af.v2 result with no-store behavior", async () => {
    jest.spyOn(interpreter, "interpretRoleWithOpenAI").mockResolvedValue(INTERPRETATION)
    const response = await POST(request(JSON.stringify({ input: "HITL AI evaluation role" })))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(response.headers.get("cache-control")).toBe("no-store")
    expect(body.schemaVersion).toBe("af.v2")
    expect(body.analysisSource).toBe("gpt")
    expect(body.groups.primary[0].entityId).toBe("employment-astrocade")
  })

  it.each([
    ["empty input", JSON.stringify({ input: "" }), "application/json", 400],
    ["oversized input", JSON.stringify({ input: "a".repeat(12_001) }), "application/json", 400],
    ["invalid json", "{", "application/json", 400],
    ["unsupported content", JSON.stringify({ input: "AI role" }), "text/plain", 415],
    [
      "client project data",
      JSON.stringify({ input: "AI role", projects: [{ id: "fake" }] }),
      "application/json",
      400,
    ],
  ])("rejects %s", async (_label, body, contentType, expectedStatus) => {
    const response = await POST(request(body, contentType))
    expect(response.status).toBe(expectedStatus)
    expect(response.headers.get("cache-control")).toBe("no-store")
  })

  it("returns a fallback-capable response when the API key is unavailable", async () => {
    jest
      .spyOn(interpreter, "interpretRoleWithOpenAI")
      .mockRejectedValue(
        new interpreter.RoleInterpreterError("missing-api-key", "Advanced role analysis is unavailable.")
      )
    const response = await POST(request(JSON.stringify({ input: "AI role" })))
    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      error: "Advanced role analysis is unavailable.",
    })
  })

  it("sanitizes unexpected server failures", async () => {
    jest
      .spyOn(interpreter, "interpretRoleWithOpenAI")
      .mockRejectedValue(new Error("secret upstream body"))
    const response = await POST(request(JSON.stringify({ input: "AI role" })))
    expect(response.status).toBe(502)
    await expect(response.json()).resolves.toEqual({
      error: "Advanced role analysis is unavailable.",
    })
  })
})
