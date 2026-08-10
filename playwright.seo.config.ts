import { defineConfig } from "@playwright/test"

const port = 3200
const externalBaseURL = process.env.SEO_AUDIT_BASE_URL
const baseURL = externalBaseURL ?? `http://127.0.0.1:${port}`

export default defineConfig({
  testDir: "./e2e/seo",
  outputDir: "test-results/seo-audit",
  preserveOutput: "failures-only",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: "line",
  timeout: 120_000,
  use: {
    baseURL,
    colorScheme: "dark",
    trace: "retain-on-failure",
  },
  webServer: externalBaseURL
    ? undefined
    : {
        command: `pnpm start --hostname 127.0.0.1 --port ${port}`,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120_000,
      },
})
