export interface EvidenceDossierConfig {
  caseFile: string
  eyebrow: string
  signals: string
}

const EVIDENCE_DOSSIERS: Partial<Record<string, EvidenceDossierConfig>> = {
  "astrocade-qa-calibration-tool": {
    caseFile: "AF-01",
    eyebrow: "AI systems engineering / Human control layer",
    signals: "Ground truth / QA / Feedback",
  },
  wizzo: {
    caseFile: "AF-02",
    eyebrow: "AI product systems / Intent to action",
    signals: "Chat / Context / Quests",
  },
  "x-games": {
    caseFile: "AF-03",
    eyebrow: "AI-native game systems / Social creation loop",
    signals: "Post / Generate / Play / Rank",
  },
}

export const EVIDENCE_DOSSIER_PROJECT_IDS = Object.freeze(
  new Set(Object.keys(EVIDENCE_DOSSIERS))
)

export function getEvidenceDossierConfig(projectId: string): EvidenceDossierConfig | undefined {
  return EVIDENCE_DOSSIERS[projectId]
}
