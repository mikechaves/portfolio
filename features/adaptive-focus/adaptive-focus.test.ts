import { runAdaptiveFocus } from "./index"
import { interpretAdaptiveIntent } from "./intent"
import { rankProjectsForIntent } from "./rank"
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
    const intent = interpretAdaptiveIntent("I'm hiring for an AI design engineer focused on accessibility")

    expect(intent.matchedSignals).toEqual(
      expect.arrayContaining(["ai", "design-engineering", "accessibility"])
    )
    expect(intent.confidence).toBeGreaterThan(0.5)
    expect(intent.reasons.length).toBeGreaterThan(0)
  })

  it("ranks projects deterministically with stable tie ordering", () => {
    const intent = interpretAdaptiveIntent("show me xr accessibility")
    const ranked = rankProjectsForIntent(PROJECTS, intent)

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

    const neutralIntent = interpretAdaptiveIntent("unmatched phrase")
    const neutralRanked = rankProjectsForIntent(tieProjects, neutralIntent)
    expect(neutralRanked[0].project.id).toBe("tie-a")
    expect(neutralRanked[1].project.id).toBe("tie-b")
  })

  it("returns a concise local summary", () => {
    const result = runAdaptiveFocus("What would be most relevant for Adobe XR accessibility?", PROJECTS)

    expect(result.summary.toLowerCase()).toContain("highlight")
    expect(result.summary.length).toBeGreaterThan(30)
    expect(result.ranked.length).toBe(PROJECTS.length)
  })
})
