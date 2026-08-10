"use client"

import { ANALYTICS_PREFERENCES_EVENT } from "@/lib/analytics/config"

export function AnalyticsPreferencesButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(ANALYTICS_PREFERENCES_EVENT))}
      className="text-[0.62rem] uppercase tracking-[0.1em] text-zinc-500 transition-colors hover:text-primary"
    >
      Analytics preferences
    </button>
  )
}
