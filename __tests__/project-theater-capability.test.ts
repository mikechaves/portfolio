import fs from "node:fs"
import path from "node:path"
import vm from "node:vm"

const source = fs.readFileSync(path.join(process.cwd(), "public/scripts/project-theater-capability.js"), "utf8")

function probe(getContext?: jest.Mock) {
  const postMessage = jest.fn()
  vm.runInNewContext(source, {
    OffscreenCanvas: getContext ? class { getContext = getContext } : undefined,
    self: { postMessage, close: jest.fn() },
  })
  return postMessage.mock.calls[0][0]
}

function graphicsContext(driver: string | null) {
  const loseContext = jest.fn()
  return {
    getExtension: (name: string) => name === "WEBGL_debug_renderer_info"
      ? driver === null ? null : { UNMASKED_RENDERER_WEBGL: 37446 }
      : { loseContext },
    getParameter: () => driver,
    loseContext,
  }
}

describe("optional project graphics capability probe", () => {
  it("does not reject a normal canvas when OffscreenCanvas is absent", () => {
    expect(probe()).toBeNull()
  })

  it("treats unavailable worker WebGL as inconclusive", () => {
    expect(probe(jest.fn(() => null))).toBeNull()
    expect(probe(jest.fn(() => { throw new Error("Worker graphics unavailable") }))).toBeNull()
  })

  it("accepts hardware graphics and releases the temporary context", () => {
    const context = graphicsContext("ANGLE (Apple, ANGLE Metal Renderer: Apple M4 Pro)")
    expect(probe(jest.fn(() => context))).toBe(true)
    expect(context.loseContext).toHaveBeenCalledTimes(1)
  })

  it("does not require renderer-identification access", () => {
    expect(probe(jest.fn(() => graphicsContext(null)))).toBe(true)
  })

  it.each(["ANGLE (SwiftShader Device)", "llvmpipe (LLVM)", "softpipe", "Software Rasterizer"])(
    "declines a known software renderer: %s", (driver) => {
      expect(probe(jest.fn(() => graphicsContext(driver)))).toBe(false)
    }
  )

  it("identifies software off-thread after a strict context refusal", () => {
    const context = graphicsContext("ANGLE (SwiftShader Device)")
    const getContext = jest.fn().mockReturnValueOnce(null).mockReturnValueOnce(context)
    expect(probe(getContext)).toBe(false)
    expect(context.loseContext).toHaveBeenCalledTimes(1)
  })
})
