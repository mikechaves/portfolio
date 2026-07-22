import type { AdaptiveFocusPreset, RoleInterpretation } from "../types"

function presetInterpretation(
  partial: Pick<RoleInterpretation, "roleFamily" | "requirements" | "responsibilities">
): RoleInterpretation {
  return {
    normalizedInput: "",
    roleTitle: null,
    roleFamily: partial.roleFamily,
    seniority: "unspecified",
    companyContext: null,
    requirements: partial.requirements,
    responsibilities: partial.responsibilities,
    desiredOutcomes: [],
    confidence: 1,
    clarificationNeeded: false,
    clarificationQuestion: null,
  }
}

export const ADAPTIVE_FOCUS_PRESETS: AdaptiveFocusPreset[] = [
  {
    id: "hitl-evaluation",
    label: "Human-in-the-loop AI",
    description: "Evaluation, calibration, moderation, and accountable review workflows.",
    interpretation: presetInterpretation({
      roleFamily: "ai-product",
      requirements: [
        { capability: "human-in-the-loop-ai", importance: "required", basis: "explicit" },
        { capability: "evaluation-calibration", importance: "required", basis: "explicit" },
        { capability: "moderation-qa", importance: "preferred", basis: "explicit" },
        { capability: "operational-ux", importance: "preferred", basis: "explicit" },
      ],
      responsibilities: [
        "Design human review workflows",
        "Define evaluation and calibration practices",
        "Make quality signals operationally useful",
      ],
    }),
  },
  {
    id: "ai-product-systems",
    label: "AI product systems",
    description: "AI workflows, product ownership, implementation, and trust controls.",
    interpretation: presetInterpretation({
      roleFamily: "ai-product",
      requirements: [
        { capability: "ai-product-systems", importance: "required", basis: "explicit" },
        { capability: "product-ownership", importance: "required", basis: "explicit" },
        { capability: "workflow-design", importance: "preferred", basis: "explicit" },
        { capability: "privacy-trust", importance: "preferred", basis: "explicit" },
      ],
      responsibilities: [
        "Own AI-assisted product workflows",
        "Connect product strategy and implementation",
        "Design trustworthy account and data controls",
      ],
    }),
  },
  {
    id: "llm-evaluation-training-data",
    label: "LLM evaluation + training data",
    description:
      "Model evaluation, expert annotation, reasoning validation, prompt engineering, and training-data development.",
    interpretation: presetInterpretation({
      roleFamily: "ai-product",
      requirements: [
        { capability: "model-evaluation", importance: "required", basis: "explicit" },
        {
          capability: "training-data-development",
          importance: "required",
          basis: "explicit",
        },
        { capability: "prompt-engineering", importance: "preferred", basis: "explicit" },
        {
          capability: "human-in-the-loop-ai",
          importance: "preferred",
          basis: "explicit",
        },
        {
          capability: "evaluation-calibration",
          importance: "preferred",
          basis: "explicit",
        },
      ],
      responsibilities: [
        "Evaluate AI-generated responses and reasoning quality",
        "Author and validate high-rigor training and benchmark tasks",
        "Detect reasoning failures and improve data quality",
        "Design prompts for complex reasoning and knowledge work",
      ],
    }),
  },
  {
    id: "operational-ux",
    label: "Operational UX",
    description: "Internal tools, repeated workflows, queues, and process improvement.",
    interpretation: presetInterpretation({
      roleFamily: "operations",
      requirements: [
        { capability: "operational-ux", importance: "required", basis: "explicit" },
        { capability: "internal-tools", importance: "required", basis: "explicit" },
        { capability: "workflow-design", importance: "required", basis: "explicit" },
        { capability: "data-visualization", importance: "preferred", basis: "explicit" },
      ],
      responsibilities: [
        "Design repeated operational workflows",
        "Build internal tools for complex work",
        "Turn operational state into clear next actions",
      ],
    }),
  },
  {
    id: "design-engineering",
    label: "Product + design engineering",
    description: "Senior ownership across interaction design, prototyping, and shipped systems.",
    interpretation: {
      ...presetInterpretation({
        roleFamily: "design-engineering",
        requirements: [
          { capability: "design-engineering", importance: "required", basis: "explicit" },
          { capability: "product-ownership", importance: "required", basis: "explicit" },
          { capability: "prototyping", importance: "preferred", basis: "explicit" },
          { capability: "creative-technology", importance: "preferred", basis: "explicit" },
        ],
        responsibilities: [
          "Bridge product design and implementation",
          "Own systems from prototype through delivery",
          "Work across design, product, and engineering",
        ],
      }),
      seniority: "senior",
    },
  },
  {
    id: "xr-accessibility",
    label: "XR, voice, and accessibility",
    description: "Spatial interfaces, voice interaction, inclusive design, and research.",
    interpretation: presetInterpretation({
      roleFamily: "xr-spatial",
      requirements: [
        { capability: "xr-spatial", importance: "required", basis: "explicit" },
        { capability: "voice-interaction", importance: "required", basis: "explicit" },
        { capability: "accessibility", importance: "required", basis: "explicit" },
        { capability: "prototyping", importance: "preferred", basis: "explicit" },
      ],
      responsibilities: [
        "Prototype spatial and immersive interfaces",
        "Design voice-supported interaction",
        "Research and test accessible experiences",
      ],
    }),
  },
  {
    id: "game-ux-creator-systems",
    label: "Game UX + creator systems",
    description:
      "Playable systems, creator workflows, player agency, and AI-assisted creation.",
    interpretation: presetInterpretation({
      roleFamily: "creative-technology",
      requirements: [
        { capability: "game-ux-systems", importance: "required", basis: "explicit" },
        { capability: "creator-systems", importance: "required", basis: "explicit" },
        { capability: "ai-product-systems", importance: "preferred", basis: "explicit" },
        { capability: "creative-technology", importance: "preferred", basis: "explicit" },
      ],
      responsibilities: [
        "Design playable systems and player-facing interaction",
        "Build tools and workflows for creators",
        "Connect AI-assisted creation to usable product systems",
      ],
    }),
  },
]

export const ADAPTIVE_FOCUS_PRESETS_BY_ID = new Map(
  ADAPTIVE_FOCUS_PRESETS.map((preset) => [preset.id, preset])
)
