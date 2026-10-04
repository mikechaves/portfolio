// Run against the local production preview: node docs/cinematic/capture-evidence.mjs
// Deliberate pauses let the recording show actual easing and readable selected states.
import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const output = path.resolve('docs/cinematic/evidence')
await mkdir(output, { recursive: true })
const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
  colorScheme: 'dark',
  reducedMotion: 'no-preference',
  recordVideo: { dir: '/tmp/cinematic-recording', size: { width: 1440, height: 1000 } },
})
const page = await context.newPage()
const baseURL = 'http://127.0.0.1:3210'
const screenshot = async (name) => {
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => Promise.all([...document.images].filter(image => image.complete && image.naturalWidth).map(image => image.decode())))
  await page.screenshot({ path: path.join(output, `${name}.png`) })
}
try {
  await page.goto(baseURL)
  await page.locator('[data-theater-ready="true"]').waitFor()
  await page.waitForTimeout(800)
  await screenshot('home-desktop')
  for (const [x, y] of [[250, 570], [1150, 600], [720, 500]]) {
    await page.mouse.move(x, y, { steps: 40 })
    await page.waitForTimeout(700)
  }
  await page.getByRole('button', { name: 'Pause carousel' }).click()
  await page.waitForTimeout(700)
  await page.getByRole('button', { name: 'Resume carousel' }).click()
  await page.locator('#adaptive-focus').scrollIntoViewIfNeeded()
  for (const id of ['creative-direction', 'game-ux-creator-systems', 'xr-accessibility']) {
    await page.locator(`[data-adaptive-focus-preset="${id}"]`).click()
    await page.waitForTimeout(1200)
    if (id === 'game-ux-creator-systems') await screenshot('adaptive-focus-desktop')
  }
  await page.getByRole('button', { name: 'Reset focus', exact: true }).click()
  await page.waitForTimeout(900)
  await page.locator('#work').scrollIntoViewIfNeeded()
  await page.waitForTimeout(900)
  await screenshot('selected-work-desktop')
  await page.locator('#appearances').scrollIntoViewIfNeeded()
  await page.waitForTimeout(700)
  await screenshot('appearances-desktop')
  await page.locator('#music').scrollIntoViewIfNeeded()
  await page.waitForTimeout(700)
  await screenshot('music-desktop')
  await page.goto(`${baseURL}/about`)
  await page.locator('.operating-profile-portrait img').waitFor()
  await page.waitForTimeout(700)
  await screenshot('about-desktop')
  await page.goto(`${baseURL}/projects/x-games`)
  await screenshot('playfold-desktop')
  await context.close()
  await page.video().saveAs(path.join(output, 'motion.webm'))

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
  await mobile.goto(baseURL)
  await mobile.evaluate(() => document.fonts.ready)
  await mobile.locator('[data-theater-work] img').evaluateAll(images => Promise.all(images.map(image => image.decode())))
  await mobile.screenshot({ path: path.join(output, 'home-mobile.png') })
  await mobile.close()
} finally {
  await browser.close()
}
