import { expect, test, type Page, type TestInfo } from "@playwright/test"

interface SmokeRoute {
  name: string
  path: string
  heading: string | RegExp
}

const routes: SmokeRoute[] = [
  { name: "home", path: "/", heading: /^Mike_\s*Chaves_$/i },
  { name: "projects", path: "/projects", heading: "Project Signal Index" },
  { name: "wizzo", path: "/projects/wizzo", heading: "Wizzo" },
  { name: "geovoice", path: "/projects/geovoice", heading: "GeoVoice" },
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

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1)
}

async function openPreset(page: Page, presetId: string) {
  await page.goto(`/projects?focusPreset=${presetId}`, { waitUntil: "domcontentloaded" })
  await expect(page.getByRole("heading", { level: 2, name: "Role Fit Brief" })).toBeVisible()
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
  await expect(page.getByRole("heading", { level: 3, name: "Wizzo" })).toBeVisible()
  await settleVisuals(page)
  expect(pageErrors, "the project filter should not raise browser runtime errors").toEqual([])
  expect(consoleErrors, "the project filter should not log browser console errors").toEqual([])

  const screenshotPath = testInfo.outputPath("projects-ai-filter.png")
  await page.screenshot({ path: screenshotPath, fullPage: true, animations: "disabled" })
})

test("homepage features only the curated public proof", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" })
  const featured = page.locator('section[aria-labelledby="featured-projects-heading"]')

  await expect(featured.getByRole("heading", { level: 3 })).toHaveText([
    "Wizzo",
    "X Games",
    "SpeakEasy",
  ])
  await expect(featured).not.toContainText(/Astrocade|Ford|Starbucks|Snorkel AI/u)
  await expectNoHorizontalOverflow(page)
})

test("public archive follows the canonical project order", async ({ page }) => {
  await page.goto("/projects", { waitUntil: "domcontentloaded" })
  const archive = page.locator('section[aria-labelledby="project-archive-heading"]')
  const seeMore = archive.getByRole("button", { name: "See More" })
  if (await seeMore.isVisible()) await seeMore.click()

  await expect(archive.getByRole("heading", { level: 3 })).toHaveText([
    "Wizzo",
    "X Games",
    "SpeakEasy",
    "Sound Escape VR",
    "Material Explorer",
    "GeoVoice",
    "Vulnerability Visualizer",
    "PetitionReady",
    "Creative Supply Engine",
    "Portals",
    "Die, AI!",
  ])
  await expect(archive).not.toContainText(/Astrocade|Ford|Starbucks|Snorkel AI/u)
})

test("Games & Interactive exposes only the curated game set", async ({ page }) => {
  await page.goto("/projects", { waitUntil: "domcontentloaded" })
  const gamesFilter = page
    .getByLabel("Project categories")
    .getByRole("button", { name: /^Games & Interactive\b/ })

  await gamesFilter.click()
  await expect(gamesFilter).toHaveAttribute("aria-pressed", "true")
  const seeMore = page.getByRole("button", { name: "See More" })
  if (await seeMore.isVisible()) await seeMore.click()
  await expect(page.getByRole("heading", { level: 3, name: "X Games" })).toBeVisible()
  await expect(page.getByRole("heading", { level: 3, name: "Sound Escape VR" })).toBeVisible()
  await expect(page.getByRole("heading", { level: 3, name: "Portals" })).toBeVisible()
  await expect(page.getByRole("heading", { level: 3, name: "Die, AI!" })).toBeVisible()
  await expect(page.getByRole("heading", { level: 3, name: "Wizzo" })).toHaveCount(0)
})

test("human review and LLM lenses render the correct professional evidence variants", async ({
  page,
}) => {
  await openPreset(page, "hitl-evaluation")
  const astrocade = page.getByRole("article").filter({ hasText: "Astrocade" }).first()
  await expect(astrocade).toContainText("Confidential employment evidence")
  await expect(astrocade).toContainText("Production AI game-quality operations")
  await expect(astrocade).toContainText("Human-in-the-loop AI")
  await expect(astrocade).toContainText("Evaluation and calibration")
  await expect(astrocade).toContainText("Moderation and QA")
  await expect(astrocade.locator("img")).toHaveCount(0)
  await expect(astrocade.locator("a")).toHaveCount(0)
  await expect(page.locator("body")).not.toContainText("Astrocade AI QA Calibration Tool")
  await expect(
    page.locator('section[aria-labelledby="project-archive-heading"]')
  ).not.toContainText("Astrocade")

  await openPreset(page, "llm-evaluation-training-data")
  const snorkel = page.getByRole("article").filter({ hasText: "Snorkel AI" }).first()
  await expect(snorkel).toContainText("Approved public experience")
  await expect(snorkel).not.toContainText("Confidential employment evidence")
  await expect(snorkel).toContainText("LLM and model evaluation")
  await expect(snorkel).toContainText("Training data and annotation")
  await expect(snorkel).toContainText("Prompt engineering")
  await expect(snorkel.locator("img")).toHaveCount(0)
  await expect(snorkel.locator("a")).toHaveCount(0)
  await expect(snorkel.getByText("Inspect case study")).toHaveCount(0)
  await expectNoHorizontalOverflow(page)
})

test("operational and XR lenses preserve production versus prototype status", async ({ page }) => {
  await openPreset(page, "operational-ux")
  const ford = page.getByRole("article").filter({ hasText: "Ford Motor Company" }).first()
  await expect(ford).toContainText("Production manufacturing system")
  await expect(page.locator("body")).not.toContainText(/\$1M|40%|APT\+/u)

  await openPreset(page, "xr-accessibility")
  await expect(page.getByText("SpeakEasy", { exact: true }).first()).toBeVisible()
  const starbucks = page.getByRole("article").filter({ hasText: "Starbucks" }).first()
  await expect(starbucks).toContainText("Emerging technology prototypes")
  await expect(starbucks).toContainText("not production")
  await expect(starbucks.locator("img")).toHaveCount(0)
  await expect(starbucks.locator("a")).toHaveCount(0)
})

test("game and creator lens keeps public game proof central", async ({ page }) => {
  await openPreset(page, "game-ux-creator-systems")
  const primaryProof = page.getByRole("heading", { level: 3, name: "Primary proof" }).locator("..")

  await expect(primaryProof.getByText("X Games", { exact: true }).first()).toBeVisible()
  await expect(page.getByText("Sound Escape VR", { exact: true }).first()).toBeVisible()
  await expect(page.getByText("Material Explorer", { exact: true }).first()).toBeVisible()
  await expect(page.getByText("Astrocade", { exact: true }).first()).toBeVisible()
  await expect(page.locator("body")).not.toContainText("Astrocade AI QA Calibration Tool")
})

test("custom role queries preserve the model-evaluation and operational-calibration distinction", async ({
  page,
}) => {
  await page.route("**/api/adaptive-focus/analyze", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "Unavailable during deterministic browser verification." }),
    })
  })
  await page.goto("/projects", { waitUntil: "networkidle" })
  const input = page.getByLabel("Role, responsibilities, or job description")
  const submit = page.getByRole("button", { name: "Build Role Fit Brief", exact: true })

  const trainerQuery =
    "AI trainer who has evaluated LLM reasoning, authored benchmark problems, performed data annotation, and improved model outputs"
  await input.fill(trainerQuery)
  await expect(input).toHaveValue(trainerQuery)
  await expect(submit).toBeEnabled()
  await submit.click()
  await expect(
    page.getByRole("heading", { level: 2, name: "Role Fit Brief", exact: true })
  ).toBeVisible()
  await expect(page.getByRole("article").filter({ hasText: "Snorkel AI" }).first()).toContainText(
    "Approved public experience"
  )

  await input.fill("Human-in-the-loop QA calibration and moderation workflows for AI-generated content")
  await expect(submit).toBeEnabled()
  await submit.click()
  const astrocade = page.getByRole("article").filter({ hasText: "Astrocade" }).first()
  await expect(astrocade).toContainText("Primary proof")
  await expect(astrocade).toContainText("Confidential employment evidence")
})

test("about distinguishes confidential and approved professional summaries without project links", async ({
  page,
}) => {
  await page.goto("/about#professional-experience", { waitUntil: "domcontentloaded" })
  const experience = page.locator("#professional-experience")
  await expect(
    experience.getByRole("heading", { level: 2, name: "Selected professional experience" })
  ).toBeVisible()
  await expect(experience.getByRole("article")).toHaveCount(4)

  const snorkel = experience.getByRole("article").filter({ hasText: "Snorkel AI" })
  await expect(snorkel).toContainText("Approved public experience")
  await expect(snorkel).toContainText("Approved public contribution")
  await expect(snorkel).not.toContainText("Confidential employment evidence")

  for (const company of ["Astrocade", "Ford Motor Company", "Starbucks"]) {
    await expect(experience.getByRole("article").filter({ hasText: company })).toContainText(
      "Confidential employment evidence"
    )
  }
  await expect(experience.getByRole("article").filter({ hasText: "Ford Motor Company" })).toContainText(
    "Production manufacturing system"
  )
  await expect(experience.getByRole("article").filter({ hasText: "Starbucks" })).toContainText(
    "Emerging technology prototypes"
  )
  await expect(experience.locator("img")).toHaveCount(0)
  await expect(experience.locator("a")).toHaveCount(0)
  await expectNoHorizontalOverflow(page)
})

test("retired case-study routes redirect server-side to professional experience", async ({
  page,
  request,
}) => {
  for (const path of [
    "/projects/astrocade-qa-calibration-tool",
    "/projects/apt-plus",
    "/projects/gaia",
    "/projects/transcribe",
  ]) {
    const response = await request.get(path, { maxRedirects: 0 })
    expect(response.status()).toBe(308)
    expect(response.headers().location).toBe("/about#professional-experience")

    await page.goto(path, { waitUntil: "domcontentloaded" })
    await expect(page).toHaveURL(/\/about#professional-experience$/u)
    await expect(
      page.getByRole("heading", { level: 2, name: "Selected professional experience" })
    ).toBeVisible()
  }
})

test("retired proprietary assets are not served", async ({ request }) => {
  for (const path of [
    "/projects/astrocade/calibration-dashboard.png",
    "/projects/apt-plus/aptplus-interface.png",
    "/projects/gaia/gaia-store-overview.png",
    "/projects/transcribe/testing.png",
  ]) {
    const response = await request.get(path)
    expect(response.status()).toBe(404)
  }
})
