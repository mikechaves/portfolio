import fs from "node:fs"
import path from "node:path"

const readSource = (relativePath: string) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8")

describe("server-first about route", () => {
  const pageSource = readSource("pages/about.tsx")
  const contentSource = readSource("components/about-content.tsx")
  const formSource = readSource("components/about-contact-form.tsx")
  const runtimeSource = readSource("public/scripts/about.js")
  const contactSource = readSource("lib/contact.ts")
  const contactRouteSource = readSource("app/api/contact/route.ts")

  it("ships complete initial HTML without the Next client runtime", () => {
    expect(pageSource).toContain("unstable_runtimeJS: false")
    expect(pageSource).toContain("<AboutContent />")
    expect(pageSource).toContain('<script src="/scripts/about.js" defer data-about-script />')
    expect(pageSource).toContain('<StaticRouteAnalytics pathname="/about" />')
    expect(contentSource).not.toContain("TrackedPortfolioLink")
    expect(contentSource).not.toContain("FocusContextFromQuery")
  })

  it("progressively enhances focus context and the protected contact form", () => {
    expect(contentSource).toContain("data-focus-context")
    expect(formSource).not.toMatch(/^\s*["']use client["']/u)
    expect(formSource).toContain('action="/api/contact"')
    expect(formSource).toContain("data-about-contact-form")
    expect(runtimeSource).toContain("value.textContent = focus")
    expect(runtimeSource).toContain('form.addEventListener("submit"')
    expect(runtimeSource).toContain("new FormData(form)")
    expect(runtimeSource).toContain('dispatchAnalytics("portfolio_contact_submitted"')
    expect(runtimeSource).not.toContain("message.value")
  })

  it("bounds provider work and escapes contact content on the server", () => {
    expect(contactSource).toContain("CONTACT_FORM_MAX_BODY_BYTES")
    expect(contactSource).toContain("escapeHtml")
    expect(contactSource).toContain("if (website)")
    expect(contactRouteSource).toContain("hasAllowedOrigin")
    expect(contactRouteSource).toContain("request.formData()")
    expect(contactRouteSource).toContain("status: 413")
  })
})
