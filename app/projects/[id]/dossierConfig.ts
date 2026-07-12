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
  gaia: {
    caseFile: "AF-04",
    eyebrow: "Enterprise spatial operations / Decision context",
    signals: "Research / Prototype / Test / Spatialize",
  },
  "apt-plus": {
    caseFile: "AF-05",
    eyebrow: "Manufacturing workflow systems / Measured operations",
    signals: "Observe / Capture / Analyze / Scale",
  },
  transcribe: {
    caseFile: "AF-06",
    eyebrow: "Voice accessibility systems / Retail operations",
    signals: "Listen / Transcribe / Test / Operate",
  },
  geovoice: {
    caseFile: "AF-07",
    eyebrow: "Geospatial collaboration systems / Public input",
    signals: "Locate / Comment / Layer / Review",
  },
  speakeasy: {
    caseFile: "AF-08",
    eyebrow: "Voice-first XR accessibility / Research through design",
    signals: "Research / Prototype / Measure / Exhibit",
  },
  "petition-ready": {
    caseFile: "AF-09",
    eyebrow: "AI legal operations / Human review boundary",
    signals: "Intake / Triage / Evidence / Review",
  },
}

export const EVIDENCE_DOSSIER_PROJECT_IDS = Object.freeze(
  new Set(Object.keys(EVIDENCE_DOSSIERS))
)

export function getEvidenceDossierConfig(projectId: string): EvidenceDossierConfig | undefined {
  return EVIDENCE_DOSSIERS[projectId]
}
