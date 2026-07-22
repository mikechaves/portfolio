import fs from "node:fs"
import path from "node:path"
import { EVIDENCE_DOSSIER_PROJECT_IDS } from "@/app/projects/[id]/dossierConfig"
import { RETIRED_PROJECT_REDIRECTS } from "@/app/projects/[id]/retiredProjectRedirects"
import { PROJECTS } from "@/data/projects"

const RETIRED_IDS = [
  "astrocade-qa-calibration-tool",
  "apt-plus",
  "gaia",
  "transcribe",
]

const RETIRED_ASSET_DIRECTORIES = [
  "public/projects/astrocade",
  "public/projects/apt-plus",
  "public/projects/gaia",
  "public/projects/transcribe",
]

describe("retired proprietary case studies", () => {
  it("maps every former route to the professional-experience anchor", () => {
    expect(RETIRED_PROJECT_REDIRECTS).toEqual({
      "astrocade-qa-calibration-tool": "/about#professional-experience",
      "apt-plus": "/about#professional-experience",
      gaia: "/about#professional-experience",
      transcribe: "/about#professional-experience",
    })
  })

  it("removes proprietary asset directories from the current tree", () => {
    for (const directory of RETIRED_ASSET_DIRECTORIES) {
      expect(fs.existsSync(path.join(process.cwd(), directory))).toBe(false)
    }
  })

  it("removes retired IDs from public media and dossier configuration", () => {
    const mediaSource = fs.readFileSync(
      path.join(process.cwd(), "app", "projects", "[id]", "projectMedia.ts"),
      "utf8"
    )
    const thumbnailSource = fs.readFileSync(
      path.join(process.cwd(), "data", "project-thumbnails.ts"),
      "utf8"
    )

    for (const id of RETIRED_IDS) {
      expect(EVIDENCE_DOSSIER_PROJECT_IDS.has(id)).toBe(false)
      expect(mediaSource).not.toContain(`\"${id}\"`)
      expect(thumbnailSource).not.toContain(id)
    }
    for (const directory of RETIRED_ASSET_DIRECTORIES) {
      const publicPath = directory.replace(/^public/u, "")
      expect(mediaSource).not.toContain(publicPath)
      expect(thumbnailSource).not.toContain(publicPath)
    }
  })

  it("keeps GeoVoice as a public, inspectable project", () => {
    expect(PROJECTS.find((project) => project.id === "geovoice")).toBeDefined()
    expect(EVIDENCE_DOSSIER_PROJECT_IDS.has("geovoice")).toBe(true)
  })
})
