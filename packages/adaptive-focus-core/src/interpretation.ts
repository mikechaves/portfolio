import type {
  AdaptiveCapability,
  RoleFamily,
  RoleInterpretation,
  RoleRequirement,
  Seniority,
} from "./types"

type CapabilityPhrase = {
  capability: AdaptiveCapability
  phrases: string[]
}

const CAPABILITY_PHRASES: CapabilityPhrase[] = [
  {
    capability: "human-in-the-loop-ai",
    phrases: [
      "human in the loop",
      "human oversight",
      "human review",
      "reviewer workflow",
      "ai trainer",
    ],
  },
  {
    capability: "evaluation-calibration",
    phrases: [
      "evaluation calibration",
      "review calibration",
      "qa calibration",
      "calibration",
      "ground truth",
      "quality measurement",
      "review consistency",
      "evaluation system",
    ],
  },
  {
    capability: "moderation-qa",
    phrases: ["moderation", "quality assurance", "qa", "review operations", "content review"],
  },
  {
    capability: "ai-product-systems",
    phrases: [
      "ai",
      "artificial intelligence",
      "machine learning",
      "ml",
      "llm",
      "ai product",
      "ai native",
      "ai assisted",
      "copilot",
    ],
  },
  {
    capability: "model-evaluation",
    phrases: [
      "model evaluation",
      "ai evaluation",
      "ai evaluator",
      "llm evaluation",
      "llm evaluator",
      "evals",
      "model evals",
      "reasoning evaluation",
      "reasoning validation",
      "response evaluation",
      "answer evaluation",
      "model quality",
      "model benchmarking",
      "benchmark design",
      "benchmarking",
      "failure analysis",
      "error analysis",
      "reasoning flaws",
      "ai trainer",
    ],
  },
  {
    capability: "training-data-development",
    phrases: [
      "training data",
      "data annotation",
      "data annotator",
      "expert annotation",
      "data labeling",
      "dataset development",
      "dataset creation",
      "dataset curation",
      "fine tuning data",
      "fine tuning dataset",
      "fine tuning datasets",
      "reinforcement learning data",
      "benchmark dataset",
      "evaluation dataset",
      "supervised examples",
      "expert contributor",
      "graduate level problems",
      "benchmark problems",
    ],
  },
  {
    capability: "prompt-engineering",
    phrases: [
      "prompt engineering",
      "prompt engineer",
      "prompt design",
      "prompt authoring",
      "prompt testing",
      "prompt optimization",
      "instruction design",
      "reasoning prompts",
      "knowledge task prompts",
      "writing graduate level problems",
      "graduate level problems",
    ],
  },
  {
    capability: "game-ux-systems",
    phrases: [
      "game ux",
      "game ui",
      "game systems",
      "gameplay systems",
      "player experience",
      "player agency",
      "game feel",
      "playable experience",
      "game design",
    ],
  },
  {
    capability: "creator-systems",
    phrases: [
      "creator tools",
      "creator workflows",
      "creator platform",
      "ugc tools",
      "user generated content",
      "game creation",
      "content creation",
      "creative tooling",
      "creation pipeline",
    ],
  },
  {
    capability: "operational-ux",
    phrases: ["operational ux", "operations ux", "operations", "case management", "review queue"],
  },
  {
    capability: "internal-tools",
    phrases: ["internal tools", "internal tooling", "admin tools", "back office", "operator tools"],
  },
  {
    capability: "workflow-design",
    phrases: ["workflow design", "workflow", "process design", "process optimization", "intake"],
  },
  {
    capability: "design-engineering",
    phrases: ["design engineer", "design engineering", "ux engineer", "frontend engineer", "front end engineer"],
  },
  {
    capability: "product-ownership",
    phrases: ["product ownership", "product strategy", "roadmap", "product lead", "ship products", "shipping"],
  },
  {
    capability: "creative-technology",
    phrases: ["creative technology", "creative tech", "creative workflows", "interactive media", "webgl", "three js"],
  },
  {
    capability: "xr-spatial",
    phrases: ["xr", "ar", "vr", "spatial computing", "mixed reality", "immersive"],
  },
  {
    capability: "voice-interaction",
    phrases: ["voice interaction", "voice interface", "voice ui", "speech interface", "voice driven"],
  },
  {
    capability: "accessibility",
    phrases: ["accessibility", "accessible", "inclusive design", "assistive technology", "a11y"],
  },
  {
    capability: "data-visualization",
    phrases: ["data visualization", "visual analytics", "analytics dashboard", "data storytelling", "dashboard"],
  },
  {
    capability: "prototyping",
    phrases: ["prototyping", "prototype", "rapid iteration", "proof of concept", "mvp"],
  },
  {
    capability: "privacy-trust",
    phrases: ["privacy", "trust", "data controls", "account controls", "responsible ai"],
  },
  {
    capability: "people-management",
    phrases: ["people management", "manage a team", "team manager", "direct reports"],
  },
  {
    capability: "ml-infrastructure",
    phrases: ["ml infrastructure", "model serving", "training infrastructure", "mlops", "machine learning platform"],
  },
  {
    capability: "consumer-mobile",
    phrases: ["consumer mobile", "mobile app", "ios app", "android app"],
  },
]

const COMPANY_NAMES = ["adobe", "apple", "google", "meta", "microsoft", "nvidia"]

const CAPABILITY_RESPONSIBILITIES: Partial<Record<AdaptiveCapability, string>> = {
  "human-in-the-loop-ai": "Design human review and oversight workflows",
  "evaluation-calibration": "Define evaluation and calibration practices",
  "operational-ux": "Improve repeated operational workflows",
  "internal-tools": "Design tools for internal operators",
  "workflow-design": "Turn complex processes into usable workflows",
  "design-engineering": "Bridge product design and implementation",
  "ai-product-systems": "Build AI-assisted product systems",
  "xr-spatial": "Prototype spatial and immersive interfaces",
  accessibility: "Design accessible interactions",
  "game-ux-systems": "Design playable systems and player-facing interaction",
  "creator-systems": "Build tools and workflows for creators",
  "model-evaluation": "Evaluate model outputs, reasoning quality, and failure modes",
  "training-data-development": "Develop and validate high-quality training and evaluation data",
  "prompt-engineering": "Design and test prompts for reasoning and knowledge tasks",
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function hasPhrase(normalized: string, phrase: string): boolean {
  const pattern = escapeRegExp(phrase).replace(/\\ /g, "\\s+")
  return new RegExp(`(?:^|\\s)${pattern}(?=$|\\s)`, "u").test(normalized)
}

export function normalizeRoleInput(text: string): string {
  return text
    .toLowerCase()
    .replace(/\ba\s*\.\s*i\s*\.?\b/gu, "ai")
    .replace(/\bm\s*\.\s*l\s*\.?\b/gu, "ml")
    .replace(/three\.js/gu, "three js")
    .replace(/[^a-z0-9+#\s-]/gu, " ")
    .replace(/-/gu, " ")
    .replace(/\s+/gu, " ")
    .trim()
}

function inferRoleFamily(normalized: string, capabilities: AdaptiveCapability[]): RoleFamily {
  if (hasPhrase(normalized, "design engineer") || hasPhrase(normalized, "design engineering")) {
    return "design-engineering"
  }
  if (hasPhrase(normalized, "product engineer") || hasPhrase(normalized, "frontend engineer")) {
    return "product-engineering"
  }
  if (hasPhrase(normalized, "product designer") || hasPhrase(normalized, "ux designer")) {
    return "product-design"
  }
  if (capabilities.includes("xr-spatial")) return "xr-spatial"
  if (capabilities.includes("creative-technology")) return "creative-technology"
  if (capabilities.includes("operational-ux") || capabilities.includes("internal-tools")) {
    return "operations"
  }
  if (
    capabilities.some((capability) =>
      [
        "ai-product-systems",
        "model-evaluation",
        "training-data-development",
        "prompt-engineering",
      ].includes(capability)
    )
  ) {
    return "ai-product"
  }
  return "unknown"
}

function inferSeniority(normalized: string): Seniority {
  const ordered: Array<[Seniority, string[]]> = [
    ["executive", ["executive", "chief"]],
    ["director", ["director"]],
    ["manager", ["manager"]],
    ["staff", ["staff", "principal"]],
    ["lead", ["lead"]],
    ["senior", ["senior", "sr"]],
    ["mid", ["mid level", "intermediate"]],
    ["entry", ["entry level", "junior"]],
  ]

  return ordered.find(([, terms]) => terms.some((term) => hasPhrase(normalized, term)))?.[0] ?? "unspecified"
}

export function interpretLocalRole(rawInput: string): RoleInterpretation {
  const normalizedInput = normalizeRoleInput(rawInput)
  const requirements: RoleRequirement[] = []

  for (const entry of CAPABILITY_PHRASES) {
    if (!entry.phrases.some((phrase) => hasPhrase(normalizedInput, phrase))) continue
    requirements.push({ capability: entry.capability, importance: "required", basis: "explicit" })
  }

  const capabilities = requirements.map((requirement) => requirement.capability)
  const roleFamily = inferRoleFamily(normalizedInput, capabilities)
  const seniority = inferSeniority(normalizedInput)
  const company = COMPANY_NAMES.find((name) => hasPhrase(normalizedInput, name)) ?? null
  const clarificationNeeded = requirements.length === 0
  const confidence = clarificationNeeded
    ? company
      ? 0.1
      : 0
    : Math.min(0.9, 0.42 + requirements.length * 0.1 + (roleFamily !== "unknown" ? 0.08 : 0))

  return {
    normalizedInput,
    roleTitle: null,
    roleFamily,
    seniority,
    companyContext: company ? company[0].toUpperCase() + company.slice(1) : null,
    requirements,
    responsibilities: capabilities
      .map((capability) => CAPABILITY_RESPONSIBILITIES[capability])
      .filter((value): value is string => Boolean(value))
      .slice(0, 6),
    desiredOutcomes: [],
    confidence: Number(confidence.toFixed(2)),
    clarificationNeeded,
    clarificationQuestion: clarificationNeeded
      ? "Add a role, capability, or workflow so Adaptive Focus can build a grounded brief."
      : null,
  }
}
