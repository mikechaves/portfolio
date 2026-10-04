import { expect, test } from "@playwright/test"
import {
  ADAPTIVE_FOCUS_PENDING_KEY,
  ADAPTIVE_FOCUS_PENDING_TTL_MS,
} from "../features/adaptive-focus/handoff"

for (const sessionState of ["missing", "expired", "unavailable"] as const) {
  test(`Adaptive Focus shows recovery guidance when the role session is ${sessionState}`, async ({ page }) => {
    await page.addInitScript(({ state, key, ttl }) => {
      if (state === "unavailable") {
        Object.defineProperty(window, "sessionStorage", {
          get() {
            throw new DOMException("Storage is unavailable", "SecurityError")
          },
        })
      } else if (state === "expired") {
        sessionStorage.setItem(key, JSON.stringify({
          version: 2,
          input: "Creative director leading brand identity and interactive stories",
          createdAt: Date.now() - ttl - 1,
        }))
      }
    }, { state: sessionState, key: ADAPTIVE_FOCUS_PENDING_KEY, ttl: ADAPTIVE_FOCUS_PENDING_TTL_MS })

    await page.goto("/projects?focusSession=1")
    const alert = page.locator('.archive-focus-deck [role="alert"]')
    await expect(alert).toContainText(
      sessionState === "unavailable"
        ? "This browser could not read the temporary Adaptive Focus request."
        : "The temporary role request expired. Paste the role text again to continue."
    )
    await expect(alert).toBeVisible()

    await page.locator(".archive-custom-role > summary").click()
    const input = page.getByLabel("Role, responsibilities, or job description")
    await input.fill("Creative director")
    await expect(input).toBeVisible()
    await expect(page.getByRole("button", { name: "Analyze role", exact: true })).toBeEnabled()
  })
}

test("Edit reopens both Adaptive Focus panels and focuses the existing role text", async ({ page }) => {
  await page.route("**/api/adaptive-focus/analyze", (route) => route.fulfill({
    status: 503,
    contentType: "application/json",
    body: JSON.stringify({ error: "Use the local parser during browser verification." }),
  }))
  await page.goto("/projects")
  const outerSummary = page.locator(".archive-focus-deck > summary")
  const innerSummary = page.locator(".archive-custom-role > summary")
  await outerSummary.click()
  await innerSummary.click()
  const input = page.getByLabel("Role, responsibilities, or job description")
  const roleText = "Creative director leading brand identity and interactive stories"
  await input.fill(roleText)
  await page.getByRole("button", { name: "Analyze role", exact: true }).click()
  await expect(page.getByRole("heading", { name: "Role Fit Brief", exact: true })).toBeVisible()

  await innerSummary.click()
  await outerSummary.click()
  await expect(input).toBeHidden()
  await page.getByRole("button", { name: "Edit", exact: true }).click()
  await expect(input).toBeVisible()
  await expect(input).toBeFocused()
  await expect(input).toHaveValue(roleText)

  // Repeated edits must also work when just the outer panel was collapsed.
  await input.fill(`${roleText} for games`)
  await outerSummary.click()
  await page.getByRole("button", { name: "Edit", exact: true }).click()
  await expect(input).toBeVisible()
  await expect(input).toBeFocused()
  await expect(input).toHaveValue(`${roleText} for games`)
})
