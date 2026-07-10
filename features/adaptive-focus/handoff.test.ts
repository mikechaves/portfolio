import {
  ADAPTIVE_FOCUS_PENDING_KEY,
  ADAPTIVE_FOCUS_PENDING_TTL_MS,
  consumePendingAdaptiveFocusInput,
  decodeAdaptiveFocusBriefHandoff,
  encodeAdaptiveFocusBriefHandoff,
  resolveAdaptiveFocusInitialization,
  savePendingAdaptiveFocusInput,
} from "./handoff"
import { LocalAdaptiveFocusEngine } from "./adapters/local-engine"

class MemoryStorage {
  values = new Map<string, string>()
  getItem(key: string) {
    return this.values.get(key) ?? null
  }
  setItem(key: string, value: string) {
    this.values.set(key, value)
  }
  removeItem(key: string) {
    this.values.delete(key)
  }
}

describe("Adaptive Focus handoff", () => {
  it("initializes a preset from a stable URL key", () => {
    expect(
      resolveAdaptiveFocusInitialization("?focusPreset=hitl-evaluation", new MemoryStorage())
    ).toEqual({ mode: "preset", presetId: "hitl-evaluation" })
  })

  it("consumes and deletes custom role text from session storage", () => {
    const storage = new MemoryStorage()
    savePendingAdaptiveFocusInput(storage, "Senior AI design engineer", 100)
    expect(resolveAdaptiveFocusInitialization("?focusSession=1", storage, 200)).toEqual({
      mode: "custom",
      input: "Senior AI design engineer",
    })
    expect(storage.getItem(ADAPTIVE_FOCUS_PENDING_KEY)).toBeNull()
  })

  it("rejects expired payloads and deletes them", () => {
    const storage = new MemoryStorage()
    savePendingAdaptiveFocusInput(storage, "Operational UX", 100)
    expect(
      consumePendingAdaptiveFocusInput(storage, 100 + ADAPTIVE_FOCUS_PENDING_TTL_MS + 1)
    ).toBeNull()
    expect(storage.getItem(ADAPTIVE_FOCUS_PENDING_KEY)).toBeNull()
  })

  it("supports bounded legacy focus queries without generating them", () => {
    const request = resolveAdaptiveFocusInitialization(
      `?focus=${"a".repeat(700)}`,
      new MemoryStorage()
    )
    expect(request).toEqual({ mode: "custom", input: "a".repeat(500) })
  })

  it("does not put custom role text into generated URLs", () => {
    const storage = new MemoryStorage()
    savePendingAdaptiveFocusInput(storage, "confidential role text")
    expect("/projects?focusSession=1").not.toContain("confidential")
  })

  it("fails before navigation when storage cannot verify the write", () => {
    const unavailableStorage = {
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
    }
    expect(() => savePendingAdaptiveFocusInput(unavailableStorage, "AI role")).toThrow(
      "Temporary role storage is unavailable."
    )
  })

  it("encodes only bounded role context for reliable navigation", async () => {
    const rawInput = "Confidential senior AI role at ExampleCo"
    const result = await new LocalAdaptiveFocusEngine().run({ mode: "custom", input: rawInput })
    const token = encodeAdaptiveFocusBriefHandoff(result)
    const decoded = decodeAdaptiveFocusBriefHandoff(token)

    expect(token).not.toContain(rawInput)
    expect(atob(token.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(token.length / 4) * 4, "="))).not.toContain(
      rawInput
    )
    expect(decoded?.analysisSource).toBe("local-fallback")
    expect(decoded?.interpretation.requirements).toEqual(result.interpretation.requirements)
    expect(decoded?.interpretation.normalizedInput).toBe("Custom role request")
  })
})
