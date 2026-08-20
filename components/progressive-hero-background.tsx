"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const WEBGL_DEFER_MS = 6_000

const HeroBackground = dynamic(
  () => import("@/components/hero-background").then((module) => module.HeroBackground),
  { ssr: false, loading: () => null }
)

type IdleWindow = Window &
  typeof globalThis & {
    cancelIdleCallback?: (handle: number) => void
    requestIdleCallback?: (
      callback: () => void,
      options?: { timeout: number }
    ) => number
  }

export function ProgressiveHeroBackground() {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px)")
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    if (!desktopQuery.matches || reducedMotionQuery.matches) return

    const idleWindow = window as IdleWindow
    let idleHandle: number | undefined
    const deferHandle = window.setTimeout(() => {
      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(() => setShouldRender(true), {
          timeout: 1_200,
        })
        return
      }

      setShouldRender(true)
    }, WEBGL_DEFER_MS)

    return () => {
      window.clearTimeout(deferHandle)
      if (idleHandle !== undefined) idleWindow.cancelIdleCallback?.(idleHandle)
    }
  }, [])

  return shouldRender ? <HeroBackground /> : null
}
