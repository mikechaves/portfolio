import fs from "node:fs"
import path from "node:path"
import { getRouteTransitionState } from "../components/route-transition-state"
import { isSiteNavItemActive, SITE_NAV_ITEMS } from "../components/site-nav-state"

describe("global route context", () => {
  it.each([
    ["/", "/", true],
    ["/projects", "/projects", true],
    ["/projects/astrocade-qa-calibration-tool", "/projects", true],
    ["/blog/voice-first-xr", "/blog", true],
    ["/about", "/about", true],
    ["/archive", "/", false],
    ["/project", "/projects", false],
    ["/blogroll", "/blog", false],
  ])("matches %s against %s as %s", (pathname, itemPath, expected) => {
    expect(isSiteNavItemActive(pathname, itemPath)).toBe(expected)
  })

  it("keeps the four public navigation destinations stable", () => {
    expect(SITE_NAV_ITEMS).toEqual([
      { name: "impact", path: "/" },
      { name: "systems", path: "/projects" },
      { name: "writing", path: "/blog" },
      { name: "about", path: "/about" },
    ])
  })

  it("removes movement and blur when reduced motion is requested", () => {
    const reduced = getRouteTransitionState(true)

    expect(reduced.initial).toBe(false)
    expect(reduced.animate).toEqual({ opacity: 1 })
    expect(reduced.exit).toEqual({ opacity: 1 })
    expect(reduced.transition).toEqual({ duration: 0 })
  })

  it("preserves the existing signal transition otherwise", () => {
    const standard = getRouteTransitionState(false)

    expect(standard.initial).toEqual({ opacity: 0, y: 10, filter: "blur(6px)" })
    expect(standard.animate).toEqual({ opacity: 1, y: 0, filter: "blur(0px)" })
    expect(standard.exit).toEqual({ opacity: 0, y: -8, filter: "blur(4px)" })
    expect(standard.transition.duration).toBe(0.28)
  })

  it("publishes active-route and mobile-menu semantics", () => {
    const source = fs.readFileSync(
      path.join(__dirname, "..", "components", "site-nav.tsx"),
      "utf8"
    )

    expect(source.match(/aria-current=\{isActive \? "page" : undefined\}/gu)).toHaveLength(2)
    expect(source).toContain('aria-controls="site-mobile-menu"')
    expect(source).toContain('aria-label="Mobile navigation"')
    expect(source).toContain("setIsMobileMenuOpen(false)")
  })
})
