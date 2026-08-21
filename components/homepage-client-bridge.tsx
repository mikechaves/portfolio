"use client"

import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  trackPortfolioEvent,
  type PortfolioAnalyticsEventMap,
} from "@/lib/portfolio-analytics"

const HERO_VISUAL_SRC = "/visuals/black-sun-signal-grid-static.webp"
const MOBILE_BREAKPOINT_PX = 767
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
  const router = useRouter()
  const [shouldRenderBackground, setShouldRenderBackground] = useState(false)

  useEffect(() => {
    const canvas = document.querySelector<HTMLCanvasElement>(".home-journey-visual")
    const heroImage = new window.Image()
    let disposed = false
    let drawHero: (() => void) | undefined
    let resizeObserver: ResizeObserver | undefined
    let featuredObserver: IntersectionObserver | undefined
    let idleHandle: number | undefined
    let backgroundTimer: number | undefined
    const featuredLoadHandlers = new Map<HTMLImageElement, () => void>()

    if (canvas) {
      const context = canvas.getContext("2d", { alpha: false })

      if (context) {
        heroImage.decoding = "async"

        drawHero = () => {
          if (disposed || !heroImage.naturalWidth || !heroImage.naturalHeight) return
          const bounds = canvas.getBoundingClientRect()
          const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
          const width = Math.max(1, Math.round(bounds.width * pixelRatio))
          const height = Math.max(1, Math.round(bounds.height * pixelRatio))
          if (canvas.width !== width) canvas.width = width
          if (canvas.height !== height) canvas.height = height

          const scale = Math.max(width / heroImage.naturalWidth, height / heroImage.naturalHeight)
          const renderedWidth = heroImage.naturalWidth * scale
          const renderedHeight = heroImage.naturalHeight * scale
          const horizontalPosition = window.innerWidth <= MOBILE_BREAKPOINT_PX ? 0.58 : 1
          const x = (width - renderedWidth) * horizontalPosition
          const y = (height - renderedHeight) * 0.5

          context.fillStyle = "#020504"
          context.fillRect(0, 0, width, height)
          context.drawImage(heroImage, x, y, renderedWidth, renderedHeight)
        }

        resizeObserver = new ResizeObserver(drawHero)
        resizeObserver.observe(canvas)
        heroImage.addEventListener("load", drawHero)
        heroImage.src = HERO_VISUAL_SRC
        if (heroImage.complete) drawHero()
      }
    }

    const desktopQuery = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT_PX + 1}px)`)
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (desktopQuery.matches && !reducedMotionQuery.matches) {
      const idleWindow = window as IdleWindow
      backgroundTimer = window.setTimeout(() => {
        if (idleWindow.requestIdleCallback) {
          idleHandle = idleWindow.requestIdleCallback(() => setShouldRenderBackground(true), {
            timeout: 1_200,
          })
          return
        }
        setShouldRenderBackground(true)
      }, WEBGL_DEFER_MS)
    }

    const featuredImages = Array.from(
      document.querySelectorAll<HTMLImageElement>("img[data-home-featured-src]")
    )
    const loadFeaturedImage = (featuredImage: HTMLImageElement) => {
      const src = featuredImage.dataset.homeFeaturedSrc
      if (!src || featuredImage.hasAttribute("src")) return
      const reveal = () => featuredImage.setAttribute("data-home-featured-loaded", "true")
      featuredLoadHandlers.set(featuredImage, reveal)
      featuredImage.addEventListener("load", reveal)
      featuredImage.src = src
      if (featuredImage.complete) reveal()
    }

    if ("IntersectionObserver" in window) {
      featuredObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const featuredImage = entry.target as HTMLImageElement
          loadFeaturedImage(featuredImage)
          featuredObserver?.unobserve(featuredImage)
        }
      })
      for (const featuredImage of featuredImages) featuredObserver.observe(featuredImage)
    } else {
      for (const featuredImage of featuredImages) loadFeaturedImage(featuredImage)
    }

    const focusForm = document.querySelector<HTMLFormElement>("[data-adaptive-focus-form]")
    const focusInput = document.getElementById("adaptive-focus-role-input") as HTMLTextAreaElement | null
    const focusSubmit = focusForm?.querySelector<HTMLButtonElement>("[data-adaptive-focus-submit]")
    const focusSubmitLabel = focusForm?.querySelector<HTMLElement>(
      "[data-adaptive-focus-submit-label]"
    )
    const focusLoader = focusForm?.querySelector<HTMLElement>("[data-adaptive-focus-loader]")
    const focusCount = focusForm?.querySelector<HTMLElement>("[data-adaptive-focus-count]")
    const focusError = focusForm?.querySelector<HTMLElement>("[data-adaptive-focus-error]")
    const focusPresetButtons = Array.from(
      document.querySelectorAll<HTMLButtonElement>("[data-adaptive-focus-preset]")
    )
    const moreLenses = document.querySelector<HTMLDetailsElement>("[data-adaptive-focus-more]")

    let focusBusy = false
    const setFocusError = (message: string) => {
      if (!focusError) return
      focusError.textContent = message
      focusError.hidden = !message
    }
    const updateFocusInput = () => {
      if (!focusInput) return
      const inputLength = focusInput.value.length
      if (focusCount) {
        focusCount.textContent = `${inputLength.toLocaleString()} / ${focusInput.maxLength.toLocaleString()}`
        focusCount.hidden = inputLength < focusInput.maxLength * 0.8
      }
      if (focusSubmit) focusSubmit.disabled = focusBusy || !focusInput.value.trim()
    }
    const setFocusBusy = (busy: boolean) => {
      focusBusy = busy
      focusForm?.setAttribute("aria-busy", String(busy))
      for (const button of focusPresetButtons) button.disabled = busy
      if (focusLoader) focusLoader.hidden = !busy
      if (focusSubmitLabel) focusSubmitLabel.textContent = busy ? "Opening role fit" : "Analyze role"
      updateFocusInput()
    }
    const handleFocusSubmit = async (event: SubmitEvent) => {
      event.preventDefault()
      const input = focusInput?.value.trim()
      if (!input || focusBusy) return

      setFocusError("")
      setFocusBusy(true)
      trackPortfolioEvent("adaptive_focus_started", {
        entry_point: "home",
        mode: "custom",
      })

      try {
        const { savePendingAdaptiveFocusInput } = await import(
          "@/features/adaptive-focus/handoff"
        )
        savePendingAdaptiveFocusInput(window.sessionStorage, input)
        router.push("/projects?focusSession=1")
      } catch {
        trackPortfolioEvent("adaptive_focus_failed", {
          entry_point: "home",
          mode: "custom",
        })
        setFocusError(
          "Adaptive Focus could not prepare this brief. Try again or choose a preset lens."
        )
        setFocusBusy(false)
      }
    }
    const handleMoreLensesToggle = () => {
      if (!moreLenses?.open) return
      trackPortfolioEvent("adaptive_focus_more_lenses_expanded", { entry_point: "home" })
    }

    focusInput?.addEventListener("input", updateFocusInput)
    focusForm?.addEventListener("submit", handleFocusSubmit)
    moreLenses?.addEventListener("toggle", handleMoreLensesToggle)
    updateFocusInput()

    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      const presetButton = event.target.closest<HTMLButtonElement>(
        "button[data-adaptive-focus-preset]"
      )
      if (presetButton && !presetButton.disabled) {
        const presetId = presetButton.dataset.adaptiveFocusPreset
        if (!presetId) return
        event.preventDefault()
        setFocusBusy(true)
        trackPortfolioEvent("adaptive_focus_started", {
          entry_point: "home",
          mode: "preset",
        })
        router.push(`/projects?focusPreset=${encodeURIComponent(presetId)}`)
        return
      }

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
      if (targetId) {
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
        return
      }

      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        link.hasAttribute("download") ||
        (link.target && link.target !== "_self")
      ) return

      const destination = new URL(link.href, window.location.href)
      if (destination.origin !== window.location.origin) return

      event.preventDefault()
      router.push(`${destination.pathname}${destination.search}${destination.hash}`)
    }

    document.addEventListener("click", handleClick)

    return () => {
      disposed = true
      document.removeEventListener("click", handleClick)
      resizeObserver?.disconnect()
      featuredObserver?.disconnect()
      focusInput?.removeEventListener("input", updateFocusInput)
      focusForm?.removeEventListener("submit", handleFocusSubmit)
      moreLenses?.removeEventListener("toggle", handleMoreLensesToggle)
      if (backgroundTimer !== undefined) window.clearTimeout(backgroundTimer)
      if (idleHandle !== undefined) (window as IdleWindow).cancelIdleCallback?.(idleHandle)
      if (drawHero) heroImage.removeEventListener("load", drawHero)
      for (const [featuredImage, handler] of featuredLoadHandlers) {
        featuredImage.removeEventListener("load", handler)
      }
    }
  }, [router])

  return shouldRenderBackground ? <HeroBackground /> : null
}
