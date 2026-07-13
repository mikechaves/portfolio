import {
  buildRoleFitBrief,
  ROLE_FAMILY_LABELS,
  interpretLocalRole,
  normalizeRoleInput,
  type ProjectEvidence,
  type RoleInterpretation,
} from "../../packages/adaptive-focus-core/src"
import { PROJECTS } from "@/data/projects"
import { LocalAdaptiveFocusEngine } from "./adapters/local-engine"
import { ADAPTIVE_FOCUS_PRESETS } from "./config/presets"
import { PROJECT_EVIDENCE } from "./evidence/catalog"
import { PROJECT_EVIDENCE_EXCLUSIONS } from "./evidence/exclusions"
import { validateEvidenceIntegrity } from "./evidence/validation"

const PROJECT_IDS = PROJECTS.map((project) => project.id)

describe("Adaptive Focus local interpretation", () => {
  it.each([
    ["AI systems", ["ai-product-systems"]],
    ["A.I. systems", ["ai-product-systems"]],
    ["ML evaluation", ["ai-product-systems", "evaluation-calibration"]],
    ["AR prototype", ["xr-spatial", "prototyping"]],
    ["VR prototyping", ["xr-spatial", "prototyping"]],
    ["human-in-the-loop QA calibration", ["human-in-the-loop-ai", "evaluation-calibration", "moderation-qa"]],
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

describe("Adaptive Focus evidence integrity", () => {
  it("covers every project with evidence or an explicit exclusion", () => {
    expect(
      validateEvidenceIntegrity(PROJECT_IDS, PROJECT_EVIDENCE, PROJECT_EVIDENCE_EXCLUSIONS)
    ).toEqual([])
  })

  it("contains direct Astrocade HITL and evaluation evidence", () => {
    const astrocade = PROJECT_EVIDENCE.filter(
      (item) => item.projectId === "astrocade-qa-calibration-tool"
    )
    expect(astrocade).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ capability: "human-in-the-loop-ai", confidence: "direct" }),
        expect.objectContaining({ capability: "evaluation-calibration", confidence: "direct" }),
      ])
    )
  })

  it("contains direct Wizzo AI product-system evidence", () => {
    expect(PROJECT_EVIDENCE).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          projectId: "wizzo",
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
    ["hitl-evaluation", "astrocade-qa-calibration-tool", "astrocade-ground-truth"],
    ["ai-product-systems", "wizzo", "wizzo-ai-system"],
    ["operational-ux", "petition-ready", "petition-operational-dashboard"],
    ["design-engineering", "wizzo", "wizzo-full-stack"],
    ["xr-accessibility", "speakeasy", "speakeasy-accessibility"],
  ])("keeps the %s preset contract", async (presetId, primaryProjectId, evidenceId) => {
    const result = await localEngine.run({ mode: "preset", presetId })
    const preset = ADAPTIVE_FOCUS_PRESETS.find((item) => item.id === presetId)

    expect(result.schemaVersion).toBe("af.v2")
    expect(result.analysisSource).toBe("preset")
    expect(result.interpretation.requirements.map((item) => item.capability)).toEqual(
      preset?.interpretation.requirements.map((item) => item.capability)
    )
    expect(result.interpretation.clarificationNeeded).toBe(false)
    expect(result.groups.primary.map((item) => item.projectId)).toContain(primaryProjectId)
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

  it("is deterministic with stable project ties", async () => {
    const first = await localEngine.run({ mode: "preset", presetId: "hitl-evaluation" })
    const second = await localEngine.run({ mode: "preset", presetId: "hitl-evaluation" })
    expect(first).toEqual(second)
  })

  it("preserves AI, QA, UX, and XR casing in visitor-facing copy", async () => {
    const hitl = await localEngine.run({ mode: "preset", presetId: "hitl-evaluation" })

    expect(hitl.summary).toContain("human-in-the-loop AI")
    expect(hitl.summary).toContain("moderation and QA")
    expect(hitl.groups.primary[0].explanation).toContain("operational UX")
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
    const evidence: ProjectEvidence[] = [
      {
        id: "adjacent",
        projectId: "x-games",
        capability: "ai-product-systems",
        statement: "Adjacent evidence.",
        sourcePath: "/projects/x-games",
        evidenceType: "prototyped",
        ownership: "contributed",
        confidence: "adjacent",
      },
      {
        id: "supporting",
        projectId: "petition-ready",
        capability: "ai-product-systems",
        statement: "Supporting evidence.",
        sourcePath: "/projects/petition-ready",
        evidenceType: "prototyped",
        ownership: "built",
        confidence: "supporting",
      },
      {
        id: "direct",
        projectId: "wizzo",
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
    expect(result.groups.primary[0].projectId).toBe("wizzo")
    expect(result.groups.supporting[0].projectId).toBe("petition-ready")
    expect(result.groups.adjacent[0].projectId).toBe("x-games")
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
    const evidence: ProjectEvidence[] = [
      {
        id: "direct-ai-system",
        projectId: "wizzo",
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
    expect(result.requirementCoverage).toHaveLength(1)
    expect(result.requirementCoverage[0]).toMatchObject({
      capability: "ai-product-systems",
      importance: "required",
    })
  })

  it("keeps explanations faithful to attached evidence", async () => {
    const result = await localEngine.run({ mode: "preset", presetId: "hitl-evaluation" })
    const matches = [
      ...result.groups.primary,
      ...result.groups.supporting,
      ...result.groups.adjacent,
    ]
    for (const match of matches) {
      expect(match.evidence.length).toBeGreaterThan(0)
      expect(match.explanation).toContain(match.evidence[0].statement)
      for (const capability of match.matchedCapabilities) {
        expect(
          PROJECT_EVIDENCE.some(
            (evidence) => evidence.projectId === match.projectId && evidence.capability === capability
          )
        ).toBe(true)
      }
      expect(match.explanation).not.toMatch(/\d+%|perfect fit|ideal candidate/i)
    }
  })

  it("surfaces senior ownership without inferring people management", async () => {
    const result = await localEngine.run({
      mode: "custom",
      input: "Senior design engineer with product ownership and rapid prototyping",
    })
    expect(result.interpretation.seniority).toBe("senior")
    expect(result.interpretation.requirements.map((item) => item.capability)).not.toContain(
      "people-management"
    )
    expect(result.groups.primary.length).toBeGreaterThan(0)
  })
})
