import type { AdaptiveSignal } from "./types"

export interface CompanySignalMapping {
  signals: AdaptiveSignal[]
  tags: string[]
}

// Keep this mapping small and explicit so it can move to private config later.
export const COMPANY_SIGNAL_MAP: Record<string, CompanySignalMapping> = {
  adobe: { signals: ["creative-tech"], tags: ["design-engineering", "prototyping"] },
  google: { signals: ["ai"], tags: ["product", "data-viz"] },
  apple: { signals: ["design-engineering"], tags: ["product", "creative-tech"] },
  microsoft: { signals: ["product"], tags: ["ai", "design-engineering"] },
  meta: { signals: ["xr"], tags: ["prototyping", "creative-tech"] },
  nvidia: { signals: ["ai"], tags: ["prototyping", "xr"] },
}
