import fs from "node:fs"
import path from "node:path"
import nextConfig from "../next.config"

const root = path.join(__dirname, "..")
const projects = JSON.parse(fs.readFileSync(path.join(root, "public/data/projects.json"), "utf8"))
const archiveSource = fs.readFileSync(path.join(root, "app/archive/page.tsx"), "utf8")
const evidenceSource = fs.readFileSync(path.join(root, "features/adaptive-focus/evidence/catalog.ts"), "utf8")

describe("AI Energy Context Explorer archival", () => {
  it("is absent from active project data and evidence metadata", () => {
    expect(projects["ai-energy-consumption"]).toBeUndefined()
    expect(JSON.stringify(projects)).not.toContain("AI Energy Consumption")
    expect(evidenceSource).not.toContain('projectId: "ai-energy-consumption"')
  })

  it("appears only as a disclosed archive entry without a demo link", () => {
    expect(archiveSource).toContain('id="ai-energy-context-explorer"')
    expect(archiveSource).toContain("original country-level dataset was synthetic")
    expect(archiveSource).toContain("https://github.com/mikechaves/ai-energy-consumption")
    expect(archiveSource).not.toContain("mikechaves.github.io/ai-energy-consumption")
  })

  it("permanently redirects the old detail URL to the archive anchor", async () => {
    const redirects = await nextConfig.redirects?.()
    expect(redirects).toContainEqual({
      source: "/projects/ai-energy-consumption",
      destination: "/archive#ai-energy-context-explorer",
      permanent: true,
    })
  })
})
