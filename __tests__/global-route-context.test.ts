import fs from "node:fs"
import path from "node:path"
import { isSiteNavItemActive, SITE_NAV_ITEMS } from "../components/site-nav-state"

describe("global route context", () => {
  it.each([
    ["/projects", "/projects", "", true],
    ["/projects/x-games", "/projects", "", true],
    ["/blog/voice-first-xr", "/blog", "", true],
    ["/about", "/about", "", true],
    ["/about", "/about#professional-experience", "#professional-experience", true],
    ["/about", "/about", "#professional-experience", false],
    ["/about", "/about#professional-experience", "#contact", false],
    ["/project", "/projects", "", false],
    ["/blogroll", "/blog", "", false],
  ])("matches %s against %s at %s as %s", (pathname, itemPath, hash, expected) => {
    expect(isSiteNavItemActive(pathname, itemPath, hash)).toBe(expected)
  })

  it("publishes the four task-oriented navigation destinations", () => {
    expect(SITE_NAV_ITEMS).toEqual([
      { name: "Work", path: "/projects" },
      { name: "Experience", path: "/about#professional-experience" },
      { name: "Writing", path: "/blog" },
      { name: "About", path: "/about" },
    ])
  })

  it("keeps the route tree server-owned instead of hydrating it through a client wrapper", () => {
    const layout = fs.readFileSync(path.join(__dirname, "..", "app", "layout.tsx"), "utf8")

    expect(layout).not.toContain("RouteTransition")
    expect(layout).not.toContain('from "next/navigation"')
    expect(layout).toContain('{children}')
  })

  it("publishes active-route and mobile-menu semantics", () => {
    const source = fs.readFileSync(
      path.join(__dirname, "..", "components", "site-nav.tsx"),
      "utf8"
    )
    const runtime = fs.readFileSync(
      path.join(__dirname, "..", "public", "scripts", "site-nav.js"),
      "utf8"
    )

    expect(source).not.toMatch(/^\s*["']use client["']/u)
    expect(source).toContain('aria-controls="site-mobile-menu"')
    expect(source).toContain('aria-label="Mobile navigation"')
    expect(source).toContain("<dialog")
    expect(source).toContain("data-site-menu-open")
    expect(runtime).toContain("dialog.showModal()")
    expect(runtime).toContain('dialog.addEventListener("close"')
    expect(runtime).toContain('trigger.setAttribute("aria-expanded", "false")')
  })

  it("keeps the optional Metaverse bundle off the standard homepage", () => {
    const layout = fs.readFileSync(path.join(__dirname, "..", "app", "layout.tsx"), "utf8")
    const middleware = fs.readFileSync(path.join(__dirname, "..", "middleware.ts"), "utf8")

    expect(layout).toContain("<SiteNav />")
    expect(layout).not.toContain("SnowCrashEffects")
    expect(middleware).toContain('request.nextUrl.searchParams.get("metaverse") === "true"')
    expect(middleware).toContain("NextResponse.rewrite")
  })

  it("keeps the contact conversion target clear of the sticky navigation", () => {
    const source = fs.readFileSync(
      path.join(__dirname, "..", "app", "about", "page.tsx"),
      "utf8"
    )

    expect(source).toContain('id="contact" className="profile-contact-section scroll-mt-24"')
  })
})
