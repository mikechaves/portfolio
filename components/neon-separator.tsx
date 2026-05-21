"use client"

export function NeonSeparator({ intensity = "low" }: { intensity?: "low" | "medium" | "high" }) {
  return <div className={`neon-separator neon-${intensity}`} aria-hidden="true" />
}
