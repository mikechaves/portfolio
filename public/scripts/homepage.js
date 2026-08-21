(() => {
  const analyticsEventName = "portfolio:analytics-event"
  const pendingKey = "adaptive-focus:pending:v2"

  const track = (name, properties) => {
    try {
      window.dispatchEvent(
        new CustomEvent(analyticsEventName, { detail: { name, properties } })
      )
    } catch {
      // Measurement must never interrupt the homepage journey.
    }
  }

  const featuredImages = Array.from(
    document.querySelectorAll("img[data-home-featured-src]")
  )
  const loadFeaturedImage = (image) => {
    const src = image.dataset.homeFeaturedSrc
    if (!src || image.hasAttribute("src")) return
    image.addEventListener(
      "load",
      () => image.setAttribute("data-home-featured-loaded", "true"),
      { once: true }
    )
    image.src = src
    if (image.complete) image.setAttribute("data-home-featured-loaded", "true")
  }

  const observeFeaturedImages = () => {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          loadFeaturedImage(entry.target)
          observer.unobserve(entry.target)
        }
      })
      featuredImages.forEach((image) => observer.observe(image))
    } else {
      featuredImages.forEach(loadFeaturedImage)
    }
  }
  const scheduleFeaturedImages = () => {
    const developmentRuntimePresent = [...document.scripts].some((script) =>
      script.src.includes("/_next/static/development/")
    )
    if (developmentRuntimePresent) {
      window.setTimeout(observeFeaturedImages, 250)
      return
    }
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(observeFeaturedImages, { timeout: 2000 })
    } else {
      window.setTimeout(observeFeaturedImages, 100)
    }
  }
  if (document.readyState === "complete") scheduleFeaturedImages()
  else window.addEventListener("load", scheduleFeaturedImages, { once: true })

  const focusForm = document.querySelector("[data-adaptive-focus-form]")
  const focusInput = document.getElementById("adaptive-focus-role-input")
  const focusSubmit = focusForm?.querySelector("[data-adaptive-focus-submit]")
  const focusSubmitLabel = focusForm?.querySelector("[data-adaptive-focus-submit-label]")
  const focusLoader = focusForm?.querySelector("[data-adaptive-focus-loader]")
  const focusCount = focusForm?.querySelector("[data-adaptive-focus-count]")
  const focusError = focusForm?.querySelector("[data-adaptive-focus-error]")
  const focusPresetButtons = Array.from(
    document.querySelectorAll("[data-adaptive-focus-preset]")
  )
  const moreLenses = document.querySelector("[data-adaptive-focus-more]")
  let focusBusy = false

  const setFocusError = (message) => {
    if (!focusError) return
    focusError.textContent = message
    focusError.hidden = !message
  }
  const updateFocusInput = () => {
    if (!(focusInput instanceof HTMLTextAreaElement)) return
    const inputLength = focusInput.value.length
    if (focusCount) {
      focusCount.textContent = `${inputLength.toLocaleString()} / ${focusInput.maxLength.toLocaleString()}`
      focusCount.hidden = inputLength < focusInput.maxLength * 0.8
    }
    if (focusSubmit instanceof HTMLButtonElement) {
      focusSubmit.disabled = focusBusy || !focusInput.value.trim()
    }
  }
  const setFocusBusy = (busy) => {
    focusBusy = busy
    focusForm?.setAttribute("aria-busy", String(busy))
    focusPresetButtons.forEach((button) => {
      button.disabled = busy
    })
    if (focusLoader) focusLoader.hidden = !busy
    if (focusSubmitLabel) {
      focusSubmitLabel.textContent = busy ? "Opening role fit" : "Analyze role"
    }
    updateFocusInput()
  }

  focusInput?.addEventListener("input", updateFocusInput)
  focusForm?.addEventListener("submit", (event) => {
    event.preventDefault()
    if (!(focusInput instanceof HTMLTextAreaElement)) return
    const input = focusInput.value.trim()
    if (!input || focusBusy) return

    setFocusError("")
    setFocusBusy(true)
    track("adaptive_focus_started", { entry_point: "home", mode: "custom" })

    try {
      const payload = JSON.stringify({ version: 2, input, createdAt: Date.now() })
      window.sessionStorage.setItem(pendingKey, payload)
      if (window.sessionStorage.getItem(pendingKey) !== payload) {
        throw new Error("Temporary role storage is unavailable")
      }
      window.location.assign("/projects?focusSession=1")
    } catch {
      track("adaptive_focus_failed", { entry_point: "home", mode: "custom" })
      setFocusError(
        "Adaptive Focus could not prepare this brief. Try again or choose a preset lens."
      )
      setFocusBusy(false)
    }
  })
  moreLenses?.addEventListener("toggle", () => {
    if (moreLenses.open) {
      track("adaptive_focus_more_lenses_expanded", { entry_point: "home" })
    }
  })
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return
    const presetButton = event.target.closest("button[data-adaptive-focus-preset]")
    if (presetButton instanceof HTMLButtonElement && !presetButton.disabled) {
      const presetId = presetButton.dataset.adaptiveFocusPreset
      if (!presetId) return
      event.preventDefault()
      setFocusBusy(true)
      track("adaptive_focus_started", { entry_point: "home", mode: "preset" })
      window.location.assign(`/projects?focusPreset=${encodeURIComponent(presetId)}`)
      return
    }

    const link = event.target.closest("a[data-home-target-id]")
    if (!(link instanceof HTMLAnchorElement)) return
    const targetId = link.dataset.homeTargetId
    const target = targetId ? document.getElementById(targetId) : null
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
  })
})()
