"use client"

import { useEffect } from "react"
import {
  trackPortfolioEvent,
  type PortfolioAnalyticsEventMap,
} from "@/lib/portfolio-analytics"

const HERO_VISUAL_SRC = "/visuals/black-sun-signal-grid-static.webp"
const MOBILE_BREAKPOINT_PX = 767

function trackHomepageLink(
  eventName: string | undefined,
  properties: Record<string, unknown>
) {
  switch (eventName) {
    case "homepage_path_selected":
      trackPortfolioEvent(
        eventName,
        properties as PortfolioAnalyticsEventMap["homepage_path_selected"]
      )
      break
    case "portfolio_conversion_clicked":
      trackPortfolioEvent(
        eventName,
        properties as PortfolioAnalyticsEventMap["portfolio_conversion_clicked"]
      )
      break
    case "project_evidence_opened":
      trackPortfolioEvent(
        eventName,
        properties as PortfolioAnalyticsEventMap["project_evidence_opened"]
      )
      break
    case "public_practice_item_opened":
      trackPortfolioEvent(
        eventName,
        properties as PortfolioAnalyticsEventMap["public_practice_item_opened"]
      )
      break
  }
}

export function HomepageClientBridge() {
  useEffect(() => {
    const canvas = document.querySelector<HTMLCanvasElement>(".home-journey-visual")
    const image = new window.Image()
    let disposed = false
    let drawHero: (() => void) | undefined
    let resizeObserver: ResizeObserver | undefined

    if (canvas) {
      const context = canvas.getContext("2d", { alpha: false })

      if (context) {
        image.decoding = "async"

        drawHero = () => {
          if (disposed || !image.naturalWidth || !image.naturalHeight) return
          const bounds = canvas.getBoundingClientRect()
          const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
          const width = Math.max(1, Math.round(bounds.width * pixelRatio))
          const height = Math.max(1, Math.round(bounds.height * pixelRatio))
          if (canvas.width !== width) canvas.width = width
          if (canvas.height !== height) canvas.height = height

          const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
          const renderedWidth = image.naturalWidth * scale
          const renderedHeight = image.naturalHeight * scale
          const horizontalPosition = window.innerWidth <= MOBILE_BREAKPOINT_PX ? 0.58 : 1
          const x = (width - renderedWidth) * horizontalPosition
          const y = (height - renderedHeight) * 0.5

          context.fillStyle = "#020504"
          context.fillRect(0, 0, width, height)
          context.drawImage(image, x, y, renderedWidth, renderedHeight)
        }

        resizeObserver = new ResizeObserver(drawHero)
        resizeObserver.observe(canvas)
        image.addEventListener("load", drawHero)
        image.src = HERO_VISUAL_SRC
        if (image.complete) drawHero()
      }
    }

    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      const link = event.target.closest<HTMLAnchorElement>("a[data-portfolio-event]")
      if (!link) return

      try {
        const properties = JSON.parse(link.dataset.portfolioProperties ?? "{}") as Record<
          string,
          unknown
        >
        trackHomepageLink(link.dataset.portfolioEvent, properties)
      } catch {
        // Analytics must never interrupt homepage navigation.
      }

      const targetId = link.dataset.homeTargetId
      if (!targetId) return
      const target = document.getElementById(targetId)
      if (!target) return

      event.preventDefault()
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" })
      window.history.replaceState(null, "", `#${targetId}`)

      const focusTargetId = link.dataset.homeFocusTargetId
      if (focusTargetId) {
        window.setTimeout(() => {
          document.getElementById(focusTargetId)?.focus({ preventScroll: true })
        }, reducedMotion ? 0 : 260)
      }
    }

    document.addEventListener("click", handleClick)

    return () => {
      disposed = true
      document.removeEventListener("click", handleClick)
      resizeObserver?.disconnect()
      if (drawHero) image.removeEventListener("load", drawHero)
    }
  }, [])

  return null
}
