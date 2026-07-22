import { BadgeCheck, LockKeyhole } from "lucide-react"
import { CAPABILITY_LABELS } from "@/features/adaptive-focus"
import {
  PROFESSIONAL_EXPERIENCE_DELIVERY_LABELS,
  type ProfessionalExperienceRecord,
} from "@/features/adaptive-focus/evidence/professional-experience"
import type {
  AdaptiveCapability,
  EvidenceReference,
  MatchLevel,
} from "@/packages/adaptive-focus-core/src"

const MATCH_LABELS: Record<MatchLevel, string> = {
  primary: "Primary proof",
  supporting: "Strong supporting proof",
  adjacent: "Adjacent experience",
}

interface ProfessionalExperienceProofProps {
  record: ProfessionalExperienceRecord
  matchedCapabilities?: AdaptiveCapability[]
  evidence?: EvidenceReference[]
  level?: MatchLevel
  variant?: "brief" | "summary" | "row"
  context?: "role-fit" | "about"
}

export function ProfessionalExperienceProof({
  record,
  matchedCapabilities = [],
  evidence = [],
  level,
  variant = "brief",
  context = "role-fit",
}: ProfessionalExperienceProofProps) {
  const isApproved = record.disclosureLevel === "approved-public-summary"
  const Icon = isApproved ? BadgeCheck : LockKeyhole
  const disclosureLabel = isApproved
    ? "Approved public experience"
    : "Confidential employment evidence"
  const footer = isApproved
    ? "Public description uses employer-approved, non-confidential language. Project-specific materials and internal evaluation details are not public."
    : "Detailed case study withheld. Internal interfaces, data, metrics, and implementation details are not public."
  const statusLabel = PROFESSIONAL_EXPERIENCE_DELIVERY_LABELS[record.deliveryStatus]
  const recordTone = isApproved
    ? "border-emerald-400/35 bg-emerald-400/[0.035]"
    : "border-amber-300/30 bg-amber-300/[0.025]"
  const accentTone = isApproved ? "text-emerald-300" : "text-amber-200"

  if (variant === "row") {
    return (
      <div className="grid gap-2 py-4 sm:grid-cols-[13rem_1fr_auto] sm:items-start">
        <div>
          <p className={`flex items-center gap-1.5 text-xs font-semibold uppercase ${accentTone}`}>
            <Icon size={13} aria-hidden="true" /> {disclosureLabel}
          </p>
          <p className="mt-1 font-semibold text-foreground">{record.company}</p>
          <p className="text-xs text-muted-foreground">{record.role}</p>
        </div>
        <div>
          <p className="text-sm leading-6 text-muted-foreground">
            {evidence[0]?.statement ?? record.summary}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{statusLabel}</p>
        </div>
        {level ? <span className="text-xs text-muted-foreground">{MATCH_LABELS[level]}</span> : null}
      </div>
    )
  }

  return (
    <article className={`border ${recordTone} p-5 sm:p-6`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className={`flex items-center gap-2 text-xs font-semibold uppercase ${accentTone}`}>
            <Icon size={15} aria-hidden="true" /> {disclosureLabel}
          </p>
          <h3 className="mt-2 text-xl font-bold text-foreground">{record.company}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {record.role}{record.dates ? ` / ${record.dates}` : ""}
          </p>
          {isApproved && context === "about" ? (
            <p className="mt-1 text-xs text-emerald-300">Approved public contribution</p>
          ) : null}
        </div>
        <span className="w-fit border border-current/25 px-2.5 py-1 text-xs text-foreground">
          {statusLabel}
        </span>
      </div>

      {level ? <p className={`mt-5 text-xs font-semibold uppercase ${accentTone}`}>{MATCH_LABELS[level]}</p> : null}
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{record.summary}</p>

      {matchedCapabilities.length ? (
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Matched capabilities">
          {matchedCapabilities.map((capability) => (
            <span
              key={capability}
              className="rounded-full border border-white/15 px-2.5 py-1 text-xs text-foreground"
            >
              {CAPABILITY_LABELS[capability]}
            </span>
          ))}
        </div>
      ) : null}

      {evidence.length ? (
        <ul className="mt-4 space-y-3">
          {evidence.slice(0, 3).map((item) => (
            <li
              key={item.evidenceId}
              className="border-l-2 border-current/25 pl-3 text-sm leading-6 text-foreground"
            >
              {item.statement}
              {item.outcome ? (
                <span className="mt-1 block text-xs text-muted-foreground">Outcome: {item.outcome}</span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-muted-foreground">
        {record.disclosureNote}
      </p>
      {variant === "brief" ? (
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{footer}</p>
      ) : null}
    </article>
  )
}
