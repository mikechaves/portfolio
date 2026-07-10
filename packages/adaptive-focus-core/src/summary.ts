import type { CoverageGap, ProjectMatch, RequirementCoverage } from "./types"

export function createBriefSummary(
  primary: ProjectMatch[],
  coverage: RequirementCoverage[],
  gaps: CoverageGap[]
): string {
  const strongest = coverage
    .filter((item) => item.coverage === "strong")
    .map((item) => item.label.toLowerCase())
    .slice(0, 3)

  if (!primary.length && !strongest.length) {
    return "I could not confidently interpret that request. Add a role, capability, or workflow."
  }

  const proof = strongest.length
    ? `Mike's strongest portfolio evidence is in ${strongest.join(", ")}.`
    : "The portfolio contains supporting evidence for the interpreted requirements."
  const gapCopy = gaps.length
    ? ` No direct evidence is documented for ${gaps
        .slice(0, 2)
        .map((gap) => gap.label.toLowerCase())
        .join(" or ")}.`
    : ""

  return `${proof}${gapCopy}`
}
