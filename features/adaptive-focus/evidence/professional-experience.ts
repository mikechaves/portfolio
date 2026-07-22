export type ProfessionalExperienceDisclosureLevel =
  | "confidential-summary"
  | "approved-public-summary"

export type ProfessionalExperienceDeliveryStatus =
  | "production-ai-operations"
  | "production-manufacturing-system"
  | "exploratory-prototypes"
  | "ai-training-and-evaluation"

export interface ProfessionalExperienceRecord {
  id: string
  company: string
  role: string
  dates?: string
  disclosureLevel: ProfessionalExperienceDisclosureLevel
  deliveryStatus: ProfessionalExperienceDeliveryStatus
  summary: string
  disclosureNote: string
}

export const PROFESSIONAL_EXPERIENCE_DELIVERY_LABELS: Record<
  ProfessionalExperienceDeliveryStatus,
  string
> = {
  "production-ai-operations": "Production AI game-quality operations",
  "production-manufacturing-system": "Production manufacturing system",
  "exploratory-prototypes": "Emerging technology prototypes",
  "ai-training-and-evaluation": "AI training and evaluation contribution",
}

export const PROFESSIONAL_EXPERIENCE_RECORDS: ProfessionalExperienceRecord[] = [
  {
    id: "employment-astrocade",
    company: "Astrocade",
    role: "UGC Engineer, Temporary Employment",
    dates: "November 2025 - April 2026",
    disclosureLevel: "confidential-summary",
    deliveryStatus: "production-ai-operations",
    summary:
      "Supported production quality and publishing operations for an AI-powered game creation platform. Worked across UGC review, human evaluation, QA operations, creator feedback, documentation, and cross-functional issue resolution. Detailed interfaces, policies, datasets, evaluation methods, metrics, and operational procedures are confidential.",
    disclosureNote:
      "High-level employment summary only. Internal interfaces, review policies, datasets, metrics, taxonomies, and implementation details are withheld.",
  },
  {
    id: "employment-snorkel",
    company: "Snorkel AI",
    role: "Expert Contributor, Contract",
    disclosureLevel: "approved-public-summary",
    deliveryStatus: "ai-training-and-evaluation",
    summary:
      "Authored and validated original, high-difficulty, graduate-level exam-style problems; assessed AI-generated responses; identified reasoning flaws; and refined model outputs. Contributed to proprietary datasets used for LLM fine-tuning, benchmarking, and reinforcement learning.",
    disclosureNote:
      "Employer-approved public contribution summary. Project names, customer identities, model names, prompts, dataset examples, annotation guidelines, evaluation rubrics, internal systems, and performance metrics are withheld.",
  },
  {
    id: "employment-ford",
    company: "Ford Motor Company",
    role: "Software Engineer II, Unity, Contract",
    dates: "October 2021 - March 2022",
    disclosureLevel: "confidential-summary",
    deliveryStatus: "production-manufacturing-system",
    summary:
      "Developed a production Unity3D and WebGL system for manufacturing time studies, operational analytics, and stakeholder review. Translated complex manufacturing workflows into interactive tooling used in production environments. Specific interfaces, factory data, plant details, implementation methods, and unapproved metrics are confidential.",
    disclosureNote:
      "Production system. Internal interfaces, manufacturing data, plant details, implementation methods, and unapproved performance or financial metrics are withheld.",
  },
  {
    id: "employment-starbucks",
    company: "Starbucks",
    role: "Lead UX/UI Designer III, Contract",
    dates: "March 2022 - December 2022",
    disclosureLevel: "confidential-summary",
    deliveryStatus: "exploratory-prototypes",
    summary:
      "Designed exploratory mobile, Unity, and speech-to-text prototypes within an emerging technology team. The work tested spatial learning, retail operations, accessibility, and high-noise communication concepts through research, prototyping, and usability evaluation. These were experiments and prototypes, not production systems. Specific interfaces, pilot materials, participant evidence, metrics, and internal project names are confidential.",
    disclosureNote:
      "Exploratory prototypes, not production deployments. Internal project names, interfaces, pilot materials, participant evidence, metrics, and implementation details are withheld.",
  },
]

export const PROFESSIONAL_EXPERIENCE_BY_ID = new Map(
  PROFESSIONAL_EXPERIENCE_RECORDS.map((record) => [record.id, record])
)

export const PROFESSIONAL_EXPERIENCE_IDS = PROFESSIONAL_EXPERIENCE_RECORDS.map(
  (record) => record.id
)

export const CONFIDENTIAL_PROFESSIONAL_EXPERIENCE_IDS = new Set(
  PROFESSIONAL_EXPERIENCE_RECORDS.filter(
    (record) => record.disclosureLevel === "confidential-summary"
  ).map((record) => record.id)
)

export const APPROVED_PUBLIC_PROFESSIONAL_EXPERIENCE_IDS = new Set(
  PROFESSIONAL_EXPERIENCE_RECORDS.filter(
    (record) => record.disclosureLevel === "approved-public-summary"
  ).map((record) => record.id)
)
