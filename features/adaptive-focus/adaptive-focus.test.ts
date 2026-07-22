import {
  buildRoleFitBrief,
  interpretLocalRole,
  normalizeRoleInput,
  ROLE_FAMILY_LABELS,
  type EvidenceRecord,
  type RoleInterpretation,
} from "../../packages/adaptive-focus-core/src"
import { LocalAdaptiveFocusEngine } from "./adapters/local-engine"
import { ADAPTIVE_FOCUS_PRESETS } from "./config/presets"
import { EVIDENCE_CATALOG } from "./evidence/catalog"

function allMatches(result: Awaited<ReturnType<LocalAdaptiveFocusEngine["run"]>>) {
  return [...result.groups.primary, ...result.groups.supporting, ...result.groups.adjacent]
}

describe("Adaptive Focus local interpretation", () => {
  it.each([
    ["AI systems", ["ai-product-systems"]],
    ["A.I. systems", ["ai-product-systems"]],
    ["ML evaluation", ["ai-product-systems"]],
    ["AR prototype", ["xr-spatial", "prototyping"]],
    ["VR prototyping", ["xr-spatial", "prototyping"]],
    [
      "human-in-the-loop QA calibration",
      ["human-in-the-loop-ai", "evaluation-calibration", "moderation-qa"],
    ],
    ["game UX and player agency", ["game-ux-systems"]],
    ["creator tools for UGC workflows", ["creator-systems"]],
    [
      "LLM evaluator for training data and prompt engineering",
      ["model-evaluation", "training-data-development", "prompt-engineering"],
    ],
  ])("matches token-aware capabilities for %s", (input, expected) => {
    const capabilities = interpretLocalRole(input).requirements.map((item) => item.capability)
    expect(capabilities).toEqual(expect.arrayContaining(expected))
  })

  it.each(["retail operations", "marketing leader", "detail-oriented UX"])(
    "does not create short-acronym false positives for %s",
    (input) => {
      const capabilities = interpretLocalRole(input).requirements.map((item) => item.capability)
      expect(capabilities).not.toContain("ai-product-systems")
      expect(capabilities).not.toContain("xr-spatial")
    }
  )

  it("keeps model evaluation distinct from operational calibration", () => {
    const modelEval = interpretLocalRole("LLM evaluation and reasoning validation")
    expect(modelEval.requirements.map((item) => item.capability)).toContain("model-evaluation")
    expect(modelEval.requirements.map((item) => item.capability)).not.toContain(
      "evaluation-calibration"
    )

    const calibration = interpretLocalRole("QA calibration and reviewer consistency")
    expect(calibration.requirements.map((item) => item.capability)).toContain(
      "evaluation-calibration"
    )
    expect(calibration.requirements.map((item) => item.capability)).not.toContain(
      "model-evaluation"
    )
  })

  it("normalizes punctuation and spacing deterministically", () => {
    expect(normalizeRoleInput("  A.I.---Design   Engineer  ")).toBe("ai design engineer")
    expect(normalizeRoleInput("  A.I.---Design   Engineer  ")).toBe(
      normalizeRoleInput("A.I. Design Engineer")
    )
  })

  it("treats a company-only query as context requiring clarification", () => {
    const interpretation = interpretLocalRole("Adobe")
    expect(interpretation.companyContext).toBe("Adobe")
    expect(interpretation.requirements).toHaveLength(0)
    expect(interpretation.clarificationNeeded).toBe(true)
    expect(interpretation.confidence).toBe(0.1)
  })

  it("does not convert a people-management requirement into manager seniority", () => {
    const interpretation = interpretLocalRole(
      "Senior design engineer with people management responsibility"
    )
    expect(interpretation.seniority).toBe("senior")
    expect(interpretation.requirements.map((item) => item.capability)).toContain(
      "people-management"
    )
  })
})

describe("Adaptive Focus evidence catalog", () => {
  it("contains sanitized Astrocade capability coverage", () => {
    const evidence = EVIDENCE_CATALOG.filter(
      (item) => item.entityId === "employment-astrocade"
    )
    expect(evidence.map((item) => item.capability)).toEqual(
      expect.arrayContaining([
        "human-in-the-loop-ai",
        "evaluation-calibration",
        "moderation-qa",
        "operational-ux",
        "creator-systems",
      ])
    )
    expect(JSON.stringify(evidence)).not.toMatch(
      /calibration-dashboard|failure-mode taxonom|threshold|precision|recall|false rejection/i
    )
  })

  it("contains direct Snorkel model-evaluation and training-data evidence", () => {
    const evidence = EVIDENCE_CATALOG.filter(
      (item) => item.entityId === "employment-snorkel"
    )
    expect(evidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ capability: "model-evaluation", confidence: "direct" }),
        expect.objectContaining({
          capability: "training-data-development",
          confidence: "direct",
        }),
        expect.objectContaining({ capability: "prompt-engineering", confidence: "direct" }),
      ])
    )
  })

  it("contains direct Wizzo AI product-system evidence", () => {
    expect(EVIDENCE_CATALOG).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entityId: "wizzo",
          capability: "ai-product-systems",
          confidence: "direct",
        }),
      ])
    )
  })
})

describe("Adaptive Focus Role Fit Brief", () => {
  const localEngine = new LocalAdaptiveFocusEngine()

  it.each([
    ["hitl-evaluation", "employment-astrocade", "employment-astrocade-evaluation"],
    ["ai-product-systems", "wizzo", "wizzo-ai-system"],
    ["llm-evaluation-training-data", "employment-snorkel", "employment-snorkel-model-evaluation"],
    ["operational-ux", "employment-ford", "employment-ford-operational-ux"],
    ["design-engineering", "wizzo", "wizzo-full-stack"],
    ["xr-accessibility", "speakeasy", "speakeasy-accessibility"],
    ["game-ux-creator-systems", "x-games", "xgames-game-ux"],
  ])("keeps the %s preset contract", async (presetId, primaryEntityId, evidenceId) => {
    const result = await localEngine.run({ mode: "preset", presetId })
    const preset = ADAPTIVE_FOCUS_PRESETS.find((item) => item.id === presetId)

    expect(result.schemaVersion).toBe("af.v2")
    expect(result.analysisSource).toBe("preset")
    expect(result.interpretation.requirements.map((item) => item.capability)).toEqual(
      preset?.interpretation.requirements.map((item) => item.capability)
    )
    expect(result.interpretation.clarificationNeeded).toBe(false)
    expect(result.groups.primary.map((item) => item.entityId)).toContain(primaryEntityId)
    expect(
      result.groups.primary.flatMap((item) => item.evidence.map((evidence) => evidence.evidenceId))
    ).toContain(evidenceId)
  })

  it("preserves canonical order and returns no primary proof for low-confidence input", async () => {
    const result = await localEngine.run({ mode: "custom", input: "Adobe" })
    expect(result.analysisSource).toBe("local-fallback")
    expect(result.interpretation.clarificationNeeded).toBe(true)
    expect(result.groups.primary).toEqual([])
    expect(result.summary).toContain("could not confidently interpret")
  })

  it("is deterministic with stable entity ties", async () => {
    const first = await localEngine.run({ mode: "preset", presetId: "hitl-evaluation" })
    const second = await localEngine.run({ mode: "preset", presetId: "hitl-evaluation" })
    expect(first).toEqual(second)
  })

  it("preserves AI, QA, UX, XR, and LLM casing in visitor-facing copy", async () => {
    const hitl = await localEngine.run({ mode: "preset", presetId: "hitl-evaluation" })
    const llm = await localEngine.run({
      mode: "preset",
      presetId: "llm-evaluation-training-data",
    })

    expect(hitl.summary).toContain("human-in-the-loop AI")
    expect(hitl.summary).toContain("moderation and QA")
    expect(allMatches(hitl).some((match) => match.explanation.includes("operational UX"))).toBe(true)
    expect(llm.summary).toContain("LLM and model evaluation")
    expect(ROLE_FAMILY_LABELS[hitl.interpretation.roleFamily]).toBe("AI product")
    expect(ROLE_FAMILY_LABELS["xr-spatial"]).toBe("XR and spatial computing")
  })

  it("ranks direct evidence above supporting and adjacent evidence", () => {
    const interpretation: RoleInterpretation = {
      normalizedInput: "AI product systems",
      roleTitle: null,
      roleFamily: "ai-product",
      seniority: "unspecified",
      companyContext: null,
      requirements: [
        { capability: "ai-product-systems", importance: "required", basis: "explicit" },
      ],
      responsibilities: [],
      desiredOutcomes: [],
      confidence: 0.9,
      clarificationNeeded: false,
      clarificationQuestion: null,
    }
    const evidence: EvidenceRecord[] = [
      {
        id: "adjacent",
        entityId: "x-games",
        capability: "ai-product-systems",
        statement: "Adjacent evidence.",
        sourcePath: "/projects/x-games",
        evidenceType: "prototyped",
        ownership: "contributed",
        confidence: "adjacent",
      },
      {
        id: "supporting",
        entityId: "petition-ready",
        capability: "ai-product-systems",
        statement: "Supporting evidence.",
        sourcePath: "/projects/petition-ready",
        evidenceType: "prototyped",
        ownership: "built",
        confidence: "supporting",
      },
      {
        id: "direct",
        entityId: "wizzo",
        capability: "ai-product-systems",
        statement: "Direct evidence.",
        sourcePath: "/projects/wizzo",
        evidenceType: "shipped",
        ownership: "led",
        confidence: "direct",
      },
    ]
    const result = buildRoleFitBrief(
      interpretation,
      evidence,
      ["x-games", "petition-ready", "wizzo"],
      "preset"
    )
    expect(result.groups.primary[0].entityId).toBe("wizzo")
    expect(result.groups.supporting[0].entityId).toBe("petition-ready")
    expect(result.groups.adjacent[0].entityId).toBe("x-games")
  })

  it("merges duplicate capabilities using the strongest importance and basis", () => {
    const interpretation: RoleInterpretation = {
      normalizedInput: "AI product systems",
      roleTitle: null,
      roleFamily: "ai-product",
      seniority: "unspecified",
      companyContext: null,
      requirements: [
        { capability: "ai-product-systems", importance: "required", basis: "inferred" },
        { capability: "ai-product-systems", importance: "preferred", basis: "explicit" },
        { capability: "ai-product-systems", importance: "context", basis: "inferred" },
      ],
      responsibilities: [],
      desiredOutcomes: [],
      confidence: 0.9,
      clarificationNeeded: false,
      clarificationQuestion: null,
    }
    const evidence: EvidenceRecord[] = [
      {
        id: "direct-ai-system",
        entityId: "wizzo",
        capability: "ai-product-systems",
        statement: "Direct AI product-system evidence.",
        sourcePath: "/projects/wizzo",
        evidenceType: "shipped",
        ownership: "led",
        confidence: "direct",
      },
    ]

    const result = buildRoleFitBrief(interpretation, evidence, ["wizzo"], "gpt")

    expect(result.interpretation.requirements).toEqual([
      { capability: "ai-product-systems", importance: "required", basis: "explicit" },
    ])
    expect(result.requirementCoverage[0]).toMatchObject({
      capability: "ai-product-systems",
      importance: "required",
    })
  })

  it("keeps explanations faithful to attached entity evidence", async () => {
    const result = await localEngine.run({ mode: "preset", presetId: "hitl-evaluation" })
    for (const match of allMatches(result)) {
      expect(match.evidence.length).toBeGreaterThan(0)
      expect(match.explanation).toContain(match.evidence[0].statement)
      for (const capability of match.matchedCapabilities) {
        expect(
          EVIDENCE_CATALOG.some(
            (evidence) =>
              evidence.entityId === match.entityId && evidence.capability === capability
          )
        ).toBe(true)
      }
      expect(match.explanation).not.toMatch(/\d+%|perfect fit|ideal candidate/i)
    }
  })

  it("returns Snorkel for AI trainer and LLM evaluation work", async () => {
    const aiTrainer = await localEngine.run({
      mode: "custom",
      input:
        "AI trainer evaluating LLM reasoning, writing graduate-level problems, and building fine-tuning datasets",
    })
    const capabilities = aiTrainer.requirementCoverage.map((item) => item.capability)
    expect(aiTrainer.groups.primary[0].entityId).toBe("employment-snorkel")
    expect(capabilities).toEqual(
      expect.arrayContaining([
        "model-evaluation",
        "training-data-development",
        "prompt-engineering",
        "human-in-the-loop-ai",
      ])
    )

    const evaluator = await localEngine.run({
      mode: "custom",
      input:
        "LLM evaluator with data annotation, benchmarking, reasoning validation, and prompt engineering experience",
    })
    expect(evaluator.groups.primary[0].entityId).toBe("employment-snorkel")
  })

  it("keeps Astrocade stronger for operational review and creator moderation", async () => {
    const result = await localEngine.run({
      mode: "custom",
      input: "Human-in-the-loop moderation and QA calibration for a creator platform",
    })
    expect(result.groups.primary[0].entityId).toBe("employment-astrocade")
    const ordered = allMatches(result).map((match) => match.entityId)
    const snorkelIndex = ordered.indexOf("employment-snorkel")
    expect(ordered.indexOf("employment-astrocade")).toBeLessThan(
      snorkelIndex === -1 ? Number.MAX_SAFE_INTEGER : snorkelIndex
    )
  })

  it("does not let model-evaluation evidence displace product-system proof", async () => {
    const result = await localEngine.run({
      mode: "custom",
      input: "Senior AI design engineer for product systems and creator workflows",
    })
    expect(result.groups.primary.slice(0, 3).map((match) => match.entityId)).toEqual(
      expect.arrayContaining(["wizzo", "x-games"])
    )
    expect(result.groups.primary[0].entityId).not.toBe("employment-snorkel")
  })

  it("maps game and creator-system evidence without misclassifying unrelated projects", async () => {
    const result = await localEngine.run({
      mode: "preset",
      presetId: "game-ux-creator-systems",
    })
    const ordered = allMatches(result).map((match) => match.entityId)
    expect(result.groups.primary[0].entityId).toBe("x-games")
    expect(ordered).toEqual(expect.arrayContaining(["sound-escape-vr", "material-explorer"]))
    expect(
      EVIDENCE_CATALOG.some(
        (item) => item.entityId === "speakeasy" && item.capability === "game-ux-systems"
      )
    ).toBe(false)
    expect(
      EVIDENCE_CATALOG.some(
        (item) => item.entityId === "portals" && item.capability === "game-ux-systems"
      )
    ).toBe(false)
    expect(
      EVIDENCE_CATALOG.some(
        (item) => item.entityId === "wizzo" && item.capability === "game-ux-systems"
      )
    ).toBe(false)
  })
})
