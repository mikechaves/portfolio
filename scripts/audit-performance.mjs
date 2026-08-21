#!/usr/bin/env node

import { spawn } from "node:child_process"
import { promises as fs } from "node:fs"
import path from "node:path"
import process from "node:process"
import { chromium } from "@playwright/test"

const ROOT_DIR = process.cwd()
const PORT = Number.parseInt(process.env.PERFORMANCE_AUDIT_PORT || "3204", 10)
const BASE_URL = `http://127.0.0.1:${PORT}`
const OUTPUT_DIR = path.resolve(
  ROOT_DIR,
  process.env.PERFORMANCE_AUDIT_OUTPUT_DIR || "test-results/performance"
)
const PNPM = process.platform === "win32" ? "pnpm.cmd" : "pnpm"

const ROUTES = [
  { id: "home", pathname: "/" },
  { id: "about", pathname: "/about" },
  { id: "projects", pathname: "/projects" },
  { id: "project", pathname: "/projects/x-games" },
  { id: "article", pathname: "/blog/voice-first-xr" },
]

const PROFILES = [
  { id: "mobile", lighthouseArgs: [] },
  { id: "desktop", lighthouseArgs: ["--preset=desktop"] },
]

const BUDGETS = {
  lcpMs: 2_500,
  cls: 0.1,
  tbtMs: 200,
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT_DIR,
      env: process.env,
      stdio: "inherit",
      ...options,
    })

    child.once("error", reject)
    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(
        new Error(
          `${command} ${args.join(" ")} exited with ${signal ? `signal ${signal}` : `code ${code}`}`
        )
      )
    })
  })
}

function getLighthouseArgs(url, outputPath, profileArgs = []) {
  return [
    "exec",
    "lighthouse",
    url,
    "--only-categories=performance",
    "--output=json",
    `--output-path=${outputPath}`,
    `--chrome-path=${chromium.executablePath()}`,
    "--chrome-flags=--headless --no-sandbox",
    "--quiet",
    ...profileArgs,
  ]
}

async function assertPortIsFree() {
  try {
    await fetch(BASE_URL, { signal: AbortSignal.timeout(1_000) })
  } catch {
    return
  }

  throw new Error(`Performance audit port ${PORT} is already serving a response`)
}

async function waitForServer(server, readServerLog) {
  const deadline = Date.now() + 30_000

  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Next.js exited before becoming ready.\n${readServerLog()}`)
    }

    try {
      const response = await fetch(BASE_URL, { signal: AbortSignal.timeout(1_000) })
      if (response.ok) return
    } catch {
      // The server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 250))
  }

  throw new Error(`Next.js did not become ready within 30 seconds.\n${readServerLog()}`)
}

async function stopServer(server) {
  if (server.exitCode !== null) return

  server.kill("SIGTERM")
  await Promise.race([
    new Promise((resolve) => server.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ])

  if (server.exitCode === null) server.kill("SIGKILL")
}

function roundMetric(value, digits = 0) {
  const multiplier = 10 ** digits
  return Math.round(value * multiplier) / multiplier
}

function readMetrics(report) {
  return {
    performanceScore: Math.round(report.categories.performance.score * 100),
    lcpMs: roundMetric(report.audits["largest-contentful-paint"].numericValue),
    cls: roundMetric(report.audits["cumulative-layout-shift"].numericValue, 3),
    tbtMs: roundMetric(report.audits["total-blocking-time"].numericValue),
    transferKb: roundMetric(report.audits["total-byte-weight"].numericValue / 1024),
  }
}

function getFailures(metrics) {
  const failures = []
  if (metrics.lcpMs > BUDGETS.lcpMs) {
    failures.push(`LCP ${metrics.lcpMs}ms > ${BUDGETS.lcpMs}ms`)
  }
  if (metrics.cls > BUDGETS.cls) {
    failures.push(`CLS ${metrics.cls} > ${BUDGETS.cls}`)
  }
  if (metrics.tbtMs > BUDGETS.tbtMs) {
    failures.push(`TBT ${metrics.tbtMs}ms > ${BUDGETS.tbtMs}ms`)
  }
  return failures
}

async function main() {
  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65_535) {
    throw new Error(`Invalid PERFORMANCE_AUDIT_PORT: ${process.env.PERFORMANCE_AUDIT_PORT}`)
  }

  try {
    await fs.access(path.join(ROOT_DIR, ".next", "BUILD_ID"))
  } catch {
    throw new Error("Missing production build. Run `pnpm build` before this script.")
  }

  await assertPortIsFree()
  await fs.rm(OUTPUT_DIR, { recursive: true, force: true })
  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  let serverLog = ""
  const server = spawn(PNPM, ["exec", "next", "start", "-p", String(PORT)], {
    cwd: ROOT_DIR,
    env: { ...process.env, NODE_ENV: "production" },
    stdio: ["ignore", "pipe", "pipe"],
  })

  for (const stream of [server.stdout, server.stderr]) {
    stream.on("data", (chunk) => {
      serverLog = `${serverLog}${chunk}`.slice(-8_000)
    })
  }

  const results = []

  try {
    await waitForServer(server, () => serverLog)

    for (const profile of PROFILES) {
      for (const route of ROUTES) {
        const outputPath = path.join(OUTPUT_DIR, `${route.id}-${profile.id}.json`)
        const url = new URL(route.pathname, BASE_URL).toString()

        process.stdout.write(`Auditing ${route.pathname} (${profile.id})... `)
        await run(PNPM, getLighthouseArgs(url, outputPath, profile.lighthouseArgs), {
          stdio: "ignore",
        })

        const report = JSON.parse(await fs.readFile(outputPath, "utf8"))
        const metrics = readMetrics(report)
        const failures = getFailures(metrics)
        results.push({
          route: route.pathname,
          profile: profile.id,
          ...metrics,
          passed: failures.length === 0,
          failures,
        })

        const status = failures.length === 0 ? "PASS" : "FAIL"
        console.log(
          `${status} — score ${metrics.performanceScore}, LCP ${metrics.lcpMs}ms, ` +
          `CLS ${metrics.cls}, TBT ${metrics.tbtMs}ms, ${metrics.transferKb}KB`
        )
      }
    }
  } finally {
    await stopServer(server)
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    lighthouseVersion: "12.8.2",
    budgets: BUDGETS,
    note: "TBT is the repeatable lab responsiveness proxy; production INP requires field data.",
    results,
  }
  await fs.writeFile(
    path.join(OUTPUT_DIR, "summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`
  )

  const failures = results.flatMap((result) =>
    result.failures.map((failure) => `${result.route} (${result.profile}): ${failure}`)
  )
  if (failures.length > 0) {
    throw new Error(`Performance budgets failed:\n- ${failures.join("\n- ")}`)
  }

  console.log(`All ${results.length} performance audits passed. Reports: ${OUTPUT_DIR}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
