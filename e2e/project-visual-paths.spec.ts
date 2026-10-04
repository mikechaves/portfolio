import { expect, test } from "@playwright/test"
import { PROJECTS } from "../data/projects"

for (const project of PROJECTS) {
  test(`${project.title} leads with loaded imagery in the first case-study viewport`, async ({ page }) => {
    await page.goto(`/projects/${project.id}`)
    await page.evaluate(() => document.fonts.ready)
    const image = page.locator("[data-case-study-opening-media] img").first()
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
    await image.evaluate((img: HTMLImageElement) => img.decode())
    const bounds = await image.boundingBox()
    const viewport = page.viewportSize()!
    expect(bounds).not.toBeNull()
    expect(Math.min(bounds!.y + bounds!.height, viewport.height) - Math.max(0, bounds!.y)).toBeGreaterThan(200)
    await expect(image).toHaveAttribute("loading", "eager")
    await expect(image).toHaveAttribute("fetchpriority", "high")
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  })
}

for (const probeState of ["accepted", "inconclusive", "unavailable"] as const) {
  test(`WebGL creation failure keeps an attractive silent carousel after an ${probeState} probe`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes("mobile"), "Narrow viewports intentionally use the HTML carousel")
    await page.route("**/scripts/project-theater-capability.js", route => route.fulfill({
      contentType: "application/javascript",
      body: `self.postMessage(${probeState === "accepted" ? "true" : "null"});self.close()`,
    }))
    await page.addInitScript(({ probeState }) => {
      if (probeState === "unavailable") Object.defineProperty(window, "OffscreenCanvas", { value: undefined })
      const original = HTMLCanvasElement.prototype.getContext
      HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
        if (type.includes("webgl")) {
          document.documentElement.dataset.webglAttempted = "true"
          return null
        }
        return original.apply(this, [type, ...args] as Parameters<typeof original>)
      } as typeof original
    }, { probeState })
    await page.goto("/")
    await expect(page.locator("html")).toHaveAttribute("data-webgl-attempted", "true")
    const scene = page.locator("[data-project-theater]")
    await expect(scene).toHaveAttribute("data-theater-ready", "false")
    await expect(scene).toHaveAttribute("data-theater-render-path", "html")
    await expect(page.locator("[data-theater-canvas] canvas")).toHaveCount(0)
    for (const image of await page.locator("[data-theater-work] img").all()) {
      await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
      await expect(image).toHaveCSS("opacity", "1")
    }
    await expect(page.locator("body")).not.toContainText(/reflections unavailable|WebGL|graphics failure/i)
    await page.getByRole("button", { name: "Next project", exact: true }).click()
    await expect(scene).toHaveAttribute("data-theater-active", "speakeasy")
    await page.locator('[data-theater-work="speakeasy"]').click()
    await expect(page).toHaveURL(/\/projects\/speakeasy$/)
  })
}
