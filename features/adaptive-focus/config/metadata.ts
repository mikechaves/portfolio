import type { ProjectFocusMetadata } from "../types"

export const PROJECT_FOCUS_METADATA: Record<string, ProjectFocusMetadata> = {
  wizzo: {
    id: "wizzo",
    tags: ["saas", "productivity", "ai", "startup", "product"],
    signals: ["ai", "product", "design-engineering"],
    weight: 1.2,
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
  "material-explorer": {
    id: "material-explorer",
    tags: ["threejs", "webgl", "tooling", "prototype", "frontend"],
    signals: ["creative-tech", "design-engineering", "prototyping", "product"],
    weight: 1.2,
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
