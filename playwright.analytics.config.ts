import { defineConfig } from "@playwright/test"

const port = 3202
const baseURL = `http://127.0.0.1:${port}`

export default defineConfig({
  testDir: "./e2e/analytics",
  outputDir: "test-results/analytics-audit",
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
    permissions: ["clipboard-write"],
    trace: "retain-on-failure",
  },
  webServer: {
    command: `NEXT_PUBLIC_ANALYTICS_DEBUG=1 pnpm start --hostname 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
