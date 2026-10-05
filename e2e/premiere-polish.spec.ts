import { expect, test } from "@playwright/test"

test("controls, captions and keyboard focus remain readable above the short-screen fold", async ({ page }, testInfo) => {
  const sizes = testInfo.project.name.includes("mobile")
    ? [[390, 844], [360, 740]]
    : [[1180, 757], [1280, 720], [1440, 900], [1024, 768], [820, 1180]]
  for (const [width, height] of sizes) {
    await page.setViewportSize({ width, height })
    await page.goto("/")
    const controls = page.locator("[data-theater-controls]")
    await expect(controls).toBeVisible()
    const bounds = (await controls.boundingBox())!
    expect(bounds.y).toBeGreaterThan(0)
    expect(bounds.y + bounds.height, `${width} × ${height} controls`).toBeLessThan(height - 8)
    const caption = page.locator('[data-theater-slot="center"] .theater-caption')
    const text = (await caption.locator("p").boundingBox())!
    expect(text.y + text.height).toBeLessThan(bounds.y - 4)
    expect(await caption.locator("p").evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(11)
    for (const button of await controls.getByRole("button").all()) {
      const box = (await button.boundingBox())!
      expect(box.width).toBeGreaterThanOrEqual(44)
      expect(box.height).toBeGreaterThanOrEqual(44)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  await page.getByRole("button", { name: "Pause carousel", exact: true }).focus()
  await page.keyboard.press("Shift+Tab")
  const next = page.getByRole("button", { name: "Next project", exact: true })
  await expect(next).toBeFocused()
  await expect(next).toHaveCSS("outline-style", "solid")
  await expect(next).toHaveCSS("outline-width", "2px")
  await next.press("Enter")
  await expect(page.locator("[data-project-theater]")).toHaveAttribute("data-theater-active", "speakeasy")
})

test("system-only reduced-motion suspension recovers repeatedly and autoplay resumes", async ({ page }) => {
  await page.goto("/")
  const theater = page.locator("[data-project-theater]")
  await expect(theater).toHaveAttribute("data-theater-paused", "false")
  for (let i = 0; i < 3; i++) {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await expect(theater).toHaveAttribute("data-theater-paused", "true")
    await expect(page.locator("[data-theater-canvas] canvas")).toHaveCount(0)
    await page.emulateMedia({ reducedMotion: "no-preference" })
    await expect(theater).toHaveAttribute("data-theater-paused", "false")
    await expect(page.getByRole("button", { name: "Pause carousel", exact: true })).toBeVisible()
  }
  await expect(theater).toHaveAttribute("data-theater-active", "speakeasy", { timeout: 10000 })
})

test("explicit pause survives repeated system changes and navigation", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("button", { name: "Pause carousel", exact: true }).click()
  const theater = page.locator("[data-project-theater]")
  for (let i = 0; i < 3; i++) {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.emulateMedia({ reducedMotion: "no-preference" })
    await expect(theater).toHaveAttribute("data-theater-paused", "true")
  }
  await page.locator('[data-theater-work="wizzo"]').press("Enter")
  await expect(page).toHaveURL(/\/projects\/wizzo$/)
  await page.goto("/")
  await expect(theater).toHaveAttribute("data-theater-paused", "true")
  await page.waitForTimeout(7400)
  await expect(theater).toHaveAttribute("data-theater-active", "wizzo")
  await page.getByRole("button", { name: "Resume carousel", exact: true }).click()
  await page.mouse.move(5, 5)
  await expect(theater).toHaveAttribute("data-theater-active", "speakeasy", { timeout: 10000 })
})

test("the wrapping panel passes behind the artwork and rapid reversals settle coherently", async ({ page }) => {
  await page.goto("/")
  const theater = page.locator("[data-project-theater]")
  const next = page.getByRole("button", { name: "Next project", exact: true })
  await next.click()
  // Observe the middle of the actual animation, where the old straight path crossed the art.
  await page.waitForTimeout(430)
  const depth = await page.locator('[data-theater-work="x-games"]').evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).m43)
  expect(depth).toBeLessThan(-200)
  await next.click()
  await next.press("ArrowLeft")
  await next.press("ArrowRight")
  await next.press("ArrowLeft")
  await expect(theater).toHaveAttribute("data-theater-active", "speakeasy")
  await expect(theater).not.toHaveAttribute("data-theater-transitioning", "true")
  await expect(page.locator("[data-theater-counter]")).toHaveText("02 / 03")
  const center = page.locator('[data-theater-slot="center"]')
  await expect(center).toHaveAttribute("href", "/projects/speakeasy")
  const box = (await center.boundingBox())!
  expect(Math.abs(box.x + box.width / 2 - page.viewportSize()!.width / 2)).toBeLessThan(20)
  await expect(page.locator("#adaptive-focus")).toHaveAttribute("data-premiere-lens", "all")
})

test("manual navigation interrupts autoplay without changing the active role lens", async ({ page }) => {
  await page.goto("/")
  await page.locator('[data-adaptive-focus-preset="xr-accessibility"]').click()
  await page.getByRole("button", { name: "Resume carousel", exact: true }).click()
  await page.mouse.move(5, 5)
  const theater = page.locator("[data-project-theater]")
  await expect(theater).toHaveAttribute("data-theater-active", "speakeasy", { timeout: 10000 })
  const next = page.getByRole("button", { name: "Next project", exact: true })
  await next.click()
  await next.press("ArrowLeft")
  await next.press("Home")
  await expect(theater).not.toHaveAttribute("data-theater-transitioning", "true")
  await expect(theater).toHaveAttribute("data-theater-active", "wizzo")
  await expect(theater).toHaveAttribute("data-theater-paused", "true")
  await expect(page.locator("[data-theater-counter]")).toHaveText("01 / 03")
  await expect(page.locator('[data-theater-slot="center"]')).toHaveAttribute("href", "/projects/wizzo")
  await expect(page.locator('[data-adaptive-focus-preset="xr-accessibility"]')).toHaveAttribute("aria-pressed", "true")
  await expect(page.locator("[data-focus-explore]")).toHaveAttribute("href", "/projects?focusPreset=xr-accessibility")
})

test("Wizzo opens with the role sentence and substantial art in the first viewport", async ({ page }, testInfo) => {
  if (!testInfo.project.name.includes("mobile")) await page.setViewportSize({ width:1180, height:757 })
  await page.goto("/projects/wizzo")
  const context = page.locator(".case-study-opening-context")
  await expect(context).toHaveText("As Wizzo’s founder and creative director, I shaped its celestial identity, Wisp character, and AI mentor experience.")
  const sentence = (await context.boundingBox())!
  const image = (await page.locator("[data-case-study-opening-media] img").first().boundingBox())!
  expect(sentence.y + sentence.height).toBeLessThan(image.y)
  expect(Math.min(page.viewportSize()!.height, image.y + image.height) - image.y).toBeGreaterThan(180)
})
