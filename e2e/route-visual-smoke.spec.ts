import { expect, test, type Page, type TestInfo } from "@playwright/test"

interface SmokeRoute {
  name: string
  path: string
  heading: string | RegExp
}

const routes: SmokeRoute[] = [
  { name: "home", path: "/", heading: /^Mike_\s*Chaves_$/i },
  { name: "projects", path: "/projects", heading: "Project Signal Index" },
  {
    name: "astrocade",
    path: "/projects/astrocade-qa-calibration-tool",
    heading: "Astrocade AI QA Calibration Tool",
  },
  { name: "wizzo", path: "/projects/wizzo", heading: "Wizzo" },
  { name: "speakeasy", path: "/projects/speakeasy", heading: "SpeakEasy" },
]

async function settleVisuals(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" })
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-delay: 0s !important;
        animation-duration: 0s !important;
        caret-color: transparent !important;
        transition-delay: 0s !important;
        transition-duration: 0s !important;
      }
    `,
  })
  await page.evaluate(async () => {
    await document.fonts.ready
    const step = Math.max(window.innerHeight * 0.8, 400)
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => window.setTimeout(resolve, 20))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(100)
}

async function captureRoute(page: Page, testInfo: TestInfo, route: SmokeRoute) {
  const pageErrors: string[] = []
  const consoleErrors: string[] = []
  page.on("pageerror", (error) => pageErrors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text())
  })

  const response = await page.goto(route.path, { waitUntil: "domcontentloaded" })

  expect(response?.ok(), `${route.path} should return a successful response`).toBe(true)
  await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible()
  await expect(page.locator("body")).not.toContainText("Internal Server Error")
  await expect(page.locator("nextjs-portal [data-nextjs-dialog-overlay]")).toHaveCount(0)
  await settleVisuals(page)
  expect(pageErrors, `${route.path} should not raise browser runtime errors`).toEqual([])
  expect(consoleErrors, `${route.path} should not log browser console errors`).toEqual([])

  const screenshotPath = testInfo.outputPath(`${route.name}-full-page.png`)
  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
    animations: "disabled",
  })
}

for (const route of routes) {
  test(`${route.name} renders without a framework or runtime failure`, async ({ page }, testInfo) => {
    await captureRoute(page, testInfo, route)
  })
}

test("project category controls update the rendered archive", async ({ page }, testInfo) => {
  const pageErrors: string[] = []
  const consoleErrors: string[] = []
  page.on("pageerror", (error) => pageErrors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text())
  })

  await page.goto("/projects", { waitUntil: "domcontentloaded" })
  await expect(page.getByRole("heading", { level: 1, name: "Project Signal Index" })).toBeVisible()

  const aiFilter = page
    .getByLabel("Project categories")
    .getByRole("button", { name: /^AI\b/ })
  await aiFilter.click()

  await expect(aiFilter).toHaveAttribute("aria-pressed", "true")
  await expect(page.getByRole("heading", { level: 3, name: "Astrocade AI QA Calibration Tool" })).toBeVisible()
  await settleVisuals(page)
  expect(pageErrors, "the project filter should not raise browser runtime errors").toEqual([])
  expect(consoleErrors, "the project filter should not log browser console errors").toEqual([])

  const screenshotPath = testInfo.outputPath("projects-ai-filter.png")
  await page.screenshot({ path: screenshotPath, fullPage: true, animations: "disabled" })
})
