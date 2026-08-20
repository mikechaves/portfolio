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

  it("keeps the route transition lightweight and reduced-motion safe", () => {
    const component = fs.readFileSync(
      path.join(__dirname, "..", "components", "route-transition.tsx"),
      "utf8"
    )
    const styles = fs.readFileSync(path.join(__dirname, "..", "app", "globals.css"), "utf8")

    expect(component).not.toContain("framer-motion")
    expect(component).toContain('routeChanged ? "route-transition-enter" : undefined')
    expect(styles).toContain("@keyframes route-signal-enter")
    expect(styles).toContain(".route-transition-enter")
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)")
  })

  it("publishes active-route and mobile-menu semantics", () => {
    const source = fs.readFileSync(
      path.join(__dirname, "..", "components", "site-nav.tsx"),
      "utf8"
    )

    expect(source.match(/aria-current=\{isActive \? "page" : undefined\}/gu)).toHaveLength(2)
    expect(source).toContain('aria-controls="site-mobile-menu"')
    expect(source).toContain('aria-label="Mobile navigation"')
    expect(source).toContain("<Dialog.Content")
    expect(source).toContain("<Dialog.Close")
    expect(source).toContain("onOpenChange={setIsMobileMenuOpen}")
  })

  it("keeps the contact conversion target clear of the sticky navigation", () => {
    const source = fs.readFileSync(
      path.join(__dirname, "..", "app", "about", "page.tsx"),
      "utf8"
    )

    expect(source).toContain('id="contact" className="profile-contact-section scroll-mt-24"')
  })
})
