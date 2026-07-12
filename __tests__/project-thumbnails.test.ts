import fs from "node:fs"
import path from "node:path"
import { getProjectThumbnailFocalPoint } from "@/data/project-thumbnails"
import { PROJECTS } from "@/data/projects"
import type { ProjectThumbnailFocalPoint } from "@/types/project"

const VALID_FOCAL_POINTS = new Set<ProjectThumbnailFocalPoint>([
  "center",
  "top",
  "bottom",
  "left",
  "right",
])

describe("project thumbnail framing", () => {
  test("every canonical project resolves to a valid focal point", () => {
    expect(PROJECTS).not.toHaveLength(0)

    for (const project of PROJECTS) {
      expect(VALID_FOCAL_POINTS.has(getProjectThumbnailFocalPoint(project.id))).toBe(true)
      expect(project.thumbnailFocalPoint).toBe(getProjectThumbnailFocalPoint(project.id))
    }
  })

  test("unknown projects retain centered framing", () => {
    expect(getProjectThumbnailFocalPoint("future-project")).toBe("center")
  })

  test("Astrocade preserves the dashboard heading", () => {
    expect(getProjectThumbnailFocalPoint("astrocade-qa-calibration-tool")).toBe("top")
  })

  test("the shared card keeps a consistent evidence frame", () => {
    const source = fs.readFileSync(
      path.join(__dirname, "..", "components", "project-card.tsx"),
      "utf8",
    )

    expect(source).toContain('className="relative aspect-[16/9]')
    expect(source).not.toContain("lg:aspect-[16/7]")
    expect(source).toContain("THUMBNAIL_OBJECT_POSITIONS[thumbnailFocalPoint]")
  })
})
