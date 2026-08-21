import fs from "node:fs"
import path from "node:path"

describe("performance audit harness", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "scripts", "audit-performance.mjs"),
    "utf8"
  )

  it("warms only an isolated script-free document before measuring application routes", () => {
    expect(source).toContain('createServer((_request, response) => {')
    expect(source).toContain("Audit harness warmup")
    expect(source).toContain("await warmLighthouseHarness()")
    expect(source.indexOf("await warmLighthouseHarness()")).toBeLessThan(
      source.indexOf("for (const profile of PROFILES)")
    )
  })

  it("preserves the repository performance thresholds", () => {
    expect(source).toContain("lcpMs: 2_500")
    expect(source).toContain("cls: 0.1")
    expect(source).toContain("tbtMs: 200")
  })
})
