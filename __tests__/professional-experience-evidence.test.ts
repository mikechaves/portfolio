import fs from "node:fs"
import path from "node:path"
import { PROJECTS } from "@/data/projects"
import { EVIDENCE_CATALOG } from "@/features/adaptive-focus/evidence/catalog"
import { EVIDENCE_ENTITY_IDS } from "@/features/adaptive-focus/evidence/entities"
import { EVIDENCE_ENTITY_EXCLUSIONS } from "@/features/adaptive-focus/evidence/exclusions"
import {
  PROFESSIONAL_EXPERIENCE_BY_ID,
  PROFESSIONAL_EXPERIENCE_IDS,
  PROFESSIONAL_EXPERIENCE_RECORDS,
} from "@/features/adaptive-focus/evidence/professional-experience"
import { validateEvidenceIntegrity } from "@/features/adaptive-focus/evidence/validation"

const PUBLIC_PROJECT_IDS = PROJECTS.map((project) => project.id)

describe("professional experience entity integrity", () => {
  it("covers every public project and professional record with valid evidence", () => {
    expect(
      validateEvidenceIntegrity(
        EVIDENCE_ENTITY_IDS,
        EVIDENCE_CATALOG,
        EVIDENCE_ENTITY_EXCLUSIONS
      )
    ).toEqual([])
  })

  it("keeps professional experience outside the public project archive", () => {
    for (const record of PROFESSIONAL_EXPERIENCE_RECORDS) {
      expect(PUBLIC_PROJECT_IDS).not.toContain(record.id)
      expect(record.id).toMatch(/^employment-/)
      expect(record).not.toHaveProperty("image")
      expect(record).not.toHaveProperty("gallery")
      expect(record).not.toHaveProperty("projectUrl")
      expect(record).not.toHaveProperty("github")
      expect(record).not.toHaveProperty("demo")
      expect(record).not.toHaveProperty("password")
    }
  })

  it("maps every evidence record to a public project or professional experience", () => {
    const knownIds = new Set([...PUBLIC_PROJECT_IDS, ...PROFESSIONAL_EXPERIENCE_IDS])
    expect(EVIDENCE_CATALOG.every((evidence) => knownIds.has(evidence.entityId))).toBe(true)
  })

  it("preserves the required disclosure and delivery distinctions", () => {
    expect(PROFESSIONAL_EXPERIENCE_BY_ID.get("employment-astrocade")).toMatchObject({
      disclosureLevel: "confidential-summary",
      deliveryStatus: "production-ai-operations",
    })
    expect(PROFESSIONAL_EXPERIENCE_BY_ID.get("employment-ford")).toMatchObject({
      disclosureLevel: "confidential-summary",
      deliveryStatus: "production-manufacturing-system",
    })
    expect(PROFESSIONAL_EXPERIENCE_BY_ID.get("employment-starbucks")).toMatchObject({
      disclosureLevel: "confidential-summary",
      deliveryStatus: "exploratory-prototypes",
    })
    expect(PROFESSIONAL_EXPERIENCE_BY_ID.get("employment-snorkel")).toMatchObject({
      disclosureLevel: "approved-public-summary",
      deliveryStatus: "ai-training-and-evaluation",
    })
  })

  it("keeps Starbucks evidence prototype-only", () => {
    const starbucksEvidence = EVIDENCE_CATALOG.filter(
      (evidence) => evidence.entityId === "employment-starbucks"
    )
    expect(starbucksEvidence).not.toHaveLength(0)
    expect(
      starbucksEvidence.every(
        (evidence) =>
          evidence.evidenceType !== "shipped" && evidence.evidenceType !== "measured"
      )
    ).toBe(true)
    expect(JSON.stringify(starbucksEvidence)).not.toMatch(/production deployment|shipped system/i)
  })

  it("keeps Ford evidence metric-free and production-specific", () => {
    const ford = JSON.stringify({
      record: PROFESSIONAL_EXPERIENCE_BY_ID.get("employment-ford"),
      evidence: EVIDENCE_CATALOG.filter((item) => item.entityId === "employment-ford"),
    })
    expect(ford).toContain("Deployed as a production manufacturing system.")
    expect(ford).not.toMatch(/\$1M|million per plant|40%/i)
    expect(ford).not.toContain("APT+")
  })

  it("uses only the approved Snorkel disclosure language", () => {
    const snorkel = PROFESSIONAL_EXPERIENCE_BY_ID.get("employment-snorkel")
    expect(snorkel?.dates).toBeUndefined()
    expect(snorkel?.summary).toBe(
      "Authored and validated original, high-difficulty, graduate-level exam-style problems; assessed AI-generated responses; identified reasoning flaws; and refined model outputs. Contributed to proprietary datasets used for LLM fine-tuning, benchmarking, and reinforcement learning."
    )
    expect(snorkel?.summary).not.toMatch(
      /RLHF|owned (?:a |the )?(?:model|platform|dataset)|foundation model|customer|model weights/i
    )
  })
})

describe("professional experience rendering", () => {
  it("keeps professional proof image-free, non-linked, and disclosure-aware", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "components", "professional-experience-proof.tsx"),
      "utf8"
    )

    expect(source).toContain('record.disclosureLevel === "approved-public-summary"')
    expect(source).toContain('"Approved public experience"')
    expect(source).toContain('"Confidential employment evidence"')
    expect(source).toContain("Detailed case study withheld")
    expect(source).not.toMatch(/<Image\b|<ProjectCard\b|<Link\b|href=/u)
    expect(source).not.toContain("Inspect case study")
  })
})

describe("current-tree disclosure guardrails", () => {
  it("does not retain retired media or detailed case-study copy in public data", () => {
    const publicProjectData = fs.readFileSync(
      path.join(process.cwd(), "public", "data", "projects.json"),
      "utf8"
    )
    const safeEvidenceData = JSON.stringify({
      records: PROFESSIONAL_EXPERIENCE_RECORDS,
      evidence: EVIDENCE_CATALOG.filter((item) => item.entityId.startsWith("employment-")),
    })
    const currentData = `${publicProjectData}\n${safeEvidenceData}`

    expect(currentData).not.toMatch(
      /calibration-dashboard\.png|aptplus-interface\.png|gaia-store-overview\.png|\/projects\/transcribe\/testing\.png/i
    )
    expect(currentData).not.toMatch(
      /Astrocade AI QA Calibration Tool|APT\+|\bGaia\b|\bTranscribe\b|\$1M|40%|30% transcription|50% less/i
    )
    expect(currentData).not.toMatch(
      /false rejection|failure-mode taxonom|approval precision|queue logic|policy misapplication|threshold/i
    )
  })
})
