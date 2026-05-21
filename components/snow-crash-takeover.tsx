"use client"

import { usePathname } from "next/navigation"

export function SnowCrashTakeover() {
  const pathname = usePathname()
  const level = pathname === "/about" ? "high" : pathname === "/projects" ? "medium" : "low"

  return (
    <>
      <div className={`snowcrash-takeover snowcrash-${level}`} aria-hidden="true" />
      <div className={`snowcrash-vignette snowcrash-vignette-${level}`} aria-hidden="true" />
    </>
  )
}
