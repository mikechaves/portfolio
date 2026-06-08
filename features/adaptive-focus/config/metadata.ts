import type { ProjectFocusMetadata } from "../types"

export const PROJECT_FOCUS_METADATA: Record<string, ProjectFocusMetadata> = {
  wizzo: {
    id: "wizzo",
    tags: ["saas", "productivity", "ai", "product-system", "mentor"],
    signals: ["ai", "product", "design-engineering"],
    weight: 1.2,
  },
  "x-games": {
    id: "x-games",
    tags: ["ai", "games", "grok", "social", "x", "leaderboards"],
    signals: ["ai", "product", "creative-tech", "prototyping"],
    weight: 1.25,
  },
  "petition-ready": {
    id: "petition-ready",
    tags: ["ai", "legal-ops", "bankruptcy", "paralegal", "intake", "readiness", "workflow"],
    signals: ["ai", "product", "design-engineering"],
    weight: 1.25,
  },
  speakeasy: {
    id: "speakeasy",
    tags: ["voice", "xr", "accessibility", "inclusive"],
    signals: ["xr", "accessibility", "ai", "prototyping"],
    weight: 1.2,
  },
  transcribe: {
    id: "transcribe",
    tags: ["speech", "accessibility", "ai", "retail"],
    signals: ["ai", "accessibility", "design-engineering"],
    weight: 1.1,
  },
  gaia: {
    id: "gaia",
    tags: ["spatial", "xr", "enterprise", "operations"],
    signals: ["xr", "design-engineering", "prototyping"],
    weight: 1.1,
  },
  "apt-plus": {
    id: "apt-plus",
    tags: ["enterprise", "workflow", "manufacturing", "ux"],
    signals: ["design-engineering", "product"],
    weight: 1,
  },
  geovoice: {
    id: "geovoice",
    tags: ["mapping", "collaboration", "data", "stakeholder"],
    signals: ["data-viz", "design-engineering", "product"],
    weight: 1,
  },
  "sound-escape-vr": {
    id: "sound-escape-vr",
    tags: ["vr", "audio", "immersive", "creative"],
    signals: ["xr", "creative-tech", "prototyping"],
    weight: 0.95,
  },
  "creative-supply-engine": {
    id: "creative-supply-engine",
    tags: ["ai", "creative-automation", "campaign", "localization", "python", "marketing"],
    signals: ["ai", "creative-tech", "design-engineering", "product"],
    weight: 1.15,
  },
  "material-explorer": {
    id: "material-explorer",
    tags: ["threejs", "webgl", "tooling", "prototype", "frontend"],
    signals: ["creative-tech", "design-engineering", "prototyping", "product"],
    weight: 1.2,
  },
  "vulnerability-visualizer": {
    id: "vulnerability-visualizer",
    tags: ["security", "vulnerability", "ai", "data", "visualization", "frontend"],
    signals: ["ai", "data-viz", "design-engineering", "product"],
    weight: 1.15,
  },
  portals: {
    id: "portals",
    tags: ["ar", "voice", "accessibility", "climate"],
    signals: ["xr", "accessibility", "creative-tech"],
    weight: 1,
  },
  "ai-energy-consumption": {
    id: "ai-energy-consumption",
    tags: ["ai", "data", "visualization", "storytelling"],
    signals: ["ai", "data-viz", "creative-tech"],
    weight: 1,
  },
  "die-ai": {
    id: "die-ai",
    tags: ["game", "creative", "retro", "prototype"],
    signals: ["creative-tech", "prototyping"],
    weight: 0.8,
  },
}
