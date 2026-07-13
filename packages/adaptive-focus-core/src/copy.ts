import type { RoleFamily } from "./types"

export const ROLE_FAMILY_LABELS: Record<RoleFamily, string> = {
  "ai-product": "AI product",
  "design-engineering": "Design engineering",
  "product-design": "Product design",
  "product-engineering": "Product engineering",
  "creative-technology": "Creative technology",
  "xr-spatial": "XR and spatial computing",
  operations: "Operations",
  research: "Research",
  leadership: "Leadership",
  unknown: "Unknown",
}

export function formatLabelForSentence(label: string): string {
  if (/^[A-Z]{2,}(?:\b|$)/u.test(label)) return label
  return `${label.charAt(0).toLowerCase()}${label.slice(1)}`
}
