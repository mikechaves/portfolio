"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"

const ProjectsPageClient = dynamic(
  () => import("./ProjectsPageClient").then((module) => module.ProjectsPageClient),
  { ssr: false }
)

const DEFERRED_LOAD_TIMEOUT_MS = 6_500
const HANDOFF_QUERY_KEYS = ["focusPreset", "focusBrief", "focusSession"] as const

export function DeferredProjectsExplorer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (HANDOFF_QUERY_KEYS.some((key) => params.has(key))) {
      setShouldLoad(true)
      return
    }

    const container = containerRef.current
    if (!container || !("IntersectionObserver" in window)) {
      setShouldLoad(true)
      return
    }

    const load = () => setShouldLoad(true)
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        load()
        observer.disconnect()
      },
      { rootMargin: "320px 0px" }
    )
    const timeoutId = window.setTimeout(load, DEFERRED_LOAD_TIMEOUT_MS)
    observer.observe(container)

    return () => {
      observer.disconnect()
      window.clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div ref={containerRef} data-project-explorer>
      {shouldLoad ? (
        <ProjectsPageClient />
      ) : (
        <section
          className="min-h-80 border-y border-white/10 bg-black/35 p-5 sm:p-6"
          aria-label="Interactive project explorer"
          aria-busy="true"
        >
          <p className="project-index-eyebrow">Interactive evidence controls</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">Explore the project archive</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Role matching, evidence filters, and the complete visual archive load as this section
            enters view.
          </p>
        </section>
      )}
    </div>
  )
}
