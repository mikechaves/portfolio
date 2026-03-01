import { runAdaptiveFocus } from "./index"
import { parseIntent } from "./core/intent"
import { rankProjects } from "./core/ranking"
import type { Project } from "@/types/project"

const PROJECTS: Project[] = [
  {
    id: "speakeasy",
    title: "SpeakEasy",
    description: "Voice-driven XR accessibility interface work.",
    image: "/speakeasy.png",
    technologies: ["XR", "Accessibility", "AI"],
    category: "research",
  },
  {
    id: "material-explorer",
    title: "Material Explorer",
    description: "Three.js tooling and rapid prototyping.",
    image: "/material-explorer.png",
    technologies: ["Three.js", "React", "TypeScript"],
    category: "web",
  },
  {
    id: "apt-plus",
    title: "APT+",
    description: "Enterprise UX optimization.",
    image: "/apt-plus.png",
    technologies: ["UX", "Data"],
    category: "design",
  },
]

describe("Adaptive Focus", () => {
  it("interprets multi-signal natural language intent", () => {
    const intent = parseIntent("I'm hiring for an AI design engineer focused on accessibility")

    expect(intent.matchedSignals).toEqual(
      expect.arrayContaining(["ai", "design-engineering", "accessibility"])
    )
    expect(intent.confidence).toBeGreaterThan(0.5)
    expect(intent.reasons.length).toBeGreaterThan(0)
  })

  it("ranks projects deterministically with stable tie ordering", () => {
    const intent = parseIntent("show me xr accessibility")
    const ranked = rankProjects(PROJECTS, intent)

    expect(ranked[0].project.id).toBe("speakeasy")

    const tieProjects: Project[] = [
      {
        id: "tie-a",
        title: "Tie A",
        description: "neutral content",
        image: "/a.png",
        technologies: ["none"],
        category: "web",
      },
      {
        id: "tie-b",
        title: "Tie B",
        description: "neutral content",
        image: "/b.png",
        technologies: ["none"],
        category: "web",
      },
    ]

    const neutralIntent = parseIntent("unmatched phrase")
    const neutralRanked = rankProjects(tieProjects, neutralIntent)
    expect(neutralRanked[0].project.id).toBe("tie-a")
    expect(neutralRanked[1].project.id).toBe("tie-b")
  })

  it("is deterministic for the same query input", () => {
    const query = "Show me XR accessibility work"
    const first = runAdaptiveFocus({ query, projects: PROJECTS })
    const second = runAdaptiveFocus({ query, projects: PROJECTS })

    expect(first.schemaVersion).toBe("af.v1")
    expect(second.schemaVersion).toBe("af.v1")
    expect(first.intent).toEqual(second.intent)
    expect(first.summary).toBe(second.summary)
    expect(first.ranked.map((item) => item.project.id)).toEqual(
      second.ranked.map((item) => item.project.id)
    )
  })

  it("returns a concise local summary with expected themes", () => {
    const result = runAdaptiveFocus({
      query: "What would be most relevant for Adobe XR accessibility?",
      projects: PROJECTS,
    })

    expect(result.summary.toLowerCase()).toContain("highlight")
    expect(result.summary.toLowerCase()).toContain("immersive")
    expect(result.summary.toLowerCase()).toContain("accessible")
    expect(result.summary.length).toBeGreaterThan(30)
    expect(result.summary.length).toBeLessThanOrEqual(180)
    expect(result.ranked.length).toBe(PROJECTS.length)
  })

  it("handles low-signal input with a fallback summary", () => {
    const result = runAdaptiveFocus({ query: "hello there", projects: PROJECTS })

    expect(result.intent.matchedSignals).toHaveLength(0)
    expect(result.summary.toLowerCase()).toContain("balanced project mix")
    expect(result.summary.length).toBeLessThanOrEqual(180)
  })
})
