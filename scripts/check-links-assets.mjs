#!/usr/bin/env node

import { promises as fs } from "node:fs"
import path from "node:path"

const ROOT_DIR = process.cwd()
const PUBLIC_DIR = path.join(ROOT_DIR, "public")
const PROJECTS_PATH = path.join(PUBLIC_DIR, "data", "projects.json")
const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx", ".md", ".json"])
const PUBLIC_ASSET_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".html",
  ".ico",
  ".jpg",
  ".jpeg",
  ".json",
  ".mp4",
  ".pdf",
  ".png",
  ".svg",
  ".webmanifest",
  ".webp",
])

const CHECK_EXTERNAL = process.argv.includes("--check-external")
const STRICT_EXTERNAL = process.argv.includes("--strict-external")
const EXTERNAL_TIMEOUT_MS = 8000
const EXTERNAL_REQUEST_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
}

const issues = []
const warnings = []
const passed = {
  assets: 0,
  routes: 0,
  projectCtas: 0,
  requiredLinks: 0,
}
const externalLinks = new Map()

const REQUIRED_PUBLIC_ASSETS = [
  {
    label: "download resume CTA",
    value: "/Michael_Chaves_Resume_min.pdf",
  },
]

const REQUIRED_SOURCE_LINKS = [
  {
    label: "GitHub profile",
    value: "https://github.com/mikechaves",
  },
  {
    label: "X profile",
    value: "https://x.com/mikechaves_io",
  },
  {
    label: "LinkedIn profile",
    value: "https://www.linkedin.com/in/mikejchaves",
  },
  {
    label: "contact email",
    value: "mailto:founder@gowizzo.io",
  },
  {
    label: "resume download",
    value: "/Michael_Chaves_Resume_min.pdf",
  },
]

const IGNORED_EXTERNAL_REFERENCES = new Set(["http://www.w3.org/2000/svg"])
const readdirCache = new Map()

function addIssue(context, message) {
  issues.push(`${context}: ${message}`)
}

function addWarning(context, message) {
  warnings.push(`${context}: ${message}`)
}

function uniqueContext(contexts) {
  return [...new Set(contexts)].sort().join(", ")
}

function normalizeInternalPath(value) {
  const normalized = value.split("#")[0].split("?")[0] || "/"
  return normalized.length > 1 ? normalized.replace(/\/+$/, "") : normalized
}

function hasPublicAssetExtension(value) {
  return PUBLIC_ASSET_EXTENSIONS.has(path.extname(normalizeInternalPath(value)).toLowerCase())
}

function isHttpUrl(value) {
  return value.startsWith("http://") || value.startsWith("https://")
}

function isMailto(value) {
  return value.startsWith("mailto:")
}

function isInternal(value) {
  return value.startsWith("/")
}

function addExternalLink(value, context) {
  if (IGNORED_EXTERNAL_REFERENCES.has(value)) return

  if (!externalLinks.has(value)) {
    externalLinks.set(value, new Set())
  }
  externalLinks.get(value).add(context)
}

function parseJson(text, context) {
  try {
    return JSON.parse(text)
  } catch (error) {
    addIssue(context, `invalid JSON (${error.message})`)
    return {}
  }
}

async function fileExistsCaseSensitive(absolutePath) {
  const relativePath = path.relative(ROOT_DIR, absolutePath)
  const segments = relativePath.split(path.sep).filter(Boolean)
  let current = ROOT_DIR

  for (const segment of segments) {
    let entries
    try {
      entries = await cachedReaddir(current)
    } catch {
      return { exists: false, reason: `missing directory ${path.relative(ROOT_DIR, current)}` }
    }

    if (!entries.includes(segment)) {
      const caseMatch = entries.find((entry) => entry.toLowerCase() === segment.toLowerCase())
      return {
        exists: false,
        reason: caseMatch
          ? `case mismatch: expected ${segment}, found ${caseMatch}`
          : `missing ${path.join(path.relative(ROOT_DIR, current), segment)}`,
      }
    }

    current = path.join(current, segment)
  }

  try {
    const stat = await fs.stat(current)
    return { exists: stat.isFile(), reason: stat.isFile() ? "" : "not a file" }
  } catch {
    return { exists: false, reason: "missing file" }
  }
}

async function cachedReaddir(dir) {
  if (readdirCache.has(dir)) {
    return readdirCache.get(dir)
  }

  const entries = await fs.readdir(dir)
  readdirCache.set(dir, entries)
  return entries
}

async function checkPublicAsset(value, context) {
  const publicPath = normalizeInternalPath(value)
  if (!publicPath.startsWith("/")) {
    addIssue(context, `expected public asset path to start with /, received ${value}`)
    return
  }

  const absolutePath = path.join(PUBLIC_DIR, publicPath.slice(1))
  const result = await fileExistsCaseSensitive(absolutePath)
  if (!result.exists) {
    addIssue(context, `${publicPath} is not a valid case-sensitive public asset (${result.reason})`)
    return
  }

  passed.assets += 1
}

function checkMailto(value, context) {
  const email = value.slice("mailto:".length).trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    addIssue(context, `${value} is not a valid mailto link`)
    return
  }

  passed.projectCtas += 1
}

function checkExternalSyntax(value, context) {
  if (isMailto(value)) {
    checkMailto(value, context)
    return
  }

  try {
    const url = new URL(value)
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      addIssue(context, `${value} must use http or https`)
      return
    }
    addExternalLink(value, context)
    passed.projectCtas += 1
  } catch {
    addIssue(context, `${value} is not a valid URL`)
  }
}

async function checkRoute(value, routeSet, context) {
  const route = normalizeInternalPath(value)

  if (routeSet.has(route)) {
    passed.routes += 1
    return
  }

  if (route.startsWith("/api/placeholder")) {
    passed.routes += 1
    return
  }

  addIssue(context, `${value} does not match a known internal route`)
}

async function listFiles(dir) {
  let entries
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return []
  }

  const files = []
  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await listFiles(absolutePath))
    } else if (
      SOURCE_EXTENSIONS.has(path.extname(entry.name)) &&
      !entry.name.includes(".test.") &&
      !entry.name.includes(".spec.")
    ) {
      files.push(absolutePath)
    }
  }

  return files
}

async function buildRouteSet(projectIds) {
  const routes = new Set([
    "/",
    "/about",
    "/api/adaptive-focus/analyze",
    "/blog",
    "/error",
    "/projects",
  ])
  for (const projectId of projectIds) {
    routes.add(`/projects/${projectId}`)
  }

  for (const postId of await getBlogPostIds()) {
    routes.add(`/blog/${postId}`)
  }

  const blogDir = path.join(ROOT_DIR, "app", "blog")
  let blogEntries = []
  try {
    blogEntries = await fs.readdir(blogDir, { withFileTypes: true })
  } catch {
    addWarning("blog routes", "app/blog is missing")
  }

  for (const entry of blogEntries) {
    if (!entry.isDirectory()) continue
    if (isDynamicRouteSegment(entry.name)) continue

    const pagePath = path.join(blogDir, entry.name, "page.tsx")
    try {
      await fs.access(pagePath)
      routes.add(`/blog/${entry.name}`)
    } catch {
      addWarning("blog routes", `${entry.name} has no page.tsx`)
    }
  }

  return routes
}

function isDynamicRouteSegment(segment) {
  return segment.startsWith("[") && segment.endsWith("]")
}

async function getBlogPostIds() {
  const postsPath = path.join(ROOT_DIR, "lib", "posts.ts")
  try {
    const postsText = await fs.readFile(postsPath, "utf8")
    return [...postsText.matchAll(/id:\s*"([^"]+)"/g)].map((match) => match[1])
  } catch {
    return []
  }
}

async function validateProjectData(projects, routeSet) {
  for (const [projectId, project] of Object.entries(projects)) {
    const context = `project:${projectId}`

    if (!projectId.trim()) addIssue(context, "project id is empty")
    if (!project.title?.trim()) addIssue(context, "title is empty")
    if (!project.description?.trim()) addIssue(context, "description is empty")
    if (!Array.isArray(project.technologies) || project.technologies.length === 0) {
      addIssue(context, "technologies must contain at least one item")
    }

    if (!project.image?.trim()) {
      addIssue(context, "image is empty")
    } else {
      await checkPublicAsset(project.image, `${context} image`)
    }

    if (Array.isArray(project.gallery)) {
      for (const [index, asset] of project.gallery.entries()) {
        if (!asset?.trim()) {
          addIssue(`${context} gallery[${index}]`, "asset path is empty")
        } else {
          await checkPublicAsset(asset, `${context} gallery[${index}]`)
        }
      }
    }

    const linkFields = [
      ["github", project.github],
      ["demo", project.demo],
    ]

    for (const [field, value] of linkFields) {
      if (typeof value !== "string" || !value.trim()) continue

      const ctaContext = `${context} ${field}`
      if (isInternal(value)) {
        if (hasPublicAssetExtension(value)) {
          await checkPublicAsset(value, ctaContext)
        } else {
          await checkRoute(value, routeSet, ctaContext)
        }
      } else {
        checkExternalSyntax(value, ctaContext)
      }
    }

    if (Array.isArray(project.links)) {
      for (const [index, link] of project.links.entries()) {
        const linkContext = `${context} links[${index}]`
        if (!link.label?.trim()) addIssue(linkContext, "CTA label is empty")
        if (!link.url?.trim()) {
          addIssue(linkContext, "CTA URL is empty")
          continue
        }
        checkExternalSyntax(link.url, linkContext)
      }
    }
  }
}

function extractStaticInternalReferences(fileText, isMarkdown = false) {
  const references = new Set()
  const quotedPathPattern = /["'`]((?:\/)(?!\/)[^"'`\s<>{}]*)["'`]/g
  for (const match of fileText.matchAll(quotedPathPattern)) {
    const value = match[1]
    if (value.includes("${")) continue
    if (value === "/" || value.length > 1) references.add(value)
  }

  if (isMarkdown) {
    const markdownPathPattern = /\]\(((?:\/)(?!\/)[^)\s<>{}]*)\)/g
    for (const match of fileText.matchAll(markdownPathPattern)) {
      const value = match[1]
      if (value === "/" || value.length > 1) references.add(value)
    }
  }

  return references
}

function extractExternalReferences(fileText, isMarkdown = false) {
  const references = new Set()
  const externalPattern = /["'`]((?:https?:\/\/|mailto:)[^"'`\s<>{}]+)["'`]/g
  for (const match of fileText.matchAll(externalPattern)) {
    references.add(match[1])
  }

  if (isMarkdown) {
    const markdownExternalPattern = /\]\(((?:https?:\/\/|mailto:)[^)\s<>{}]+)\)/g
    for (const match of fileText.matchAll(markdownExternalPattern)) {
      references.add(match[1])
    }
  }

  return references
}

async function validateSourceReferences(routeSet) {
  const sourceRoots = ["app", "components", "data", "docs", "features", "lib", "public/data"]
  const sourceFiles = []
  for (const sourceRoot of sourceRoots) {
    sourceFiles.push(...await listFiles(path.join(ROOT_DIR, sourceRoot)))
  }

  const sourceTextForRequiredLinks = []

  for (const absolutePath of sourceFiles) {
    const relativePath = path.relative(ROOT_DIR, absolutePath)
    const text = await fs.readFile(absolutePath, "utf8")
    if (!relativePath.startsWith("docs/")) {
      sourceTextForRequiredLinks.push(text)
    }

    const isMarkdown = path.extname(absolutePath).toLowerCase() === ".md"

    for (const value of extractStaticInternalReferences(text, isMarkdown)) {
      const context = `${relativePath} reference ${value}`
      if (hasPublicAssetExtension(value)) {
        await checkPublicAsset(value, context)
      } else {
        await checkRoute(value, routeSet, context)
      }
    }

    for (const value of extractExternalReferences(text, isMarkdown)) {
      checkExternalSyntax(value, `${relativePath} external reference`)
    }
  }

  const allSourceText = sourceTextForRequiredLinks.join("\n")
  for (const requiredLink of REQUIRED_SOURCE_LINKS) {
    if (!allSourceText.includes(requiredLink.value)) {
      addIssue(`required ${requiredLink.label}`, `${requiredLink.value} is not referenced in source`)
    } else {
      passed.requiredLinks += 1
    }
  }
}

async function validatePosts(routeSet) {
  const postIds = await getBlogPostIds()
  if (postIds.length === 0) {
    addIssue("blog posts", "lib/posts.ts is missing")
    return
  }

  for (const postId of postIds) {
    await checkRoute(`/blog/${postId}`, routeSet, `blog post ${postId}`)
  }
}

async function checkRequiredAssets() {
  for (const asset of REQUIRED_PUBLIC_ASSETS) {
    await checkPublicAsset(asset.value, `required ${asset.label}`)
  }
}

async function checkExternalLink(url, contexts) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), EXTERNAL_TIMEOUT_MS)

  try {
    let response = await fetch(url, {
      method: "HEAD",
      headers: EXTERNAL_REQUEST_HEADERS,
      redirect: "follow",
      signal: controller.signal,
    })

    if (response.status === 405 || response.status === 403) {
      response = await fetch(url, {
        method: "GET",
        headers: EXTERNAL_REQUEST_HEADERS,
        redirect: "follow",
        signal: controller.signal,
      })
    }

    if (response.status >= 400) {
      const message = `${url} returned HTTP ${response.status} (${uniqueContext([...contexts])})`
      if (STRICT_EXTERNAL) addIssue("external link", message)
      else addWarning("external link", message)
      return
    }

    return `${url} -> HTTP ${response.status}`
  } catch (error) {
    const message = `${url} could not be checked: ${error.name === "AbortError" ? "timeout" : error.message}`
    if (STRICT_EXTERNAL) addIssue("external link", message)
    else addWarning("external link", `${message} (${uniqueContext([...contexts])})`)
  } finally {
    clearTimeout(timeout)
  }
}

async function checkExternalLinks() {
  if (!CHECK_EXTERNAL) return []

  const outcomes = []
  for (const [url, contexts] of externalLinks.entries()) {
    const outcome = await checkExternalLink(url, contexts)
    if (outcome) outcomes.push(outcome)
  }
  return outcomes
}

function printList(title, items) {
  if (items.length === 0) return

  console.log(`\n${title}`)
  for (const item of items) {
    console.log(`- ${item}`)
  }
}

async function main() {
  const projectsText = await fs.readFile(PROJECTS_PATH, "utf8")
  const projects = parseJson(projectsText, "public/data/projects.json")
  const projectIds = Object.keys(projects)
  const routeSet = await buildRouteSet(projectIds)

  await validateProjectData(projects, routeSet)
  await validateSourceReferences(routeSet)
  await validatePosts(routeSet)
  await checkRequiredAssets()

  const externalOutcomes = await checkExternalLinks()

  console.log("Portfolio link and asset check")
  console.log(`- Local/public assets checked: ${passed.assets}`)
  console.log(`- Internal routes checked: ${passed.routes}`)
  console.log(`- External/mailto references checked: ${passed.projectCtas}`)
  console.log(`- Required contact/social/resume links present: ${passed.requiredLinks}/${REQUIRED_SOURCE_LINKS.length}`)
  console.log(
    CHECK_EXTERNAL
      ? `- External links checked over HTTP: ${externalOutcomes.length}/${externalLinks.size}`
      : `- External links syntax checked: ${externalLinks.size} (HTTP skipped; pass --check-external to verify statuses)`
  )

  printList("External outcomes", externalOutcomes)
  printList("Warnings", warnings)
  printList("Failures", issues)

  if (issues.length > 0) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
