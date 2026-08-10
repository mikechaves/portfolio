import { expect, test, type Page } from "@playwright/test"

interface DebugEvent {
  name: string
  parameters: Record<string, string | number | boolean>
}

const PROVIDER_REQUEST = /google-analytics\.com|googletagmanager\.com|\/_vercel\/insights|\/_vercel\/speed-insights/iu

async function debugEvents(page: Page): Promise<DebugEvent[]> {
  return page.evaluate(
    () =>
      (window as Window & { __portfolioAnalyticsDebugEvents?: DebugEvent[] })
        .__portfolioAnalyticsDebugEvents ?? []
  )
}

test("consent-gated debug mode verifies the real funnel with zero provider transport", async ({
  page,
}) => {
  const providerRequests: string[] = []
  page.on("request", (request) => {
    if (PROVIDER_REQUEST.test(request.url())) providerRequests.push(request.url())
  })

  await page.goto("/")
  await expect(page.getByRole("region", { name: "Optional analytics preferences" })).toBeVisible()
  expect(await debugEvents(page)).toEqual([])

  await page.getByRole("button", { name: "Allow optional analytics" }).click()
  await expect
    .poll(async () => (await debugEvents(page)).filter((event) => event.name === "page_view").length)
    .toBe(1)

  await page.getByRole("button", { name: /Human-in-the-loop AI/i }).first().click()
  await page.waitForURL(/\/projects\?focusPreset=/u)
  await page.locator('a[href="/projects/x-games"]').first().click()
  await page.waitForURL(/\/projects\/x-games$/u)
  await page.getByRole("button", { name: "Share case study" }).click()

  await expect
    .poll(async () => (await debugEvents(page)).some((event) => event.name === "share"))
    .toBe(true)

  const events = await debugEvents(page)
  expect(events.some((event) => event.name === "adaptive_focus_started")).toBe(true)
  expect(events.some((event) => event.name === "share")).toBe(true)
  expect(
    events.filter((event) => event.name === "page_view").map((event) => event.parameters.page_path)
  ).toEqual(["/", "/projects", "/projects/x-games"])
  expect(JSON.stringify(events)).not.toMatch(/focusPreset|focusBrief|focusSession|localhost|127\.0\.0\.1/iu)
  expect(providerRequests).toEqual([])
})

test("declining persists, records nothing, and remains reversible from the footer", async ({ page }) => {
  const providerRequests: string[] = []
  page.on("request", (request) => {
    if (PROVIDER_REQUEST.test(request.url())) providerRequests.push(request.url())
  })

  await page.goto("/")
  await page.getByRole("button", { name: "Keep optional analytics off" }).click()
  await page.getByRole("button", { name: /Human-in-the-loop AI/i }).first().click()
  await page.waitForURL(/\/projects\?focusPreset=/u)
  expect(await debugEvents(page)).toEqual([])

  await page.getByRole("button", { name: "Analytics preferences" }).click()
  await expect(page.getByRole("region", { name: "Optional analytics preferences" })).toBeVisible()
  await page.getByRole("button", { name: "Allow optional analytics" }).click()
  await expect
    .poll(async () => (await debugEvents(page)).filter((event) => event.name === "page_view").length)
    .toBe(1)

  await page.reload()
  await expect(page.getByRole("region", { name: "Optional analytics preferences" })).toBeHidden()
  await expect
    .poll(async () => (await debugEvents(page)).filter((event) => event.name === "page_view").length)
    .toBe(1)
  expect(providerRequests).toEqual([])
})

for (const signal of ["Global Privacy Control", "Do Not Track"] as const) {
  test(`${signal} keeps optional analytics off`, async ({ page }) => {
    const providerRequests: string[] = []
    page.on("request", (request) => {
      if (PROVIDER_REQUEST.test(request.url())) providerRequests.push(request.url())
    })

    await page.addInitScript((privacySignal) => {
      if (privacySignal === "Global Privacy Control") {
        Object.defineProperty(navigator, "globalPrivacyControl", {
          configurable: true,
          value: true,
        })
        return
      }

      Object.defineProperty(navigator, "doNotTrack", {
        configurable: true,
        value: "1",
      })
    }, signal)

    await page.goto("/")
    await expect(page.getByRole("region", { name: "Optional analytics preferences" })).toBeHidden()

    await page.getByRole("button", { name: "Analytics preferences" }).click()
    await expect(page.getByText(/Global Privacy Control or Do Not Track/iu)).toBeVisible()
    await expect(page.getByRole("button", { name: "Allow optional analytics" })).toHaveCount(0)

    await page.getByRole("button", { name: /Human-in-the-loop AI/i }).first().click()
    await page.waitForURL(/\/projects\?focusPreset=/u)
    expect(await debugEvents(page)).toEqual([])
    expect(providerRequests).toEqual([])
  })
}
